import { AnyD3Scale, ScaleInput } from "../../types/scale";
import Axis from "./Axis";

class AxisLeft<Scale extends AnyD3Scale> extends Axis<Scale> {
  public draw(
    [start, end]: [ScaleInput<Scale>, ScaleInput<Scale>],
    x: number = 0
  ) {
    const { ctx, ticks, _scale, axisConfig, ticksFormatter } = this;
    if (!ticks || !_scale || !ticksFormatter) return;

    ctx.strokeStyle = axisConfig.tickStrokeColor;

    ctx.beginPath();
    ticks.forEach((d) => {
      ctx.moveTo(x, _scale(d));
      ctx.lineTo(x - axisConfig.tickSize, _scale(d));
    });
    ctx.stroke();

    console.log("here");
    ctx.beginPath();
    ctx.moveTo(x - axisConfig.tickSize, start);
    ctx.lineTo(x, start);
    ctx.lineTo(x, end);
    ctx.lineTo(x - axisConfig.tickSize, end);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = axisConfig.tickStrokeColor;
    ctx.font = `${axisConfig.tickFontSize}px sans-serif`;
    ticks.forEach((d) => {
      ctx.beginPath();
      ctx.fillText(
        ticksFormatter(d) ?? d,
        x - axisConfig.tickSize - 3,
        _scale(d)
      );
    });
  }
}

export default AxisLeft;
