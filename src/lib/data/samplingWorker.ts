import { expose } from 'comlink';
import m from 'math-expression-evaluator';
import { EvalFunction, Token } from '../../types/expression';

const calculateSampling = (
  pairs: Record<string, string | number>[],
  expression: string,
  tokens: Token[],
) => {
  const exp: EvalFunction = pair => m.eval(expression, tokens, pair);
  return pairs.map(pair => exp(pair));
};

const worker = { calculateSampling };
export type SamplingWorkerType = typeof worker;

expose(worker);
