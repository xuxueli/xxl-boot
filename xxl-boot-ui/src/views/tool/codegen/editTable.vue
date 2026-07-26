<template>
  <el-dialog v-model="visible" title="修改生成配置" width="90%" top="3vh" append-to-body destroy-on-close>
    <el-tabs v-model="activeName">
      <el-tab-pane label="配置信息" name="basic">
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">基本信息</h4>
        <basic-info-form ref="basicInfo" :info="info" />
        <el-divider style="margin: 8px 0;" />
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">生成信息</h4>
        <gen-info-form ref="genInfo" :info="info" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="columnInfo">
        <el-table ref="dragTable" :data="columns" row-key="columnId" max-height="420">
          <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag"/>
          <el-table-column label="字段列名" prop="columnName" min-width="10%" :show-overflow-tooltip="true" class-name="allowDrag"/>
          <el-table-column label="字段描述" min-width="10%">
            <template #default="scope"><el-input v-model="scope.row.columnComment"></el-input></template>
          </el-table-column>
          <el-table-column label="Java类型" min-width="11%">
            <template #default="scope">
              <el-select v-model="scope.row.javaType">
                <el-option label="Long" value="Long" /><el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" /><el-option label="Double" value="Double" />
                <el-option label="BigDecimal" value="BigDecimal" /><el-option label="Date" value="Date" />
                <el-option label="Boolean" value="Boolean" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="java属性" min-width="10%">
            <template #default="scope"><el-input v-model="scope.row.javaField"></el-input></template>
          </el-table-column>
          <el-table-column label="插入" min-width="5%">
            <template #default="scope"><el-checkbox true-value="1" false-value="0" v-model="scope.row.isInsert"></el-checkbox></template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template #default="scope"><el-checkbox true-value="1" false-value="0" v-model="scope.row.isEdit"></el-checkbox></template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template #default="scope"><el-checkbox true-value="1" false-value="0" v-model="scope.row.isList"></el-checkbox></template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template #default="scope"><el-checkbox true-value="1" false-value="0" v-model="scope.row.isQuery"></el-checkbox></template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template #default="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ" /><el-option label="!=" value="NE" />
                <el-option label=">" value="GT" /><el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" /><el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" /><el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template #default="scope"><el-checkbox true-value="1" false-value="0" v-model="scope.row.isRequired"></el-checkbox></template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option label="文本框" value="input" /><el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" /><el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" /><el-option label="日期控件" value="datetime" />
                <el-option label="图片上传" value="imageUpload" /><el-option label="文件上传" value="fileUpload" />
                <el-option label="富文本控件" value="editor" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                <el-option v-for="dict in dictOptions" :key="dict.dictType" :label="dict.dictName" :value="dict.dictType">
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="GenEdit">
import { getGenTable, updateGenTable } from "@/api/tool/codegen"
import { optionselect as getDictOptionselect } from "@/api/system/dict/type"
import modal from '@/utils/modal'
import basicInfoForm from "./basicInfoForm"
import genInfoForm from "./genInfoForm"
import Sortable from 'sortablejs'

const emit = defineEmits(["ok"])
const basicInfo = ref(null)
const genInfo = ref(null)

const activeName = ref("basic")
const columns = ref([])
const dictOptions = ref([])
const info = ref({})
const visible = ref(false)
const tableId = ref(0)

function open(id) {
  tableId.value = id
  activeName.value = "basic"
  info.value = {formColNum: 1, tplWebType: 'element-plus'}
  visible.value = true
  getGenTable(id).then(res => {
    const defaults = {formColNum: 1, tplWebType: 'element-plus'}
    info.value = Object.assign(defaults, res.data || {})
    columns.value = info.value.fieldList || []
    delete info.value.fieldList
    if (![1, 2, 3].includes(info.value.formColNum)) info.value.formColNum = 1
    if (!['element-plus', 'element-plus-typescript'].includes(info.value.tplWebType)) info.value.tplWebType = 'element-plus'
  })
  getDictOptionselect().then(response => {
    dictOptions.value = response.data || []
  })
}

function submitForm() {
  const basicForm = basicInfo.value.$refs.basicInfoForm
  const genForm = genInfo.value.$refs.genInfoForm
  Promise.all([basicForm, genForm].map(f => new Promise(r => f.validate(v => r(v))))).then(res => {
    if (res.every(Boolean)) {
      const genTable = Object.assign({}, info.value)
      genTable.fieldList = columns.value
      updateGenTable(genTable).then(res => {
        modal.msgSuccess(res.msg)
        if (res.code === 200) {
          visible.value = false
          emit("ok")
        }
      })
    } else {
      modal.msgError("表单校验未通过，请重新检查提交内容")
    }
  })
}

// 字段拖拽排序
watch(columns, (val) => {
  if (!val || val.length === 0) return
  nextTick(() => {
    const el = document.querySelector('.el-table__body > tbody')
    if (!el) return
    Sortable.create(el, {
      handle: ".allowDrag",
      onEnd: (evt) => {
        const targetRow = columns.value.splice(evt.oldIndex, 1)[0]
        columns.value.splice(evt.newIndex, 0, targetRow)
        for (const i in columns.value) columns.value[i].sort = parseInt(i) + 1
      }
    })
  })
}, { once: true })

defineExpose({ open })
</script>
