import { BaseType, Selection } from "d3-selection";
import { RegionDatum, ParamsTuple } from "../types/general";
import DataController, { DataControllerOptions } from "./DataController";

class RegionsController<Value> extends DataController<RegionDatum<Value>> {
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

    this._initRegionsBinding(width, height);
  }

  private _initRegionsBinding(w: number, h: number) {
    const params = this.params;
    const [xScale, yScale] = this.currentScales;

    if (!params || !xScale) return;

    const [xParam, yParam] = params;

    xScale?.scale.range([0, w]);
    yScale?.scale.range([0, h]);

    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this.dataBinding
      ?.join("custom")
      .classed(".region", true)
      .attr("x", (d) => xScale.scale(d.params[xParam].from))
      .attr("y", (d) =>
        yParam && yScale ? yScale.scale(d.params[yParam].to) : 0
      )
      .attr(
        "width",
        (d) =>
          xScale.scale(d.params[xParam].to) -
          xScale.scale(d.params[xParam].from)
      )
      .attr("height", (d) =>
        yParam && yScale
          ? yScale.scale(d.params[yParam].from) -
            yScale.scale(d.params[yParam].to)
          : 0
      );
  }

  get regionsBinding() {
    return this._regionsBinding;
  }
}

export default RegionsController;
