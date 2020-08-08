import { IcolorData, IcolorDataFull, IHSLA, IsetPaletteData } from './ts-interfaces/interfaces';

import { getColorsFromString, hslToFormat } from './helpers/index';

export class PaletteGenerator {
  _finalFormat: string;
  _inputValue: string;
  _colorSteps = {};
  _palette: IcolorDataFull[][];
  _hasBlack: boolean;
  _hasWhite: boolean;

  getData (): IcolorDataFull[][] {
    return this._palette;
  }

  getCode (): string {
    const list = this._palette.map((item) => {
      return (<IcolorDataFull[]>item)
        .filter(item => !item.isEdgeValue)
        .map(({ colorName, color }) => `${colorName}: ${color};`)
        .join('\n');
    });

    let result = '';

    if (list.length > 0) {
      result = `/*
Initial colors:

${this._inputValue}
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
  }: IsetPaletteData): void {
    this._finalFormat = finalFormat;
    this._inputValue = inputValue;
    const colors: IcolorDataFull[] = getColorsFromString(this._inputValue);
    this._colorSteps = this._getColorSteps(step, stepsQuantity);
    this._palette = this.createPalette(colors);
    this._hasBlack = false;
    this._hasWhite = false;
  }

  createPalette (colors: IcolorDataFull[]): IcolorDataFull[][] {
    if (!colors.length) {
      return [];
    }

    let dataList: IcolorDataFull[][] = colors
      .map((singleColorData) => {
      return this._getColorsList(singleColorData);
    });

    dataList = this._addBlackAndWhite(dataList);

    return dataList;
  }

  _getColorsList (singleColorData: IcolorDataFull): IcolorDataFull[] {
    const {
      colorName,
      hsla,
      format,
      color,
      alphaUnits
    } = singleColorData;

    if (format === 'keyword') {
      return [{
        colorName,
        hsla,
        color,
        isBase: true,
        isKeyword: true
      }];
    }

    return this._addTints({ color, colorName, hsla, format, alphaUnits });
  }

  _addTints ({ color, colorName, hsla, format, alphaUnits }: IcolorDataFull): IcolorDataFull[] {
    let finalFormat: string | undefined = this._finalFormat;

    if (finalFormat === 'initial') {
      finalFormat = format;

      if (format === 'named') {
        finalFormat = 'hsl';
      }
    }

    return Object.entries(this._colorSteps)
      .reduce((prev: IcolorDataFull[], item) => {
        const [stepName, stepValue] = item;
        let newName = `${colorName}-${stepName}`;
        let isBase = false;
        let initialColor = '';
        const changedHSLA = this._hslChangeLight(hsla, <number>stepValue);

        // If there are not black and white
        // they must be added to palette later
        if (changedHSLA.l === 0) {
          this._hasBlack = true;
        } else if (changedHSLA.l === 100) {
          this._hasWhite = true;
        }

        let isEdgeValue = changedHSLA.l < 0 || changedHSLA.l > 100;

        if (changedHSLA.l < 0) {
          // Create black
          changedHSLA.l = 0;
        } else if (changedHSLA.l > 100) {
          // Create white
          changedHSLA.l = 100;
        }

        if (stepName === 'normal') {
          newName = colorName;
          isBase = true;
          isEdgeValue = false;

          if (format === 'named' && this._finalFormat === 'initial') {
            initialColor = color;
          }
        }

        const formattedColor = hslToFormat(<IcolorData>{
          hsla: changedHSLA,
          format: finalFormat,
          alphaUnits,
          initialColor
        });

        prev.push({
          colorName: newName,
          hsla: changedHSLA,
          color: formattedColor,
          isBase,
          isEdgeValue
        });

        return prev;
      }, []);
  }

  _addBlackAndWhite (datalist: IcolorDataFull[][]): IcolorDataFull[][] {
    if (this._hasBlack && this._hasWhite) {
      return datalist;
    }

    datalist = datalist.map(singleColorDataList => {
      return singleColorDataList.map((item, index) => {
        if (!item.isEdgeValue) {
          return item;
        }

        const isDark = item.colorName.includes('dark');

        if ((isDark && this._hasBlack) || (!isDark && this._hasWhite)) {
          return item;
        }

        let itemToCompare = singleColorDataList[index - 1];

        if (isDark) {
          itemToCompare = singleColorDataList[index + 1];
        }

        if (!itemToCompare.isEdgeValue) {
          item.isEdgeValue = false;

          if (isDark) {
            this._hasBlack = true;
          } else {
            this._hasWhite = true;
          }
        }

        return item;
      });
    });

    return datalist;
  }

  _hslChangeLight (hslObj: IHSLA, changes: number): IHSLA {
    let { h, s, l, a } = hslObj;
    l = +(l + changes).toFixed(1);

    return { h, s, l, a };
  }

  _getColorSteps (step: string, stepsQuantity: string): Record<string, unknown> {
    const stepNum: number = +step;
    const stepsQuantityNum: number = +stepsQuantity;

    const steps = {
      darkest: -stepNum * 3,
      darker: -stepNum * 2,
      dark: -stepNum,
      normal: 0,
      light: +stepNum,
      lighter: stepNum * 2,
      lightest: stepNum * 3
    };

    if (stepsQuantityNum === 3) {
      return steps;
    }

    const stepsList = Object.entries(steps);
    // One central cell + added variations
    const sliceSize = stepsQuantityNum * 2 + 1;
    const sliceOffset = (stepsList.length - sliceSize) / 2;
    const slice = stepsList.splice(sliceOffset, sliceSize);

    return Object.fromEntries(slice);
  }
}
