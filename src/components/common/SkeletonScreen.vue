<template>
  <view class="skeleton-container">
    <!-- 轮播图骨架 -->
    <view class="skeleton-swiper"></view>
    
    <!-- 参数表格骨架 -->
    <view class="skeleton-section">
      <view class="skeleton-title"></view>
      <view class="skeleton-table">
        <view class="skeleton-row" v-for="i in 4" :key="i">
          <view class="skeleton-label"></view>
          <view class="skeleton-value"></view>
        </view>
      </view>
    </view>
    
    <!-- 评论骨架 -->
    <view class="skeleton-section">
      <view class="skeleton-title"></view>
      <view class="skeleton-comments">
        <view class="skeleton-comment" v-for="i in 3" :key="i">
          <view class="skeleton-avatar"></view>
          <view class="skeleton-comment-body">
            <view class="skeleton-comment-line"></view>
            <view class="skeleton-comment-line short"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 骨架屏组件，用于优化页面加载体验
</script>

<style scoped lang="scss">
.skeleton-container {
  width: 100%;
  padding: 20rpx;
  background: #f5f5f5;
}

/* 骨架屏动画 */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-swiper {
  width: 100%;
  height: 750rpx;
  margin-bottom: 30rpx;
  border-radius: 16rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-section {
  margin-bottom: 40rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.skeleton-title {
  width: 200rpx;
  height: 48rpx;
  margin-bottom: 30rpx;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-table {
  width: 100%;
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.skeleton-label {
  width: 120rpx;
  height: 36rpx;
  border-radius: 6rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-value {
  flex: 1;
  height: 36rpx;
  margin-left: 30rpx;
  border-radius: 6rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-comments {
  width: 100%;
}

.skeleton-comment {
  display: flex;
  margin-bottom: 30rpx;
}

.skeleton-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-comment-body {
  flex: 1;
}

.skeleton-comment-line {
  width: 100%;
  height: 32rpx;
  margin-bottom: 16rpx;
  border-radius: 6rpx;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  
  &.short {
    width: 60%;
  }
}

/* 安卓优化：减少动画复杂度 */
@media (platform: android) {
  @keyframes skeleton-loading {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
</style>
