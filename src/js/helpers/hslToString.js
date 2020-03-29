function hslToString({color, alphaUnits}) {
  let {h, s, l, a} = color;
  const colorsList = [h, `${s}%`, `${l}%`];
  let format = 'hsl';

  if(a) {
    format = 'hsla';
    colorsList.push(`${a}${alphaUnits}`);
  }

  return `${format}(${colorsList.join(', ')})`;
}

export default hslToString;
