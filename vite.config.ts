import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to our backend server
    proxy: {
      '/api': {
        target: 'https://bodega-backend-g49y.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
