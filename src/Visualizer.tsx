import React, { useEffect, useMemo, useRef } from "react";
import { RegionResults } from "@mocks/helpers/parseRegions";
import { getParamDomain, getParams } from "./helpers/regionsTransforms";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";

type Props<T extends string> = {
  data: RegionResults<T>;
  colorMap: Record<T, string>;
};

const FIXED_WIDTH = 600;
const FIXED_HEIGHT = 600;

const Visualizer = <T extends string>({ data, colorMap }: Props<T>) => {
  const params = useMemo(() => getParams(data), [data]);

  const paramsExtent = useMemo(
    () =>
      params.reduce<Record<string, [number, number]>>((acc, param) => {
        const paramExtent = extent(getParamDomain(data, param));
        const [min, max] = paramExtent;

        if (!min || !max) return acc;

        return {
          ...acc,
          [param]: paramExtent,
        };
      }, {}),
    [data, params]
  );

  console.log(paramsExtent);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // TEMP: Fixed values for scale
    const xScale = scaleLinear()
      .domain(paramsExtent[params[0]])
      .range([0, FIXED_WIDTH]);

    // TEMP: Fixed values for scale
    const yScale = scaleLinear()
      .domain(paramsExtent[params[1]])
      .range([0, FIXED_HEIGHT]);

    const svgEl = select(svgRef.current);

    svgEl.selectAll("*").remove();

    const svg = svgEl.append("g");
    console.log(data);
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", (d) => colorMap[d.value])
      .attr("x", (d) => xScale(d.params[params[0]].from))
      .attr("y", (d) => yScale(d.params[params[1]].from))
      .attr(
        "width",
        (d) => xScale(d.params[params[0]].to) - xScale(d.params[params[0]].from)
      )
      .attr(
        "height",
        (d) => yScale(d.params[params[1]].to) - yScale(d.params[params[1]].from)
      );

    const xAxis = axisBottom(xScale).ticks(5).tickSize(-FIXED_HEIGHT);
    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${FIXED_HEIGHT})`)
      .call(xAxis);

    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2)");
    xAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "black")
      .attr("font-size", "0.75rem");

    const yAxis = axisLeft(yScale).ticks(5).tickSize(-FIXED_WIDTH);

    const yAxisGroup = svg
      .append("g")
      .attr("transform", `translate(32, 0)`)
      .call(yAxis);
    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2)");
    yAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "black")
      .attr("font-size", "0.75rem");
  }, [paramsExtent, params, data]);

  return (
    <svg ref={svgRef} width={FIXED_WIDTH + 16} height={FIXED_HEIGHT + 16} />
  );
};

export default Visualizer;
