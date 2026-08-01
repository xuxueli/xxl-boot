<!--
  页面：Dict（字典管理）
  功能：查询、新增、修改、删除字典类型，查看字典项
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字典名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典Type" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入字典Type"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 200px">
          <el-option label="全部" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasRole="['admin']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasRole="['admin']">删除</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 字典类型列表 -->
    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="字典名称" align="center" prop="name" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="字典Type" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <a class="link-type" style="cursor:pointer" @click="handleViewData(scope.row)">{{ scope.row.type }}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="新增时间" align="center" prop="addTime" width="170" />
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']">修改</el-button>
          <el-button link type="primary" icon="Operation" @click="handleDataList(scope.row)" v-hasRole="['admin']">列表</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dictRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典Type" prop="type">
          <el-input v-model="form.type" placeholder="请输入字典Type" :disabled="form.id != undefined" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <DictDataDrawer v-model:visible="drawerVisible" :row="drawerRow" />
  </div>
</template>

<script setup name="Dict">
import DictDataDrawer from './detail'
import { listType, getType, delType, addType, updateType } from "@/api/system/dict/type"
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import tab from '@/utils/tab'

const resetForm = useFormReset()

const dictRef = ref(null)     /* 表单 ref */

const typeList = ref([])      /* 字典类型列表 */
const open = ref(false)       /* 对话框显隐 */
const loading = ref(true)     /* 加载状态 */
const showSearch = ref(true)  /* 是否显示搜索栏 */
const ids = ref([])           /* 选中行 ID 数组 */
const single = ref(true)      /* 是否单选 */
const multiple = ref(true)    /* 是否多选 */
const total = ref(0)          /* 总条数 */
const title = ref("")         /* 对话框标题 */
const drawerVisible = ref(false)  /* 字典项抽屉显隐 */
const drawerRow = ref({})     /* 当前查看的字典行 */

// 状态选项（0-正常、1-停用）
const statusOptions = [
  { label: '正常', value: 0 },
  { label: '停用', value: 1 }
]

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,        /* 当前页码 */
    pageSize: 10,      /* 每页条数 */
    name: undefined,   /* 字典名称 */
    type: undefined,   /* 字典Type */
    status: -1         /* 状态（-1 全部、0 正常、1 停用） */
  },
  rules: {
    name: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
    type: [
      { required: true, message: "字典Type不能为空", trigger: "blur" },
      { pattern: /^[a-z][a-zA-Z0-9]*$/, message: "以小写字母开头，由字母和数字组成", trigger: "blur" },
      { min: 2, max: 100, message: "长度需在2-100之间", trigger: "blur" }
    ]
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询字典类型列表 */
function getList() {
  loading.value = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  listType(params).then(response => {
    typeList.value = response.data.data
    total.value = response.data.total
    loading.value = false
  })
}

/** 状态编码 → 文案 */
function statusText(status) {
  const item = statusOptions.find(i => i.value === status)
  return item ? item.label : status
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
    name: undefined,
    type: undefined,
    status: 0,
    remark: undefined
  }
  resetForm("dictRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "新增字典"
}

/** 字典项抽屉 */
function handleViewData(row) {
  drawerRow.value = row
  drawerVisible.value = true
}

/** 字典数据列表页面 */
function handleDataList(row) {
  tab.openPage("字典数据", '/system/dict/data', { dictId: row.id })
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row && row.id != null ? row.id : ids.value[0]
  if (id == null) {
    return
  }
  getType(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改字典"
  })
}

/** 提交按钮 */
function submitForm() {
  dictRef.value.validate(valid => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (form.value.id != undefined) {
        updateType(form.value).then(response => {
          modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addType(form.value).then(response => {
          modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row) {
  const dictIds = row && row.id != null ? row.id : ids.value
  if (dictIds == null || (Array.isArray(dictIds) && dictIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function() {
    return delType(dictIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

// 页面初始化加载字典类型列表
getList()
</script>
