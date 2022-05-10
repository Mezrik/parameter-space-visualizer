import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import Config from '../Config';
import { AXIS_LABEL_OFFSET } from '../constants/common';
import DataController from '../controllers/DataController';

import { styleAxisLabel, xAxisFactory, yAxisFactory } from '../helpers/axis';
import { AnyD3Scale } from '../types/scale';
import { SimpleSelection } from '../types/selection';

class Axes {
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;

  private labelX?: SimpleSelection<SVGTextElement>;
  private labelY?: SimpleSelection<SVGTextElement>;

  private config: Config<any>;
  private dataController: DataController<any>;

  constructor(
    el: SimpleSelection<SVGGElement>,
    config: Config<any>,
    dataController: DataController<any>,
  ) {
    this.config = config;
    this.dataController = dataController;
    const [xScale, yScale] = this.dataController.currentScales;

    this.gx = el.append('g');
    this.gy = el.append('g');

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx.call(xAxisFactory(this.config.yMax, xScale.scale));

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale) this.gy.call(yAxisFactory(yScale.scale));

    this.initLabels();
  }

  public redrawAxes = (transform: ZoomTransform = zoomIdentity) => {
    const {
      config: { yMax },
      dataController,
    } = this;
    const [xScale, yScale] = dataController.currentScales;

    if (!xScale) return;

    this.gx?.call(xAxisFactory(yMax, transform.rescaleX(xScale.scale) as AnyD3Scale));

    if (yScale) this.gy?.call(yAxisFactory(transform.rescaleY(yScale.scale) as AnyD3Scale));

    if (!this.labelX || !this.labelY) this.initLabels();
    this.labelX?.text(this.config.params?.[0] ?? '');
    this.labelY?.text(this.config.params?.[1] ?? '');
  };

  private initLabels = () => {
    this.labelX = this.gx
      ?.append('text')
      .attr('x', this.config.xMax / 2)
      .attr('y', AXIS_LABEL_OFFSET)
      .attr('dy', '0.75rem')
      .text(this.config.params?.[0] ?? '')
      .call(styleAxisLabel);

    this.labelY = this.gy
      ?.append('text')
      .attr('x', -AXIS_LABEL_OFFSET)
      .attr('y', this.config.yMax / 2)
      .attr('dx', '-0.75rem')
      .attr('transform', `rotate(-90, ${-AXIS_LABEL_OFFSET - 20}, ${this.config.yMax / 2})`)
      .text(this.config.params?.[1] ?? '')
      .call(styleAxisLabel);
  };
}

export default Axes;
