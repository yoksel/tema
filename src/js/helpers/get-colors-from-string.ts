import { IcolorDataFull } from '../ts-interfaces/interfaces';
import { colorToHsla, getColorData } from './index';

export const getColorsFromString = (inputValue: string): IcolorDataFull[] => {
  const colorsList: string[] = inputValue
    .split('\n')
    .filter(item => {
      // Trim spaces, ignore comments
      return item.trim().includes(':');
    });

  return colorsList.map(item => {
    const str = item.trim().replace(';', '');
    let [name, color] = str.split(':');
    color = color.trim();
    const data = getColorData(color);
    const hsla = colorToHsla({
      color,
      ...data
    });

    return <IcolorDataFull>{
      colorName: name.trim(),
      hsla,
      color,
      ...data
    };
  });
};
