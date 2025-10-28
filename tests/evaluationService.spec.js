import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEvaluationService } from '../src/services/evaluationService.js';
import { clearStrokeCache } from '../src/utils/strokeLookup.js';

const STUB_STROKES = {
  山: 3,
  田: 5,
  太: 4,
  郎: 9,
  花: 7,
  子: 3,
  佐: 7,
  藤: 18,
  光: 6
};

function createFetchStub() {
  return vi.fn(async (url) => {
    const decodedChar = decodeURIComponent(url.split('/').pop());
    if (!(decodedChar in STUB_STROKES)) {
      return {
        ok: false,
        status: 404,
        json: async () => ({})
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ stroke_count: STUB_STROKES[decodedChar] })
    };
  });
}

describe('createEvaluationService', () => {
  let fetchStub;
  let service;

  beforeEach(() => {
    fetchStub = createFetchStub();
    service = createEvaluationService({ strokeOptions: { fetchImpl: fetchStub } });
    clearStrokeCache();
  });

  it('returns deterministic results for the same input', async () => {
    const first = await service.evaluate({ surname: '山田', given: '太郎' });
    const second = await service.evaluate({ surname: '山田', given: '太郎' });
    expect(second.fortunes.full.label).toEqual(first.fortunes.full.label);
    expect(second.total).toBe(first.total);
    expect(fetchStub).toHaveBeenCalled();
  });

  it('differentiates inputs with different characters', async () => {
    const first = await service.evaluate({ surname: '山田', given: '太郎' });
    const second = await service.evaluate({ surname: '山田', given: '花子' });
    expect(second.total).not.toBe(first.total);
  });

  it('calculates detailed stroke breakdowns', async () => {
    const result = await service.evaluate({ surname: '佐藤', given: '光' });
    expect(result.surnameMetrics.breakdown.length).toBe(2);
    expect(result.givenMetrics.breakdown.length).toBe(1);
    expect(result.surnameMetrics.fortune).toBeDefined();
    expect(result.givenMetrics.breakdown[0].fortune).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
  });

  it('exposes the configured fortunes', () => {
    expect(service.fortunes).toHaveLength(6);
    const labels = service.fortunes.map((fortune) => fortune.label);
    expect(labels).toContain('大吉');
    expect(labels).toContain('大凶');
  });
});
