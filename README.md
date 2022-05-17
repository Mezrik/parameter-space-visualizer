# Parameter space visualizer

Implementation of a web-based module for parameter space visualization that can be integrated into CMP, eBCSgen, and Parasim tools.

## Demonstration
Repository includes a demo of implemented visualizer, to get this demo running follow:

1. ```npm i```
2. ```npm run dev```

Live demo is accessible through through this [link](https://parameter-space-visualizer.surge.sh/).

## Get started

```
  npm i parameter-space-visualizer
```


UMD version of the vizualizer bundle is available through 
```
https://unpkg.com/parameter-space-visualizer/umd/index.js
```

## Examples

```
  <head>
    ...
    <script src="https://unpkg.com/parameter-space-visualizer/umd/index.js"></script>
    ...
  </head>
  <body>
    <script>
      // Depends on the values defined in the input data
      const colorMap = {
        AllSat: '#f0c928',
        AllViolated: '#ab0d0c',
        Unknown: '#fbe6c2'
      },
      
      // Init regions sampling
      new paramVis.RegionsChart({
          el: 'body',
          url: https://someurl.com/input.csv,
          colors: colorMap,
          width: 800,
          height: 800,
        })

      // Init regions sampling
      new paramVis.ScatterPlot({
          el: 'body',
          expression: '(-1 * ((p+(-1)) * (q*r+(-1)*r+(-1)*q+1)))/(q*r+(-1)*r+1)',
          intervals: [
            { name: 'p', start: 0, end: 1 },
            { name: 'q', start: 0, end: 0.5 },
            { name: 'r', start: 1 / 10, end: 3 / 10 }
          ],
          width: 800,
          height: 800,
        });
    </script>
  </body>
```

### In React
```
import { useEffect } from 'react';
import { ScatterPlot } from 'parameter-space-visualizer';

const Visualisation = ({ expression, intervals }) => {
  const [container, ref] = useState(null);

  useEffect(() => {
    if (container) {
      const chart = new ScatterPlot({
        el: container,
        expression,
        intervals,
        width: 800,
        height: 800,
      });
    }

    return () => chart.remove();
  }, [container]);

  return <div ref={ref} />;
};
```

## Docs
There are 4 classes exported from the `parameter-space-visualizer` package.
- `ScatterPlot` - ootb working solution for plotting probability sampling and other parameter space data. Has ready to use UI. Can be used with either url pointing to CSV, JS object input or algebraic expression for sampling.

- `RegionsChart` - ootb working solution for visualizing parameter synthesis output, can be used for other things as well. Alse has ready to use UI. Can be used with either url pointing to CSV, JS object input.

- `CustomScatterPlot` and `CustomRegionsChart` - extensible class containing just the visualiztion.

Additionaly the package exports data parsing utils, sampling utils, ui utils and web workers used for sampling and fetching data streams.

Custom charts config: 
```
{
  options?: {
    // Assigning params to chart axes
    params?: { x: string; y?: string } | string;

    // In case there is a multiple dimensional parameter space, 
    // you can specify custom param fixations 
    paramsFixation?: Record<string, number | string>;

    // Callback which will be called when the params are changed
    // internally. Changed params will be passed as an argument
    handleParamsChange?: (f: Record<string, number | string>) => void;

    // Callback which will be called when the fixations are changed
    // internally. Changed fixations will be passed as an argument
    handleFixationChange?: (p: [string, string] | [string, undefined] | null) => void;

    // Custom chart margins
    margin?: {
      top?: number;
      left?: number;
      bottom?: number;
      right?: number;
    };

    // Color mapping function, the returned color will be used in visualisation
    color?: (d: Datum) => string;

    // Axes configuration
    axes?: { 
      x: {
        tickFontSize?: number;
        tickCount?: number;
        tickFormatter?: (value: ScaleInput) => string | undefined;
        tickStrokeColor?: string;
        tickSize?: number;
      }; 
      
      y?: {
        tickFontSize?: number;
        tickCount?: number;
        tickFormatter?: (value: ScaleInput) => string | undefined;
        tickStrokeColor?: string;
        tickSize?: number;
      } 
    };

    // Here you can specify the color of the grid
    grid?: {  x?: { color?: string; }; y?: { color?: string; }; };

    // Specify whether the tooltip should be used
    tooltip?: boolean;

    // The maximum zoom-in coeficient
    maxZoomExtent?: number;
  };

  // Chart width
  width: number;

  // Chart height
  height: number;

  // Algebraic expression used for sampling
  // see https://www.npmjs.com/package/math-expression-evaluator
  // for allowed syntax and symbols
  //
  // Can be used only in CustomScatterPlot
  expression: string;

  // When the expression is specified this is required
  // Specifies parameter ranges, eg. (0, 1) 
  // the sampling will be executed on this range
  intervals: {
    name: string; // name of parameter
    start: number; // from e.g 0
    end: number; // to e.g 1
  }[];
  
  // In CustomRegionsChart Datum is equal to RegionDatum<Value> 
  // in CustomScatterPlot Datum is equal to ScatterDatum<Value>
  // see ts types or the examples for more insight on data format
  //
  // NOTE: In CustomScatterPlot, can be used only when 
  //       the expression is not specified
  data: Datum[];
};
```

## Scripts

To build visualizer dist use:
```
  npm run build
```

To run live demo version use:
```
  npm run dev
```

To run benchmarks use:
```
  npm run benchmark
```