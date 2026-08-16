<!--
  Role（角色管理）
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 200px">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['authz:role']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasPermi="['authz:role']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasPermi="['authz:role']"
          >删除</el-button
        >
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 角色列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" align="center" prop="id" width="100" />
      <el-table-column label="角色名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="权限字符" align="center" prop="code" :show-overflow-tooltip="true" />
      <el-table-column label="显示顺序" align="center" prop="order" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="170">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['authz:role']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['authz:role']">删除</el-button>
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

    <!-- 添加或修改角色对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="680px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="formState.form.name" placeholder="请输入角色名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限字符" prop="code">
              <el-input v-model="formState.form.code" placeholder="请输入权限字符" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="order">
              <el-input-number v-model="formState.form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formState.form.status">
                <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单权限">
              <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
              <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
              <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
              <el-tree
                class="tree-border"
                :data="menuOptions"
                show-checkbox
                ref="menuRef"
                node-key="id"
                :check-strictly="!menuCheckStrictly"
                empty-text="加载中，请稍候"
                :props="{ label: 'name', children: 'children' }"
              ></el-tree>
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
defineOptions({ name: 'Role' })
import { listRole, getRole, addRole, updateRole, delRole, roleMenuTreeselect, updateRoleRes } from '@/api/authz/role'
import { listResource as menuTreeselect } from '@/api/authz/resource'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import { handleTree, parseTime } from '@/utils/common'
import modal from '@/utils/modal'
import type { Role, Resource, RoleQuery } from '@/types/api'
import type { EnumOption, TableState, FormState } from '@/types'
import type { CheckboxValueType, FormInstance, FormRules } from 'element-plus'
import { nextTick, ref } from 'vue'
import { RightToolbar, Pagination } from '@/components'

const resetForm = useFormReset()

// --------------------------------- ref data ---------------------------------

// 组件实例引用：模板 ref
const formRef = ref<FormInstance>() /* 编辑表单 ref */
const menuRef = ref<any>() /* 菜单权限树 ref */

// 角色状态枚举选项
const { RoleStatusEnum: statusOptions } = useEnumOption('RoleStatusEnum')

// 菜单权限树数据与交互状态
const menuOptions = ref<Resource[]>([]) /* 菜单权限树数据 */
const menuExpand = ref(false) /* 展开/折叠 */
const menuNodeAll = ref(false) /* 全选/全不选 */
const menuCheckStrictly = ref(true) /* 父子联动 */

// 搜索栏：查询参数
const queryParams = ref<RoleQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  name: undefined /* 角色名称关键词 */,
  status: -1 /* 状态（-1 全部、0 正常、1 停用） */
})

// 表格：UI数据
const table = ref<TableState<Role>>({
  list: [] /* 角色列表 */,
  total: 0 /* 总条数 */,
  loading: true /* 加载状态 */,
  showSearch: true /* 是否显示搜索栏 */,
  ids: [] /* 选中行 ID 数组 */,
  single: true /* 是否单选 */,
  multiple: true /* 是否多选 */
})

// 编辑表单：数据状态
const formState = ref<FormState<Role>>({
  visible: false /* 对话框显隐 */,
  title: '' /* 对话框标题 */,
  form: {} /* 表单数据 */,
  rules: {
    /* 校验规则 */
    name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }]
  }
})

// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载角色状态选项 */

/** 状态编码 → 文案 */
function statusText(status: number) {
  const item = statusOptions.value.find((i) => i.code === status)
  return item ? item.title : status
}

/** 查询角色列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端请求参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  listRole(params).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: Role[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
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
    name: undefined,
    code: undefined,
    order: 0,
    status: 0
  }
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([])
  }
  menuExpand.value = false
  menuNodeAll.value = false
  resetForm('formRef')
}

/** 查询菜单权限树结构 */
function getMenuTreeselect() {
  return menuTreeselect({}).then((response) => {
    menuOptions.value = handleTree(response.data, 'id')
  })
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getMenuTreeselect()
  formState.value.visible = true
  formState.value.title = '新增角色'
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  getRole(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = '修改角色'
    // 加载菜单权限树后，再勾选角色已授权资源
    getMenuTreeselect()
      .then(() => {
        return roleMenuTreeselect(id)
      })
      .then((res) => {
        nextTick(() => {
          res.data.forEach((resId) => {
            nextTick(() => {
              menuRef.value.setChecked(resId, true, false)
            })
          })
        })
      })
  })
}

/** 树权限（展开/折叠） */
function handleCheckedTreeExpand(value: CheckboxValueType) {
  const treeList = menuOptions.value
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].id as number].expanded = value
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value: CheckboxValueType) {
  menuRef.value.setCheckedNodes(value ? menuOptions.value : [])
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value: CheckboxValueType) {
  menuCheckStrictly.value = value ? true : false
}

/** 收集菜单权限勾选节点（含半选） */
function getMenuAllCheckedKeys() {
  // 目前被选中的节点
  let checkedKeys = menuRef.value.getCheckedKeys()
  // 半选中的节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 后端 update 会自动维护 update_time，回传 addTime/updateTime 会导致 Date 绑定失败
      const submitData = { ...formState.value.form }
      delete submitData.addTime
      delete submitData.updateTime
      const resourceIds = getMenuAllCheckedKeys()

      // 已有 id 走更新，否则走新增
      if (formState.value.form.id !== undefined) {
        updateRole(submitData)
          .then(() => {
            return updateRoleRes(submitData.id as number, resourceIds)
          })
          .then(() => {
            modal.msgSuccess('修改成功')
            formState.value.visible = false
            getList()
          })
      } else {
        addRole(submitData)
          .then((response) => {
            // 新增返回新角色ID，用于保存菜单权限
            return updateRoleRes(response.data as number, resourceIds)
          })
          .then(() => {
            modal.msgSuccess('新增成功')
            formState.value.visible = false
            getList()
          })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const roleIds = row?.id ?? table.value.ids
  if (roleIds == null || (Array.isArray(roleIds) && roleIds.length === 0)) {
    return
  }
  modal
    .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
    .then(function () {
      return delRole(roleIds)
    })
    .then(() => {
      getList()
      modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

// --------------------------------- page init ---------------------------------

// 页面初始化：加载角色状态枚举 + 角色列表
getList()
</script>
