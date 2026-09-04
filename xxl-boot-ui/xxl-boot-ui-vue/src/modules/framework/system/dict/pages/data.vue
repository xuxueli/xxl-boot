<!--
  页面：DictData（字典项管理）
  功能：查询、新增、修改、删除指定字典下的字典项
-->
<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="dict-data-header">
      <span>{{ t('system.dict.itemDictNameLabel') }}{{ dictName }}</span>
    </div>

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
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose">{{ t('common.close') }}</el-button>
      </el-col>
    </el-row>

    <!-- 字典项列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" align="center" prop="id" width="80" />
      <el-table-column :label="t('system.dict.itemName')" align="center" prop="name" width="180" :show-overflow-tooltip="true" />
      <el-table-column :label="t('system.dict.itemCode')" align="center" prop="code" :show-overflow-tooltip="true" />
      <el-table-column :label="t('common.status')" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.dict.order')" align="center" prop="order" width="80" />
      <el-table-column :label="t('common.remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
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

    <!-- 添加或修改字典项对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="500px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-form-item :label="t('system.dict.itemName')" prop="name">
          <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('system.dict.itemName')])" />
        </el-form-item>
        <el-form-item :label="t('system.dict.itemCode')" prop="code">
          <el-input v-model="formState.form.code" :placeholder="t('common.inputPlaceholder', [t('system.dict.itemCode')])" :disabled="formState.form.id != undefined" />
        </el-form-item>
        <el-form-item :label="t('common.status')">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('system.dict.order')" prop="order">
          <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item :label="t('common.remark')" prop="remark">
          <el-input v-model="formState.form.remark" type="textarea" :placeholder="t('common.inputPlaceholder', [t('common.remark')])"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="cancel">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Data' })
import { t } from '@/i18n'
import { getType } from '../api'
import { listData, getData, delData, addData, updateData } from '../api'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { DictItem, DataQuery, DataListQuery } from '../types'
import type { EnumOption, TableState, FormState } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Pagination } from '@/components'

const resetForm = useFormReset()

/* --------------------------------- ref data --------------------------------- */

// 路由参数
const route = useRoute()
const dictId = ref<number | undefined>(Number(route.query.dictId) || undefined) /* 当前字典ID（来自路由） */

// 表单引用
const formRef = ref<FormInstance>() /* 编辑表单实例引用 */

// 页面标题：字典名称
const dictName = ref<string | undefined>('') /* 字典名称 */

// 搜索栏：查询参数
const queryParams = ref<DataQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  dictId: dictId.value /* 字典ID */
})

// 编辑弹窗：表单状态（表单数据 + 校验规则 + 弹窗显隐/标题）
const formState = ref<FormState<DictItem>>({
  visible: false /* 对话框显隐 */,
  title: '' /* 对话框标题 */,
  form: {} /* 表单数据 */,
  rules: {
    /* 校验规则 */
    name: [{ required: true, message: t('common.requiredMsg', [t('system.dict.itemName')]), trigger: 'blur' }],
    code: [
      { required: true, message: t('common.requiredMsg', [t('system.dict.itemCode')]), trigger: 'blur' },
      { pattern: /^[0-9]+$/, message: t('system.dict.itemCodePattern'), trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const n = Number(value)
          if (value == null || value === '' || (n >= 1 && n <= 10000000)) {
            callback()
          } else {
            callback(new Error(t('system.dict.itemCodeRange')))
          }
        },
        trigger: 'blur'
      }
    ],
    order: [{ required: true, message: t('common.requiredMsg', [t('authz.org.order')]), trigger: 'blur' }]
  }
})

// 表格：UI数据
const table = ref<TableState<DictItem>>({
  list: [] /* 字典项列表 */,
  total: 0 /* 总条数 */,
  loading: true /* 加载状态 */,
  ids: [] /* 选中行 ID 数组 */,
  single: true /* 是否单选 */,
  multiple: true /* 是否多选 */
})

// 状态选项（从后端枚举接口加载，枚举项属性为 code、title）
const { DictStatusEnum: statusOptions } = useEnumOption('DictStatusEnum')

/* --------------------------------- fun --------------------------------- */

/** 从后端枚举接口加载状态选项 */

/** 查询当前字典名称 */
function getDictName() {
  if (dictId.value == null) {
    return
  }
  getType(dictId.value).then((response) => {
    dictName.value = response.data ? response.data.name : ''
  })
}

/** 查询字典项列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  // 字典ID为空（无路由来源进入）时不携带该参数，避免后端可选 long 参数收到空值
  if (dictId.value != null) {
    params.dictId = dictId.value
  }
  listData(params).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
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
    dictId: dictId.value,
    name: undefined,
    code: undefined,
    status: 0,
    order: 0,
    remark: undefined
  }
  resetForm('formRef')
}

/** 返回按钮操作 */
function handleClose() {
  const obj = { path: '/system/dict' }
  tab.closeOpenPage(obj)
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('common.noun.dictItem')])
}

/** 多选框选中数据 */
function handleSelectionChange(selection: DictItem[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  getData(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', [t('common.noun.dictItem')])
  })
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id != undefined) {
        updateData(formState.value.form).then((response) => {
          modal.msgSuccess(t('common.updateSuccess'))
          formState.value.visible = false
          getList()
        })
      } else {
        addData(formState.value.form).then((response) => {
          modal.msgSuccess(t('common.addSuccess'))
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const itemIds = row?.id ?? table.value.ids
  if (itemIds == null || (Array.isArray(itemIds) && itemIds.length === 0)) {
    return
  }
  modal
    .confirm(t('system.dict.confirmDeleteItem', [itemIds]))
    .then(function () {
      return delData(itemIds)
    })
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

/* --------------------------------- page init --------------------------------- */
// 页面初始化：加载字典名称、状态选项 + 字典项列表
getDictName()
getList()
</script>
