import { RegionResults } from "@mocks/helpers/parseRegions";
import { extent, scaleLinear, select } from "d3";
import { checkIfParamsExist, reverseExtent } from "./helpers/general";
import { getParamDomain, getParams } from "./helpers/regionsTransforms";

class Chart<T extends string> {
  private chart;
  private data: RegionResults<T>; // TODO: Add generic type
  private colorMap: Record<T, string>;

  // In memory only element (not attached to DOM)
  private detachedContainer: HTMLElement;
  // D3 selection for the detached container
  private dataContainer;

  constructor(
    w: number,
    h: number,
    data: RegionResults<T>,
    colorMap: Record<T, string>
  ) {
    this.chart = select("body")
      .append("canvas")
      .attr("width", w)
      .attr("height", h);

    this.data = data;
    this.colorMap = colorMap;

    this.detachedContainer = document.createElement("custom");
    this.dataContainer = select<HTMLElement, typeof data>(
      this.detachedContainer
    );
  }

  // TODO: Explore memoization options for optimization
  get params() {
    return getParams(this.data);
  }

  paramExtent(param: string) {
    return extent(getParamDomain(this.data, param)) as [number, number];
  }

  public render(xParam: string, yParam: string) {
    if (!checkIfParamsExist(this.params, [xParam, yParam])) return; // TODO: Throw error?

    const xScale = scaleLinear()
      .domain(this.paramExtent(xParam))
      .range([0, this.chart.node()?.width ?? 0]);

    const yScale = scaleLinear()
      .domain(reverseExtent(this.paramExtent(yParam)))
      .range([0, this.chart.node()?.height ?? 0]);

    const dataBinding = this.dataContainer
      .selectAll("custom.rect")
      .data(this.data);

    dataBinding
      .enter()
      .append("custom")
      .classed("rect", true)
      .attr("fill", (d) => this.colorMap[d.value])
      .attr("x", (d) => xScale(d.params[xParam].from))
      .attr("y", (d) => yScale(d.params[yParam].to))
      .attr(
        "width",
        (d) => xScale(d.params[xParam].to) - xScale(d.params[xParam].from)
      )
      .attr(
        "height",
        (d) => yScale(d.params[yParam].from) - yScale(d.params[yParam].to)
      );

    const context = this.chart.node()?.getContext("2d");

    if (!context) return; // TODO: Error?

    context.fillStyle = "#fff";
    context.rect(
      0,
      0,
      parseInt(this.chart.attr("width"), 10),
      parseInt(this.chart.attr("height"), 10)
    );
    context.fill();

    const elements = this.dataContainer.selectAll("custom.rect");
    elements.each(function (d) {
      var node = select(this);

      context.beginPath();
      context.fillStyle = node.attr("fill");
      context.rect(
        parseInt(node.attr("x"), 10),
        parseInt(node.attr("y"), 10),
        parseInt(node.attr("width"), 10),
        parseInt(node.attr("height"), 10)
      );
      context.fill();
      context.closePath();
    });
  }
}

export default Chart;
