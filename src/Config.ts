import {
  checkIfParamsExist,
  getParams,
  getParamsTuple,
} from "./helpers/general";
import { ChartConfig, ParamsTuple } from "./types/general";

class Config<Datum> {
  private _config: ChartConfig<Datum>;

  constructor(config: ChartConfig<Datum>) {
    this._config = config;
  }

  get data() {
    return this._config.data;
  }

  get params(): ParamsTuple | undefined {
    if (!this.data.length) return undefined;

    const dataParams = getParams(this.data);
    const userParams = getParamsTuple(this._config.options?.params);

    if (userParams && checkIfParamsExist(dataParams, userParams))
      return userParams;
    const [x, y] = dataParams;

    return [x, y ? y : undefined];
  }

  get options() {
    return this._config.options;
  }
}

export default Config;
