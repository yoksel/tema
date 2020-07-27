import { colorToHsl, getColorData, hslToFormat } from './helpers/index';

export class PaletteGenerator {
  getData () {
    return this.palette;
  }

  getCode () {
    const list = this.palette.map((item) => {
      return item
        .filter(item => !item.isEdgeValue)
        .map(({ name, color }) => `${name}: ${color};`)
        .join('\n');
    });
    let result = '';

    if (list.length > 0) {
      result = `/*
Initial colors:

${this.inputValue}
*/\n\n`;
      result += list.join('\n\n');
    }

    return result;
  }

  setPalette ({
    inputValue,
    step,
    stepsQuantity,
    finalFormat
  }) {
    this.finalFormat = finalFormat;
    this.inputValue = inputValue;
    const colors = this.getColorsFromString(inputValue);
    this.colorSteps = this.getColorSteps(step, stepsQuantity);
    this.palette = this.createPalette(colors);
    this.hasBlack = false;
    this.hasWhite = false;
  }

  createPalette (colors) {
    if (colors.length === 0) {
      return [];
    }

    let dataList = colors.map(singleColorData => {
      return this.getColorsList(singleColorData);
    });

    dataList = this.addBlackAndWhite(dataList);

    return dataList;
  }

  getColorsList (singleColorData) {
    const {
      name: colorName,
      hsl,
      format,
      color,
      alphaUnits
    } = singleColorData;

    if (format === 'keyword') {
      return [{
        name: colorName,
        hsl,
        color,
        isBase: true,
        isKeyword: true
      }];
    };

    let finalFormat = this.finalFormat;

    if (finalFormat === 'initial') {
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
        const changedHSL = this.hslChangeLight(hsl, stepValue);

        // If there are not black and white
        // they must be added to palette later
        if (changedHSL.l === 0) {
          this.hasBlack = true;
        } else if (changedHSL.l === 100) {
          this.hasWhite = true;
        }

        let isEdgeValue = changedHSL.l < 0 || changedHSL.l > 100;

        if (changedHSL.l < 0) {
          // Create black
          changedHSL.l = 0;
        } else if (changedHSL.l > 100) {
          // Create white
          changedHSL.l = 100;
        }

        if (stepName === 'normal') {
          newName = colorName;
          isBase = true;
          isEdgeValue = false;

          if (format === 'named' && this.finalFormat === 'initial') {
            initialColor = color;
          }
        }

        const formattedColor = hslToFormat({
          hsl: changedHSL,
          format: finalFormat,
          alphaUnits,
          initialColor
        });

        prev.push({
          name: newName,
          hsl: changedHSL,
          color: formattedColor,
          isBase,
          isEdgeValue
        });
        return prev;
      }, []);
  }

  addBlackAndWhite (datalist) {
    if (this.hasBlack && this.hasWhite) {
      return datalist;
    }

    datalist = datalist.map(singleColorDataList => {
      return singleColorDataList.map((item, index) => {
        if (!item.isEdgeValue) {
          return item;
        }

        const isDark = item.name.includes('dark');

        if ((isDark && this.hasBlack) || (!isDark && this.hasWhite)) {
          return item;
        }

        let itemToCompare = singleColorDataList[index - 1];

        if (isDark) {
          itemToCompare = singleColorDataList[index + 1];
        }

        if (!itemToCompare.isEdgeValue) {
          item.isEdgeValue = false;

          if (isDark) {
            this.hasBlack = true;
          } else {
            this.hasWhite = true;
          }
        }

        return item;
      });
    });

    return datalist;
  }

  hslChangeLight (hslObj, changes) {
    let { h, s, l, a } = hslObj;
    l = +(l + changes).toFixed(1);

    return { h, s, l, a };
  }

  getColorsFromString (inputValue) {
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

  getColorSteps (step, stepsQuantity) {
    const steps = {
      darkest: -step * 3,
      darker: -step * 2,
      dark: -step,
      normal: 0,
      light: +step,
      lighter: step * 2,
      lightest: step * 3
    };

    if (stepsQuantity === 3) {
      return steps;
    }

    const stepsList = Object.entries(steps);
    // One central cell + added variations
    const sliceSize = stepsQuantity * 2 + 1;
    const sliceOffset = (stepsList.length - sliceSize) / 2;
    const slice = stepsList.splice(sliceOffset, sliceSize);

    return Object.fromEntries(slice);
  }
}
