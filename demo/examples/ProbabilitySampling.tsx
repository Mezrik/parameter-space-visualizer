import { useEffect, useState } from "preact/hooks";
import { COLOR_MAPPING } from "../constants";

import { createProabilityColorScale } from "../../src/helpers/general";
import ProbabilitySamplingChart from "../../src/ProbabilitySamplingChart";

const colorScale = createProabilityColorScale([
  COLOR_MAPPING.false,
  COLOR_MAPPING.true,
]);

const ProbabilitySampling = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const chart = new ProbabilitySamplingChart(container, {
        options: {
          color: ({ value }) => {
            return typeof value === "number" ? colorScale(value) : "#fde6c4";
          },
          margin: { top: 20, right: 30, bottom: 30, left: 40 },
        },
        expression: "(-1 * ((p+(-1)) * (q*r+(-1)*r+(-1)*q+1)))/(q*r+(-1)*r+1)",
        intervals: [
          // { name: "pL", start: 0, end: 1 },
          // { name: "pK", start: 0, end: 1 },
          { name: "p", start: 0, end: 1 },
          { name: "q", start: 0, end: 0.5 },
          { name: "r", start: 1 / 10, end: 3 / 10 },
        ],
        width: 800,
        height: 800,
      });
    }
  }, [container]);

  return <div ref={ref} />;
};

export default ProbabilitySampling;
