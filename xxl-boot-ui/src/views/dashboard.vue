<!--
  页面：Dashboard（首页）
  功能：系统简介、更新日志
-->
<template>
  <div class="app-container home">

    <el-row :gutter="20">
      <!-- 系统简介 -->
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Boot后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了Boot管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
              type="primary"
              :icon="Cloudy"
              plain
              @click="goTarget('https://gitee.com/boot/boot')"
          >访问码云
          </el-button
          >
          <el-button
              :icon="HomeFilled"
              plain
              @click="goTarget('http://boot.vip')"
          >访问主页
          </el-button
          >
        </p>
      </el-col>

      <!-- 技术选型 -->
      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-divider/>

    <el-row :gutter="20">

      <!-- 常用功能 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="16">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>常用功能</span>
            </div>
          </template>
          <el-collapse accordion>
            <el-collapse-item title="组织管理">
              <ol>
                <li>针对组织、用户、角色及资源等进行管理，支持灵活的人员角色、菜单权限、人员授权等操作管理。</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="系统管理">
              <ol>
                <li>提供站内消息、审计日志、字典管理、审计日志等相关能力，支持高校灵活进行系统监控及管理。</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="系统工具">
              <ol>
                <li>提供前后端一站式代码生成工具、前端表单在线构建工具等，辅助快速进行敏捷迭代开发。</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="帮助中心">
              <ol>
                <li>提供内容丰富、干练易懂的操作文档，辅助快速上手项目。</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>

      <!-- 联系信息 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>联系信息</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：
              http://www.boot.vip
            </p>
            <p>
              <i class="el-icon-user-solid"></i> 社区群：111111、111111、111111
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
            </p>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>


<script setup name="Index">

// 引入
import {Cloudy, HomeFilled} from '@element-plus/icons-vue'

const version = ref('3.9.2')        // 版本号

/** 跳转外部链接 */
function goTarget(url) {
  window.open(url, '__blank')
}
</script>


<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

