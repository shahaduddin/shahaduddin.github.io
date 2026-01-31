import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Ensures assets are linked relatively for GitHub Pages
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          pynum: resolve(__dirname, 'PyNum/index.html')
        },
      },
    },
    define: {
      // Define the API key so it's available in the PyNum app code
      // Default to empty string to prevent "process.env.API_KEY is undefined" crashes
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || '')
    }
  }
})
