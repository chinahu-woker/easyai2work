<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useAppStore } from "@/stores/appStore.ts";
import { storeToRefs } from "pinia";
import { isVideo } from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';
import hasAppPermission from '@/composables/usePermissions'

// 加载状态
const isLoading = ref(true)

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    isLoading.value = true
    await appStore.initWorkFlows_All()
  } catch (error) {
    console.error('SidebarClassList: 初始化失败', error)
  } finally {
    isLoading.value = false
  }
})

// 从应用状态管理中解构出工作流数据
const appStore = useAppStore()
const { workflows_all, user } = storeToRefs(appStore)

// 当前选中的标签索引
const activeTagIndex = ref(0)

// 使用 shallowRef 优化性能，缓存标签列表
const cachedTags = shallowRef<string[]>([])

// 提取并缓存所有唯一标签
const extractedTags = computed(() => {
  if (!workflows_all.value?.length) return []
  
  // 如果已有缓存且数据未变化，直接返回
  if (cachedTags.value.length > 0) {
    return cachedTags.value
  }
  
  // 提取所有唯一标签
  const allTags = new Set<string>()
  workflows_all.value.forEach(app => {
    if (app.tags && Array.isArray(app.tags)) {
      app.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          allTags.add(tag)
        }
      })
    }
  })
  
  // 转换为数组并缓存
  const tagsArray = Array.from(allTags)
  cachedTags.value = tagsArray
  
  return tagsArray
})

// 权限判断函数
const hasStorePermission = (app: any) => {
  const userOrgs: string[] = (user.value && Array.isArray((user.value as any).organizations)) 
    ? (user.value as any).organizations 
    : []
  return hasAppPermission(
    app && app.organizations ? app.organizations : [], 
    userOrgs, 
    []
  )
}

// 当前选中标签的应用列表（使用 shallowRef 优化性能）
const currentTagApps = computed(() => {
  if (!extractedTags.value.length || !workflows_all.value?.length) return []
  
  const selectedTag = extractedTags.value[activeTagIndex.value]
  if (!selectedTag) return []
  
  // 过滤出包含当前标签的应用
  return workflows_all.value
    .filter(app => {
      // 检查是否包含当前标签
      const hasTag = app.tags && app.tags.includes(selectedTag)
      // 检查权限
      const hasPermission = hasStorePermission(app)
      return hasTag && hasPermission
    })
    .map(item => {
      const result = { ...item } as IWorkFlow
      result.accelerateType = 'none'
      return result
    })
})

// 获取每个标签的应用数量（用于显示标签后面的数字）
const getTagCount = (tag: string) => {
  if (!workflows_all.value?.length) return 0
  
  return workflows_all.value.filter(app => {
    const hasTag = app.tags && app.tags.includes(tag)
    const hasPermission = hasStorePermission(app)
    return hasTag && hasPermission
  }).length
}

// 切换标签
const selectTag = (index: number) => {
  activeTagIndex.value = index
}

// 处理图片加载失败
const handleImageError = (item: IWorkFlow) => {
  console.warn(`Image load error for: ${item._id}`)
}

// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex = 0
  uni.navigateTo({ url: `/pages/draw/apps/apps?id=${item._id}` })
}
</script>

