import { IHSLA, IRGBA } from '../ts-interfaces/interfaces';
import { named } from '../data/named';

interface IcolorToHsla {
  color: string,
  format: string
}

export const colorToHsla = ({ color, format }: IcolorToHsla): IHSLA | string => {
  color = color.toLowerCase();

  if (format === 'keyword') {
    return color;
  }
  if (format.includes('hsl')) {
    return hslaFromString(color);
  }
  if (format.includes('rgb')) {
    return RGBToHSL(rgbaFromString(color));
  }
  if (format === 'named') {
    return RGBToHSL(rgbaFromString(<string>named[color]));
  }

  return RGBToHSL(hexToRGB(color));
};

const hslaFromString = (str: string): IHSLA => {
  const colorMatch = <string[]>str.match(/\(((.*))\)/);
  const colorStr: string = colorMatch[1];
  const colorParts: string[] = colorStr.split(',');

  const colorPartsAsNums: number[] = colorParts.map(item => {
    return +item.trim().replace('%', '');
  });
  const [h, s, l, a] = colorPartsAsNums;

  return { h, s, l, a };
};

const rgbaFromString = (str: string): IRGBA => {
  const colorMatch = <string[]>str.match(/\(((.*))\)/);
  const colorStr: string = colorMatch[1];
  const colorParts: string[] = colorStr.split(',');

  const colorPartsAsNums: number[] = colorParts.map(item => {
    return +item.trim().replace('%', '');
  });
  const [r, g, b, a] = colorPartsAsNums;

  return { r, g, b, a };
};

// ---------------------------------------------
// https://css-tricks.com/converting-color-spaces-in-javascript/

const hexToRGB = (hex: string): IRGBA => {
  let r = '';
  let g = '';
  let b = '';
  let a = '';

  // 3 digits
  if (hex.length < 7) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];

    if (hex[4]) {
      a = '0x' + hex[4] + hex[4];
    }

  // 6 digits
  } else {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];

    if (hex[7]) {
      a = '0x' + hex[7] + hex[8];
    }
  }

  if (a) {
    a = (parseInt(a, 16) / 255).toFixed(1);
  }

  return {
    r: +r,
    g: +g,
    b: +b,
    a: +a
  };
};

const RGBToHSL = ({ r, g, b, a }: IRGBA): IHSLA => {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    // Red is max
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    // Green is max
    h = (b - r) / delta + 2;
  } else {
    // Blue is max
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) { h += 360; }

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, a };
};
