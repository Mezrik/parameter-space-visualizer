import { NumberValue } from "d3-scale";
import { TickFormatter } from "./scale";

export type ParamType = string;
export type Params = { x: ParamType; y: ParamType } | ParamType;
export type ParamsTuple = [ParamType, ParamType] | [ParamType, undefined];

export type UserMargin = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

export type UserAxesConfig<ScaleInput> = {
  tickFontSize?: number;
  tickCount?: number;
  tickFormatter?: TickFormatter<ScaleInput>;
  tickStrokeColor?: string;
  tickSize?: number;
};

export type UserOptions<Datum, XScaleInput, YScaleInput> = {
  params?: Params;
  margin?: UserMargin;
  color?: (d: Datum) => string;
  axes?: { x: UserAxesConfig<XScaleInput>; y?: UserAxesConfig<YScaleInput> };
};

export type Margin = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export type AxesConfig<ScaleInput> = UserAxesConfig<ScaleInput> & {
  tickFontSize: number;
  tickSize: number;
  tickCount: number;
  tickStrokeColor: string;
};

export type Options<UOpts> = UOpts extends UserOptions<
  infer Datum,
  infer XScaleInput,
  infer YScaleInput
>
  ? {
      params?: Params;
      margin: Margin;
      color?: (d: Datum) => string;
      axes: {
        x: AxesConfig<XScaleInput>;
        y?: AxesConfig<YScaleInput>;
      };
    }
  : never;
export interface RegionDatum<Value = unknown> {
  value: Value;
  params: Record<string, { from: NumberValue; to: NumberValue }>;
}

export type ChartConfig<Datum> = {
  options?: UserOptions<Datum, NumberValue, NumberValue>;
  data: Array<Datum>;
};
