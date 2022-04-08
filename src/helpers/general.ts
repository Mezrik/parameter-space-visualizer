import {
  Margin,
  Params,
  ParamsFixation,
  ParamsTuple,
  ParamType,
} from "../types/general";
import {
  isRegionsData,
  getParams as getRegionsParams,
  getParamDomain as getRegionsParamDomain,
} from "./regions";

import {
  isVariableIntervalData,
  getParams as getVariableIntervalParams,
  getParamDomain as getVariableIntervalParamDomain,
  getParamDomainFromProbabData,
  isProbabilityData,
} from "./expression";

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

  if (isVariableIntervalData(data) || isProbabilityData(data))
    return getVariableIntervalParams(data);

  return [];
};

export const getParamDomain = <Datum>(data: Datum[], param: string) => {
  if (isRegionsData(data)) return getRegionsParamDomain(data, param);

  if (isVariableIntervalData(data))
    return getVariableIntervalParamDomain(data, param);

  if (isProbabilityData(data)) return getParamDomainFromProbabData(data, param);

  return [];
};

export const getParamsToBeFixed = (
  params: ParamsTuple,
  allParams: ParamType[],
  paramsExtents: Record<ParamType, [number, number]>,
  userFixations?: ParamsFixation
): ParamsFixation => {
  const [xParam, yParam] = params;

  const toBeFixed = allParams.filter(
    (param) =>
      param !== xParam &&
      param !== yParam &&
      !Object.keys(userFixations ?? {}).find((name) => name === param)
  );

  return {
    ...checkParamFixationInExtent(userFixations ?? {}, paramsExtents),
    ...toBeFixed.reduce(
      (acc, param) => ({ ...acc, [param]: paramsExtents[param][0] }),
      {}
    ),
  };
};

export const isInExtent = (
  val: number | string,
  [min, max]: [number, number]
) => {
  return typeof val === "number" && (min <= val || val <= max);
};

export const checkParamFixationInExtent = (
  fixations: ParamsFixation,
  paramsExtents: Record<ParamType, [number, number]>
) => {
  return Object.entries(fixations).reduce<ParamsFixation>(
    (acc, [param, val]) => ({
      ...acc,
      [param]: isInExtent(val, paramsExtents[param])
        ? val
        : paramsExtents[param][0],
    }),
    {}
  );
};
