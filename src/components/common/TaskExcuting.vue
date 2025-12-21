<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore.ts'
import TnPopup from '@tuniao/tnui-vue3-uniapp/components/popup/src/popup.vue'
import TnCircleProgress from '@tuniao/tnui-vue3-uniapp/components/circle-progress/src/circle-progress.vue'
import { storeToRefs } from 'pinia' // 确保导入

const store = useAppStore()
const { showExecuting } = storeToRefs(store)

// 确保 showExecuting 存在后再监听
if (showExecuting) {
  watch(showExecuting, (newVal) => {
    console.log('showExecuting changed to:', newVal)
  })
}

// 确保 store 已初始化
onMounted(() => {
  console.log('store state:', store.$state)
})

const progressPercent = ref(30)
</script>

<template>
  <TnPopup 
    v-model="showExecuting"
    v-if="showExecuting"
    width="80%" 
    height="450"
    close-btn
    :overlay-closeable="false"
  >
    <view class="tn-p-lg tn">正在绘图中</view>
    <view class="tn-flex-center">
      <TnCircleProgress :percent="progressPercent">
        <text>{{ progressPercent }}%</text>
      </TnCircleProgress>
    </view>
  </TnPopup>
</template>

<style scoped lang="scss">
/* 样式保持不变 */
</style>