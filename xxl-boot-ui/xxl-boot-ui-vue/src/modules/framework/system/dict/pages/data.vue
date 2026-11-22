<!--
  DictData（字典项管理）
  功能：指定字典下字典项的分页查询 + 新增/修改/删除
  @author xuxueli 2026-11-22
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
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasPermi="['system:dict']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasPermi="['system:dict']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeDictItem()" v-hasPermi="['system:dict']">{{ t('common.delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose">{{ t('common.close') }}</el-button>
      </el-col>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.id')" prop="id" align="center" width="80" />
      <el-table-column :label="t('system.dict.itemName')" align="center" prop="name" width="180" show-overflow-tooltip />
      <el-table-column :label="t('system.dict.itemCode')" align="center" prop="code" show-overflow-tooltip />
      <el-table-column :label="t('common.status')" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('system.dict.order')" align="center" prop="order" width="80" />
      <el-table-column :label="t('common.remark')" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasPermi="['system:dict']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeDictItem(scope.row)" v-hasPermi="['system:dict']">{{ t('common.delete') }}</el-button>
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
    <el-dialog :title="formState.title" v-model="formState.visible" width="500px" append-to-body :close-on-click-modal="false" @closed="resetForm">
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-form-item :label="t('system.dict.itemName')" prop="name">
          <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('system.dict.itemName')])" clearable />
        </el-form-item>
        <el-form-item :label="t('system.dict.itemCode')" prop="code">
          <el-input v-model="formState.form.code" :placeholder="t('common.inputPlaceholder', [t('system.dict.itemCode')])" clearable :disabled="formState.form.id != null" />
        </el-form-item>
        <el-form-item :label="t('common.status')">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('system.dict.order')" prop="order">
          <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item :label="t('common.remark')">
          <el-input v-model="formState.form.remark" type="textarea" :placeholder="t('common.inputPlaceholder', [t('common.remark')])" clearable />
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
defineOptions({ name: 'DictData' })
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { Pagination } from '@/components'
import { useEnumOption, enumTitle } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import { dictApi } from '../api'
import type { DictItem, DictItemForm, DictItemQuery } from '../types'
import type { FormState, TableState } from '@/types'

// ---------------------- 响应式数据 ----------------------

const route = useRoute()

// 当前字典主键（由列表页跳转时通过路由参数传入）
const dictId = ref<number | undefined>(Number(route.query.dictId) || undefined)

// 当前字典名称，用于页面标题
const dictName = ref<string>('')

const formRef = ref<FormInstance>() /* 编辑表单 */

// 状态选项，由后端枚举接口加载
const { DictStatusEnum: statusOptions } = useEnumOption('DictStatusEnum')

// 搜索栏筛选条件与分页参数
const queryParams = ref<DictItemQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  dictId: dictId.value /* 所属字典主键 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<DictItem>>({
  list: [], // 字典项列表
  total: 0, // 总条数
  loading: true, // 加载状态
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<DictItemForm> = { dictId: dictId.value, status: 0, order: 0 }

// 编辑弹窗状态
const formState = ref<FormState<DictItemForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('system.dict.itemName')]), trigger: 'blur' }],
    code: [
      { required: true, message: t('common.requiredMsg', [t('system.dict.itemCode')]), trigger: 'blur' },
      { pattern: /^[0-9]+$/, message: t('system.dict.itemCodePattern'), trigger: 'blur' },
      {
        validator: (_rule, value, callback) => {
          const code = Number(value)
          // 允许留空，非空时要求落在 1-10000000 区间
          if (value == null || value === '' || (code >= 1 && code <= 10000000)) {
            callback()
          } else {
            callback(new Error(t('system.dict.itemCodeRange')))
          }
        },
        trigger: 'blur'
      }
    ],
    order: [{ required: true, message: t('common.requiredMsg', [t('system.dict.order')]), trigger: 'blur' }]
  }
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询字典项分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页与 dictId 参数由 API 内部统一处理
  dictApi.itemPageList(queryParams.value)
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

// ---------------------- 数据操作（增删改） ----------------------

/**
 * 同步表格勾选结果，驱动批量修改/删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: DictItem[]) {
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
  formState.value.title = t('common.titleAdd', [t('common.noun.dictItem')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: DictItem) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  dictApi.itemLoad(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      // 表单只保留可编辑字段，避免把时间字段回传到后端
      const { addTime, updateTime, ...form } = response.data
      formState.value.form = form
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('common.noun.dictItem')])
    })
    .catch(() => {})
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? dictApi.itemUpdate(formState.value.form) : dictApi.itemInsert(formState.value.form)
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
 * 删除字典项（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeDictItem(row?: DictItem) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('system.dict.confirmDeleteItem', [row.name ?? String(row.id)])
    : t('system.dict.confirmBatchDeleteItem', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => dictApi.itemDelete(ids))
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

/** 关闭当前子页并返回字典类型列表 */
function handleClose() {
  tab.closeOpenPage({ path: '/system/dict' })
}

/**
 * 查询当前字典名称，用于页面标题展示
 */
function getDictName() {
  // 无字典主键时无需查询
  if (dictId.value == null) return
  dictApi.load(dictId.value)
    .then((response) => {
      dictName.value = response.data ? response.data.name ?? '' : ''
    })
    .catch(() => {})
}

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询字典名称
getDictName()
// 页面加载时查询字典项列表
getList()
</script>
