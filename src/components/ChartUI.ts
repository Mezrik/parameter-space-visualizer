import Chart from '../Chart';
import { DEFAULT_CHART_MARGIN } from '../constants/common';
import { theme } from '../constants/styles';
import { addStyle, rem } from '../lib/ui/general';
import { appendParamFixInputs } from '../lib/ui/paramFixInputs';
import { appendParamsSelects } from '../lib/ui/paramsSelects';
import { FixationChangeHandler, ParamsChangeHandler } from '../types/general';

class ChartUI {
  private root: HTMLElement;
  private controls?: HTMLDivElement;

  public handleParamsChange?: ParamsChangeHandler;
  public handleFixationChange?: FixationChangeHandler;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public initChartUI(chart: Chart<any>) {
    if (this.controls) this.controls.remove();

    this.root.classList.add('parameter-space-visualization');

    addStyle(
      `
      body {
        --doc-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
        'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .parameter-space-visualization {
        display: flex;
        flex-direction: column-reverse;
        padding: 1rem;
        width: 800px;
        font-family: ${theme.font};
      }
    `,
      'parameter-space-visualization-styles',
    );

    const controls = document.createElement('div');
    controls.classList.add('chart-controls');

    addStyle(
      `
    .chart-controls {
      display: flex;
      margin-left: ${rem(DEFAULT_CHART_MARGIN.left)};
    }

    .chart-controls > * + * {
      margin-left: 2rem;
    }
  `,
      'styled-chart-controls',
    );

    if (chart.params) {
      this.handleParamsChange = appendParamsSelects(
        controls,
        chart.allParams,
        chart.x,
        chart.params[0],
        chart.y,
        chart.params[1],
      );
    }

    if (chart.paramFixations) {
      this.handleFixationChange = appendParamFixInputs(
        controls,
        chart.paramFixations,
        chart.fixate,
      );
    }

    this.root.appendChild(controls);

    this.controls = controls;
  }
}

export default ChartUI;
