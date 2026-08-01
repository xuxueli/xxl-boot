<!--
  页面：Message（站内消息管理）
  功能：查询、新增、修改、删除消息，查看消息详情与已读用户
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="标题/内容" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题或内容"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="消息状态" clearable style="width: 200px">
          <el-option label="全部" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasRole="['admin']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasRole="['admin']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasRole="['admin']"
        >删除</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 消息列表 -->
    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="100" />
      <el-table-column label="消息标题" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <a class="link-type" style="cursor:pointer" @click="handleViewData(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.category === 0 ? 'primary' : 'warning'" size="small">
            {{ categoryText(scope.row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发送人" align="center" prop="sender" width="100" />
      <el-table-column label="发送时间" align="center" width="170">
        <template #default="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="User" @click="handleReadUsers(scope.row)" v-hasRole="['admin']" >阅读用户</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" v-model="open" width="780px" append-to-body>
      <el-form ref="messageRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入消息标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in statusOptions"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <notice-detail-view ref="noticeViewRef" />
    <read-users-dialog ref="readUsersRef" />
  </div>
</template>

<script setup name="Message">
import ReadUsersDialog from "./ReadUsers"
import NoticeDetailView from '@/layout/components/Navbar/HeaderNoticeDetail.vue'
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/message"
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'

const resetForm = useFormReset()

const messageRef = ref(null)     /* 表单 ref */
const noticeViewRef = ref(null)  /* 详情抽屉 ref */
const readUsersRef = ref(null)   /* 已读用户弹窗 ref */

const messageList = ref([])      /* 消息列表 */
const open = ref(false)          /* 对话框显隐 */
const loading = ref(true)        /* 加载状态 */
const showSearch = ref(true)     /* 是否显示搜索栏 */
const ids = ref([])              /* 选中行 ID 数组 */
const single = ref(true)         /* 是否单选 */
const multiple = ref(true)       /* 是否多选 */
const total = ref(0)             /* 总条数 */
const title = ref("")            /* 对话框标题 */

// 分类选项（0-通知、1-公告）
const categoryOptions = [
  { label: '通知', value: 0 },
  { label: '公告', value: 1 }
]
// 状态选项（0-正常、1-下线）
const statusOptions = [
  { label: '正常', value: 0 },
  { label: '下线', value: 1 }
]

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    status: -1
  },
  rules: {
    title: [{ required: true, message: "消息标题不能为空", trigger: "blur" }],
    category: [{ required: true, message: "分类不能为空", trigger: "change" }]
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询消息列表 */
function getList() {
  loading.value = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  listNotice(params).then(response => {
    messageList.value = response.data.data
    total.value = response.data.total
    loading.value = false
  })
}

/** 分类编码 → 文案 */
function categoryText(category) {
  const item = categoryOptions.find(i => i.value === category)
  return item ? item.label : category
}

/** 状态编码 → 文案 */
function statusText(status) {
  const item = statusOptions.find(i => i.value === status)
  return item ? item.label : status
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    title: undefined,
    category: 0,
    content: undefined,
    status: 0
  }
  resetForm("messageRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加消息"
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row && row.id != null ? row.id : ids.value[0]
  if (id == null) {
    return
  }
  getNotice(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改消息"
  })
}

/** 提交按钮 */
function submitForm() {
  messageRef.value.validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateNotice(form.value).then(response => {
          modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addNotice(form.value).then(response => {
          modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 查看消息详情 */
function handleViewData(row) {
  noticeViewRef.value.open(row.id)
}

/** 查看已读用户 */
function handleReadUsers(row) {
  readUsersRef.value.open(row)
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row) {
  const messageIds = row && row.id != null ? row.id : ids.value
  if (messageIds == null || (Array.isArray(messageIds) && messageIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除消息编号为"' + messageIds + '"的数据项？').then(function() {
    return delNotice(messageIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>
