import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/302/',
  server: {
    port: 5302,
    strictPort: true,
  },
});
