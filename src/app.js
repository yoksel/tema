import { fillGrid, addExampleControls, Test } from './js/helpers/index.js';
import { PaletteGenerator } from './js/PaletteGenerator.js';
import './scss/styles.scss';

const inputElem = document.querySelector('.codes__textarea--input');
const output = document.querySelector('.codes__textarea--output');
const paletteView = document.querySelector('.palette__view');
const stepsQuantity = document.querySelector('.options__range--stepsquantity');
const stepsQuantityValue = document.querySelector('.options__range-value--stepsquantity');
const lightstep = document.querySelector('.options__range--lightstep');
const lightstepValue = document.querySelector('.options__range-value--lightstep');
const form = document.querySelector('.options__form');
const codesControls = document.querySelector('.codes__controls');

const palette = new PaletteGenerator();
/* eslint-disable-next-line */
const test = new Test(setPalette);

setPalette();

addExampleControls({
  controlsElem: codesControls,
  inputElem,
  setPalette
});

// Run to test all possible colors values
// test.run();

// ---------------------------------------------

inputElem.addEventListener('input', setPalette);
lightstep.addEventListener('input', setPalette);
stepsQuantity.addEventListener('input', setPalette);

for (const formatInput of form.elements.finalFormat) {
  formatInput.addEventListener('input', setPalette);
}

// ---------------------------------------------

function setPalette () {
  const options = {};

  setRangeValues();

  for (const [name, value] of new FormData(form)) {
    options[name] = value;
  }

  palette.setPalette({
    inputValue: inputElem.value,
    ...options
  });
  const code = palette.getCode();

  output.value = code;

  fillGrid({
    data: palette.getData(),
    elem: paletteView,
    stepsQuantity: stepsQuantity.value
  });
}

// ---------------------------------------------

function setRangeValues () {
  setRangeValue(lightstep, lightstepValue);
  setRangeValue(stepsQuantity, stepsQuantityValue);
}

// ---------------------------------------------

function setRangeValue (input, inputValue) {
  const { value, min, max, offsetWidth } = input;
  inputValue.innerHTML = value;

  const realPos = value - min;
  const realMax = max - min;
  const elemWidth = offsetWidth - inputValue.offsetWidth / 2;

  const inputValuePos = realPos / realMax * elemWidth;

  inputValue.style.left = `${inputValuePos.toFixed(2)}px`;
}

window.addEventListener('resize', setRangeValues);
