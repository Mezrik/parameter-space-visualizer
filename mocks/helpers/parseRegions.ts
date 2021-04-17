export interface RegionResult {
  value: boolean | "unknown" | "partially";
  params: Record<string, { from: number; to: number }>;
}

export type RegionResultsRaw = Array<Record<string, string>>;
export type RegionResults = Array<RegionResult>;

export const parseParam = (param: string) => {
  const spiltted = param.split("<=");
  return { to: parseInt(spiltted[0], 10), from: parseInt(spiltted[2], 10) };
};

export const parseValue = (value: string): RegionResult["value"] => {
  switch (value) {
    case "AllSat":
      return true;
    case "AllViolated":
      return false;
    case "ExistsSat":
      return "partially";
    default:
      return "unknown";
  }
};

export const csvToRegionResultsList = (
  raw: RegionResultsRaw
): RegionResults => {
  return raw.map((result) => {
    const value = parseValue(result["value"]);
    delete result["value"];

    return {
      value,
      params: Object.keys(result).reduce<RegionResult["params"]>(
        (params, param) => ({ ...params, [param]: parseParam(result[param]) }),
        {}
      ),
    };
  });
};
