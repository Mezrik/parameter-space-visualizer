import { select, Selection } from "d3";
import ChartArea from "./components/ChartArea";
import Config from "./Config";
import { ChartConfig, DatumRect, MountElement } from "./types/general";

class Chart<Datum> {
  protected chartArea?: ChartArea<DatumRect<Datum>>;
  protected el?: Selection<HTMLElement, unknown, null, undefined>;
  protected config: Config<Datum>;
  private _width: number;
  private _height: number;

  constructor(element: MountElement, config: ChartConfig<Datum>) {
    this.config = new Config(config);

    this._height = config.height;
    this._width = config.width;

    this._init(element);
  }

  _init(element: MountElement) {
    if (typeof element === "string") {
      const domEl: HTMLElement | null = document.querySelector(element);
      domEl && (this.el = select<HTMLElement, unknown>(domEl));
    } else {
      this.el = select<HTMLElement, unknown>(element);
    }

    if (this.el) {
      this.chartArea = new ChartArea(this.el, this._width, this._height);
    }
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default Chart;
