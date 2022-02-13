import Config from "./Config";
import { ChartConfig } from "./types";

class Chart<T extends string> {
  protected ctx: CanvasRenderingContext2D;
  protected config: Config<T>;
  private _width: number;
  private _height: number;

  constructor(context: CanvasRenderingContext2D, config: ChartConfig<T>) {
    this.ctx = context;
    this.config = new Config(config);

    const { height, width } = context.canvas;
    this._height = height;
    this._width = width;
  }

  _init() {}

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default Chart;
