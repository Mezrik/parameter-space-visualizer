import { BaseType, select, Selection } from "d3-selection";
import { UNDEFINED_CHART_VALUE } from "../constants/common";
import { RegionDatum, ParamsTuple, Margin } from "../types/general";
import DataController, { DataControllerOptions } from "./DataController";

class RegionsController<Value> extends DataController<RegionDatum<Value>> {
  private dataContainer: Selection<
    HTMLElement,
    RegionDatum<Value>[],
    null,
    undefined
  >;
  private _regionsBinding?: Selection<
    BaseType,
    RegionDatum<Value>,
    HTMLElement,
    RegionDatum<Value>[]
  >;

  constructor(
    opts: DataControllerOptions<RegionDatum<Value>[]>,
    params?: ParamsTuple
  ) {
    super(opts, params);

    const { width, height } = opts;

    this.dataContainer = select(document.createElement("custom"));

    this._regionsBinding = this.dataContainer
      .selectAll("custom")
      .data(opts.data);

    this.bindRegions(width, height);
  }

  public x = (d: RegionDatum<Value>) => {
    const [xScale] = this.currentScales;

    return this.params && xScale
      ? xScale.scale(d.params[this.params[0]].from)
      : UNDEFINED_CHART_VALUE;
  };

  public y = (d: RegionDatum<Value>) => {
    const [, yScale] = this.currentScales;

    return this.params && this.params[1] && yScale
      ? yScale.scale(d.params[this.params[1]].to)
      : UNDEFINED_CHART_VALUE;
  };

  public w = (d: RegionDatum<Value>) => {
    const [xScale] = this.currentScales;

    return this.params && xScale
      ? xScale.scale(d.params[this.params[0]].to) -
          xScale.scale(d.params[this.params[0]].from)
      : UNDEFINED_CHART_VALUE;
  };

  public h = (d: RegionDatum<Value>) => {
    const [, yScale] = this.currentScales;

    return this.params && this.params[1] && yScale
      ? yScale.scale(d.params[this.params[1]].from) -
          yScale.scale(d.params[this.params[1]].to)
      : UNDEFINED_CHART_VALUE;
  };

  public bindRegions(w: number, h: number) {
    const [xScale, yScale] = this.currentScales;

    if (!xScale) return;

    xScale?.scale.range([0, w]);
    yScale?.scale.range([h, 0]);

    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this._regionsBinding
      ?.join("custom")
      .classed(".region", true)
      .attr("x", this.x)
      .attr("y", this.y)
      .attr("width", this.w)
      .attr("height", this.h);
  }

  get regionsBinding() {
    return this._regionsBinding;
  }
}

export default RegionsController;
