<!--
  Org（组织管理）
  树形展示组织，支持搜索、新增、修改、删除及页内快速调整顺序
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item label="组织名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入组织名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="组织状态" clearable style="width: 200px">
          <el-option label="全部" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasRole="['admin']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Check" @click="handleSaveSort" v-hasRole="['admin']">保存排序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 组织树列表 -->
    <el-table
      v-if="table.refreshTable"
      v-loading="table.loading"
      :data="table.list"
      row-key="id"
      :default-expand-all="table.isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="组织名称" width="260" />
      <el-table-column label="顺序" width="130" align="center">
        <template #default="scope">
          <el-input-number v-model="scope.row.order" controls-position="right" :min="0" style="width: 88px" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="manager" label="负责人" width="120" align="center" />
      <el-table-column label="新增时间" align="center" width="170">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasRole="['admin']">新增</el-button>
          <el-button
            v-if="scope.row.parentId !== 0"
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasRole="['admin']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改组织对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="600px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="formState.form.parentId !== 0">
            <el-form-item label="上级组织" prop="parentId">
              <el-tree-select
                v-model="formState.form.parentId"
                :data="orgOptions"
                :props="{ label: 'name', children: 'children' }"
                value-key="id"
                placeholder="选择上级组织"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="formState.form.name" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="manager">
              <el-input v-model="formState.form.manager" placeholder="请输入负责人" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formState.form.status">
                <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Org' })
import { listOrg, getOrg, delOrg, addOrg, updateOrg, updateOrgSort } from '@/api/authz/org'
import { useEnumOption } from '@/composables/useEnumOption'
import { handleTree, parseTime } from '@/utils/common'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import type { Org, OrgQuery } from '@/types/api'
import type { EnumOption } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, ref } from 'vue'

const resetForm = useFormReset()

/** 表格状态 */
interface TableState {
  list: Org[]
  loading: boolean
  showSearch: boolean
  isExpandAll: boolean
  refreshTable: boolean
}

/** 编辑弹窗状态 */
interface FormState {
  visible: boolean
  title: string
  form: Org
  rules: FormRules
}

// --------------------------------- ref data ---------------------------------

// 组件实例引用：编辑表单 ref
const formRef = ref<FormInstance>() /* 编辑表单 ref */

// 搜索栏：查询参数
const queryParams = ref<OrgQuery>({
  name: undefined /* 组织名称关键词 */,
  status: -1 /* 状态（-1 全部、0 正常、1 禁用） */
})

// 表格：UI数据
const table = ref<TableState>({
  list: [] /* 组织树列表 */,
  loading: true /* 加载状态 */,
  showSearch: true /* 是否显示搜索栏 */,
  isExpandAll: true /* 是否展开全部 */,
  refreshTable: true /* 表格刷新开关（展开/折叠时重建） */
})

// 编辑弹窗：表单状态（表单数据 + 校验规则 + 弹窗显隐/标题）
const formState = ref<FormState>({
  visible: false /* 对话框显隐 */,
  title: '' /* 对话框标题 */,
  form: {} /* 表单数据 */,
  rules: {
    /* 校验规则 */
    name: [{ required: true, message: '组织名称不能为空', trigger: 'blur' }],
    order: [{ required: true, message: '顺序不能为空', trigger: 'blur' }]
  }
})

// 上级组织树选项
const orgOptions = ref<Org[]>([])

// 排序：原始顺序快照（用于对比是否发生变更）
const originalOrders = ref<Record<number, number | undefined>>({})

// 状态选项（从后端 OrgStatuEnum 枚举加载）
const { OrgStatuEnum: statusOptions } = useEnumOption('OrgStatuEnum')

// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载状态选项 */

/** 查询组织树列表 */
function getList() {
  table.value.loading = true
  listOrg(queryParams.value).then((response) => {
    table.value.list = handleTree(response.data, 'id')
    recordOriginalOrders(table.value.list)
    table.value.loading = false
  })
}

