<template>
  <view class="app-tab-container">
    <scroll-view 
      class="app-tab-scroll" 
      scroll-x="true" 
      :scroll-into-view="scrollIntoView"
      show-scrollbar="false"
    >
      <view class="app-tab-list">
        <view 
          v-for="(app, index) in appList" 
          :key="app._id"
          :id="`tab-${index}`"
          class="app-tab-item"
          :class="{ 'active': app._id === currentAppId }"
          @click="handleTabClick(app, index)"
        >
          <text class="app-tab-text">{{ app.title }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores/appStore.ts'
import { storeToRefs } from 'pinia'
import type { IWorkFlow } from '@/types'
import hasAppPermission from '@/composables/usePermissions'

// Props定义
const props = defineProps({
  currentAppId: {
    type: String,
    default: ''
  }
})

// 事件定义
const emit = defineEmits(['tabChange'])

// 加载状态
const isLoading = ref(true)
const scrollIntoView = ref('')

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

// 应用列表 - 只显示对当前用户可见且组织匹配的应用
const { user } = storeToRefs(useAppStore())
const appList = computed<IWorkFlow[]>(() => {
  if (!workflows_all.value?.length) return []
  const userOrgs: string[] = (user.value && Array.isArray((user.value as any).organizations)) ? (user.value as any).organizations : []
  return workflows_all.value.filter(app => {
    // 继续保持 is_public 标记优先（明确为 false 时隐藏）
    if (app.is_public === false) return false
    return hasAppPermission(app.organizations || [], userOrgs, [])
  })
})

// 处理标签点击
const handleTabClick = (app: IWorkFlow, index: number) => {
  emit('tabChange', app)
  // 自动滚动到当前选中的标签
  setTimeout(() => {
    scrollIntoView.value = `tab-${index}`
  }, 100)
}

// 监听当前应用ID变化，自动滚动到对应位置
watch(() => props.currentAppId, (newId) => {
  if (newId) {
    const index = appList.value.findIndex(app => app._id === newId)
    if (index !== -1) {
      scrollIntoView.value = `tab-${index}`
    }
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.app-tab-container {
  width: 100%;
  background-color: #ffffff;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.app-tab-scroll {
  width: 100%;
  white-space: nowrap;
  height: auto;
  /* 安卓兼容性修复 */
  overflow-x: auto;
  overflow-y: hidden;
}

.app-tab-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30rpx;
  /* 安卓app兼容性 */
  white-space: nowrap;
  width: max-content;
  min-width: 100%;
}

.app-tab-item {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  border-radius: 999px; // Pill shape
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  /* 安卓app兼容性 */
  flex-shrink: 0;
  white-space: nowrap;
  writing-mode: horizontal-tb;
  text-orientation: mixed;
  
  &:last-child {
    margin-right: 30rpx;
  }
  
  &.active {
    background-color: #5b42e7; // Solid blue for active
    
    .app-tab-text {
      color: #ffffff; // White text for active
      font-weight: 600;
    }
  }
  
  &:not(.active) {
    background-color: #f3f4f6; // Light grey for inactive
    
    .app-tab-text {
      color: #333333; // Dark text for inactive
      font-weight: 500;
    }
  }
}

.app-tab-text {
  font-size: 28rpx;
  line-height: 1.3;
  text-align: center;
  /* 安卓app兼容性 - 确保文字水平显示 */
  white-space: nowrap;
  writing-mode: horizontal-tb;
  text-orientation: mixed;
  direction: ltr;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200rpx;
}

// 自定义滚动条样式（主要用于H5）
::-webkit-scrollbar {
  display: none;
}

.app-tab-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

/* 安卓app特殊兼容性样式 */
/* #ifdef APP-PLUS */
.app-tab-container {
  /* 安卓app特殊处理 */
  overflow: hidden;
}

.app-tab-scroll {
  /* 强制安卓app水平滚动 */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.app-tab-list {
  /* 确保在安卓app中正确显示 */
  flex-wrap: nowrap;
  overflow: visible;
}

.app-tab-item {
  /* 安卓app中防止文字竖向排列 */
  min-width: auto;
  width: auto;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}

.app-tab-text {
  /* 强制安卓app中文字水平显示 */
  display: inline-block;
  vertical-align: middle;
  unicode-bidi: bidi-override;
  direction: ltr;
}
/* #endif */
</style>