import { ChartData, Params, ParamsTuple } from "../types";

export const checkIfParamsExist = (existing: string[], p: ParamsTuple) =>
  p[1]
    ? existing.includes(p[0]) && existing.includes(p[1])
    : existing.includes(p[0]);

export const reverseExtent = ([a, b]: [number, number]) => [b, a];

export const getParams = <T>(data: Array<ChartData<T>>) =>
  data.length > 0 ? Object.keys(data[0].params) : [];

export const getParamDomain = <T>(data: Array<ChartData<T>>, param: string) =>
  data.reduce<number[]>((acc, datum) => {
    const paramRange = datum.params[param];

    if (!paramRange) return acc;

    return [...acc, paramRange.from, paramRange.to];
  }, []);

export const getParamsTuple = (params?: Params): ParamsTuple | undefined => {
  if (!params) return undefined;

  if (typeof params === "string") return [params, undefined];

  return [params.x, params.y];
};
