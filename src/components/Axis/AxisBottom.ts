import { AnyD3Scale, ScaleInput } from "../../types/scale";
import Axis from "./Axis";

class AxisBottom<Scale extends AnyD3Scale> extends Axis<Scale> {
  public draw(
    [start, end]: [ScaleInput<Scale>, ScaleInput<Scale>],
    offset: number = 0
  ) {
    const { ctx, ticks, _scale, axisConfig, ticksFormatter } = this;
    if (!ticks || !_scale || !ticksFormatter) return;

    ctx.strokeStyle = axisConfig.tickStrokeColor;

    ctx.beginPath();
    ticks.forEach((d) => {
      ctx.moveTo(_scale(d), offset);
      ctx.lineTo(_scale(d), offset);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start, offset);
    ctx.lineTo(start, offset);
    ctx.lineTo(end, offset);
    ctx.lineTo(end, offset);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = axisConfig.tickStrokeColor;
    ticks.forEach((d) => {
      ctx.beginPath();
      ctx.fillText(ticksFormatter(d) ?? "", _scale(d), offset);
    });
  }
}

export default AxisBottom;
