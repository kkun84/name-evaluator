import { modPow } from './math';

const strokePrimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
];

const strokeModulus = 73;

export const computeStrokeCount = (character: string): number => {
  const codePoint = character.codePointAt(0);
  if (!codePoint) {
    return 0;
  }
  const prime = strokePrimes[codePoint % strokePrimes.length];
  const exponent = (codePoint % 5) + 2;
  const remainder = modPow(prime + (codePoint % prime), exponent, strokeModulus);
  return ((remainder + codePoint) % 28) + 1;
};

export const computeTotalStrokes = (text: string): number =>
  Array.from(text).reduce((total, character) => total + computeStrokeCount(character), 0);
