import { BaseType, pointer, select, Selection } from 'd3-selection';
import { zoomIdentity } from 'd3-zoom';
import m from 'math-expression-evaluator';
import * as Comlink from 'comlink';

import Chart from './Chart';
import { theme } from './constants/styles';
import ScatterGridManager from './managers/ScatterGridManager';
import ScatterManager from './managers/ScatterManager';
import {
  applyParamsFixations,
  createVariableTokens,
  isVariableIntervalData,
} from './helpers/scatter';
import { EvalFunction, ProbabilityDatum, Token } from './types/expression';
import {
  ChartConfigDynamic,
  DataConfig,
  DataTransform,
  ExpressionConfig,
  FixationChangeHandler,
  MountElement,
  ParamsChangeHandler,
  ScatterDatum,
  SimpleConfigScatter,
  UserOptions,
} from './types/general';
import Config from './Config';
import DataManager from './managers/DataManager';
import { DataWorker, SamplingWorker } from './lib/workers';
import { DataStreamWorker } from './lib/data/dataStreamWorker';
import { addLoadingOverlay } from './lib/ui/loadingOverlay';
import { getDOMNode, getNodeXY } from './helpers/general';
import { csvToScatterPointsList } from './lib/data/parse';
import { applyStyles } from './lib/ui/general';
import { NumberValue, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { DEFAULT_CHART_MARGIN, DEFAUL_COLOR_SCALE } from './constants/common';
import { MAX_DENSITY, POINT_RADIUS } from './constants/scatter';
import ChartUI from './components/ChartUI';
import { ChartAreaDelaunayManager } from './managers/ChartAreaDataManager';
import { SimpleSelection } from './types/selection';
import { SamplingWorkerType } from './lib/data/samplingWorker';
import Tooltip from './components/Tooltip';
import { createChartLegend, createGradientChartLegend } from './lib/ui/legend';

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
    d &&
    typeof (d as ScatterDatum<Value>).params !== 'undefined' &&
    typeof (d as ScatterDatum<Value>).value !== 'undefined'
  );
};

type Datum<Value> = ScatterDatum<Value> | ProbabilityDatum;

type Point<Value> = Datum<Value> & { x: number; y: number };

export class CustomScatterPlot<Value> extends Chart<Datum<Value>> {
  private _dataManager!: ScatterManager<Value> | ScatterGridManager;
  private chartAreaDataManager?: ChartAreaDelaunayManager<Point<Value>>;

  private expression?: string;
  private variableTokens?: Token[];
  private samplingProxy?: Comlink.Remote<SamplingWorkerType>;

  private g?: SimpleSelection<SVGGElement>;
  private highlight?: SimpleSelection<SVGCircleElement>;
  private tooltip?: Tooltip<Datum<Value>>;

  constructor(element: MountElement, config: ChartConfigDynamic<Datum<Value>>) {
    super(element, config);

    if (isDataConfig<Value>(config)) this.initWithData(config);
    else if (isExpConfig(config)) this.initWithExpression(config);

    const manager = this._dataManager as DataManager<Datum<Value>>;

    this.addAxes(manager);
    this.addGrid(manager, theme.colors.black);

    this.zoom?.onChange(this.redraw);

    this.g = this.chartArea?.svg?.append('g').attr('width', this.width).attr('height', this.height);

    if (config.options?.tooltip) this.initHighlightLayer();

    this.redraw();
  }

  private initWithData(_config: DataConfig<Value>) {
    if (!isDataConfigInstance<Value>(this.config)) return;

    (this.config.dataTransform as DataTransform<ScatterDatum<Value>>) = applyParamsFixations;

    this._dataManager = new ScatterManager(this.config);
  }

  private initWithExpression(_config: ExpressionConfig) {
    if (!isExpConfigInstance(this.config)) return;

    this._dataManager = new ScatterGridManager(this.config);

    this.expression = _config.expression;
    this.variableTokens = _config.intervals.map(({ name }) => createVariableTokens(name));
  }

  public highlightPoint({ x, y }: Point<Value>) {
    const { highlight } = this;

    if (!highlight) return;

    highlight.style('display', 'initial').attr('cx', x).attr('cy', y);
  }

