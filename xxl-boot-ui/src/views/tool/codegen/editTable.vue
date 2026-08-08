<!--
  组件：代码生成编辑弹框
  功能：修改已导入表的配置信息（基本信息 + 生成信息 + 字段配置）
-->
<template>
  <el-dialog v-model="visible" title="修改生成配置" width="90%" top="3vh" append-to-body destroy-on-close>
    <el-tabs v-model="activeName">

      <!-- TAB1：配置信息（基本信息 + 生成信息） -->
      <el-tab-pane label="配置信息" name="basic">

        <!-- 基本信息 -->
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">基本信息</h4>
        <el-form ref="basicFormRef" :model="info" :rules="basicRules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="表名称" prop="tableName">
                <el-input placeholder="请输入表名称" v-model="info.tableName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表描述" prop="tableComment">
                <el-input placeholder="请输入表描述" v-model="info.tableComment"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider style="margin: 8px 0;"/>

        <!-- 生成信息 -->
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">生成信息</h4>
        <el-form ref="genFormRef" :model="info" :rules="genRules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="生成包路径" prop="packageName">
                <el-input v-model="info.packageName" placeholder="com.xxl.boot.api.business"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生成模块名" prop="moduleName">
                <el-input v-model="info.moduleName" placeholder="system"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生成业务名" prop="businessName">
                <el-input v-model="info.businessName" placeholder="User"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生成功能名" prop="functionName">
                <el-input v-model="info.functionName" placeholder="用户管理"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生成功能作者" prop="functionAuthor">
                <el-input v-model="info.functionAuthor" placeholder="xxl-boot"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表单布局" prop="formColNum">
                <el-select v-model="info.formColNum">
                  <el-option label="单列" :value="1"/>
                  <el-option label="双列" :value="2"/>
                  <el-option label="三列" :value="3"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用的模板" prop="tplCategory">
                <el-select v-model="info.tplCategory">
                  <el-option label="单表（增删改查）" value="crud"/>
                  <el-option label="树表（增删改查）" value="tree"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端模板类型" prop="tplWebType">
                <el-select v-model="info.tplWebType">
                  <el-option label="Element Plus" value="element-plus"/>
                  <el-option label="Element Plus + TypeScript" value="element-plus-typescript"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" v-model="info.remark"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- TAB2：字段信息 -->
      <el-tab-pane label="字段信息" name="columnInfo">
        <!-- 拖拽区域 -->
        <el-table ref="dragTableRef" :data="columns" row-key="id" max-height="420">
          <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag"/>
          <el-table-column label="字段列名" prop="columnName" min-width="10%" :show-overflow-tooltip="true"
                           class-name="allowDrag"/>
          <el-table-column label="字段描述" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Java类型" min-width="11%">
            <template #default="scope">
              <el-select v-model="scope.row.javaType">
                <el-option label="Long" value="Long"/>
                <el-option label="String" value="String"/>
                <el-option label="Integer" value="Integer"/>
                <el-option label="Double" value="Double"/>
                <el-option label="BigDecimal" value="BigDecimal"/>
                <el-option label="Date" value="Date"/>
                <el-option label="Boolean" value="Boolean"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="java属性" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.javaField"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="插入" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isInsert"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isEdit"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isList"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isQuery"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template #default="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ"/>
                <el-option label="!=" value="NE"/>
                <el-option label=">" value="GT"/>
                <el-option label=">=" value="GTE"/>
                <el-option label="<" value="LT"/>
                <el-option label="<=" value="LTE"/>
                <el-option label="LIKE" value="LIKE"/>
                <el-option label="BETWEEN" value="BETWEEN"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isRequired"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option label="文本框" value="input"/>
                <el-option label="文本域" value="textarea"/>
                <el-option label="下拉框" value="select"/>
                <el-option label="单选框" value="radio"/>
                <el-option label="复选框" value="checkbox"/>
                <el-option label="日期控件" value="datetime"/>
                <el-option label="图片上传" value="imageUpload"/>
                <el-option label="文件上传" value="fileUpload"/>
                <el-option label="富文本控件" value="editor"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                <el-option v-for="dict in dictOptions" :key="dict.dictType" :label="dict.dictName"
                           :value="dict.dictType">
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </template>

  </el-dialog>
</template>

