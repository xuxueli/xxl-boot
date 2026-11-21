<!--
  Log（日志管理）
  功能：日志的分页查询、导出与删除，并查看日志详情
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('system.log.logType')" prop="type">
        <el-select v-model="queryParams.type" :placeholder="t('system.log.logTypePlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in typeOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.log.logModule')" prop="module">
        <el-select v-model="queryParams.module" :placeholder="t('system.log.logModulePlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="0" />
          <el-option v-for="item in moduleOptions" :key="item.code" :label="item.title" :value="item.code" />
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
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeLog()" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasRole="['admin']">{{ t('system.log.export') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column :label="t('system.log.logId')" align="center" prop="id" width="80" />
      <el-table-column :label="t('system.log.logType')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 0 ? 'primary' : 'warning'" size="small">
            {{ enumTitle(typeOptions, scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.log.logModule')" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ moduleMap[scope.row.module ?? ''] ?? scope.row.module }}
        </template>
      </el-table-column>
      <el-table-column :label="t('system.log.logTitle')" align="center" prop="title" show-overflow-tooltip />
      <el-table-column :label="t('system.log.operator')" align="center" prop="operator" width="110" show-overflow-tooltip />
      <el-table-column :label="t('system.log.ipAddress')" align="center" width="160" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.ipAddress || scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="180" />
      <el-table-column :label="t('common.operation')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="openDetail(scope.row)">{{ t('system.log.detail') }}</el-button>
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

    <!-- 日志详情弹窗 -->
    <LogDetail v-model:visible="detail.visible" :row="detail.row" :module-map="moduleMap" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Log' })
import { computed, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import LogDetail from './detail.vue'
import { useEnumOption, enumTitle } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import { download } from '@/utils/download'
import { logApi } from '../api'
import type { Log, LogQuery } from '../types'
import type { TableState } from '@/types'

/** 详情弹窗状态 */
interface DetailState {
  /** 弹窗显隐 */
  visible: boolean
  /** 当前查看的日志行 */
  row: Log
}

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 */

// 日志类型、系统模块选项，由后端枚举接口加载
const { LogTypeEnum: typeOptions, LogModuleEnum: moduleOptions } = useEnumOption('LogTypeEnum', 'LogModuleEnum')

// 系统模块编码 → 名称映射，供列表与详情展示
const moduleMap = computed(() => {
  const map: Record<number | string, string | undefined> = {}
  moduleOptions.value.forEach((item) => {
    map[item.code] = item.title
  })
  return map
})

// 搜索栏筛选条件与分页参数
const queryParams = ref<LogQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  type: -1 /* 日志类型筛选，-1 表示全部 */,
  module: 0 /* 系统模块筛选，0 表示全部 */,
  title: undefined /* 日志标题 */
})

// 列表数据与勾选状态，勾选结果决定删除按钮是否可用
const table = ref<TableState<Log>>({
  list: [], // 日志列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  multiple: true // 删除按钮是否禁用
})

// 详情弹窗
const detail = ref<DetailState>({
  visible: false, // 弹窗显隐
  row: {} // 当前查看的日志行
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询日志分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  logApi.pageList(queryParams.value)
    .then((response) => {
      table.value.list = response.data.data
      table.value.total = response.data.total
    })
    .catch(() => {
      // 错误已由请求层提示，继续走到 finally 复位 loading
    })
    .finally(() => {
      table.value.loading = false
    })
}

/** 搜索：回到第一页后查询 */
function handleQuery() {
  // 筛选条件已变化，回到第一页可避免停留在超出结果范围的页码
  queryParams.value.pageNum = 1
  getList()
}

/** 重置搜索条件后重新查询 */
function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

// ---------------------- 数据操作（增删改） ----------------------

/**
 * 同步表格勾选结果，驱动批量删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: Log[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.multiple = !selection.length
}

/**
 * 删除日志（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeLog(row?: Log) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('system.log.confirmDeleteLog', [row.title ?? String(row.id)])
    : t('system.log.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => logApi.delete(ids))
    .then(() => {
      // 删除当前页最后一条时回退一页，避免停留在空页
      if (table.value.list.length === ids.length && queryParams.value.pageNum > 1) {
        queryParams.value.pageNum -= 1
      }
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

/**
 * 打开日志详情弹窗
 *
 * @param row 日志行
 */
function openDetail(row: Log) {
  detail.value = { visible: true, row }
}

/** 导出日志（条件与当前查询一致，分页字段不参与导出） */
function handleExport() {
  const { pageNum: _pageNum, pageSize: _pageSize, ...search } = queryParams.value
  download('system/log/export', search, `log_${new Date().getTime()}.xlsx`)
}

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询日志列表
getList()
</script>
