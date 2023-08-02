export const redondeo = (number) => {
  let decimal = number % 1;
  let entero = Math.floor(number);
  let multiplo = Math.floor(entero / 100) * 100;
  if (decimal < 0.5) {
    return parseFloat(multiplo.toFixed(2));
  } else {
    return parseFloat((multiplo + 100).toFixed(2));
  }
};