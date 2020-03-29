import { colorToHsl, hslToString, getColorData } from './helpers/index.js';

const step = 7;
const colorsSteps = {
  darkest: -step * 3,
  darker: -step * 2,
  dark: -step,
  normal: 0,
  light: step,
  lighter: step * 2,
  lightest: step * 3,
};

export class PaletteGenerator {
  getData() {
    return this.palette;
  }

  getCode() {
    const list = this.palette.map((item) => {
      return item
        .map(({name, color}) => `${name}: ${color};`)
        .join('\n')
    });
    const result = list.join('\n\n');
    return result;
  }

  setPalette(inputValue) {
    const colors = this.getColorsFromString(inputValue);
    this.palette = this.createPalette(colors);
  }

  createPalette(colors) {
    const dataList = colors.map(singleColorData => {
      return this.getColorsList(singleColorData)
    });

    return dataList;
  }

  getColorsList(singleColorData) {
    let {
      name: colorName,
      hsl,
      format,
      color,
      alphaUnits
    } = singleColorData;

    if(format === 'keyword') {
      return [{
        name: colorName,
        color,
        isBase: true,
        isKeyword: true
      }]
    };
    return Object.entries(colorsSteps)
      .reduce((prev, [stepName, stepValue]) => {
        let color = this.hslChangeLight(hsl, stepValue);
        color = hslToString({color, alphaUnits});

        let newName = `${colorName}-${stepName}`;
        let isBase = false;

        if(stepName === 'normal') {
          newName = colorName;
          isBase = true;
        }

        prev.push({
          name: newName,
          color,
          isBase
        });
        return prev;
      }, []);
  }

  hslChangeLight(hslObj, changes) {
    let {h,s,l, a} = hslObj;
    l = +(l + changes).toFixed(1);

    return {h, s, l, a};
  }

  getColorsFromString(inputValue) {
    return inputValue
      .split('\n')
      .filter(item => item.trim())
      .map(item => {
        const str = item.trim().replace(';', '');
        let [name, color] = str.split(':');
        color = color.trim();
        const data = getColorData(color);
        const {alphaUnits} = data;

        const hsl = colorToHsl({
          color,
          ...data
        });

        return {
          name: name.trim(),
          hsl,
          color,
          ...data
        };
    });
  }
}
