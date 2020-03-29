import { colorToHsl, hslToString, getColorData, hslToFormat } from './helpers/index.js';

export class PaletteGenerator {
  getData() {
    return this.palette;
  }

  getCode() {
    const list = this.palette.map((item) => {
      return item
        .filter(item => !item.isEdgeValue)
        .map(({name, color}) => `${name}: ${color};`)
        .join('\n')
    });
    const result = list.join('\n\n');
    return result;
  }

  setPalette({
    inputValue,
    step,
    finalFormat
  }) {
    this.finalFormat = finalFormat;
    const colors = this.getColorsFromString(inputValue);
    this.colorSteps = this.getColorSteps(step);
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

    let finalFormat = this.finalFormat;

    if(finalFormat === 'initial') {
      finalFormat = format;

      if (format === 'named') {
        finalFormat = 'hsl';
      }
    }

    return Object.entries(this.colorSteps)
      .reduce((prev, [stepName, stepValue]) => {
        let newName = `${colorName}-${stepName}`;
        let isBase = false;
        let initialColor = '';
        let changedHSL = this.hslChangeLight(hsl, stepValue);

        let isEdgeValue = changedHSL.l < 0 || changedHSL.l > 100;

        if(stepName === 'normal') {
          newName = colorName;
          isBase = true;
          isEdgeValue = false;

          if (format === 'named') {
            initialColor = color;
          }
        }

        let formattedColor = hslToFormat({
          hsl: changedHSL,
          format: finalFormat,
          alphaUnits,
          initialColor
        });

        prev.push({
          name: newName,
          color: formattedColor,
          isBase,
          isEdgeValue
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
      .filter(item => {
        // Trim spaces, ignore comments
        return item.trim().includes(':');
      })
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

  getColorSteps(step) {
    return {
      darkest: -step * 3,
      darker: -step * 2,
      dark: -step,
      normal: 0,
      light: +step,
      lighter: step * 2,
      lightest: step * 3,
    }
  }
}
