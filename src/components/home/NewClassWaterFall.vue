<script setup lang="ts">
import {computed, onMounted, ref, nextTick, shallowRef, watch, onBeforeUnmount} from 'vue';
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';
import { storeProps, payWorkProps } from '@/cofigs/data/globalAppData.ts';
import hasAppPermission from '@/composables/usePermissions'


// 加载状态
const isLoading = ref(true)

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    isLoading.value = true
    await appStore.initWorkFlows_All()
  } catch (error) {
    console.error('NewClassWaterFall: 初始化失败', error)
  } finally {
    isLoading.value = false
  }
})

// 从应用状态管理中解构出工作流数据（只调用一次 useAppStore() 并复用）
const appStore = useAppStore()
const { workflows_all, user } = storeToRefs(appStore)

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 动态提取所有唯一标签并生成分类
const categorizedApps = computed(() => {
  if (!workflows_all.value?.length) return []
  
  // 1. 提取所有应用中的标签
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
  
  // 权限判断：应用的 organizations 与配置的 organizations_store 是否有交集
  // 仅基于当前用户的组织判断权限（不再回退到 pagesGlobalData.json）
  const hasStorePermission = (app: any) => {
    const userOrgs: string[] = (user.value && Array.isArray((user.value as any).organizations)) ? (user.value as any).organizations : []
    return hasAppPermission(app && app.organizations ? app.organizations : [], userOrgs, [])
  }

  // 2. 为每个标签创建分类
  const categories = Array.from(allTags).map(tag => {
    // 找到包含该标签的所有应用，并根据权限设置 accelerateType
    const tagApps = workflows_all.value
      .filter(item => item.tags && item.tags.includes(tag))
      // 仅保留与当前用户组织匹配的应用（没有匹配则过滤掉）
      .filter(item => hasStorePermission(item))
      .map(item => {
        // 仅当权限匹配时前端设置 accelerateType: 'none'，否则不包含该字段
        const result = { ...item } as IWorkFlow
        // 设置为可选字段，只有需要时添加
        result.accelerateType = 'none'
        return result
      })
    
    return {
      title: tag,
      tags: [tag],
      isVisible: true,
      apps: tagApps,
      count: tagApps.length
    }
  })
  
  // 3. 按应用数量降序排序，确保有应用的分类显示在前面
  return categories
    .filter(category => category.count > 0)
    .sort((a, b) => b.count - a.count)
})



// 横向滚动懒加载相关状态
const visibleItemsPerCategory = ref(new Map<number, number>())
const INITIAL_LOAD_COUNT = 6 // 初始加载6个
const LOAD_MORE_COUNT = 4 // 每次加载更多4个

// 初始化每个分类的可见数量
// 使用 getter 形式的 watch 并增加防御性检查，避免在某些平台上访问 undefined.value 导致崩溃
// 移除 deep: true 配置以防止响应式依赖循环
watch(() => categorizedApps?.value, (newCategories) => {
  // 添加防御性检查
  if (!newCategories || !Array.isArray(newCategories)) return

  newCategories.forEach((category: any, index: number) => {
    // 确保 visibleItemsPerCategory 和内部 Map 存在
    if (!visibleItemsPerCategory.value) {
      visibleItemsPerCategory.value = new Map<number, number>()
    }

    if (!visibleItemsPerCategory.value.has(index)) {
      const cnt = (category && typeof category.count === 'number') ? category.count : 0
      visibleItemsPerCategory.value.set(index, Math.min(INITIAL_LOAD_COUNT, cnt))
    }
  })
}, { immediate: true })

// 获取每个分类当前可见的应用
const getVisibleApps = (categoryIndex: number) => {
  const category = categorizedApps.value?.[categoryIndex]
  if (!category) return []

  const visibleCount = (visibleItemsPerCategory.value && typeof visibleItemsPerCategory.value.get === 'function')
    ? (visibleItemsPerCategory.value.get(categoryIndex) ?? INITIAL_LOAD_COUNT)
    : INITIAL_LOAD_COUNT

  return (Array.isArray(category.apps) ? category.apps.slice(0, visibleCount) : [])
}

// 加载更多应用
const loadMoreApps = (categoryIndex: number) => {
  const category = categorizedApps.value?.[categoryIndex]
  if (!category) return

  const currentVisible = (visibleItemsPerCategory.value && typeof visibleItemsPerCategory.value.get === 'function')
    ? (visibleItemsPerCategory.value.get(categoryIndex) ?? INITIAL_LOAD_COUNT)
    : INITIAL_LOAD_COUNT

  const newVisible = Math.min(currentVisible + LOAD_MORE_COUNT, category.count || 0)
  if (visibleItemsPerCategory && visibleItemsPerCategory.value) {
    visibleItemsPerCategory.value.set(categoryIndex, newVisible)
  }
}

// 检查是否还有更多内容可加载
const hasMoreApps = (categoryIndex: number) => {
  const category = categorizedApps.value?.[categoryIndex]
  if (!category) return false

  const visibleCount = (visibleItemsPerCategory.value && typeof visibleItemsPerCategory.value.get === 'function')
    ? (visibleItemsPerCategory.value.get(categoryIndex) ?? INITIAL_LOAD_COUNT)
    : INITIAL_LOAD_COUNT

  return visibleCount < (category.count || 0)
}

