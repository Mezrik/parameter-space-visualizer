import d3 from "d3";
import Config from "./Config";
import { getParamDomain, reverseExtent } from "./helpers/general";
import { ChartData } from "./types";

class DataController<T> {
  protected config: Config<T>;
  protected scaleX?: d3.ScaleContinuousNumeric<number, number>;
  protected scaleY?: d3.ScaleContinuousNumeric<number, number>;
  protected detachedContainer?: HTMLElement;
  protected dataContainer?: d3.Selection<
    HTMLElement,
    ChartData<T>,
    null,
    undefined
  >;

  constructor(config: Config<T>) {
    this.config = config;
  }

  paramExtent(param: string) {
    return d3.extent(getParamDomain(this.config.data, param)) as [
      number,
      number
    ];
  }

  initialize(w: number, h: number) {
    const params = this.config.params;
    if (!params) return;
    const [xParam, yParam] = params;

    this.scaleX = d3.scaleLinear(this.paramExtent(xParam)).range([0, w]);
    if (yParam) {
      this.scaleY = d3
        .scaleLinear()
        .domain(reverseExtent(this.paramExtent(yParam)))
        .range([0, h]);
    }

    this.detachedContainer = document.createElement("custom");
    this.dataContainer = d3.select(this.detachedContainer);
  }
}

export default DataController;
