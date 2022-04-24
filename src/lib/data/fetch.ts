import { csv, DSVRowArray, DSVRowString } from "d3";

export const fetch = <Column extends string, ParsedRow = DSVRowString<Column>>(
  from: string,
  parser?: (row: DSVRowArray<Column>) => ParsedRow[]
): Promise<ParsedRow[]> => {
  return csv<Column>(from).then((data): ParsedRow[] => {
    if (parser) return parser(data);
    return data as unknown as ParsedRow[];
  });
};
