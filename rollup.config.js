import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/lib/index.js",
  external: ["react"],
  output: [
    {
      file: "dist/ysu.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/ysu.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
    commonjs(),
    postcss({
      extract: false,
      modules: true,
    }),
  ],
};
