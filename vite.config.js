import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
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
        strictPort: true
    },
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
});
