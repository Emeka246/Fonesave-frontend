import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ff3c6906b21f.ngrok-free.app',
      'orca-app-jqn6c.ondigitalocean.app', // ✅ DigitalOcean frontend
      'fonsave.com',                        // ✅ your main domain
      'www.fonsave.com'                     // ✅ www version
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
