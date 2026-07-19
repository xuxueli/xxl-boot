<!--
  组件：HeaderSearch（菜单搜索）
  功能：顶部导航栏搜索图标，点击弹出搜索弹窗，支持按菜单标题/路径模糊搜索并跳转
-->
<template>
  <div class="header-search">
    <!-- 图标：搜索触发 -->
    <SvgIcon class-name="search-icon" icon-class="search" @click.stop="click"/>
    <!-- 搜索弹窗 -->
    <el-dialog
        v-model="show"
        width="600"
        @close="close"
        @opened="onDialogOpened"
        :show-close="false"
        append-to-body
    >
      <!-- 搜索输入框：支持 ↑↓ 选择、Enter 确认、Esc 关闭 -->
      <el-input
          v-model="search"
          ref="headerSearchSelectRef"
          size="large"
          @input="querySearch"
          :prefix-icon="Search"
          placeholder="菜单搜索，支持标题、URL模糊查询"
          clearable
          @keyup.enter="selectActiveResult"
          @keydown.up.prevent="navigateResult('up')"
          @keydown.down.prevent="navigateResult('down')"
      >
      </el-input>

      <!-- 搜索结果：计数 -->
      <div class="result-count" v-if="search && options.length > 0">
        找到 <strong>{{ options.length }}</strong> 个结果
      </div>

      <!-- 搜索结果：结果列表 / 空状态 -->
      <div class="result-wrap">
        <el-scrollbar>
          <!-- 有结果：循环渲染 -->
          <template v-if="options.length > 0">
            <div
                class="search-item"
                tabindex="1"
                v-for="(item, index) in options"
                :key="item.path"
                :class="{ 'is-active': index === activeIndex }"
                :style="activeStyle(index)"
                @mouseenter="activeIndex = index"
                @mouseleave="activeIndex = -1"
            >
              <!-- icon -->
              <div class="left">
                <SvgIcon class="menu-icon" :icon-class="item.icon"/>
              </div>
              <!-- menu -->
              <div class="search-info" @click="change(item)">
                <div class="menu-title" v-html="highlightText(item.title.join(' / '))"></div>
                <div class="menu-path" v-html="highlightText(item.path)"></div>
              </div>
              <!-- enter icon -->
              <SvgIcon icon-class="enter" v-show="index === activeIndex"/>
            </div>
          </template>

          <!-- 无结果 -->
          <div class="empty-state" v-else-if="search && options.length === 0">
            <el-icon class="empty-icon">
              <Search/>
            </el-icon>
            <p class="empty-text">未找到 "<strong>{{ search }}</strong>" 相关菜单</p>
            <p class="empty-tip">试试其他关键词或路径</p>
          </div>
        </el-scrollbar>
      </div>

      <!-- 快捷键说明 -->
      <div class="search-footer">
        <span class="shortcut-item">
          <kbd>↑</kbd><kbd>↓</kbd> 切换
        </span>
        <span class="shortcut-item">
          <kbd>↵</kbd> 选择
        </span>
        <span class="shortcut-item">
          <kbd>Esc</kbd> 关闭
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import Fuse from 'fuse.js'
import {getNormalPath} from '@/utils/common'
import {isHttp} from '@/utils/validate'
import {useSettingsStore, useRoutesStore} from '@/store'

const settingsStore = useSettingsStore()
const routesStore = useRoutesStore()

const search = ref('')                    /* 搜索关键词 */
const options = ref([])                   /* 当前搜索结果列表 */
const searchPool = ref([])                /* 所有可搜索菜单的完整索引 */
const activeIndex = ref(-1)               /* 键盘选中项索引 */
const show = ref(false)                   /* 弹窗显隐 */
const fuse = ref(undefined)               /* Fuse 模糊搜索实例 */
const headerSearchSelectRef = ref(null)   /* 输入框 DOM 引用 */
const router = useRouter()
const theme = computed(() => settingsStore.theme)
const routes = computed(() => routesStore.fullRoutes)

/*
* 切换搜索弹窗显隐
*/
function click() {
  show.value = !show.value
  if (show.value) {
    options.value = searchPool.value
  }
}

/*
* 弹窗打开后自动聚焦输入框
*/
function onDialogOpened() {
  // DOM 更新完成执行（nextTick）
  nextTick(() => {
    headerSearchSelectRef.value && headerSearchSelectRef.value.focus()
  })
}

/*
* 关闭弹窗：重置搜索状态
*/
function close() {
  headerSearchSelectRef.value && headerSearchSelectRef.value.blur()
  search.value = ''
  options.value = searchPool.value
  show.value = false
  activeIndex.value = -1
}

/*
* 选中搜索结果：外部链接新窗口打开，内部路由 router.push 跳转
*/
function change(val) {
  const p = val.path
  /*const query = val.query*/
  if (isHttp(p)) {
    /* 外部链接分支：http(s):// 路径新窗口打开 */
    window.open(p, "_blank")
    /*const pindex = p.indexOf("http")
    window.open(p.substr(pindex, p.length), "_blank")*/
  } else {
    /* 内部路由分支：router.push 跳转，携带 query 参数 */
    router.push(p)
    /*if (query) {
      router.push({path: p, query: JSON.parse(query)})
    } else {
      router.push(p)
    }*/
  }
  search.value = ''
  options.value = searchPool.value
  nextTick(() => {
    show.value = false
  })
}

