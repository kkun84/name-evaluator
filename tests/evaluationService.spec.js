import { describe, expect, it, vi } from 'vitest';
import { createEvaluationService } from '../src/services/evaluationService.js';
import { createStrokeResolver } from '../src/utils/strokes.js';

function createMockFetch() {
  const strokeMap = new Map([
    ['山', 3],
    ['田', 5],
    ['太', 4],
    ['郎', 9],
    ['花', 7],
    ['子', 3],
    ['佐', 7],
    ['藤', 18],
    ['光', 6]
  ]);

  return vi.fn(async (url) => {
    const char = decodeURIComponent(url.split('/').pop() || '');
    if (!strokeMap.has(char)) {
      return {
        ok: false,
        status: 404,
        json: async () => ({})
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ stroke_count: strokeMap.get(char) })
    };
  });
}

const mockFetch = createMockFetch();
const strokeResolver = createStrokeResolver({ fetchImplementation: mockFetch });
const service = createEvaluationService({ strokeResolver });

describe('createEvaluationService', () => {
  it('returns deterministic results for the same input', async () => {
    const first = await service.evaluate({ surname: '山田', given: '太郎' });
    const second = await service.evaluate({ surname: '山田', given: '太郎' });
    expect(second.fortune.label).toEqual(first.fortune.label);
    expect(second.total).toBe(first.total);
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
    expect(result.total).toBeGreaterThan(0);
  });

  it('exposes the configured fortunes', () => {
    expect(service.fortunes).toHaveLength(6);
    const labels = service.fortunes.map((fortune) => fortune.label);
    expect(labels).toContain('大吉');
    expect(labels).toContain('大凶');
  });

  it('requests stroke counts through the resolver', async () => {
    await service.evaluate({ surname: '山田', given: '太郎' });
    expect(mockFetch).toHaveBeenCalled();
  });
});
