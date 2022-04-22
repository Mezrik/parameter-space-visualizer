import { scaleLinear } from "d3";
import Config from "../Config";
import { getDifParams } from "../helpers/general";
import { ParamsTuple, ParamType } from "../types/general";
import {
  DataControllerScaleTuple,
  DataControllerScaleType,
} from "../types/scale";
class DataController<Datum> {
  private paramScales: Record<ParamType, DataControllerScaleType> = {};
  private _params: ParamsTuple | null = null;
  private config: Config<Datum>;

  constructor(config: Config<Datum>) {
    this._params = config.params ?? null;
    this.config = config;

    this.initScales(config);
  }

  private initScales(config: Config<Datum>) {
    const { allParams, paramsExtents, xMax, yMax } = config;

    allParams.forEach((param) => {
      const [min, max] = paramsExtents[param];
      if (typeof min === "number" && typeof max === "number")
        this.paramScales[param] = {
          scale: scaleLinear().domain([min, max]),
          extent: [min, max],
        };
    });

    this.bindCurrentScalesRange(xMax, yMax);
  }

  public bindCurrentScalesRange(w: number, h: number) {
    const [xScale, yScale] = this.currentScales;
    xScale?.scale.range([0, w]);
    yScale?.scale.range([h, 0]);
  }

  set params(params: ParamsTuple | null) {
    let result: ParamsTuple | null = null;
    if (params)
      result = getDifParams(this.config.allParams, params, this.params);

    this.config.options.handleParamsChange?.(result);

    console.log(params);
    this._params = result;
  }

  get params(): ParamsTuple | null {
    return this._params;
  }

  get currentScales(): DataControllerScaleTuple {
    if (!this._params) return [undefined, undefined];

    const [x, y] = this._params;
    return [this.paramScales[x], y ? this.paramScales[y] : undefined];
  }
}

export default DataController;
