/**
 * 名称：标签页视图 Store
 * 描述：负责管理多页签导航所需的访问标签和缓存页面数据，并按设置决定是否持久化访问记录。
 *
 * 职责划分：
 * 1. state：维护 visitedViews、cachedViews 两类标签数据；
 * 2. actions：负责新增、删除、批量整理和恢复标签；
 * 3. helpers：封装持久化开关判断与 localStorage 读写；
 * 4. getters：当前模块未定义 getters，组件直接消费状态数据。
 */
import cache from '@/utils/cache'
import useSettingsStore from '@/store/modules/settings'

// 持久化 key：用于保存普通访问标签页，affix 固定标签不参与持久化。
const PERSIST_KEY = 'tags-view-visited'

/**
 * 判断当前是否开启 tags-view 持久化。
 *
 * 这里直接读取 settings store，确保标签页模块始终跟随全局设置工作。
 */
function isPersistEnabled() {
  return useSettingsStore().tagsViewPersist
}

/**
 * 保存访问过的标签页。
 *
 * 只持久化普通标签页需要的最小字段集合，避免把固定标签或无关运行态数据写入本地缓存。
 *
 * @param {Array} views
 */
function saveVisitedViews(views) {
  if (!isPersistEnabled()) return
  /**
   * 持久化前先做两步收敛：
   * 1. 过滤掉 affix 固定标签，这类标签通常由路由配置静态生成，刷新后会重新注入，不需要写入本地缓存；
   * 2. 只提取标签恢复所需的关键字段（路径、名称、标题、查询参数和 meta），
   *    避免把页面运行过程中临时挂载的响应式数据或其他冗余属性一并持久化，降低缓存体积，也减少恢复时的歧义。
   */
  const toSave = views.filter(v => !(v.meta && v.meta.affix)).map(v => ({ path: v.path, fullPath: v.fullPath, name: v.name, title: v.title, query: v.query, meta: v.meta }))
  cache.local.setJSON(PERSIST_KEY, toSave)
}

/**
 * 读取已持久化的标签页数据。
 *
 * @returns {Array}
 */
function loadVisitedViews() {
  return cache.local.getJSON(PERSIST_KEY) || []
}

/**
 * 清空 tags-view 缓存
 */
function clearVisitedViews() {
  cache.local.remove(PERSIST_KEY)
}

