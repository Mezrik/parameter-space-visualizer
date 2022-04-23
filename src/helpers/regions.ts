import { NumberValue } from "d3-scale";
import { ParamsFixation, RegionDatum } from "../types/general";

export const isRegionsData = <Value>(
  data: unknown[]
): data is RegionDatum<Value>[] => {
  const datum = (data as RegionDatum<Value>[])[0];
  return (
    !data.length ||
    (typeof datum.params !== "undefined" && typeof datum.value !== "undefined")
  );
};

export const getParams = <Value>(data: RegionDatum<Value>[]) =>
  data.length > 0 ? Object.keys(data[0].params) : [];

export const getParamDomain = <Value>(
  data: RegionDatum<Value>[],
  param: string
) => {
  const result: NumberValue[] = [];
  data.forEach((d) => {
    const paramRange = d.params[param];

    result.push(paramRange.from, paramRange.to);
  });

  return result;
};

export const isValueInRange = (
  range: { from: NumberValue; to: NumberValue },
  value: NumberValue
) => {
  return range.from <= value && value <= range.to;
};

export const applyParamsFixations = <Value>(
  data: RegionDatum<Value>[],
  fixs?: ParamsFixation
) => {
  return fixs
    ? data.filter((d) =>
        Object.entries(fixs).every(([param, val]) =>
          isValueInRange(
            d.params[param],
            typeof val === "string" ? parseInt(val, 10) : val
          )
        )
      )
    : data;
};
