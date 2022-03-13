import {
  select,
  Selection,
  BaseType,
  ScaleLinear,
  extent,
  scaleLinear,
  NumberValue,
} from "d3";
import { getParamDomain, getParams } from "../helpers/general";
import { Margin, ParamsTuple, ParamType } from "../types/general";

type ScaleType =
  | {
      scale: ScaleLinear<number, number>;
      extent: [NumberValue, NumberValue];
    }
  | undefined;

export type DataControllerOptions<T> = {
  data: T;
  width: number;
  height: number;
};

class DataController<Datum, Data extends Array<Datum> = Array<Datum>> {
  private dataContainer: Selection<HTMLElement, Data, null, undefined>;
  protected dataBinding?: Selection<BaseType, Datum, HTMLElement, Data>;

  private paramScales: Record<ParamType, ScaleType> = {};
  private _params: ParamsTuple | null = null;

  constructor(opts: DataControllerOptions<Data>, params?: ParamsTuple) {
    const detachedContainer = document.createElement("custom");
    this.dataContainer = select(detachedContainer);
    this._params = params ?? null;

    this._initDataBinding(opts);
    this._initScales(opts);
  }

  private _initDataBinding({ data }: DataControllerOptions<Data>) {
    this.dataBinding = this.dataContainer.selectAll("custom").data(data);
  }

  private _initScales({ data }: DataControllerOptions<Data>) {
    const params = getParams(data);
    params.forEach((param) => {
      const [min, max] = extent(getParamDomain(data, param));

      if (min && max)
        this.paramScales[param] = {
          scale: scaleLinear().domain([min, max]),
          extent: [min, max],
        };
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
