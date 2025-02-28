import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hr-microservice/',
  server: {
    proxy: {
      '/api': 'http://localhost:8100'
    },
    host: '0.0.0.0',
    port: 5173
  }
})
