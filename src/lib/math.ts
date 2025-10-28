export const modPow = (base: number, exponent: number, modulus: number): number => {
  if (modulus === 1) {
    return 0;
  }
  let result = 1;
  let b = base % modulus;
  let e = exponent;
  while (e > 0) {
    if (e % 2 === 1) {
      result = (result * b) % modulus;
    }
    e = Math.floor(e / 2);
    b = (b * b) % modulus;
  }
  return result;
};
