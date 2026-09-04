<!--
  页面：301（无权限）
  功能：提示用户无访问权限，提供返回上一页或回首页入口
-->
<template>
  <div class="errPage-container">
    <!-- 返回按钮 -->
    <el-button icon="ArrowLeft" class="pan-back-btn" @click="back"> {{ t('error.back') }} </el-button>

    <el-row>
      <!-- 提示信息 -->
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">{{ t('error.errTitle') }}</h1>
        <h2>{{ t('error.noPermission') }}</h2>
        <h6>{{ t('error.noPermissionTip') }}</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/"> {{ t('error.backHome') }} </router-link>
          </li>
        </ul>
      </el-col>

      <!-- 插画 -->
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 引入
import errImage from '@/assets/images/301.gif'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/i18n'

const route = useRoute() // 路由数据
const router = useRouter() // 路由操作

// 301 动图（加时间戳防缓存）
const errGif = ref(errImage + '?' + +new Date())

/** 返回上一页或首页 */
function back() {
  if (route.query.noGoBack) {
    // 标记不回退时跳转首页
    router.push({ path: '/' })
  } else {
    router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
