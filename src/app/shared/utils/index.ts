export function roundUp(number, decimalPlaces) {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.ceil(number * multiplier) / multiplier;
}
