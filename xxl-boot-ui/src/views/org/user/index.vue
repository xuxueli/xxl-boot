<!--
  User（用户管理）
  左侧组织结构，选中组织后传递该组织及全部子组织作为查询条件
-->
<template>
  <div class="app-container tree-sidebar-manage-wrap">
    <TreePanel title="组织机构" :tree-data="deptOptions" :tree-props="{ label: 'name', children: 'children' }" :filter-method="filterOrg" search-placeholder="请输入组织名称" storage-key="boot-user-org-sidebar-width" :defaultExpandAll="true" @node-click="handleNodeClick" @refresh="getDeptTree" ref="deptTreeRef" />
    <div class="tree-sidebar-content">
      <div class="content-inner">
        <!-- 搜索栏 -->
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 200px">
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['org:user']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasPermi="['org:user']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasPermi="['org:user']">删除</el-button>
          </el-col>
          <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
        </el-row>

        <!-- 用户列表 -->
        <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="用户编号" align="center" prop="id" width="80" />
          <el-table-column label="账号" align="center" prop="username" width="110" :show-overflow-tooltip="true">
            <template #default="scope">
              <a class="link-type" style="cursor:pointer" @click="handleViewData(scope.row)">{{ scope.row.username }}</a>
            </template>
          </el-table-column>
          <el-table-column label="用户名称" align="center" prop="realName" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="所属组织" align="center" prop="orgName" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" width="100">
            <template #default="scope">
                            <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="170">
            <template #default="scope">
              <span>{{ parseTime(scope.row.addTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="190" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['org:user']">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['org:user']">删除</el-button>
              <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, scope.row)">
                <el-button link type="primary" icon="DArrowRight">更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="checkPermi(['org:user'])" command="resetPwd" icon="Key">重置密码</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
      </div>
    </div>

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="640px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input v-model="formState.form.username" placeholder="请输入账号" maxlength="20" :disabled="formState.form.id !== undefined" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" :rules="formState.form.id === undefined ? passwordRules : []">
              <el-input v-model="formState.form.password" placeholder="请输入密码" type="password" maxlength="20" show-password :disabled="formState.form.id !== undefined" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="realName">
              <el-input v-model="formState.form.realName" placeholder="请输入用户名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="formState.form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status == 1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属组织" prop="orgId">
              <el-tree-select
                v-model="formState.form.orgId"
                :data="orgOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="请选择归属组织"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formState.form.email" placeholder="请输入邮箱" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formState.form.phone" placeholder="请输入手机号" maxlength="20" />
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

    <!-- 用户详情抽屉 -->
    <UserViewDrawer ref="userViewRef" />
  </div>
</template>

<script setup name="User">
import UserViewDrawer from "./view"
import { listUser, addUser, updateUser, delUser } from "@/api/org/user"
import { listRole } from "@/api/org/role"
import { listOrg } from "@/api/org/org"
import { loadEnumItem } from "@/api/system/dict/data"
import { useFormReset } from '@/composables/useFormReset'
import { handleTree, parseTime } from '@/utils/common'
import modal from '@/utils/modal'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const resetForm = useFormReset()

// 校验权限（供 el-dropdown-item 等组件内使用，指令不适用于组件根节点）
const checkPermi = (value) => userStore.checkPermi(value)


// --------------------------------- ref data ---------------------------------

// 组件实例引用：模板 ref
const formRef = ref(null)            /* 编辑表单 ref */
const deptTreeRef = ref(null)        /* 左侧组织树 ref */
const userViewRef = ref(null)        /* 用户详情抽屉 ref */

// 用户状态枚举选项（UserStatuEnum）
const statusOptions = ref([])

// 角色选项（编辑表单角色多选）
const roleOptions = ref([])

// 组织树：左侧树形结构 + 编辑表单归属组织下拉树
const deptOptions = ref([])          /* 左侧组织树 */
const orgOptions = ref([])           /* 编辑表单归属组织下拉树 */

// 搜索栏：查询参数
const queryParams = ref({
  pageNum: 1,          /* 当前页码 */
  pageSize: 10,        /* 每页条数 */
  username: undefined, /* 用户名称关键词 */
  status: -1,          /* 状态（-1 全部、0 正常、1 停用） */
  orgIds: []           /* 选中的组织及其全部子组织 ID 列表 */
})

// 表格：UI数据
const table = ref({
  list: [],          /* 用户列表 */
  total: 0,          /* 总条数 */
  loading: true,     /* 加载状态 */
  showSearch: true,  /* 是否显示搜索栏 */
  ids: [],           /* 选中行 ID 数组 */
  single: true,      /* 是否单选 */
  multiple: true     /* 是否多选 */
})

// 编辑表单：数据状态
const formState = ref({
  visible: false,  /* 对话框显隐 */
  title: "",       /* 对话框标题 */
  form: {},        /* 表单数据 */
  rules: {         /* 校验规则 */
    username: [
      { required: true, message: "账号不能为空", trigger: "blur" },
      { pattern: /^[a-z][a-z0-9]*$/, message: "格式：小写字母开头，字母/数字", trigger: "blur" }
    ],
    realName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "手机号码格式不正确", trigger: "blur" }],
    email: [{ type: "email", message: "邮箱格式不正确", trigger: ["blur", "change"] }]
  }
})
// 密码校验规则（仅新增时生效，编辑时密码只读不校验）
const passwordRules = [
  { required: true, message: "密码不能为空", trigger: "blur" },
  { min: 4, max: 20, message: "密码长度 4-20", trigger: "blur" }
]


// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载用户状态选项 */
function loadStatusOptions() {
  loadEnumItem('UserStatuEnum').then(res => {
    statusOptions.value = res.data
  })
}

