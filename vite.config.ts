import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * 这个站点不是 SPA：页面由 scripts/build-blog.ts 静态生成。
 * Vite 在这里只负责一件事——把 src/entry.ts 引到的 styles.css 编译成带 hash 的产物。
 * 所以 input 直接指向 entry.ts，而不是 index.html。
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: fileURLToPath(new URL('./src/entry.ts', import.meta.url)),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});
