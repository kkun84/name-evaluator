import { defaultStrokeResolver } from '../utils/strokes.js';
import { modularPow, SMALL_PRIMES } from '../utils/primes.js';

const FORTUNES = [
  { key: 'excellent', label: '大吉', tone: 'success', accent: '#d9333f' },
  { key: 'great', label: '中吉', tone: 'brightness', accent: '#ef8f2b' },
  { key: 'good', label: '小吉', tone: 'growth', accent: '#f6c445' },
  { key: 'fair', label: '吉', tone: 'harmony', accent: '#4caf50' },
  { key: 'warning', label: '凶', tone: 'caution', accent: '#3f51b5' },
  { key: 'poor', label: '大凶', tone: 'resilience', accent: '#5d4037' }
];

const MODULUS = 251n;

export function createEvaluationService({ strokeResolver = defaultStrokeResolver } = {}) {
  async function evaluate({ surname, given }) {
    const surnameMetrics = await strokeResolver.calculateNameStrokes(surname);
    const givenMetrics = await strokeResolver.calculateNameStrokes(given);
    const total = surnameMetrics.total + givenMetrics.total;

    const powerA = modularPow(SMALL_PRIMES[0], BigInt(surnameMetrics.total), MODULUS);
    const powerB = modularPow(SMALL_PRIMES[1], BigInt(givenMetrics.total), MODULUS);
    const powerC = modularPow(SMALL_PRIMES[2], BigInt(total), MODULUS);
    const composite = (
      powerA * SMALL_PRIMES[3] +
      powerB * SMALL_PRIMES[4] +
      powerC * SMALL_PRIMES[5]
    ) % MODULUS;
    const fortuneIndex = Number(composite % BigInt(FORTUNES.length));

    return {
      surnameMetrics,
      givenMetrics,
      total,
      fortune: FORTUNES[fortuneIndex]
    };
  }

  return {
    evaluate,
    fortunes: [...FORTUNES]
  };
}
