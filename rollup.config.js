import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import webWorkerLoader from "rollup-plugin-web-worker-loader";

const isProd = process.env.NODE_ENV === "production";
const visualizeSpace = process.env.VISUALIZE_SPACE === "true";

const prodExtensions = [".js", ".ts"];
const demoExtensions = [...prodExtensions, ".jsx", ".tsx"];

const getCommonPlugins = (extensions, babelPlugins = []) => [
  resolve({
    extensions,
    preventAssignment: true,
  }),
  commonjs({
    include: /node_modules/,
  }),
  webWorkerLoader(),
  typescript(),
  babel({
    extensions,
    exclude: /node_modules/,
    babelHelpers: "runtime",
    presets: ["@babel/preset-env", "@babel/preset-typescript"],
    plugins: ["@babel/plugin-transform-runtime", ...babelPlugins],
  }),
];

export default [
  isProd
    ? {
        input: "src/index.ts",
        output: [
          {
            file: "es/index.js",
            format: "es",
            plugins: [terser()],
          },
          {
            file: `umd/index.js`,
            format: "umd",
            name: "paramVis",
            plugins: [terser()],
            sourcemap: true,
          },
        ],
        plugins: [
          ...getCommonPlugins(prodExtensions),
          visualizeSpace &&
            visualizer({
              open: true,
              template: "treemap",
            }),
        ],
      }
    : {
        input: "demo/index.tsx",
        output: {
          file: `demo/dist/index.js`,
          format: "umd",
          name: "paramVis",
          sourcemap: true,
        },

        plugins: [
          ...getCommonPlugins(demoExtensions, [
            [
              "@babel/plugin-transform-react-jsx",
              {
                pragma: "h",
                pragmaFrag: "Fragment",
              },
            ],
          ]),
          serve({
            open: true,
            contentBase: ["", "demo"],
            port: 9000,
          }),
          livereload({ watch: ["src", "demo"], port: 9000 }),
        ],
      },
];
