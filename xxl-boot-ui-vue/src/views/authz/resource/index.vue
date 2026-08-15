<!--
  Resource（资源管理）
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入资源名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="资源状态" clearable style="width: 200px">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['authz:resource']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Check" @click="handleSaveSort" v-hasPermi="['authz:resource']">保存排序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 资源树 -->
    <el-table
      v-if="table.refresh"
      v-loading="table.loading"
      :data="table.list"
      row-key="id"
      :default-expand-all="table.expandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="资源名称" :show-overflow-tooltip="true" width="220">
        <template #default="scope">
          <SvgIcon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          <span class="ml5">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" type="primary" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="success" size="small">菜单</el-tag>
          <el-tag v-else type="warning" size="small">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="200">
        <template #default="scope">
          <el-input-number v-model="scope.row.order" controls-position="right" :min="0" style="width: 88px" />
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="url" label="菜单地址" :show-overflow-tooltip="true" />
      <el-table-column label="显示状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.visible === 0 ? 'primary' : 'info'" size="small">
            {{ visibleText(scope.row.visible) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['authz:resource']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-if="scope.row.type !== 2" v-hasPermi="['authz:resource']"
            >新增</el-button
          >
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['authz:resource']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改资源对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="680px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级资源">
              <el-tree-select
                v-model="formState.form.parentId"
                :data="menuOptions"
                :props="{ label: 'name', children: 'children' }"
                value-key="id"
                placeholder="选择上级资源"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源类型" prop="type">
              <el-radio-group v-model="formState.form.type">
                <el-radio v-for="item in typeOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源名称" prop="name">
              <el-input v-model="formState.form.name" placeholder="请输入资源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formState.form.type !== 2">
            <el-form-item label="资源图标" prop="icon">
              <el-popover placement="bottom-start" :width="540" trigger="click">
                <template #reference>
                  <el-input v-model="formState.form.icon" placeholder="点击选择图标" @blur="showSelectIcon" readonly>
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
            <el-form-item label="菜单地址" prop="url">
              <el-input v-model="formState.form.url" placeholder="请输入菜单地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="formState.form.permission" placeholder="请输入权限标识" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示状态">
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="formState.form.visible">
                <el-radio v-for="item in visibleOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源状态">
              <template #label>
                <span>
                  <el-tooltip content="选择停用则将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  资源状态
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
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Resource" lang="ts">
import { listResource, getResource, addResource, updateResource, delResource, updateResourceSort } from '@/api/authz/resource'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import type { Resource, ResourceQuery } from '@/types/api'
import type { EnumOption } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const resetForm = useFormReset()

/** 表格状态 */
interface TableState {
  list: Resource[]
  loading: boolean
  showSearch: boolean
  expandAll: boolean
  refresh: boolean
}

/** 编辑弹窗状态 */
interface FormState {
  visible: boolean
  title: string
  form: Resource
  rules: FormRules
}

// --------------------------------- ref data ---------------------------------

// 组件实例引用：模板 ref
const formRef = ref<FormInstance>() /* 编辑表单 ref */
const iconSelectRef = ref<any>() /* 图标选择器 ref */

// 枚举选项数据：资源类型、资源状态、显示状态
const {
  ResourceTypeEnum: typeOptions,
  ResourceStatuEnum: statusOptions,
  ResourceVisibleEnum: visibleOptions
} = useEnumOption('ResourceTypeEnum', 'ResourceStatuEnum', 'ResourceVisibleEnum')

// 上级资源下拉树选项
const menuOptions = ref<Resource[]>([])

// 搜索栏：查询参数
const queryParams = ref<ResourceQuery>({
  name: undefined /* 资源名称关键词 */,
  status: -1 /* 状态（-1 全部、0 正常、1 停用） */
})

// 表格：树数据与 UI 状态
const table = ref<TableState>({
  list: [] /* 资源树列表 */,
  loading: true /* 加载状态 */,
  showSearch: true /* 是否显示搜索栏 */,
  expandAll: false /* 是否默认全部展开 */,
  refresh: true /* 表格刷新开关（展开/折叠时重建） */
})

// 编辑表单：数据状态
const formState = ref<FormState>({
  visible: false /* 对话框显隐 */,
  title: '' /* 对话框标题 */,
  form: {} /* 表单数据 */,
  rules: {
    /* 校验规则 */
    name: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
    order: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }]
  }
})

