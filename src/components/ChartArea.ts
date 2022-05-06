import QuadTree, { Rect } from '@timohausmann/quadtree-js';
import { pointer } from 'd3-selection';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';

// import QuadTree, { Accessor } from "../lib/QuadTree";
import { rectsOverlapping } from '../helpers/canvas';
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

  // public on(
  //   name: ChartAreaMouseEvents,
  //   callback: ChartAreaMouseEventCb<Datum>
  // ) {
  //   const eventHandler = (ev: MouseEvent) => {
  //     const { _transfrom } = this;
  //     const [x, y] = _transfrom.invert(pointer(ev));

  //     const data: Datum[] | undefined = this._data
  //       ?.retrieve(pointerRect)
  //       .filter((d) => rectsOverlapping(d, pointerRect)) as Datum[];

  //     callback(
  //       (data?.map(({ x, y, width, height, ...rest }) => ({
  //         ...rest,
  //         x: _transfrom.applyX(x),
  //         y: _transfrom.applyY(y),
  //         width: _transfrom.k * width,
  //         height: _transfrom.k * height,
  //       })) as Datum[]) ?? [],
  //       [_transfrom.applyX(x), _transfrom.applyY(y)]
  //     );
  //   };

  //   this._canvas.on(name, eventHandler);
  // }

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
