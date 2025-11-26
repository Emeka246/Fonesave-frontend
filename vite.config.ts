import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  root: ".", // ✅ ensures Vite uses the project root
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // no dot needed
    },
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ff3c6906b21f.ngrok-free.app',
      'squid-app-brwax.ondigitalocean.app',
      'foneowner.com',
      'www.foneowner.com',
      'fonsave.com',
      'www.fonsave.com'
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true, // ✅ forces fresh rebuild
    sourcemap: false,
  },
})
