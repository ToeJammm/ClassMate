import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  const env = loadEnv(mode, process.cwd());

  // Load environment variables from .env file
  dotenv.config();

  // Determine the API base URL based on the mode
  const apiBaseUrl = mode === 'devlocal' ? 'http://localhost:7071' : 'https://classmate-backend-h16a.onrender.com';

  return {
    plugins: [react()],
    define: {
      'process.env': env,
      '__API_BASE_URL__': JSON.stringify(apiBaseUrl)
    }
    // Additional configuration if necessary
  };
});