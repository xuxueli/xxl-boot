<!--
  页面：DictData（字典项管理）
  功能：查询、新增、修改、删除指定字典下的字典项
-->
<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="dict-data-header">
      <span>字典名称：{{ dictName }}</span>
    </div>

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
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
      </el-col>
    </el-row>

    <!-- 字典项列表 -->
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="字典项名称" align="center" prop="itemName" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="字典项标识" align="center" prop="itemCode" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center" prop="order" width="80" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="新增时间" align="center" prop="addTime" width="170" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']">修改</el-button>
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

    <!-- 添加或修改字典项对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dataRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典项名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入字典项名称" />
        </el-form-item>
        <el-form-item label="字典项标识" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入字典项标识" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顺序" prop="order">
          <el-input-number v-model="form.order" controls-position="right" :min="0" />
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
  </div>
</template>

<script setup name="Data">
import { getType } from "@/api/system/dict/type"
import { listData, getData, delData, addData, updateData } from "@/api/system/dict/data"
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import tab from '@/utils/tab'

const resetForm = useFormReset()

const dataRef = ref(null)     /* 表单 ref */

const dataList = ref([])      /* 字典项列表 */
const open = ref(false)       /* 对话框显隐 */
const loading = ref(true)     /* 加载状态 */
const ids = ref([])           /* 选中行 ID 数组 */
const single = ref(true)      /* 是否单选 */
const multiple = ref(true)    /* 是否多选 */
const total = ref(0)          /* 总条数 */
const title = ref("")         /* 对话框标题 */
const dictName = ref("")      /* 字典名称 */

const route = useRoute()
const dictId = ref(route.query && route.query.dictId)  /* 当前字典ID（来自路由） */

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
    dictId: dictId.value  /* 字典ID */
  },
  rules: {
    itemName: [{ required: true, message: "字典项名称不能为空", trigger: "blur" }],
    itemCode: [{ required: true, message: "字典项标识不能为空", trigger: "blur" }],
    order: [{ required: true, message: "顺序不能为空", trigger: "blur" }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询当前字典名称 */
function getDictName() {
  if (dictId.value == null) {
    return
  }
  getType(dictId.value).then(response => {
    dictName.value = response.data ? response.data.name : ""
  })
}

/** 查询字典项列表 */
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
  listData(params).then(response => {
    dataList.value = response.data.data
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
    dictId: dictId.value,
    itemName: undefined,
    itemCode: undefined,
    status: 0,
    order: 0,
    remark: undefined
  }
  resetForm("dataRef")
}

/** 返回按钮操作 */
function handleClose() {
  const obj = { path: "/system/dict" }
  tab.closeOpenPage(obj)
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "新增字典项"
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row && row.id != null ? row.id : ids.value[0]
  if (id == null) {
    return
  }
  getData(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改字典项"
  })
}

/** 提交按钮 */
function submitForm() {
  dataRef.value.validate(valid => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (form.value.id != undefined) {
        updateData(form.value).then(response => {
          modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addData(form.value).then(response => {
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
  const itemIds = row && row.id != null ? row.id : ids.value
  if (itemIds == null || (Array.isArray(itemIds) && itemIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除字典项编号为"' + itemIds + '"的数据项？').then(function() {
    return delData(itemIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

// 页面初始化
getDictName()
getList()
</script>