/** 查询上级组织树选项（保留完整树，保存时再校验不能选自己或其子孙） */
function loadOrgOptions() {
  listOrg({}).then((response) => {
    orgOptions.value = handleTree(response.data, 'id')
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
    parentId: 0,
    name: undefined,
    order: 0,
    status: 0,
    manager: undefined
  }
  resetForm('formRef')
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  handleQuery()
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  table.value.refreshTable = false
  table.value.isExpandAll = !table.value.isExpandAll
  nextTick(() => {
    table.value.refreshTable = true
  })
}

/** 新增按钮操作（不传 row 新增顶级组织，传 row 新增下级组织） */
function handleAdd(row: any) {
  reset()
  loadOrgOptions()
  if (row !== undefined) {
    formState.value.form.parentId = row.id
  }
  formState.value.visible = true
  formState.value.title = '新增组织'
}

/** 修改按钮操作（行内修改，直接取行数据 id） */
function handleUpdate(row: Org) {
  reset()
  loadOrgOptions()
  getOrg(row.id as number).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = '修改组织'
  })
}

/** 校验上级组织是否合法：修改时不能选择自己或自己的子孙组织，避免成环 */
function validParentId() {
  const form = formState.value.form
  if (form.id === undefined) {
    return true
  }
  if (form.parentId === form.id) {
    return false
  }
  // 递归判断子孙节点中是否包含选中的上级组织
  const findInChildren = (children: Org[]) => {
    for (const child of children) {
      if (child.id === form.parentId) {
        return true
      }
      if (findInChildren(child.children || [])) {
        return true
      }
    }
    return false
  }
  const isParentInDescendants = (list: Org[]) => {
    for (const item of list) {
      if (item.id === form.id) {
        return findInChildren(item.children || [])
      }
      if (item.children && isParentInDescendants(item.children)) {
        return true
      }
    }
    return false
  }
  return !isParentInDescendants(table.value.list)
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 上级组织不能选自己或自己的子孙
      if (!validParentId()) {
        modal.msgError('上级组织不能选择自己或其下级组织')
        return
      }
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id !== undefined) {
        updateOrg(formState.value.form).then((response) => {
          modal.msgSuccess('修改成功')
          formState.value.visible = false
          getList()
        })
      } else {
        addOrg(formState.value.form).then((response) => {
          modal.msgSuccess('新增成功')
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 递归记录原始顺序 */
function recordOriginalOrders(list: Org[]) {
  list.forEach((item) => {
    originalOrders.value[item.id as number] = item.order
    if (item.children && item.children.length) {
      recordOriginalOrders(item.children)
    }
  })
}

/** 保存排序：收集变更项后批量提交 */
function handleSaveSort() {
  const changedIds: number[] = []
  const changedOrders: number[] = []
  const collectChanged = (list: Org[]) => {
    list.forEach((item) => {
      if (String(originalOrders.value[item.id as number]) !== String(item.order)) {
        changedIds.push(item.id as number)
        changedOrders.push(item.order as number)
      }
      if (item.children && item.children.length) {
        collectChanged(item.children)
      }
    })
  }
  collectChanged(table.value.list)
  if (changedIds.length === 0) {
    modal.msgWarning('未检测到排序修改')
    return
  }
  updateOrgSort({ ids: changedIds, orders: changedOrders }).then(() => {
    modal.msgSuccess('排序保存成功')
    recordOriginalOrders(table.value.list)
  })
}

/** 删除按钮操作（行内删除，按名称提示） */
function handleDelete(row: Org) {
  modal
    .confirm('是否确认删除名称为"' + row.name + '"的数据项？')
    .then(function () {
      return delOrg([row.id as number])
    })
    .then(() => {
      getList()
      modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

// --------------------------------- page init ---------------------------------

// 页面初始化：加载状态选项与组织树
getList()
</script>
