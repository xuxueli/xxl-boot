<!--
  Message（站内消息管理）
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item :label="t('system.message.category')" prop="category">
        <el-select v-model="queryParams.category" :placeholder="t('system.message.categoryPlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in categoryOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('system.message.statusPlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.message.title')" prop="title">
        <el-input v-model="queryParams.title" :placeholder="t('common.inputPlaceholder', [t('system.message.title')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasRole="['admin']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 消息列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" align="center" prop="id" width="100" />
      <el-table-column :label="t('system.message.messageTitle')" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <a class="link-type" style="cursor: pointer" @click="handleViewData(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.message.category')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.category === 0 ? 'primary' : 'warning'" size="small">
            {{ categoryText(scope.row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.message.sender')" align="center" prop="sender" width="100" />
      <el-table-column :label="t('system.message.sendTime')" align="center" width="170">
        <template #default="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="User" @click="handleReadUsers(scope.row)" v-hasRole="['admin']">{{ t('system.message.readUsers') }}</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
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

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="780px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('system.message.title')" prop="title">
              <el-input v-model="formState.form.title" :placeholder="t('common.inputPlaceholder', [t('system.message.title')])" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('system.message.category')" prop="category">
              <el-select v-model="formState.form.category" :placeholder="t('common.selectPlaceholder')">
                <el-option v-for="item in categoryOptions" :key="item.code" :label="item.title" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="t('common.status')">
              <el-radio-group v-model="formState.form.status">
                <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="t('system.message.content')">
              <Editor v-model="formState.form.content" :min-height="210" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="cancel">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <MessageDetailView ref="messageViewRef" />
    <ReadUsersDialog ref="readUsersRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Message' })
import { t } from '@/i18n'
import ReadUsersDialog from './ReadUsers.vue'
import MessageDetailView from '@/layout/components/Navbar/HeaderMessageDetail.vue'
import { listMessage, getMessage, delMessage, addMessage, updateMessage } from '../api'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import type { Message, MessageQuery } from '../types'
import type { EnumOption, TableState, FormState } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { RightToolbar, Pagination, Editor } from '@/components'

const resetForm = useFormReset()

// --------------------------------- ref data ---------------------------------

// 组件实例引用：模板 ref
const formRef = ref<FormInstance>() /* 编辑表单 ref */
const messageViewRef = ref<InstanceType<typeof MessageDetailView> | null>(null) /* 消息详情弹框 ref： */
const readUsersRef = ref<InstanceType<typeof ReadUsersDialog> | null>(null) /* 已读弹框 ref */

// 筛选项数据：消息分类 + 消息状态
const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } = useEnumOption('MessageCategoryEnum', 'MessageStatusEnum')

// 搜索栏：查询参数
const queryParams = ref<MessageQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  category: -1 /* 分类（-1 全部、0 通知、1 公告） */,
  status: -1 /* 状态（-1 全部、0 正常、1 下线） */,
  title: undefined /* 标题关键词 */
})

// 表格：UI数据
const table = ref<TableState<Message>>({
  list: [], // 消息列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 选中行 ID 数组
  single: true, // 是否单选
  multiple: true // 是否多选
})

// 编辑表单：数据状态
const formState = ref<FormState<Message>>({
  visible: false /* 对话框显隐 */,
  title: '' /* 对话框标题 */,
  form: {} /* 表单数据 */,
  rules: {
    /* 校验规则 */
    title: [{ required: true, message: t('common.requiredMsg', [t('system.message.title')]), trigger: 'blur' }],
    category: [{ required: true, message: t('common.requiredMsg', [t('system.message.category')]), trigger: 'change' }]
  }
})

// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载分类、状态选项 */

/** 查询消息列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端请求参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  listMessage(params).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

/** 分类编码 → 文案 */
function categoryText(category: number) {
  const item = categoryOptions.value.find((i) => i.code === category)
  return item ? item.title : category
}

/** 状态编码 → 文案 */
function statusText(status: number) {
  const item = statusOptions.value.find((i) => i.code === status)
  return item ? item.title : status
}

/** 取消按钮 */
function cancel() {
  formState.value.visible = false
  reset()
}

/** 表单重置 */
function reset() {
  formState.value.form = {
    id: undefined,
    title: undefined,
    category: 0,
    content: undefined,
    status: 0
  }
  resetForm('formRef')
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: Message[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('layout.nav.messageTitle')])
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  getMessage(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', [t('layout.nav.messageTitle')])
  })
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id !== undefined) {
        updateMessage(formState.value.form).then((response) => {
          modal.msgSuccess(t('common.updateSuccess'))
          formState.value.visible = false
          getList()
        })
      } else {
        addMessage(formState.value.form).then((response) => {
          modal.msgSuccess(t('common.addSuccess'))
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 查看消息详情 */
function handleViewData(row: Message) {
  messageViewRef.value?.open(row.id as number)
}

/** 查看已读用户 */
function handleReadUsers(row: Message) {
  readUsersRef.value?.open(row)
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const messageIds = row?.id ?? table.value.ids
  if (messageIds == null || (Array.isArray(messageIds) && messageIds.length === 0)) {
    return
  }
  modal
    .confirm(t('system.message.confirmDeleteMessage', [messageIds]))
    .then(function () {
      return delMessage(messageIds)
    })
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// --------------------------------- page init ---------------------------------

// 页面初始化：加载分类/状态选项 + 消息列表
getList()
</script>
