<!--
  页面：Profile（个人中心）
  功能：展示个人信息与基本资料/修改密码 tab 切换
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <!-- 个人信息 -->
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>{{ t('authz.user.personalInfo') }}</span>
            </div>
          </template>

          <div>
            <!-- 用户信息列表 -->
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <SvgIcon icon-class="user" />
                {{ t('authz.user.account') }}
                <div class="pull-right">{{ state.user.username }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="phone" />
                {{ t('authz.user.phoneNumber') }}
                <div class="pull-right">{{ state.user.phone }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="email" />
                {{ t('authz.user.emailLabel') }}
                <div class="pull-right">{{ state.user.email }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="tree" />
                {{ t('authz.user.dept') }}
                <div class="pull-right">{{ state.user.orgName }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="peoples" />
                {{ t('authz.user.roleLabel') }}
                <div class="pull-right">{{ state.roleNames }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="date" />
                {{ t('authz.user.createDate') }}
                <div class="pull-right">{{ state.user.addTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 基本资料 / 修改密码 -->
      <el-col :span="18" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>{{ t('authz.user.basicInfo') }}</span>
            </div>
          </template>
          <el-tabs v-model="selectedTab">
            <!-- 基本资料 -->
            <el-tab-pane :label="t('authz.user.basicInfo')" name="userinfo">
              <userInfo :user="state.user" />
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane :label="t('authz.user.modifyPassword')" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Profile' })
// 引入
import { t } from '@/i18n'
import userInfo from './userInfo.vue'
import resetPwd from './resetPwd.vue'
import { getUserProfile } from '../../api'
import type { User } from '../../types'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SvgIcon } from '@/components'

const route = useRoute() // 路由
const selectedTab = ref('userinfo') // 当前选中的 tab
const state = reactive<{
  // 用户信息、角色数据
  user: User
  roleNames: string
}>({
  user: {}, // 用户信息
  roleNames: '' // 角色名称列表
})

/** 获取当前登录用户个人信息 */
function getUser() {
  getUserProfile().then((res) => {
    state.user = res.data
    state.roleNames = ((state.user.roleNames as string[]) || []).join(', ')
  })
}

// 初始化：根据路由参数激活 tab，并加载用户信息
onMounted(() => {
  const activeTab = route.params && route.params.activeTab
  if (activeTab) {
    selectedTab.value = activeTab as string
  }
  getUser()
})
</script>
