import { select } from "d3-selection";
import Chart from "./Chart";
import RegionsController from "./controllers/RegionsController";
import { ChartConfig } from "./types";

class RegionsChart extends Chart<string> {
  private dataController: RegionsController;

  constructor(ctx: CanvasRenderingContext2D, config: ChartConfig<string>) {
    super(ctx, config);

    const { width, height } = this;

    this.dataController = new RegionsController(
      {
        width,
        height,
        data: this.config.data,
      },
      this.config.params
    );
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
      ctx.fillStyle = config?.options?.color?.(d.value) ?? "#fff";

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
