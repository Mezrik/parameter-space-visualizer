import { BaseType, EnterElement, select, Selection } from 'd3-selection';
import Config from '../Config';
import { UNDEFINED_CHART_VALUE } from '../constants/common';
import { RegionDatum, ParamsTuple, Margin } from '../types/general';
import DataController from './DataController';

type RegionNode<Value, Type extends BaseType> = Selection<
  Type,
  RegionDatum<Value>,
  HTMLElement,
  RegionDatum<Value>[]
>;
class RegionsController<Value> extends DataController<RegionDatum<Value>> {
  private _regionsBinding: RegionNode<Value, BaseType>;

  private _detachedContainer: Selection<HTMLElement, RegionDatum<Value>[], null, undefined>;

  constructor(opts: Config<RegionDatum<Value>>) {
    super(opts);

    this._detachedContainer = select<HTMLElement, RegionDatum<Value>[]>(
      document.createElement('custom'),
    );

    this._regionsBinding = this._detachedContainer.selectAll('custom').data(opts.data);

    this._regionsBinding = this._regionsBinding.join(this.joinRegions);
  }

  public x = (d: RegionDatum<Value>) => {
    const [xScale] = this.currentScales;

    return this.params && xScale
      ? xScale.scale(d.params[this.params[0]].from)
      : UNDEFINED_CHART_VALUE;
  };

  public y = (d: RegionDatum<Value>) => {
    const [, yScale] = this.currentScales;

    return this.params && this.params[1] && yScale
      ? yScale.scale(d.params[this.params[1]].to)
      : UNDEFINED_CHART_VALUE;
  };

  public w = (d: RegionDatum<Value>) => {
    const [xScale] = this.currentScales;

    return this.params && xScale
      ? xScale.scale(d.params[this.params[0]].to) - xScale.scale(d.params[this.params[0]].from)
      : UNDEFINED_CHART_VALUE;
  };

  public h = (d: RegionDatum<Value>) => {
    const [, yScale] = this.currentScales;

    return this.params && this.params[1] && yScale
      ? yScale.scale(d.params[this.params[1]].from) - yScale.scale(d.params[this.params[1]].to)
      : this.config.height;
  };

  public bindRegions = (data: RegionDatum<Value>[]) => {
    // Bind zero for y position and height in case of 1D chart
    this._regionsBinding = this._detachedContainer
      .selectAll('custom')
      .data(data)
      .join(this.joinRegions, this.updateRegion);
  };

  private updateRegion = (c: RegionNode<Value, BaseType>) =>
    c.attr('x', this.x).attr('y', this.y).attr('width', this.w).attr('height', this.h);

  private joinRegions = (c: RegionNode<Value, EnterElement>) => {
    return c.append('custom').call(this.updateRegion);
  };

  get regionsBinding() {
    return this._regionsBinding;
  }
}

export default RegionsController;
