import { Selection, pointer } from "d3";

import QuadTree from "../lib/QuadTree";

export type ChartAreaMouseEvents = "mousemove" | "mouseover" | "mouseout";
export type ChartAreaMouseEventCb<Datum extends {}> = (data: Datum[]) => void;

class ChartArea<Datum extends {}> {
  private container: Selection<HTMLDivElement, unknown, null, undefined>;
  private canvas: Selection<HTMLCanvasElement, unknown, null, undefined>;

  private _data?: QuadTree<Datum>;

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
      this._data = new QuadTree([
        [0, 0],
        [canvas.width, canvas.height],
      ]);

    this._data?.insertAll(value);
  }

  public on(
    name: ChartAreaMouseEvents,
    callback: ChartAreaMouseEventCb<Datum>
  ) {
    const eventHandler = (ev: MouseEvent) => {
      const [x, y] = pointer(ev);
      const data = this._data?.find(x, y);
      callback(data ?? []);
    };
    this.canvas.on(name, eventHandler);
  }

  get context() {
    return this.canvas.node()?.getContext("2d");
  }
}

export default ChartArea;
