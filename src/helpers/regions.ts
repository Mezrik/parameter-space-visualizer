import { NumberValue } from "d3-scale";
import { RegionDatum } from "../types/general";

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
) =>
  data.reduce<NumberValue[]>((acc, datum) => {
    const paramRange = datum.params[param];

    if (!paramRange) return acc;

    return [...acc, paramRange.from, paramRange.to];
  }, []);
