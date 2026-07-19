/**
 * 插件名称：tab（多标签页管理插件）
 *
 * 一、能力说明
 * - 负责应用顶部多标签页（tagsView）的打开、关闭、刷新、切换、更新等全套操作
 * - 与 Pinia tagsView store 和 Vue Router 深度联动，保持标签状态与路由状态始终一致
 * - 支持按方位或范围批量关闭：左侧、右侧、其他、全部
 * - 支持打开新页面并同步注册到 tagsView，实现导航历史管理
 *
 * 二、设计说明
 * - 本插件不包含 UI 渲染，仅封装状态操作与路由跳转逻辑
 * - 所有操作均围绕"当前路由 + tagsView 已访问列表"展开
 * - 刷新页面时通过 /redirect 中间路由实现组件重新挂载，同时携带原始 query 参数还原
 * - 挂载到 Vue 全局属性（$tab）后，可在任意组件中通过 this.$tab 调用，无需单独引入
 *
 * 三、与 util 的区别
 * - util：纯函数、低副作用、即引即用，适合数据处理、格式化、校验等局部能力
 * - plugin（本文件）：强依赖运行时上下文（router、store），面向全局能力注入，适合跨组件共享的系统级行为
 *
 * 四、典型用法（组件内）
 * ```js
 * // Options API
 * this.$tab.openPage('用户管理', '/system/user', { id: 1 })
 * this.$tab.refreshPage()
 * this.$tab.closePage()
 * this.$tab.closeLeftPage()
 *
 * // Composition API
 * const { proxy } = getCurrentInstance()
 * proxy.$tab.closeAllPage()
 * proxy.$tab.updatePage(newRoute)
 * ```
 *
 * 五、参数传递说明（openPage）
 * - openPage 的第三个参数 params 会作为路由 query 传入 router.push
 * - 最终体现为 URL 中的 GET 风格查询字符串，例如：/system/user?id=1
 * - 非 POST 请求，不会向后端发起表单提交，参数仅在前端路由层面流转
 *
 * 六、刷新机制说明（refreshPage）
 * - 刷新时先删除 tagsView 中该页面的缓存视图（delCachedView），触发组件销毁
 * - 再通过 router.replace 跳转到 /redirect + 原始路径，并携带原始 query 参数
 * - /redirect 路由会立即再次跳回原始路径，从而触发组件完整重新挂载
 * - 整个过程中 query 参数始终保留，页面刷新后参数不会丢失
 *
 * 七、挂载方式（plugins/index.js）
 * ```js
 * app.config.globalProperties.$tab = tab
 * ```
 */
// 这里import后直接应用，使用时再实时获取。不支持别名用法，该工具在Pinia初始化前使用，别名会导致找不到store。
import { useTagsViewStore } from '@/store'
import router from '@/router'

