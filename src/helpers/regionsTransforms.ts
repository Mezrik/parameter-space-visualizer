import { RegionResults } from "@mocks/helpers/parseRegions";

export const getParams = <T>(regions: RegionResults<T>) =>
  regions.length > 0 ? Object.keys(regions[0].params) : [];

export const getParamDomain = <T>(regions: RegionResults<T>, param: string) =>
  regions.reduce<number[]>((acc, region) => {
    const paramRange = region.params[param];

    if (!paramRange) return acc;

    return [...acc, paramRange.from, paramRange.to];
  }, []);
