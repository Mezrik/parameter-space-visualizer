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
  if (!fract?.includes('/')) return parseInt(fract, 10);
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

export const csvToRegionResultsList = (raw: RawCSVObject): RegionResults<RegionResultValue> => {
  return raw.map(result => {
    const value = parseValue(result['value']);
    return {
      value,
      params: Object.keys(result).reduce<RegionResult<RegionResultValue>['params']>(
        (params, param) =>
          param !== 'value' ? { ...params, [param]: parseParam(result[param]) } : params,
        {},
      ),
    };
  });
};

export const csvToScatterPointsList = <Value>(raw: RawCSVObject): ScatterDatum<Value>[] => {
  // TODO
  return [
    { value: true, params: { q: 0.2, p: 0.1 } },
    { value: true, params: { q: 0.35, p: 0.12 } },
    { value: true, params: { q: 0.1, p: 0.153 } },
    { value: true, params: { q: 0.22, p: 0.125 } },
  ];
  // return raw.map(result => {
  //   // TODO
  // });
};
