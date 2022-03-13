import { select, zoomIdentity, ZoomTransform } from "d3";

import Chart from "./Chart";
import RegionsController from "./controllers/RegionsController";
import Zoom from "./controllers/Zoom";
import { xAxisFactory, yAxisFactory } from "./helpers/axis";
import {
  ChartConfig,
  DatumRect,
  MountElement,
  RegionDatum,
} from "./types/general";
import { AnyD3Scale } from "./types/scale";
import { SimpleSelection } from "./types/selection";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private highlight?: SimpleSelection<SVGRectElement>;
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;
  private zoom?: Zoom<HTMLCanvasElement>;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    const { xMax, yMax, chartArea } = this;

    this.dataController = new RegionsController(
      {
        width: xMax,
        height: yMax,
        data: this.config.data,
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
    const { xMax, yMax } = this;

    const [xScale] = this.dataController.currentScales;
    if (xScale) {
      this.zoom = new Zoom(
        [1, 10],
        [
          [0, 0],
          [xMax, yMax],
        ]
      );
      this.chartArea?.canvas.call(this.zoom?.zoom);

      this.zoom.onChange(this.redrawAxes);
      this.zoom.onChange(this.redraw);
    }
  }

  private redrawAxes = (transform: ZoomTransform) => {
    const { yMax } = this;
    const [xScale, yScale] = this.dataController.currentScales;

    if (!xScale) return;

    this.gx?.call(
      xAxisFactory(yMax, transform.rescaleX(xScale.scale) as AnyD3Scale)
    );

    if (yScale)
      this.gy?.call(
        yAxisFactory(transform.rescaleY(yScale.scale) as AnyD3Scale)
      );
  };

  private initAxes() {
    const { svg, yMax } = this;
    const [xScale, yScale] = this.dataController.currentScales;

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx = svg?.append("g").call(xAxisFactory(yMax, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) this.gy = svg?.append("g").call(yAxisFactory(yScale.scale));
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

  private redraw = (transform: ZoomTransform = zoomIdentity) => {
    const {
      chartArea,
      dataController: { regionsBinding },
      config,
      width,
      height,
    } = this;

    const ctx = chartArea?.context;

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    regionsBinding?.each((d, i, nodes) => {
      const node = select(nodes[i]);

      ctx.beginPath();
      ctx.fillStyle = config?.options?.color?.(d) ?? "#fff";

      const [x, y] = transform.apply([
        parseInt(node.attr("x"), 10),
        parseInt(node.attr("y"), 10),
      ]);

      ctx.rect(
        x,
        y,
        parseInt(node.attr("width"), 10) * transform.k,
        parseInt(node.attr("height"), 10) * transform.k
      );

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  };
}

export default RegionsChart;
