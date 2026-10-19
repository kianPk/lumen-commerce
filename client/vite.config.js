import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    port: 5175,
    proxy: { '/api': 'http://localhost:8791' },
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
