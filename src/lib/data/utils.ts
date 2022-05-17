import { csv } from 'd3-fetch';
import m from 'math-expression-evaluator';
import { DSVRowArray, DSVRowString, csvParseRows } from 'd3-dsv';
import { EvalFunction, Token } from '../../types/expression';

/**
 * Used to retrieve entire CSV from remote location
 *
 * @param from URL of desired CSV
 * @param parser CSV row parser
 * @returns
 */
export const fetchCSV = async <Column extends string, ParsedRow = DSVRowString<Column>>(
  from: string,
  parser?: (row: DSVRowArray<Column>) => ParsedRow[],
): Promise<ParsedRow[]> => {
  const data = await csv<Column>(from);
  if (parser) return parser(data);
  return data as unknown as ParsedRow[];
};

/**
 * Retrieves the last line of the text separated by \n
 * @param text
 * @returns Tuple - fst is last line, snd is index of the end of the penultimate line
 */
export const getLastTextLine = (text: string): [string, number] => {
  let i = text.length - 1;
  const buffer: string[] = [];

  for (; i >= 0 && text[i] !== '\n'; i -= 1) buffer.push(text[i]);

  return [buffer.reverse().join(''), i];
};

/**
 * Used for parsing Uint8Array chunks in ReadableStream
 */
export const csvStreamParser = () => {
  const decoder = new TextDecoder('UTF-8');
  let prevLine = '';
  let cols: string[] | null = null;

  return {
    parseChunk(chunk: Uint8Array) {
      let text = prevLine + decoder.decode(chunk);

      if (!cols) {
        const endOfFirstLine = text.indexOf('\n');

        const firstLine = text.slice(0, endOfFirstLine);
        text = text.slice(endOfFirstLine + 1);

        cols = firstLine.split(',').map(c => c.trim());
      }

      // Last line could be incomplete
      const [lastLine, i] = getLastTextLine(text);
      prevLine = lastLine;

      const lastLineItems: (string | undefined)[] = csvParseRows(lastLine)[0];

      return csvParseRows(text.slice(0, i + 1), d =>
        cols?.reduce((acc, col, i) => ({ ...acc, [col]: d[i]?.trim() }), {}),
      );
    },
    lastLine: prevLine,
  };
};

export const calculateSampling = (
  pairs: Record<string, string | number>[],
  expression: string,
  tokens: Token[],
) => {
  const exp: EvalFunction = pair => m.eval(expression, tokens, pair);
  return pairs.map(pair => exp(pair));
};
