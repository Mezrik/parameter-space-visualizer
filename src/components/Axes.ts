import { zoomIdentity, ZoomTransform } from "d3-zoom";
import Config from "../Config";
import DataController from "../controllers/DataController";

import { xAxisFactory, yAxisFactory } from "../helpers/axis";
import { AnyD3Scale, DataControllerScaleTuple } from "../types/scale";
import { SimpleSelection } from "../types/selection";

class Axes {
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;

  private config: Config<any>;
  private dataController: DataController<any>;

  constructor(
    el: SimpleSelection<SVGGElement>,
    config: Config<any>,
    dataController: DataController<any>
  ) {
    this.config = config;
    this.dataController = dataController;
    const [xScale, yScale] = this.dataController.currentScales;
    this.gx = el.append("g");
    this.gy = el.append("g");

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx.call(xAxisFactory(this.config.yMax, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) this.gy.call(yAxisFactory(yScale.scale));
  }

  public redrawAxes = (transform: ZoomTransform = zoomIdentity) => {
    const {
      config: { yMax },
      dataController,
    } = this;
    const [xScale, yScale] = dataController.currentScales;

    if (!xScale) return;

    this.gx?.call(
      xAxisFactory(yMax, transform.rescaleX(xScale.scale) as AnyD3Scale)
    );

    if (yScale)
      this.gy?.call(
        yAxisFactory(transform.rescaleY(yScale.scale) as AnyD3Scale)
      );
  };
}

export default Axes;
