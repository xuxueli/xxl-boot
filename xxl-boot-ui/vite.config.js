/*
* Description: Vite 配置文件
* */
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// Vite plugins (inlined from ./vite/plugins)
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'
import setupExtend from 'unplugin-vue-setup-extend-plus/vite'

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
  const API_URL = rawEnv.VITE_API_URL || 'http://localhost:8090';   // 后端API地址
  const APP_BASE_API = rawEnv.VITE_APP_BASE_API || '/api';              // 后端路由前缀
  const APP_ENV = rawEnv.VITE_APP_ENV;                              // 环境配置
  const APP_PORT = Number(rawEnv.VITE_APP_PORT) || 3000;    // 端口号

  // 是否为生产环境：
  const isBuild = command === 'build';

  /**
   * Vite 配置项：
   */
  return {
    /**
     * 基础公共路径 (Base Public Path)
     *    作用：指定打包后资源（JS, CSS, 图片等）在 HTML 中的引用前缀。通常生产环境如果部署在子目录（如 /app/），需修改为对应路径。
     *    文档：https://cn.vitejs.dev/config/#base
     */
    base: '/',
    /**
     * 插件系统 (Plugins)
     *    作用：注册 Vite 插件。
     *    文档：https://cn.vitejs.dev/guide/api-plugin.html
     */
    plugins: [
      /**
       * Vue 插件：解析 Vue 文件，将 .vue 文件中的模板、样式和脚本转换为 JavaScript。
       *    文档：https://cn.vitejs.dev/guide/using-vue.html
       */
      vue(),
      /**
       * 自动导入插件：自动导入 Vue 组件、Vue 函数、第三方库等，减少重复代码；
       *    文档：https://github.com/antfu/unplugin-auto-import
       */
      autoImport({
        imports: [
          'vue',                                      // 引入 Vue 官方组件
          'vue-router',                               // 引入 Vue 路由
          'pinia',                                    // 引入 Pinia 官方状态管理
        ],
        dts: false
      }),
      /**
       * 组件名称自动补充插件：自动补充组件名称，如：<setup-extend /> => <SetupExtend />
       *     文档：https://github.com/sxzz/vite-plugin-setup-extend
        */
      setupExtend({}),
      /**
       * SVG 图标插件：自动导入 SVG 图标，并生成 SVG 图标组件
       *     文档：https://github.com/sxzz/vite-plugin-svg-icons
       */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: isBuild
      }),
      /**
       * 压缩插件：压缩构建后的文件，如：gzip、brotli
       *     文档：https://github.com/vbenjs/vite-plugin-compression
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
     *    作用：配置路径别名，简化模块导入路径；配置文件扩展名，允许在导入时省略扩展名
     *    文档：https://cn.vitejs.dev/config/#resolve-alias 和 https://cn.vitejs.dev/config/#resolve-extensions
     */
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),         // ~ 映射到根目录
        '@': path.resolve(__dirname, './src')       // @ 映射到 src 目录
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'] // 配置文件扩展名，允许在导入时省略扩展名
    },
    /**
     * 构建配置：
     *    作用：构建优化，如：代码分割、静态资源处理、压缩、优化第三方依赖项
     *    文档：https://cn.vitejs.dev/config/#build-options
     */
    build: {
      sourcemap: isBuild ? false : 'inline',        // 生产环境打包时‌不生成Source Map；减小打包体积，提高加载速度；防止源代码泄露；
      outDir: 'dist',                                           // 构建输出目录
      assetsDir: 'assets',                                      // 静态资源目录
      chunkSizeWarningLimit: 2000,                              // 构建时超过指定大小会警告
      rollupOptions: {                                          // rollup 配置
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    /**
     * Vite 开发服务器（Dev Server）的代理配置‌：
     *    作用：解决前端开发过程中的‌跨域问题‌（CORS），前端应用将特定路径的请求转发到后端服务器，而浏览器认为这些请求是发往同源服务器的
     *    文档：https://cn.vitejs.dev/config/#server-proxy
     */
    server: {
      port: APP_PORT,       // 端口号
      strictPort: true,     // 端口被占用时直接退出
      host: true,           // 默认是localhost
      open: true,           // 运行自动打开浏览器
      proxy: {              // 代理配置，
        // development environment proxy
        [APP_BASE_API]: {
          target: API_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`^${APP_BASE_API}`), '')
        },
         // springdoc proxy
         '^/v3/api-docs/(.*)': {
          target: API_URL,
          changeOrigin: true,
        }
        /*'/api': {
          target: VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }*/
      }
    },
    /**
     * css 配置：
     *    作用：配置PostCSS插件以自动移除 CSS 文件中 @charset 声明，解决浏览器兼容性
     *    文档：https://cn.vitejs.dev/config/#css-postcss
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
