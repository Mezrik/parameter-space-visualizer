import RegionResults01 from "./data/csv/regions/ok-results/test01.csv";
import RegionResults02 from "./data/csv/regions/ok-results/brp01.csv";
import RegionResults03 from "./data/csv/regions/ok-results/brp02.csv";
import RegionResults04 from "./data/csv/regions/ok-results/brp03.csv";
import ParametricDie3DData from "./data/csv/regions/ok-results/test3d.csv";

import { csvToRegionResultsList } from "./helpers/parseRegions";

export const RegionResults01Parsed = csvToRegionResultsList(RegionResults01);

export const RegionResults02Parsed = csvToRegionResultsList(RegionResults02);

export const RegionResults03Parsed = csvToRegionResultsList(RegionResults03);

export const RegionResults04Parsed = csvToRegionResultsList(RegionResults04);

export const ParametricDieData3DParsed =
  csvToRegionResultsList(ParametricDie3DData);
