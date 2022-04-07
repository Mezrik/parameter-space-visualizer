import { select, Selection, BaseType, extent, scaleLinear } from "d3";
import { getParamDomain, getParams } from "../helpers/general";
import { ParamsTuple, ParamType } from "../types/general";
import {
  DataControllerScaleTuple,
  DataControllerScaleType,
} from "../types/scale";

export type DataControllerOptions<T> = {
  data: T;
  width: number;
  height: number;
};

class DataController<Datum, Data extends Array<Datum> = Array<Datum>> {
  private paramScales: Record<ParamType, DataControllerScaleType> = {};
  private _params: ParamsTuple | null = null;

  constructor(opts: DataControllerOptions<Data>, params?: ParamsTuple) {
    this._params = params ?? null;

    this.initScales(opts);
  }

  private initScales({ data, width, height }: DataControllerOptions<Data>) {
    const params = getParams(data);

    params.forEach((param) => {
      const [min, max] = extent(getParamDomain(data, param));
      if (typeof min === "number" && typeof max === "number")
        this.paramScales[param] = {
          scale: scaleLinear().domain([min, max]),
          extent: [min, max],
        };
    });

    this.bindCurrentScalesRange(width, height);
  }

  public bindCurrentScalesRange(w: number, h: number) {
    const [xScale, yScale] = this.currentScales;
    xScale?.scale.range([0, w]);
    yScale?.scale.range([h, 0]);
  }

  set params(params: ParamsTuple | null) {
    this._params = params;
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
