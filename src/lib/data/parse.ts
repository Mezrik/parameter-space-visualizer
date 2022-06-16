import { csvParse, DSVRowString, autoType } from 'd3-dsv';
import { ScatterDatum } from '../../types/general';

export type RegionResultValue =
  | 'true'
  | 'false'
  | 'unknown'
  | 'partially_sat'
  | 'partially_violated'
  | 'center_sat'
  | 'center_violated';
export interface RegionResult<T> {
  value: T;
  params: Record<string, { from: number; to: number }>;
}

export type RawCSVObject = Array<Record<string, string | undefined>>;
export type RegionResults<T> = Array<RegionResult<T>>;

export const parseFraction = (fract: string) => {
  if (!fract?.includes('/')) return parseFloat(fract);
  const splitted = fract.split('/');
  return parseInt(splitted[0], 10) / parseInt(splitted[1], 10);
};

export const parseParam = (param: string | undefined) => {
  if (!param) return { from: 0, to: 0 };

  const spiltted = param.split('<=');
  return { from: parseFraction(spiltted[0]), to: parseFraction(spiltted[2]) };
};

export const parseValue = (value: string | undefined): RegionResultValue => {
  if (!value) return 'unknown';

  switch (value.trim()) {
    case 'AllSat':
      return 'true';
    case 'AllViolated':
      return 'false';
    case 'ExistsSat':
      return 'partially_sat';
    case 'ExistsViolated':
      return 'partially_violated';
    case 'CenterSat':
      return 'center_sat';
    case 'CenterViolated':
      return 'center_violated';
    default:
      return 'unknown';
  }
};

const blankChecker = (row: DSVRowString<string>) => {
  const blankRow = Object.keys(row).every(k => !row[k]);
  if (!blankRow) return row;
};

export const rowToRegionResult =
  <Value = RegionResultValue>(parseVal?: (v?: string) => Value) =>
  (rawRow: DSVRowString<string>): RegionResult<Value> | undefined => {
    const row = blankChecker(rawRow);
    if (!row) return;

    const value = (parseVal ?? parseValue)(row['value']) as Value;
    return {
      value,
      params: Object.keys(row).reduce<RegionResult<RegionResultValue>['params']>(
        (params, param) =>
          param !== 'value' ? { ...params, [param]: parseParam(row[param]) } : params,
        {},
      ),
    };
  };

export const csvToRegionResultsList = <Value = RegionResultValue>(
  raw: RawCSVObject,
  parseVal?: (v?: string) => Value,
): RegionResults<Value> => {
  const pFn = rowToRegionResult(parseVal);
  return raw.reduce<RegionResults<Value>>((acc, row) => {
    const p = pFn(row);
    if (p) acc.push(p);
    return acc;
  }, []);
};

export const csvToRegionResults = <Value = RegionResultValue>(
  csv: string,
  parseVal?: (v?: string) => Value,
): RegionResults<Value> => {
  return csvParse(csv, rowToRegionResult(parseVal));
};

export const rowToScatterPoint =
  <Value = RegionResultValue>(parseVal: (v: string) => Value = v => v as unknown as Value) =>
  (rawRow: DSVRowString<string>): ScatterDatum<Value> | undefined => {
    const row = blankChecker(rawRow);
    if (!row) return;

    return {
      value: parseVal(row['value']?.trim()!),

      params: Object.keys(row).reduce<ScatterDatum<Value>['params']>((params, param) => {
        return param !== 'value' && row[param]
          ? { ...params, [param.trim()]: parseFraction(row[param]!) }
          : params;
      }, {}),
    };
  };

export const csvToScatterPointsList = <Value>(
  raw: RawCSVObject,
  parseVal?: (v: string) => Value,
): ScatterDatum<Value>[] => {
  const pFn = rowToScatterPoint(parseVal);
  return raw.reduce<ScatterDatum<Value>[]>((acc, row) => {
    const p = pFn(row);
    if (p) acc.push(p);
    return acc;
  }, []);
};

export const csvToScatterPoints = <Value>(
  csv: string,
  parseVal?: (v: string) => Value,
): ScatterDatum<Value>[] => csvParse(csv, rowToScatterPoint(parseVal));
