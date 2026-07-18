<!--
  组件：AppMain（主内容区）
  功能：路由页面渲染容器，含 keep-alive 缓存、过渡动画、底部版权
-->
<template>
  <!-- 主内容区容器 -->
  <section class="app-main">
    <!--
      v-slot 解构出 Component（当前路由组件对象）和 route（当前路由信息）。
      不直接写 <router-view /> 是为了手动控制 transition + keep-alive 的行为。
    -->
    <router-view v-slot="{ Component, route }">
      <!--
        fade-transform：0.3s 透明度 + 水平位移的过渡动画。
        mode="out-in"：旧组件完全离开后再挂载新组件，避免同时两个组件在 DOM 中。
      -->
      <transition name="fade-transform" mode="out-in">
        <!--
          keep-alive：缓存已打开的页面，切换 tab 时不销毁组件实例，保留滚动位置/输入状态。
          include 绑定 tagsViewStore.cachedViews，只有该数组中列出的组件名才被缓存，不在其中的（如不需要缓存的页面）每次进入都重新创建。

          内部的 Component 由 vue-router 解析出的当前路由组件对象，is 指令动态渲染。
          :key="route.path" 以路由路径作为 key，切换时强制重建组件（即使 Component 引用没变），
          解决同一组件不同参数（如 /user/1 vs /user/2）不刷新的问题。
        -->
        <keep-alive :include="tagsViewStore.cachedViews">
          <component :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
    <!--
      底部版权组件：放在 router-view 外部，版权始终存在，不随路由切换销毁重建。
    -->
    <Copyright />
  </section>
</template>


<script setup>
import Copyright from './Copyright.vue'
import { useTagsViewStore } from '@/store'

const tagsViewStore = useTagsViewStore()
</script>


<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* 固定 header 时，app-main 自身滚动 */
.fixed-header + .app-main {
  overflow-y: auto;
  scrollbar-gutter: auto;
  height: calc(100vh - 50px);
  min-height: 0px;
}

.app-main:has(.copyright) {
  padding-bottom: 36px;
}

.fixed-header + .app-main {
  margin-top: 50px;
}

/* 开启页签时，减去 tagsView 高度 */
.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    margin-top: 84px;
    height: calc(100vh - 84px);
    min-height: 0px;
  }
}

/* 移动端安全区域适配 */
@media screen and (max-width: 991px) {
  .fixed-header + .app-main {
    padding-bottom: max(60px, calc(constant(safe-area-inset-bottom) + 40px));
    padding-bottom: max(60px, calc(env(safe-area-inset-bottom) + 40px));
    overscroll-behavior-y: none;
  }

  .hasTagsView .fixed-header + .app-main {
    padding-bottom: max(60px, calc(constant(safe-area-inset-bottom) + 40px));
    padding-bottom: max(60px, calc(env(safe-area-inset-bottom) + 40px));
    overscroll-behavior-y: none;
  }
}

/* iOS Safari 底部安全区修正 */
@supports (-webkit-touch-callout: none) {
  @media screen and (max-width: 991px) {
    .fixed-header + .app-main {
      padding-bottom: max(17px, calc(constant(safe-area-inset-bottom) + 10px));
      padding-bottom: max(17px, calc(env(safe-area-inset-bottom) + 10px));
      height: calc(100svh - 50px);
      height: calc(100dvh - 50px);
    }

    .hasTagsView .fixed-header + .app-main {
      padding-bottom: max(17px, calc(constant(safe-area-inset-bottom) + 10px));
      padding-bottom: max(17px, calc(env(safe-area-inset-bottom) + 10px));
      height: calc(100svh - 84px);
      height: calc(100dvh - 84px);
    }
  }
}
</style>

<style lang="scss">
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
