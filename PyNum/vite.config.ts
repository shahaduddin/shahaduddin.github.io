
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    // Search for .env files in the root directory (one level up)
    const rootDir = path.resolve(__dirname, '..');
    const env = loadEnv(mode, rootDir, '');
    
    /**
     * Resolve the API key from various potential sources:
     * 1. .env file in root (GEMINI_API_KEY)
     * 2. System environment variables (standard for Secrets/CI)
     * 3. Fallback to older 'API_KEY' naming convention if present
     */
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || '';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // String replacement for process.env.API_KEY used by the GenAI SDK
        'process.env.API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
