import { ScaleOrdinal } from 'd3-scale';
import { DISTINCT_COLORS } from '../constants/distinctColors';
import { AnyD3Scale, ScaleInput, TickFormatter } from '../types/scale';
import { getChartValues, shuffleArray } from './general';

export const getTicks = <Scale extends AnyD3Scale>(
  scale: Scale,
  count?: number,
): ScaleInput<Scale>[] => {
  const anyScale = scale as AnyD3Scale;

  if ('ticks' in anyScale) return anyScale.ticks(count);

  const dom = anyScale.domain();

  if (typeof count === 'undefined' || dom.length <= count) return dom;

  const everyNth = Math.round((dom.length - 1) / count);
  return dom.filter((_, i) => i % everyNth === 0);
};

export const getTicksFormatter = <Scale extends AnyD3Scale>(
  scale: Scale,
): TickFormatter<ScaleInput<Scale>> => {
  const anyScale = scale as AnyD3Scale;

  if ('tickFormat' in anyScale) return anyScale.tickFormat();

  return (d: ScaleInput<Scale>) => d.toString();
};

const distinctColorsShuffled = shuffleArray(DISTINCT_COLORS);

export const extendParamsColorScale = <Datum>(
  color: ScaleOrdinal<string, string, never>,
  data: Datum[],
) => {
  const values = getChartValues(data);
  values.forEach(val => {
    if (!color.domain().includes(val)) {
      color.domain([...color.domain(), val]);
      color.range([...color.range(), distinctColorsShuffled[color.domain().length]]);
    }
  });
};
