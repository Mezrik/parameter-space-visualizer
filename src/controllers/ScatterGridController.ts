import { select, Selection, BaseType } from 'd3-selection';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import Config from '../Config';
import { ProbabilityDatum } from '../types/expression';
import { ParamsTuple } from '../types/general';
import DataController from './DataController';

export type CoordsScales = [ScaleLinear<number, number>, ScaleLinear<number, number>];

class ScatterGridController extends DataController<ProbabilityDatum> {
  private _scatterBinding: Selection<BaseType, any, HTMLElement, []>;
  private distributionScales: [ScaleLinear<number, number>, ScaleLinear<number, number>];
  private density: number;
  private dimensions: { width: number; height: number };

  constructor(config: Config<ProbabilityDatum>, density = 30) {
    super(config);

    const detachedContainer = select<HTMLElement, []>(document.createElement('custom'));

    this._scatterBinding = detachedContainer.selectAll('custom').data(new Array(density * density));

    const distDom = [0, density - 1];

    this.distributionScales = [
      scaleLinear().domain(distDom).range([0, config.xMax]),
      scaleLinear().domain(distDom).range([0, config.yMax]),
    ];

    this.density = density;
    this.dimensions = { width: config.xMax, height: config.yMax };

    this.bindScatter();
  }

  public bindScatter() {
    const [xDist, yDist] = this.distributionScales;
    this._scatterBinding = this._scatterBinding
      .join('custom')
      .classed('.region', true)
      .attr('x', (_, i) => xDist(Math.floor(i / this.density)))
      .attr('y', (_, i) => yDist(i % this.density));
  }

  get binding() {
    return this._scatterBinding;
  }

  get coordsScales(): CoordsScales {
    return [
      scaleLinear()
        .domain([0, this.dimensions.width])
        .range((this.currentScales[0]?.extent as [number, number]) ?? []),
      scaleLinear()
        .domain([0, this.dimensions.height])
        .range((this.currentScales[1]?.extent as [number, number]) ?? []),
    ];
  }

  get type(): 'grid' {
    return 'grid';
  }
}

export default ScatterGridController;
