import { Selection, pointer } from "d3";

// import QuadTree, { Accessor } from "../lib/QuadTree";
import QuadTree, { Rect } from "@timohausmann/quadtree-js";
import { rectsOverlapping } from "../helpers/canvas";

export type ChartAreaMouseEvents = "mousemove" | "mouseover" | "mouseout";
export type ChartAreaMouseEventCb<Datum extends {}> = (data: Datum[]) => void;

class ChartArea<Datum extends Rect> {
  private container: Selection<HTMLDivElement, unknown, null, undefined>;
  private canvas: Selection<HTMLCanvasElement, unknown, null, undefined>;

  private _data?: QuadTree;

  constructor(
    root: Selection<HTMLElement, unknown, null, undefined>,
    w: number,
    h: number
  ) {
    this.container = root.append("div").classed("chart-area", true);
    this.canvas = this.container
      .append("canvas")
      .attr("width", w)
      .attr("height", h);
  }

  public data(value: Datum[]) {
    const canvas = this.canvas.node();

    if (canvas)
      this._data = new QuadTree(
        {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
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
    this.canvas.on(name, eventHandler);
  }

  get context() {
    return this.canvas.node()?.getContext("2d");
  }
}

export default ChartArea;
