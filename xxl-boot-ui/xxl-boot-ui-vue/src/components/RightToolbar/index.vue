<!--
  组件：RightToolbar（表格工具栏）
  功能：表格页面右侧工具栏，支持搜索显隐切换（带动画）、刷新、列显隐控制（checkbox/transfer）。

  用法：<RightToolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns" />
-->
<template>
  <div ref="rightToolbarRef" class="top-right-btn" :style="style">
    <el-row>
      <!-- “搜索” 展示/隐藏开关 -->
      <el-tooltip class="item" effect="dark" :content="showSearch ? t('components.rightToolbar.hideSearch') : t('components.rightToolbar.showSearch')" placement="top" v-if="search">
        <el-button circle icon="Search" @click="toggleSearch()" />
      </el-tooltip>

      <!-- “刷新” 按钮 -->
      <el-tooltip class="item" effect="dark" :content="t('common.refresh')" placement="top">
        <el-button circle icon="Refresh" @click="refresh()" />
      </el-tooltip>

      <!-- “显隐列” 按钮 -->
      <el-tooltip class="item" effect="dark" :content="t('components.rightToolbar.showColumns')" placement="top" v-if="Object.keys(columns).length > 0">
        <!-- transfer 模式 -->
        <el-button circle icon="Menu" @click="showColumn()" v-if="showColumnsType === 'transfer'" />
        <!-- checkbox 模式 -->
        <el-dropdown trigger="click" :hide-on-click="false" style="padding-left: 12px" v-if="showColumnsType === 'checkbox'">
          <!-- icon -->
          <el-button circle icon="Menu" />
          <!-- 下拉框 -->
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 全选/反选 按钮 -->
              <el-dropdown-item>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isChecked" @change="toggleCheckAll"> {{ t('components.rightToolbar.columnDisplay') }} </el-checkbox>
              </el-dropdown-item>
              <div class="check-line"></div>
              <!-- 单列控制 -->
              <template v-for="(item, key) in columns" :key="item.key">
                <el-dropdown-item>
                  <el-checkbox v-model="item.visible" @change="checkboxChange($event, key)" :label="item.label" />
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </el-row>

    <!-- transfer 模式：弹框 -->
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer :titles="[t('components.rightToolbar.show'), t('components.rightToolbar.hide')]" v-model="value" :data="transferData" @change="dataChange"></el-transfer>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cache from '@/utils/cache'
import { computed, nextTick, ref } from 'vue'
import { t } from '@/i18n'

// 表格列配置项类型定义
interface ColumnItem {
  // 列标识
  key: string | number
  // 列显示名称
  label: string
  // 列是否可见
  visible: boolean
}

// 表格列配置：数组或对象（key 为列标识）
type ColumnsType = ColumnItem[] | { [key: string]: ColumnItem }

const props = withDefaults(
  defineProps<{
    // "搜索区域" 是否显示（v-model 双向绑定）
    search?: boolean
    // "搜索区域" 默认显示/隐藏状态
    showSearch?: boolean
    // 表格列配置：[{ key, label, visible }] 或 { key: { label, visible } }
    columns?: ColumnsType
    // 列显隐控制类型：checkbox（下拉复选框）/ transfer（穿梭框对话框）
    showColumnsType?: string
    // 右侧外边距
    gutter?: number
    // 列显隐持久化 key：传入则自动读写 localStorage
    storageKey?: string
  }>(),
  {
    // "搜索区域" 默认显示
    search: true,
    // "搜索区域" 默认显示
    showSearch: true,
    // 表格列配置默认空对象
    columns: () => ({}),
    // 默认使用 checkbox 显隐控制
    showColumnsType: 'checkbox',
    // 右侧外边距默认 10
    gutter: 10,
    // 默认不持久化
    storageKey: ''
  }
)

const emits = defineEmits<{
  (e: 'update:showSearch', value: boolean): void
  (e: 'queryTable'): void
}>()

const value = ref<Array<string | number>>([]) // “隐藏列” 的索引列表
const title = ref(t('components.rightToolbar.title')) // transfer模式，弹出层标题
const open = ref(false) // transfer模式，弹出层显隐状态
const rightToolbarRef = ref<any>(null)

