import { ScaleLinear, select, Selection } from "d3";

import Chart from "./Chart";
import { ZERO_MARGIN } from "./constants/common";
import RegionsController from "./controllers/RegionsController";
import Zoom from "./controllers/Zoom";
import { xAxisFactory, yAxisFactory } from "./helpers/axis";
import {
  ChartConfig,
  DatumRect,
  Margin,
  MountElement,
  RegionDatum,
} from "./types/general";
import { SimpleSelection } from "./types/selection";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private highlight?: SimpleSelection<SVGRectElement>;
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;
  private zoom?: Zoom<
    HTMLCanvasElement,
    ScaleLinear<number, number, never>,
    ScaleLinear<number, number, never>
  >;

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
    this.initZoom();

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

  private initZoom() {
    const [xScale, yScale] = this.dataController.currentScales;
    if (xScale) {
      this.zoom = new Zoom(xScale.scale, yScale?.scale, [1, 10]);
      this.chartArea?.canvas.call(this.zoom?.zoom);

      this.zoom.onChange(this.redrawAxes);
    }
  }

  private redrawAxes = (
    xScale: ScaleLinear<number, number>,
    yScale?: ScaleLinear<number, number>
  ) => {
    const { height, margin } = this;

    this.gx?.call(xAxisFactory(height, margin, xScale));

    if (yScale) this.gy?.call(yAxisFactory(margin, yScale));
  };

  private initAxes() {
    const { svg, height, margin } = this;
    const [xScale, yScale] = this.dataController.currentScales;

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx = svg?.append("g").call(xAxisFactory(height, margin, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale)
      this.gy = svg?.append("g").call(yAxisFactory(margin, yScale.scale));
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
