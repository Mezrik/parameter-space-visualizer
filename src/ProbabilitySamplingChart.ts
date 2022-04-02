import m from "math-expression-evaluator";
import Chart from "./Chart";
import { createVariableTokens } from "./helpers/expression";
import { EvalFunction } from "./types/expression";
import { ChartConfigDynamic, MountElement } from "./types/general";

class ProbabilitySamplingChart extends Chart<number> {
  private expression: EvalFunction;

  constructor(element: MountElement, config: ChartConfigDynamic<number>) {
    super(element, { ...config, data: [] });

    this.expression = (pair) =>
      parseInt(
        m.eval(
          config.expression,
          config.intervals.map(({ name }) => createVariableTokens(name)),
          pair
        ),
        10
      );

    console.log(this.expression({ pL: 2, pK: 4 }));
  }
}

export default ProbabilitySamplingChart;
