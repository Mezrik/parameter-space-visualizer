import { select, Selection } from "d3";
import ChartArea from "./components/ChartArea";
import Config from "./Config";
import { ZERO_MARGIN } from "./constants/common";
import { ChartConfig, DatumRect, Margin, MountElement } from "./types/general";
import { SimpleSelection } from "./types/selection";

class Chart<Datum> {
  protected el?: SimpleSelection<HTMLDivElement>;
  protected config: Config<Datum>;
  protected chartArea?: ChartArea<DatumRect<Datum>>;
  protected svg?: SimpleSelection<SVGGElement>;
  protected margin: Margin = ZERO_MARGIN;

  private _width: number;
  private _height: number;

  constructor(element: MountElement, config: ChartConfig<Datum>) {
    this.config = new Config(config);

    this.margin = this.config.options?.margin ?? this.margin;

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
    const { width, height, margin } = this;

    this.svg = element
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .append("g");
    this.svg.attr(
      "transform",
      "translate(" + margin.left + " " + margin.top + ")"
    );

    return this;
  }

  private initChartArea(element: SimpleSelection<HTMLDivElement>) {
    const { xMax, yMax, margin } = this;
    this.chartArea = new ChartArea(element, xMax, yMax, margin);

    return this;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get xMax() {
    const { margin } = this;
    return this._width - margin.left - margin.right;
  }

  get yMax() {
    const { margin } = this;
    return this._height - margin.top - margin.bottom;
  }
}

export default Chart;
