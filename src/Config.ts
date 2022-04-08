import { extent } from "d3-array";
import {
  checkIfParamsExist,
  getParams,
  getParamsTuple,
} from "./helpers/general";
import { getParamDomain } from "./helpers/general";
import { ChartConfig, Options, ParamsTuple, ParamType } from "./types/general";

class Config<Datum> {
  private _config: ChartConfig<Datum>;
  private allParams: ParamType[];
  private paramsExtents: Record<ParamType, [number, number]>;

  constructor(config: ChartConfig<Datum>) {
    this._config = config;

    this.allParams = getParams(this.data);

    this.paramsExtents = this.allParams.reduce(
      (acc, param) => ({
        ...acc,
        [param]: extent(getParamDomain(this.data, param)),
      }),
      {}
    );
  }

  get data() {
    return this._config.data;
  }

  get params(): ParamsTuple | undefined {
    const dataParams = this.allParams;
    const userParams = getParamsTuple(this._config.options?.params);

    if (userParams && checkIfParamsExist(dataParams, userParams))
      return userParams;

    const [x, y] = dataParams;
    return [x, y ? y : undefined];
  }

  get paramsFixation() {
    if (!this.params) return undefined;

    const [xParam, yParam] = this.params;
    const userFixations = this._config.options?.paramsFixation;

    const toBeFixed = this.allParams.filter(
      (param) =>
        param !== xParam &&
        param !== yParam &&
        !Object.keys(userFixations ?? {}).find((name) => name === param)
    );

    console.log(toBeFixed, xParam, yParam, userFixations, this.allParams);

    return {
      ...(userFixations ?? {}),
      ...toBeFixed.reduce(
        (acc, param) => ({ ...acc, [param]: this.paramsExtents[param][0] }),
        {}
      ),
    };
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
}

export default Config;
