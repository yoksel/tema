import { examplePalettes } from '../data/example-palettes';

interface IaddExampleControlsParams {
  controlsElem: HTMLDivElement,
  inputElem: HTMLInputElement,
  setPalette: () => void
}

export const addExampleControls = ({
  controlsElem,
  inputElem,
  setPalette
}: IaddExampleControlsParams): void => {
  const colorsList = Object.entries(examplePalettes);
  for (const [name, colors] of colorsList) {
    const gradient = getPaletteAsGradient(<string[]>colors);

    controlsElem.insertAdjacentHTML('beforeend', `<button
      class="codes__control"
      data-name="${name}"
      style="background: ${gradient}"
      type="button"
      title="Add palette '${name}'">
      <span class="visually-hidden">Palette ${name}</span>
    </button>`);
  }

  controlsElem.addEventListener('click', (event: Event) => {
    const button: HTMLButtonElement = <HTMLButtonElement>(<HTMLDivElement>event.target).closest('.codes__control');

    if (!button) {
      return;
    }

    const name = <string>button.dataset.name;
    const palette = examplePalettes[name];
    inputElem.value = getCodes(<string[]>palette);

    setPalette();
  });
};

const getCodes = (colors: string[]): string => {
  const colorVarsList = colors
    .reduce((prev: string[], item: string, index: number) => {
      prev.push(`--color-${index + 1}: ${item};`);

      return prev;
    }, []);

  return colorVarsList.join('\n');
};

const getPaletteAsGradient = (colors: string[]): string => {
  const colorStops: string[] = [];
  const step: number = 100 / colors.length;

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    colorStops.push(`${color} 0, ${color} ${step * (i + 1)}%`);
  }

  return `linear-gradient(to right, ${colorStops.join(', ')})`;
};
