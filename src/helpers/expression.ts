import { ProbabilityDatum, Token, VariableInterval } from "../types/expression";

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
    !!data.length &&
    typeof interval.end === "number" &&
    typeof interval.start === "number" &&
    typeof interval.name === "string"
  );
};

export const isProbabilityData = (
  data: unknown[]
): data is ProbabilityDatum[] => {
  const d = data[0] as unknown as ProbabilityDatum;

  return (
    !!data.length && typeof d.value === "string" && typeof d.name === "string"
  );
};

export const getParams = (data: (VariableInterval | ProbabilityDatum)[]) =>
  data.map(({ name }) => name);

export const getParamDomain = (
  data: (VariableInterval | ProbabilityDatum)[],
  param: string
) => {
  const d = data.find((d) => d.name === param);

  if (!d) return [];

  return [
    (d as Partial<VariableInterval>).start ?? 0,
    (d as Partial<VariableInterval>).end ?? 0,
  ];
};

export const createStubProbabilityData = (intervals: VariableInterval[]) => {
  return intervals.map(({ name }) => ({ name, value: "0" }));
};
