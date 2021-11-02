import React from "react";
import { RegionResultValue } from "@mocks/helpers/parseRegions";
import { RegionResults02Parsed } from "../mocks";

import Visualizer from "./Visualizer";

export default {
  title: "Components/Visualizer",
  component: Visualizer,
};

const MOCK_DATA = RegionResults02Parsed ?? [];

const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: "#f4c941",
  false: "#b30e17",
  unknown: "#fde6c4",
  partially_sat: "#fde6c4",
  partially_violated: "#fde6c4",
};

export const Basic = () => {
  return <Visualizer data={MOCK_DATA} colorMap={COLOR_MAPPING} />;
};
