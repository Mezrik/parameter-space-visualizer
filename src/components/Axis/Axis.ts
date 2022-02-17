import { getTicks, getTicksFormatter } from "../../helpers/scale";
import { AxesConfig } from "../../types/general";
import { AnyD3Scale, ScaleInput, TickFormatter } from "../../types/scale";

abstract class Axis<Scale extends AnyD3Scale> {
  protected ctx: CanvasRenderingContext2D;
  protected axisConfig: AxesConfig<ScaleInput<Scale>> & {
    tickSize: number;
    tickStrokeColor: string;
  };

  protected ticks?: ScaleInput<Scale>[];
  protected ticksFormatter?: TickFormatter<ScaleInput<Scale>>;
  protected _scale?: Scale;

  constructor(
    ctx: CanvasRenderingContext2D,
    config: AxesConfig<ScaleInput<Scale>>
  ) {
    this.ctx = ctx;

    this.axisConfig = {
      ...config,
      tickSize: config.tickSize ?? 12,
      tickStrokeColor: config.tickStrokeColor ?? "#000",
    };
  }

  set scale(scale: Scale) {
    this._scale = scale;
    this.ticks = getTicks(scale, this.axisConfig.tickCount);
    this.ticksFormatter =
      this.axisConfig.tickFormatter ?? getTicksFormatter(scale);
  }

  abstract draw(extent: [ScaleInput<Scale>, ScaleInput<Scale>]): void;
}

export default Axis;
