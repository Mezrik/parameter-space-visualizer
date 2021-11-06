export const checkIfParamsExist = (
  existing: string[],
  p: [string, string] | string
) =>
  Array.isArray(p)
    ? existing.includes(p[0]) && existing.includes(p[1])
    : existing.includes(p);

export const reverseExtent = ([a, b]: [number, number]) => [b, a];
