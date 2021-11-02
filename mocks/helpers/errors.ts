import * as R from "ramda";

export const checkIfParamsIsArray: (
  val: [string, string] | string
) => boolean = R.is(Array);

export const checkIfParamsExist = (params: string[]) =>
  R.ifElse(
    checkIfParamsIsArray,
    ([x, y]: [string, string]) =>
      R.and(R.contains(x, params), R.contains(y, params)),
    (x: string) => R.contains(x, params)
  );

const test = checkIfParamsExist(["test"])([""]);
