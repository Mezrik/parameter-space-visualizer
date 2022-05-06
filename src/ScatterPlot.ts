import { BaseType, select, Selection } from 'd3-selection';
import { zoomIdentity } from 'd3-zoom';
import m from 'math-expression-evaluator';
import * as Comlink from 'comlink';

import Chart from './Chart';
import { theme } from './constants/styles';
import ScatterGridController from './controllers/ScatterGridController';
import ScatterController from './controllers/ScatterController';
import { createVariableTokens, isVariableIntervalData } from './helpers/expression';
import { EvalFunction, ProbabilityDatum } from './types/expression';
import {
  ChartConfigDynamic,
  DataConfig,
  ExpressionConfig,
  FixationChangeHandler,
  MountElement,
  ParamsChangeHandler,
  ScatterDatum,
  SimpleConfigScatter,
  UserOptions,
} from './types/general';
import Config from './Config';
import DataController from './controllers/DataController';
import { DataWorker } from './lib/workers';
import { DataStreamWorker } from './lib/data/dataStreamWorker';
import { addLoadingOverlay } from './lib/ui/loadingOverlay';
import { getDOMNode } from './helpers/general';
import { csvToScatterPointsList } from './lib/data/parse';
import { addStyle, rem } from './lib/ui/general';
import { NumberValue } from 'd3-scale';
import { DEFAULT_CHART_MARGIN, DEFAUL_COLOR_SCALE } from './constants/common';
import { appendParamsSelects } from './lib/ui/paramsSelects';
import { appendParamFixInputs } from './lib/ui/paramFixInputs';
import ChartUI from './components/ChartUI';

const POINT_RADIUS = 5;

const isDataConfigInstance = <Value>(
  config: Config<any>,
): config is Config<ScatterDatum<Value>> => {
  const data = (config as Config<ScatterDatum<Value>>).data;
  return data && !isVariableIntervalData(data);
};

const isExpConfigInstance = (config: Config<any>): config is Config<ProbabilityDatum> => {
  const data = (config as Config<ProbabilityDatum>).data;
  return data && isVariableIntervalData(data);
};

const isDataConfig = <Value>(config: ChartConfigDynamic<any>): config is DataConfig<Value> => {
  const data = (config as DataConfig<Value>).data;
  return data && !isVariableIntervalData((config as DataConfig<Value>).data);
};

const isExpConfig = (config: ChartConfigDynamic<any>): config is ExpressionConfig => {
  const data = (config as ExpressionConfig).intervals;
  return data && isVariableIntervalData((config as ExpressionConfig).intervals);
};

const isScatterDatum = <Value>(d: Datum<Value>): d is ScatterDatum<Value> => {
  return (
    typeof (d as ScatterDatum<Value>).params !== 'undefined' &&
    typeof (d as ScatterDatum<Value>).value !== 'undefined'
  );
};

type Datum<Value> = ScatterDatum<Value> | ProbabilityDatum;

export class CustomScatterPlot<Value> extends Chart<Datum<Value>> {
  private dataController!: ScatterController<Value> | ScatterGridController;
  private expression?: EvalFunction;

  constructor(element: MountElement, config: ChartConfigDynamic<Datum<Value>>) {
    super(element, config);

    if (isDataConfig<Value>(config)) this.initWithData(config);
    else if (isExpConfig(config)) this.initWithExpression(config);

    this.redraw();

    const controller = this.dataController as DataController<Datum<Value>>;

    this.addAxes(controller);
    this.addGrid(controller, theme.colors.black);

    this.zoom?.onChange(this.redraw);
  }

  private initWithData(_config: DataConfig<Value>) {
    if (!isDataConfigInstance<Value>(this.config)) return;

    this.dataController = new ScatterController(this.config);
  }

  private initWithExpression(_config: ExpressionConfig) {
    if (!isExpConfigInstance(this.config)) return;

    this.dataController = new ScatterGridController(this.config);

    this.expression = pair =>
      m.eval(
        _config.expression,
        _config.intervals.map(({ name }) => createVariableTokens(name)),
        pair,
      );
  }

