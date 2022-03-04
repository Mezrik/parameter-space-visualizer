import { select, ScaleLinear, extent } from "d3";

import Chart from "./Chart";
import Axis from "./components/Axis/Axis";
import AxisBottom from "./components/Axis/AxisBottom";
import AxisLeft from "./components/Axis/AxisLeft";
import RegionsController from "./controllers/RegionsController";
import { getMarginWithAxes, getParamDomain } from "./helpers/regions";
import {
  ChartConfig,
  Margin,
  MountElement,
  RegionDatum,
} from "./types/general";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private axisBottom?: Axis<ScaleLinear<number, number>>;
  private axisLeft?: Axis<ScaleLinear<number, number>>;

  private margin: Margin;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    const { width, height, chartArea } = this;

    this.margin = getMarginWithAxes(
      this.config.options.margin ?? {},
      this.config.options.axes.x.tickFontSize,
      this.config.options.axes.x.tickSize
    );

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

    // TODO: Rework axes to svg
    const ctx = chartArea?.context;

    chartArea?.on("mousemove", (d) => console.log(d));

    if (ctx) {
      this.axisBottom = new AxisBottom(ctx, this.config.options.axes.x);

      if (this.config.options.axes.y) {
        this.axisLeft = new AxisLeft(ctx, this.config.options.axes.y);
      }
    }
  }

  public drawAxes() {
    const { axisBottom, axisLeft, dataController, height, margin } = this;

    const [xScale, yScale] = dataController.currentScales;
    const [xParam, yParam] = dataController.params ?? [];

    if (xScale && xParam && axisBottom) {
      axisBottom.scale = xScale.scale;
      axisBottom.draw(xScale.extent, height - margin.bottom);
    }

    if (yScale && yParam && axisLeft) {
      axisLeft.scale = yScale.scale;
      axisLeft.draw(yScale.extent, margin.left);
    }
  }

  public draw() {
    const {
      chartArea,
      dataController: { regionsBinding },
      config,
    } = this;

    const ctx = this.chartArea?.context;

    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();

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

    this.drawAxes();
  }
}

export default RegionsChart;