// 排序备份：树加载时的原始排序，用于保存排序时比对变更
const originalOrders = ref<Record<number, number | undefined>>({})

// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载类型、状态、显示状态选项 */

/** 查询资源树列表（后端返回扁平数据，前端转树） */
function getList() {
  table.value.loading = true
  listResource(queryParams.value).then((response) => {
    table.value.list = handleTree(response.data, 'id')
    recordOriginalOrders(table.value.list)
    table.value.loading = false
  })
}

/** 查询上级资源下拉树结构 */
function getTreeOptions() {
  listResource({}).then((response) => {
    // 后端以 parentId=0 表示顶级节点，补一个"顶级"根节点供选择
    const topNode: Resource = { id: 0, parentId: -1, name: '根节点', children: [] }
    topNode.children = handleTree(response.data, 'id')
    menuOptions.value = [topNode]
  })
}

/** 状态编码 → 文案 */
function statusText(status: number) {
  const item = statusOptions.value.find((i) => i.code === status)
  return item ? item.title : status
}

/** 显示状态编码 → 文案 */
function visibleText(visible: number) {
  const item = visibleOptions.value.find((i) => i.code === visible)
  return item ? item.title : visible
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
    type: 0,
    permission: undefined,
    url: undefined,
    icon: undefined,
    order: 0,
    status: 0,
    visible: 0
  }
  resetForm('formRef')
}

/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset()
}

/** 选择图标 */
function selected(name: string) {
  formState.value.form.icon = name
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

/** 新增按钮操作（不传 row 新增顶级资源，传 row 新增下级资源） */
function handleAdd(row: any) {
  reset()
  getTreeOptions()
  // 行内新增时以上级为当前行，顶部新增时上级为顶级（0）
  formState.value.form.parentId = row != null && row.id ? row.id : 0
  formState.value.visible = true
  formState.value.title = '新增资源'
}

/** 修改按钮操作（行内修改，直接取行数据 id） */
function handleUpdate(row: Resource) {
  reset()
  getTreeOptions()
  getResource(row.id as number).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = '修改资源'
  })
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  table.value.refresh = false
  table.value.expandAll = !table.value.expandAll
  nextTick(() => {
    table.value.refresh = true
  })
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 后端 update 会自动维护 update_time，回传 addTime/updateTime 会导致 Date 绑定失败
      const submitData = { ...formState.value.form }
      delete submitData.addTime
      delete submitData.updateTime
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id !== undefined) {
        updateResource(submitData).then((response) => {
          modal.msgSuccess('修改成功')
          formState.value.visible = false
          getList()
        })
      } else {
        addResource(submitData).then((response) => {
          modal.msgSuccess('新增成功')
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 递归记录原始排序 */
function recordOriginalOrders(list: Resource[]) {
  list.forEach((item) => {
    originalOrders.value[item.id as number] = item.order
    if (item.children && item.children.length) {
      recordOriginalOrders(item.children)
    }
  })
}

/** 保存排序：收集排序变更的 id/order，调用批量排序接口一次提交 */
function handleSaveSort() {
  const changedList: Resource[] = []
  const collectChanged = (list: Resource[]) => {
    list.forEach((item) => {
      if (String(originalOrders.value[item.id as number]) !== String(item.order)) {
        changedList.push(item)
      }
      if (item.children && item.children.length) {
        collectChanged(item.children)
      }
    })
  }
  collectChanged(table.value.list)
  if (changedList.length === 0) {
    modal.msgWarning('未检测到排序修改')
    return
  }
  updateResourceSort(
    changedList.map((item) => item.id as number),
    changedList.map((item) => item.order as number)
  ).then(() => {
    modal.msgSuccess('排序保存成功')
    recordOriginalOrders(table.value.list)
  })
}

/** 删除按钮操作（行内删除，按名称提示） */
function handleDelete(row: Resource) {
  modal
    .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
    .then(function () {
      return delResource(row.id as number)
    })
    .then(() => {
      getList()
      modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

// --------------------------------- page init ---------------------------------

// 页面初始化：加载枚举选项 + 资源树列表
getList()
</script>
