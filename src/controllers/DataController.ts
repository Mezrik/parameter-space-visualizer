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
  private config: Config<Datum>;

  constructor(config: Config<Datum>) {
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

  set params(params: ParamsTuple | undefined | null) {
    this.config.params = params;
  }

  get params(): ParamsTuple | undefined | null {
    return this.config.params;
  }

  get currentScales(): DataControllerScaleTuple {
    if (!this.config.params) return [undefined, undefined];

    const [x, y] = this.config.params;
    return [this.paramScales[x], y ? this.paramScales[y] : undefined];
  }
}

export default DataController;
