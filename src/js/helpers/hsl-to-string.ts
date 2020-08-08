import { IcolorData } from '../ts-interfaces/interfaces';

export const hslToString = ({ hsla, alphaUnits, format = 'hsl' }: IcolorData): string => {
  const { h, s, l, a } = hsla;
  const colorsList: string[] = [`${h}`, `${s}%`, `${l}%`];

  if (a) {
    format = 'hsla';
    colorsList.push(`${a}${alphaUnits}`);
  }

  return `${format}(${colorsList.join(', ')})`;
};
