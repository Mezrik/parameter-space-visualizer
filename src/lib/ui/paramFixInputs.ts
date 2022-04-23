import { theme } from "../../constants/styles";
import { ParamsFixation, ParamType } from "../../types/general";
import { addStyle, applyStyles, rem, StyleDeclaration } from "./general";
import { labelDefaultStyle } from "./styles";

const defaultInputStyle: Partial<StyleDeclaration> = {
  padding: `${rem(6)}`,
  fontFamily: theme.font,
  fontSize: "0.75rem",
  border: `${theme.colors.primary} ${rem(2)} solid`,
  borderRadius: `${rem(4)}`,
  color: theme.colors.textColor,
};

export const createParamInput = (
  param: ParamType,
  value: number | string,
  onChange: (value: number) => void,
  style = defaultInputStyle
): [HTMLDivElement, HTMLInputElement] => {
  const container = document.createElement("div");
  container.classList.add("field");

  const l = document.createElement("label");
  l.htmlFor = param;
  l.innerText = param;
  applyStyles(l, labelDefaultStyle);

  const input = document.createElement("input");
  input.id = param;
  input.name = param;
  input.value = `${value}`;
  input.type = "text";
  input.addEventListener("change", (ev) => {
    onChange(parseFloat((ev.target as HTMLInputElement).value));
  });
  input.classList.add("styled-input");

  applyStyles(input, style);

  container.appendChild(l);
  container.appendChild(input);

  return [container, input];
};

export const appendParamFixInputs = (
  el: HTMLElement,
  params: ParamsFixation,
  onChange: (p: ParamsFixation) => void
) => {
  const container = document.createElement("div");
  container.classList.add("styled-inputs");
  el.appendChild(container);

  const inputs: Record<string, [HTMLDivElement, HTMLInputElement]> = {};
  let state = params;

  const inputHandlerFactory = (param: string) => (val: number) => {
    state[param] = val;
    onChange(state);
  };

  Object.entries(params).forEach(([param, value]) => {
    const [cont, input] = createParamInput(
      param,
      value,
      inputHandlerFactory(param)
    );

    inputs[param] = [cont, input];

    container.appendChild(cont);
  });

  const handleExternalChange = (fixs: ParamsFixation) => {
    state = fixs;

    Object.entries(fixs).forEach(([param, value]) => {
      if (!inputs[param]) {
        const [cont, input] = createParamInput(
          param,
          value,
          inputHandlerFactory(param)
        );
        inputs[param] = [cont, input];

        container.appendChild(cont);
        return;
      }

      inputs[param][1].value = `${value}`;
    });

    const newParams = Object.keys(fixs);
    const toBeRemoved = Object.entries(inputs).filter(
      ([param]) => !newParams.includes(param)
    );

    toBeRemoved.forEach(([param, [cont]]) => {
      cont.remove();
      delete inputs[param];
    });
  };

  return handleExternalChange;
};
