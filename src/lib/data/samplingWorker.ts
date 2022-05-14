import { expose } from 'comlink';
import m from 'math-expression-evaluator';
import { EvalFunction, Token } from '../../types/expression';
import {
  create,
  bignumberDependencies,
  numberDependencies,
  evaluateDependencies,
  compileDependencies,
  ConfigOptions,
  BigNumber,
} from 'mathjs';

const config: ConfigOptions = {
  number: 'BigNumber', // Default type of number:
  // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 64, // Number of significant digits for BigNumbers
};

const math = create(
  {
    compileDependencies,
    evaluateDependencies,
    numberDependencies,
    bignumberDependencies,
  },
  config,
);

const calculateSampling = (
  pairs: Record<string, string | number>[],
  expression: string,
  tokens: Token[],
) => {
  const exp = math.compile(expression);

  const result = pairs.map(pair => {
    return math.number(
      exp.evaluate(
        Object.entries(pair).reduce<Record<string, BigNumber>>(
          (acc, [key, val]) => ({ ...acc, [key]: math.bignumber(val) }),
          {},
        ),
      ),
    );
  });

  console.log(result);
  return result;
};

const worker = { calculateSampling };
export type SamplingWorkerType = typeof worker;

expose(worker);
