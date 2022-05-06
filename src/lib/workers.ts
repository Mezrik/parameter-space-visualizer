import { default as DataWorkerBase } from 'web-worker:./data/dataStreamWorker.ts';
import { default as SamplingWorkerBase } from 'web-worker:./data/samplingWorker.ts';

export const DataWorker = DataWorkerBase;

export const SamplingWorker = SamplingWorkerBase;
