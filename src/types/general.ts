import { NumberValue } from "d3-scale";
import { TickFormatter } from "./scale";

export type ParamType = string;
export type Params = { x: ParamType; y: ParamType } | ParamType;
export type ParamsTuple = [ParamType, ParamType] | [ParamType, undefined];

export type Margin = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

export type AxesConfig<ScaleInput> = {
  tickSize?: number;
  tickCount?: number;
  tickFormatter?: TickFormatter<ScaleInput>;
  tickStrokeColor?: string;
};

export type Options<Datum, XScaleInput, YScaleInput> = {
  params?: Params;
  margin?: Margin;
  color?: (d: Datum) => string;
  axes?: { x: AxesConfig<XScaleInput>; y?: AxesConfig<YScaleInput> };
};

export interface RegionDatum<Value = unknown> {
  value: Value;
  params: Record<string, { from: NumberValue; to: NumberValue }>;
}

export type ChartConfig<Datum> = {
  options?: Options<Datum, NumberValue, NumberValue>;
  data: Array<Datum>;
};
