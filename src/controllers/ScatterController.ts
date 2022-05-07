import { BaseType, EnterElement, select, Selection } from 'd3-selection';
import Config from '../Config';
import { UNDEFINED_CHART_VALUE } from '../constants/common';
import { ScatterDatum } from '../types/general';
import DataController from './DataController';

type ScatterNode<Value, Type extends BaseType> = Selection<
  Type,
  ScatterDatum<Value>,
  HTMLElement,
  ScatterDatum<Value>[]
>;
class ScatterController<Value> extends DataController<ScatterDatum<Value>> {
  private _scatterBinding: ScatterNode<Value, BaseType>;

  private _detachedContainer: Selection<HTMLElement, ScatterDatum<Value>[], null, undefined>;

  constructor(opts: Config<ScatterDatum<Value>>) {
    super(opts);

    this._detachedContainer = select<HTMLElement, ScatterDatum<Value>[]>(
      document.createElement('custom'),
    );

    this._scatterBinding = this._detachedContainer.selectAll('custom').data(opts.data);

    this._scatterBinding = this._scatterBinding.join(this.joinScatterPoints);
  }

  public x = (d: ScatterDatum<Value>) => {
    const [xScale] = this.currentScales;

    return this.params && xScale ? xScale.scale(d.params[this.params[0]]) : UNDEFINED_CHART_VALUE;
  };

  public y = (d: ScatterDatum<Value>) => {
    const [, yScale] = this.currentScales;

    return this.params && this.params[1] && yScale
      ? yScale.scale(d.params[this.params[1]])
      : this.config.height / 2;
  };

  public bindScatter = (data: ScatterDatum<Value>[]) => {
    // Bind zero for y position and height in case of 1D chart
    this._scatterBinding = this._detachedContainer
      .selectAll('custom')
      .data(data)
      .join(this.joinScatterPoints, this.updateScatterPoints);
  };

  private updateScatterPoints = (c: ScatterNode<Value, BaseType>) =>
    c.attr('x', this.x).attr('y', this.y);

  private joinScatterPoints = (c: ScatterNode<Value, EnterElement>) => {
    return c.append('custom').call(this.updateScatterPoints);
  };

  get binding() {
    return this._scatterBinding;
  }

  get type(): 'data' {
    return 'data';
  }
}

export default ScatterController;
