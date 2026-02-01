
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, __dirname, '');
  
  return {
    plugins: [react()],
    base: '/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          PyNum: resolve(__dirname, 'PyNum/index.html')
        },
      },
    },
    define: {
      // Map user's secret key to the expected process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || '')
    }
  }
})