  private initHighlightLayer() {
    this.highlight = this.g?.append('circle');

    this.highlight
      ?.attr('fill', 'transparent')
      .attr('stroke', theme.colors.grey)
      .attr('stroke-width', 3)
      .attr('r', POINT_RADIUS)
      .style('display', 'none');

    if (this.g) {
      this.tooltip = new Tooltip(this.g, d => {
        const [xParam, yParam] = this.config.params ?? [];
        const params =
          'params' in d
            ? `${xParam ? `${xParam}: ${d.params?.[xParam]}</br>` : ''}
              ${yParam ? `${yParam} ${d.params?.[yParam]}</br>` : ''}`
            : '';

        return `
          value: ${d.value}</br>
          ${params}
        `;
      });
    }

    this.chartArea?.canvas.on('mouseout', () => {
      this.highlight?.style('display', 'none');
      this.tooltip?.hideTooltip();
    });
  }

  private draw(
    transform = zoomIdentity,
    binding: Selection<BaseType, any, HTMLElement, any[]>,
    xAccessor: (x: number, xT: number) => number,
    yAccessor: (y: number, yT: number) => number,
  ) {
    const { chartArea, width, height } = this;
    const ctx = chartArea?.context;

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    binding.each((d, i, nodes) => {
      const node = select(nodes[i]);
      const [x, y] = getNodeXY(nodes, i);
      const [xT, yT] = transform.apply([x, y]);

      ctx.beginPath();
      ctx.fillStyle = node.attr('fillStyle');
      ctx.arc(xAccessor(x, xT), yAccessor(y, yT), POINT_RADIUS, 0, 2 * Math.PI);

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  }

  public redraw = async (transform = zoomIdentity) => {
    const {
      _dataManager: { binding, currentScales },
      config,
    } = this;

    const coordsScales = (this._dataManager as ScatterGridManager).coordsScales;

    if (!this.config.params) return;

    let xAccessor = (_: number, xT: number) => xT;

    // If the yScale isn't define, the zoom shouldn't apply
    let yAccessor = currentScales[1] ? (_: number, yT: number) => yT : (y: number) => y;

    if (coordsScales) {
      xAccessor = (x: number) => x;
      yAccessor = (y: number) => y;
    }

    await this.enhanceBindingWithFillStyle(binding, transform);

    this.draw(transform, binding, xAccessor, yAccessor);
  };

  public reset = () => {
    const {
      config: { xMax, yMax },
    } = this;

    // Re-bind the regions, this will reset scales to current params scales
    this._dataManager.bindCurrentScalesRange(xMax, yMax);

    if (isDataConfigInstance(this.config)) {
      (this._dataManager as ScatterManager<Value>).bindScatter(
        this.config.data as ScatterDatum<Value>[],
      );

      this.bindDataToChartArea(this.config.data);
    }
    this.redraw();

    this.axes?.redrawAxes();
    this.grid?.redrawGrid();

    this.highlight?.style('display', 'none');
  };

  public data = (data: ScatterDatum<Value>[]) => {
    if (!isDataConfigInstance<Value>(this.config)) return;

    this.config.data = data;
    // @ts-ignore
    this._dataManager.initScales(this.config);
    this.reset();
  };

  public bindDataToChartArea = (data = this.config.data) => {
    if (!this.config.options.tooltip) return;

    const { chartArea, _dataManager } = this;

    if (!chartArea) return;

    if (!('x' in _dataManager && 'y' in _dataManager)) return;

    if (!this.chartAreaDataManager) {
      this.initChartAreaDataManager();
      this.bindMouseMove(true);
    }

    const pts = (data as ScatterDatum<Value>[]).map(
      this.transfromDatumToPoint(_dataManager.x, _dataManager.y),
    );

    this.chartAreaDataManager!.bindData(pts);
  };

  public bindScatterGridToChartArea = () => {
    if (!this.config.options.tooltip) return;

    const { chartArea, _dataManager } = this;
    if (!('coordsScales' in _dataManager) || !chartArea) return;

    if (!this.chartAreaDataManager) {
      this.initChartAreaDataManager();
      this.bindMouseMove();
    }

    const pts: Point<Value>[] = [];

    const [xParam, yParam] = this.config.params ?? [];
    const [xScale, yScale] = this.dataManager.currentScales;
    if (!xParam || !xScale) return;

    const transform = this.zoom?.currentTransfrom ?? zoomIdentity;
    const xTCoordScale = transform.rescaleX(xScale.scale);
    const yTCoordScale = yScale ? transform.rescaleY(yScale.scale) : undefined;

    _dataManager.binding.each((d, i, nodes) => {
      const [x, y] = getNodeXY(nodes, i);

      const params = { [xParam]: xTCoordScale.invert(x) };
      if (yTCoordScale && yParam) params[yParam] = yTCoordScale.invert(y);

      pts.push({ value: select(nodes[i]).datum() as Value, params, x, y });
    });

    this.chartAreaDataManager!.bindData(pts);
  };

  private initChartAreaDataManager = () => {
    this.chartAreaDataManager = new ChartAreaDelaunayManager(
      (p: Point<Value>) => p.x,
      (p: Point<Value>) => p.y,
    );
  };

  private bindMouseMove = (zoom?: boolean) => {
    this.chartArea?.canvas.on('mousemove', ev => {
      const p = pointer(ev);
      const finalPointer = this.zoom && zoom ? this.zoom.currentTransfrom.invert(p) : p;

      const point = this.chartAreaDataManager?.find(finalPointer);

      if (point) {
        this.highlightPoint(zoom ? this.applyZoomTransformToPoint(point) : point);
        this.tooltip?.showTooltip({ ...point, x: p[0], y: p[1] });
      }
    });

    if (zoom) this.zoom?.onChange(() => this.highlight?.style('display', 'none'));
  };

  private transfromDatumToPoint =
    (x: (d: ScatterDatum<Value>) => number, y: (d: ScatterDatum<Value>) => number) =>
    (d: ScatterDatum<Value>): Point<Value> => {
      return { ...d, x: x(d), y: y(d) };
    };

  private applyZoomTransformToPoint = (p: Point<Value>) => {
    if (!this.zoom) return p;

    const {
      _dataManager: { currentScales },
    } = this;

    const [x, y] = [
      this.zoom.currentTransfrom.applyX(p.x),
      currentScales[1] ? this.zoom.currentTransfrom.applyY(p.y) : p.y,
    ];

    return { ...p, x, y };
  };

  private enhanceBindingWithFillStyle = async (
    binding: Selection<BaseType, any, HTMLElement, any[]>,
    transform = zoomIdentity,
  ) => {
    const { config } = this;

    const dataManagerType = this._dataManager.type;

    if (!this.config.params) return;

    const [xParam, yParam] = this.config.params;

    const fixedParams = this.config.paramsFixation;

    let getFillAndValue: (
      i: number,
      d: ScatterDatum<Value>,
    ) => [string, string | number | undefined] = (_, d) => {
      return [config?.options?.color?.(d) ?? theme.colors.black, undefined];
    };

    if (dataManagerType === 'grid') {
      const [xScale, yScale] = this._dataManager.currentScales;

      if (!xScale) return;

      const xTCoordScale = transform.rescaleX(xScale.scale);
      const yTCoordScale = yScale ? transform.rescaleX(yScale.scale) : undefined;
      const pairs: Record<string, number | string>[] = [];

      binding.each((d, i, nodes) => {
        const [x, y] = getNodeXY(nodes, i);

        const pair: Record<string, number | string> = {
          [xParam]: xTCoordScale.invert(x),
          ...fixedParams,
        };

        if (yParam && yTCoordScale) pair[yParam] = yTCoordScale.invert(y);

        pairs.push(pair);
      });

      const samples = await this.runSampling(pairs);

      getFillAndValue = i => {
        const value = (samples ?? [])[i];
        return [
          config?.options?.color?.({
            value: value ?? '',
            name: 'val',
          }) ?? theme.colors.black,
          value,
        ];
      };
    }

    binding.each((d, i, nodes) => {
      const node = select(nodes[i]);

      const [fill, value] = getFillAndValue(i, d);
      node.attr('fillStyle', fill);
      if (value) node.datum(value);
    });

    if (this.chartAreaDataManager && dataManagerType === 'grid') this.bindScatterGridToChartArea();
  };

  private runSampling = async (pairs: Record<string, string | number>[]) => {
    if (!this.expression || !this.variableTokens) return;

    if (!this.samplingProxy) {
      const worker = new SamplingWorker();
      this.samplingProxy = Comlink.wrap<SamplingWorkerType>(worker);
    }

    const sample = await this.samplingProxy.calculateSampling(
      pairs,
      this.expression!,
      this.variableTokens,
    );

    return sample;
  };

  get dataManager() {
    return this._dataManager;
  }
}

export default class ScatterPlot<Value extends string> {
  private root: HTMLElement;
  private chartRoot: HTMLElement;
  private chart: CustomScatterPlot<Value>;
  private chartUI: ChartUI;
  private chartLegend?: ReturnType<typeof createChartLegend>;

  private color?: ScaleOrdinal<string, string, never>;

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

    this.chartRoot = document.createElement('div');
    applyStyles(this.chartRoot, { display: 'flex', alignItems: 'center' });
    this.root.appendChild(this.chartRoot);

    const commonConfig = { width, height };
    const options: UserOptions<ScatterDatum<Value> | ProbabilityDatum, NumberValue, NumberValue> = {
      handleParamsChange: (...args) => this.chartUI.handleParamsChange?.(...args),
      handleFixationChange: (...args) => this.chartUI.handleFixationChange?.(...args),
      margin: DEFAULT_CHART_MARGIN,
      tooltip: true,
      maxZoomExtent: 100,
    };

    if ('colors' in rest) {
      this.color = scaleOrdinal<string>()
        .domain(Object.keys(rest.colors))
        .range(Object.values(rest.colors));
    }

    if (expression && intervals) {
      this.chart = new CustomScatterPlot(this.chartRoot, {
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

      this.chart.bindScatterGridToChartArea();
      this.initProbabilitySamplingUI(this.chart);
      createGradientChartLegend(this.chartRoot);
    } else {
      // if not expression, data or url must be defined
      this.chart = new CustomScatterPlot(this.chartRoot, {
        ...commonConfig,
        data: data ?? [],
        options: {
          ...options,
          color: d =>
            isScatterDatum(d) ? this.color?.(d.value) ?? theme.colors.black : theme.colors.black,
        },
      });

      if (rest.url) this.fetchData(rest.url, rest.parseCSVValue);
      else this.chart.bindDataToChartArea();
    }

    if (this.color)
      this.chartLegend = createChartLegend(this.chartRoot, this.chart.chartValues, this.color);

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
        this.chartLegend?.update(this.chart.chartValues);

        // Terminate worker if the chart is no longer attached to DOM
        if (!this.root.isConnected) worker.terminate();
      }),
    );

    this.chart.data(csvToScatterPointsList<Value>(finalData, parseValue));
    this.chartUI.initChartUI(this.chart);
    this.chartLegend?.update(this.chart.chartValues);

    loadingOverlay.remove();

    proxy[Comlink.releaseProxy]();

    this.chart.bindDataToChartArea();
  }

  private initProbabilitySamplingUI(chart: CustomScatterPlot<Value>) {
    const handleDensityChange = (value: number, ev: Event) => {
      if (chart.dataManager.type !== 'grid') return;

      if (value > MAX_DENSITY) {
        value = MAX_DENSITY;
        (ev.target as HTMLInputElement).value = `${MAX_DENSITY}`;
      }

      chart.dataManager.density = value;
      chart.redraw();
      chart.bindScatterGridToChartArea();
    };

    if (chart.dataManager.type !== 'grid') return;

    this.chartUI.addInput('density', chart.dataManager.density, handleDensityChange);
  }

  public remove() {
    this.chartUI.remove();
    this.chartRoot.remove();
  }
}
