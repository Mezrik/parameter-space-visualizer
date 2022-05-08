import { select } from 'd3-selection';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import Axes from './components/Axes';
import ChartArea from './components/ChartArea';
import Grid from './components/Grid';
import Config from './Config';
import { ZERO_MARGIN } from './constants/common';
import DataController from './controllers/DataController';
import Zoom from './controllers/Zoom';
import { getDOMNodeSelection } from './helpers/general';
import { rem } from './lib/ui/general';
import {
  ChartConfig,
  ChartConfigDynamic,
  DatumRect,
  Margin,
  MountElement,
  ParamsFixation,
} from './types/general';
import { DataControllerScaleTuple } from './types/scale';
import { SimpleSelection } from './types/selection';

abstract class Chart<Datum> {
  protected el?: SimpleSelection<HTMLDivElement>;
  protected config: Config<Datum>;
  protected chartArea?: ChartArea;
  protected axes?: Axes;
  protected grid?: Grid;
  protected svg?: SimpleSelection<SVGGElement>;
  protected zoom?: Zoom<HTMLCanvasElement>;

  private _width: number;
  private _height: number;

  constructor(element: MountElement, config: ChartConfig<Datum> | ChartConfigDynamic<Datum>) {
    this.config = new Config(config);

    this._height = config.height;
    this._width = config.width;

    this.el = getDOMNodeSelection(element);

    if (this.el) {
      const {
        width,
        height,
        config: { xMax, yMax, margin },
        el,
      } = this;

      el.style('width', rem(width)).style('height', rem(height));

      // Initialize the SVG element which contains axis, highlights etc.
      this.svg = el
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('position', 'absolute')
        .append('g');
      this.svg.attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');

      // Initialize chart area, which renders the visualization
      const chartArea = new ChartArea(el, xMax, yMax, margin);
      this.chartArea = chartArea;

      // Initialize general zoom
      // there is still need to bind the zoom to each draw method
      this.zoom = new Zoom(
        [1, this.config.options.maxZoomExtent],
        [
          [0, 0],
          [xMax, yMax],
        ],
      );

      this.chartArea?.canvas.call(this.zoom?.zoom);
    }
  }

  protected addAxes(dataController: DataController<Datum>) {
    if (this.svg) {
      const axes = new Axes(this.svg, this.config, dataController);
      this.zoom?.onChange(transform => {
        axes.redrawAxes(transform);
      });
      this.axes = axes;
    }
  }

  protected addGrid(dataController: DataController<Datum>, color?: string) {
    const gridOpts = this.config.options.grid;

    this.config.gridOptions = {
      ...gridOpts,
      x: { color, ...gridOpts?.x },
      y: { color, ...gridOpts?.y },
    };

    if (this.chartArea?.svg) {
      const grid = new Grid(this.chartArea?.svg.append('g'), this.config, dataController);

      this.zoom?.onChange(transform => {
        grid.redrawGrid(transform);
      });

      this.grid = grid;
    }
  }

  public fixate = (fixations: ParamsFixation) => {
    this.config.userFixations = fixations;
    this.reset();
  };

  public resetZoom = () => {
    if (!this.zoom?.zoom) return;
    this.chartArea?.canvas.call(this.zoom.zoom, zoomIdentity);
  };

  /**
   * Change param displayed on axis x
   * @param param
   */
  public x = (param: string) => {
    const { params } = this.config;
    this.config.params = [param, params?.[1]];
    this.resetZoom();
    this.reset();
  };

  /**
   * Change param displayed on axis y
   * @param param
   */
  public y = (param?: string) => {
    const { params } = this.config;
    if (params) {
      this.config.params = [params?.[0], param];
      this.resetZoom();
      this.reset();
    }
  };

  public abstract reset(): void;

  public abstract redraw(transform: ZoomTransform): void;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get allParams() {
    return this.config.allParams;
  }

  get params() {
    return this.config.params;
  }

  get paramFixations() {
    return this.config.paramsFixation;
  }

  get chartValues() {
    return this.config.chartValues;
  }
}

export default Chart;
