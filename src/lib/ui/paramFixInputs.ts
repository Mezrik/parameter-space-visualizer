import { ParamsFixation } from '../../types/general';
import { createInput } from './input';

export const appendParamFixInputs = (
  el: HTMLElement,
  params: ParamsFixation,
  onChange: (p: ParamsFixation) => void,
) => {
  const container = document.createElement('div');
  container.classList.add('styled-inputs');
  el.appendChild(container);

  const inputs: Record<string, [HTMLDivElement, HTMLInputElement]> = {};
  let state = params;

  const inputHandlerFactory = (param: string) => (val: number) => {
    state[param] = val;
    onChange(state);
  };

  Object.entries(params).forEach(([param, value]) => {
    const [cont, input] = createInput(param, value, inputHandlerFactory(param));

    inputs[param] = [cont, input];

    container.appendChild(cont);
  });

  const handleExternalChange = (fixs: ParamsFixation) => {
    state = fixs;

    Object.entries(fixs).forEach(([param, value]) => {
      if (!inputs[param]) {
        const [cont, input] = createInput(param, value, inputHandlerFactory(param));
        inputs[param] = [cont, input];

        container.appendChild(cont);
        return;
      }

      inputs[param][1].value = `${value}`;
    });

    const newParams = Object.keys(fixs);
    const toBeRemoved = Object.entries(inputs).filter(([param]) => !newParams.includes(param));

    toBeRemoved.forEach(([param, [cont]]) => {
      cont.remove();
      delete inputs[param];
    });
  };

  return handleExternalChange;
};
