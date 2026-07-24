<!--
  页面：Help（帮助中心）
  功能：显示 GitHub 地址、Star 数、帮助文档链接
-->
<template>
  <div class="app-container help">

    <el-card>
      <h2>{{ title }}</h2>
      <p>
        XXL-BOOT 是一个快速开发平台，易学易用、简化开发、丰富扩展、开箱即用。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。
      </p>

      <p>
        <!-- GitHub -->
        <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('https://github.com/xuxueli/xxl-boot')"
        >访问GitHub
        </el-button>

        <!-- 帮助文档 -->
        <el-button
            icon="HomeFilled"
            plain
            @click="goTarget('https://www.xuxueli.com/xxl-boot/')"
        >帮助文档
        </el-button>

        <!-- icon -->
        &nbsp;&nbsp;｜&nbsp;&nbsp;
        <iframe src="https://ghbtns.com/github-btn.html?user=xuxueli&repo=xxl-boot&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px" style="margin-bottom:-5px;"></iframe>
        <br><br>

      </p>

      <el-divider class="divider" />
      <p>
        Powered by XXL-BOOT v{{ version }}

        <span style="float: right">
          Copyright © 2015- {{ new Date().getFullYear() }}
          &nbsp;
          <a href="https://www.xuxueli.com/" target="_blank" >xuxueli</a>
          &nbsp;
          <a href="https://github.com/xuxueli/xxl-boot" target="_blank" >github</a>
        </span>
      </p>

    </el-card>
  </div>
</template>

<script setup>
// 引入
import defaultSettings from '@/settings'

const title = defaultSettings.title           // 系统标题
const version = defaultSettings.version       // 版本号

/** 跳转外部链接 */
function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style>
.help{

  h2 {
    margin-top: 10px;
    font-weight: 200;
  }

  p {
    margin-top: 10px;
    font-weight: normal;
    font-size: 13px;
    color: #676a6c;

    b {
      font-weight: 700;
    }
  }

  a {
    color: #00afff;
    text-decoration: auto;
  }

}

.divider {
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
