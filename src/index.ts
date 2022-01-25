import { RegionResults01Parsed } from "@mocks/./";
import { RegionResultValue } from "@mocks/helpers/parseRegions";

import Chart from "./Chart";
import { ChartTypes } from "./types";

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

document.addEventListener("DOMContentLoaded", function (e) {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const chart = new Chart(canvas.getContext("2d")!, {
    type: ChartTypes.Region,
    data: RegionResults01Parsed ?? [],
  });
});

export default Chart;