  private draw(
    transform = zoomIdentity,
    binding: Selection<BaseType, any, HTMLElement, any[]>,
    fillStyle: (xT: number, yT: number, d: any) => string,
    xAccessor: (x: number, xT: number) => number,
    yAccessor: (y: number, yT: number) => number,
  ) {
    const { chartArea, width, height } = this;
    console.log(binding);
    const ctx = chartArea?.context;

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    binding.each((d, i, nodes) => {
      const node = select(nodes[i]);
      const x = parseInt(node.attr('x'), 10);
      const y = parseInt(node.attr('y'), 10);
      const [xT, yT] = transform.apply([x, y]);

      ctx.beginPath();
      ctx.fillStyle = fillStyle(xT, yT, d);
      ctx.arc(xAccessor(x, xT), yAccessor(y, yT), POINT_RADIUS, 0, 2 * Math.PI);

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  }

  public redraw = (transform = zoomIdentity) => {
    const {
      dataController: { binding },
      config,
    } = this;

    const coordsScales = (this.dataController as ScatterGridController).coordsScales;

    if (!this.config.params) return;

    const [xParam, yParam] = this.config.params;

    const fixedParams = this.config.paramsFixation;

    let fillStyle = (xT: number, yT: number, d: ScatterDatum<Value>) => {
      console.log(d);
      return config?.options?.color?.(d) ?? theme.colors.black;
    };

    let xAccessor = (_: number, xT: number) => xT;
    let yAccessor = (_: number, yT: number) => yT;

    if (coordsScales) {
      const [xCoordScale, yCoordScale] = coordsScales;

      fillStyle = (xT: number, yT: number) => {
        const pair: Record<string, number | string> = {
          [xParam]: xCoordScale(xT),
          ...fixedParams,
        };

        if (yParam) pair[yParam] = yCoordScale(yT);

        return (
          config?.options?.color?.({
            value: this.expression?.(pair) ?? '',
            name: 'val',
          }) ?? theme.colors.black
        );
      };

      xAccessor = (x: number) => x;
      yAccessor = (y: number) => y;
    }

    this.draw(transform, binding, fillStyle, xAccessor, yAccessor);
  };

  public reset = () => {
    const {
      config: { xMax, yMax },
    } = this;

    // Re-bind the regions, this will reset scales to current params scales
    this.dataController.bindCurrentScalesRange(xMax, yMax);

    if (isDataConfigInstance(this.config))
      this.dataController.bindScatter(this.config.data as ScatterDatum<Value>[]);

    this.redraw();

    this.axes?.redrawAxes();
    this.grid?.redrawGrid();
  };

  public data = (data: ScatterDatum<Value>[]) => {
    console.log(data);
    if (!isDataConfigInstance<Value>(this.config)) return;

    this.config.data = data;
    // @ts-ignore
    this.dataController.initScales(this.config);
    this.reset();
  };
}

export default class ScatterPlot<Value> {
  private root: HTMLElement;
  private chart: CustomScatterPlot<Value>;
  private chartUI: ChartUI;

  constructor({
    el,
    width,
    height,
    expression,
    intervals,
    data,
    ...rest
  }: SimpleConfigScatter<Value>) {
    const node = getDOMNode(el);
    if (node) this.root = node;
    else {
      this.root = document.createElement('div');
      document.appendChild(this.root);
    }

    this.chartUI = new ChartUI(this.root);

    const commonConfig = { width, height };
    const options: UserOptions<ScatterDatum<Value> | ProbabilityDatum, NumberValue, NumberValue> = {
      handleParamsChange: (...args) => this.chartUI.handleParamsChange?.(...args),
      handleFixationChange: (...args) => this.chartUI.handleFixationChange?.(...args),
      margin: DEFAULT_CHART_MARGIN,
    };

    if (expression && intervals)
      this.chart = new CustomScatterPlot(this.root, {
        ...commonConfig,
        expression,
        intervals,
        options: {
          ...options,
          color: ({ value }) => {
            return typeof value === 'number' ? DEFAUL_COLOR_SCALE(value) : theme.colors.white;
          },
        },
      });
    else {
      // if not expression, data or url must be defined
      this.chart = new CustomScatterPlot(this.root, {
        ...commonConfig,
        data: data ?? [],
        options: {
          ...options,
          color: d =>
            isScatterDatum(d) ? rest.color?.(d) ?? theme.colors.black : theme.colors.black,
        },
      });

      if (rest.url) this.fetchData(rest.url, rest.parseCSVValue);
    }

    this.chartUI.initChartUI(this.chart);
  }

  private async fetchData(url: string, parseValue: (v: string) => Value) {
    const worker = new DataWorker();
    const proxy = Comlink.wrap<DataStreamWorker>(worker);
    const data: ScatterDatum<Value>[] = [];

    const loadingOverlay = addLoadingOverlay(this.root);

    const finalData = await proxy.streamData(
      url,
      Comlink.proxy(values => {
        const parsed = csvToScatterPointsList<Value>(values, parseValue);
        Array.prototype.push.apply(data, parsed);
        this.chart.data(data);
        this.chartUI.initChartUI(this.chart);
      }),
    );

    this.chart.data(csvToScatterPointsList<Value>(finalData, parseValue));
    this.chartUI.initChartUI(this.chart);

    loadingOverlay.remove();

    proxy[Comlink.releaseProxy]();
  }
}
