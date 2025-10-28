import { calculateNameStrokes } from '../utils/strokes.js';
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

function deriveFortuneIndex(strokes, seed) {
  const basePrime = SMALL_PRIMES[seed % SMALL_PRIMES.length];
  const mixPrime = SMALL_PRIMES[(seed * 3 + 5) % SMALL_PRIMES.length];
  const exponent = BigInt(strokes + seed + 1);
  const baseValue = modularPow(basePrime, exponent, MODULUS);
  const weighted = (baseValue * mixPrime + BigInt(strokes + 7)) % MODULUS;
  return Number(weighted % BigInt(FORTUNES.length));
}

function selectFortune(strokes, seed) {
  return FORTUNES[deriveFortuneIndex(strokes, seed)];
}

function annotateBreakdown(breakdown, seedOffset) {
  return breakdown.map((entry, index) => ({
    ...entry,
    fortune: selectFortune(entry.strokes, seedOffset + index)
  }));
}

export function createEvaluationService() {
  function evaluate({ surname, given }) {
    const surnameRaw = calculateNameStrokes(surname);
    const givenRaw = calculateNameStrokes(given);

    const surnameMetrics = {
      ...surnameRaw,
      breakdown: annotateBreakdown(surnameRaw.breakdown, 11),
      fortune: selectFortune(surnameRaw.total, 97)
    };

    const givenMetrics = {
      ...givenRaw,
      breakdown: annotateBreakdown(givenRaw.breakdown, 41),
      fortune: selectFortune(givenRaw.total, 131)
    };

    const total = surnameMetrics.total + givenMetrics.total;
    const totalFortune = selectFortune(total, 173);

    return {
      surname: surnameMetrics,
      given: givenMetrics,
      overall: {
        total,
        fortune: totalFortune
      }
    };
  }

  return {
    evaluate,
    fortunes: [...FORTUNES]
  };
}
