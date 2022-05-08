import { RegionResultValue } from '../src/lib/data/parse';

export const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: '#f0c928',
  false: '#ab0d0c',
  unknown: '#fbe6c2',
  partially_sat: '#ffdc4f',
  partially_violated: '#fbe6c2',
  center_sat: '#e0c141',
  center_violated: '#fbe6c2',
};

export const SCATTER_COLOR_MAPPING: Record<'true' | 'false', string> = {
  true: '#f0c928',
  false: '#ab0d0c',
};

export const PATH_NAMES = {
  probabilitySampling: '/probability-sampling',
  regions: '/regions',
};
