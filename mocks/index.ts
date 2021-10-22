import RegionResults01 from "./data/regionResults01.csv";
import { csvToRegionResultsList, RegionResults } from "./helpers/parseRegions";

export const RegionResults01Parsed:
  | RegionResults
  | undefined = csvToRegionResultsList(RegionResults01);
