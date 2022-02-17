import { Margin, Params, ParamsTuple } from "../types/general";
import {
  isRegionsData,
  getParams as getRegionsParams,
  getParamDomain as getRegionsParamDomain,
} from "./regions";

export const checkIfParamsExist = (existing: string[], p: ParamsTuple) =>
  p[1]
    ? existing.includes(p[0]) && existing.includes(p[1])
    : existing.includes(p[0]);

export const reverseExtent = ([a, b]: [number, number]) => [b, a];

export const getParamsTuple = (params?: Params): ParamsTuple | undefined => {
  if (!params) return undefined;

  if (typeof params === "string") return [params, undefined];

  return [params.x, params.y];
};

export const getParams = <Datum>(data: Datum[]) => {
  if (isRegionsData(data)) return getRegionsParams(data);

  return []; // TBD for other charts
};

export const getParamDomain = <Datum>(data: Datum[], param: string) => {
  if (isRegionsData(data)) return getRegionsParamDomain(data, param);

  return []; // TBD for other charts
};
