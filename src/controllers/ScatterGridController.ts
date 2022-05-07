import { select, Selection, BaseType, EnterElement } from 'd3-selection';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import Config from '../Config';
import { ProbabilityDatum } from '../types/expression';
import { ParamsTuple } from '../types/general';
import DataController from './DataController';

export type CoordsScales = [ScaleLinear<number, number>, ScaleLinear<number, number>];

class ScatterGridController extends DataController<ProbabilityDatum> {
  private _scatterBinding: Selection<BaseType, any, HTMLElement, []>;
  private _detachedContainer: Selection<HTMLElement, [], null, undefined>;
  private distributionScales: [ScaleLinear<number, number>, ScaleLinear<number, number>];
  private _density: number;
  private dimensions: { width: number; height: number };

  constructor(config: Config<ProbabilityDatum>, density = 80) {
    super(config);

    this._detachedContainer = select<HTMLElement, []>(document.createElement('custom'));

    this._scatterBinding = this._detachedContainer
      .selectAll('custom')
      .data(new Array(density * density));

    const distDom = [0, density - 1];

    this.distributionScales = [
      scaleLinear().domain(distDom).range([0, config.xMax]),
      scaleLinear().domain(distDom).range([0, config.yMax]),
    ];

    this._density = density;
    this.dimensions = { width: config.xMax, height: config.yMax };

    this._scatterBinding = this._scatterBinding.join(this.joinScatterPoints);
  }

  public bindScatter(density: number) {
    this._scatterBinding = this._detachedContainer
      .selectAll('custom')
      .data(new Array(density * density))
      .join(this.joinScatterPoints, this.updateScatterPoints);
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

  get density() {
    return this._density;
  }

  set density(density: number) {
    const distDom = [0, density - 1];

    this.distributionScales = [
      this.distributionScales[0].domain(distDom),
      this.distributionScales[1].domain(distDom),
    ];

    this._density = density;

    this.bindScatter(density);
  }

  private updateScatterPoints = (c: Selection<BaseType, any, HTMLElement, any>) => {
    const [xDist, yDist] = this.distributionScales;

    return c
      .attr('x', (_, i) => xDist(Math.floor(i / this._density)))
      .attr('y', (_, i) => yDist(i % this._density));
  };

  private joinScatterPoints = (c: Selection<EnterElement, any, HTMLElement, any>) => {
    return c.append('custom').call(this.updateScatterPoints);
  };

  get type(): 'grid' {
    return 'grid';
  }
}

export default ScatterGridController;
