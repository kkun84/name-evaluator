export const SMALL_PRIMES = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n
];

export function modularPow(base, exponent, modulus) {
  if (modulus === 1n) {
    return 0n;
  }
  let result = 1n;
  let b = base % modulus;
  let e = exponent;
  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % modulus;
    }
    e = e / 2n;
    b = (b * b) % modulus;
  }
  return result;
}
