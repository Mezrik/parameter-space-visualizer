import { Token, VariableInterval } from "../types/expression";

export const createVariableTokens = (variable: string): Token => {
  return {
    type: 3,
    token: variable,
    show: variable,
    value: variable,
  };
};

export const isVariableIntervalData = (
  data: unknown[]
): data is VariableInterval[] => {
  const interval = data[0] as unknown as VariableInterval;
  return (
    !data.length &&
    typeof interval.end === "number" &&
    typeof interval.start === "number" &&
    typeof interval.name === "string"
  );
};

export const getParams = (data: VariableInterval[]) =>
  data.map(({ name }) => name);

export const getParamDomain = (data: VariableInterval[], param: string) => {
  const interval = data.find((d) => d.name === param);

  if (!interval) return [];

  return [interval.start, interval.end];
};
