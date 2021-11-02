import React from "react";
import { RegionResults03Parsed } from "../mocks";

import Visualizer from "./Visualizer";

export default {
  title: "Components/Visualizer",
  component: Visualizer,
};

const mockData = RegionResults03Parsed ?? [];

export const Basic = () => {
  return <Visualizer data={mockData} />;
};
