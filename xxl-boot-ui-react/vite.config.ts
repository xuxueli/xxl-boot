/*
* Description: Vite 配置文件
* */
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// Vite plugins
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'

/**
 * Vite 配置文件：
 *    作用：Vite 配置文件，用于配置 Vite 的各种选项，如：构建、代理、环境变量、插件等
 *    文档：https://vitejs.dev/config/
 */
export default defineConfig(({ mode, command }) => {

  /**
   * 获取环境变量：
   */
  const rawEnv = loadEnv(mode, process.cwd());                      // 获取环境变量
  const API_URL = rawEnv.VITE_API_URL || 'http://localhost:8081';               // 后端API地址
  const APP_BASE_API = rawEnv.VITE_APP_BASE_API || '/api';                      // 后端路由前缀
  const APP_ENV = rawEnv.VITE_APP_ENV;                                          // 环境配置
  const APP_PORT = Number(rawEnv.VITE_APP_PORT) || 3000;                      // 端口号

  // 是否为生产环境：
  const isBuild = command === 'build';

  /**
   * Vite 配置项：
   */
  return {
    /**
     * 基础公共路径 (Base Public Path)
     *    作用：指定打包后资源（JS, CSS, 图片等）在 HTML 中的引用前缀。通常生产环境如果部署在子目录（如 /app/），需修改为对应路径。
     */
    base: '/',
    /**
     * 插件系统 (Plugins)
     */
    plugins: [
      /**
       * React 插件：解析 JSX/TSX，支持 React Fast Refresh。
       */
      react(),
      /**
       * SVG 图标插件：自动导入 SVG 图标，并生成 SVG 图标组件（symbol sprite）
       */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: isBuild
      }),
      /**
       * 压缩插件：压缩构建后的文件，如：gzip、brotli
       */
      ...(() => {
        const compressionList = []
        if (isBuild) {
          compressionList.push(
            compression({
              ext: '.gz',
              deleteOriginFile: false
            })
          )
          compressionList.push(
            compression({
              ext: '.br',
              algorithm: 'brotliCompress',
              deleteOriginFile: false
            })
          )
        }
        return compressionList
      })()
    ],
    /**
     * 路径配置：
     *    作用：配置路径别名，简化模块导入路径
     */
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    /**
     * 构建配置：
     *    作用：构建优化，如：代码分割、静态资源处理、压缩、优化第三方依赖项
     */
    build: {
      sourcemap: isBuild ? false : 'inline',
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    /**
     * Vite 开发服务器（Dev Server）的代理配置：
     *    作用：解决前端开发过程中的跨域问题（CORS）
     */
    server: {
      port: APP_PORT,
      strictPort: true,
      host: true,
      open: true,
      proxy: {
        [APP_BASE_API]: {
          target: API_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`^${APP_BASE_API}`), '')
        }
      }
    },
    /**
     * css 配置：
     *    作用：移除 CSS 文件中 @charset 声明，解决浏览器兼容性
     */
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  }
})
