import { axisBottom, axisLeft } from 'd3-axis';
import { BaseType, Selection } from 'd3-selection';
import { theme } from '../constants/styles';
import { AnyD3Scale } from '../types/scale';
import { SimpleSelection } from '../types/selection';

const styleDomain = (stroke: number) => (g: SimpleSelection<SVGGElement>) =>
  g.select('.domain').attr('stroke-width', stroke).attr('stroke', theme.colors.lightGrey);

const styleTickLines = (
  g: SimpleSelection<SVGGElement>,
): Selection<BaseType, unknown, SVGGElement, unknown> =>
  g.selectAll('.tick line').attr('stroke', theme.colors.lightGrey);

const styleTickText = (
  g: SimpleSelection<SVGGElement>,
): Selection<BaseType, unknown, SVGGElement, unknown> =>
  g.selectAll('.tick text').style('font-size', '0.75rem').attr('fill', theme.colors.textColor);

export const styleAxisLabel = (text: SimpleSelection<SVGTextElement>) =>
  text
    .attr('fill', theme.colors.textColor)
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .attr('text-anchor', 'center');

const styleGridLines =
  (color: string = theme.colors.white) =>
  (g: SimpleSelection<SVGGElement>): Selection<BaseType, unknown, SVGGElement, unknown> =>
    g
      .selectAll('.tick line')
      .attr('stroke', color)
      .attr('opacity', 0.3)
      .attr('stroke-dasharray', '7 3');

const makeXGridLines = (xScale: AnyD3Scale) => {
  return axisBottom(xScale).ticks(5);
};

const makeYGridLines = (yScale: AnyD3Scale) => {
  return axisLeft(yScale).ticks(5);
};

const removeDomain = (g: SimpleSelection<SVGGElement>) => g.select('.domain').remove();

export const xGridLinesFactory =
  (height: number, xScale: AnyD3Scale, color?: string) => (g: SimpleSelection<SVGGElement>) => {
    g.attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(
        makeXGridLines(xScale)
          .tickSize(-height)
          .tickFormat(() => ''),
      )
      .call(removeDomain)
      .call(styleGridLines(color));
  };

export const yGridLinesFactory =
  (width: number, yScale: AnyD3Scale, color?: string) => (g: SimpleSelection<SVGGElement>) => {
    g.attr('class', 'grid')
      .call(
        makeYGridLines(yScale)
          .tickSize(-width)
          .tickFormat(() => ''),
      )
      .call(removeDomain)
      .call(styleGridLines(color));
  };

export const xAxisFactory =
  (height: number, xScale: AnyD3Scale, stroke = 2) =>
  (g: SimpleSelection<SVGGElement>) => {
    g.attr('transform', `translate(0,${height})`)
      .call(axisBottom(xScale))
      .call(styleDomain(stroke))
      .call(styleTickLines)
      .call(styleTickText)
      .call(g => g.selectAll('.tick text').attr('y', 14));
  };

export const yAxisFactory =
  (yScale: AnyD3Scale, stroke = 2) =>
  (g: SimpleSelection<SVGGElement>) => {
    g.call(axisLeft(yScale))
      .call(styleDomain(stroke))
      .call(styleTickLines)
      .call(styleTickText)
      .call(g => g.selectAll('.tick text').attr('x', -14));
  };
