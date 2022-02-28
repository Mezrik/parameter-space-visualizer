import { AnyD3Scale, ScaleInput } from "../../types/scale";
import Axis from "./Axis";

class AxisBottom<Scale extends AnyD3Scale> extends Axis<Scale> {
  public draw(
    [start, end]: [ScaleInput<Scale>, ScaleInput<Scale>],
    y: number = 0
  ) {
    const { ctx, ticks, _scale, axisConfig, ticksFormatter } = this;
    if (!ticks || !_scale || !ticksFormatter) return;

    ctx.strokeStyle = axisConfig.tickStrokeColor;

    ctx.beginPath();
    ticks.forEach((d) => {
      ctx.moveTo(_scale(d), y);
      ctx.lineTo(_scale(d), y + axisConfig.tickSize);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start, y + axisConfig.tickSize);
    ctx.lineTo(start, y);
    ctx.lineTo(end, y);
    ctx.lineTo(end, y + axisConfig.tickSize);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = axisConfig.tickStrokeColor;
    ctx.font = `${axisConfig.tickFontSize}px sans-serif`;
    ticks.forEach((d) => {
      ctx.beginPath();
      ctx.fillText(ticksFormatter(d) ?? d, _scale(d), y + axisConfig.tickSize);
    });
  }
}

export default AxisBottom;
