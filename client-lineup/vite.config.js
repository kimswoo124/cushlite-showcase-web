import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/lineup/',
  server: {
    port: 5400,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
}));
