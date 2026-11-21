<!--
  Resource（资源管理）
  功能：资源（目录/菜单/按钮）树查询 + 新增/修改/删除 + 页内排序、展开折叠与图标选择
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('authz.resource.menuName')" prop="name">
        <el-input
          v-model="queryParams.name"
          :placeholder="t('common.inputPlaceholder', [t('authz.resource.menuName')])"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('authz.resource.statusPlaceholder')" clearable style="width: 200px">
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
        <el-button type="primary" plain icon="Plus" @click="openCreateForm()" v-hasRole="['admin']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Check" @click="saveSort" v-hasRole="['admin']">{{ t('common.saveSort') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">{{ t('common.expandCollapse') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-table
      v-if="table.refresh"
      v-loading="table.loading"
      :data="table.list"
      row-key="id"
      :default-expand-all="table.expandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- 树表首列保持名称，保证层级缩进与展开箭头落在名称列 -->
      <el-table-column prop="name" :label="t('authz.resource.menuName')" :show-overflow-tooltip="true" width="220">
        <template #default="scope">
          <SvgIcon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          <span class="ml5">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('authz.resource.typeColumn')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" type="primary" size="small">{{ t('authz.resource.typeDir') }}</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="success" size="small">{{ t('authz.resource.typeMenu') }}</el-tag>
          <el-tag v-else type="warning" size="small">{{ t('authz.resource.typeBtn') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order" :label="t('authz.resource.order')" width="200">
        <template #default="scope">
          <el-input-number v-model="scope.row.order" controls-position="right" :min="0" style="width: 88px" />
        </template>
      </el-table-column>
      <el-table-column prop="permission" :label="t('authz.resource.permission')" :show-overflow-tooltip="true" />
      <el-table-column prop="url" :label="t('authz.resource.url')" :show-overflow-tooltip="true" />
      <el-table-column :label="t('authz.resource.visible')" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.visible === 0 ? 'primary' : 'info'" size="small">
            {{ enumTitle(visibleOptions, scope.row.visible) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" align="center" width="210" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasRole="['admin']">{{
            t('common.modify')
          }}</el-button>
          <!-- 按钮类型资源不能再挂子节点 -->
          <el-button link type="primary" icon="Plus" @click="openCreateForm(scope.row)" v-if="scope.row.type !== 2" v-hasRole="['admin']">{{
            t('common.add')
          }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeResource(scope.row)" v-hasRole="['admin']">{{
            t('common.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增或修改对话框 -->
    <el-dialog
      :title="formState.title"
      v-model="formState.visible"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="t('authz.resource.parent')">
              <el-tree-select
                v-model="formState.form.parentId"
                :data="menuOptions"
                :props="{ label: 'name', children: 'children' }"
                value-key="id"
                :placeholder="t('authz.resource.parentPlaceholder')"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="t('authz.resource.type')" prop="type">
              <el-radio-group v-model="formState.form.type">
                <el-radio v-for="item in typeOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.resource.menuName')" prop="name">
              <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('authz.resource.menuName')])" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.resource.order')" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formState.form.type !== 2">
            <el-form-item :label="t('authz.resource.icon')" prop="icon">
              <el-popover placement="bottom-start" :width="540" trigger="click">
                <template #reference>
                  <el-input
                    v-model="formState.form.icon"
                    :placeholder="t('authz.resource.iconPlaceholder')"
                    @blur="showSelectIcon"
                    readonly
                  >
                    <template #prefix>
                      <SvgIcon
                        v-if="formState.form.icon"
                        :icon-class="formState.form.icon"
                        class="el-input__icon"
                        style="height: 32px; width: 16px"
                      />
                      <el-icon v-else style="height: 32px; width: 16px"><Search /></el-icon>
                    </template>
                  </el-input>
                </template>
                <IconSelect ref="iconSelectRef" @selected="selected" :active-icon="formState.form.icon" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formState.form.type !== 2">
            <el-form-item :label="t('authz.resource.url')" prop="url">
              <el-input v-model="formState.form.url" :placeholder="t('common.inputPlaceholder', [t('authz.resource.url')])" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="t('authz.resource.permission')" prop="permission">
              <el-input
                v-model="formState.form.permission"
                :placeholder="t('common.inputPlaceholder', [t('authz.resource.permission')])"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="visible">
              <template #label>
                <span>
                  <el-tooltip :content="t('authz.resource.visibleTip')" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  {{ t('authz.resource.visible') }}
                </span>
              </template>
              <el-radio-group v-model="formState.form.visible">
                <el-radio v-for="item in visibleOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status">
              <template #label>
                <span>
                  <el-tooltip :content="t('authz.resource.statusTip')" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  {{ t('authz.resource.statusLabel') }}
                </span>
              </template>
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
defineOptions({ name: 'Resource' })
import { nextTick, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { IconSelect, RightToolbar, SvgIcon } from '@/components'
import { enumTitle, useEnumOption } from '@/composables/useEnumOption'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import { resourceApi } from '../api'
import type { Resource, ResourceForm, ResourceQuery } from '../types'
import type { FormState, TableState } from '@/types'

/** 资源树表格状态：在通用表格状态上补充展开与重建开关 */
interface ResourceTableState extends TableState<Resource> {
  /** 是否默认展开全部节点 */
  expandAll: boolean
  /** 表格刷新开关：展开/折叠切换时先销毁再重建，使 default-expand-all 生效 */
  refresh: boolean
}

// ---------------------- 响应式数据 ----------------------

// 表单与图标选择器实例引用
const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */
const iconSelectRef = ref<InstanceType<typeof IconSelect>>() /* 图标选择器 */

// 枚举选项：资源类型、状态、显示状态
const {
  ResourceTypeEnum: typeOptions,
  ResourceStatuEnum: statusOptions,
  ResourceVisibleEnum: visibleOptions
} = useEnumOption('ResourceTypeEnum', 'ResourceStatuEnum', 'ResourceVisibleEnum')

// 搜索栏筛选参数（树形接口不分页）
const queryParams = ref<ResourceQuery>({
  name: undefined /* 资源名称，模糊匹配 */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 资源树数据与展示状态
const table = ref<ResourceTableState>({
  list: [], // 资源树列表
  total: 0, // 树形接口不分页，占位以复用通用表格状态
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 树形列表无勾选，占位以复用通用表格状态
  expandAll: false, // 是否展开全部
  refresh: true // 表格刷新开关
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<ResourceForm> = {
  parentId: 0,
  type: 0,
  order: 0,
  status: 0,
  visible: 0
}

// 编辑弹窗状态
const formState = ref<FormState<ResourceForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('authz.resource.menuName')]), trigger: 'blur' }],
    order: [{ required: true, message: t('common.requiredMsg', [t('authz.resource.order')]), trigger: 'blur' }]
  }
})

// 上级资源下拉树选项
const menuOptions = ref<Resource[]>([])
// 排序原始值快照：保存排序时用于比对变更项
const originalOrders = ref<Record<number, number | undefined>>({})

// ---------------------- 数据检索 ----------------------

/**
 * 查询资源树列表
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  resourceApi
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

/** 查询上级资源下拉树，补充"根节点"供顶级资源选择 */
function loadTreeOptions() {
  resourceApi
    .treeList({})
    .then((response) => {
      // 后端以 parentId=0 表示顶级节点，补一个根节点供选择
      const topNode: Resource = { id: 0, parentId: -1, name: t('authz.resource.rootNode'), children: [] }
      topNode.children = handleTree(response.data, 'id')
      menuOptions.value = [topNode]
    })
    .catch(() => {})
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

// ---------------------- 数据操作（增删改） ----------------------

/** 重置编辑表单：重置表单数据为默认值 + 清除表单校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  formRef.value?.clearValidate()
}

/**
 * 打开新增弹窗
 *
 * @param row 上级资源；行内新增时传入，顶部新增时为空（创建顶级资源）
 */
function openCreateForm(row?: Resource) {
  resetForm()
  loadTreeOptions()
  // 行内新增以上级为当前行，顶部新增默认 parentId=0
  formState.value.form.parentId = row?.id ?? 0
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('common.noun.resource')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；优先使用行数据主键
 */
function openEditForm(row?: Resource) {
  // 行按钮传行数据；缺少主键时直接返回，避免无效请求
  const id = row ? row.id : table.value.ids[0]
  if (id == null) return
  resetForm()
  loadTreeOptions()
  resourceApi
    .load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      formState.value.form = response.data
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('common.noun.resource')])
    })
    .catch(() => {})
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const form = formState.value.form
    // 只回传可编辑字段：后端自动维护时间，回传 addTime/updateTime 会导致日期绑定失败
    const submitData: ResourceForm = {
      id: form.id,
      parentId: form.parentId,
      name: form.name,
      type: form.type,
      permission: form.permission,
      url: form.url,
      icon: form.icon,
      order: form.order,
      status: form.status,
      visible: form.visible
    }
    const isEdit = form.id != null
    const request = isEdit ? resourceApi.update(submitData) : resourceApi.insert(submitData)
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
 * 删除资源，成功后刷新列表
 *
 * @param row 待删除行；缺少主键时直接返回
 */
function removeResource(row?: Resource) {
  const id = row ? row.id : table.value.ids[0]
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (id == null) return
  const confirmText = t('authz.resource.confirmDelete', [row?.name ?? String(id)])
  modal
    .confirm(confirmText)
    .then(() => resourceApi.delete(id))
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

/** 展示下拉图标前重置图标选择器的搜索关键词 */
function showSelectIcon() {
  iconSelectRef.value?.reset()
}

/**
 * 选择图标
 *
 * @param name 图标名称
 */
function selected(name: string) {
  formState.value.form.icon = name
}

/**
 * 递归记录原始顺序
 *
 * @param list 资源树
 */
function recordOriginalOrders(list: Resource[]) {
  list.forEach((item) => {
    if (item.id != null) {
      originalOrders.value[item.id] = item.order
    }
    if (item.children?.length) {
      recordOriginalOrders(item.children)
    }
  })
}

/** 保存排序：收集排序变更的 id/order，调用批量排序接口一次提交 */
function saveSort() {
  const ids: number[] = []
  const orders: number[] = []
  const collectChanged = (list: Resource[]) => {
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
  resourceApi
    .updateSort(ids, orders)
    .then(() => {
      modal.msgSuccess(t('common.saveSortSuccess'))
      recordOriginalOrders(table.value.list)
    })
    .catch(() => {})
}

/** 展开/折叠：重建表格使 default-expand-all 生效 */
function toggleExpandAll() {
  table.value.refresh = false
  table.value.expandAll = !table.value.expandAll
  nextTick(() => {
    table.value.refresh = true
  })
}

// ---------------------- 页面初始化 ----------------------

getList()
</script>
