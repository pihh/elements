// vite.config.js
import { defineConfig } from "file:///C:/Users/0101567/OneDrive%20-%20Softinsa/Desktop/Development/PIHH/web-components/elements/node_modules/vite/dist/node/index.js";
import babel from "file:///C:/Users/0101567/OneDrive%20-%20Softinsa/Desktop/Development/PIHH/web-components/elements/node_modules/vite-plugin-babel/dist/index.mjs";
var vite_config_default = defineConfig({
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
          "transform-html-import-to-string"
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 314,
    open: "/"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwwMTAxNTY3XFxcXE9uZURyaXZlIC0gU29mdGluc2FcXFxcRGVza3RvcFxcXFxEZXZlbG9wbWVudFxcXFxQSUhIXFxcXHdlYi1jb21wb25lbnRzXFxcXGVsZW1lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwwMTAxNTY3XFxcXE9uZURyaXZlIC0gU29mdGluc2FcXFxcRGVza3RvcFxcXFxEZXZlbG9wbWVudFxcXFxQSUhIXFxcXHdlYi1jb21wb25lbnRzXFxcXGVsZW1lbnRzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8wMTAxNTY3L09uZURyaXZlJTIwLSUyMFNvZnRpbnNhL0Rlc2t0b3AvRGV2ZWxvcG1lbnQvUElISC93ZWItY29tcG9uZW50cy9lbGVtZW50cy92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBiYWJlbCBmcm9tIFwidml0ZS1wbHVnaW4tYmFiZWxcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gcGx1Z2luczogWyBodG1sSW1wb3J0IF1cclxuICAvLyBwbHVnaW5zOiBbXHJcbiAgLy8gICBiYWJlbCh7XHJcbiAgLy8gICAgIGJhYmVsQ29uZmlnOiB7XHJcbiAgLy8gICAgICAgYmFiZWxyYzogZmFsc2UsXHJcbiAgLy8gICAgICAgY29uZmlnRmlsZTogZmFsc2UsXHJcbiAgLy8gICAgICAgcGx1Z2luczogW1xyXG4gIC8vICAgICAgICAgW1xyXG4gIC8vICAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLFxyXG4gIC8vICAgICAgICAgICB7XHJcbiAgLy8gICAgICAgICAgICAgIGxvb3NlOiB0cnVlLFxyXG4gIC8vICAgICAgICAgICAgIHZlcnNpb246IFwiMjAyMi0wM1wiLFxyXG4gIC8vICAgICAgICAgICAgIC8vIFwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydFwiOiB0cnVlXHJcbiAgLy8gICAgICAgICAgIH0sXHJcbiAgLy8gICAgICAgICBdLFxyXG4gIC8vICAgICAgICAgLy8gXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWNsYXNzLXByb3BlcnRpZXNcIixcclxuICAvLyAgICAgICAgIFwiQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tY2xhc3MtcHJvcGVydGllc1wiLFxyXG4gIC8vICAgICAgICAgXCJ0cmFuc2Zvcm0taHRtbC1pbXBvcnQtdG8tc3RyaW5nXCIsXHJcbiAgLy8gICAgICAgXSxcclxuICAvLyAgICAgfSxcclxuICAvLyAgIH0pLFxyXG4gIC8vIF0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgYmFiZWwoe1xyXG4gICAgICBiYWJlbENvbmZpZzoge1xyXG4gICAgICAgIGJhYmVscmM6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgIC8vIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLCB7IFwidmVyc2lvblwiOiBcIjIwMjMtMDVcIiB9XSxcclxuICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLCB7IHZlcnNpb246IFwibGVnYWN5XCIgfV0sXHJcbiAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIixcclxuICAgICAgICAgIFwidHJhbnNmb3JtLWh0bWwtaW1wb3J0LXRvLXN0cmluZ1wiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIHBvcnQ6IDMxNCxcclxuICAgIG9wZW46IFwiL1wiLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gW1wiQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1kZWNvcmF0b3JzXCIsIHsgXCJkZWNvcmF0b3JzQmVmb3JlRXhwb3J0XCI6IHRydWUgfV0sXHJcbi8vIFwiQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1jbGFzcy1wcm9wZXJ0aWVzXCJcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1YyxTQUFTLG9CQUFvQjtBQUNwZSxPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQXVCMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLFFBQ1gsU0FBUztBQUFBLFFBQ1QsWUFBWTtBQUFBLFFBQ1osU0FBUztBQUFBO0FBQUEsVUFFUCxDQUFDLHFDQUFxQyxFQUFFLFNBQVMsU0FBUyxDQUFDO0FBQUEsVUFDM0Q7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
