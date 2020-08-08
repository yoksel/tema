import { IsetPaletteData, IcolorDataFull } from './js/ts-interfaces/interfaces';
import { fillGrid, addExampleControls, Test } from './js/helpers/index';
import { PaletteGenerator } from './js/palette-generator';
import './scss/styles.scss';

interface IcontrolsCollectionExtended extends HTMLFormControlsCollection {
  finalFormat: HTMLFormControlsCollection
}

const inputElem: HTMLInputElement = <HTMLInputElement>document.querySelector('.codes__textarea--input');
const outputElem: HTMLInputElement = <HTMLInputElement>document.querySelector('.codes__textarea--output');
const paletteView: HTMLDivElement = <HTMLDivElement>document.querySelector('.palette__view');
const stepsQuantityElem: HTMLInputElement = <HTMLInputElement>document.querySelector('.options__range--stepsquantity');
const stepsQuantityValueElem: HTMLInputElement = <HTMLInputElement>document.querySelector('.options__range-value--stepsquantity');
const lightstepElem: HTMLInputElement = <HTMLInputElement>document.querySelector('.options__range--lightstep');
const lightstepValueElem: HTMLSpanElement = <HTMLSpanElement>document.querySelector('.options__range-value--lightstep');
const form: HTMLFormElement = <HTMLFormElement>document.querySelector('.options__form');
const controlsElem: HTMLDivElement = <HTMLDivElement>document.querySelector('.codes__controls');
const optionsControls: IcontrolsCollectionExtended = <IcontrolsCollectionExtended>form.elements;
const colorFormatControls = optionsControls.finalFormat;

const palette: PaletteGenerator = new PaletteGenerator();
/* eslint-disable-next-line */
const test = new Test ({ inputElem,setPalette });

setPalette();

addExampleControls({
  controlsElem,
  inputElem,
  setPalette
});

// Run to test all possible colors values
// test.run();

// ---------------------------------------------

inputElem.addEventListener('input', setPalette);
lightstepElem.addEventListener('input', setPalette);
stepsQuantityElem.addEventListener('input', setPalette);

for (const formatInput of colorFormatControls) {
  formatInput.addEventListener('input', setPalette);
}

// ---------------------------------------------

function setPalette (): void {
  const options: Record<string, unknown> = {};
  const formData: FormData = new FormData(form);

  setRangeValues();

  for (const [name, value] of formData) {
    options[name] = value;
  }

  const paletteParams = <IsetPaletteData>{
    inputValue: inputElem.value,
    ...options
  };

  palette.setPalette(paletteParams);
  const code: string = palette.getCode();
  const data: IcolorDataFull[][] = palette.getData();
  const stepsQuantity: string = stepsQuantityElem.value;

  outputElem.value = code;

  fillGrid({
    data,
    elem: paletteView,
    stepsQuantity
  });
}

// ---------------------------------------------

function setRangeValues (): void {
  setRangeValue(lightstepElem, lightstepValueElem);
  setRangeValue(stepsQuantityElem, stepsQuantityValueElem);
}

// ---------------------------------------------

interface IInputProps {
  value: unknown,
  min: unknown,
  max: unknown,
  offsetWidth: number
}

function setRangeValue (
  input: HTMLInputElement,
  inputValueElem: HTMLDivElement | HTMLSpanElement
): void {
  const { value, min, max, offsetWidth }: IInputProps = input;
  inputValueElem.innerHTML = <string>value;

  const realPos: number = <number>value - <number>min;
  const realMax: number = <number>max - <number>min;
  const elemWidth: number = offsetWidth - inputValueElem.offsetWidth / 2;

  const inputValuePos: number = realPos / realMax * elemWidth;

  inputValueElem.style.left = `${inputValuePos.toFixed(2)}px`;
}

window.addEventListener('resize', setRangeValues);
