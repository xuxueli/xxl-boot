<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('http://xxx.xxx/xxx')

function goto() {
  window.open(url.value)
}
</script>