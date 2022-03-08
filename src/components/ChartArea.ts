import { Selection, pointer } from "d3";
import QuadTree, { Rect } from "@timohausmann/quadtree-js";

// import QuadTree, { Accessor } from "../lib/QuadTree";
import { rectsOverlapping } from "../helpers/canvas";
import { SimpleSelection } from "../types/selection";

export type ChartAreaMouseEvents = "mousemove" | "mouseover" | "mouseout";
export type ChartAreaMouseEventCb<Datum extends {}> = (data: Datum[]) => void;

class ChartArea<Datum extends Rect> {
  private container: SimpleSelection<HTMLDivElement>;
  private _canvas: SimpleSelection<HTMLCanvasElement>;
  private _svg: SimpleSelection<SVGSVGElement>;

  private _data?: QuadTree;

  constructor(root: SimpleSelection<HTMLDivElement>, w: number, h: number) {
    this.container = root
      .append("div")
      .classed("chart-area", true)
      .style("position", "absolute")
      .style("transform", "translate(1px, 1px)"); // TODO: should reflect axis stroke-width

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
      const [x, y] = pointer(ev);
      const pointerRect = {
        x,
        y,
        width: 0,
        height: 0,
      };

      const data: Datum[] | undefined = this._data
        ?.retrieve(pointerRect)
        .filter((d) => rectsOverlapping(d, pointerRect)) as Datum[];

      callback(data ?? []);
    };
    this._canvas.on(name, eventHandler);
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
