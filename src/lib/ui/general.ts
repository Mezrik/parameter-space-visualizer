import { theme } from "../../constants/styles";

export type StyleDeclaration = {
  [P in keyof CSSStyleDeclaration]?: string;
};

export const camelToDashCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const applyStyles = (el: HTMLElement, style: StyleDeclaration) => {
  Object.entries(style).forEach(
    ([key, value]) => value && el.style.setProperty(camelToDashCase(key), value)
  );
};

export const addStyle = (
  style: string | ((t: typeof theme) => string),
  id?: string
) => {
  const s = document.createElement("style");
  if (id) {
    const alreadyExists = document.querySelector(`style#${id}`);
    if (alreadyExists) return;

    s.id = id;
  }

  s.textContent = typeof style === "string" ? style : style(theme);
  document.head.append(s);
};

export const rem = (value: number, base: number = 16) => `${value / base}rem`;
