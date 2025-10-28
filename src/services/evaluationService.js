import { getFortunes, FORTUNE_DEFINITIONS } from '../constants/fortunes.js';
import { calculateNameStrokes } from '../utils/strokes.js';
import { modularPow, SMALL_PRIMES } from '../utils/primes.js';

const MODULUS = 251n;

function normalizeSeedPart(part) {
  if (part === undefined || part === null) {
    return 0n;
  }
  if (typeof part === 'bigint') {
    return part % MODULUS;
  }
  if (typeof part === 'number') {
    return BigInt(part % Number(MODULUS));
  }
  if (typeof part === 'string') {
    let acc = 0n;
    for (const char of part) {
      acc = (acc * 131n + BigInt(char.codePointAt(0))) % MODULUS;
    }
    return acc;
  }
  return normalizeSeedPart(String(part));
}

function selectFortune(value, ...salts) {
  const base = modularPow(SMALL_PRIMES[0], BigInt(value), MODULUS);
  const salted = salts.reduce((accumulator, salt, index) => {
    const prime = SMALL_PRIMES[(index + 1) % SMALL_PRIMES.length];
    const hashed = modularPow(prime, normalizeSeedPart(salt), MODULUS);
    return (accumulator + hashed) % MODULUS;
  }, base);
  return FORTUNE_DEFINITIONS[Number(salted % BigInt(FORTUNE_DEFINITIONS.length))];
}

function enrichMetrics(metrics, scopeLabel) {
  const breakdown = metrics.breakdown.map((item, index) => ({
    ...item,
    fortune: selectFortune(item.strokes, scopeLabel, index, item.char)
  }));
  return {
    ...metrics,
    breakdown,
    fortune: selectFortune(metrics.total, scopeLabel, 'total')
  };
}

export function createEvaluationService(options = {}) {
  const { strokeOptions } = options;

  async function evaluate({ surname, given }) {
    const surnameMetrics = await calculateNameStrokes(surname, strokeOptions);
    const givenMetrics = await calculateNameStrokes(given, strokeOptions);
    const total = surnameMetrics.total + givenMetrics.total;

    const evaluatedSurname = enrichMetrics(surnameMetrics, 'surname');
    const evaluatedGiven = enrichMetrics(givenMetrics, 'given');

    const overallFortune = selectFortune(total, 'full');

    return {
      surnameMetrics: evaluatedSurname,
      givenMetrics: evaluatedGiven,
      total,
      fortunes: {
        surname: evaluatedSurname.fortune,
        given: evaluatedGiven.fortune,
        full: overallFortune
      }
    };
  }

  return {
    evaluate,
    fortunes: getFortunes()
  };
}
