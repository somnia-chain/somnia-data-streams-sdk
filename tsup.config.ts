import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  target: [
    // NodeJS LTS as of 10/25
    'node20',
    // "widely available" browsers, as of 10/25
    // Source: https://web-platform-dx.github.io/web-features/supported-browsers/?target=widelyAvailable
    'es2020',
    'chrome111',
    'edge111',
    'firefox111',
    'safari16',
  ],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  // Options taken from vite (which uses esbuild under the hood)
  // See https://github.com/vitejs/vite/blob/d395e821d9927875cca9fb7d7354478b2701f8c7/packages/vite/src/node/plugins/esbuild.ts#L462
  minify: false,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: false,
  treeshake: true,
});
