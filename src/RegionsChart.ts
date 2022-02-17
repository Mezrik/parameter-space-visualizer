import { select, ScaleLinear, extent } from "d3";

import Chart from "./Chart";
import Axis from "./components/Axis/Axis";
import AxisBottom from "./components/Axis/AxisBottom";
import RegionsController from "./controllers/RegionsController";
import { getMarginWithAxes, getParamDomain } from "./helpers/regions";
import { ChartConfig, Margin, RegionDatum } from "./types/general";

class RegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private axisBottom: Axis<ScaleLinear<number, number>>;

  private margin: Margin;

  constructor(
    ctx: CanvasRenderingContext2D,
    config: ChartConfig<RegionDatum<Value>>
  ) {
    super(ctx, config);

    const { width, height } = this;

    this.margin = getMarginWithAxes(
      this.config.options.margin ?? {},
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

    this.axisBottom = new AxisBottom(ctx, this.config.options.axes.x);
  }

  public drawAxes() {
    const { axisBottom, dataController, height, margin } = this;

    const [xScale] = dataController.currentScales;
    const [xParam] = dataController.params ?? [];

    if (xScale && xParam) {
      axisBottom.scale = xScale.scale;
      axisBottom.draw(xScale.extent, height - margin.bottom);
    }
  }

  public draw() {
    const {
      ctx,
      dataController: { regionsBinding },
      config,
    } = this;

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
