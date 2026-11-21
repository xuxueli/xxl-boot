<!--
  Message（站内消息管理）
  功能：消息的分页查询 + 新增/修改/删除 + 查看详情与已读用户
  @author xuxueli 2026-11-21
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
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
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasPermi="['system:message']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasPermi="['system:message']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeMessage()" v-hasPermi="['system:message']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" prop="id" align="center" width="80" />
      <el-table-column :label="t('system.message.messageTitle')" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <a class="link-type" style="cursor: pointer" @click="openDetail(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.message.category')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.category === 0 ? 'primary' : 'warning'" size="small">
            {{ enumTitle(categoryOptions, scope.row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.message.sender')" align="center" prop="sender" width="100" />
      <el-table-column :label="t('system.message.sendTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="User" @click="openReadUsers(scope.row)" v-hasPermi="['system:message']">{{ t('system.message.readUsers') }}</el-button>
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasPermi="['system:message']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeMessage(scope.row)" v-hasPermi="['system:message']">{{ t('common.delete') }}</el-button>
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

    <!-- 新增或修改对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="780px" append-to-body :close-on-click-modal="false" @closed="resetForm">
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
            <el-form-item :label="t('system.message.content')" prop="content">
              <Editor v-model="formState.form.content" :min-height="210" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveForm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="closeForm">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 消息详情抽屉、已读用户弹窗 -->
    <MessageDetailView ref="messageViewRef" />
    <ReadUsersDialog ref="readUsersRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Message' })
import { ref } from 'vue'
import { t } from '@/i18n'
import { Editor, Pagination, RightToolbar } from '@/components'
import { enumTitle, useEnumOption } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import { messageApi } from '../api'
import MessageDetailView from '@/layout/components/Navbar/HeaderMessageDetail.vue'
import ReadUsersDialog from './ReadUsers.vue'
import type { FormInstance } from 'element-plus'
import type { Message, MessageForm, MessageQuery } from '../types'
import type { FormState, TableState } from '@/types'

// ---------------------- 响应式数据 ----------------------

// 表单实例引用：搜索栏与编辑表单 ref
const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */

// 子组件实例引用：消息详情抽屉与已读用户弹窗
const messageViewRef = ref<InstanceType<typeof MessageDetailView>>() /* 消息详情抽屉 */
const readUsersRef = ref<InstanceType<typeof ReadUsersDialog>>() /* 已读用户弹窗 */

// 筛选项数据：消息分类 + 消息状态，由后端枚举接口加载
const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } = useEnumOption('MessageCategoryEnum', 'MessageStatusEnum')

// 搜索栏筛选条件与分页参数
const queryParams = ref<MessageQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  category: -1 /* 分类筛选，-1 表示全部 */,
  status: -1 /* 状态筛选，-1 表示全部 */,
  title: undefined /* 标题/内容关键词 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<Message>>({
  list: [], // 数据列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<MessageForm> = { category: 0, status: 0 }

// 编辑弹窗状态
const formState = ref<FormState<MessageForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    title: [{ required: true, message: t('common.requiredMsg', [t('system.message.title')]), trigger: 'blur' }],
    category: [{ required: true, message: t('common.requiredMsg', [t('system.message.category')]), trigger: 'change' }],
    content: [{ required: true, message: t('common.requiredMsg', [t('system.message.content')]), trigger: 'blur' }]
  }
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询消息分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  messageApi.pageList(queryParams.value)
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
 * 同步表格勾选结果，驱动批量修改/删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: Message[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 重置编辑表单：重置表单数据为默认值 + 清除表单校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  formRef.value?.clearValidate()
}

/** 打开新增弹窗 */
function openCreateForm() {
  resetForm()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('common.noun.message')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: Message) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  messageApi.load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      // 表单只保留可编辑字段，避免把时间字段回传到后端
      const { addTime, updateTime, ...form } = response.data
      formState.value.form = form
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('common.noun.message')])
    })
    .catch(() => {})
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? messageApi.update(formState.value.form) : messageApi.insert(formState.value.form)
    request
      .then(() => {
        modal.msgSuccess(t(isEdit ? 'common.updateSuccess' : 'common.addSuccess'))
        closeForm()
        getList()
      })
      .catch(() => {})
  })
}

/** 关闭弹窗：重置统一交给 @closed，保证 X / ESC / 按钮三条路径一致 */
function closeForm() {
  formState.value.visible = false
}

/**
 * 删除消息（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeMessage(row?: Message) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('system.message.confirmDeleteMessage', [row.title ?? String(row.id)])
    : t('system.message.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => messageApi.delete(ids))
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
 * 查看消息详情
 *
 * @param row 行数据
 */
function openDetail(row: Message) {
  if (row.id == null) return
  messageViewRef.value?.open(row.id)
}

/**
 * 查看消息已读用户
 *
 * @param row 行数据
 */
function openReadUsers(row: Message) {
  readUsersRef.value?.open(row)
}

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询消息列表
getList()
</script>
