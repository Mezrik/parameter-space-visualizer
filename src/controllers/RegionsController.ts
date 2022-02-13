import { BaseType, Selection } from "d3-selection";
import { ChartData, ParamsTuple } from "../types";
import DataController, { Options } from "./DataController";

type DataType = ChartData<string>;

class RegionsController extends DataController<DataType, DataType[]> {
  private _regionsBinding?: Selection<
    BaseType,
    DataType,
    HTMLElement,
    DataType[]
  >;

  constructor(opts: Options<DataType[]>, params?: ParamsTuple) {
    super(opts, params);

    const { width, height } = opts;

    this._initRegionsBinding(width, height);
  }

  private _initRegionsBinding(w: number, h: number) {
    const params = this.params;
    const [xScale, yScale] = this.currentScales;

    if (!params || !xScale) return;

    const [xParam, yParam] = params;

    xScale?.range([0, w]);
    yScale?.range([0, h]);

    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this.dataBinding
      ?.join("custom")
      .classed(".region", true)
      .attr("x", (d) => xScale(d.params[xParam].from))
      .attr("y", (d) => (yParam && yScale ? yScale(d.params[yParam].to) : 0))
      .attr(
        "width",
        (d) => xScale(d.params[xParam].to) - xScale(d.params[xParam].from)
      )
      .attr("height", (d) =>
        yParam && yScale
          ? yScale(d.params[yParam].from) - yScale(d.params[yParam].to)
          : 0
      );
  }

  get regionsBinding() {
    return this._regionsBinding;
  }
}

export default RegionsController;
