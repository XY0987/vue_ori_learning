<template>
  <div class="num">{{ num }}</div>
  <button @click="add">加一</button>
</template>

<script setup lang="ts">
import { ref } from "vue"

const num = ref(1)

function add() {
  num.value++
}
</script>

<style>
.num {
  width: 100%;
  height: 100px;
}
</style>