// 横向滚动到底部时触发加载更多
const handleScrollToEnd = (categoryIndex: number) => {
  if (hasMoreApps(categoryIndex)) {
    loadMoreApps(categoryIndex)
  }
}

// 处理图片加载失败
const handleImageError = (item: IWorkFlow) => {
  console.warn(`Image load error for: ${item._id}`)
}


// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex = 0 // 清除当前选中的标签栏索引
  uni.navigateTo({url: `/pages/draw/apps/apps?id=${item._id}`}) // 跳转到应用详情页面
}

</script>

<template>
  <!-- 加载状态 -->
  <view v-if="isLoading" class="loading-container">
    <text class="loading-text">正在加载应用...</text>
  </view>
  
  <!-- 按标签分类展示 -->
  <view v-else-if="categorizedApps.length > 0" class="categories-container">
    <view 
      v-for="(category, categoryIndex) in categorizedApps" 
      :key="categoryIndex"
      class="category-section"
    >
      <!-- 分类标题 -->
  
      <view class="category-header">
        <view class="title-content">
          <text class="category-title">{{ category.title }}</text>
          <text class="category-count">({{ category.count }})</text>
        </view>
      </view>
      
      <!-- 横向滚动应用列表 -->
      <scroll-view 
        class="horizontal-scroll"
        scroll-x
        show-scrollbar="false"
        @scrolltolower="() => handleScrollToEnd(categoryIndex)"
      >
        <view class="apps-list">
          <view 
            v-for="(item, appIndex) in getVisibleApps(categoryIndex)" 
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
          
          <!-- 加载更多按钮 -->
          <view 
            v-if="hasMoreApps(categoryIndex)" 
            class="load-more-btn"
            @click="loadMoreApps(categoryIndex)"
          >
            <text class="load-more-text">加载更多</text>
            <fui-icon name="arrowright" size="28" color="#666" />
          </view>
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
  height: 200rpx;
  
  .loading-text {
    color: #999;
    font-size: 28rpx;
  }
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  
  .empty-text {
    color: #ccc;
    font-size: 32rpx;
  }
}

/* 分类容器样式 */
.categories-container {
  padding: 20rpx 0;
}

.category-section {
  margin-bottom: 40rpx;
}

/* 分类标题样式 */
.category-header {
  padding: 0 25rpx 20rpx 25rpx;
  
  .title-content {
    display: flex;
    align-items: center;
    gap: 10rpx;
    
    .category-title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
    }
    
    .category-count {
      font-size: 28rpx;
      color: #999;
      font-weight: 400;
    }
  }
}

/* 横向滚动容器 */
.horizontal-scroll {
  white-space: nowrap;
  
  .apps-list {
    display: flex;
    padding: 0 25rpx;
    gap: 20rpx;
  }
}

/* 应用卡片样式 */
.app-item {
  flex-shrink: 0;
  width: 240rpx;
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
  z-index: 1;
  
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
  /* 添加以下属性以解决iOS兼容性问题 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
  
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
    /* 添加以下属性以解决iOS兼容性问题 */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
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
      /* 添加以下属性以解决iOS兼容性问题 */
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
}

/* 加载更多按钮 */
.load-more-btn {
  flex-shrink: 0;
  width: 120rpx;
  height: 320rpx;
  background: #f8f9fa;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  transition: all 0.3s ease;
  
  .load-more-text {
    font-size: 24rpx;
    color: #666;
  }
  
  &:active {
    background: #e9ecef;
    border-color: #bbb;
  }
}

/* 底部间距 */
.bottom-spacing {
  height: 130rpx;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .category-header {
    padding: 0 20rpx 15rpx 20rpx;
    
    .title-content {
      .category-title {
        font-size: 36rpx;
      }
      
      .category-count {
        font-size: 26rpx;
      }
    }
  }
  
  .horizontal-scroll {
    .apps-list {
      padding: 0 20rpx;
      gap: 15rpx;
    }
  }
  
  .app-item {
    width: 220rpx;
  }
  
  .app-media {
    height: 300rpx;
  }
  
  .no-cover-placeholder {
    height: 300rpx;
  }
  
  .load-more-btn {
    width: 100rpx;
    height: 300rpx;
    
    .load-more-text {
      font-size: 22rpx;
    }
  }
}

@media screen and (max-width: 600rpx) {
  .category-header {
    padding: 0 15rpx 10rpx 15rpx;
    
    .title-content {
      gap: 8rpx;
      
      .category-title {
        font-size: 32rpx;
      }
      
      .category-count {
        font-size: 24rpx;
      }
    }
  }
  
  .horizontal-scroll {
    .apps-list {
      padding: 0 15rpx;
      gap: 12rpx;
    }
  }
  
  .app-item {
    width: 200rpx;
  }
  
  .app-media {
    height: 280rpx;
  }
  
  .no-cover-placeholder {
    height: 280rpx;
    
    .placeholder-text {
      font-size: 22rpx;
    }
  }
  
  
  
  .load-more-btn {
    width: 90rpx;
    height: 280rpx;
    
    .load-more-text {
      font-size: 20rpx;
    }
  }
}
</style>