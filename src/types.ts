export enum ChartTypes {
  Region = "region",
  Scatter = "scatter",
}

export type Params = { x: string; y: string } | string;
export type ParamsTuple = [string, string] | [string, undefined];

export type Options = {
  params?: Params;
};

export interface ChartData<T> {
  value: T;
  params: Record<string, { from: number; to: number }>;
}

export type ChartConfig<T> = {
  options?: Options;
  type: ChartTypes;
  data: Array<ChartData<T>>;
};
