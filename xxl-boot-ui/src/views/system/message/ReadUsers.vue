<!--
  组件：ReadUsers（已读用户弹窗）
  功能：分页展示某条消息的已读用户列表
-->
<template>
  <el-dialog v-model="visible" :title="`「${noticeTitle}」已读用户`" width="600px" top="6vh" append-to-body @close="handleClose">
    <el-table v-loading="loading" :data="userList" size="small" stripe height="340px">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column label="用户ID" prop="userId" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="阅读时间" prop="addTime" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
      style="padding: 6px 0px;"
    />
  </el-dialog>
</template>

<script setup name="ReadUsers">
import { listNoticeReadUsers } from "@/api/system/message"
import { parseTime } from '@/utils/common'

const visible = ref(false)   /* 弹窗显隐 */
const loading = ref(false)   /* 加载状态 */
const noticeTitle = ref("")  /* 消息标题 */
const total = ref(0)         /* 已读人数 */
const userList = ref([])     /* 已读用户列表 */

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  messageId: undefined
})

function open(row) {
  queryParams.messageId = row.id
  noticeTitle.value = row.title
  queryParams.pageNum = 1
  visible.value = true
  getList()
}

function getList() {
  loading.value = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams,
    offset: (queryParams.pageNum - 1) * queryParams.pageSize,
    pagesize: queryParams.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  listNoticeReadUsers(params).then(res => {
    userList.value = res.data.data
    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
}

function handleClose() {
  userList.value = []
  total.value = 0
}

defineExpose({
  open
})
</script>
