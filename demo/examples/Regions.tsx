import { useEffect, useState } from 'preact/hooks';
import * as Comlink from 'comlink';

import { csvToRegionResultsList, RegionResults, RegionResultValue } from '../../src/lib/data/parse';
import { addStyle, applyStyles, rem } from '../../src/lib/ui/general';
import { FixationChangeHandler, ParamsChangeHandler, RegionDatum } from '../../src/types/general';
import RegionsChart from '../../src/RegionsChart';
import { COLOR_MAPPING } from '../../src/constants/common';
import { appendParamsSelects } from '../../src/lib/ui/paramsSelects';
import { appendParamFixInputs } from '../../src/lib/ui/paramFixInputs';
import DataWorker from 'web-worker:./lib/data/dataStreamWorker';
import { DataStreamWorker } from '../../src/lib/data/dataStreamWorker';
import { addLoadingOverlay } from '../../src/lib/ui/loadingOverlay';

const Regions = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const chart = createRegionsChart([], container);
      console.log('test');

      const fn = async () => {
        const dataWorker = new DataWorker();
        const proxy = Comlink.wrap<DataStreamWorker>(dataWorker);

        const data: RegionResults<RegionResultValue> = [];

        const loadingOverlay = addLoadingOverlay(container);

        const finalData = await proxy.streamData(
          document.location.origin + '/csv/regions/large-results/parametric-die01.csv',
          Comlink.proxy(values => {
            const parsed = csvToRegionResultsList(values);
            Array.prototype.push.apply(data, parsed);
            chart.data(data);
          }),
        );

        chart.data(csvToRegionResultsList(finalData));

        // chart.bindDataToChartArea();

        loadingOverlay.remove();

        proxy[Comlink.releaseProxy]();
      };

      fn();
    }
  }, [container]);

  return <div ref={ref} />;
};

export default Regions;

const color = (d: RegionDatum<RegionResultValue>) => COLOR_MAPPING[d.value];

const createRegionsChart = (data: RegionDatum<RegionResultValue>[], container: HTMLElement) => {
  container.classList.add('regions-chart');

  addStyle(
    `
      .regions-chart {
        display: flex;
        flex-direction: column-reverse;
        padding: 1rem;
        width: 800px;
      }
    `,
    'regions-chart-styles',
  );

  const params = ['p', 'q', 'r'];
  const paramsFix = { r: 0.2 };

  let handleParamsChange: ParamsChangeHandler | undefined;
  let handleFixationChange: FixationChangeHandler | undefined;

  const leftMargin = 40;

  const chart = new RegionsChart(container, {
    options: {
      color,
      margin: { top: 20, right: 30, bottom: 30, left: leftMargin },
      params: { x: params[0], y: params[1] },
      handleParamsChange: (...args) => handleParamsChange?.(...args),
      handleFixationChange: (...args) => handleFixationChange?.(...args),
    },
    data,
    width: 800,
    height: 800,
  });

  const controls = document.createElement('div');
  controls.classList.add('chart-controls');
  applyStyles(controls, {});

  addStyle(
    `
      .chart-controls {
        display: flex;
        margin-left: ${rem(leftMargin)};
      }
  
      .chart-controls > * + * {
        margin-left: 2rem;
      }
    `,
    'styled-chart-controls',
  );

  handleParamsChange = appendParamsSelects(
    controls,
    params,
    chart.x,
    params[0],
    chart.y,
    params[1],
  );

  handleFixationChange = appendParamFixInputs(controls, paramsFix, chart.fixate);

  container.appendChild(controls);

  return chart;
};
