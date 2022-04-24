import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import { visualizer } from "rollup-plugin-visualizer";
import webWorkerLoader from "rollup-plugin-web-worker-loader";

const isProd = process.env.NODE_ENV === "production";
const visualizeSpace = process.env.VISUALIZE_SPACE === "true";

const extensions = [".js", ".ts"];

export default {
  input: "src/index.ts",
  output: [
    {
      file: "es/index.js",
      format: "es",
      plugins: [isProd && terser()],
    },
    {
      file: `umd/index.js`,
      format: "umd",
      name: "paramVis",
      plugins: [isProd && terser()],
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      extensions,
      preventAssignment: true,
    }),
    commonjs({
      include: /node_modules/,
    }),
    webWorkerLoader(),
    typescript(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      ),
      preventAssignment: true,
    }),
    babel({
      extensions,
      exclude: /node_modules/,
      presets: ["@babel/preset-env", "@babel/preset-typescript"],
    }),
    visualizeSpace &&
      visualizer({
        open: true,
        template: "treemap",
      }),
    !isProd &&
      serve({
        open: true,
        contentBase: ["", "public"],
        port: 9000,
      }),
    !isProd && livereload({ watch: ["src", "umd"], port: 9000 }),
  ],
};
