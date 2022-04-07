import { BaseType, select, Selection } from "d3-selection";
import { UNDEFINED_CHART_VALUE } from "../constants/common";
import { RegionDatum, ParamsTuple, Margin } from "../types/general";
import DataController, { DataControllerOptions } from "./DataController";

class RegionsController<Value> extends DataController<RegionDatum<Value>> {
  private _regionsBinding: Selection<
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

    const detachedContainer = select<HTMLElement, RegionDatum<Value>[]>(
      document.createElement("custom")
    );

    this._regionsBinding = detachedContainer
      .selectAll("custom")
      .data(opts.data);

    this.bindRegions();
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

  public bindRegions() {
    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this._regionsBinding
      .join("custom")
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
