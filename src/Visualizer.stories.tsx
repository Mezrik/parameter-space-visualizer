import React from "react";
import { RegionResults01Parsed } from "../mocks";

import Visualizer from "./Visualizer";

export default {
  title: "Components/Visualizer",
  component: Visualizer,
};

export const Basic = () => {
  console.log(RegionResults01Parsed);
  return <Visualizer />;
};
