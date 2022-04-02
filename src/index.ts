import { RegionResults01Parsed } from "@mocks/./";
import { RegionResultValue } from "@mocks/helpers/parseRegions";

import Chart from "./Chart";
import ProbabilitySamplingChart from "./ProbabilitySamplingChart";
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

  chart.x("param_block");
  chart.y("param_sig");

  const right = document.createElement("div");
  right.style.position = "absolute";
  right.style.right = "0px";
  right.style.width = "300px";

  document.body.appendChild(right);

  const chart2 = new RegionsChart(right, {
    options: { color, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    data: RegionResults01Parsed!,
    width: 300,
    height: 200,
  });

  const under = document.createElement("div");
  under.style.position = "absolute";
  under.style.top = "1200px";
  under.style.width = "800px";

  document.body.appendChild(under);

  new ProbabilitySamplingChart(under, {
    options: {
      color: (d: number) => "test",
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
    },
    expression:
      "(-1 * (pK^10*pL^10+(-120)*pK^7*pL^7+(-10)*pK^9*pL^9+45*pK^8*pL^8+210*pK^6*pL^6+(-250)*pK^5*pL^5+(-100)*pK^3*pL^3+25*pK^2*pL^2+200*pK^4*pL^4+(-1)))/(1)",
    intervals: [
      { name: "pL", start: 0.1, end: 0.9 },
      { name: "pK", start: 0.1, end: 0.9 },
    ],
    width: 800,
    height: 800,
  });
});

export default Chart;
