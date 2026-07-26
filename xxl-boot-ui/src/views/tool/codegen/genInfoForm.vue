<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="生成包路径" prop="packageName">
          <el-input v-model="info.packageName" placeholder="com.xxl.boot.api.business" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生成模块名" prop="moduleName">
          <el-input v-model="info.moduleName" placeholder="system" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生成业务名" prop="businessName">
          <el-input v-model="info.businessName" placeholder="User" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生成功能名" prop="functionName">
          <el-input v-model="info.functionName" placeholder="用户管理" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生成功能作者" prop="functionAuthor">
          <el-input v-model="info.functionAuthor" placeholder="xxl-boot" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表单布局" prop="formColNum">
          <el-select v-model="info.formColNum">
            <el-option label="单列" :value="1" />
            <el-option label="双列" :value="2" />
            <el-option label="三列" :value="3" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="使用的模板" prop="tplCategory">
          <el-select v-model="info.tplCategory">
            <el-option label="单表（增删改查）" value="crud" />
            <el-option label="树表（增删改查）" value="tree" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="前端模板类型" prop="tplWebType">
          <el-select v-model="info.tplWebType">
            <el-option label="Element Plus" value="element-plus" />
            <el-option label="Element Plus + TypeScript" value="element-plus-typescript" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
const props = defineProps({
  info: { type: Object, default: () => ({}) }
})

const rules = ref({
  packageName: [{ required: true, message: "请输入生成包路径", trigger: "blur" }],
  moduleName: [{ required: true, message: "请输入生成模块名", trigger: "blur" }],
  businessName: [{ required: true, message: "请输入生成业务名", trigger: "blur" }],
  functionName: [{ required: true, message: "请输入生成功能名", trigger: "blur" }]
})
</script>
