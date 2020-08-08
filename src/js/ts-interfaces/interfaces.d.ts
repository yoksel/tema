export interface IHSLA {
  h: number,
  s: number,
  l: number,
  a: string | number
}

export interface IRGBA {
  r: number,
  g: number,
  b: number,
  a: string | number
}

export interface IcolorDataMin {
  format: string,
  alphaUnits: string
}

export interface IcolorData {
  hsla: IHSLA,
  format: string,
  alphaUnits: string,
  initialColor?: string
}

export interface IcolorDataFull {
  hsla: IHSLA,
  format?: string,
  alphaUnits?: string,
  color: string,
  colorName: string,
  initialColor?: string
  isEdgeValue?: boolean,
  isBase?: boolean,
  isKeyword?: boolean,
}

export interface IsetPaletteData {
  inputValue: string,
  step: string,
  stepsQuantity: string,
  finalFormat: string
}
