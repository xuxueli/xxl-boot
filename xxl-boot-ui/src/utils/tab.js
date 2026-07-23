/**
 * tab - 多标签页管理
 *
 * 封装 tagsView store + router 的编排逻辑，提供打开、关闭、刷新、批量关闭等操作。
 *
 * 用法（Options API）：
 *   this.$tab.openPage('用户管理', '/system/user', { id: 1 })
 *   this.$tab.refreshPage()
 *   this.$tab.closePage()
 *   this.$tab.closeLeftPage()
 *
 * 用法（Composition API）：
 *   import { useTab } from '@/utils/tab'
 *   tab.openPage('用户管理', '/system/user', { id: 1 })
 */
import {useTagsViewStore} from '@/store'
import router from '@/router'

export default {

    /**
     * 刷新当前标签页（强制重新挂载组件）
     *
     * 实现原理：
     *   1. 先从 tagsView 中删除该页面的缓存视图（delCachedView），触发 keep-alive 销毁组件。
     *   2. 再通过 router.replace 跳转到 /redirect + 原路径，携带原始 query。
     *   3. /redirect 路由会立即重定向回原路径，组件完整重新挂载，实现刷新。
     *
     * 注意：
     *   - 已在 /redirect/ 路径时跳过，防止循环刷新。
     *   - 未传 obj 时自动从当前路由的 matched 链查找真实业务组件（排除 Layout/ParentView）。
     *
     * 示例：
     *   tab.refreshPage()
     *   tab.refreshPage({ name: 'User', path: '/system/user', query: { id: 1 } })
     *
     * @param {object} [obj] - { name, path, query }，省略时自动取当前路由
     * @returns {Promise}
     */
    refreshPage(obj) {
        const {path, query, matched} = router.currentRoute.value
        // 已在 /redirect/ 路径，说明重定向尚未完成，跳过
        if (path.startsWith('/redirect/')) {
            return Promise.resolve()
        }
        if (obj === undefined) {
            // 从 matched 路由链找到真实业务组件（排除 Layout、ParentView 容器）
            matched.forEach((m) => {
                if (m.components && m.components.default && m.components.default.name) {
                    if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
                        obj = {name: m.components.default.name, path: path, query: query}
                    }
                }
            })
        }
        // 先删缓存视图（组件销毁），再跳 /redirect（组件重新挂载）
        return useTagsViewStore().delCachedView(obj).then(() => {
            const {path, query} = obj
            router.replace({
                path: '/redirect' + path,
                query: query
            })
        })
    },

    /**
     * 关闭当前标签页，并跳转到指定页面
     *
     * 示例：
     *   tab.closeOpenPage('/system/user')       // 关闭当前页，跳到用户管理
     *   tab.closeOpenPage()                      // 仅关闭当前页，不跳转
     *
     * @param {object} [obj] - 目标路由对象，省略时仅关闭不做跳转
     * @returns {Promise|undefined}
     */
    closeOpenPage(obj) {
        useTagsViewStore().delView(router.currentRoute.value)
        if (obj !== undefined) {
            return router.push(obj)
        }
    },

    /**
     * 关闭指定标签页（默认为当前页）
     *
     * 关闭当前页时：
     *   1. 从 tagsView 删除当前路由。
     *   2. 取剩余列表中最后一个标签作为跳转目标。
     *   3. 列表为空时回退到首页 /。
     *
     * 关闭指定页时：仅删除标签，不做跳转，由调用方决定后续。
     *
     * 示例：
     *   tab.closePage()                  // 关闭当前页，自动跳到上一个标签
     *   tab.closePage({ path: '/system/user' })  // 关闭指定页
     *
     * @param {object} [obj] - 目标路由对象，省略时关闭当前页
     * @returns {Promise}
     */
    closePage(obj) {
        if (obj === undefined) {
            // 关闭当前页：删除后跳转到上一个访问页
            return useTagsViewStore().delView(router.currentRoute.value).then(({visitedViews}) => {
                const latestView = visitedViews.slice(-1)[0]
                if (latestView) {
                    return router.push(latestView.fullPath)
                }
                return router.push('/')
            })
        }
        // 关闭指定页：仅删除，不做跳转
        return useTagsViewStore().delView(obj)
    },

    /**
     * 关闭所有标签页
     *
     * 示例：tab.closeAllPage()
     */
    closeAllPage() {
        return useTagsViewStore().delAllViews()
    },

    /**
     * 关闭左侧标签
     *
     * @param {object} [obj] - 基准路由，省略时取当前路由
     *
     * 示例：tab.closeLeftPage()
     */
    closeLeftPage(obj) {
        return useTagsViewStore().delLeftTags(obj || router.currentRoute.value)
    },

    /**
     * 关闭右侧标签
     *
     * @param {object} [obj] - 基准路由，省略时取当前路由
     *
     * 示例：tab.closeRightPage()
     */
    closeRightPage(obj) {
        return useTagsViewStore().delRightTags(obj || router.currentRoute.value)
    },

    /**
     * 关闭其他：关闭除指定标签外的其他所有标签
     *
     * @param {object} [obj] - 需要保留的路由，省略时保留当前路由
     *
     * 示例：tab.closeOtherPage()
     */
    closeOtherPage(obj) {
        return useTagsViewStore().delOthersViews(obj || router.currentRoute.value)
    },

    /**
     * 打开新标签页，并跳转
     *
     * 流程：
     *   1. 构造 { path, meta: { title } } 注册到 tagsView。
     *   2. router.push 跳转，params 作为 query 参数附加到 URL。
     *
     * 示例：
     *   tab.openPage('用户管理', '/system/user', { id: 1 })
     *   // URL → /system/user?id=1
     *
     * @param {string} title    - 标签标题
     * @param {string} url      - 路由路径
     * @param {object} [params] - query 参数，如 { id: 1 } → ?id=1
     * @returns {Promise}
     */
    openPage(title, url, params) {
        const obj = {path: url, meta: {title: title}}
        useTagsViewStore().addView(obj)
        return router.push({path: url, query: params})
    },

    /**
     * 更新页面信息：更新 tagsView 中已访问页面的信息
     *
     * @param {object} obj - 路由对象（需含 path 等匹配字段）
     *
     * 示例：tab.updatePage({ path: '/system/user', meta: { title: '新标题' } })
     */
    updatePage(obj) {
        return useTagsViewStore().updateVisitedView(obj)
    }

}
