import { named } from '../data/named.js';

function getColorData(color) {
  const format = getColorFormat(color);
  const alphaUnits = getAlphaUnits({
    color,
    format
  });

  return {
    format,
    alphaUnits
  };
}

export default getColorData;

function getColorFormat(color) {
  color = color
    .toLowerCase()
    .trim();

  if(named[color]) {
    return 'named';
  }
  if(color.startsWith('hsla')) {
    return 'hsla';
  }
  if(color.startsWith('hsl')) {
    return 'hsl';
  }
  if(color.startsWith('rgba')) {
    return 'rgba';
  }
  if(color.startsWith('rgb')) {
    return 'rgb';
  }
  if(color.startsWith('#') && color.length === 7) {
    return 'hex';
  }
  if(color.startsWith('#') && color.length === 9) {
    return 'hexa';
  }
  if(color.includes('currentcolor') || color.includes('transparent')) {
    return 'keyword';
  }

  return 'Unknown color format';
}

function getAlphaUnits({color, format}) {
  if(!['hsla', 'rgba'].includes(format)) {
    return '';
  }

  const colorPartsStr = color.match(/\((.*)\)/)[1];
  const colorParts = colorPartsStr
    .split(',')
    .map(item => item.trim());

  const alpha = colorParts[3];

  if(alpha.includes('%')) {
    return '%'
  }

  return '';
}

