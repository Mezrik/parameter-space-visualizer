import { DatumRect } from "../types/general";
import { SimpleSelection } from "../types/selection";

export type TooltipFO = SimpleSelection<SVGForeignObjectElement>;
export type TooltipSelection = SimpleSelection<HTMLDivElement>;
export type TooltipValueAccessor<Datum> = (d: Datum) => string;

class Tooltip<Datum> {
  private fo: TooltipFO;
  private tooltip: TooltipSelection;

  private valueAccessor: TooltipValueAccessor<Datum>;

  constructor(
    svg: SimpleSelection<SVGGElement>,
    valueAccessor: TooltipValueAccessor<Datum>
  ) {
    this.valueAccessor = valueAccessor;

    this.fo = svg
      .append("foreignObject")
      .classed("tooltip", true)
      .attr("width", 250)
      .attr("height", 100);

    this.tooltip = this.fo.append("xhtml:div");

    Tooltip.styleTooltip(this.tooltip);
    Tooltip.hideTooltip(this.fo);
  }

  public static styleTooltip(tooltip: TooltipSelection) {
    tooltip
      .style("background", "rgb(119, 119, 119, 0.5)")
      .style("padding", "8px 14px")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("font-family", "sans-serif");
  }

  public static hideTooltip(tooltip: TooltipFO) {
    tooltip.style("opacity", 0);
  }

  public static showTooltip(tooltip: TooltipFO) {
    tooltip.style("opacity", 1);
  }

  public showTooltip({ x, y, width, height, ...d }: DatumRect<Datum>) {
    const { fo, tooltip } = this;
    tooltip.html(this.valueAccessor(d as unknown as Datum));

    fo.attr("height", tooltip.node()!.getBoundingClientRect().height);

    fo.attr("transform", `translate(${x} ${y})`);

    Tooltip.showTooltip(fo);
  }
}

export default Tooltip;
