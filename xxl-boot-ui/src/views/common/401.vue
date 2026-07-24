<!--
  页面：401（无权限）
  功能：提示用户无访问权限，提供返回上一页或回首页入口
-->
<template>
  <div class="errPage-container">

    <!-- 返回按钮 -->
    <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>

    <el-row>
      <!-- 提示信息 -->
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          401错误!
        </h1>
        <h2>您没有访问权限！</h2>
        <h6>对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/">
              回首页
            </router-link>
          </li>
        </ul>
      </el-col>

      <!-- 插画 -->
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
// 引入
import errImage from "@/assets/images/401.gif"

const route = useRoute()      // 路由数据
const router = useRouter()    // 路由操作

// 401 动图（加时间戳防缓存）
const errGif = ref(errImage + "?" + +new Date())

/** 返回上一页或首页 */
function back() {
  if (route.query.noGoBack) {
    // 标记不回退时跳转首页
    router.push({ path: "/" })
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
