import { BaseType, Selection } from "d3-selection";

import { ParamsTuple } from "../types/general";
import DataController, { DataControllerOptions } from "./DataController";

class ProbabilitySamplingController<Value> extends DataController<number> {
  private _regionsBinding?: Selection<BaseType, number, HTMLElement, number[]>;

  constructor(opts: DataControllerOptions<number[]>, params?: ParamsTuple) {
    super(opts, params);

    const { width, height } = opts;

    this.bindRegions(width, height);
  }

  public bindRegions(w: number, h: number) {
    const [xScale, yScale] = this.currentScales;

    if (!xScale) return;

    xScale?.scale.range([0, w]);
    yScale?.scale.range([h, 0]);

    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this.dataBinding
      ?.join("custom")
      .classed(".region", true)
      .attr("x", this.x)
      .attr("y", this.y);
  }

  get regionsBinding() {
    return this._regionsBinding;
  }
}

export default ProbabilitySamplingController;
