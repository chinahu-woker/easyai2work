<script lang="ts" setup>
import { provide, toRef } from 'vue'
import { useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'
import { timeLineKey } from './tokens'
import { timeLineProps } from './time-line'

const props = defineProps(timeLineProps)

const ns = useNamespace('time-line')

provide(timeLineKey, {
  showLine: toRef(props, 'showLine'),
})
</script>

<template>
  <view :class="[ns.b()]">
    <slot />
  </view>
</template>

<style lang="scss">
@import './theme-chalk/time-line.scss';
</style>
