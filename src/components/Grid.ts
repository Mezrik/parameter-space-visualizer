import { zoomIdentity, ZoomTransform } from "d3-zoom";
import Config from "../Config";
import DataController from "../controllers/DataController";

import { xGridLinesFactory, yGridLinesFactory } from "../helpers/axis";
import { AnyD3Scale } from "../types/scale";
import { SimpleSelection } from "../types/selection";

class Grid {
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
    const [xScale, yScale] = dataController.currentScales;

    this.gx = el.append("g");
    this.gy = el.append("g");

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx.call(xGridLinesFactory(this.config.yMax, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) this.gy.call(yGridLinesFactory(this.config.xMax, yScale.scale));
  }

  public redrawGrid = (transform: ZoomTransform = zoomIdentity) => {
    const {
      config: { xMax, yMax },
      dataController,
    } = this;
    const [xScale, yScale] = dataController.currentScales;

    if (!xScale) return;

    this.gx?.call(
      xGridLinesFactory(yMax, transform.rescaleX(xScale.scale) as AnyD3Scale)
    );

    if (yScale)
      this.gy?.call(
        yGridLinesFactory(xMax, transform.rescaleY(yScale.scale) as AnyD3Scale)
      );
  };
}

export default Grid;
