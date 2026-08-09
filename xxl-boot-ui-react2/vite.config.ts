import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

/**
 * Vite 构建配置（替代原 Umi Max）
 * 环境变量：.env.development / .env.production / .env.staging
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const baseApi = env.VITE_APP_BASE_API || '/api';
  const apiUrl = env.VITE_API_URL || 'http://localhost:8081';
  const port = Number(env.VITE_APP_PORT) || 8000;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@root': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    server: {
      port,
      host: true,
      open: true,
      proxy: {
        // 开发代理：/api -> 后端地址，后端无 /api 前缀需剥离
        [baseApi]: {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${baseApi}`), ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2048,
    },
  };
});
