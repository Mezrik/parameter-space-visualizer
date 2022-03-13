import { Selection, pointer, zoomIdentity, ZoomTransform } from "d3";
import QuadTree, { Rect } from "@timohausmann/quadtree-js";

// import QuadTree, { Accessor } from "../lib/QuadTree";
import { rectsOverlapping } from "../helpers/canvas";
import { SimpleSelection } from "../types/selection";
import { Margin } from "../types/general";

export type ChartAreaMouseEvents = "mousemove" | "mouseover" | "mouseout";
export type ChartAreaMouseEventCb<Datum extends {}> = (data: Datum[]) => void;

class ChartArea<Datum extends Rect> {
  private container: SimpleSelection<HTMLDivElement>;
  private _canvas: SimpleSelection<HTMLCanvasElement>;
  private _svg: SimpleSelection<SVGSVGElement>;

  private _data?: QuadTree;
  private _transfrom = zoomIdentity;

  constructor(
    root: SimpleSelection<HTMLDivElement>,
    w: number,
    h: number,
    m: Margin
  ) {
    this.container = root
      .append("div")
      .classed("chart-area", true)
      .style("position", "absolute")
      .style("transform", "translate(" + m.left + "px,  " + m.top + "px)");

    this._canvas = this.container
      .append("canvas")
      .attr("width", w)
      .attr("height", h)
      .style("position", "absolute");

    this._svg = this.container.append("svg");
    this._svg
      .attr("width", w)
      .attr("height", h)
      .style("position", "absolute")
      .style("pointer-events", "none");
  }

  public data(value: Datum[]) {
    const _canvas = this._canvas.node();

    if (_canvas)
      this._data = new QuadTree(
        {
          x: 0,
          y: 0,
          width: _canvas.width,
          height: _canvas.height,
        },
        4,
        200
      );

    value.forEach((d) => this._data?.insert(d));
  }

  public on(
    name: ChartAreaMouseEvents,
    callback: ChartAreaMouseEventCb<Datum>
  ) {
    const eventHandler = (ev: MouseEvent) => {
      const { _transfrom } = this;
      const [x, y] = _transfrom.invert(pointer(ev));
      const pointerRect = {
        x,
        y,
        width: 0,
        height: 0,
      };

      const data: Datum[] | undefined = this._data
        ?.retrieve(pointerRect)
        .filter((d) => rectsOverlapping(d, pointerRect)) as Datum[];

      callback(
        (data?.map(({ x, y, width, height, ...rest }) => ({
          ...rest,
          x: _transfrom.applyX(x),
          y: _transfrom.applyY(y),
          width: _transfrom.k * width,
          height: _transfrom.k * height,
        })) as Datum[]) ?? []
      );
    };

    this._canvas.on(name, eventHandler);
  }

  set transform(transform: ZoomTransform) {
    this._transfrom = transform;
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._canvas.node()?.getContext("2d");
  }

  get svg() {
    return this._svg;
  }
}

export default ChartArea;
