import { extent } from "d3-array";
import { ZERO_MARGIN } from "./constants/common";
import {
  checkIfParamsExist,
  getParams,
  getParamsToBeFixed,
  getParamsTuple,
} from "./helpers/general";
import { getParamDomain } from "./helpers/general";
import {
  ChartConfig,
  ChartConfigDynamic,
  Margin,
  Options,
  ParamsFixation,
  ParamsTuple,
  ParamType,
} from "./types/general";

class Config<Datum> {
  private _config: ChartConfig<Datum> | ChartConfigDynamic<Datum>;
  private _margin: Margin = ZERO_MARGIN;

  private _allParams: ParamType[];
  private _paramsExtents: Record<ParamType, [number, number]>;

  private _userFixations: ParamsFixation;

  constructor(config: ChartConfig<Datum> | ChartConfigDynamic<Datum>) {
    this._config = config;

    const m = config.options?.margin;
    this._margin = {
      top: m?.top ?? ZERO_MARGIN.top,
      right: m?.right ?? ZERO_MARGIN.right,
      bottom: m?.bottom ?? ZERO_MARGIN.bottom,
      left: m?.left ?? ZERO_MARGIN.left,
    };

    this._allParams = getParams(this.data);

    this._paramsExtents = this._allParams.reduce(
      (acc, param) => ({
        ...acc,
        [param]: extent(getParamDomain(this.data, param)),
      }),
      {}
    );

    console.log(this._paramsExtents);

    this._userFixations = this._config.options?.paramsFixation ?? {};
  }

  get data() {
    return (
      (this._config as ChartConfig<Datum>).data ??
      (this._config as ChartConfigDynamic<Datum>).intervals
    );
  }

  get params(): ParamsTuple | undefined {
    const dataParams = this._allParams;
    const userParams = getParamsTuple(this._config.options?.params);

    if (userParams && checkIfParamsExist(dataParams, userParams))
      return userParams;

    const [x, y] = dataParams;
    return [x, y ? y : undefined];
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
          tickStrokeColor: opts?.axes?.x.tickStrokeColor ?? "#000",
          tickCount: opts?.axes?.x.tickCount ?? 10,
          tickSize: opts?.axes?.x.tickSize ?? 6,
        },
        y: {
          tickFontSize: opts?.axes?.x.tickFontSize ?? 10,
          tickStrokeColor: opts?.axes?.x.tickStrokeColor ?? "#000",
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