/*
* 初始化 Fuse 模糊搜索实例
*/
function initFuse(list) {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.2,
    distance: 100,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'path',
      weight: 0.3
    }]
  })
}

/*
* 递归遍历路由树，生成可搜索列表
*   - 每项含 path / title（路径层级串联）/ icon / query
*   - 叶节点（无 children 或 children 为空）才加入结果，非叶节点作为前缀聚合
*/
function generateRoutes(routes, basePath = '', prefixTitle = []) {
  let res = []
  for (const r of routes) {
    /* 跳过隐藏路由 */
    if (r.hidden) {
      continue
    }

    /* 节点初始化 */
    const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path
    const data = {
      path: !isHttp(r.path) ? getNormalPath(p) : r.path,
      title: [...prefixTitle],
      icon: ''
    }

    /* 有 meta.title 时追加到标题链中 */
    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]
      data.icon = r.meta.icon

      /* 叶节点：加入搜索结果 */
      if (!r.children || r.children.length === 0) {
        res.push(data)
      }
    }

    /* 携带 query 参数 */
    if (r.query) {
      data.query = r.query
    }

    /* 递归子路由 */
    if (r.children) {
      const tempRoutes = generateRoutes(r.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

/*
* 输入关键词实时搜索：路径匹配 + Fuse 模糊匹配，合并去重
*   - pathMatches：以关键词为前缀的路径匹配（精确度高）
*   - fuseMatches：Fuse 模糊匹配（召回率高）
*   - 合并规则：以 pathMatches 为基，fuseMatches 补充未命中项
*/
function querySearch(query) {
  activeIndex.value = -1
  if (query !== '') {
    const q = query.toLowerCase()

    /* 路径前缀匹配 */
    const pathMatches = searchPool.value.filter(item =>
        item.path.toLowerCase().includes(q)
    )

    /* Fuse 模糊匹配 */
    const fuseMatches = fuse.value.search(query).map(item => item.item)

    /* 合并去重 */
    const merged = [...pathMatches]
    fuseMatches.forEach(item => {
      if (!merged.find(m => m.path === item.path)) {
        merged.push(item)
      }
    })
    options.value = merged
  } else {
    options.value = searchPool.value
  }
}

/*
* 当前激活项高亮样式
*/
function activeStyle(index) {
  if (index !== activeIndex.value) return {}
  return {
    "background-color": theme.value,
    "color": "#fff"
  }
}

/*
* 键盘上下键切换选中项
*/
function navigateResult(direction) {
  if (direction === "up") {
    activeIndex.value = activeIndex.value <= 0 ? options.value.length - 1 : activeIndex.value - 1
  } else if (direction === "down") {
    activeIndex.value = activeIndex.value >= options.value.length - 1 ? 0 : activeIndex.value + 1
  }
}

/*
* 回车确认选中项
*/
function selectActiveResult() {
  if (options.value.length > 0 && activeIndex.value >= 0) {
    change(options.value[activeIndex.value])
  }
}

/*
* 高亮搜索结果中的匹配关键词
*/
function highlightText(text) {
  if (!text) return ''
  if (!search.value) return text
  const keyword = escapeRegExp(search.value)
  const reg = new RegExp(`(${keyword})`, 'gi')
  return text.replace(reg, '<span class="highlight">$1</span>')
}

/*
* 转义正则特殊字符
*/
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

onMounted(() => {
  searchPool.value = generateRoutes(routes.value)
})

watch(searchPool, (list) => {
  initFuse(list)
})
</script>

<style lang='scss' scoped>
:deep(.el-dialog__header) {
  padding: 6px !important;
}

:deep(.highlight) {
  color: red;
  font-weight: 600;
}

:deep(.is-active .highlight) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.header-search {
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
}

.result-count {
  padding: 6px 16px 0;
  font-size: 12px;
  color: #aaa;

  strong {
    color: red;
    font-weight: 600;
  }
}

.result-wrap {
  height: 280px;
  margin: 4px 0;

  .search-item {
    display: flex;
    height: 48px;
    align-items: center;
    padding-right: 10px;
    border-radius: 4px;
    transition: background 0.15s;

    .left {
      width: 60px;
      text-align: center;
      flex-shrink: 0;

      .menu-icon {
        width: 18px;
        height: 18px;
      }
    }

    .search-info {
      padding-left: 5px;
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex: 1;
      overflow: hidden;

      .menu-title,
      .menu-path {
        height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .menu-path {
        color: #ccc;
        font-size: 10px;
      }
    }
  }

  .search-item:hover {
    cursor: pointer;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .empty-icon {
      font-size: 42px;
      color: #e0e0e0;
      margin-bottom: 14px;
    }

    .empty-text {
      font-size: 14px;
      color: #999;
      margin: 0 0 6px;

      strong {
        color: #666;
      }
    }

    .empty-tip {
      font-size: 12px;
      color: #bbb;
      margin: 0;
    }
  }
}

.search-footer {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 10px 20px;
  border-top: 1px solid #f0f0f0;
  color: #999;
  font-size: 12px;

  .shortcut-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f7f7f7;
    color: #555;
    font-size: 11px;
    font-family: inherit;
    line-height: 1;
    box-shadow: 0 1px 0 #ccc;
  }
}
</style>
