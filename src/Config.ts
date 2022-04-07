import {
  checkIfParamsExist,
  getParams,
  getParamsTuple,
} from "./helpers/general";
import { ChartConfig, Options, ParamsTuple } from "./types/general";

class Config<Datum> {
  private _config: ChartConfig<Datum>;

  constructor(config: ChartConfig<Datum>) {
    this._config = config;
  }

  get data() {
    return this._config.data;
  }

  get params(): ParamsTuple | undefined {
    const dataParams = getParams(this.data);
    const userParams = getParamsTuple(this._config.options?.params);

    if (userParams && checkIfParamsExist(dataParams, userParams))
      return userParams;

    const [x, y] = dataParams;
    return [x, y ? y : undefined];
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