<script setup lang="ts" name="GenEdit">
import {getGenTable, updateGenTable} from "@/api/tool/codegen"
import {queryDictList} from "@/api/system/dict/type"
import type { FormInstance } from 'element-plus'
import modal from '@/utils/modal'
import Sortable from 'sortablejs'

/* 组件回调 */
const emit = defineEmits(["ok"])          /* 提交成功后通知父组件刷新列表 */

/* 表单 ref */
const basicFormRef = ref<FormInstance>()             /* 基本信息表单 */
const genFormRef = ref<FormInstance>()               /* 生成信息表单 */

/* 状态变量 */
const activeName = ref("basic")            /* 当前 TAB */
const columns = ref<any[]>([])                    /* 字段列表 */
const dictOptions = ref<any[]>([])                /* 字典类型选项 */
const info = ref<Record<string, any>>({})          /* 表配置信息 */
const visible = ref(false)                 /* 弹框显隐 */
const tableId = ref(0)                     /* 当前编辑的表 ID */
const dragTableRef = ref<any>(null)        /* 字段表格 ref，用于拖拽排序 */

/** 基本信息 - 表单校验规则 */
const basicRules = {
  tableName: [{required: true, message: "请输入表名称", trigger: "blur"}]
}

/** 生成信息 - 表单校验规则 */
const genRules = {
  packageName: [{required: true, message: "请输入生成包路径", trigger: "blur"}],
  moduleName: [{required: true, message: "请输入生成模块名", trigger: "blur"}],
  businessName: [{required: true, message: "请输入生成业务名", trigger: "blur"}],
  functionName: [{required: true, message: "请输入生成功能名", trigger: "blur"}]
}

/**
 * 打开编辑弹框 （暴露 组件方法）
 * @param {number} id 表编码
 */
function open(id: number) {
  tableId.value = id
  activeName.value = "basic"
  info.value = {formColNum: 1, tplWebType: 'element-plus'}
  visible.value = true

  /* 加载表配置 + 字段列表 */
  getGenTable(id).then(res => {
    const {fieldList, ...rest} = (res.data || {}) as {fieldList?: any[]; [key: string]: any}
    info.value = {formColNum: 1, tplWebType: 'element-plus', ...rest}
    columns.value = fieldList || []
    /* 校验默认值是否在可选范围内 */
    if (![1, 2, 3].includes(info.value.formColNum)) info.value.formColNum = 1
    if (!['element-plus', 'element-plus-typescript'].includes(info.value.tplWebType)) info.value.tplWebType = 'element-plus'
  })

  /* 加载字典类型下拉 */
  queryDictList().then(response => {
    dictOptions.value = response.data || []
  })
}

/** 提交保存 */
function submitForm() {
  /* 校验两个表单 */
  Promise.all([basicFormRef.value!.validate(), genFormRef.value!.validate()]).then(res => {
    if (res.every(Boolean)) {
      const genTable = Object.assign({}, info.value)
      genTable.fieldList = columns.value
      updateGenTable(genTable).then(res => {
        if (res.code === 200) {
          modal.msgSuccess(res.msg)
          visible.value = false
          emit("ok")
        }
      })
    } else {
      modal.msgError("表单校验未通过，请重新检查提交内容")
    }
  })
}

/** 拖拽排序：切换到字段信息 tab 时初始化，确保 DOM 已渲染 */
watch(activeName, (name) => {
  if (name !== 'columnInfo' || !columns.value || columns.value.length === 0) return
  nextTick(() => {
    const tbody = dragTableRef.value?.$el?.querySelector('tbody') as HTMLElement | null
    if (!tbody || (tbody as any).__sortable) return
    ;(tbody as any).__sortable = Sortable.create(tbody, {
      handle: '.allowDrag',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onStart: () => document.onselectstart = () => false,
      onEnd: (evt) => {
        document.onselectstart = null
        const item = columns.value.splice(evt.oldIndex!, 1)[0]
        columns.value.splice(evt.newIndex!, 0, item)
        columns.value.forEach((c, i) => c.sort = i + 1)
      }
    })
  })
})

defineExpose({open})
</script>

<style scoped>
:deep(.sortable-ghost) {
  opacity: 0.3;
}

:deep(.sortable-chosen) {
  background: #f5f7fa;
}
</style>