// checkbox弹框，left间距计算
const style = computed(() => {
  const ret: Record<string, any> = {}
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`
  }
  return ret
})

// checkbox 判断是否“全选”
const isChecked = computed({
  get: () =>
    Array.isArray(props.columns) ? props.columns.every((col) => col.visible) : Object.values(props.columns).every((col) => col.visible),
  set: () => {}
})

// checkbox 判断是否（部分选中）
const isIndeterminate = computed(() =>
  Array.isArray(props.columns)
    ? props.columns.some((col) => col.visible) && !isChecked.value
    : Object.values(props.columns).some((col) => col.visible) && !isChecked.value
)

// transfer 数据源
const transferData = computed(() => {
  const columns = props.columns
  if (Array.isArray(columns)) {
    return columns.map((item, index) => ({
      key: index,
      label: item.label
    }))
  }
  return Object.keys(columns).map((key, index) => ({ key: index, label: columns[key].label }))
})

/**
 * “搜索区域” 展示/隐藏开关
 *    - 带动画折叠/展开 el-form 搜索区域
 *
 */
function toggleSearch() {
  let el = rightToolbarRef.value
  let formEl = null
  while ((el = el.parentElement) && el !== document.body) {
    if ((formEl = el.querySelector('.el-form'))) break
  }
  if (!formEl) return emits('update:showSearch', !props.showSearch)
  animateSearch(formEl, props.showSearch)
}

/**
 * 搜索区域折叠/展开动画：
 *  - 操作 el-form 的 max-height 过渡
 */
function animateSearch(el: HTMLElement, isHide: boolean) {
  const DURATION = 260
  const TRANSITION = 'max-height 0.25s ease, opacity 0.2s ease'
  const clear = () => Object.assign(el.style, { transition: '', maxHeight: '', opacity: '', overflow: '' })
  Object.assign(el.style, { overflow: 'hidden', transition: '' })
  if (isHide) {
    Object.assign(el.style, { maxHeight: el.scrollHeight + 'px', opacity: '1', transition: TRANSITION })
    requestAnimationFrame(() => Object.assign(el.style, { maxHeight: '0', opacity: '0' }))
    setTimeout(() => {
      emits('update:showSearch', false)
      clear()
    }, DURATION)
  } else {
    emits('update:showSearch', true)
    nextTick(() => {
      Object.assign(el.style, { maxHeight: '0', opacity: '0' })
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          Object.assign(el.style, { transition: TRANSITION, maxHeight: el.scrollHeight + 'px', opacity: '1' })
        })
      )
      setTimeout(clear, DURATION)
    })
  }
}

/**
 * 刷新表格数据
 *  - 触发父组件 queryTable 方法
 */
function refresh() {
  emits('queryTable')
}

/**
 * transfer 穿梭框变化：更新列显隐
 *    - data：待 隐藏 列信息
 */
function dataChange(data: Array<string | number>) {
  const columns = props.columns
  if (Array.isArray(columns)) {
    //
    for (let item in columns) {
      const key = columns[item].key
      columns[item].visible = !data.includes(key)
    }
  } else {
    Object.keys(columns).forEach((key, index) => {
      columns[key].visible = !data.includes(index)
    })
  }
  saveStorage()
}

/**
 * 打开显隐列对话框（transfer 模式）
 */
function showColumn() {
  open.value = true
}

// 从 localStorage 恢复列显隐状态
if (props.storageKey) {
  try {
    const saved: any = cache.local.getJSON(props.storageKey)
    const columns = props.columns
    if (saved && typeof saved === 'object') {
      if (Array.isArray(columns)) {
        columns.forEach((col, index) => {
          if (saved[index] !== undefined) col.visible = saved[index]
        })
      } else {
        Object.keys(columns).forEach((key) => {
          if (saved[key] !== undefined) columns[key].visible = saved[key]
        })
      }
    }
  } catch (e) {}
}
if (props.showColumnsType === 'transfer') {
  // transfer穿梭显隐列初始默认隐藏列
  const columns = props.columns
  if (Array.isArray(columns)) {
    for (let item in columns) {
      if (columns[item].visible === false) {
        value.value.push(parseInt(item))
      }
    }
  } else {
    Object.keys(columns).forEach((key, index) => {
      if (columns[key].visible === false) {
        value.value.push(index)
      }
    })
  }
}

// 单列显隐切换（checkbox 模式）
function checkboxChange(event: any, key: any) {
  const columns = props.columns
  if (Array.isArray(columns)) {
    columns.filter((item) => item.key === key)[0].visible = event
  } else {
    columns[key].visible = event
  }
  saveStorage()
}

/**
 * 全选/反选切换
 */
function toggleCheckAll() {
  const newValue = !isChecked.value
  if (Array.isArray(props.columns)) {
    props.columns.forEach((col) => (col.visible = newValue))
  } else {
    Object.values(props.columns).forEach((col) => (col.visible = newValue))
  }
  saveStorage()
}

/**
 * 持久化列显隐状态到 localStorage
 */
function saveStorage() {
  if (!props.storageKey) return
  try {
    let state: Record<string | number, any> = {}
    const columns = props.columns
    if (Array.isArray(columns)) {
      columns.forEach((col, index) => {
        state[index] = col.visible
      })
    } else {
      Object.keys(columns).forEach((key) => {
        state[key] = columns[key].visible
      })
    }
    cache.local.setJSON(props.storageKey, state)
  } catch (e) {}
}
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}

:deep(.el-dropdown-menu__item) {
  line-height: 30px;
  padding: 0 17px;
}

.check-line {
  width: 90%;
  height: 1px;
  background-color: #ccc;
  margin: 3px auto;
}
</style>
