<script setup lang="ts">
import { watchEffect, ref } from "vue";
import renderBurger from "./scripts.ts";

let burgerCanvas = ref<HTMLElement>();
watchEffect(() => {
  if (burgerCanvas.value) {
    renderBurger(burgerCanvas.value);
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
});
</script>

<template>
  <canvas ref="burgerCanvas" id="burger-canvas"></canvas>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
