import { IcolorDataMin } from '../ts-interfaces/interfaces';
import { named } from '../data/named';

export const getColorData = (color: string): IcolorDataMin => {
  const format = getColorFormat(color);
  const alphaUnits = getAlphaUnits({
    color,
    format
  });

  return {
    format,
    alphaUnits
  };
};

const getColorFormat = (color: string): string => {
  color = color
    .toLowerCase()
    .trim();

  if (named[color]) {
    return 'named';
  }
  if (color.startsWith('hsla')) {
    return 'hsla';
  }
  if (color.startsWith('hsl')) {
    return 'hsl';
  }
  if (color.startsWith('rgba')) {
    return 'rgba';
  }
  if (color.startsWith('rgb')) {
    return 'rgb';
  }
  if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
    return 'hex';
  }
  if (color.startsWith('#') && (color.length === 5 || color.length === 9)) {
    return 'hexa';
  }
  if (color.includes('currentcolor') || color.includes('transparent')) {
    return 'keyword';
  }

  return 'Unknown color format';
};

interface IgetAlphaUnits {
  color: string,
  format: string
}

const getAlphaUnits = ({ color, format }: IgetAlphaUnits): string => {
  if (!['hsla', 'rgba'].includes(format)) {
    return '';
  }

  const colorPartsMatch = <string[]>color.match(/\((.*)\)/);
  const colorPartsStr: string = colorPartsMatch[1];
  const colorParts = colorPartsStr
    .split(',')
    .map(item => item.trim());

  const alpha = colorParts[3];

  if (alpha.includes('%')) {
    return '%';
  }

  return '';
};
