import { select, Selection, BaseType, ScaleLinear, scaleLinear } from "d3";
import { VariableInterval } from "../types/expression";
import { ParamsTuple } from "../types/general";
import DataController from "./DataController";

class ScatterController extends DataController<any> {
  private _scatterBinding: Selection<BaseType, any, HTMLElement, []>;
  private distributionScales: [
    ScaleLinear<number, number>,
    ScaleLinear<number, number>
  ];
  private density: number;

  constructor(
    dimensions: { width: number; height: number },
    intervals: VariableInterval[],
    params?: ParamsTuple,
    density = 10
  ) {
    super({ ...dimensions, data: intervals }, params);

    const detachedContainer = select<HTMLElement, []>(
      document.createElement("custom")
    );

    this._scatterBinding = detachedContainer
      .selectAll("custom")
      .data(new Array(density * density));

    const distDom = [0, density - 1];
    this.distributionScales = [
      scaleLinear().domain(distDom).range([0, dimensions.width]),
      scaleLinear().domain(distDom).range([0, dimensions.height]),
    ];
    this.density = density;

    this.bindScatter();
  }

  public bindScatter() {
    const [xDist, yDist] = this.distributionScales;
    this._scatterBinding = this._scatterBinding
      .join("custom")
      .classed(".region", true)
      .attr("x", (_, i) => xDist(Math.floor(i / this.density)))
      .attr("y", (_, i) => yDist(i % this.density));
  }

  get binding() {
    return this._scatterBinding;
  }
}

export default ScatterController;
