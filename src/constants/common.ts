import { createProabilityColorScale } from '../helpers/general';
import { RegionResultValue } from '../lib/data/parse';
import { Margin } from '../types/general';

export const UNDEFINED_CHART_VALUE = 0;

export const ZERO_MARGIN: Margin = { top: 0, left: 0, right: 0, bottom: 0 };

export const DEFAULT_CHART_MARGIN: Margin = { top: 20, right: 30, bottom: 60, left: 60 };

export const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: '#f0c928',
  false: '#ab0d0c',
  unknown: '#fbe6c2',
  partially_sat: '#ffdc4f',
  partially_violated: '#fbe6c2',
  center_sat: '#e0c141',
  center_violated: '#fbe6c2',
};

export const DEFAUL_COLOR_SCALE = createProabilityColorScale([
  COLOR_MAPPING.false,
  COLOR_MAPPING.unknown,
  COLOR_MAPPING.true,
]);

export const AXIS_LABEL_OFFSET = 30;
