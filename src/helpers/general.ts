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
import { scaleLinear } from "d3-scale";
import { hcl, HCLColor } from "d3-color";
import { interpolateHcl } from "d3-interpolate";

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

export const getDifParams = (
  params: string[],
  newP: ParamsTuple,
  oldP: ParamsTuple | null
): ParamsTuple => {
  if (!oldP)
    return newP[0] === newP[1]
      ? [newP[0], params.find((p) => p !== newP[1])]
      : newP;

  const changedX = oldP[0] !== newP[0];
  const [p1, p2] = changedX ? [newP[0], newP[1]] : [newP[1], newP[0]];

  if (p1 === p2) {
    const n = params.find((p) => p !== p2);
    return changedX ? [p1!, n] : [n!, p1];
  }
  return newP;
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

export const createProabilityColorScale = (colors: [string, string]) => {
  return scaleLinear<HCLColor, HCLColor>()
    .domain([0, 1])
    .interpolate(interpolateHcl)
    .range([hcl(colors[0]), hcl(colors[1])]);
};
