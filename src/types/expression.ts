export type VariableInterval = {
  name: string;
  start: number;
  end: number;
};

export type ProbabilityDatum = {
  name: string;
  value: string | number;
};

export type Token = {
  token: string;
  type: number;
  value?: string | ((a: number, b?: number) => number) | undefined;
  show: string;
  preced?: number | undefined;
};

export type EvalFunction = (pair: object) => string | number;
