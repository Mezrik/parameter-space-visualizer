import { RegionResults } from "@mocks/helpers/parseRegions";

export const getParams = (regions: RegionResults) =>
  regions.length > 0 ? Object.keys(regions[0].params) : [];

export const getParamDomain = (regions: RegionResults, param: string) =>
  regions.reduce<number[]>((acc, region) => {
    const paramRange = region.params[param];

    if (!paramRange) return acc;

    return [...acc, paramRange.from, paramRange.to];
  }, []);
