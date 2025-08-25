<script lang="ts" setup>
import { stepsEmits, stepsProps } from './steps'
import { useSteps, useStepsCustomStyle } from './composables'

const props = defineProps(stepsProps)
defineEmits(stepsEmits)

const { stepsLineRectInfoList } = useSteps(props)
const { ns, stepsLineClass, stepsLineStyle } = useStepsCustomStyle(props)
</script>

<template>
  <view :class="[ns.b()]">
    <slot />

    <view
      v-for="(item, index) in stepsLineRectInfoList"
      :key="index"
      :class="[stepsLineClass(index, item.color, item.activeColor)]"
      :style="{
        left: `${item.left}px`,
        top: `${item.top}px`,
        width: `${item.width}px`,
        ...stepsLineStyle(index, item.color, item.activeColor),
      }"
    />
  </view>
</template>

<style lang="scss" scoped>
@import '../../../theme-chalk/src/steps.scss';
</style>
