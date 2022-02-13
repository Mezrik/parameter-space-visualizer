export type ParamType = string;
export type Params = { x: ParamType; y: ParamType } | ParamType;
export type ParamsTuple = [ParamType, ParamType] | [ParamType, undefined];

export type Margin = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

export type Options<T> = {
  params?: Params;
  margin?: Margin;
  color?: (d: T) => string;
};

export interface ChartData<T = unknown> {
  value: T;
  params: Record<string, { from: number; to: number }>;
}

export type ChartConfig<T> = {
  options?: Options<T>;
  data: Array<ChartData<T>>;
};
