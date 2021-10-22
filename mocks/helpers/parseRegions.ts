export type RegionResultValue = "true" | "false" | "unknown" | "partially";
export interface RegionResult {
  value: RegionResultValue;
  params: Record<string, { from: number; to: number }>;
}

export type RegionResultsRaw = Array<Record<string, string>>;
export type RegionResults = Array<RegionResult>;

export const parseFraction = (fract: string) => {
  if (!fract.includes("/")) return parseInt(fract, 10);
  const splitted = fract.split("/");
  return parseInt(splitted[0], 10) / parseInt(splitted[1], 10);
};

export const parseParam = (param: string) => {
  const spiltted = param.split("<=");
  return { from: parseFraction(spiltted[0]), to: parseFraction(spiltted[2]) };
};

export const parseValue = (value: string): RegionResult["value"] => {
  switch (value) {
    case "AllSat":
      return "true";
    case "AllViolated":
      return "false";
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

    return {
      value,
      params: Object.keys(result).reduce<RegionResult["params"]>(
        (params, param) =>
          param !== "value"
            ? { ...params, [param]: parseParam(result[param]) }
            : params,
        {}
      ),
    };
  });
};
