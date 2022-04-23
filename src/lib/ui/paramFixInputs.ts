import { ParamsFixation, ParamType } from "../../types/general";

export const createParamInput = (
  param: ParamType,
  value: number | string,
  onChange: (value: number) => void
): [HTMLDivElement, HTMLInputElement] => {
  const container = document.createElement("div");
  container.classList.add("field");

  const l = document.createElement("label");
  l.htmlFor = param;

  const input = document.createElement("input");
  input.id = param;
  input.name = param;
  input.value = `${value}`;
  input.type = "text";
  input.addEventListener("change", (ev) => {
    onChange(parseFloat((ev.target as HTMLInputElement).value));
  });

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
