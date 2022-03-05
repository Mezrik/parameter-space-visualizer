import { select, Selection } from "d3";

import Chart from "./Chart";
import { ZERO_MARGIN } from "./constants/common";
import RegionsController from "./controllers/RegionsController";
import { xAxisFactory, yAxisFactory } from "./helpers/axis";
import {
  ChartConfig,
  DatumRect,
  Margin,
  MountElement,
  RegionDatum,
} from "./types/general";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private highlight?: Selection<SVGRectElement, unknown, null, undefined>;

  private margin: Margin = ZERO_MARGIN;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    const { width, height, chartArea } = this;
    this.margin = this.config.options?.margin ?? this.margin;

    this.dataController = new RegionsController(
      {
        width,
        height,
        data: this.config.data,
        margin: this.margin,
      },
      this.config.params
    );

    const { x, y, w, h } = this.dataController;

    this.chartArea?.data(
      this.config.data.map((d) => ({
        ...d,
        x: x(d),
        y: y(d),
        width: w(d),
        height: h(d),
      }))
    );

    chartArea?.on("mousemove", (d) => {
      this.redraw();
      d.forEach((rect) => this.highlightRect(rect));
    });

    this.initAxes();
    this.initHighlightLayer();

    this.redraw();
  }

  public highlightRect({ x, y, width, height }: DatumRect<RegionDatum<Value>>) {
    const { highlight } = this;

    if (!highlight) return;

    highlight
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height);
  }

  private initAxes() {
    const { svg, height, margin } = this;
    const [xScale, yScale] = this.dataController.currentScales;

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    svg?.append("g").call(xAxisFactory(height, margin, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) svg?.append("g").call(yAxisFactory(margin, yScale.scale));
  }

  private initHighlightLayer() {
    this.highlight = this.chartArea?.svg
      ?.append("g")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("rect");

    this.highlight
      ?.attr("fill", "transparent")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
  }

  private redraw() {
    const {
      chartArea,
      dataController: { regionsBinding },
      config,
    } = this;

    const ctx = chartArea?.context;

    if (!ctx) return;

    regionsBinding?.each((d, i, nodes) => {
      const node = select(nodes[i]);

      ctx.beginPath();
      ctx.fillStyle = config?.options?.color?.(d) ?? "#fff";

      ctx.rect(
        parseInt(node.attr("x"), 10),
        parseInt(node.attr("y"), 10),
        parseInt(node.attr("width"), 10),
        parseInt(node.attr("height"), 10)
      );
      ctx.fill();
      ctx.closePath();
    });
  }
}

export default RegionsChart;
