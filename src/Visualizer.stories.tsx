import React from "react";
import { RegionResults01Parsed } from "../mocks";

import Visualizer from "./Visualizer";

export default {
  title: "Components/Visualizer",
  component: Visualizer,
};

const mockData = RegionResults01Parsed ?? [];

export const Basic = () => {
  return <Visualizer data={mockData} />;
};
