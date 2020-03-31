import { examplePalettes } from '../data/examplePalettes.js';

export function addExampleControls ({
  controlsElem,
  inputElem,
  setPalette
}) {
  for (const [name, colors] of Object.entries(examplePalettes)) {
    const gradient = getGradient(colors);

    controlsElem.insertAdjacentHTML('beforeend', `<button
      class="codes__control"
      data-name="${name}"
      style="background: ${gradient}"
      type="button"
      title="Add palette '${name}'">
      <span class="visually-hidden">Palette ${name}</span>
    </button>`);
  }

  controlsElem.addEventListener('click', (event) => {
    const button = event.target.closest('.codes__control');

    if (!button) {
      return;
    }
    const palette = examplePalettes[button.dataset.name];
    inputElem.value = getCodes(palette);
    setPalette();
  });
}

function getCodes (colors) {
  return colors
    .reduce((prev, item, index) => {
      prev.push(`--color-${index + 1}: ${item};`);
      return prev;
    }, [])
    .join('\n');
}

function getGradient (colors) {
  const colorStops = [];
  const step = 100 / colors.length;

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    colorStops.push(`${color} 0, ${color} ${step * (i + 1)}%`);
  }

  return `linear-gradient(to right, ${colorStops.join(', ')})`;
}
