<!--
  Config（配置管理）
  功能：配置的分页查询 + 新增/修改/删除
  @author xuxueli 2026-11-21
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item :label="t('system.config.configName')" prop="name">
        <el-input v-model="queryParams.name" :placeholder="t('common.inputPlaceholder', [t('system.config.configName')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('system.config.configKey')" prop="key">
        <el-input v-model="queryParams.key" :placeholder="t('common.inputPlaceholder', [t('system.config.configKey')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('system.config.statusPlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasRole="['admin']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeConfig()" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 配置列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" align="center" prop="id" width="50" />
      <el-table-column :label="t('system.config.configName')" align="center" prop="name" width="180" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.config.configKey')" align="center" prop="key" width="180" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.config.configValue')" align="center" prop="value" :show-overflow-tooltip="true" />
      <el-table-column :label="t('common.status')" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeConfig(scope.row)" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
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

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="500px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-form-item :label="t('system.config.configName')" prop="name">
          <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('system.config.configName')])" />
        </el-form-item>
        <el-form-item :label="t('system.config.configKey')" prop="key">
          <el-input v-model="formState.form.key" :placeholder="t('common.inputPlaceholder', [t('system.config.configKey')])" :disabled="formState.form.id != null" />
        </el-form-item>
        <el-form-item :label="t('system.config.configValue')" prop="value">
          <el-input v-model="formState.form.value" type="textarea" :placeholder="t('common.inputPlaceholder', [t('system.config.configValue')])" />
        </el-form-item>
        <el-form-item :label="t('common.status')">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.remark')" prop="remark">
          <el-input v-model="formState.form.remark" type="textarea" :placeholder="t('common.inputPlaceholder', [t('common.remark')])" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveForm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="closeForm">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Config' })
import { ref } from 'vue'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import { useEnumOption } from '@/composables/useEnumOption'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import { configApi } from '../api'
import type { Config, ConfigForm, ConfigQuery } from '../types'
import type { FormInstance } from 'element-plus'
import type { FormState, TableState } from '@/types'

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */
const formRef = ref<FormInstance>() /* 编辑表单 ref */

// 配置状态选项，由后端枚举接口加载
const { ConfigStatusEnum: statusOptions } = useEnumOption('ConfigStatusEnum')

// 搜索栏筛选条件与分页参数
const queryParams = ref<ConfigQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  name: undefined /* 配置名称 */,
  key: undefined /* 配置 Key */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<Config>>({
  list: [], // 配置列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用，状态默认 0-正常
const FORM_DEFAULTS: Readonly<ConfigForm> = { status: 0 }

// 编辑弹窗状态
const formState = ref<FormState<ConfigForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('system.config.configName')]), trigger: 'blur' }],
    key: [
      { required: true, message: t('common.requiredMsg', [t('system.config.configKey')]), trigger: 'blur' },
      { pattern: /^[a-z][a-z0-9.]*$/, message: t('system.config.keyPattern'), trigger: 'blur' },
      { min: 4, max: 100, message: t('system.config.keyLength'), trigger: 'blur' }
    ],
    value: [{ required: true, message: t('common.requiredMsg', [t('system.config.configValue')]), trigger: 'blur' }]
  }
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询配置分页数据
 */
function getList() {
  table.value.loading = true
  // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
  configApi.pageList(usePageParams(queryParams)())
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
function syncSelection(selection: Config[]) {
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
  formState.value.title = t('common.titleAdd', [t('common.noun.config')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: Config) {
  const id = row?.id ?? table.value.ids[0]
  // 顶部按钮未勾选或行数据缺少 id 时直接返回，避免无效请求
  if (id == null) return
  resetForm()
  configApi.load(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', [t('common.noun.config')])
  })
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? configApi.update(formState.value.form) : configApi.insert(formState.value.form)
    request.then(() => {
      modal.msgSuccess(t(isEdit ? 'common.updateSuccess' : 'common.addSuccess'))
      closeForm()
      getList()
    })
  })
}

/** 关闭弹窗并重置表单 */
function closeForm() {
  formState.value.visible = false
  resetForm()
}

/**
 * 删除配置（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeConfig(row?: Config) {
  const ids = row?.id ?? table.value.ids
  // 无勾选记录时直接返回，避免弹出空删除确认框
  if (ids == null || (Array.isArray(ids) && ids.length === 0)) return
  modal
    .confirm(t('system.config.confirmDeleteConfig', [Array.isArray(ids) ? ids.join(',') : ids]))
    .then(() => configApi.delete(ids))
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// ---------------------- 辅助支撑 ----------------------

/**
 * 状态编码转枚举文案
 *
 * @param status 状态编码
 * @returns 状态文案；未匹配到枚举项时回退显示编码
 */
function statusText(status: number) {
  return statusOptions.value.find((item) => item.code === status)?.title ?? String(status)
}

// ---------------------- 页面初始化 ----------------------

/**
 * 页面加载时查询列表
 */
getList()

</script>
