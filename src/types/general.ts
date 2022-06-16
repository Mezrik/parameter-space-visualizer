import { Rect } from '@timohausmann/quadtree-js';
import { HCLColor } from 'd3-color';
import { NumberValue, ScaleLinear } from 'd3-scale';

import { ProbabilityDatum, VariableInterval } from './expression';
import { TickFormatter } from './scale';

export type ParamType = string;
export type Params = { x: ParamType; y?: ParamType } | ParamType;
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
  tooltip?: boolean;
  maxZoomExtent?: number;
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
      tooltip?: boolean;
      maxZoomExtent: number;
    }
  : never;
export interface RegionDatum<Value = unknown> {
  value: Value;
  params: Record<string, { from: NumberValue; to: NumberValue }>;
}

export interface ScatterDatum<Value = unknown> {
  value: Value;
  params: Record<string, NumberValue>;
}

export type ChartConfig<Datum> = {
  data: Array<Datum>;
} & ChartConfigCommon<Datum>;

export type ExpressionConfigPart = {
  expression: string;
  intervals: VariableInterval[];
  data?: never;
};

export type DataConfigPart<Datum> = { expression?: never; intervals?: never; data: Array<Datum> };

export type ChartConfigCommon<Datum> = {
  options?: UserOptions<Datum, NumberValue, NumberValue>;
  width: number;
  height: number;
};

export type ChartConfigDynamic<Datum> = ChartConfigCommon<Datum> &
  (ExpressionConfigPart | DataConfigPart<Datum>);

export type ExpressionConfig = ChartConfigCommon<ScatterDatum<ProbabilityDatum>> &
  ExpressionConfigPart;

export type DataConfig<Value> = ChartConfigCommon<ScatterDatum<Value>> &
  DataConfigPart<ScatterDatum<Value>>;

export type SimpleConfigCommon = {
  el: MountElement;
  width: number;
  height: number;
};

export type SimpleConfigScatter<Value extends string | number | symbol> = (
  | {
      data: ScatterDatum<Value>[];
      expression?: never;
      intervals?: never;
      url?: never;
      colors?: Record<Value, string>;
      parseCSVValue?: never;
    }
  | {
      data?: never;
      expression: string;
      intervals: VariableInterval[];
      url?: never;
      color?: ScaleLinear<HCLColor, string, never>;
      parseCSVValue?: never;
    }
  | {
      data?: never;
      expression?: never;
      intervals?: never;
      url: string;
      colors?: Record<Value, string>;
      parseCSVValue: (v: string) => Value;
    }
) & {} & SimpleConfigCommon;

export type SimpleConfigRegions<Value extends string | number | symbol> = (
  | {
      data: RegionDatum<Value>[];
      url?: never;
      parseCSVValue?: never;
    }
  | { data?: never; url: string; parseCSVValue: (v?: string) => Value }
) & { colors?: Record<Value, string> } & SimpleConfigCommon;

export type MountElement = string | HTMLElement;

export type DatumRect<Datum> = Datum & Rect;

export type DataTransform<Datum> = (data: Datum[], fixs?: ParamsFixation) => Datum[];
