<!--
  组件：ReadUsers（已读用户弹窗）
  功能：分页展示某条消息的已读用户列表
-->
<template>
  <!-- 弹框组件 -->
  <el-dialog v-model="dialog.visible" :title="`「${dialog.title}」已读用户`" width="680px" top="6vh" append-to-body @close="handleClose">
    <!-- 已读用户 table -->
    <el-table v-loading="table.loading" :data="table.list" size="small" stripe height="340px">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column label="登录名称" prop="userName" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="用户名称" prop="realName" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="阅读时间" prop="addTime" align="center" width="180">
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
      style="padding: 6px 0px;"
    />
  </el-dialog>
</template>

<script setup name="ReadUsers">
import { listMessageReadUsers } from "@/api/system/message"
import { parseTime } from '@/utils/common'

// 弹窗：UI数据
const dialog = ref({
  visible: false,  /* 弹窗显隐 */
  title: ""        /* 消息标题 */
})

// 表格：UI数据
const table = ref({
  list: [],        /* 已读用户列表 */
  total: 0,        /* 已读人数 */
  loading: false   /* 加载状态 */
})

// 查询参数
const queryParams = ref({
  pageNum: 1,       /* 当前页码 */
  pageSize: 10,     /* 每页条数 */
  messageId: undefined  /* 消息ID */
})

/** 打开弹窗：回显消息信息并加载已读用户列表 */
function open(row) {
  queryParams.value.messageId = row.id
  dialog.value.title = row.title
  queryParams.value.pageNum = 1
  dialog.value.visible = true
  getList()
}

/** 查询已读用户列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  listMessageReadUsers(params).then(res => {
    table.value.list = res.data.data
    table.value.total = res.data.total
  }).finally(() => {
    table.value.loading = false
  })
}

/** 关闭弹窗：清空列表与计数 */
function handleClose() {
  table.value.list = []
  table.value.total = 0
}

/**
 * “父传子”通信工具：
 */
defineExpose({
  // 打开弹框
  open
})
</script>
