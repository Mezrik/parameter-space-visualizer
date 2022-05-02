import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { setup, styled } from "goober";
import Router from "preact-router";
import { AppShell } from "@mantine/core";

import { createProabilityColorScale } from "../src/helpers/general";
import ProbabilitySamplingChart from "../src/ProbabilitySamplingChart";
import { RegionResultValue } from "../src/lib/data/parse";
import Navbar from "./components/Layout/Navbar";

const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: "#f0c928",
  false: "#ab0d0c",
  unknown: "#fbe6c2",
  partially_sat: "#ffdc4f",
  partially_violated: "#fbe6c2",
  center_sat: "#e0c141",
  center_violated: "#fbe6c2",
};

const colorScale = createProabilityColorScale([
  COLOR_MAPPING.false,
  COLOR_MAPPING.true,
]);

setup(h);

const App = () => {
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

  return (
    <AppShell padding="md" navbar={<Navbar />}>
      <div ref={ref}></div>
    </AppShell>
  );
};

render(<App />, document.body);