export default {
  // ==================== 一、刷新页面 ====================

  /**
   * 刷新当前标签页（强制重新挂载页面组件）
   *
   * 总体流程：
   * 1. 读取当前路由的 path、query 和 matched 路由链
   * 2. 若当前已在 /redirect/ 路径，说明正处于重定向过程中，直接跳过避免循环刷新
   * 3. 未指定目标对象时，从 matched 路由链中找到实际业务页面组件（排除 Layout/ParentView 容器）
   * 4. 先清除 tagsView 中对应的缓存视图，触发组件销毁
   * 5. 再通过 router.replace 跳转至 /redirect + 原路径，并保留原始 query 参数
   *    → /redirect 路由会立即重定向回原路径，从而触发组件完整重新挂载，实现刷新效果
   *
   * 参数说明：
   * @param {object} [obj] - 目标页面描述对象（含 name、path、query），省略时自动取当前路由
   * @returns {Promise}
   */
  refreshPage(obj) {
    const { path, query, matched } = router.currentRoute.value
    // 当前已在 /redirect/ 路径，说明重定向尚未完成，跳过刷新，防止进入死循环
    if (path.startsWith('/redirect/')) {
      return Promise.resolve()
    }
    if (obj === undefined) {
      // 遍历 matched 路由链，找到真实业务页面组件（排除 Layout、ParentView 等布局容器）
      matched.forEach((m) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
            // 构造目标页面对象：组件名 + 路径 + 当前 query 参数
            obj = { name: m.components.default.name, path: path, query: query }
          }
        }
      })
    }
    // 先删除缓存视图（触发组件销毁），再跳转到 /redirect 路由（触发重新挂载）
    // query 参数随 replace 一同传入，刷新后页面参数不丢失
    return useTagsViewStore().delCachedView(obj).then(() => {
      const { path, query } = obj
      router.replace({
        path: '/redirect' + path,
        query: query
      })
    })
  },

  // ==================== 二、关闭并打开页面 ====================

  /**
   * 关闭当前标签页，并跳转到指定页面
   *
   * 总体流程：
   * 1. 从 tagsView 中删除当前路由对应的标签页
   * 2. 若传入目标对象，则通过 router.push 跳转到目标路由
   * 3. 若未传入目标对象，仅关闭当前标签页，不做跳转
   *
   * @param {object} [obj] - 目标路由对象（Vue Router 支持的路由描述格式），省略时仅关闭
   * @returns {Promise|undefined}
   */
  closeOpenPage(obj) {
    // 删除当前路由对应的 tagsView 标签页
    useTagsViewStore().delView(router.currentRoute.value)
    if (obj !== undefined) {
      // 跳转到目标页面
      return router.push(obj)
    }
  },

  // ==================== 三、关闭指定页面 ====================

  /**
   * 关闭指定标签页（默认为当前页）
   *
   * 总体流程（关闭当前页时）：
   * 1. 从 tagsView 中删除当前路由对应的标签页
   * 2. 删除后从已访问列表中取最后一个页面作为跳转目标
   * 3. 若已访问列表为空，则回退到首页 /
   *
   * 总体流程（关闭指定页时）：
   * 1. 直接从 tagsView 中删除传入的路由对象对应的标签页
   * 2. 不做路由跳转，由调用方自行决定后续逻辑
   *
   * @param {object} [obj] - 目标路由对象，省略时默认关闭当前路由对应的标签页
   * @returns {Promise}
   */
  closePage(obj) {
    if (obj === undefined) {
      // 未指定目标，关闭当前路由对应的标签页
      return useTagsViewStore().delView(router.currentRoute.value).then(({ visitedViews }) => {
        // 取剩余已访问列表中最后一个页面作为跳转目标
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          return router.push(latestView.fullPath)
        }
        // 已访问列表为空时，回退到系统首页
        return router.push('/')
      })
    }
    // 指定了目标对象，直接删除对应标签页，不做跳转
    return useTagsViewStore().delView(obj)
  },

  // ==================== 四、关闭全部页面 ====================

  /**
   * 关闭所有标签页
   *
   * 总体流程：
   * - 调用 tagsView store 的 delAllViews 方法，清空所有已访问视图和缓存视图
   *
   * @returns {Promise}
   */
  closeAllPage() {
    return useTagsViewStore().delAllViews()
  },

  // ==================== 五、关闭左侧页面 ====================

  /**
   * 关闭当前标签页左侧的所有标签页
   *
   * 总体流程：
   * - 以传入的路由对象（或当前路由）为基准，删除其左侧的所有 tagsView 标签页
   *
   * @param {object} [obj] - 基准路由对象，省略时默认取当前路由
   * @returns {Promise}
   */
  closeLeftPage(obj) {
    return useTagsViewStore().delLeftTags(obj || router.currentRoute.value)
  },

  // ==================== 六、关闭右侧页面 ====================

  /**
   * 关闭当前标签页右侧的所有标签页
   *
   * 总体流程：
   * - 以传入的路由对象（或当前路由）为基准，删除其右侧的所有 tagsView 标签页
   *
   * @param {object} [obj] - 基准路由对象，省略时默认取当前路由
   * @returns {Promise}
   */
  closeRightPage(obj) {
    return useTagsViewStore().delRightTags(obj || router.currentRoute.value)
  },

  // ==================== 七、关闭其他页面 ====================

  /**
   * 关闭除指定标签页之外的其他所有标签页
   *
   * 总体流程：
   * - 以传入的路由对象（或当前路由）为基准，删除其他所有 tagsView 标签页
   *
   * @param {object} [obj] - 需要保留的路由对象，省略时默认保留当前路由
   * @returns {Promise}
   */
  closeOtherPage(obj) {
    return useTagsViewStore().delOthersViews(obj || router.currentRoute.value)
  },

  // ==================== 八、打开新页面 ====================

  /**
   * 打开新标签页并跳转到目标路由
   *
   * 总体流程：
   * 1. 根据 title 和 url 构造一个最小路由描述对象（含 meta.title，供 tagsView 显示标签名）
   * 2. 将该对象添加到 tagsView 的已访问列表，确保标签页立即显示
   * 3. 通过 router.push 跳转到目标路由，params 以 query 形式附加到 URL
   *
   * 参数传递说明：
   * - params 对象会作为路由 query 传入 router.push，例如 { id: 1 } 最终变为 URL 查询字符串 ?id=1
   * - 这是 GET 风格的 URL 参数拼接，不是 POST 请求，不会向后端提交表单
   * - 页面内通过 route.query.id 即可读取对应参数值
   *
   * @param {string} title  - 标签页显示名称，例如 '用户管理'
   * @param {string} url    - 目标页面路径，例如 '/system/user'
   * @param {object} [params] - 路由 query 参数对象，例如 { id: 1 }，省略时不附加参数
   * @returns {Promise}
   *
   * 示例：
   *   this.$tab.openPage('用户管理', '/system/user', { id: 1 })
   *   // 等价于 router.push({ path: '/system/user', query: { id: 1 } })
   *   // 浏览器地址栏变为：/system/user?id=1
   */
  openPage(title, url, params) {
    // 构造最小路由描述对象：仅需 path 和 meta.title，供 tagsView 注册标签使用
    const obj = { path: url, meta: { title: title } }
    // 注册到 tagsView 已访问列表，使标签页立即显示
    useTagsViewStore().addView(obj)
    // 跳转到目标路由，params 作为 query 参数附加到 URL（GET 风格拼接，非 POST）
    return router.push({ path: url, query: params })
  },

  // ==================== 九、更新页面信息 ====================

  /**
   * 更新 tagsView 中已访问页面的信息
   *
   * 总体流程：
   * - 将传入的路由对象同步到 tagsView store 的已访问列表，例如更新标签名称或路由参数
   *
   * @param {object} obj - 需要更新的路由对象（需包含 fullPath 等可供匹配的属性）
   * @returns {Promise}
   */
  updatePage(obj) {
    return useTagsViewStore().updateVisitedView(obj)
  }
}
