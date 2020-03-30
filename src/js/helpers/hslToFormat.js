import { hslToString } from './index.js';

// https://css-tricks.com/converting-color-spaces-in-javascript/

function hslToFormat ({ hsl, format, alphaUnits, initialColor }) {
  if (initialColor) {
    return initialColor;
  }

  if (format.includes('hsl')) {
    return hslToString({
      color: hsl,
      alphaUnits
    });
  }

  if (format.includes('hex')) {
    return HSLToHexString({ hsl, alphaUnits });
  }

  return HSLToRGBString({ hsl, alphaUnits });
}

export default hslToFormat;

function HSLToRGBString ({ hsl, alphaUnits }) {
  let { h, s, l, a } = hsl;
  let format = 'rgb';

  // Must be fractions of 1
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0;
      let g = 0;
      let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  let finalColor = `${r}, ${g}, ${b}`;

  if (a) {
    format = 'rgba';
    finalColor += `, ${a}${alphaUnits}`;
  }

  return `${format}(${finalColor})`;
}

function HSLToHexString ({ hsl, alphaUnits }) {
  let { h, s, l, a } = hsl;
  s /= 100;
  l /= 100;

  if (a === undefined) {
    a = '';
  }

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  if (r.length === 1) { r = '0' + r; }
  if (g.length === 1) { g = '0' + g; }
  if (b.length === 1) { b = '0' + b; }

  if (a) {
    if (alphaUnits) {
      a /= 100;
    }

    a = Math.round(a * 255).toString(16);

    if (a.length === 1) {
      a = '0' + a;
    }
  }

  return '#' + r + g + b + a;
}
