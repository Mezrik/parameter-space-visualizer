import { AnyD3Scale, ScaleInput } from "../../types/scale";
import Axis from "./Axis";

class AxisBottom<Scale extends AnyD3Scale> extends Axis<Scale> {
  public draw([start, end]: [ScaleInput<Scale>, ScaleInput<Scale>]) {
    const { ctx, ticks, _scale, axisConfig, ticksFormatter } = this;
    console.log(ticks, _scale, ticksFormatter);
    if (!ticks || !_scale || !ticksFormatter) return;

    console.log(ticks);

    ctx.strokeStyle = axisConfig.tickStrokeColor;

    ctx.beginPath();
    ticks.forEach((d) => {
      ctx.moveTo(_scale(d), 0);
      ctx.lineTo(_scale(d), axisConfig.tickSize);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start, axisConfig.tickSize);
    ctx.lineTo(start, 0);
    ctx.lineTo(end, 0);
    ctx.lineTo(end, axisConfig.tickSize);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = axisConfig.tickStrokeColor;
    ticks.forEach((d) => {
      ctx.beginPath();
      ctx.fillText(ticksFormatter(d) ?? "", _scale(d), axisConfig.tickSize);
    });
  }
}

export default AxisBottom;
