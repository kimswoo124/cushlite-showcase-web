import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/lowprofile/',
  server: {
    port: 5500,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
}));
