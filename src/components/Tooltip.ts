import { select, Selection } from "d3";
class Tooltip {
  private canvas: HTMLCanvasElement;
  private el: Selection<HTMLDivElement, unknown, HTMLElement, undefined>;

  constructor(ctx: CanvasRenderingContext2D) {
    this.el = select("body").append("div").style("opacity", 0);
    this.canvas = ctx.canvas;
    ctx.canvas.addEventListener("mouseover", this.mouseOver);
  }

  private mouseOver(ev: MouseEvent) {}
}

export default Tooltip;