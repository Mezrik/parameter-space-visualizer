import { axisBottom, axisLeft, Selection } from "d3";
import { Margin } from "../types/general";
import { AnyD3Scale } from "../types/scale";

export const xAxisFactory =
  (height: number, margin: Margin, xScale: AnyD3Scale) =>
  (g: Selection<SVGGElement, unknown, null, undefined>) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(xScale));

export const yAxisFactory =
  (margin: Margin, yScale: AnyD3Scale) =>
  (g: Selection<SVGGElement, unknown, null, undefined>) =>
    g.attr("transform", `translate(${margin.left},0)`).call(axisLeft(yScale));