/** 状态编码 → 文案 */
function statusText(status) {
  const item = statusOptions.value.find(i => i.code === status)
  return item ? item.title : status
}

/** 加载角色选项（用于编辑表单角色多选） */
function loadRoleOptions() {
  listRole({ offset: 0, pagesize: 999 }).then(response => {
    roleOptions.value = response.data.data
  })
}

/** 查询组织树列表 */
function getDeptTree() {
  listOrg().then(response => {
    // handleTree 会就地修改数组并填充 children，需对原始数据分别深拷贝，避免相互污染导致子节点重复
    deptOptions.value = handleTree(JSON.parse(JSON.stringify(response.data)), 'id')
    // 归属组织下拉树：默认追加「未选择」节点（id=0），对齐后端 org_id 默认值 0
    orgOptions.value = [
      { id: 0, name: '未选择', parentId: -1, children: [] },
      ...handleTree(JSON.parse(JSON.stringify(response.data)), 'id')
    ]
  })
}

/** 组织树节点过滤方法（字段为 name，非 TreePanel 默认的 label） */
function filterOrg(value, data) {
  if (!value) return true
  return data.name && data.name.indexOf(value) !== -1
}

/** 递归收集节点及其全部子节点 ID */
function collectOrgIds(node) {
  const ids = [node.id]
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      ids.push(...collectOrgIds(child))
    })
  }
  return ids
}

/** 节点单击事件：选中组织及其全部子组织作为查询条件 */
function handleNodeClick(data) {
  queryParams.value.orgIds = collectOrgIds(data)
  handleQuery()
}

/** 查询用户列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize,
    orgIds: queryParams.value.orgIds.join(',') || undefined
  }
  delete params.pageNum
  delete params.pageSize
  listUser(params).then(response => {
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
  resetForm("queryRef")
  queryParams.value.orgIds = []
  deptTreeRef.value.setCurrentKey(null)
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  table.value.ids = selection.map(item => item.id)
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
    username: undefined,
    realName: undefined,
    orgId: 0,
    password: '123456',
    phone: undefined,
    email: undefined,
    status: 0,
    roleIds: []
  }
  resetForm("formRef")
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getDeptTree()
  loadRoleOptions()
  formState.value.visible = true
  formState.value.title = "新增用户"
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row) {
  reset()
  getDeptTree()
  loadRoleOptions()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row && row.id != null ? row.id : table.value.ids[0]
  if (id == null) {
    return
  }
  const current = table.value.list.find(item => item.id === id)
  if (!current) {
    return
  }
  formState.value.form = { ...current }
  formState.value.visible = true
  formState.value.title = "修改用户"
}

/** 提交按钮 */
function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      // 后端 update 会自动维护 update_time，回传 addTime/updateTime 会导致 Date 绑定失败
      const submitData = { ...formState.value.form }
      delete submitData.addTime
      delete submitData.updateTime
      delete submitData.orgName
      delete submitData.roleNames
      if (submitData.orgId === 0 || submitData.orgId == null) {
        submitData.orgId = 0
      }

      // 已有 id 走更新，否则走新增
      if (formState.value.form.id !== undefined) {
        updateUser(submitData).then(() => {
          modal.msgSuccess("修改成功")
          formState.value.visible = false
          getList()
        })
      } else {
        addUser(submitData).then(() => {
          modal.msgSuccess("新增成功")
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 更多操作下拉指令分发 */
function handleCommand(command, row) {
  switch (command) {
    case "resetPwd":
      handleResetPwd(row)
      break
    default:
      break
  }
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row) {
  const userIds = row && row.id != null ? row.id : table.value.ids
  if (userIds == null || (Array.isArray(userIds) && userIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
    return delUser(userIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 重置密码按钮操作（通过 update 接口传递 id + password，需带上其余字段避免覆盖为空；密码复用 passwordRules 规则校验） */
function handleResetPwd(row) {
  ElMessageBox.prompt(`请输入「${row.username}」的新密码`, "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputValidator: (value) => {
      // 复用密码表单校验规则：必填 + 长度 4-20
      const requiredRule = passwordRules.find(rule => rule.required)
      if (requiredRule && !value) {
        return requiredRule.message
      }
      const lengthRule = passwordRules.find(rule => rule.min !== undefined)
      if (lengthRule && value && (value.length < lengthRule.min || value.length > lengthRule.max)) {
        return lengthRule.message
      }
      return true
    }
  }).then(({ value }) => {
    const submitData = { ...row, password: value }
    delete submitData.addTime
    delete submitData.updateTime
    delete submitData.orgName
    delete submitData.roleNames
    updateUser(submitData).then(() => {
      modal.msgSuccess("修改成功，新密码是：" + value)
    })
  }).catch(() => {})
}

/** 用户状态快速切换（通过 update 接口传递完整行数据，避免其余字段被覆盖） */
function handleStatusChange(row) {
  const text = Number(row.status) === 0 ? "正常" : "停用"
  const submitData = { ...row, status: Number(row.status) }
  delete submitData.addTime
  delete submitData.updateTime
  delete submitData.orgName
  delete submitData.roleNames
  updateUser(submitData).then(() => {
    modal.msgSuccess(text + "成功")
  }).catch(() => {
    // 失败时回滚开关状态
    row.status = Number(row.status) === 0 ? 1 : 0
  })
}

/** 详情按钮操作（点击账号展示用户详情抽屉） */
function handleViewData(row) {
  userViewRef.value.open(row)
}


// --------------------------------- page init ---------------------------------

// 页面初始化：加载状态枚举、组织树与用户列表
loadStatusOptions()
getDeptTree()
getList()
</script>

<style scoped>
/* 操作列：下拉容器与相邻按钮垂直对齐，保持同一水平线 */
:deep(.el-dropdown) {
  vertical-align: middle;
}
</style>
