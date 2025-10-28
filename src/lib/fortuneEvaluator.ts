import { fortuneLevels, type FortuneLevel } from './fortuneLevels';
import { modPow } from './math';

const fortunePrimes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149];
const fortuneModulus = 347;

const scopeSeeds: Record<'character' | 'surname' | 'given' | 'full', number> = {
  character: 5,
  surname: 7,
  given: 11,
  full: 13,
};

const determineIndex = (strokes: number, seed: number): number => {
  const prime = fortunePrimes[(strokes + seed) % fortunePrimes.length];
  const exponent = (seed % 5) + 2 + (strokes % 3);
  const remainder = modPow(prime, exponent, fortuneModulus);
  const score = (remainder + strokes * seed) % fortuneLevels.length;
  return score;
};

export const evaluateFortune = (
  strokes: number,
  scope: keyof typeof scopeSeeds,
): FortuneLevel => fortuneLevels[determineIndex(strokes, scopeSeeds[scope])];
