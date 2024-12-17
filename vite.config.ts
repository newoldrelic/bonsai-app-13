import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    cors: true
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  define: {
    'process.env': mode === 'development' 
      ? {
          NODE_ENV: JSON.stringify('development'),
          DEBUG_LEVELS: JSON.stringify(process.env.VITE_DEBUG_LEVELS || '4')
        }
      : {
          NODE_ENV: JSON.stringify('production'),
          DEBUG_LEVELS: JSON.stringify(process.env.VITE_DEBUG_LEVELS || '1')
        }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));