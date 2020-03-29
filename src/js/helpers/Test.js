const testValues = `/* Sass variables */
$scss-color: #0B486B;

/* Less variables */
@less-color: #0B486B;

--col-named: tomato;

--col-hex: #79BD9A;
--col-hexa: #79BD9A99;

--col-hx: #79B;
--col-hxa: #79B9;

--col-rgb: rgb(0, 128, 128);
--col-rgba-1: rgba(50, 128, 128, .5);
--col-rgba-2: rgba(50, 128, 128, 0.5);
--col-rgba-3: rgba(50, 128, 128, 20.5%);
--col-rgba-4: rgba(50, 128, 128, 50%);

--col-hsl: hsl(202, 81.4%, 30.1%);
--col-hsla-1: hsla(100, 51.4%, 55.1%, .5);
--col-hsla-2: hsla(100, 51.4%, 55.1%, 20.5%);
--col-hsla-3: hsla(100, 51.4%, 55.1%, 0.5);
--col-hsla-4: hsla(100, 51.4%, 55.1%, 50%);

--col-keyword-t: transparent;
--col-keyword-c: currentColor;

--col-white: hsl(0, 0%, 100%);
--col-black: hsl(0, 0%, 0%);
`;

class Test {
  constructor(func) {
    this.func = func;
  }

  run() {

  }
}

export default Test;
