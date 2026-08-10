import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isDashboard = process.env.VITE_DEPLOY_TARGET === 'dashboard';

  return {
    plugins: [react()],
    base: command === 'serve' ? '/' : isDashboard ? './' : '/lowprofile/',
    build: {
      outDir: isDashboard ? 'dist-dcs' : 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 5500,
      strictPort: true,
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  };
});
