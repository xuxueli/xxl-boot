<!--
  Org（组织管理）
  树形展示组织，支持搜索、新增、修改、删除组织
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="组织名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入组织名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasRole="['admin']" >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 组织树列表 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="orgList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="组织名称" width="260" />
      <el-table-column prop="order" label="顺序" width="100" align="center" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']" >修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasRole="['admin']" >新增</el-button>
          <el-button v-if="scope.row.parentId !== 0" link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改组织对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="orgRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级组织" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="orgOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="选择上级组织"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序" prop="order">
              <el-input-number v-model="form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="manager">
              <el-input v-model="form.manager" placeholder="请输入负责人" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
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

<script setup name="Org">
import { listOrg, getOrg, delOrg, addOrg, updateOrg } from "@/api/org/org"
import { handleTree, parseTime } from '@/utils/common'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'

const resetForm = useFormReset()

const orgRef = ref(null)          /* 表单 ref */
const orgList = ref([])           /* 组织树列表 */
const orgOptions = ref([])        /* 上级组织树选项 */
const open = ref(false)           /* 对话框显隐 */
const loading = ref(true)         /* 加载状态 */
const showSearch = ref(true)      /* 是否显示搜索栏 */
const title = ref("")             /* 对话框标题 */
const isExpandAll = ref(true)     /* 是否展开全部 */
const refreshTable = ref(true)    /* 表格刷新开关（展开/折叠时重建） */

// 状态选项（后端 OrgStatuEnum：0-正常、1-禁用）
const statusOptions = [
  { code: 0, title: '正常' },
  { code: 1, title: '禁用' }
]

const data = reactive({
  form: {},
  queryParams: {
    name: undefined,   /* 组织名称关键词 */
    status: -1         /* 状态（-1 全部、0 正常、1 禁用） */
  },
  rules: {
    name: [{ required: true, message: "组织名称不能为空", trigger: "blur" }],
    order: [{ required: true, message: "顺序不能为空", trigger: "blur" }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询组织树列表 */
function getList() {
  loading.value = true
  listOrg(queryParams.value).then(response => {
    orgList.value = handleTree(response.data, 'id')
    loading.value = false
  })
}

/** 查询上级组织树选项（修改时排除自身及其所有子组织，避免成环） */
function loadOrgOptions(excludeId) {
  listOrg().then(response => {
    let flatList = response.data
    if (excludeId !== undefined) {
      // 收集自身及所有子组织 ID，一并排除
      const excludeIds = new Set()
      const collectIds = (item) => {
        excludeIds.add(item.id)
        if (item.children && item.children.length) {
          item.children.forEach(collectIds)
        }
      }
      const self = flatList.find(item => item.id === excludeId)
      if (self) {
        collectIds(handleTree(flatList, 'id').find(item => item.id === excludeId) || self)
      }
      flatList = flatList.filter(item => !excludeIds.has(item.id))
    }
    orgOptions.value = handleTree(flatList, 'id')
  })
}

/** 状态编码 → 文案 */
function statusText(status) {
  const item = statusOptions.find(i => i.code === status)
  return item ? item.title : status
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: 0,
    name: undefined,
    order: 0,
    status: 0,
    manager: undefined
  }
  resetForm("orgRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  handleQuery()
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 新增按钮操作（不传 row 新增顶级组织，传 row 新增下级组织） */
function handleAdd(row) {
  reset()
  loadOrgOptions()
  if (row != undefined) {
    form.value.parentId = row.id
  }
  open.value = true
  title.value = "新增组织"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  loadOrgOptions(row.id)
  getOrg(row.id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改组织"
  })
}

/** 提交按钮 */
function submitForm() {
  orgRef.value.validate(valid => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (form.value.id !== undefined) {
        updateOrg(form.value).then(response => {
          modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addOrg(form.value).then(response => {
          modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  modal.confirm('是否确认删除名称为"' + row.name + '"的数据项？').then(function() {
    return delOrg([row.id])
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

// 页面初始化：加载组织树
getList()
</script>
