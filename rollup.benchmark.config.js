import dsv from '@rollup/plugin-dsv';

import { getCommonPlugins } from './rollup.config';

export default {
  input: 'benchmarks/index.ts',
  output: {
    file: `benchmarks/result.js`,
    format: 'cjs',
  },
  watch: false,
  external: ['canvas', 'jsdom'],
  plugins: [dsv(), ...getCommonPlugins(true, ['.js', '.ts'], [], '')],
};
