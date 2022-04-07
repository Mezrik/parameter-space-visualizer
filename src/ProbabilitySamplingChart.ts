import { select } from "d3-selection";
import m from "math-expression-evaluator";
import Chart from "./Chart";
import ScatterController from "./controllers/ScatterController";
import { createVariableTokens } from "./helpers/expression";
import { EvalFunction, VariableInterval } from "./types/expression";
import { ChartConfigDynamic, MountElement } from "./types/general";

const POINT_RADIUS = 5;

class ProbabilitySamplingChart extends Chart<VariableInterval> {
  private dataController: ScatterController;
  private expression: EvalFunction;

  constructor(
    element: MountElement,
    config: ChartConfigDynamic<VariableInterval>
  ) {
    super(element, { ...config, data: config.intervals });

    const { xMax, yMax } = this;

    this.expression = (pair) =>
      parseInt(
        m.eval(
          config.expression,
          config.intervals.map(({ name }) => createVariableTokens(name)),
          pair
        ),
        10
      );

    this.dataController = new ScatterController(
      { width: xMax, height: yMax },
      config.intervals,
      this.config.params
    );

    this.redraw();
    this.addAxes(this.dataController.currentScales);
  }

  public redraw() {
    const {
      chartArea,
      dataController: { binding },
      config,
      width,
      height,
    } = this;

    const ctx = chartArea?.context;

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    binding.each((d, i, nodes) => {
      const node = select(nodes[i]);

      ctx.beginPath();
      ctx.fillStyle = config?.options?.color?.(d) ?? "#000";
      ctx.arc(
        parseInt(node.attr("x"), 10),
        parseInt(node.attr("y"), 10),
        POINT_RADIUS,
        0,
        2 * Math.PI
      );

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  }
}

export default ProbabilitySamplingChart;
