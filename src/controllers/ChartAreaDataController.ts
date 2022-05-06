import Quadtree, { Rect } from '@timohausmann/quadtree-js';
import { Delaunay } from 'd3-delaunay';

import { rectsOverlapping } from '../helpers/canvas';

abstract class ChartAreaDataController<Datum> {
  constructor() {}

  public abstract bindData(data: ArrayLike<Datum>): void;

  public abstract find(pointer: [number, number]): Datum | undefined;
}

type GetCoordinate<P> = Delaunay.GetCoordinate<P, ArrayLike<P> | Iterable<P>>;

export class ChartAreaDelaunayController<Point> extends ChartAreaDataController<Point> {
  private _delaunay?: Delaunay<Point>;
  private _data?: ArrayLike<Point>;
  private _getX: GetCoordinate<Point>;
  private _getY: GetCoordinate<Point>;

  constructor(getX: GetCoordinate<Point>, getY: GetCoordinate<Point>) {
    super();

    this._getX = getX;
    this._getY = getY;
  }

  public bindData = (data: ArrayLike<Point>) => {
    this._data = data;
    this._delaunay = Delaunay.from<Point>(data, this._getX, this._getY);
  };

  public find = (pointer: [number, number]) => {
    if (!this._delaunay || !this._data) return undefined;

    return this._data[this._delaunay?.find(...pointer)];
  };
}

export class ChartAreaQuadTreeController<
  RectDatum extends Rect,
> extends ChartAreaDataController<RectDatum> {
  private _w: number;
  private _h: number;
  private _quadTree?: Quadtree;

  constructor(w: number, h: number) {
    super();

    this._h = h;
    this._w = w;
  }

  public bindData = (data: ArrayLike<Rect>) => {
    if (!this._quadTree) {
      this._quadTree = new Quadtree({ width: this._w, height: this._h, x: 0, y: 0 }, 4, 10);
    } else this._quadTree.clear();

    const dl = data.length;
    for (let i = 0; i < dl; i++) this._quadTree.insert(data[i]);
  };

  public find = ([x, y]: [number, number]) => {
    if (!this._quadTree) return undefined;

    const pointerRect = { x, y, width: 1, height: 1 };

    return this._quadTree
      .retrieve(pointerRect)
      .filter(d => rectsOverlapping(d, pointerRect))[0] as RectDatum;
  };
}

export default ChartAreaDataController;
