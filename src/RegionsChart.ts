import { select } from "d3-selection";
import { zoomIdentity, ZoomTransform } from "d3-zoom";
import Chart from "./Chart";
import Tooltip from "./components/Tooltip";
import { theme } from "./constants/styles";
import RegionsController from "./controllers/RegionsController";
import { applyParamsFixations } from "./helpers/regions";
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
  private bindDataToArea = false;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    this.config.dataTransform = applyParamsFixations;

    const {
      config: { xMax, yMax },
      chartArea,
    } = this;

    this.dataController = new RegionsController(this.config);

    this.addGrid(this.dataController, theme.colors.white);

    this.g = this.chartArea?.svg
      ?.append("g")
      .attr("width", this.width)
      .attr("height", this.height);

    this.initHighlightLayer();

    let tooltip: Tooltip<RegionDatum<Value>>;
    if (this.g) {
      tooltip = new Tooltip(this.g, (d) => {
        const [xParam, yParam] = this.config.params ?? [];
        return `
        value: ${d.value}</br>
        x-from: ${xParam ? d.params[xParam].from : ""}</br>
        x-to: ${xParam ? d.params[xParam].to : ""}</br>
        y-from: ${yParam ? d.params[yParam].from : ""}</br>
        y-to: ${yParam ? d.params[yParam].to : ""}
      `;
      });
    }

    chartArea?.on("mousemove", (d, [x, y]) => {
      const lastRect = d[d.length - 1];
      if (!lastRect) return;

      this.highlightRect(lastRect);

      tooltip?.showTooltip({ ...lastRect, width: 0, height: 0, x, y });
    });

    chartArea?.on("mouseout", () => {
      this.highlight?.style("display", "none");
      tooltip.hideTooltip();
    });

    this.zoom?.onChange(this.redraw);
    this.zoom?.onChange(() => {
      this.highlight?.style("display", "none");
    });

    this.addAxes(this.dataController);

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
      .attr("stroke", theme.colors.grey)
      .attr("stroke-width", 3);
  }

  public redraw = (transform: ZoomTransform = zoomIdentity) => {
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
      ctx.fillStyle = config?.options?.color?.(d) ?? theme.colors.white;

      const [x, y] = transform.apply([
        parseFloat(node.attr("x")),
        parseFloat(node.attr("y")),
      ]);

      ctx.rect(
        x,
        y,
        parseFloat(node.attr("width")) * transform.k,
        parseFloat(node.attr("height")) * transform.k
      );

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  };

  public reset = () => {
    const {
      config: { xMax, yMax, data },
    } = this;

    // Re-bind the regions, this will reset scales to current params scales
    this.dataController.bindCurrentScalesRange(xMax, yMax);
    this.dataController.bindRegions(data);

    this.redraw();

    this.axes?.redrawAxes();
    this.grid?.redrawGrid();

    const { x, y, w, h } = this.dataController;

    if (this.bindDataToArea) {
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
  };

  public data = (data: RegionDatum<Value>[]) => {
    this.config.data = data;
    this.dataController.initScales(this.config);
    this.reset();
  };

  public bindDataToChartArea = () => {
    this.bindDataToArea = true;
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
  };
}

export default RegionsChart;