<template>
  <!-- 加载状态 -->
  <view v-if="isLoading" class="loading-container">
    <text class="loading-text">正在加载应用...</text>
  </view>
  
  <!-- 主容器 -->
  <view v-else-if="extractedTags.length > 0" class="sidebar-container">
    <!-- 左侧磨砂玻璃导航栏 -->
    <view class="sidebar-nav">
      <scroll-view 
        class="nav-scroll" 
        scroll-y 
        show-scrollbar="false"
      >
        <view 
          v-for="(tag, index) in extractedTags" 
          :key="tag"
          class="nav-item"
          :class="{ active: activeTagIndex === index }"
          @click="selectTag(index)"
        >
          <view class="nav-item-content">
            <text class="nav-text">{{ tag }}</text>
            <text class="nav-count">{{ getTagCount(tag) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 右侧应用展示区域 -->
    <view class="content-area">
      <scroll-view 
        class="content-scroll" 
        scroll-y 
        show-scrollbar="false"
      >
        <!-- 当前标签名称 -->
        <view class="content-header">
          <text class="header-title">{{ extractedTags[activeTagIndex] }}</text>
          <text class="header-count">({{ currentTagApps.length }})</text>
        </view>
        
        <!-- 应用网格 -->
        <view v-if="currentTagApps.length > 0" class="apps-grid">
          <view 
            v-for="(item, appIndex) in currentTagApps" 
            :key="item._id || appIndex"
            class="app-item"
            @click="handleNavigate(item)"
          >
            <view class="app-card">
              <!-- 视频内容 -->
              <video 
                class="app-media video" 
                v-if="item.cover && isVideo(item.cover)"
                autoplay
                loop
                muted
                object-fit="cover"
                :controls="false"
                :src="item.cover"
                @error="() => handleImageError(item)"
              />
              
              <!-- 图片内容 -->
              <image 
                class="app-media image" 
                v-else-if="item.cover" 
                :src="item.cover" 
                mode="aspectFill"
                @error="() => handleImageError(item)"
                :lazy-load="true"
                :fade-show="true"
              />
              
              <!-- 无封面占位符 -->
              <view v-else class="no-cover-placeholder">
                <text class="placeholder-text">暂无封面</text>
              </view>
              
              <!-- 应用信息覆盖层 -->
              <view class="app-overlay">
                <text class="app-title">{{ item.title || item.name || '应用' }}</text>
                <view v-if="item.tags && item.tags.length > 0" class="app-tags">
                  <text 
                    v-for="tag in item.tags.slice(0, 2)" 
                    :key="tag" 
                    class="app-tag"
                  >
                    {{ tag }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-else class="empty-state">
          <text class="empty-text">该分类暂无应用</text>
        </view>
      </scroll-view>
    </view>
  </view>
  
  <!-- 无数据状态 -->
  <view v-else class="empty-container">
    <text class="empty-text">暂无应用数据</text>
  </view>
  
  <!-- 底部间距 -->
  <view class="bottom-spacing"></view>
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .loading-text {
    color: #999;
    font-size: 28rpx;
  }
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .empty-text {
    color: #ccc;
    font-size: 32rpx;
  }
}

/* 主容器 - 透明底 */
.sidebar-container {
  display: flex;
  min-height: calc(100vh - 200rpx);
  background: transparent;
  padding: 20rpx 0;
  gap: 20rpx;
}

/* 左侧磨砂玻璃导航栏 */
.sidebar-nav {
  width: 180rpx;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  
  .nav-scroll {
    height: 100%;
    padding: 10rpx 0;
  }
  
  .nav-item {
    padding: 20rpx 16rpx;
    margin: 8rpx 12rpx;
    border-radius: 12rpx;
    transition: all 0.3s ease;
    cursor: pointer;
    
    .nav-item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;
      
      .nav-text {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
        text-align: center;
        line-height: 1.3;
        word-break: break-all;
      }
      
      .nav-count {
        font-size: 20rpx;
        color: #999;
        font-weight: 400;
      }
    }
    
    &.active {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .nav-item-content {
        .nav-text {
          color: #1a73e8;
          font-weight: 600;
        }
        
        .nav-count {
          color: #1a73e8;
        }
      }
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

/* 右侧内容区域 */
.content-area {
  flex: 1;
  background: transparent;
  
  .content-scroll {
    height: 100%;
  }
  
  .content-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 0 25rpx 20rpx 25rpx;
    
    .header-title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
    }
    
    .header-count {
      font-size: 28rpx;
      color: #999;
      font-weight: 400;
    }
  }
}

/* 应用网格 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 25rpx;
}

/* 应用卡片样式 */
.app-item {
  width: 100%;
}

.app-card {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  background: #fff;
  
  &:active {
    transform: scale(0.98);
  }
}

/* 媒体内容样式 */
.app-media {
  width: 100%;
  height: 320rpx;
  display: block;
  
  &.image {
    object-fit: cover;
  }
  
  &.video {
    object-fit: cover;
  }
}

/* 无封面占位符 */
.no-cover-placeholder {
  width: 100%;
  height: 320rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .placeholder-text {
    color: #999;
    font-size: 24rpx;
  }
}

/* 应用信息覆盖层 */
.app-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 20rpx 16rpx 16rpx 16rpx;
  color: #fff;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  
  .app-title {
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .app-tags {
    display: flex;
    gap: 6rpx;
    flex-wrap: wrap;
    
    .app-tag {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10rpx);
      font-size: 20rpx;
      padding: 4rpx 8rpx;
      border-radius: 8rpx;
      border: 1rpx solid rgba(255, 255, 255, 0.3);
    }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .empty-text {
    color: #ccc;
    font-size: 28rpx;
  }
}

/* 底部间距 */
.bottom-spacing {
  height: 130rpx;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .sidebar-nav {
    width: 160rpx;
    
    .nav-item {
      padding: 16rpx 12rpx;
      
      .nav-item-content {
        .nav-text {
          font-size: 24rpx;
        }
        
        .nav-count {
          font-size: 18rpx;
        }
      }
    }
  }
  
  .content-header {
    padding: 0 20rpx 15rpx 20rpx;
    
    .header-title {
      font-size: 36rpx;
    }
    
    .header-count {
      font-size: 26rpx;
    }
  }
  
  .apps-grid {
    gap: 15rpx;
    padding: 0 20rpx;
  }
  
  .app-media {
    height: 280rpx;
  }
  
  .no-cover-placeholder {
    height: 280rpx;
  }
}

@media screen and (max-width: 600rpx) {
  .sidebar-container {
    gap: 15rpx;
  }
  
  .sidebar-nav {
    width: 140rpx;
    
    .nav-item {
      padding: 14rpx 10rpx;
      margin: 6rpx 10rpx;
      
      .nav-item-content {
        gap: 4rpx;
        
        .nav-text {
          font-size: 22rpx;
        }
        
        .nav-count {
          font-size: 16rpx;
        }
      }
    }
  }
  
  .content-header {
    padding: 0 15rpx 10rpx 15rpx;
    
    .header-title {
      font-size: 32rpx;
    }
    
    .header-count {
      font-size: 24rpx;
    }
  }
  
  .apps-grid {
    gap: 12rpx;
    padding: 0 15rpx;
  }
  
  .app-media {
    height: 260rpx;
  }
  
  .no-cover-placeholder {
    height: 260rpx;
    
    .placeholder-text {
      font-size: 22rpx;
    }
  }
}

/* 平板设备优化 - 3列布局 */
@media screen and (min-width: 751rpx) {
  .apps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大屏设备优化 - 4列布局 */
@media screen and (min-width: 1200rpx) {
  .sidebar-nav {
    width: 200rpx;
  }
  
  .apps-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
