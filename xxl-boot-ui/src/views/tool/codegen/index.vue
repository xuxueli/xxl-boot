<template>
  <div class="app-container">

    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">

      <!-- 表名称 -->
      <el-form-item label="表名称" prop="tableName">
        <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <!-- 表描述 -->
      <el-form-item label="表描述" prop="tableComment">
        <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="openCreateTable"
        >创建
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleEditTable"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Download"
            :disabled="multiple"
            @click="handleGenTable"
        >生成
        </el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 表格区域 -->
    <el-table ref="genRef" v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true"/>
      <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="addTime" width="160"/>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="160"/>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleEditTable(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="预览" placement="top">
            <el-button link type="primary" icon="View" @click="handlePreview(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="生成代码" placement="top">
            <el-button link type="primary" icon="Download" @click="handleGenTable(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 预览界面 -->
    <el-dialog :title="preview.title" v-model="preview.open" width="80%" top="5vh" append-to-body class="scrollbar">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
            v-for="(value, key) in preview.data"
            :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
            :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
            :key="value"
        >
          <el-link underline="never" icon="DocumentCopy" v-copyText="value" v-copyText:callback="copyTextSuccess"
                   style="float:right">&nbsp;复制
          </el-link>
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--  创建表弹窗  -->
    <el-dialog v-model="createVisible" title="创建表" width="800px" top="5vh" append-to-body>
      <span>创建表语句(支持多个建表语句)：</span>
      <el-input type="textarea" :rows="10" placeholder="请输入文本" v-model="createContent"></el-input>
      <template #footer>
        <el-button type="primary" @click="handleCreateTable">确 定</el-button>
        <el-button @click="createVisible = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 编辑代码生成信息 -->
    <editTable ref="editRef" @ok="handleQuery"/>

  </div>
</template>

<script setup name="Gen">
import {listTable, previewTable, delTable, createTable} from "@/api/tool/codegen"
import {useFormReset} from '@/composables/useFormReset'
import modal from '@/utils/modal'
import downloadPlugin from '@/utils/download'
import editTable from "./editTable"

const route = useRoute()
const resetForm = useFormReset()
const createVisible = ref(false)
const createContent = ref("")
const editRef = ref(null)
const genRef = ref(null)

const tableList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const tableNames = ref([])
const uniqueId = ref("")

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tableName: undefined,
    tableComment: undefined
  },
  preview: {
    open: false,
    title: "代码预览",
    data: {},
    activeName: "domain.java"
  }
})

const {queryParams, preview} = toRefs(data)

onActivated(() => {
  const time = route.query.t
  if (time != null && time !== uniqueId.value) {
    uniqueId.value = time
    queryParams.value.pageNum = Number(route.query.pageNum)
    resetForm("queryForm")
    getList()
  }
})

/** 查询表集合 */
function getList() {
  loading.value = true
  listTable(queryParams.value).then(response => {
    tableList.value = response.data.data
    total.value = response.data.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 生成代码操作 */
function handleGenTable(row) {
  const tbNames = row.tableName || tableNames.value
  if (!tbNames || (Array.isArray(tbNames) && tbNames.length === 0)) {
    modal.msgError("请选择要生成的数据")
    return
  }
  const names = Array.isArray(tbNames) ? tbNames : [tbNames]
  const zipName = names.length > 1 ? "boot.zip" : names[0] + ".zip"
  downloadPlugin.zip("/tool/codegen/batchGenCode?tables=" + names.map(encodeURIComponent).join(","), zipName)
}

/** 打开创建表弹窗 */
function openCreateTable() {
  createContent.value = ""
  createVisible.value = true
}

/** 创建表 */
function handleCreateTable() {
  if (createContent.value === "") {
    modal.msgError("请输入建表语句")
    return
  }
  createTable({tableSql: createContent.value}).then(() => {
    modal.msgSuccess("创建成功")
    createVisible.value = false
    handleQuery()
  })
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  queryParams.value.pageNum = 1
}

/** 预览按钮 */
function handlePreview(row) {
  previewTable(row.id).then(response => {
    preview.value.data = response.data
    preview.value.open = true
    preview.value.activeName = "domain.java"
  })
}

/** 复制代码成功 */
function copyTextSuccess() {
  modal.msgSuccess("复制成功")
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  tableNames.value = selection.map(item => item.tableName)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 修改按钮操作 */
function handleEditTable(row) {
  editRef.value.open(row.id || ids.value[0])
}

/** 删除按钮操作 */
function handleDelete(row) {
  const tableIds = row.id || ids.value
  modal.confirm('是否确认删除表编号为"' + tableIds + '"的数据项？').then(function () {
    return delTable(tableIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {
  })
}

getList()
</script>
