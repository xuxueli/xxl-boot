/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 本地开发环境：/api/** -> http://localhost:8081（xxl-boot-api）
  // 后端接口无 /api 前缀，代理时剥掉该前缀（与 xxl-boot-ui 的 Vite 代理保持一致）
  dev: {
    '/api/': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
