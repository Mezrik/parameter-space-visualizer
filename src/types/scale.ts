import {
  ScaleBand,
  ScaleLinear,
  ScaleTime,
  ScaleLogarithmic,
  ScalePower,
  ScaleSymLog,
  ScaleRadial,
  ScaleQuantile,
  ScaleQuantize,
  ScaleThreshold,
  ScaleOrdinal,
  ScalePoint,
} from "d3";

type ValueOf<Scale> = Scale[keyof Scale];

export interface AnyD3Scales {
  linear: ScaleLinear<any, any>;
  log: ScaleLogarithmic<any, any>;
  pow: ScalePower<any, any>;
  sqrt: ScalePower<any, any>;
  symlog: ScaleSymLog<any, any>;
  radial: ScaleRadial<any, any>;
  time: ScaleTime<any, any>;
  utc: ScaleTime<any, any>;
  quantile: ScaleQuantile<any>;
  quantize: ScaleQuantize<any>;
  threshold: ScaleThreshold<any, any>;
  ordinal: ScaleOrdinal<any, any>;
  point: ScalePoint<any>;
  band: ScaleBand<any>;
}

export type ScaleInput<Scale extends AnyD3Scale> = Parameters<Scale>[0];

export type TickFormatter<T> = (value: T) => string | undefined;
/**
 * A catch-all type for all D3 scales.
 */
export declare type AnyD3Scale = ValueOf<AnyD3Scales>;
