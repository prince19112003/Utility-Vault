import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Ye line Google Login popup ko block hone se rokegi
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
