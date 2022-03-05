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
  const chart = new RegionsChart(document.body, {
    options: { color, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    data: RegionResults01Parsed!,
    width: 1200,
    height: 800,
  });
});

export default Chart;
