import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/my-profile': {
        target: 'http://localhost:5173',
        rewrite: () => '/index.html',
        changeOrigin: true
      },
      '/vehicle': {
        target: 'http://localhost:5173',
        rewrite: () => '/index.html',
        changeOrigin: true
      },
      '/activities': {
        target: 'http://localhost:5173',
        rewrite: () => '/index.html',
        changeOrigin: true
      },
      '/settings': {
        target: 'http://localhost:5173',
        rewrite: () => '/index.html',
        changeOrigin: true
      }
    }
  }
})
