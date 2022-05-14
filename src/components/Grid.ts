import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import Config from '../Config';
import DataManager from '../managers/DataManager';

import { xGridLinesFactory, yGridLinesFactory } from '../helpers/axis';
import { AnyD3Scale } from '../types/scale';
import { SimpleSelection } from '../types/selection';

class Grid {
  private gx?: SimpleSelection<SVGGElement>;
  private gy?: SimpleSelection<SVGGElement>;

  private config: Config<any>;
  private dataManager: DataManager<any>;

  constructor(
    el: SimpleSelection<SVGGElement>,
    config: Config<any>,
    dataManager: DataManager<any>,
  ) {
    this.config = config;
    this.dataManager = dataManager;
    const [xScale, yScale] = dataManager.currentScales;

    this.gx = el.append('g');
    this.gy = el.append('g');

    // X scale should be always defined, if not, something went wrong
    if (!xScale) return;

    this.gx.call(
      xGridLinesFactory(this.config.yMax, xScale.scale, this.config.options.grid?.x?.color),
    );

    // Y scale is not guaranteed, since the chart supports 1D chart
    if (yScale)
      this.gy.call(
        yGridLinesFactory(this.config.xMax, yScale.scale, this.config.options.grid?.y?.color),
      );
  }

  public redrawGrid = (transform: ZoomTransform = zoomIdentity) => {
    const {
      config: { xMax, yMax },
      dataManager,
    } = this;
    const [xScale, yScale] = dataManager.currentScales;

    if (!xScale) return;

    this.gx?.call(
      xGridLinesFactory(
        yMax,
        transform.rescaleX(xScale.scale) as AnyD3Scale,
        this.config.options.grid?.x?.color,
      ),
    );

    if (yScale)
      this.gy?.call(
        yGridLinesFactory(
          xMax,
          transform.rescaleY(yScale.scale) as AnyD3Scale,
          this.config.options.grid?.y?.color,
        ),
      );
  };
}

export default Grid;
