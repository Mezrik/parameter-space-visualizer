import { Rect } from "@timohausmann/quadtree-js";
import { NumberValue } from "d3-scale";

import { VariableInterval } from "./expression";
import { TickFormatter } from "./scale";

export type ParamType = string;
export type Params = { x: ParamType; y: ParamType } | ParamType;
export type ParamsTuple = [ParamType, ParamType] | [ParamType, undefined];
export type ParamsFixation = Record<ParamType, number | string>;
export type ParamsChangeHandler = (p: ParamsTuple | null) => void;

export type FixationChangeHandler = (f: ParamsFixation) => void;

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

export type UserGridConfig = {
  color?: string;
};

export type UserOptions<Datum, XScaleInput, YScaleInput> = {
  params?: Params;
  paramsFixation?: ParamsFixation;
  handleParamsChange?: ParamsChangeHandler;
  handleFixationChange?: FixationChangeHandler;
  margin?: UserMargin;
  color?: (d: Datum) => string;
  axes?: { x: UserAxesConfig<XScaleInput>; y?: UserAxesConfig<YScaleInput> };
  grid?: { x?: UserGridConfig; y?: UserGridConfig };
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
      handleParamsChange?: ParamsChangeHandler;
      handleFixationChange?: FixationChangeHandler;
      color?: (d: Datum) => string;
      axes: {
        x: AxesConfig<XScaleInput>;
        y?: AxesConfig<YScaleInput>;
      };
      grid?: { x?: UserGridConfig; y?: UserGridConfig };
    }
  : never;
export interface RegionDatum<Value = unknown> {
  value: Value;
  params: Record<string, { from: NumberValue; to: NumberValue }>;
}

export type ChartConfig<Datum> = {
  options?: UserOptions<Datum, NumberValue, NumberValue>;
  data: Array<Datum>;
  width: number;
  height: number;
};

export type ChartConfigDynamic<Datum> = {
  options?: UserOptions<Datum, NumberValue, NumberValue>;
  expression: string;
  intervals: VariableInterval[];
  width: number;
  height: number;
};

export type MountElement = string | HTMLElement;

export type DatumRect<Datum> = Datum & Rect;

export type DataTransform<Datum> = (
  data: Datum[],
  fixs?: ParamsFixation
) => Datum[];
