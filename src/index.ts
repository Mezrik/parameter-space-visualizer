import { RegionResults01Parsed } from "@mocks/./";
import { RegionResultValue } from "@mocks/helpers/parseRegions";

import Chart from "./Chart";
import RegionsChart from "./RegionsChart";
import { RegionDatum } from "./types/general";

if (typeof window !== "undefined") {
  (window as any).Chart = Chart;
}

/**
 * TEMP: For demo purposes
 */
const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: "#f4c941",
  false: "#b30e17",
  unknown: "#fde6c4",
  partially_sat: "#fde6c4",
  partially_violated: "#fde6c4",
};

const color = (d: RegionDatum<RegionResultValue>) => COLOR_MAPPING[d.value];

document.addEventListener("DOMContentLoaded", function (e) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  document.body.appendChild(canvas);

  const chart = new RegionsChart(canvas.getContext("2d")!, {
    options: { color },
    data: RegionResults01Parsed!,
  });

  chart.draw();
});

export default Chart;
