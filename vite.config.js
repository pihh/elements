import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
  // plugins: [ htmlImport ]
  // plugins: [
  //   babel({
  //     babelConfig: {
  //       babelrc: false,
  //       configFile: false,
  //       plugins: [
  //         [
  //           "@babel/plugin-proposal-decorators",
  //           {
  //              loose: true,
  //             version: "2022-03",
  //             // "decoratorsBeforeExport": true
  //           },
  //         ],
  //         // "@babel/plugin-proposal-class-properties",
  //         "@babel/plugin-transform-class-properties",
  //         "transform-html-import-to-string",
  //       ],
  //     },
  //   }),
  // ],
  plugins: [
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          // ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
          ["@babel/plugin-proposal-decorators", { version: "legacy" }],
          "@babel/plugin-transform-class-properties",
          "transform-html-import-to-string",
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 314,
    open: "/",
  },
});

// ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
// "@babel/plugin-proposal-class-properties"
