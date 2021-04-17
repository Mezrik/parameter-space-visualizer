import RegionResults01 from "./data/regionResults01.csv";
import { csvToRegionResultsList } from "./helpers/parseRegions";

export const RegionResults01Parsed = csvToRegionResultsList(RegionResults01);
