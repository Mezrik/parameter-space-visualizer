import { zoomIdentity, ZoomTransform } from "d3-zoom";

import { xAxisFactory, yAxisFactory } from "../helpers/axis";
import { AnyD3Scale, DataControllerScaleTuple } from "../types/scale";
import { SimpleSelection } from "../types/selection";

class Axes {
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;

  private height: number;
  private scales: DataControllerScaleTuple;

  constructor(
    el: SimpleSelection<SVGGElement>,
    height: number,
    scales: DataControllerScaleTuple
  ) {
    const [xScale, yScale] = scales;
    this.height = height;
    this.scales = scales;

    console.log(scales);
    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx = el.append("g").call(xAxisFactory(height, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) this.gy = el.append("g").call(yAxisFactory(yScale.scale));
  }

  public redrawAxes = (transform: ZoomTransform = zoomIdentity) => {
    const { height, scales } = this;
    const [xScale, yScale] = scales;

    if (!xScale) return;

    this.gx?.call(
      xAxisFactory(height, transform.rescaleX(xScale.scale) as AnyD3Scale)
    );

    if (yScale)
      this.gy?.call(
        yAxisFactory(transform.rescaleY(yScale.scale) as AnyD3Scale)
      );
  };

  public updateScales = (scales: DataControllerScaleTuple) => {
    this.scales = scales;
  };
}

export default Axes;
