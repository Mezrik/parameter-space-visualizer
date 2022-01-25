import Config from "./Config";
import { ChartConfig } from "./types";

class Chart<T extends string> {
  private ctx: CanvasRenderingContext2D;
  private config: Config<T>;
  private width: number;
  private height: number;

  constructor(context: CanvasRenderingContext2D, config: ChartConfig<T>) {
    this.ctx = context;
    this.config = new Config(config);

    const canvas = context.canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    this._initialize();
  }

  private _initialize() {}
}

export default Chart;
