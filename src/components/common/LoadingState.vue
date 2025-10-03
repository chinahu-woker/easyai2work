<template>
  <view class="loading-state">
    <view class="progress-container">
      <text class="progress-text">{{ progress }}%</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: `${progress}%` }"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 通过 props 接收进度值
const { progress } = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped lang="scss">
.loading-state {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 204, 255, 0.6), rgba(204, 204, 255, 0.6));
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.progress-container {
  text-align: center;
  padding: 20rpx;
}

.progress-text {
  font-size: 48rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}
</style>
