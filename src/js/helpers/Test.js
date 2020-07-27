const testValues = `/* Sass variables */
$scss-color: #0B486B;

/* Less variables */
@less-color: #0B486B;

--color-named: tomato;

--color-hex: #79BD9A;
--color-hexa: #79BD9A99;

--color-hx: #79B;
--color-hxa: #79B9;

--color-rgb: rgb(0, 128, 128);
--color-rgba-1: rgba(50, 128, 128, .5);
--color-rgba-2: rgba(50, 128, 128, 0.5);
--color-rgba-3: rgba(50, 128, 128, 20.5%);
--color-rgba-4: rgba(50, 128, 128, 50%);

--color-hsl: hsl(202, 81.4%, 30.1%);
--color-hsla-1: hsla(100, 51.4%, 55.1%, .5);
--color-hsla-2: hsla(100, 51.4%, 55.1%, 20.5%);
--color-hsla-3: hsla(100, 51.4%, 55.1%, 0.5);
--color-hsla-4: hsla(100, 51.4%, 55.1%, 50%);

--color-keyword-t: transparent;
--color-keyword-c: currentColor;

--color-white: hsl(0, 0%, 100%);
--color-black: hsl(0, 0%, 0%);
`;

export class Test {
  constructor({ inputElem, setPalette }) {
    this.setPalette = setPalette;
    this.inputElem = inputElem;
  }

  run() {
    this.inputElem.value = testValues;
    this.setPalette();
  }
}
