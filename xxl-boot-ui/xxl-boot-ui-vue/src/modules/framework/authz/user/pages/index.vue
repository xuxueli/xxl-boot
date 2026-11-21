<!--
  User（用户管理）
  功能：组织树筛选 + 用户分页查询 + 分配角色/组织 + 新增/修改/删除/详情/重置密码
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container tree-sidebar-manage-wrap">
    <TreePanel
      :title="t('authz.user.orgTitle')"
      :tree-data="deptOptions"
      :tree-props="{ label: 'name', children: 'children' }"
      :filter-method="filterOrg"
      :search-placeholder="t('common.inputPlaceholder', [t('authz.org.name')])"
      storage-key="boot-user-org-sidebar-width"
      :defaultExpandAll="true"
      @node-click="handleNodeClick"
      @refresh="getDeptTree"
      ref="deptTreeRef"
    />
    <div class="tree-sidebar-content">
      <div class="content-inner">
        <!-- 搜索栏 -->
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
          <el-form-item :label="t('common.realName')" prop="username">
            <el-input
              v-model="queryParams.username"
              :placeholder="t('common.inputPlaceholder', [t('common.realName')])"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="t('common.status')" prop="status">
            <el-select v-model="queryParams.status" :placeholder="t('authz.user.statusPlaceholder')" clearable style="width: 200px">
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
            <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeUser()" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
          </el-col>
          <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
        </el-row>

        <!-- 数据列表 -->
        <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column :label="t('common.serialNo')" align="center" prop="id" width="80" />
          <el-table-column :label="t('authz.user.username')" align="center" prop="username" width="110" show-overflow-tooltip>
            <template #default="scope">
              <a class="link-type" style="cursor: pointer" @click="handleViewData(scope.row)">{{ scope.row.username }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="t('common.realName')" align="center" prop="realName" width="110" show-overflow-tooltip />
          <el-table-column :label="t('authz.user.orgName')" align="center" prop="orgName" width="120" show-overflow-tooltip />
          <el-table-column :label="t('common.status')" align="center" width="100">
            <template #default="scope">
              <!-- 状态列使用开关支持列表内快速启停，变更失败时回滚 -->
              <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
          <el-table-column :label="t('common.operation')" align="center" width="190" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
              <el-button link type="primary" icon="Delete" @click="removeUser(scope.row)" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
              <el-dropdown trigger="click" @command="handleResetPwd(scope.row)">
                <el-button link type="primary" icon="DArrowRight" v-hasRole="['admin']">{{ t('common.more') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item icon="Key">{{ t('authz.user.resetPwd') }}</el-dropdown-item>
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

    <!-- 新增或修改对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="640px" append-to-body :close-on-click-modal="false" @closed="resetForm">
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.username')" prop="username">
              <el-input
                v-model="formState.form.username"
                :placeholder="t('common.inputPlaceholder', [t('auth.login.username')])"
                maxlength="20"
                :disabled="formState.form.id != null"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.password')" prop="password" :rules="formState.form.id == null ? passwordRules : []">
              <el-input
                v-model="formState.form.password"
                :placeholder="t('common.inputPlaceholder', [t('auth.login.password')])"
                type="password"
                maxlength="20"
                show-password
                :disabled="formState.form.id != null"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('common.realName')" prop="realName">
              <el-input v-model="formState.form.realName" :placeholder="t('common.inputPlaceholder', [t('common.realName')])" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.role')">
              <el-select v-model="formState.form.roleIds" multiple :placeholder="t('common.selectPlaceholderText', [t('authz.user.role')])" style="width: 100%">
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id as number" :disabled="item.status === 1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.belongOrg')" prop="orgId">
              <el-tree-select
                v-model="formState.form.orgId"
                :data="orgOptions"
                :props="{ label: 'name', children: 'children' }"
                value-key="id"
                :placeholder="t('common.selectPlaceholderText', [t('authz.user.belongOrg')])"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.email')" prop="email">
              <el-input v-model="formState.form.email" :placeholder="t('common.inputPlaceholder', [t('authz.user.email')])" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('authz.user.phone')" prop="phone">
              <el-input v-model="formState.form.phone" :placeholder="t('common.inputPlaceholder', [t('authz.user.phone')])" maxlength="11" />
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

    <!-- 用户详情抽屉 -->
    <UserViewDrawer ref="userViewRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'User' })
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormItemRule } from 'element-plus'
import { t } from '@/i18n'
import { Pagination, RightToolbar, TreePanel } from '@/components'
import { useEnumOption } from '@/composables/useEnumOption'
import { usePageParams } from '@/composables/usePageParams'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import { roleApi } from '@/modules/framework/authz/role/api'
import { orgApi } from '@/modules/framework/authz/org/api'
import UserViewDrawer from './view.vue'
import { userApi } from '../api'
import type { User, UserForm, UserQuery } from '../types'
import type { Org } from '@/modules/framework/authz/org/types'
import type { Role } from '@/modules/framework/authz/role/types'
import type { FormState, TableState } from '@/types'

/** 左侧组织树实例：仅声明页面用到的最小方法 */
interface OrgTreeInstance {
  setCurrentKey: (key: number | null) => void
}

/** 用户详情抽屉实例：仅声明页面用到的最小方法 */
interface UserViewDrawerInstance {
  open: (row: User) => void
}

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */
const deptTreeRef = ref<OrgTreeInstance>() /* 左侧组织树 */
const userViewRef = ref<UserViewDrawerInstance>() /* 用户详情抽屉 */

// 用户状态选项，由后端枚举接口加载
const { UserStatuEnum: statusOptions } = useEnumOption('UserStatuEnum')

// 角色选项（编辑表单角色多选）
const roleOptions = ref<Role[]>([])

// 组织树：左侧树形结构 + 编辑表单归属组织下拉树
const deptOptions = ref<Org[]>([]) /* 左侧组织树 */
const orgOptions = ref<Org[]>([]) /* 编辑表单归属组织下拉树 */

// 搜索栏筛选条件与分页参数
const queryParams = ref<UserQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  username: undefined /* 账号，模糊匹配 */,
  status: -1 /* 状态筛选，-1 表示全部 */,
  orgIds: [] /* 选中的组织及其全部子组织 ID 列表 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<User>>({
  list: [], // 数据列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<UserForm> = {
  orgId: 0,
  password: '123456',
  status: 0,
  roleIds: []
}

// 编辑弹窗状态
const formState = ref<FormState<UserForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    username: [
      { required: true, message: t('common.requiredMsg', [t('auth.login.username')]), trigger: 'blur' },
      { pattern: /^[a-z][a-z0-9]*$/, message: t('authz.user.usernameFormat'), trigger: 'blur' }
    ],
    realName: [{ required: true, message: t('common.requiredMsg', [t('common.realName')]), trigger: 'blur' }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: t('authz.user.phoneInvalid'), trigger: 'blur' }],
    email: [{ type: 'email', message: t('authz.user.emailInvalid'), trigger: ['blur', 'change'] }]
  }
})

// 密码校验规则：仅新增时生效，编辑时密码只读不校验
const passwordRules: FormItemRule[] = [
  { required: true, message: t('common.requiredMsg', [t('auth.login.password')]), trigger: 'blur' },
  { min: 4, max: 20, message: t('authz.user.passwordLength'), trigger: 'blur' }
]

// ---------------------- 分页检索 ----------------------

/**
 * 查询用户分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  const params = usePageParams(queryParams)()
  // 组织筛选集合转逗号分隔字符串，匹配后端 pageList 的 List<Integer> 参数形态
  const { orgIds } = queryParams.value
  const orgIdParam = orgIds?.length ? orgIds.join(',') : undefined
  userApi
    .pageList({ ...params, orgIds: orgIdParam })
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

/** 重置搜索条件与组织树选中项后重新查询 */
function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.value.orgIds = []
  deptTreeRef.value?.setCurrentKey(null)
  handleQuery()
}

// ---------------------- 数据操作（增删改） ----------------------

/**
 * 同步表格勾选结果，驱动批量修改/删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: User[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 重置编辑表单：重置为默认值并清除校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  formRef.value?.clearValidate()
}

/**
 * 加载角色选项（用于编辑表单角色多选）
 *
 * 失败提示由请求层统一处理，角色下拉保持空选项。
 */
function loadRoleOptions() {
  roleApi
    .pageList({ offset: 0, pagesize: 999 })
    .then((response) => {
      roleOptions.value = response.data.data
    })
    .catch(() => {})
}

/** 查询组织树列表，同时构建左侧树与编辑表单归属组织下拉树 */
function getDeptTree() {
  orgApi
    .treeList({})
    .then((response) => {
      // handleTree 会就地修改数组并填充 children，分别浅拷贝节点后再组装，避免两棵树互相污染
      deptOptions.value = handleTree(
        response.data.map((item) => ({ ...item })),
        'id'
      )
      // 归属组织下拉树：默认追加「未选择」节点（id=0），对齐后端 org_id 默认值 0
      orgOptions.value = [
        { id: 0, name: t('authz.user.noneChosen'), parentId: -1, children: [] },
        ...handleTree(
          response.data.map((item) => ({ ...item })),
          'id'
        )
      ]
    })
    .catch(() => {})
}

/**
 * 组织树节点过滤方法（字段为 name，非 TreePanel 默认的 label）
 *
 * @param value 搜索关键词
 * @param data 组织节点
 * @returns 是否匹配
 */
function filterOrg(value: string, data: Org): boolean {
  if (!value) return true
  return data.name ? data.name.indexOf(value) !== -1 : false
}

/**
 * 递归收集节点及其全部子节点 ID
 *
 * @param node 组织节点
 * @returns 节点及其子节点 ID 列表
 */
function collectOrgIds(node: Org): number[] {
  const ids = [node.id as number]
  if (node.children && node.children.length) {
    node.children.forEach((child) => {
      ids.push(...collectOrgIds(child))
    })
  }
  return ids
}

/**
 * 组织树节点单击：选中组织及其全部子组织作为查询条件
 *
 * @param data 组织节点
 */
function handleNodeClick(data: Org) {
  queryParams.value.orgIds = collectOrgIds(data)
  handleQuery()
}

/** 打开新增弹窗 */
function openCreateForm() {
  resetForm()
  getDeptTree()
  loadRoleOptions()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('common.noun.user')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * 后端未提供用户详情接口，直接使用列表行数据回填。
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: User) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  getDeptTree()
  loadRoleOptions()
  const current = table.value.list.find((item) => item.id === id)
  // 列表中已找不到该记录时直接返回，避免打开空表单
  if (!current) return
  formState.value.form = { ...current }
  formState.value.visible = true
  formState.value.title = t('common.titleEdit', [t('common.noun.user')])
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    // 后端 update 会自动维护 update_time，回传联查/时间字段会导致绑定失败
    const submitData: User = { ...formState.value.form }
    delete submitData.addTime
    delete submitData.updateTime
    delete submitData.orgName
    delete submitData.roleNames
    submitData.orgId = submitData.orgId || 0
    const isEdit = formState.value.form.id != null
    const request = isEdit ? userApi.update(submitData) : userApi.add(submitData)
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
 * 删除用户（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeUser(row?: User) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  // 单条确认展示用户账号（回退主键），批量确认展示条数
  const confirmText = row
    ? t('authz.user.confirmDelete', [row.username ?? String(row.id)])
    : t('authz.user.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => userApi.delete(ids))
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
 * 重置密码：输入新密码后通过 update 接口提交 id + password，并带上其余字段避免被覆盖为空
 *
 * @param row 用户行数据
 */
function handleResetPwd(row: User) {
  ElMessageBox.prompt(t('authz.user.resetPwdPrompt', [row.username ?? String(row.id)]), t('authz.user.resetPwd'), {
    confirmButtonText: t('modal.confirmButton'),
    cancelButtonText: t('modal.cancelButton'),
    closeOnClickModal: false,
    inputValidator: (value) => {
      if (!value) return t('common.requiredMsg', [t('auth.login.password')])
      if (value.length < 4 || value.length > 20) return t('authz.user.passwordLength')
      return true
    }
  })
    .then(({ value }) => {
      const submitData: User = { ...row, password: value }
      delete submitData.addTime
      delete submitData.updateTime
      delete submitData.orgName
      delete submitData.roleNames
      return userApi.update(submitData).then(() => {
        modal.msgSuccess(t('authz.user.updatePwdSuccess', [value]))
      })
    })
    .catch(() => {})
}

/**
 * 用户状态快速切换：提交完整行数据，避免其余字段被覆盖
 *
 * @param row 用户行数据
 */
function handleStatusChange(row: User) {
  const text = Number(row.status) === 0 ? t('common.normal') : t('common.disabled')
  const submitData: User = { ...row, status: Number(row.status) }
  delete submitData.addTime
  delete submitData.updateTime
  delete submitData.orgName
  delete submitData.roleNames
  userApi
    .update(submitData)
    .then(() => {
      modal.msgSuccess(t('authz.user.statusChangeSuccess', [text]))
    })
    .catch(() => {
      // 失败时回滚开关状态，保持与服务端一致
      row.status = Number(row.status) === 0 ? 1 : 0
    })
}

/**
 * 打开用户详情抽屉
 *
 * @param row 用户行数据
 */
function handleViewData(row: User) {
  userViewRef.value?.open(row)
}

// ---------------------- 页面初始化 ----------------------

getDeptTree()
getList()
</script>

<style scoped>
/* 操作列：下拉容器与相邻按钮垂直对齐，保持同一水平线 */
:deep(.el-dropdown) {
  vertical-align: middle;
}
</style>
