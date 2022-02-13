import {
  select,
  Selection,
  BaseType,
  ScaleLinear,
  extent,
  scaleLinear,
} from "d3";
import { getParamDomain, getParams } from "../helpers/general";
import { ChartData, ParamsTuple, ParamType } from "../types";

type ScaleType = ScaleLinear<number, number> | undefined;

export type Options<T> = {
  data: T;
  width: number;
  height: number;
};

class DataController<Type extends ChartData, Datum extends Array<Type>> {
  private dataContainer: Selection<HTMLElement, Datum, null, undefined>;
  protected dataBinding?: Selection<BaseType, Type, HTMLElement, Datum>;

  private paramScales: Record<ParamType, ScaleType> = {};
  private _params: ParamsTuple | null = null;

  constructor(opts: Options<Datum>, params?: ParamsTuple) {
    const detachedContainer = document.createElement("custom");
    this.dataContainer = select(detachedContainer);
    this._params = params ?? null;

    this._initDataBinding(opts);
    this._initScales(opts);
  }

  private _initDataBinding({ data }: Options<Datum>) {
    this.dataBinding = this.dataContainer.selectAll("custom").data(data);
  }

  private _initScales({ data }: Options<Datum>) {
    const params = getParams(data);
    params.forEach((param) => {
      const [min, max] = extent(getParamDomain(data, param));

      if (min && max)
        this.paramScales[param] = scaleLinear().domain([min, max]);
    });
  }

  set params(params: ParamsTuple | null) {
    this._params = params;
  }

  get params(): ParamsTuple | null {
    return this._params;
  }

  get currentScales(): [ScaleType, ScaleType] {
    if (!this._params) return [undefined, undefined];

    const [x, y] = this._params;
    return [this.paramScales[x], y ? this.paramScales[y] : undefined];
  }
}

export default DataController;