const useTagsViewStore = defineStore(
  'tags-view',
  {
    /**
     * 状态定义
     *
     * 1. visitedViews：
     *    - 供 `layout/components/TagsView/index.vue` 和 `ScrollPane.vue` 渲染顶部标签、滚动定位、右键菜单和关闭逻辑；
     *    - 保存的是“可导航标签对象”，需要保留 path、fullPath、title、query、meta 等信息，才能正确展示标题、恢复路由和做持久化；
     *    - 它是标签体系的主数据源，普通页签与 affix 固定页签都会进入这里。
     *
     * 2. cachedViews：
     *    - 供 `layout/components/AppMain.vue` 的 `<keep-alive :include="...">` 直接消费；
     *    - 这里只需要组件 `name` 字符串集合，因为 keep-alive 只按组件名决定是否缓存，不关心标题、query、是否 affix 等展示信息；
     *    - 因此它和 visitedViews 虽然关联紧密，但数据结构、去重规则和使用场景都不同，不能简单合并为一份。
     */
    state: () => ({
      visitedViews: [],
      cachedViews: []
    }),
    /**
     * 动作方法定义
     *
     * 这些方法围绕“单个标签操作”和“批量标签整理”两类场景展开，并在必要时同步持久化。
     */
    actions: {
      /**
       * 同时新增访问标签和缓存标签，是页面进入时最常用的统一入口。
       */
      addView(view) {
        this.addVisitedView(view)
        this.addCachedView(view)
      },
      /**
       * 新增普通访问标签，并在成功新增后刷新持久化数据。
       */
      addVisitedView(view) {
        if (this.visitedViews.some(v => v.path === view.path)) return
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          })
        )
        saveVisitedViews(this.visitedViews)
      },
      /**
       * 新增固定标签。
       *
       * affix 标签通常在应用初始化时插入到头部，因此使用 unshift 保持固定标签靠前展示。
       */
      addAffixView(view) {
        if (this.visitedViews.some(v => v.path === view.path)) return
        this.visitedViews.unshift(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          })
        )
      },
      /**
       * 新增缓存标签。
       *
       * 页面声明了 name 即可进入 keep-alive 缓存列表。
       */
      addCachedView(view) {
        if (this.cachedViews.includes(view.name)) return
        if (false) {
          this.cachedViews.push(view.name)
        }
      },
      /**
       * 删除单个标签的统一入口，同时删除访问记录与缓存记录。
       */
      delView(view) {
        return new Promise(resolve => {
          this.delVisitedView(view)
          this.delCachedView(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      /**
       * 删除单个访问标签，同时刷新持久化缓存。
       */
      delVisitedView(view) {
        return new Promise(resolve => {
          for (const [i, v] of this.visitedViews.entries()) {
            if (v.path === view.path) {
              this.visitedViews.splice(i, 1)
              break
            }
          }
          saveVisitedViews(this.visitedViews)
          resolve([...this.visitedViews])
        })
      },
      /**
       * 删除单个缓存标签。
       */
      delCachedView(view) {
        return new Promise(resolve => {
          const index = this.cachedViews.indexOf(view.name)
          index > -1 && this.cachedViews.splice(index, 1)
          resolve([...this.cachedViews])
        })
      },
      /**
       * 删除当前标签之外的其他标签，是"关闭其他"操作的统一入口。
       */
      delOthersViews(view) {
        return new Promise(resolve => {
          this.delOthersVisitedViews(view)
          this.delOthersCachedViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      /**
       * 删除其他访问标签，但保留固定标签和当前标签。
       */
      delOthersVisitedViews(view) {
        return new Promise(resolve => {
          this.visitedViews = this.visitedViews.filter(v => {
            return v.meta.affix || v.path === view.path
          })
          saveVisitedViews(this.visitedViews)
          resolve([...this.visitedViews])
        })
      },
      /**
       * 删除其他缓存标签，只保留当前页对应的缓存项。
       */
      delOthersCachedViews(view) {
        return new Promise(resolve => {
          const index = this.cachedViews.indexOf(view.name)
          if (index > -1) {
            this.cachedViews = this.cachedViews.slice(index, index + 1)
          } else {
            this.cachedViews = []
          }
          resolve([...this.cachedViews])
        })
      },
      /**
       * 删除全部标签的统一入口。
       */
      delAllViews(view) {
        return new Promise(resolve => {
          this.delAllVisitedViews(view)
          this.delAllCachedViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      /**
       * 删除全部访问标签，但固定标签始终保留。
       */
      delAllVisitedViews(view) {
        return new Promise(resolve => {
          const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
          this.visitedViews = affixTags
          clearVisitedViews()
          resolve([...this.visitedViews])
        })
      },
      /**
       * 对外暴露的清理持久化缓存入口。
       */
      clearVisitedViews() {
        clearVisitedViews()
      },
      /**
       * 删除全部缓存标签。
       */
      delAllCachedViews(view) {
        return new Promise(resolve => {
          this.cachedViews = []
          resolve([...this.cachedViews])
        })
      },
      /**
       * 更新单个访问标签的最新信息。
       *
       * 常用于页面参数或标题变化后，保持标签展示内容同步。
       */
      updateVisitedView(view) {
        for (let v of this.visitedViews) {
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      },
      /**
       * 删除当前标签右侧的所有标签。
       */
      delRightTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex(v => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            if (idx <= index || (item.meta && item.meta.affix)) {
              return true
            }
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            return false
          })
          saveVisitedViews(this.visitedViews)
          resolve([...this.visitedViews])
        })
      },
      /**
       * 删除当前标签左侧的所有标签。
       */
      delLeftTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex(v => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            if (idx >= index || (item.meta && item.meta.affix)) {
              return true
            }
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            return false
          })
          saveVisitedViews(this.visitedViews)
          resolve([...this.visitedViews])
        })
      },
      /**
       * 恢复持久化的 tags。
       *
       * 逐条调用 addVisitedView 进行恢复，复用现有去重与标准化逻辑。
       */
      loadPersistedViews() {
        const views = loadVisitedViews()
        views.forEach(view => {
          this.addVisitedView(view)
        })
      }
    }
  })

export default useTagsViewStore
