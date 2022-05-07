import { theme } from '../../constants/styles';
import { ParamsChangeHandler } from '../../types/general';
import { addStyle, applyStyles, rem, StyleDeclaration } from './general';
import { labelDefaultStyle } from './styles';

type ParamSetCb = (v: string) => void;

export const findParam = (params: string[], param?: string): [number, string | undefined] => {
  const i = params.findIndex(p => p === param);
  return [i, i >= 0 ? params[i] : undefined];
};

export const createParamsSelectOptions = (params: string[], defaultParam?: string) =>
  params.map(param => {
    const opt = document.createElement('option');
    opt.value = param;
    opt.innerHTML = param;
    opt.selected = param === defaultParam;
    return opt;
  });

const defaultSelectStyle: Partial<StyleDeclaration> = {
  background: theme.colors.primary,
  padding: `${rem(6)} ${rem(16)} ${rem(6)} ${rem(6)}`,
  border: 'none',
  color: theme.colors.white,
  borderRadius: theme.borderRadius.deafult,
};

export const createParamsSelect = (
  params: string[],
  label: string,
  defaultParam?: string,
  style: Partial<StyleDeclaration> = defaultSelectStyle,
): [HTMLDivElement, HTMLSelectElement] => {
  const container = document.createElement('div');
  applyStyles(container, { display: 'flex', alignItems: 'center' });

  const l = document.createElement('label');
  l.innerHTML = label;
  applyStyles(l, labelDefaultStyle);
  container.appendChild(l);

  const select = document.createElement('select');
  createParamsSelectOptions(params, defaultParam).forEach(option => select.options.add(option));
  applyStyles(select, style);

  const styledSelect = document.createElement('label');
  applyStyles(styledSelect, { position: 'relative' });
  styledSelect.classList.add('styled-select');

  addStyle(
    theme => `
    .styled-select select {
      font-family: ${theme.font};
      font-size: 0.75rem;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      min-width: 3rem;
    }
    
    .styled-select:after { 
      content: '^';
      position: absolute;
      transform: rotate(180deg);
      pointer-events: none;
      right: ${rem(8)}; 
      top: ${rem(2)};
      color: ${style.color ?? theme.colors.black};
      font-family: monospace;
      font-size: 1.5em;
      line-height: ${rem(14.5)};
    }

    .styled-select:before { 
      content: '';
      right: ${rem(3)};
      top: ${rem(5)};
      width: ${rem(20)};
      height: ${rem(20)};
      background: ${style.background ?? style.backgroundColor ?? theme.colors.white};
      border-radius: ${style.borderRadius ?? '0'};
      position: absolute;
      pointer-events: none;
      display: block;
    }
  `,
    'styled-select-styles',
  );

  styledSelect.appendChild(select);

  container.appendChild(styledSelect);

  return [container, select];
};

export const appendParamsSelects = (
  el: HTMLElement,
  params: string[],
  x: ParamSetCb,
  defaultX?: string,
  y?: ParamSetCb,
  defaultY?: string,
) => {
  const container = document.createElement('div');
  container.classList.add('styled-selects');
  el.appendChild(container);

  addStyle(
    `
    .styled-selects {
      display: flex;
    }

    .styled-selects > * + * {
      margin-left: 1.5rem;
    }
  `,
    'styled-selects-styles',
  );

  const [xCont, xSelect] = createParamsSelect(params, 'x-axis', defaultX);
  container.appendChild(xCont);

  let yCont: HTMLElement | undefined;
  let ySelect: HTMLSelectElement | undefined;
  if (params.length > 1) {
    [yCont, ySelect] = createParamsSelect(params, 'y-axis', defaultY);
    container.appendChild(yCont);
  }

  xSelect.addEventListener('change', ev => {
    ev.target && x((ev.target as HTMLInputElement).value);
  });

  ySelect?.addEventListener('change', ev => {
    ev.target && y && y((ev.target as HTMLInputElement).value);
  });

  const handleExternalChange: ParamsChangeHandler = newParams => {
    if (!newParams) return;

    const [xi] = findParam(params, newParams[0]);
    const [yi] = findParam(params, newParams[1]);

    if (xSelect) xSelect.selectedIndex = xi;
    if (ySelect) ySelect.selectedIndex = yi;
  };

  return handleExternalChange;
};
