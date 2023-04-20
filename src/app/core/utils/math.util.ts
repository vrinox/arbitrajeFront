export const roundToPrecision = (number: number, decimalPlaces: number) => {
  let multiplier = 10 ** decimalPlaces;
  return Math.round(number * multiplier) / multiplier;
}