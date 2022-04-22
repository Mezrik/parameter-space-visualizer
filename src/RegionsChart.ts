import { select, zoomIdentity, ZoomTransform } from "d3";

import Chart from "./Chart";
import Tooltip from "./components/Tooltip";
import RegionsController from "./controllers/RegionsController";
import {
  ChartConfig,
  DatumRect,
  MountElement,
  RegionDatum,
} from "./types/general";
import { SimpleSelection } from "./types/selection";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private g?: SimpleSelection<SVGGElement>;
  private highlight?: SimpleSelection<SVGRectElement>;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    const {
      config: { xMax, yMax },
      chartArea,
    } = this;

    this.dataController = new RegionsController(this.config);

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

    this.g = this.chartArea?.svg
      ?.append("g")
      .attr("width", this.width)
      .attr("height", this.height);

    let tooltip: Tooltip<RegionDatum<Value>>;
    if (this.g) {
      const [xParam, yParam] = this.dataController.params ?? [];
      const [xScale, yScale] = this.dataController.currentScales;

      tooltip = new Tooltip(
        this.g,
        (d) => `
        value: ${d.value}</br>
        x-from: ${
          xParam && xScale ? xScale.scale(d.params[xParam].from) : ""
        }</br>
        x-to: ${xParam && xScale ? xScale.scale(d.params[xParam].to) : ""}</br>
        y-from: ${
          yParam && yScale ? yScale.scale(d.params[yParam].from) : ""
        }</br>
        y-to: ${yParam && yScale ? yScale.scale(d.params[yParam].to) : ""}
      `
      );
    }

    chartArea?.on("mousemove", (d, [x, y]) => {
      const lastRect = d[d.length - 1];
      if (!lastRect) return;

      this.highlightRect(lastRect);

      tooltip?.showTooltip({ ...lastRect, width: 0, height: 0, x, y });
    });

    this.zoom?.onChange(this.redraw);
    this.zoom?.onChange(() => {
      this.highlight?.style("display", "none");
    });

    this.addAxes(this.dataController.currentScales);

    this.initHighlightLayer();
    this.redraw();
  }

  public highlightRect({ x, y, width, height }: DatumRect<RegionDatum<Value>>) {
    const { highlight } = this;

    if (!highlight) return;

    highlight
      .style("display", "initial")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height);
  }

  private initHighlightLayer() {
    this.highlight = this.g?.append("rect");

    this.highlight
      ?.attr("fill", "transparent")
      .attr("stroke", "#9b9b9b")
      .attr("stroke-width", 3);
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

  private reset() {
    const {
      config: { xMax, yMax },
    } = this;

    // Re-bind the regions, this will reset scales to current params scales
    this.dataController.bindCurrentScalesRange(xMax, yMax);
    this.dataController.bindRegions();

    this.redraw();

    this.axes?.updateScales(this.dataController.currentScales);
    this.axes?.redrawAxes();

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
  }

  /**
   * Change param displayed on axis x
   * @param param
   */
  public x = (param: string) => {
    const { params } = this.dataController;
    this.dataController.params = [param, params?.[1]];
    this.reset();
  };

  /**
   * Change param displayed on axis y
   * @param param
   */
  public y = (param?: string) => {
    const { params } = this.dataController;
    if (params) {
      this.dataController.params = [params?.[0], param];
      this.reset();
    }
  };
}

export default RegionsChart;
