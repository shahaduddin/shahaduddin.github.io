
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  
  return {
    plugins: [react()],
    base: '/', // Base is root because it's served from shahaduddin.com root
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          PyNum: path.resolve(__dirname, 'PyNum/index.html')
        },
      },
    },
    define: {
      // Direct injection of API_KEY as required by guidelines
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  }
})
