import { extent } from "d3-array";
import { ZERO_MARGIN } from "./constants/common";
import { theme } from "./constants/styles";
import {
  checkIfParamsExist,
  getDifParams,
  getParams,
  getParamsToBeFixed,
  getParamsTuple,
} from "./helpers/general";
import { getParamDomain } from "./helpers/general";
import {
  ChartConfig,
  ChartConfigDynamic,
  DataTransform,
  Margin,
  Options,
  ParamsFixation,
  ParamsTuple,
  ParamType,
} from "./types/general";

class Config<Datum> {
  private _config: ChartConfig<Datum> | ChartConfigDynamic<Datum>;
  private _margin: Margin = ZERO_MARGIN;

  private _allParams!: ParamType[];
  private _params: ParamsTuple | undefined | null = null;
  private _paramsExtents!: Record<ParamType, [number, number]>;

  private _userFixations: ParamsFixation;

  private _transfomData?: DataTransform<Datum>;
  private _transfromedData: Datum[] | undefined;

  constructor(config: ChartConfig<Datum> | ChartConfigDynamic<Datum>) {
    this._config = config;

    const m = config.options?.margin;
    this._margin = {
      top: m?.top ?? ZERO_MARGIN.top,
      right: m?.right ?? ZERO_MARGIN.right,
      bottom: m?.bottom ?? ZERO_MARGIN.bottom,
      left: m?.left ?? ZERO_MARGIN.left,
    };

    this._params = getParamsTuple(this._config.options?.params);

    this.setAllParams(this.data);

    this._userFixations = this._config.options?.paramsFixation ?? {};
  }

  private setAllParams(data: Datum[]) {
    this._allParams = getParams(data);

    this._paramsExtents = this._allParams.reduce(
      (acc, param) => ({
        ...acc,
        [param]: extent(getParamDomain(data, param)),
      }),
      {}
    );
  }

  private setTransformedData(fixations: ParamsFixation) {
    const data = (this._config as ChartConfig<Datum>).data;
    if (this._transfomData && data)
      this._transfromedData = this._transfomData(data, fixations);

    this._config.options?.handleFixationChange?.(fixations);
  }

  get data() {
    return (
      this._transfromedData ??
      (this._config as ChartConfig<Datum>).data ??
      (this._config as ChartConfigDynamic<Datum>).intervals
    );
  }

  set data(data: Datum[]) {
    if ("data" in this._config) {
      this._config.data = data;
      this.setAllParams(data);
      this.paramsFixation && this.setTransformedData(this.paramsFixation);
    }
  }

  get params(): ParamsTuple | undefined | null {
    const dataParams = this._allParams;
    const userParams = this._params;

    if (userParams && checkIfParamsExist(dataParams, userParams))
      return userParams;

    const [x, y] = dataParams;
    return [x, y ? y : undefined];
  }

  set params(params: ParamsTuple | undefined | null) {
    let result: ParamsTuple | null = null;
    if (params) result = getDifParams(this.allParams, params, this._params);

    this._config.options?.handleParamsChange?.(result);

    this._params = result;

    this.paramsFixation && this.setTransformedData(this.paramsFixation);
  }

  get paramsFixation() {
    if (!this.params) return undefined;
    return getParamsToBeFixed(
      this.params,
      this._allParams,
      this._paramsExtents,
      this._userFixations
    );
  }

  set userFixations(fixations: ParamsFixation) {
    this._userFixations = fixations;

    this.paramsFixation && this.setTransformedData(this.paramsFixation);
  }

  set dataTransform(tranformData: DataTransform<Datum>) {
    this._transfomData = tranformData;
    this.paramsFixation && this.setTransformedData(this.paramsFixation);
  }

  get options(): Options<ChartConfig<Datum>["options"]> {
    const opts = this._config.options;
    return {
      ...(opts ?? {}),
      margin: {
        top: opts?.margin?.top ?? 0,
        right: opts?.margin?.right ?? 0,
        bottom: opts?.margin?.bottom ?? 0,
        left: opts?.margin?.left ?? 0,
      },
      axes: {
        x: {
          tickFontSize: opts?.axes?.x.tickFontSize ?? 10,
          tickStrokeColor: opts?.axes?.x.tickStrokeColor ?? theme.colors.black,
          tickCount: opts?.axes?.x.tickCount ?? 10,
          tickSize: opts?.axes?.x.tickSize ?? 6,
        },
        y: {
          tickFontSize: opts?.axes?.x.tickFontSize ?? 10,
          tickStrokeColor: opts?.axes?.x.tickStrokeColor ?? theme.colors.black,
          tickCount: opts?.axes?.x.tickCount ?? 10,
          tickSize: opts?.axes?.x.tickSize ?? 6,
        },
      },
    };
  }

  get margin() {
    return this._margin;
  }

  get allParams() {
    return this._allParams;
  }

  get paramsExtents() {
    return this._paramsExtents;
  }

  get width() {
    return this._config.width;
  }

  get height() {
    return this._config.height;
  }

  get xMax() {
    const { margin, width } = this;
    return width - margin.left - margin.right;
  }

  get yMax() {
    const { margin, height } = this;
    return height - margin.top - margin.bottom;
  }
}

export default Config;
