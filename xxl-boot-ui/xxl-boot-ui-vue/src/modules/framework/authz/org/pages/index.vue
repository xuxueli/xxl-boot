<!--
  Org（组织管理）
  功能：组织树查询 + 新增/修改/删除 + 页内排序与展开折叠
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('authz.org.name')" prop="name">
        <el-input
          v-model="queryParams.name"
          :placeholder="t('common.inputPlaceholder', [t('authz.org.name')])"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('authz.org.statusPlaceholder')" clearable style="width: 200px">
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
        <el-button type="primary" plain icon="Plus" @click="openCreateForm()" v-hasPermi="['authz:org']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Check" @click="saveSort" v-hasPermi="['authz:org']">{{ t('common.saveSort') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">{{ t('common.expandCollapse') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表：名称与负责人列用 min-width 参与剩余宽度分配，窗口变化时随容器自适应 -->
    <el-table
      v-if="table.refreshTable"
      v-loading="table.loading"
      :data="table.list"
      row-key="id"
      :default-expand-all="table.isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- 树表首列保持名称，保证层级缩进与展开箭头落在名称列 -->
      <el-table-column prop="name" :label="t('authz.org.name')" min-width="260" show-overflow-tooltip />
      <el-table-column :label="t('authz.org.order')" width="130" align="center">
        <template #default="scope">
          <el-input-number v-model="scope.row.order" controls-position="right" :min="0" style="width: 88px" />
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="manager" :label="t('authz.org.manager')" min-width="120" align="center" />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="left" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasPermi="['authz:org']">{{
            t('common.modify')
          }}</el-button>
          <el-button link type="primary" icon="Plus" @click="openCreateForm(scope.row)" v-hasPermi="['authz:org']">{{
            t('common.add')
          }}</el-button>
          <el-button
            v-if="scope.row.parentId !== 0"
            link
            type="primary"
            icon="Delete"
            @click="removeOrg(scope.row)"
            v-hasPermi="['authz:org']"
            >{{ t('common.delete') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增或修改对话框 -->
    <el-dialog
      :title="formState.title"
      v-model="formState.visible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="80px">
        <el-row>
          <!-- 顶级组织没有上级，隐藏上级选择 -->
          <el-col :span="24" v-if="formState.form.parentId !== 0">
            <el-form-item :label="t('authz.org.parent')" prop="parentId">
              <el-tree-select
                v-model="formState.form.parentId"
                :data="orgOptions"
                :props="{ label: 'name', children: 'children' }"
                value-key="id"
                :placeholder="t('authz.org.parentPlaceholder')"
                check-strictly
                :default-expanded-keys="expandedKeys"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.org.name')" prop="name">
              <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('authz.org.name')])" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.org.order')" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.org.manager')" prop="manager">
              <el-input
                v-model="formState.form.manager"
                :placeholder="t('common.inputPlaceholder', [t('authz.org.manager')])"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('common.status')">
              <el-radio-group v-model="formState.form.status">
                <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Org' })
import { nextTick, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { RightToolbar } from '@/components'
import { enumTitle, useEnumOption } from '@/composables/useEnumOption'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import { orgApi } from '../api'
import type { Org, OrgForm, OrgQuery } from '../types'
import type { FormState, TableState } from '@/types'

/** 组织树表格状态：在通用表格状态上补充展开与重建开关 */
interface OrgTableState extends TableState<Org> {
  /** 是否默认展开全部节点 */
  isExpandAll: boolean
  /** 表格刷新开关：展开/折叠切换时先销毁再重建，使 default-expand-all 生效 */
  refreshTable: boolean
}

// ---------------------- 响应式数据 ----------------------

// 表单实例引用：搜索栏与编辑表单 ref
const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */

// 状态选项，由后端枚举接口加载
const { OrgStatuEnum: statusOptions } = useEnumOption('OrgStatuEnum')

// 搜索栏筛选参数（树形接口不分页）
const queryParams = ref<OrgQuery>({
  name: undefined /* 组织名称，模糊匹配 */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 组织树数据与展示状态
const table = ref<OrgTableState>({
  list: [], // 组织树列表
  total: 0, // 树形接口不分页，占位以复用通用表格状态
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 树形列表无勾选，占位以复用通用表格状态
  isExpandAll: true, // 是否展开全部
  refreshTable: true // 表格刷新开关
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<OrgForm> = {
  parentId: 0,
  order: 0,
  status: 0
}

// 编辑弹窗状态
const formState = ref<FormState<OrgForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('authz.org.name')]), trigger: 'blur' }],
    order: [{ required: true, message: t('common.requiredMsg', [t('authz.org.order')]), trigger: 'blur' }]
  }
})

// 上级组织树选项
const orgOptions = ref<Org[]>([])
// 上级组织树默认展开节点
const expandedKeys = ref<number[]>([])
// 排序原始值快照：保存排序时用于比对变更项
const originalOrders = ref<Record<number, number | undefined>>({})

// ---------------------- 数据检索 ----------------------

/**
 * 查询组织树列表
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  orgApi
    .treeList(queryParams.value)
    .then((response) => {
      // 后端返回扁平数组，前端按 id/parentId 组装为树
      table.value.list = handleTree(response.data, 'id')
      recordOriginalOrders(table.value.list)
    })
    .catch(() => {
      // 错误已由请求层提示，继续走到 finally 复位 loading
    })
    .finally(() => {
      table.value.loading = false
    })
}

/** 搜索：树形接口不分页，直接按当前条件查询 */
function handleQuery() {
  getList()
}

