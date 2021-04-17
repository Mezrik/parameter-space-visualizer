import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import { visualizer } from "rollup-plugin-visualizer";

const isProd = process.env.NODE_ENV === "production";
const visualizeSpace = process.env.VISUALIZE_SPACE === "true";

const extensions = [".js", ".ts", ".tsx"];

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "es/index.js",
      format: "es",
      plugins: [isProd && terser()],
    },
    {
      file: `umd/index.js`,
      format: "umd",
      plugins: [isProd && terser()],
    },
  ],
  plugins: [
    typescript(),
    resolve({
      extensions,
      preventAssignment: true,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      ),
    }),
    babel({
      extensions,
      exclude: /node_modules/,
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
    }),
    commonjs({
      include: /node_modules/,
    }),
    visualizeSpace &&
      visualizer({
        open: true,
        template: "treemap",
      }),
    !isProd &&
      serve({
        open: true,
        verbose: true,
        contentBase: ["", "public"],
        host: "localhost",
        port: 9000,
      }),
    !isProd &&
      livereload({
        watch: "dist",
      }),
  ],
};
