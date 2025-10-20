import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    headers: {
      // This helps with the Cross-Origin-Opener-Policy issue
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    },
     build: {    
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {        
        manualChunks: {          
          vendor: ['react', 'react-dom'],          
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],          
          ui: ['react-toastify']
        }
      }
    }
  },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
