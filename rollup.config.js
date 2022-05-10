import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

const isProd = process.env.NODE_ENV === 'production';
const visualizeSpace = process.env.VISUALIZE_SPACE === 'true';

const prodExtensions = ['.js', '.ts'];
const demoExtensions = [...prodExtensions, '.jsx', '.tsx'];

const getCommonPlugins = (extensions, babelPlugins = [], workerLoadPath) => [
  alias({
    entries: [
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
    ],
  }),
  json(),
  resolve({
    extensions,
    preventAssignment: true,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    preventAssignment: true,
  }),
  commonjs({
    include: /node_modules/,
  }),
  webWorkerLoader({
    targetPlatform: 'browser',
    inline: false,
    loadPath: workerLoadPath,
  }),
  typescript({
    check: false,
    // typescript: require('typescript'),
    // cacheRoot: path.resolve(__dirname, '.rts2_cache'),
  }), // TEMP: Check is off
  babel({
    extensions,
    exclude: /node_modules/,
    babelHelpers: 'runtime',
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-runtime', ...babelPlugins, 'macros'],
  }),
];

export default [
  isProd
    ? {
        input: 'src/index.ts',
        output: [
          {
            file: 'es/index.js',
            format: 'es',
            plugins: [terser()],
            sourcemap: true,
          },
          {
            file: `umd/index.js`,
            format: 'umd',
            name: 'paramVis',
            plugins: [terser()],
          },
        ],
        plugins: [
          ...getCommonPlugins(prodExtensions, [], ''),
          visualizeSpace &&
            visualizer({
              open: true,
              template: 'treemap',
            }),
        ],
      }
    : {
        input: 'demo/index.tsx',
        output: {
          dir: `demo/dist/`,
          format: 'umd',
          sourcemap: true,
        },

        plugins: [
          ...getCommonPlugins(
            demoExtensions,
            [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'h',
                  pragmaFrag: 'Fragment',
                },
              ],
            ],
            '/dist',
          ),
          serve({
            open: true,
            contentBase: ['', 'demo'],
            port: 9000,
          }),
          livereload({ watch: ['src', 'demo'], port: 9000 }),
        ],
      },
];
