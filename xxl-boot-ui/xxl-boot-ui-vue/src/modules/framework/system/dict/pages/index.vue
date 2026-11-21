<!--
  Dict（字典管理）
  功能：字典类型的分页查询 + 新增/修改/删除，并查看字典项与字典数据
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('system.dict.dictName')" prop="name">
        <el-input v-model="queryParams.name" :placeholder="t('common.inputPlaceholder', [t('system.dict.dictName')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('system.dict.dictType')" prop="type">
        <el-input v-model="queryParams.type" :placeholder="t('common.inputPlaceholder', [t('system.dict.dictType')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('system.dict.statusPlaceholder')" clearable style="width: 200px">
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
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasPermi="['system:dict']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasPermi="['system:dict']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeDict()" v-hasPermi="['system:dict']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" prop="id" align="center" width="80" />
      <el-table-column :label="t('system.dict.dictName')" align="center" prop="name" width="180" show-overflow-tooltip />
      <el-table-column :label="t('system.dict.dictType')" align="center" show-overflow-tooltip>
        <template #default="scope">
          <!-- 点击字典标识查看该字典下的全部字典项 -->
          <a class="link-type" style="cursor: pointer" @click="openItemDrawer(scope.row)">{{ scope.row.type }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.remark')" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasPermi="['system:dict']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Operation" @click="openDataList(scope.row)" v-hasPermi="['system:dict']">{{ t('system.dict.dataList') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeDict(scope.row)" v-hasPermi="['system:dict']">{{ t('common.delete') }}</el-button>
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
        <el-form-item :label="t('system.dict.dictName')" prop="name">
          <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('system.dict.dictName')])" clearable />
        </el-form-item>
        <el-form-item :label="t('system.dict.dictType')" prop="type">
          <el-input v-model="formState.form.type" :placeholder="t('common.inputPlaceholder', [t('system.dict.dictType')])" clearable :disabled="formState.form.id != null" />
        </el-form-item>
        <el-form-item :label="t('common.status')">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
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

    <!-- 字典项抽屉 -->
    <DictDataDrawer v-model:visible="drawer.visible" :row="drawer.row" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dict' })
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import DictDataDrawer from './DictDataDrawer.vue'
import { useEnumOption, enumTitle } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import { dictApi } from '../api'
import type { Dict, DictForm, DictQuery } from '../types'
import type { FormState, TableState } from '@/types'

/** 字典项抽屉状态 */
interface DrawerState {
  /** 抽屉显隐 */
  visible: boolean
  /** 当前查看的字典行 */
  row: Dict
}

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */

// 状态选项，由后端枚举接口加载
const { DictStatusEnum: statusOptions } = useEnumOption('DictStatusEnum')

// 搜索栏筛选条件与分页参数
const queryParams = ref<DictQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  name: undefined /* 字典名称 */,
  type: undefined /* 字典标识 */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<Dict>>({
  list: [], // 字典类型列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<DictForm> = { status: 0 }

// 编辑弹窗状态
const formState = ref<FormState<DictForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('system.dict.dictName')]), trigger: 'blur' }],
    type: [
      { required: true, message: t('common.requiredMsg', [t('system.dict.dictType')]), trigger: 'blur' },
      { pattern: /^[a-z][a-zA-Z0-9]*$/, message: t('system.dict.typePattern'), trigger: 'blur' },
      { min: 2, max: 100, message: t('system.dict.typeLength'), trigger: 'blur' }
    ]
  }
})

// 字典项抽屉
const drawer = ref<DrawerState>({
  visible: false, // 抽屉显隐
  row: {} // 当前查看的字典行
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询字典类型分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  dictApi.pageList(queryParams.value)
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
function syncSelection(selection: Dict[]) {
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
  formState.value.title = t('common.titleAdd', [t('common.noun.dict')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: Dict) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  dictApi.load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      // 表单只保留可编辑字段，避免把时间字段回传到后端
      const { addTime, updateTime, ...form } = response.data
      formState.value.form = form
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('common.noun.dict')])
    })
    .catch(() => {})
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? dictApi.update(formState.value.form) : dictApi.insert(formState.value.form)
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
 * 删除字典类型（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeDict(row?: Dict) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('system.dict.confirmDeleteDict', [row.name ?? String(row.id)])
    : t('system.dict.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => dictApi.delete(ids))
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
 * 打开字典项抽屉
 *
 * @param row 字典行
 */
function openItemDrawer(row: Dict) {
  drawer.value = { visible: true, row }
}

/**
 * 打开字典数据子页
 *
 * @param row 字典行
 */
function openDataList(row: Dict) {
  // 缺少主键时无法定位字典，直接返回
  if (row.id == null) return
  tab.openPage(t('system.dict.dictDataTitle'), '/system/dict/data', { dictId: String(row.id) }).catch(() => {})
}

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询字典类型列表
getList()
</script>
