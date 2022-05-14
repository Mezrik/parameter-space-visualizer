import { scaleLinear } from 'd3-scale';
import Config from '../Config';
import { ParamsTuple, ParamType } from '../types/general';
import { DataManagerScaleTuple, DataManagerScaleType } from '../types/scale';
class DataManager<Datum> {
  private paramScales: Record<ParamType, DataManagerScaleType> = {};
  protected config: Config<Datum>;

  constructor(config: Config<Datum>) {
    this.config = config;

    this.initScales(config);
  }

  public initScales(config: Config<Datum>) {
    const { allParams, paramsExtents, xMax, yMax } = config;
    allParams.forEach(param => {
      const [min, max] = paramsExtents[param];
      if (typeof min === 'number' && typeof max === 'number')
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

  get currentScales(): DataManagerScaleTuple {
    if (!this.config.params) return [undefined, undefined];

    const [x, y] = this.config.params;
    return [this.paramScales[x], y ? this.paramScales[y] : undefined];
  }
}

export default DataManager;
