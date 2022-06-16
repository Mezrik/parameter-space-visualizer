import { theme } from '../constants/styles';
import { rem } from '../lib/ui/general';
import { SimpleSelection } from '../types/selection';

export type TooltipFO = SimpleSelection<SVGForeignObjectElement>;
export type TooltipSelection = SimpleSelection<HTMLDivElement>;
export type TooltipValueAccessor<Datum> = (d: Datum) => string;

class Tooltip<Datum> {
  private fo: TooltipFO;
  private tooltip: TooltipSelection;
  private inner: TooltipSelection;

  private valueAccessor: TooltipValueAccessor<Datum>;

  constructor(svg: SimpleSelection<SVGGElement>, valueAccessor: TooltipValueAccessor<Datum>) {
    this.valueAccessor = valueAccessor;

    this.fo = svg
      .append('foreignObject')
      .classed('tooltip', true)
      .attr('width', 250)
      .attr('height', 100);

    this.tooltip = this.fo.append('xhtml:div');
    this.inner = this.tooltip.append('div');

    Tooltip.styleTooltipInner(this.inner);
    Tooltip.styleTooltip(this.tooltip);
    Tooltip.hideTooltip(this.fo);
  }

  public static styleTooltipInner(tooltip: TooltipSelection) {
    tooltip
      .style('background', theme.colors.white)
      .style('padding', `${rem(8)} ${rem(14)}`)
      .style('color', '#868686')
      .style('border-radius', `${rem(4)}`)
      .style('font-family', 'sans-serif')
      .style('box-sizing', 'border-box')
      .style('box-shadow', `0 0 ${rem(10)} ${rem(3)} rgba(0,0,0,0.1)`);
  }

  public static styleTooltip(tooltip: TooltipSelection) {
    tooltip.style('padding', `${rem(14)}`);
  }

  public static hideTooltip(tooltip: TooltipFO) {
    tooltip.style('opacity', 0);
  }

  public static showTooltip(tooltip: TooltipFO) {
    tooltip.style('opacity', 1);
  }

  public static handleTooltipOverflow(fo: TooltipFO, x: number, y: number) {
    const foRect = fo.node()!.getBoundingClientRect();
    const svg = fo.select(function () {
      return this.closest('svg');
    });
    const svgRect = svg.node()!.getBoundingClientRect();

    const rOverflow = foRect.x + foRect.width > svgRect.x + svgRect.width;
    const bOverflow = foRect.y + foRect.height > svgRect.y + svgRect.height;
    const brOverflow = rOverflow && bOverflow;

    if (brOverflow) {
      fo.attr('transform', `translate(${x - foRect.width} ${y - foRect.height})`);
    } else if (bOverflow) {
      fo.attr('transform', `translate(${x} ${y - foRect.height})`);
    } else if (rOverflow) {
      fo.attr('transform', `translate(${x - foRect.width} ${y})`);
    }
  }

  public showTooltip({ x, y, ...d }: Datum & { x: number; y: number }) {
    const { fo, tooltip, inner } = this;
    inner.html(this.valueAccessor(d as unknown as Datum));

    fo.attr('height', tooltip.node()!.getBoundingClientRect().height);

    fo.attr('transform', `translate(${x} ${y})`);

    Tooltip.handleTooltipOverflow(fo, x, y);

    Tooltip.showTooltip(fo);
  }

  public hideTooltip() {
    Tooltip.hideTooltip(this.fo);
  }
}

export default Tooltip;
