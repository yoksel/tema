export function hslToString ({ color, alphaUnits }) {
  const { h, s, l, a } = color;
  const colorsList = [h, `${s}%`, `${l}%`];
  let format = 'hsl';

  if (a) {
    format = 'hsla';
    colorsList.push(`${a}${alphaUnits}`);
  }

  return `${format}(${colorsList.join(', ')})`;
}
