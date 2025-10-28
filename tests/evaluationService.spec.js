import { describe, expect, it } from 'vitest';
import { createEvaluationService } from '../src/services/evaluationService.js';

const service = createEvaluationService();

describe('createEvaluationService', () => {
  it('returns deterministic results for the same input', () => {
    const first = service.evaluate({ surname: '山田', given: '太郎' });
    const second = service.evaluate({ surname: '山田', given: '太郎' });
    expect(second.overall.fortune.label).toEqual(first.overall.fortune.label);
    expect(second.overall.total).toBe(first.overall.total);
  });

  it('differentiates inputs with different characters', () => {
    const first = service.evaluate({ surname: '山田', given: '太郎' });
    const second = service.evaluate({ surname: '山田', given: '花子' });
    expect(second.overall.total).not.toBe(first.overall.total);
  });

  it('calculates detailed stroke breakdowns', () => {
    const result = service.evaluate({ surname: '佐藤', given: '光' });
    expect(result.surname.breakdown.length).toBe(2);
    expect(result.given.breakdown.length).toBe(1);
    expect(result.overall.total).toBeGreaterThan(0);
    expect(result.surname.breakdown[0].fortune).toHaveProperty('label');
    expect(result.given.fortune).toHaveProperty('label');
    expect(result.overall.fortune).toHaveProperty('tone');
  });

  it('exposes the configured fortunes', () => {
    expect(service.fortunes).toHaveLength(6);
    const labels = service.fortunes.map((fortune) => fortune.label);
    expect(labels).toContain('大吉');
    expect(labels).toContain('大凶');
  });
});
