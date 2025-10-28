import { describe, expect, it } from 'vitest';
import { analyzeName } from '../analyzeName';
import { evaluateFortune } from '../fortuneEvaluator';
import { fortuneLevels } from '../fortuneLevels';
import { modPow } from '../math';
import { computeStrokeCount } from '../strokeCalculator';

describe('mathematical helpers', () => {
  it('computes modular exponentiation correctly', () => {
    expect(modPow(2, 10, 17)).toBe(4);
    expect(modPow(5, 0, 13)).toBe(1);
    expect(modPow(123, 45, 97)).toBe(modPow(123 % 97, 45, 97));
  });
});

describe('stroke calculations', () => {
  it('returns a positive stroke count for characters', () => {
    expect(computeStrokeCount('山')).toBeGreaterThan(0);
    expect(computeStrokeCount('田')).toBeGreaterThan(0);
  });

  it('is deterministic for identical characters', () => {
    expect(computeStrokeCount('花')).toBe(computeStrokeCount('花'));
  });
});

describe('fortune evaluation', () => {
  it('maps to one of the configured levels', () => {
    const result = evaluateFortune(24, 'full');
    expect(fortuneLevels).toContain(result);
  });

  it('produces identical results for identical stroke counts', () => {
    const sample = evaluateFortune(18, 'surname');
    expect(evaluateFortune(18, 'surname')).toBe(sample);
  });
});

describe('name analysis', () => {
  it('returns consistent results for the same name', () => {
    const first = analyzeName('山田', '花子');
    const second = analyzeName('山田', '花子');
    expect(second).toEqual(first);
  });

  it('distinguishes between different names', () => {
    const base = analyzeName('山田', '花子');
    const altered = analyzeName('佐藤', '太郎');
    expect(altered.full.fortune).not.toEqual(base.full.fortune);
  });
});
