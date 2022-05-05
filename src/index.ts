export { default as RegionsChart } from './RegionsChart';
export { default as ScatterPlot, CustomScatterPlot } from './ScatterPlot';

// if (typeof window !== 'undefined') {
//   (window as any).Chart = Chart;
// }

// /**
//  * TEMP: For demo purposes
//  */
// const COLOR_MAPPING: Record<RegionResultValue, string> = {
//   true: '#f0c928',
//   false: '#ab0d0c',
//   unknown: '#fbe6c2',
//   partially_sat: '#ffdc4f',
//   partially_violated: '#fbe6c2',
//   center_sat: '#e0c141',
//   center_violated: '#fbe6c2',
// };

// const color = (d: RegionDatum<RegionResultValue>) => COLOR_MAPPING[d.value];

// const createRegionsChart = (data: RegionDatum<RegionResultValue>[], container: HTMLElement) => {
//   container.classList.add('regions-chart');

//   addStyle(
//     `
//     .regions-chart {
//       display: flex;
//       flex-direction: column-reverse;
//       padding: 1rem;
//       width: 800px;
//     }
//   `,
//     'regions-chart-styles',
//   );

//   const params = ['p', 'q', 'r'];
//   const paramsFix = { r: 0.2 };

//   let handleParamsChange: ParamsChangeHandler | undefined;
//   let handleFixationChange: FixationChangeHandler | undefined;

//   const leftMargin = 40;

//   const chart = new RegionsChart(container, {
//     options: {
//       color,
//       margin: { top: 20, right: 30, bottom: 30, left: leftMargin },
//       params: { x: params[0], y: params[1] },
//       handleParamsChange: (...args) => handleParamsChange?.(...args),
//       handleFixationChange: (...args) => handleFixationChange?.(...args),
//     },
//     data,
//     width: 800,
//     height: 800,
//   });

//   const controls = document.createElement('div');
//   controls.classList.add('chart-controls');
//   applyStyles(controls, {});

//   addStyle(
//     `
//     .chart-controls {
//       display: flex;
//       margin-left: ${rem(leftMargin)};
//     }

//     .chart-controls > * + * {
//       margin-left: 2rem;
//     }
//   `,
//     'styled-chart-controls',
//   );

//   handleParamsChange = appendParamsSelects(
//     controls,
//     params,
//     chart.x,
//     params[0],
//     chart.y,
//     params[1],
//   );

//   handleFixationChange = appendParamFixInputs(controls, paramsFix, chart.fixate);

//   container.appendChild(controls);

//   return chart;
// };

// document.addEventListener('DOMContentLoaded', e => {
//   addStyle(
//     theme => `
//   body {
//     --doc-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
//     'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
//     margin: 0;
//     font-family: ${theme.font};
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//   }
// `,
//     'main',
//   );
// });

// document.addEventListener("DOMContentLoaded", async (e) => {
//   const container = document.createElement("div");
//   document.body.appendChild(container);

//   // fetchCSV(
//   //   "/csv/regions/large-results/parametric-die01.csv",
//   //   csvToRegionResultsList
//   // ).then((d) => {
//   //   console.log(d);
//   //   createRegionsChart(d);
//   // });

//   const chart = createRegionsChart([], container);

//   const dataWorker = new DataWorker();
//   const proxy = Comlink.wrap<DataStreamWorker>(dataWorker);

//   const data: RegionResults<RegionResultValue> = [];

//   const loadingOverlay = addLoadingOverlay(container);

//   const finalData = await proxy.streamData(
//     document.location.origin +
//       "/csv/regions/large-results/parametric-die01.csv",
//     Comlink.proxy((values) => {
//       const parsed = csvToRegionResultsList(values);
//       Array.prototype.push.apply(data, parsed);
//       chart.data(data);
//     })
//   );

//   chart.data(csvToRegionResultsList(finalData));

//   chart.bindDataToChartArea();

//   loadingOverlay.remove();

//   proxy[Comlink.releaseProxy]();
// });
