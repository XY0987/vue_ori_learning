/**
 * Normalize CSS var value created by `v-bind` in `<style>` block
 * See https://github.com/vuejs/core/pull/12461#issuecomment-2495804664
 */
/*
规范化css变量值，主要用于处理vue模板中v-bind绑定的样式值

<script setup>
const color = 'red'
const size = ref(16)
</script>

<template>
  <div class="text">Hello</div>
</template>

<style>
.text {
  color: v-bind(color);
  font-size: v-bind('size + "px"');
}
</style>


null -> initial
'' -> ' '
非空字符串直接返回
number -> String
其他 -> console.warn
*/
export function normalizeCssVarValue(value: unknown): string {
  console.error('🚀 ~ normalizeCssVarValue ~ value:', value)
  if (value == null) {
    return 'initial'
  }

  if (typeof value === 'string') {
    return value === '' ? ' ' : value
  }

  // 不是一个数字，或者不是一个有限数字
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    if (__DEV__) {
      console.warn(
        '[Vue warn] Invalid value used for CSS binding. Expected a string or a finite number but received:',
        value,
      )
    }
  }

  return String(value)
}