/** 重置搜索条件后重新查询 */
function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

/**
 * 查询上级组织树选项
 *
 * 保留完整树，保存时再校验不能选择自己或其子孙组织。
 */
function loadOrgOptions() {
  orgApi
    .treeList({})
    .then((response) => {
      orgOptions.value = handleTree(response.data, 'id')
      // 默认展开全部节点，便于快速定位上级
      expandedKeys.value = collectNodeIds(orgOptions.value)
    })
    .catch(() => {})
}

/**
 * 递归收集树节点主键，用于默认展开
 *
 * @param nodes 树节点
 * @returns 全部节点主键
 */
function collectNodeIds(nodes: Org[]): number[] {
  let ids: number[] = []
  nodes.forEach((node) => {
    if (node.id != null) {
      ids.push(node.id)
    }
    if (node.children?.length) {
      ids = ids.concat(collectNodeIds(node.children))
    }
  })
  return ids
}

// ---------------------- 数据操作（增删改） ----------------------

/** 重置编辑表单：重置表单数据为默认值 + 清除表单校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  formRef.value?.clearValidate()
}

/**
 * 打开新增弹窗
 *
 * @param row 上级组织；行内新增时传入，顶部新增时为空（创建顶级组织）
 */
function openCreateForm(row?: Org) {
  resetForm()
  loadOrgOptions()
  // 行内新增以上级为当前行，顶部新增保持默认 parentId=0
  if (row?.id != null) {
    formState.value.form.parentId = row.id
  }
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('common.noun.org')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；优先使用行数据主键
 */
function openEditForm(row?: Org) {
  // 行按钮传行数据；缺少主键时直接返回，避免无效请求
  const id = row ? row.id : table.value.ids[0]
  if (id == null) return
  resetForm()
  loadOrgOptions()
  orgApi
    .load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      // 表单只保留可编辑字段，避免把子节点与时间字段回传到后端
      const { children, addTime, updateTime, ...form } = response.data
      formState.value.form = form
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('common.noun.org')])
    })
    .catch(() => {})
}

/**
 * 校验上级组织是否合法：修改时不能选择自己或自己的子孙组织，避免成环
 *
 * @returns 合法返回 true
 */
function validParentId() {
  const form = formState.value.form
  // 新增时不存在成环风险
  if (form.id == null) return true
  if (form.parentId === form.id) return false
  // 递归判断子孙节点中是否包含选中的上级组织
  const findInChildren = (children: Org[]): boolean => {
    for (const child of children) {
      if (child.id === form.parentId) return true
      if (findInChildren(child.children || [])) return true
    }
    return false
  }
  /** 判断选中的上级组织是否位于当前节点的子孙中，用于阻止成环 */
  const isParentInDescendants = (list: Org[]): boolean => {
    for (const item of list) {
      if (item.id === form.id) return findInChildren(item.children || [])
      if (item.children && isParentInDescendants(item.children)) return true
    }
    return false
  }
  return !isParentInDescendants(table.value.list)
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    // 上级组织不能选自己或自己的子孙
    if (!validParentId()) {
      modal.msgError(t('authz.org.parentInvalid'))
      return
    }
    const isEdit = formState.value.form.id != null
    const request = isEdit ? orgApi.update(formState.value.form) : orgApi.insert(formState.value.form)
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
 * 删除组织，成功后刷新列表
 *
 * @param row 待删除行；缺少主键时直接返回
 */
function removeOrg(row?: Org) {
  const id = row ? row.id : table.value.ids[0]
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (id == null) return
  const confirmText = t('authz.org.confirmDelete', [row?.name ?? String(id)])
  modal
    .confirm(confirmText)
    .then(() => orgApi.delete([id]))
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

/**
 * 递归记录原始顺序
 *
 * @param list 组织树
 */
function recordOriginalOrders(list: Org[]) {
  list.forEach((item) => {
    if (item.id != null) {
      originalOrders.value[item.id] = item.order
    }
    if (item.children?.length) {
      recordOriginalOrders(item.children)
    }
  })
}

/** 保存排序：收集变更项后批量提交 */
function saveSort() {
  const ids: number[] = []
  const orders: number[] = []
  /** 递归收集排序发生变更的节点 */
  const collectChanged = (list: Org[]) => {
    list.forEach((item) => {
      if (item.id != null && String(originalOrders.value[item.id]) !== String(item.order)) {
        ids.push(item.id)
        orders.push(item.order as number)
      }
      if (item.children?.length) {
        collectChanged(item.children)
      }
    })
  }
  collectChanged(table.value.list)
  // 无变更时不发起请求，仅提示
  if (ids.length === 0) {
    modal.msgWarning(t('common.noSortChange'))
    return
  }
  orgApi
    .updateSort({ ids, orders })
    .then(() => {
      modal.msgSuccess(t('common.saveSortSuccess'))
      recordOriginalOrders(table.value.list)
    })
    .catch(() => {})
}

/** 展开/折叠：重建表格使 default-expand-all 生效 */
function toggleExpandAll() {
  table.value.refreshTable = false
  table.value.isExpandAll = !table.value.isExpandAll
  nextTick(() => {
    table.value.refreshTable = true
  })
}

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询组织树
getList()
</script>
