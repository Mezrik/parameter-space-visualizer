import { SimpleSelection } from '../types/selection';
import { Margin } from '../types/general';
import { rem } from '../lib/ui/general';

export type ChartAreaMouseEvents = 'mousemove' | 'mouseover' | 'mouseout';
export type ChartAreaMouseEventCb<Datum extends {}> = (
  data: Datum[],
  pointer: [number, number],
) => void;

class ChartArea {
  private container: SimpleSelection<HTMLDivElement>;
  private _canvas: SimpleSelection<HTMLCanvasElement>;
  private _svg: SimpleSelection<SVGSVGElement>;

  // private _data?: QuadTree;
  // private _transfrom = zoomIdentity;

  constructor(root: SimpleSelection<HTMLDivElement>, w: number, h: number, m: Margin) {
    this.container = root
      .append('div')
      .classed('chart-area', true)
      .style('position', 'absolute')
      .style('transform', `translate(${rem(m.left + 1)},  ${rem(m.top)})`);

    this._canvas = this.container
      .append('canvas')
      .attr('width', w)
      .attr('height', h)
      .style('position', 'absolute');

    this._svg = this.container.append('svg');
    this._svg
      .attr('width', w)
      .attr('height', h)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._canvas.node()?.getContext('2d');
  }

  get svg() {
    return this._svg;
  }
}

export default ChartArea;
