export const font = "var(--doc-font-family)";

const colors = {
  textColor: "#5a5a5a",
  white: "#ffffff",
  black: "#000000",
  primary: "#f68328",
  lightGrey: "#c7c7c7",
  grey: "#9b9b9b",
} as const;

const borderRadius = {
  deafult: `0.25rem`,
} as const;

const boxShadow = {
  default: `rgb(0 0 0 / 10%) 0px 0px 0.625rem 0.1875rem`,
} as const;

export const theme = {
  colors,
  borderRadius,
  boxShadow,
  font,
} as const;
