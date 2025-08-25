<script lang="ts" setup>
import { computed, inject } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { timeLineKey } from './tokens'
import { timeLineItemEmits, timeLineItemProps } from './time-line-item'
import { useTimeLineCustomStyle } from './composables'

const props = defineProps(timeLineItemProps)
const emits = defineEmits(timeLineItemEmits)

const timeLineContext = inject(timeLineKey, undefined)

const showLine = computed<boolean>(() =>
  timeLineContext?.showLine.value === undefined
    ? true
    : timeLineContext?.showLine.value
)

const { ns, dotClass, dotStyle } = useTimeLineCustomStyle(props)

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
  <view :class="[ns.b()]">
    <view :class="[ns.e('title')]" @tap.stop="clickHandle">
      <view
        :class="[ns.em('title', 'dot'), dotClass, ns.is('line', showLine)]"
        :style="dotStyle"
      >
        <TnIcon v-if="titleIcon" :name="titleIcon" />
      </view>
      <view :class="[ns.em('title', 'data')]">
        <slot name="title">
          {{ title }}
        </slot>
      </view>
    </view>
    <view :class="[ns.e('data')]">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@import './theme-chalk/time-line-item.scss';
</style>
