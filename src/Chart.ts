import { select, Selection } from "d3";
import ChartArea from "./components/ChartArea";
import Config from "./Config";
import { ChartConfig, DatumRect, MountElement } from "./types/general";
import { SimpleSelection } from "./types/selection";

class Chart<Datum> {
  protected el?: SimpleSelection<HTMLDivElement>;
  protected config: Config<Datum>;
  protected chartArea?: ChartArea<DatumRect<Datum>>;
  protected svg?: SimpleSelection<SVGSVGElement>;

  private _width: number;
  private _height: number;

  constructor(element: MountElement, config: ChartConfig<Datum>) {
    this.config = new Config(config);

    this._height = config.height;
    this._width = config.width;

    this.init(element);
  }

  private init(element: MountElement) {
    if (typeof element === "string") {
      const domEl: HTMLElement | null = document.querySelector(element);
      domEl && (this.el = select<HTMLElement, unknown>(domEl).append("div"));
    } else {
      this.el = select<HTMLElement, unknown>(element).append("div");
    }

    if (this.el) {
      this.initSVG(this.el).initChartArea(this.el);
    }

    return this;
  }

  private initSVG(element: SimpleSelection<HTMLDivElement>) {
    const { width, height } = this;

    this.svg = element.append("svg");
    this.svg
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute");

    return this;
  }

  private initChartArea(element: SimpleSelection<HTMLDivElement>) {
    const { width, height, config } = this;
    this.chartArea = new ChartArea(element, width, height);

    return this;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default Chart;
