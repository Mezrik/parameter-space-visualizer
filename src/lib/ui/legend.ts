import { BaseType, EnterElement, select, Selection } from 'd3-selection';
import { DEFAUL_COLOR_SCALE } from '../../constants/common';
import { theme } from '../../constants/styles';
import { gradientLegend } from './legendGradient';

const LEGEND_RECT_SIZE = 20;

export const createChartLegend = (
  el: HTMLElement,
  values: string[],
  color: (v: string) => string,
  rectSize = LEGEND_RECT_SIZE,
) => {
  const legend = select(el).append('svg');

  const enterLabels = (enter: Selection<EnterElement, string, SVGSVGElement, unknown>) => {
    const g = enter.append('g').attr('class', 'legend-label');

    g.append('rect')
      .attr('x', 0)
      .attr('y', function (d, i) {
        return i * (rectSize + 5);
      })
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', function (d) {
        return color(d);
      });

    g.append('text')
      .text(d => d)
      .attr('x', 30)
      .attr('y', function (d, i) {
        return 15 + i * (rectSize + 5);
      })
      .attr('fill', theme.colors.textColor);

    return g;
  };

  const updateLabels = (update: Selection<BaseType, string, SVGSVGElement, unknown>) => {
    update
      .select('rect')
      .attr('x', 0)
      .attr('y', function (d, i) {
        return i * (rectSize + 5);
      })
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', function (d) {
        return color(d);
      });

    update
      .select('text')
      .text(d => d)
      .attr('x', 30)
      .attr('y', function (d, i) {
        return 15 + i * (rectSize + 5);
      })
      .attr('fill', theme.colors.textColor);

    return update;
  };

  const update = (v: string[]) => {
    const datajoin = legend.selectAll('.legend-label').data(v);
    datajoin.join(enterLabels, updateLabels);
  };

  update(values);

  return { legend, update };
};

export const createGradientChartLegend = (el: HTMLElement) => {
  const legend = select(el).append(() => gradientLegend(DEFAUL_COLOR_SCALE));
};
