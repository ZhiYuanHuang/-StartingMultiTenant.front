import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from "vite";

// https://vitejs.dev/config/
export default {
  plugins: [react()],
};
