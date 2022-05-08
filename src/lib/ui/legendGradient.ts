// @ts-nocheck
import { axisRight } from 'd3-axis';
import { interpolate, quantize } from 'd3-interpolate';
import { create } from 'd3-selection';
import { styleTickLines, styleTickText } from '../../helpers/axis';

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
export const gradientLegend = (
  color,
  {
    title,
    tickSize = 6,
    width = 44 + tickSize,
    height = 320,
    marginTop = 0,
    marginRight = 16 + tickSize,
    marginBottom = 0,
    marginLeft = 18,
    ticks = height / 64,
    tickFormat,
    tickValues,
  } = {},
) => {
  function ramp(color, n = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = n;
    const context = canvas.getContext('2d');

    if (!context) return canvas;

    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(0, i, 1, 1);
    }
    return canvas;
  }

  const svg = create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0, 0, ${width}, ${height}`)
    .style('overflow', 'visible')
    .style('display', 'block');

  const n = Math.min(color.domain().length, color.range().length);
  const x = color.copy().rangeRound(quantize(interpolate(marginTop, height - marginBottom), n));

  svg
    .append('image')
    .attr('x', marginLeft)
    .attr('y', marginTop)
    .attr('width', width - marginLeft - marginRight)
    .attr('height', height - marginTop - marginBottom)
    .attr('preserveAspectRatio', 'none')
    .attr('xlink:href', ramp(color.copy().domain(quantize(interpolate(0, 1), n))).toDataURL());

  svg
    .append('g')
    .attr('transform', `translate(${width - marginRight},0)`)
    .call(
      axisRight(x)
        .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues),
    )
    .call(styleTickLines)
    .call(styleTickText)
    .call(g => g.select('.domain').remove())
    .call(g =>
      g
        .append('text')
        .attr('x', marginTop)
        .attr('y', marginLeft + marginRight - width - 6)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('class', 'title')
        .text(title),
    );

  return svg.node();
};
