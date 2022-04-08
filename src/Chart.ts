import { select, Selection } from "d3";
import Axes from "./components/Axes";
import ChartArea from "./components/ChartArea";
import Config from "./Config";
import { ZERO_MARGIN } from "./constants/common";
import DataController from "./controllers/DataController";
import Zoom from "./controllers/Zoom";
import {
  ChartConfig,
  ChartConfigDynamic,
  DatumRect,
  Margin,
  MountElement,
} from "./types/general";
import { DataControllerScaleTuple } from "./types/scale";
import { SimpleSelection } from "./types/selection";

class Chart<Datum> {
  protected el?: SimpleSelection<HTMLDivElement>;
  protected config: Config<Datum>;
  protected chartArea?: ChartArea<DatumRect<Datum>>;
  protected axes?: Axes;
  protected svg?: SimpleSelection<SVGGElement>;
  protected zoom?: Zoom<HTMLCanvasElement>;

  private _width: number;
  private _height: number;

  constructor(
    element: MountElement,
    config: ChartConfig<Datum> | ChartConfigDynamic<Datum>
  ) {
    this.config = new Config(config);

    this._height = config.height;
    this._width = config.width;

    if (typeof element === "string") {
      const domEl: HTMLElement | null = document.querySelector(element);
      domEl && (this.el = select<HTMLElement, unknown>(domEl).append("div"));
    } else {
      this.el = select<HTMLElement, unknown>(element).append("div");
    }

    if (this.el) {
      const {
        width,
        height,
        config: { xMax, yMax, margin },
        el,
      } = this;

      // Initialize the SVG element which contains axis, highlights etc.
      this.svg = el
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "absolute")
        .append("g");
      this.svg.attr(
        "transform",
        "translate(" + margin.left + " " + margin.top + ")"
      );

      // Initialize chart area, which renders the visualization
      const chartArea = new ChartArea<DatumRect<Datum>>(el, xMax, yMax, margin);
      this.chartArea = chartArea;

      // Initialize general zoom
      // there is still need to bind the zoom to each draw method
      this.zoom = new Zoom(
        [1, 10],
        [
          [0, 0],
          [xMax, yMax],
        ]
      );

      this.chartArea?.canvas.call(this.zoom?.zoom);
      this.zoom.onChange((t) => (chartArea.transform = t));
    }
  }

  protected addAxes(scales: DataControllerScaleTuple) {
    if (this.svg) {
      const axes = new Axes(this.svg, this.config.yMax, scales);
      this.zoom?.onChange((transform) => {
        axes.redrawAxes(transform);
      });
      this.axes = axes;
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
