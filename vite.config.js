import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'three/examples/jsm/controls/OrbitControls',
      'three/examples/jsm/geometries/TextGeometry',
      'three/examples/jsm/fonts/helvetiker_regular.typeface.json',
    ],
    exclude: ['node_modules/.vite'],
  },
  server: {
    middlewareMode: false,
  },
  build: {
    assetsInlineLimit: 0,
    copyPublicDir: true,
  },
  publicDir: 'public',
})
