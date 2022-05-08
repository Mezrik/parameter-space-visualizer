import { NumberValue } from 'd3-scale';
import { pointer, select } from 'd3-selection';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import * as Comlink from 'comlink';
import { Rect } from '@timohausmann/quadtree-js';

import { DataWorker } from './lib/workers';
import { DataStreamWorker } from './lib/data/dataStreamWorker';
import Chart from './Chart';
import ChartUI from './components/ChartUI';
import Tooltip from './components/Tooltip';
import { DEFAULT_CHART_MARGIN } from './constants/common';
import { theme } from './constants/styles';
import RegionsController from './controllers/RegionsController';
import { getDOMNode } from './helpers/general';
import { applyParamsFixations } from './helpers/regions';
import { csvToRegionResultsList } from './lib/data/parse';
import {
  ChartConfig,
  DatumRect,
  MountElement,
  RegionDatum,
  SimpleConfigRegions,
  UserOptions,
} from './types/general';
import { SimpleSelection } from './types/selection';
import { addLoadingOverlay } from './lib/ui/loadingOverlay';
import { ChartAreaQuadTreeController } from './controllers/ChartAreaDataController';

type RegionRect<Value> = Rect & RegionDatum<Value>;

export class CustomRegionsChart<Value> extends Chart<RegionDatum<Value>> {
  private dataController: RegionsController<Value>;
  private chartAreaDataController?: ChartAreaQuadTreeController<RegionRect<Value>>;

  private g?: SimpleSelection<SVGGElement>;
  private highlight?: SimpleSelection<SVGRectElement>;

  private showTooltipAndRect?: (rect: RegionRect<Value>, [x, y]: [number, number]) => void;

  constructor(element: MountElement, config: ChartConfig<RegionDatum<Value>>) {
    super(element, config);

    this.config.dataTransform = applyParamsFixations;

    const { chartArea } = this;

    this.dataController = new RegionsController(this.config);

    this.addGrid(this.dataController, theme.colors.white);

    this.g = this.chartArea?.svg?.append('g').attr('width', this.width).attr('height', this.height);

    if (config.options?.tooltip) this.initHighlightLayer();

    this.zoom?.onChange(this.redraw);
    this.zoom?.onChange(() => {
      this.highlight?.style('display', 'none');
    });

    this.addAxes(this.dataController);

    this.redraw();
  }

