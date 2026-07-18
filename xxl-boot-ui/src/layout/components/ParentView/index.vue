<!--
  组件：ParentView（路由容器）
  功能：作为多级菜单的中间层路由容器，渲染子路由页面。
        后端返回的菜单树中，非叶子节点且非 Layout 的中间层级映射为此组件。
-->
<template >
  <router-view />
</template>
