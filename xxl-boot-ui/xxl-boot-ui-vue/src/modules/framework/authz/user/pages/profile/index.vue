<!--
  Profile（个人中心）
  功能：展示个人信息，并提供基本资料/修改密码页签切换
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <!-- 个人信息 -->
        <el-card class="box-card">
          <template #header>
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
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="phone" />
                {{ t('authz.user.phoneNumber') }}
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="email" />
                {{ t('authz.user.emailLabel') }}
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="tree" />
                {{ t('authz.user.dept') }}
                <div class="pull-right">{{ user.orgName }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="peoples" />
                {{ t('authz.user.roleLabel') }}
                <div class="pull-right">{{ roleNames }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="date" />
                {{ t('authz.user.createDate') }}
                <div class="pull-right">{{ user.addTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 基本资料 / 修改密码 -->
      <el-col :span="18" :xs="24">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>{{ t('authz.user.basicInfo') }}</span>
            </div>
          </template>
          <el-tabs v-model="selectedTab">
            <!-- 基本资料 -->
            <el-tab-pane :label="t('authz.user.basicInfo')" name="userinfo">
              <UserInfo :user="user" />
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane :label="t('authz.user.modifyPassword')" name="resetPwd">
              <ResetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Profile' })
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '@/i18n'
import { SvgIcon } from '@/components'
import UserInfo from './userInfo.vue'
import ResetPwd from './resetPwd.vue'
import { userApi } from '../../api'
import type { User } from '../../types'

const route = useRoute() /* 路由 */
const selectedTab = ref('userinfo') /* 当前选中的页签 */
const user = ref<User>({}) /* 当前登录用户信息 */
const roleNames = ref('') /* 角色名称列表（逗号拼接） */

/** 获取当前登录用户个人信息 */
function getUser() {
  userApi
    .loadProfile()
    .then((response) => {
      user.value = response.data
      roleNames.value = (user.value.roleNames ?? []).join(', ')
    })
    .catch(() => {})
}

// 页面初始化：按路由参数激活页签，并加载用户信息
onMounted(() => {
  const activeTab = route.params.activeTab
  if (activeTab) {
    selectedTab.value = String(activeTab)
  }
  getUser()
})
</script>
