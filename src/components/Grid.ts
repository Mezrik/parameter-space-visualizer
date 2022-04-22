import { zoomIdentity, ZoomTransform } from "d3-zoom";

import { xGridLinesFactory, yGridLinesFactory } from "../helpers/axis";
import { AnyD3Scale, DataControllerScaleTuple } from "../types/scale";
import { SimpleSelection } from "../types/selection";

class Grid {
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;

  private height: number;
  private width: number;
  private scales: DataControllerScaleTuple;

  constructor(
    el: SimpleSelection<SVGGElement>,
    height: number,
    width: number,
    scales: DataControllerScaleTuple
  ) {
    const [xScale, yScale] = scales;
    this.height = height;
    this.width = width;
    this.scales = scales;

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx = el.append("g").call(xGridLinesFactory(height, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale)
      this.gy = el.append("g").call(yGridLinesFactory(width, yScale.scale));
  }

  public redrawGrid = (transform: ZoomTransform = zoomIdentity) => {
    const { height, scales, width } = this;
    const [xScale, yScale] = scales;

    if (!xScale) return;

    this.gx?.call(
      xGridLinesFactory(height, transform.rescaleX(xScale.scale) as AnyD3Scale)
    );

    if (yScale)
      this.gy?.call(
        yGridLinesFactory(width, transform.rescaleY(yScale.scale) as AnyD3Scale)
      );
  };

  public updateScales = (scales: DataControllerScaleTuple) => {
    this.scales = scales;
  };
}

export default Grid;
