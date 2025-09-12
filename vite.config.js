import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow all network interfaces
    open: true,
    strictPort: false, // Allow fallback to other ports if 3000 is busy
    cors: true, // Enable CORS
    hmr: {
      port: 3000
    }
  }
}) 