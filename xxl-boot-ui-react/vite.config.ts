import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

/**
 * Vite 构建配置
 * 环境变量：.rawEnv.development / .rawEnv.production / .rawEnv.staging
 */
export default defineConfig(({ mode, command }) => {
  /**
   * 获取环境变量：
   */
  const rawEnv = loadEnv(mode, process.cwd(), '');
  const API_URL = rawEnv.VITE_API_URL || 'http://localhost:8081';
  const APP_BASE_API = rawEnv.VITE_APP_BASE_API || '/api';
  const APP_PORT = Number(rawEnv.VITE_APP_PORT) || 4000;

  // 是否为生产环境：
  const isBuild = command === 'build';

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
        '~': fileURLToPath(new URL('./', import.meta.url)), // ~ 映射到根目录
        '@': fileURLToPath(new URL('./src', import.meta.url)), // @ 映射到 src 目录
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 配置文件扩展名，允许在导入时省略扩展名
    },
    /**
     * 构建配置：
     *    作用：构建优化，如：代码分割、静态资源处理、压缩、优化第三方依赖项
     *    文档：https://cn.vitejs.dev/config/#build-options
     */
    build: {
      sourcemap: isBuild ? false : 'inline',                   // 生产环境打包时不生成Source Map；减小打包体积，提高加载速度；防止源代码泄露；
      outDir: 'dist',                                          // 构建输出目录
      assetsDir: 'assets',                                     // 静态资源目录
      chunkSizeWarningLimit: 2000,                             // 构建时超过指定大小会警告
      rollupOptions: {                                         // rollup 配置
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    /**
     * Vite 开发服务器（Dev Server）的代理配置‌：
     */
    server: {
      port: APP_PORT,
      strictPort: true,     // 端口被占用时直接退出
      host: true,           // 默认是localhost
      open: true,           // 运行自动打开浏览器
      proxy: {
        // 请求前缀匹配
        [APP_BASE_API]: {
          // 后端API地址
          target: API_URL,
          // 请求头 Origin/Host 改目标地址域名
          changeOrigin: true,
          // 请求前缀移除
          rewrite: (path) => path.replace(new RegExp(`^${APP_BASE_API}`), ''),
        },
      },
    },
  };
});
