<script lang="ts" setup>
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { suspendButtonEmits, suspendButtonProps } from './types'
import { useSuspendButton, useSuspendButtonCustomStyle } from './composables'

const props = defineProps(suspendButtonProps)
const emits = defineEmits(suspendButtonEmits)

const { buttonClass, buttonStyle, iconClass, iconStyle } =
  useSuspendButtonCustomStyle(props)
const { clickHandle } = useSuspendButton(emits)
</script>

<template>
  <view :class="[buttonClass]" :style="buttonStyle" @tap="clickHandle">
    <slot>
      <view :class="[iconClass]" :style="iconStyle">
        <TnIcon :name="$props.icon" />
      </view>
    </slot>
  </view>
</template>

<style lang="scss" scoped>
@import './theme-chalk/index.scss';
</style>
