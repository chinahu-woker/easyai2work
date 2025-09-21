<template>
  <!-- 加载状态 -->
  <view v-if="isLoading" class="loading-container">
    <text class="loading-text">正在加载图标...</text>
  </view>

  <!-- 图标网格 -->
  <div v-else class="icon-grid">

    <div v-for="(item, index) in iconList" :key="index" class="icon-item" :class="{ 'has-app': item.matchedApp }">
      <!-- 客服按钮包装 -->
      <button 
        v-if="item.actionButton == 'true'"
        class="contact-button"
        open-type="contact">
        <div class="icon-content">
          <div class="icon-container" @click="handleIconClick(item, index)">
            <fui-icon :custom-prefix="item.symbol" :name="item.id"></fui-icon>
            <div v-if="item.matchedApp" class="app-indicator"></div>
          </div>
          <text class="icon-label">{{ item.label }}</text>
        </div>
      </button>
      
      <!-- 普通图标 -->
      <div v-else class="icon-content" @click="handleIconClick(item, index)">
        <div class="icon-container">
          <fui-icon :custom-prefix="item.symbol" :name="item.id"></fui-icon>
          <div v-if="item.matchedApp" class="app-indicator"></div>
        </div>
        <text class="icon-label">{{ item.label }}</text>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/appStore.ts'
import { storeToRefs } from 'pinia'
import type { IWorkFlow } from '@/types'
import { iconData } from '@/cofigs/data/globalAppData.ts'
// 定义图标数据接口
interface IconItem {
  id: string
  symbol: string
  label: string
  action?: string
  matchKeywords?: string[] // 用于匹配应用的关键词
  actionButton?: string // 是否为客服按钮
}

// 使用项目中的工作流接口
type AppItem = IWorkFlow

// 加载状态
const isLoading = ref(true)

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    await useAppStore().initWorkFlows_All()
  } finally {
    isLoading.value = false
  }
})

// 从应用状态管理中解构出工作流数据
const { workflows_all } = storeToRefs(useAppStore())

// Props 定义
const props = defineProps({
  // 图标数据列表，支持后端动态配置
  icons: {
    type: Array as () => IconItem[],
    default: () => iconData.icons
  },
  // 每行显示的图标数量
  columns: {
    type: Number,
    default: iconData.columns
  },
  // 图标大小
  iconSize: {
    type: Number,
    default: iconData.iconSize
  },
  // 图标间距
  gap: {
    type: Number,
    default: iconData.gap
  }
})

// 事件定义
const emit = defineEmits(['iconClick', 'appClick'])

// 匹配图标与应用的函数
const findMatchedApp = (icon: IconItem): AppItem | null => {
  if (!workflows_all.value || workflows_all.value.length === 0) return null

  const keywords = icon.matchKeywords || []

  // 查找匹配的应用
  for (const app of workflows_all.value) {
    // 检查 title 匹配
    const titleMatch = keywords.some(keyword =>
      app.title && app.title.includes(keyword)
    )

    // 检查 tags 匹配
    const tagsMatch = keywords.some(keyword =>
      app.tags && app.tags.some((tag: string) => tag.includes(keyword))
    )

    if (titleMatch || tagsMatch) {
      return app
    }
  }

  return null
}

// 处理图标列表，添加匹配的应用信息
const iconList = computed(() => {
  return props.icons.map(icon => ({
    ...icon,
    matchedApp: findMatchedApp(icon)
  }))
})

// 应用跳转逻辑
const appStore = useAppStore()
const handleNavigateToApp = (app: AppItem) => {
  appStore.tabbarIndex = 0 // 清除当前选中的标签栏索引
  uni.navigateTo({
    url: `/pages/draw/apps/apps?id=${app._id}`
  })
}

// 点击事件处理
const handleIconClick = (item: any, index: number) => {
  // 如果有匹配的应用，直接跳转到应用
  if (item.matchedApp) {
    handleNavigateToApp(item.matchedApp)
    emit('appClick', {
      app: item.matchedApp,
      icon: item,
      index
    })
  } else {
    // 否则提示未开放功能并触发原来的图标点击事件
    uni.showToast({
      title: '该功能暂未开放',
      icon: 'none',
      duration: 1500
    })
    emit('iconClick', { item, index })
  }
}
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120rpx;

  .loading-text {
    color: #999;
    font-size: 28rpx;
  }
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  background: transparent;
  /* 透明背景 */
  padding: 20rpx;
  box-sizing: border-box;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(25% - 30rpx);
  /* 4列布局，减去间距 */
  margin: 15rpx;
  padding: 20rpx 10rpx 24rpx 10rpx;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140rpx;

  &:hover {
    transform: translateY(-4rpx);
  }

  &:active {
    transform: translateY(0);
    opacity: 0.8;
  }
}

/* 统一的图标内容容器 */
.icon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* 客服按钮样式重置 */
.contact-button {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &::after {
    border: none;
  }
}

.icon-container {
  width: 80rpx;
  height: 80rpx;
  background: #fffdfd50;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  border: 1rpx solid #404040;
  box-shadow: 0 4rpx 12rpx rgba(255, 255, 255, 0);
  position: relative;
}

/* 匹配应用指示器 */
.app-indicator {
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  width: 12rpx;
  height: 12rpx;
  /* 线性渐变，从紫到粉色，兼容uni-app小程序样式语法 */
  background: linear-gradient(135deg, #a85cd4 0%, #ff7ac2 100%);
  border-radius: 50%;
  border: 2rpx solid #fff;
  box-shadow: 0 2rpx 6rpx rgba(168, 92, 212, 0.28);
}

/* 有匹配应用的图标项样式 */
.icon-item.has-app {
  .icon-container {
    border-color: #ad74ee;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.2);
  }

  .icon-label {
    color: #7041ed;
    font-weight: 500;
  }
}

.icon-symbol {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: normal;
  text-align: center;
  line-height: 1;
}

.icon-label {
  font-size: 24rpx;
  color: #3f3f3f;
  text-align: center;
  font-weight: 400;
  line-height: 1.3;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  max-width: 160rpx;
  min-height: 32rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式布局 */
@media (max-width: 600rpx) {
  .icon-item {
    width: calc(50% - 20rpx);
    /* 小屏幕时2列布局 */
    margin: 10rpx;
  }
}

@media (max-width: 400rpx) {
  .icon-item {
    width: calc(100% - 20rpx);
    /* 超小屏幕时1列布局 */
  }
}

/* 动态列数支持 */
.icon-grid[data-columns="2"] .icon-item {
  width: calc(50% - 30rpx);
}

.icon-grid[data-columns="3"] .icon-item {
  width: calc(33.333% - 30rpx);
}

.icon-grid[data-columns="5"] .icon-item {
  width: calc(20% - 30rpx);
}
</style>
