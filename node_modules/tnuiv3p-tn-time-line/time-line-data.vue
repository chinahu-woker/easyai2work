<script lang="ts" setup>
import { computed, inject } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { timeLineKey } from './tokens'
import { timeLineDataEmits, timeLineDataProps } from './time-line-data'
import { useTimeLineDataCustomStyle } from './composables'

const props = defineProps(timeLineDataProps)
const emits = defineEmits(timeLineDataEmits)

const timeLineContext = inject(timeLineKey, undefined)

const showLine = computed<boolean>(() =>
  timeLineContext?.showLine.value === undefined
    ? true
    : timeLineContext?.showLine.value
)

const { ns, dotClass, dotStyle } = useTimeLineDataCustomStyle(props)

// 点击事件
const clickHandle = () => {
  emits('click')
}
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view :class="[ns.b(), ns.is('line', showLine)]" @tap.stop="clickHandle">
    <view :class="[ns.e('dot'), dotClass]" :style="dotStyle">
      <TnIcon :name="dotIcon" />
    </view>
    <view :class="[ns.e('content')]">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@import './theme-chalk/time-line-data.scss';
</style>
