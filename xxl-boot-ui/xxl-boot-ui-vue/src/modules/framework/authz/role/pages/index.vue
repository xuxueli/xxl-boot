<!--
  Role（角色管理）
  功能：角色分页查询 + 菜单权限树授权 + 新增/修改/删除
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('authz.role.name')" prop="name">
        <el-input v-model="queryParams.name" :placeholder="t('common.inputPlaceholder', [t('authz.role.name')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('authz.role.statusPlaceholder')" clearable style="width: 200px">
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
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeRole()" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.serialNo')" prop="id" align="center" width="80" />
      <el-table-column :label="t('authz.role.name')" align="center" prop="name" show-overflow-tooltip />
      <el-table-column :label="t('authz.role.roleKey')" align="center" prop="code" show-overflow-tooltip />
      <el-table-column :label="t('authz.role.order')" align="center" prop="order" width="100" />
      <el-table-column :label="t('common.status')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeRole(scope.row)" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
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
    <el-dialog :title="formState.title" v-model="formState.visible" width="680px" append-to-body :close-on-click-modal="false" @closed="resetForm">
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('authz.role.name')" prop="name">
              <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('authz.role.name')])" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.role.roleKey')" prop="code">
              <el-input v-model="formState.form.code" :placeholder="t('common.inputPlaceholder', [t('authz.role.roleKey')])" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.role.order')" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('common.status')">
              <el-radio-group v-model="formState.form.status">
                <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="t('authz.role.menuPermission')">
              <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">{{ t('common.expandCollapse') }}</el-checkbox>
              <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">{{ t('authz.role.selectAll') }}</el-checkbox>
              <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">{{ t('authz.role.linkAll') }}</el-checkbox>
              <el-tree
                class="tree-border"
                :data="menuOptions"
                show-checkbox
                ref="menuRef"
                node-key="id"
                :check-strictly="!menuCheckStrictly"
                :empty-text="t('authz.role.loadingText')"
                :props="{ label: 'name', children: 'children' }"
              ></el-tree>
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
defineOptions({ name: 'Role' })
import { nextTick, ref } from 'vue'
import type { CheckboxValueType, FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import { useEnumOption, enumTitle } from '@/composables/useEnumOption'
import { usePageParams } from '@/composables/usePageParams'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import { resourceApi } from '@/modules/framework/authz/resource/api'
import { roleApi } from '../api'
import type { Role, RoleForm, RoleQuery } from '../types'
import type { Resource } from '@/modules/framework/authz/resource/types'
import type { FormState, TableState } from '@/types'

/** 菜单权限树实例：仅声明页面用到的最小方法，避免宽泛类型 */
interface MenuTreeInstance {
  setChecked: (key: number | string, checked: boolean, deep: boolean) => void
  setCheckedKeys: (keys: number[]) => void
  setCheckedNodes: (nodes: Resource[]) => void
  getCheckedKeys: () => number[]
  getHalfCheckedKeys: () => number[]
  store: {
    nodesMap: Record<string, { expanded: boolean }>
  }
}

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */
const menuRef = ref<MenuTreeInstance>() /* 菜单权限树 */

// 角色状态选项，由后端枚举接口加载
const { RoleStatusEnum: statusOptions } = useEnumOption('RoleStatusEnum')

// 菜单权限树数据与交互状态
const menuOptions = ref<Resource[]>([]) /* 菜单权限树数据 */
const menuExpand = ref(false) /* 展开/折叠 */
const menuNodeAll = ref(false) /* 全选/全不选 */
const menuCheckStrictly = ref(true) /* 父子联动 */

// 搜索栏筛选条件与分页参数
const queryParams = ref<RoleQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  name: undefined /* 角色名称，模糊匹配 */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<Role>>({
  list: [], // 数据列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<RoleForm> = { order: 0, status: 0 }

// 编辑弹窗状态
const formState = ref<FormState<RoleForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('authz.role.name')]), trigger: 'blur' }],
    code: [{ required: true, message: t('common.requiredMsg', [t('authz.role.roleKey')]), trigger: 'blur' }]
  }
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询角色分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
  roleApi.pageList(usePageParams(queryParams)())
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
function syncSelection(selection: Role[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 重置编辑表单：重置默认值、菜单树勾选与操作状态，并清除校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  menuExpand.value = false
  menuNodeAll.value = false
  menuRef.value?.setCheckedKeys([])
  formRef.value?.clearValidate()
}

/** 查询菜单权限树结构（扁平数据转为树） */
function getMenuTreeselect() {
  return resourceApi
    .treeList({})
    .then((response) => {
      menuOptions.value = handleTree(response.data, 'id')
    })
    .catch(() => {})
}

/** 打开新增弹窗 */
function openCreateForm() {
  resetForm()
  getMenuTreeselect()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('authz.user.role')])
}

/**
 * 打开修改弹窗并回填详情与已授权菜单
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: Role) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  roleApi
    .load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      formState.value.form = response.data
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('authz.user.role')])
      // 菜单树加载完成后才能按资源 id 勾选，否则节点尚未渲染
      return getMenuTreeselect()
        .then(() => roleApi.loadRoleRes(id))
        .then((res) => {
          nextTick(() => {
            res.data.forEach((resId) => menuRef.value?.setChecked(resId, true, false))
          })
        })
    })
    .catch(() => {})
}

/** 菜单权限树：展开/折叠 */
function handleCheckedTreeExpand(value: CheckboxValueType) {
  menuOptions.value.forEach((item) => {
    if (item.id == null) return
    const node = menuRef.value?.store.nodesMap[String(item.id)]
    if (node) node.expanded = Boolean(value)
  })
}

/** 菜单权限树：全选/全不选 */
function handleCheckedTreeNodeAll(value: CheckboxValueType) {
  menuRef.value?.setCheckedNodes(value ? menuOptions.value : [])
}

/** 菜单权限树：父子联动开关 */
function handleCheckedTreeConnect(value: CheckboxValueType) {
  menuCheckStrictly.value = Boolean(value)
}

/**
 * 收集菜单权限勾选节点（含半选）
 *
 * 半选节点代表部分子节点已授权，后端保存授权时必须一并提交。
 *
 * @returns 资源主键列表
 */
function getMenuAllCheckedKeys(): number[] {
  const checkedKeys = menuRef.value?.getCheckedKeys() ?? []
  const halfCheckedKeys = menuRef.value?.getHalfCheckedKeys() ?? []
  return [...halfCheckedKeys, ...checkedKeys]
}

/** 校验通过后保存：有 id 走修改，否则新增，随后保存菜单授权 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    // 后端 update 会自动维护 update_time，回传 addTime/updateTime 会导致 Date 绑定失败
    const submitData: Role = { ...formState.value.form }
    delete submitData.addTime
    delete submitData.updateTime
    const resourceIds = getMenuAllCheckedKeys()
    const roleId = formState.value.form.id
    const isEdit = roleId != null
    // 新增接口返回新角色 id，与修改统一后继续保存菜单授权
    const request = isEdit ? roleApi.update(submitData).then(() => roleId) : roleApi.insert(submitData).then((response) => response.data)
    request
      .then((id) => roleApi.updateRoleRes(id, resourceIds))
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
 * 删除角色（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeRole(row?: Role) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  // 单条确认展示角色名称（回退主键），批量确认展示条数
  const confirmText = row
    ? t('authz.role.confirmDelete', [row.name ?? String(row.id)])
    : t('authz.role.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => roleApi.delete(ids))
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

// ---------------------- 页面初始化 ----------------------

// 页面加载时查询角色列表
getList()
</script>
