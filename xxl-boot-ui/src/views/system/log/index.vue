<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="日志类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="日志类型" clearable style="width: 240px">
          <el-option label="操作日志" :value="0" />
          <el-option label="登陆日志" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统模块" prop="module">
        <el-select v-model="queryParams.module" placeholder="系统模块" clearable style="width: 240px">
          <el-option v-for="item in moduleOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="日志标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入日志标题" clearable style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <el-table ref="logRef" v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" width="80" />
      <el-table-column label="日志类型" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 0 ? 'primary' : 'warning'" size="small">
            {{ scope.row.type === 0 ? '操作日志' : scope.row.type === 1 ? '登陆日志' : scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="系统模块" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ moduleMap[scope.row.module] || scope.row.module }}
        </template>
      </el-table-column>
      <el-table-column label="日志标题" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="操作人" align="center" prop="operator" width="110" :show-overflow-tooltip="true" />
      <el-table-column label="操作IP" align="center" prop="ip" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="新增时间" align="center" prop="addTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <log-detail v-model:visible="detailVisible" :row="detailRow" />
  </div>
</template>

<script setup name="Log">
import LogDetail from './detail'
import { pageList, delOperlog } from "@/api/system/log"
import { loadEnumItem } from "@/api/system/dict/data"
import { parseTime } from '@/utils/common'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'

const resetForm = useFormReset()

const logRef = ref(null)

const logList = ref([])
const total = ref(0)
const detailVisible = ref(false)
const loading = ref(true)
const detailRow = ref({})
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const title = ref("")
const moduleOptions = ref([])
const moduleMap = ref({})
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    type: undefined,
    module: undefined,
    title: undefined
  }
})

const { queryParams, form } = toRefs(data)

function getList() {
  loading.value = true
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  pageList(params).then(response => {
    logList.value = response.data.data
    total.value = response.data.total
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  resetForm("queryRef")
  queryParams.value.pageNum = 1
  getList()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleDetail(row) {
  detailRow.value = row
  detailVisible.value = true
}

function handleDelete(row) {
  const logIds = row.id || ids.value
  modal.confirm('是否确认删除日志编号为"' + logIds + '"的数据项?').then(function () {
    return delOperlog(logIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {
  })
}

loadEnumItem('LogModuleEnum').then(data => {
  moduleOptions.value = data.data
  moduleOptions.value.forEach(item => { moduleMap.value[item.code] = item.title })
})

getList()
</script>
