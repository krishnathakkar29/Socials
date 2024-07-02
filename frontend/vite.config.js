import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    proxy:{
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true
      }
    }
  }
})
