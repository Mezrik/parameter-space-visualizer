import { RegionResults01Parsed } from "@mocks/./";
import { RegionResultValue } from "@mocks/helpers/parseRegions";

import Chart from "./Chart";

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
  const chart = new Chart(600, 600, RegionResults01Parsed ?? [], COLOR_MAPPING);
  chart.render("param_sig", "param_block");
});

export default Chart;
