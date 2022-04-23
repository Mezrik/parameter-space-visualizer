import { select } from "d3-selection";
import { zoomIdentity } from "d3-zoom";
import m from "math-expression-evaluator";
import Chart from "./Chart";
import ScatterController from "./controllers/ScatterController";
import {
  createStubProbabilityData,
  createVariableTokens,
} from "./helpers/expression";
import { EvalFunction, ProbabilityDatum } from "./types/expression";
import {
  ChartConfigDynamic,
  MountElement,
  ParamsFixation,
} from "./types/general";

const POINT_RADIUS = 5;

class ProbabilitySamplingChart extends Chart<ProbabilityDatum> {
  private dataController: ScatterController;
  private expression: EvalFunction;

  constructor(
    element: MountElement,
    config: ChartConfigDynamic<ProbabilityDatum>
  ) {
    super(element, config);

    const {
      config: { xMax, yMax },
    } = this;

    this.expression = (pair) =>
      m.eval(
        config.expression,
        config.intervals.map(({ name }) => createVariableTokens(name)),
        pair
      );

    this.dataController = new ScatterController(this.config);

    this.redraw();
    this.addAxes(this.dataController.currentScales);

    this.zoom?.onChange(this.redraw);
  }

  public redraw = (transform = zoomIdentity) => {
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

    const [xCoordScale, yCoordScale] = this.dataController.coordsScales;

    if (!this.config.params) return;

    const [xParam, yParam] = this.config.params;

    const fixedParams = this.config.paramsFixation;

    binding.each((d, i, nodes) => {
      const node = select(nodes[i]);
      const x = parseInt(node.attr("x"), 10);
      const y = parseInt(node.attr("y"), 10);
      const [xT, yT] = transform.apply([x, y]);

      console.log(xT, yT);

      const pair: Record<string, number | string> = {
        [xParam]: xCoordScale(xT),
        ...fixedParams,
      };

      if (yParam) pair[yParam] = yCoordScale(yT);

      ctx.beginPath();
      ctx.fillStyle =
        config?.options?.color?.({
          value: this.expression(pair),
          name: "val",
        }) ?? "#000";
      ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  };

  public reset = () => {
    // TODO
  };
}

export default ProbabilitySamplingChart;
