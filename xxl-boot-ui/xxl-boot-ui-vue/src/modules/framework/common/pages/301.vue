<!--
  301（无权限）
  功能：提示用户无访问权限，提供返回上一页或回首页入口
  @author xuxueli 2026-11-22
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

      <!-- 插画（装饰性图片，alt 留空避免朗读冗余） -->
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import errImage from '@/assets/images/301.gif'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/i18n'

const route = useRoute()
const router = useRouter()

// 301 动图追加时间戳，规避浏览器缓存
const errGif = `${errImage}?${Date.now()}`

/**
 * 返回上一页；命中 noGoBack 标记时改为回到首页，避免回退形成循环
 */
function back() {
  // 命中 noGoBack 标记时不回退，避免再次进入无权限页
  if (route.query.noGoBack) {
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
