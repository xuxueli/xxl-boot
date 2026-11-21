<!--
  ReadUsers（已读用户弹窗）
  功能：分页展示某条消息的已读用户列表
  @author xuxueli 2026-11-21
-->
<template>
  <el-dialog
    v-model="dialog.visible"
    :title="t('system.message.readUsersTitle', [dialog.title || ''])"
    width="680px"
    top="6vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="resetTable"
  >
    <!-- 已读用户列表 -->
    <el-table v-loading="table.loading" :data="table.list" size="small" stripe height="340px">
      <el-table-column :label="t('common.serialNo')" prop="id" width="80" align="center" />
      <el-table-column :label="t('system.message.userName')" prop="userName" align="center" :show-overflow-tooltip="true" />
      <el-table-column :label="t('common.realName')" prop="realName" align="center" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.message.readTime')" prop="addTime" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
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
      style="padding: 6px 0px"
    />
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'ReadUsers' })
import { ref } from 'vue'
import { t } from '@/i18n'
import { Pagination } from '@/components'
import { parseTime } from '@/utils/common'
import { messageApi } from '../api'
import type { Message, MessageRead } from '../types'

/** 弹窗状态 */
interface DialogState {
  /** 弹窗显隐 */
  visible: boolean
  /** 消息标题 */
  title?: string
}

/** 已读用户表格状态（弹窗内列表，无需勾选与搜索栏） */
interface ReadUserTableState {
  /** 已读用户列表 */
  list: MessageRead[]
  /** 已读人数 */
  total: number
  /** 加载状态 */
  loading: boolean
}

/** 查询参数（前端分页形态） */
interface ReadUserQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 消息主键 */
  messageId?: number
}

// ---------------------- 响应式数据 ----------------------

// 弹窗状态
const dialog = ref<DialogState>({
  visible: false,
  title: ''
})

// 已读用户表格数据
const table = ref<ReadUserTableState>({
  list: [],
  total: 0,
  loading: false
})

// 查询参数
const queryParams = ref<ReadUserQuery>({
  pageNum: 1,
  pageSize: 10,
  messageId: undefined
})

// ---------------------- 数据检索 ----------------------

/** 查询已读用户列表 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  messageApi.readUsers(queryParams.value)
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

// ---------------------- 页面交互 ----------------------

/**
 * 打开弹窗：回显消息标题并从第一页加载已读用户
 *
 * 由父组件通过 ref 调用，保持既有 open(row) 契约不变。
 *
 * @param row 消息行数据
 */
function open(row: Message) {
  queryParams.value.messageId = row.id
  dialog.value.title = row.title
  queryParams.value.pageNum = 1
  dialog.value.visible = true
  getList()
}

/** 关闭弹窗后清空列表与计数，避免下次打开闪现旧数据 */
function resetTable() {
  table.value.list = []
  table.value.total = 0
  table.value.loading = false
}

// ---------------------- 对外暴露 ----------------------

// 向父组件暴露打开弹窗方法
defineExpose({
  // 打开弹窗
  open
})
</script>
