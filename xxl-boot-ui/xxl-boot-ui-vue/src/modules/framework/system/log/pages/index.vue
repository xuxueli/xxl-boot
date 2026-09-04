<!--
  页面：Log（日志管理）
  功能：查询、删除日志，查看日志详情
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item :label="t('system.log.logType')" prop="type">
        <el-select v-model="queryParams.type" :placeholder="t('system.log.logTypePlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in typeDict.options" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.log.logModule')" prop="module">
        <el-select v-model="queryParams.module" :placeholder="t('system.log.logModulePlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="0" />
          <el-option v-for="item in moduleDict.options" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.log.logTitle')" prop="title">
        <el-input v-model="queryParams.title" :placeholder="t('common.inputPlaceholder', [t('system.log.logTitle')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasRole="['admin']">{{ t('system.log.export') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 日志列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column :label="t('system.log.logId')" align="center" prop="id" width="80" />
      <el-table-column :label="t('system.log.logType')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 0 ? 'primary' : 'warning'" size="small">
            {{ typeText(scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.log.logModule')" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ moduleDict.map[scope.row.module] || scope.row.module }}
        </template>
      </el-table-column>
      <el-table-column :label="t('system.log.logTitle')" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.log.operator')" align="center" prop="operator" width="110" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.log.ipAddress')" align="center" :show-overflow-tooltip="true" width="160">
        <template #default="scope">
          {{ scope.row.ipAddress || scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">{{ t('system.log.detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="table.total > 0"
      :total="table.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 详情弹窗 -->
    <LogDetail v-model:visible="detail.visible" :row="detail.row" :module-map="moduleDict.map" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Log' })
import { t } from '@/i18n'
import LogDetail from './detail.vue'
import { pageList, delOperlog } from '../api'
import { loadEnumItem } from '@/modules/framework/system/dict/api'
import { parseTime } from '@/utils/common'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import { download } from '@/utils/download'
import type { Log, LogQuery } from '../types'
import type { EnumOption, TableState } from '@/types'
import { ref } from 'vue'
import { RightToolbar, Pagination } from '@/components'

const resetForm = useFormReset()

/** 详情弹窗状态 */
interface DetailState {
  visible: boolean
  row: Log
}

/** 枚举数据状态（下拉选项 + 编码 → 名称映射） */
interface DictState {
  options: EnumOption[]
  map: Record<number | string, string | undefined>
}

// --------------------------------- ref data ---------------------------------

// 筛选：表单数据
const queryParams = ref<LogQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  type: -1 /* 日志类型（-1 全部） */,
  module: 0 /* 系统模块编码（0 全部） */,
  title: undefined /* 日志标题 */
})

// 表格：UI数据
const table = ref<TableState<Log>>({
  list: [] /* 表格：列表数据 */,
  total: 0 /* 表格：总条数 */,
  loading: true /* 表格：加载状态 */,
  showSearch: true /* 表格：是否显示搜索栏 */,
  ids: [] /* 表格：选中行 ID 数组 */,
  multiple: true /* 表格：是否多选 */
})

// 详情弹框：UI数据
const detail = ref<DetailState>({
  visible: false /* 详情弹窗：可见状态 */,
  row: {} /* 详情弹窗：当前查看的日志行 */
})

// 枚举数据（下拉选项 + 编码→名称映射）
const typeDict = ref<DictState>({
  options: [] /* 日志类型下拉选项 */,
  map: {} /* 日志类型编码 → 名称映射 */
})
const moduleDict = ref<DictState>({
  options: [] /* 系统模块下拉选项 */,
  map: {} /* 系统模块编码 → 名称映射 */
})

// --------------------------------- fun ---------------------------------

/** 查询日志列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端请求参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  pageList(params).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

/** 日志类型编码 → 文案 */
function typeText(type: number) {
  const item = typeDict.value.options.find((i) => i.code === type)
  return item ? item.title : type
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  queryParams.value.pageNum = 1
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: Log[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.multiple = !selection.length
}

/** 查看日志详情 */
function handleDetail(row: Log) {
  detail.value = { visible: true, row }
}

/** 删除日志（顶部按钮 @click 传事件对象，取勾选 ids） */

/** 导出按钮操作 */
function handleExport() {
  download(
    'system/log/export',
    {
      ...usePageParams(queryParams)()
    },
    `log_${new Date().getTime()}.xlsx`
  )
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const logIds = row?.id ?? table.value.ids
  if (logIds == null || (Array.isArray(logIds) && logIds.length === 0)) {
    return
  }
  modal
    .confirm(t('system.log.confirmDeleteLog', [logIds]))
    .then(function () {
      return delOperlog(logIds)
    })
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// --------------------------------- init page ---------------------------------

// 加载日志类型、系统模块枚举（下拉选项）
loadEnumItem('LogTypeEnum').then((res) => {
  typeDict.value.options = res.data
  typeDict.value.map = {}
  typeDict.value.options.forEach((item) => {
    typeDict.value.map[item.code] = item.title
  })
})
loadEnumItem('LogModuleEnum').then((res) => {
  moduleDict.value.options = res.data
  moduleDict.value.map = {}
  moduleDict.value.options.forEach((item) => {
    moduleDict.value.map[item.code] = item.title
  })
})

// 页面初始化加载日志列表
getList()
</script>
