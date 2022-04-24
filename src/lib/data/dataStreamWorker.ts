import { expose } from "comlink";
import { csvParse } from "d3-dsv";
import { csvStreamParser } from "./utils";

type OnLoadCallback = (values: {}[]) => void;

const startStream =
  (r: Response, parse: (xs: Uint8Array) => {}[], onLoad: OnLoadCallback) =>
  (controller: ReadableStreamController<Uint8Array>) => {
    const reader = r.body!.getReader();

    const read = async () => {
      const { done, value } = await reader.read();
      if (done || !value) {
        controller.close();
        return;
      }

      const parsed = parse(value);
      onLoad(parsed);

      controller.enqueue(value);
      read();
    };

    read();
  };

const streamData = async (filename: string, onLoad: OnLoadCallback) => {
  const response = await fetch(filename);

  if (!response.body) {
    throw Error("ReadableStream is not supported in your browser.");
  }

  const parser = csvStreamParser();

  const streamedResponse = new Response(
    new ReadableStream({
      start: startStream(response, parser.parseChunk, onLoad),
    })
  );

  const data = await streamedResponse.text();

  return csvParse(data);
};

const worker = { streamData };
export type DataStreamWorker = typeof worker;

expose(worker);
