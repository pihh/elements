// vite.config.js
import { defineConfig } from "vite";
//import path from 'path';
// import fs from 'fs';
// import { extractComponentConfiguration } from './utils/compile/component-configuration';

// import { Compile } from './lib';
export default defineConfig(({ command }) => ({
  // ...
  plugins: [
    // ...
    {
      name: "build-index",
      async buildStart(options) {
        // const CHOICES = fs.readdirSync(`${__dirname}/components`);

        // const TONI = extractComponentConfiguration(TheToni,configuration)
        // console.log('buildStart', {TONI})
        if (command == "serve") return;

        // <logic>
      },
    },
  ],
}));
