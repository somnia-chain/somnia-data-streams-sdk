import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  // 🚀 OPTİMİZASYON 1: Target'ı daha kısa ve kapsayıcı tuttuk.
  target: [
    // NodeJS LTS (Ekim 2023 itibarıyla)
    'node20',
    // Tarayıcılar için genel olarak uyumlu modern ES sürümü
    'es2021', // es2020 yerine es2021 veya esnext kullanmak, modern tarayıcıları daha iyi hedefler.
  ],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  // 🚀 OPTİMİZASYON 2: Minify ayarlarını sadeleştirdik.
  // Bu ayar, 'minifyIdentifiers', 'minifySyntax' ve 'minifyWhitespace' ayarlarını otomatik olarak 'true' yapar.
  minify: true, 
  // treeshake ayarı çok iyi, aynen korundu.
  treeshake: true,
});
