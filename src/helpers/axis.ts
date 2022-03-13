import { axisBottom, axisLeft } from "d3";
import { Margin } from "../types/general";
import { AnyD3Scale } from "../types/scale";
import { SimpleSelection } from "../types/selection";

export const xAxisFactory =
  (height: number, xScale: AnyD3Scale, stroke = 1) =>
  (g: SimpleSelection<SVGGElement>) =>
    g
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(xScale))
      .attr("stroke-width", stroke);

export const yAxisFactory =
  (yScale: AnyD3Scale, stroke = 1) =>
  (g: SimpleSelection<SVGGElement>) =>
    g.call(axisLeft(yScale)).attr("stroke-width", stroke);
