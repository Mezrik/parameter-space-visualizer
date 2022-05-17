import { expose } from 'comlink';

import { calculateSampling } from './utils';

const worker = { calculateSampling };
export type SamplingWorkerType = typeof worker;

expose(worker);
