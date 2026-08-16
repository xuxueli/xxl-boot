import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

/**
 * Vite 构建配置
 * 环境变量：.rawEnv.development / .rawEnv.production / .rawEnv.staging
 */
export default defineConfig(({ mode }) => {

  /**
   * 获取环境变量：
   */
  const rawEnv = loadEnv(mode, process.cwd(), '');
  const API_URL = rawEnv.VITE_API_URL || 'http://localhost:8081';
  const APP_BASE_API = rawEnv.VITE_APP_BASE_API || '/api';
  const APP_PORT = Number(rawEnv.VITE_APP_PORT) || 4000;

  /**
   * Vite 配置项：
   */
  return {
    /*
    * 插件系统 (Plugins)
    */
    plugins: [react()],
    /**
     * 路径配置：
     *    作用：配置路径别名，简化模块导入路径；配置文件扩展名，允许在导入时省略扩展名
     *    文档：https://cn.vitejs.dev/config/#resolve-alias 和 https://cn.vitejs.dev/config/#resolve-extensions
     */
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),   // ~ 映射到根目录
        '@': fileURLToPath(new URL('./src', import.meta.url)) // @ 映射到 src 目录
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 配置文件扩展名，允许在导入时省略扩展名
    },
    /**
     * 构建配置 (Build Options)
     *  - outDir: 输出目录，默认 dist
     *  - chunkSizeWarningLimit: 分块大小警告限制，单位 KB，默认 500
     */
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2048,
    },
    /**
     * Vite 开发服务器（Dev Server）的代理配置‌：
     */
    server: {
      port: APP_PORT,
      host: true,
      open: true,
      proxy: {
        // 开发代理：/api -> 后端地址，后端无 /api 前缀需剥离
        [APP_BASE_API]: {
          target: API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${APP_BASE_API}`), ''),
        },
      },
    },

  };
});
