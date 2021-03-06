import { benchmarkSuite } from 'jest-bench';
import { CustomRegionsChart } from '../src/RegionsChart';
import { csvToRegionResultsList, RawCSVObject } from '../src/lib/data/parse';
import { COLOR_MAPPING } from '../src/constants/common';

// @ts-ignore
import test01 from '../data/csv/regions/ok-results/test01.csv';
// @ts-ignore
import BRP02 from '../data/csv/regions/ok-results/brp02.csv';
// @ts-ignore
import BRP03 from '../data/csv/regions/ok-results/brp03.csv';

const paramVis = require('../umd');

benchmarkSuite('Regions chart', {
  ['Bench regions chart init with test01.csv']: () => {
    createRegionsChart(test01);
  },
  ['Bench regions chart rendering with test01.csv']: () => {
    chartTest01.redraw();
  },
  ['Bench regions chart init with BRP02.csv']: () => {
    createRegionsChart(BRP02);
  },
  ['Bench regions chart rendering with BRP02.csv']: () => {
    chartBRP02.redraw();
  },
  ['Bench regions chart init with BRP03.csv']: () => {
    createRegionsChart(BRP03);
  },
  ['Bench regions chart rendering with BRP03.csv']: () => {
    chartBRP03.redraw();
  },
});

const createRegionsChart = (csv: RawCSVObject) => {
  return new paramVis.CustomRegionsChart(document.createElement('div'), {
    width: 800,
    height: 800,
    data: csvToRegionResultsList(csv),
    colors: COLOR_MAPPING,
  });
};

const chartTest01: CustomRegionsChart<any> = createRegionsChart(test01);
const chartBRP02: CustomRegionsChart<any> = createRegionsChart(BRP02);
const chartBRP03: CustomRegionsChart<any> = createRegionsChart(BRP03);
