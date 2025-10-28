import { describe, expect, it } from 'vitest';
import { createEvaluationService } from '../src/services/evaluationService.js';

const service = createEvaluationService();

describe('createEvaluationService', () => {
  it('returns deterministic results for the same input', () => {
    const first = service.evaluate({ surname: '山田', given: '太郎' });
    const second = service.evaluate({ surname: '山田', given: '太郎' });
    expect(second.fortune.label).toEqual(first.fortune.label);
    expect(second.total).toBe(first.total);
    expect(second.totalFortune.label).toEqual(first.totalFortune.label);
  });

  it('differentiates inputs with different characters', () => {
    const first = service.evaluate({ surname: '山田', given: '太郎' });
    const second = service.evaluate({ surname: '山田', given: '花子' });
    expect(second.total).not.toBe(first.total);
  });

  it('calculates detailed stroke breakdowns', () => {
    const result = service.evaluate({ surname: '佐藤', given: '光' });
    expect(result.surnameMetrics.breakdown.length).toBe(2);
    expect(result.givenMetrics.breakdown.length).toBe(1);
    expect(result.total).toBeGreaterThan(0);
    expect(result.surnameMetrics.breakdown[0].fortune).toHaveProperty('label');
    expect(result.givenMetrics.fortune).toHaveProperty('label');
    expect(result.totalFortune).toHaveProperty('tone');
  });

  it('exposes the configured fortunes', () => {
    expect(service.fortunes).toHaveLength(6);
    const labels = service.fortunes.map((fortune) => fortune.label);
    expect(labels).toContain('大吉');
    expect(labels).toContain('大凶');
  });
});
