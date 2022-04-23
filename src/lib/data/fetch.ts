import { csv, DSVRowArray } from "d3";

export const fetch = <Column extends string, ParsedRow>(
  from: string,
  parser?: (row: DSVRowArray<Column>) => ParsedRow
) => {
  return csv<Column>(from).then((data) => {
    if (parser) return parser(data);
    return data;
  });
};