  public highlightRect({ x, y, width, height }: DatumRect<RegionDatum<Value>>) {
    const { highlight } = this;

    if (!highlight) return;

    highlight
      .style('display', 'initial')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height);
  }

  private initHighlightLayer() {
    this.highlight = this.g?.append('rect');

    this.highlight
      ?.attr('fill', 'transparent')
      .attr('stroke', theme.colors.grey)
      .attr('stroke-width', 3);

    let tooltip: Tooltip<RegionDatum<Value>>;
    if (this.g) {
      tooltip = new Tooltip(this.g, d => {
        const [xParam, yParam] = this.config.params ?? [];
        return `
          value: ${d.value}</br>
          ${xParam ? `x-from: ${d.params[xParam].from}</br>` : ''}
          ${xParam ? `x-to: ${d.params[xParam].to}</br>` : ''}
          ${yParam ? `y-from: ${d.params[yParam].from}</br>` : ''}
          ${yParam ? `y-to: ${d.params[yParam].to}</br>` : ''}
        `;
      });
    }

    this.chartArea?.canvas.on('mouseout', () => {
      this.highlight?.style('display', 'none');
      tooltip.hideTooltip();
    });

    this.showTooltipAndRect = (rect, [x, y]) => {
      this.highlightRect(rect);

      tooltip?.showTooltip({ ...rect, x, y });
    };
  }

  public redraw = (transform: ZoomTransform = zoomIdentity) => {
    const {
      chartArea,
      dataController: { regionsBinding },
      config,
      width,
      height,
    } = this;

    const ctx = chartArea?.context;

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    regionsBinding?.each((d, i, nodes) => {
      const node = select(nodes[i]);

      ctx.beginPath();
      ctx.fillStyle = config?.options?.color?.(d) ?? theme.colors.white;

      const [x, y] = transform.apply([parseFloat(node.attr('x')), parseFloat(node.attr('y'))]);

      ctx.rect(
        x,
        y,
        parseFloat(node.attr('width')) * transform.k,
        parseFloat(node.attr('height')) * transform.k,
      );

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  };

  public reset = () => {
    const {
      config: { xMax, yMax, data },
    } = this;

    // Re-bind the regions, this will reset scales to current params scales
    this.dataController.bindCurrentScalesRange(xMax, yMax);
    this.dataController.bindRegions(data);

    this.redraw();

    this.axes?.redrawAxes();
    this.grid?.redrawGrid();

    if (this.chartAreaDataController) {
      const rects = this.config.data.map(this.transfromDatumToRect);
      this.chartAreaDataController.bindData(rects);
    }
  };

  public data = (data: RegionDatum<Value>[]) => {
    this.config.data = data;
    this.dataController.initScales(this.config);
    this.reset();
  };

  public bindDataToChartArea = () => {
    if (!this.config.options.tooltip) return;

    const { chartArea } = this;

    if (!chartArea) return;

    const { width, height } = chartArea.canvas.node() ?? {};
    if (!width || !height) return;

    if (!this.chartAreaDataController)
      this.chartAreaDataController = new ChartAreaQuadTreeController(width, height);

    const rects = this.config.data.map(this.transfromDatumToRect);

    this.chartAreaDataController.bindData(rects);

    chartArea.canvas.on('mousemove', ev => {
      const p = pointer(ev);
      const finalPointer = this.zoom ? this.zoom.currentTransfrom.invert(p) : p;

      const rect = this.chartAreaDataController?.find(finalPointer);

      if (this.showTooltipAndRect && rect)
        this.showTooltipAndRect(this.applyZoomTransformToRect(rect), p);
    });
  };

  private transfromDatumToRect = (d: RegionDatum<Value>) => {
    const { x, y, w, h } = this.dataController;
    return { ...d, x: x(d), y: y(d), width: w(d), height: h(d) };
  };

  private applyZoomTransformToRect = (r: RegionRect<Value>) => {
    if (!this.zoom) return r;

    const { currentTransfrom: transform } = this.zoom;

    const [x, y] = transform.apply([r.x, r.y]);
    return { ...r, width: r.width * transform.k, height: r.height * transform.k, x, y };
  };
}

export default class RegionsChart<Value> {
  private root: HTMLElement;
  private chart: CustomRegionsChart<Value>;
  private chartUI: ChartUI;

  constructor({ el, width, height, data, color, ...rest }: SimpleConfigRegions<Value>) {
    const node = getDOMNode(el);
    if (node) this.root = node;
    else {
      this.root = document.createElement('div');
      document.appendChild(this.root);
    }

    this.chartUI = new ChartUI(this.root);

    const options: UserOptions<RegionDatum<Value>, NumberValue, NumberValue> = {
      handleParamsChange: (...args) => this.chartUI.handleParamsChange?.(...args),
      handleFixationChange: (...args) => this.chartUI.handleFixationChange?.(...args),
      margin: DEFAULT_CHART_MARGIN,
      color,
      tooltip: false,
      maxZoomExtent: 1000,
    };

    this.chart = new CustomRegionsChart(this.root, {
      width,
      height,
      data: data ?? [],
      options,
    });

    if (rest.url) this.fetchData(rest.url, rest.parseCSVValue);
    else this.chart.bindDataToChartArea();

    this.chartUI.initChartUI(this.chart);
  }

  private async fetchData(url: string, parseValue: (v?: string) => Value) {
    const worker = new DataWorker();

    const proxy = Comlink.wrap<DataStreamWorker>(worker);
    const data: RegionDatum<Value>[] = [];
    const loadingOverlay = addLoadingOverlay(this.root);

    const finalData = await proxy.streamData(
      url,
      Comlink.proxy(values => {
        const parsed = csvToRegionResultsList<Value>(values, parseValue);
        Array.prototype.push.apply(data, parsed);
        this.chart.data(data);
        this.chartUI.initChartUI(this.chart);

        // Terminate worker if the chart is no longer attached to DOM
        if (!this.root.isConnected) worker.terminate();
      }),
    );

    this.chart.data(csvToRegionResultsList<Value>(finalData, parseValue));
    this.chartUI.initChartUI(this.chart);

    loadingOverlay.remove();
    proxy[Comlink.releaseProxy]();

    this.chart.bindDataToChartArea();
  }
}
