import { applyStyles } from './general';
import { labelDefaultStyle, defaultInputStyle } from './styles';

export const createInput = (
  name: string,
  value: number | string,
  onChange: (value: number) => void,
  style = defaultInputStyle,
): [HTMLDivElement, HTMLInputElement] => {
  const container = document.createElement('div');
  container.classList.add('field');

  const l = document.createElement('label');
  l.htmlFor = `${name}-id`;
  l.innerText = name;
  applyStyles(l, labelDefaultStyle);

  const input = document.createElement('input');
  input.id = `${name}-id`;
  input.name = name;
  input.value = `${value}`;
  input.type = 'text';
  input.addEventListener('change', ev => {
    onChange(parseFloat((ev.target as HTMLInputElement).value));
  });
  input.classList.add('styled-input');

  applyStyles(input, style);

  container.appendChild(l);
  container.appendChild(input);

  return [container, input];
};
