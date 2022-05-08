import { Margin, Params, ParamsFixation, ParamsTuple, ParamType } from '../types/general';
import {
  isRegionsData,
  getParams as getRegionsParams,
  getParamDomain as getRegionsParamDomain,
} from './regions';

import {
  isVariableIntervalData,
  getParams as getVariableIntervalParams,
  getParamDomain as getVariableIntervalParamDomain,
  getParamDomainFromProbabData,
  isProbabilityData,
} from './scatter';
import { scaleLinear } from 'd3-scale';
import { hcl, HCLColor } from 'd3-color';
import { interpolateHcl } from 'd3-interpolate';
import { BaseType, select } from 'd3-selection';

export const checkIfParamsExist = (existing: string[], p: ParamsTuple) =>
  p[1] ? existing.includes(p[0]) && existing.includes(p[1]) : existing.includes(p[0]);

export const reverseExtent = ([a, b]: [number, number]) => [b, a];

export const getParamsTuple = (params?: Params): ParamsTuple | undefined => {
  if (!params) return undefined;

  if (typeof params === 'string') return [params, undefined];

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
  oldP: ParamsTuple | undefined | null,
): ParamsTuple => {
  if (!oldP) return newP[0] === newP[1] ? [newP[0], params.find(p => p !== newP[1])] : newP;

  const changedX = oldP[0] !== newP[0];
  const [p1, p2] = changedX ? [newP[0], newP[1]] : [newP[1], newP[0]];

  if (p1 === p2) {
    const n = params.find(p => p !== p2);
    return changedX ? [p1!, n] : [n!, p1];
  }
  return newP;
};

export const getParamDomain = <Datum>(data: Datum[], param: string) => {
  if (isRegionsData(data)) return getRegionsParamDomain(data, param);

  if (isVariableIntervalData(data)) return getVariableIntervalParamDomain(data, param);

  if (isProbabilityData(data)) return getParamDomainFromProbabData(data, param);

  return [];
};

export const getParamsToBeFixed = (
  params: ParamsTuple,
  allParams: ParamType[],
  paramsExtents: Record<ParamType, [number, number]>,
  userFixations?: ParamsFixation,
): ParamsFixation => {
  const [xParam, yParam] = params;

  const toBeFixed = allParams.filter(
    param =>
      param !== xParam &&
      param !== yParam &&
      !Object.keys(userFixations ?? {}).find(name => name === param),
  );

  return {
    ...checkUserParams(userFixations ?? {}, params, paramsExtents),
    ...toBeFixed.reduce((acc, param) => ({ ...acc, [param]: paramsExtents[param][0] }), {}),
  };
};

export const isInExtent = (val: number | string, [min, max]: [number, number]) => {
  return typeof val === 'number' && (min <= val || val <= max);
};

export const checkUserParams = (
  fixations: ParamsFixation,
  params: ParamsTuple,
  paramsExtents: Record<ParamType, [number, number]>,
) => {
  return Object.entries(fixations).reduce<ParamsFixation>(
    (acc, [param, val]) =>
      params.includes(param)
        ? acc
        : {
            ...acc,
            [param]: isInExtent(val, paramsExtents[param]) ? val : paramsExtents[param][0],
          },
    {},
  );
};

export const createProabilityColorScale = (colors: [string, string, string]) => {
  return scaleLinear<HCLColor, HCLColor>()
    .domain([0, 0.5, 1])
    .interpolate(interpolateHcl)
    .range([hcl(colors[0]), hcl(colors[1]), hcl(colors[2])]);
};

export const getDOMNode = (element: HTMLElement | string): HTMLElement | null => {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }

  return element;
};

export const getDOMNodeSelection = (element: HTMLElement | string) => {
  const node = getDOMNode(element);

  if (node) return select<HTMLElement, unknown>(node).append('div');

  return undefined;
};

export const getNodeXY = (nodes: BaseType[] | ArrayLike<BaseType>, i: number): [number, number] => {
  const node = select(nodes[i]);
  const x = parseInt(node.attr('x'), 10);
  const y = parseInt(node.attr('y'), 10);
  return [x, y];
};
