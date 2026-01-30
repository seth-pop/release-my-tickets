import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/release-my-tickets/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  }
})
