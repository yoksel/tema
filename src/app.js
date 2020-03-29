import { PaletteGenerator } from './js/PaletteGenerator.js';
import './scss/styles.scss';

const input = document.querySelector('.codes__textarea--input');
const output = document.querySelector('.codes__textarea--output');
const paletteView = document.querySelector('.palette__view');
const lightstep = document.querySelector('.options__range--lightstep');
const form = document.querySelector('.options__form');
const colorFormat = document.querySelector('.options__radio')

let palette = new PaletteGenerator();

setPalette();

// ---------------------------------------------

input.addEventListener('input', setPalette);
lightstep.addEventListener('input', setPalette);

for(const formatInput of form.elements['finalFormat']) {
  formatInput.addEventListener('input', setPalette);
}

// ---------------------------------------------

function setPalette() {
  const options = {};

  for (const [name, value] of new FormData(form)) {
    options[name] = value;
  }

  palette.setPalette({
    inputValue: input.value,
    ...options
  });
  const code = palette.getCode();

  output.value = code;

  fillGrid(palette.getData());
}

// ---------------------------------------------

function fillGrid (paletteData) {
  paletteView.innerHTML = '';
  let index = 0;

  for(const colorData of paletteData){
    let lineClass = '';
    if(index === 0) {
      lineClass = 'palette__cell--first-line';
    }
    else if(index === paletteData.length - 1) {
      lineClass = 'palette__cell--last-line';
    }

    const colorsCells = colorData
      .map(({name, color, isBase, isKeyword}) => {
        let classList = ['palette__cell'];
        let content = `<span class="palette__cell-content">${name}</span>`;

        if(isBase) {
          classList.push('palette__cell--base')

          if(lineClass) {
            classList.push(lineClass)
          }
        }

        if(isKeyword) {
          classList.push('palette__cell--keyword');
        }

        return `<span
          class="${classList.join(' ')}"
          style="background: ${color}">${content}</span>`;
      });

    paletteView.insertAdjacentHTML('beforeend', colorsCells.join(''));
    index++;
  }
}
