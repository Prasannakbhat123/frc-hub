import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    // === LANDING_ONLY: restore backend proxy — uncomment below when API is back ===
    // proxy: {
    //   '/v1': {
    //     target: 'http://localhost:4100',
    //     changeOrigin: true,
    //   },
    //   '/health': {
    //     target: 'http://localhost:4100',
    //     changeOrigin: true,
    //   },
    // },
    // === /LANDING_ONLY ===
  },
})
