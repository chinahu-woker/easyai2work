<script setup lang="ts">
import {computed, onMounted, ref, nextTick, shallowRef, watch, onBeforeUnmount} from 'vue';
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';
import type { PropType } from 'vue';
import { storeProps, aiTeamProps } from '@/cofigs/data/globalAppData.ts';

// 加载状态
const isLoading = ref(true)

// 防抖定时器
let debounceTimer: number | null = null

// 顶部三个区域轮播相关状态
const currentAppIndex = ref(0) // 当前显示的应用起始索引
const isContentTransitioning = ref(false)
let contentCarouselTimer: number | null = null
const CONTENT_CAROUSEL_INTERVAL = 6000 // 6秒轮播间隔

// 标签切换状态（仅手动控制）
const currentTagIndex = ref(0)

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    await useAppStore().initWorkFlows_All()
  } finally {
    isLoading.value = false
    // 数据加载完成后启动内容轮播
    nextTick(() => {
      setTimeout(() => {
        startContentCarousel() // 启动内容轮播
      }, 100)
    })
  }
})

// 清理定时器
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  if (contentCarouselTimer) {
    clearInterval(contentCarouselTimer)
    contentCarouselTimer = null
  }
})

// 从应用状态管理中解构出工作流数据、当前激活的标签索引和标签列表
const {workflows_all, home_tagActiveIndex, home_tagsList} = storeToRefs(useAppStore())

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 支持通过 prop 指定要显示的标签（默认：AI团队）
const props = defineProps({
  showTag: { type: String, default: "AI团队" },
  // 支持多标签筛选，可以传入标签数组，默认为AI团队标签
  showTags: { type: Array as PropType<string[]>, default: () => ["AI团队"] },
  // 筛选模式：'any' 匹配任一标签，'all' 匹配所有标签，'single' 单标签匹配
  filterMode: { type: String as PropType<'any' | 'all' | 'single'>, default: aiTeamProps.filterMode }
})

// 当前标签
const currentTag = computed(() => {
  return props.showTags[currentTagIndex.value] || props.showTag
})

// 只展示当前标签的卡片
const showApps = computed<IWorkFlow[]>(() => {
  if (!workflows_all.value?.length) return []
  
  // 使用当前标签进行筛选
  const targetTag = currentTag.value
  
  // 使用缓存避免重复计算
  const cacheKey = `single-${targetTag}-${workflows_all.value.length}`
  if (filteredResultCache.value.has(cacheKey)) {
    return filteredResultCache.value.get(cacheKey)!
  }
  
  // 单标签匹配：应用的标签中包含当前标签
  const result = workflows_all.value.filter(item => item.tags?.includes(targetTag))
  
  filteredResultCache.value.set(cacheKey, result)
  console.log(`Filtering showApps by tag="${targetTag}", found:`, result.length)
  return result
})

// 创建组件的key，确保内容变化时强制重新渲染
const componentKey = computed(() => {
  return `content-${currentTag.value}-${showApps.value.length}-${currentAppIndex.value}`
})

// 内容轮播控制函数
const startContentCarousel = () => {
  if (contentCarouselTimer) {
    clearInterval(contentCarouselTimer)
  }
  
  // 只有当应用数量大于3个时才启动轮播
  if (showApps.value.length > 3) {
    contentCarouselTimer = setInterval(() => {
      nextContent()
    }, CONTENT_CAROUSEL_INTERVAL) as any
  }
}

const stopContentCarousel = () => {
  if (contentCarouselTimer) {
    clearInterval(contentCarouselTimer)
    contentCarouselTimer = null
  }
}

const nextContent = () => {
  if (isContentTransitioning.value || showApps.value.length <= 3) return
  
  isContentTransitioning.value = true
  // 每次轮播移动3个位置，显示完全不同的应用组合
  currentAppIndex.value = (currentAppIndex.value + 3) % showApps.value.length
  
  // 过渡动画完成后重置状态
  setTimeout(() => {
    isContentTransitioning.value = false
  }, 500)
}

// 标签切换函数（仅手动控制）
const switchToTag = (index: number) => {
  if (index === currentTagIndex.value) return
  
  currentTagIndex.value = index
  currentAppIndex.value = 0 // 切换标签时重置内容索引
  
  // 重新开始内容轮播
  setTimeout(() => {
    startContentCarousel()
  }, 100)
}

// 顶部 3 个应用（支持轮播切换）
const topApps = computed(() => {
  if (showApps.value.length === 0) return []
  
  // 如果应用数量少于等于3个，直接返回
  if (showApps.value.length <= 3) {
    return showApps.value
  }
  
  // 轮播显示：从当前索引开始取3个应用
  const apps = []
  for (let i = 0; i < 3; i++) {
    const index = (currentAppIndex.value + i) % showApps.value.length
    apps.push(showApps.value[index])
  }
  return apps
})

const remainingApps = computed(() => {
  // 不显示剩余应用，只保留顶部3个卡片的轮播
  return []
})



// 监听数据变化，重新启动内容轮播
watch([showApps, currentTagIndex], () => {
  if (!isLoading.value) {
    currentAppIndex.value = 0 // 重置内容索引
    // 重新启动内容轮播
    stopContentCarousel()
    setTimeout(() => {
      startContentCarousel()
    }, 100)
  }
}, { deep: true, immediate: false })

const appStore = useAppStore()
const logo = 'https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250521115157378-no.png'

// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex = 0 // 清除当前选中的标签栏索引
  uni.navigateTo({url: `/pages/draw/apps/apps?id=${item._id}`});// 跳转到应用详情页面
}


</script>

<template>
  <!-- 标题栏 -->
  <view class="title-bar">
    <view class="title-section">
      <text class="title-text">{{ aiTeamProps.title }}</text>
      <!-- 内容轮播进度指示器 -->
      <view v-if="showApps.length > 3" class="content-progress">
        <view 
          v-for="n in Math.ceil(showApps.length / 3)" 
          :key="n"
          class="progress-dot"
          :class="{ active: Math.floor(currentAppIndex / 3) === (n - 1) }"
        ></view>
      </view>
    </view>
    <view class="tag-indicators">
      <view 
        v-for="(tag, index) in props.showTags" 
        :key="tag"
        class="tag-indicator"
        :class="{ active: index === currentTagIndex }"
        @click="switchToTag(index)"
      >
        <text class="tag-name">{{ tag }}</text>
      </view>
    </view>
  </view>
  
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">正在加载应用...</text>
    </view>
    
    <!-- 主要内容区域 -->
    <view v-else>
      <!-- 顶部 3 格布局（左大右小） -->
      <transition name="fade" mode="out-in">
        <view v-if="showApps.length > 0" class="top-layout" :class="{ transitioning: isContentTransitioning }" :key="currentTag + '-' + currentAppIndex">
          <view class="top-grid">
            <view v-if="topApps[0]" class="tile left-large" @click="handleNavigate(topApps[0])">
              <image v-if="!isVideo(topApps[0].cover)" :src="topApps[0].cover" mode="aspectFill" class="tile-image" :lazy-load="true" :webp="true" :fade-show="true"/>
              <video v-else :src="topApps[0].cover" autoplay loop muted object-fit="cover" class="tile-video"/>
              <view class="tile-overlay">
                <view class="tile-label">{{ topApps[0].title || topApps[0].name || '应用' }}</view>
                <view v-if="topApps[0].tags && topApps[0].tags.length > 0" class="tile-tags">
                  <text v-for="tag in topApps[0].tags.slice(0, 2)" :key="tag" class="tile-tag">{{ tag }}</text>
                </view>
              </view>
            </view>

            <view class="right-column">
              <view v-if="topApps[1]" class="tile right-top" @click="handleNavigate(topApps[1])">
                <image v-if="!isVideo(topApps[1].cover)" :src="topApps[1].cover" mode="aspectFill" class="tile-image" :lazy-load="true" :webp="true" :fade-show="true"/>
                <video v-else :src="topApps[1].cover" autoplay loop muted object-fit="cover" class="tile-video"/>
                <view class="tile-overlay">
                  <view class="tile-label">{{ topApps[1].title || topApps[1].name || '应用' }}</view>
                  <view v-if="topApps[1].tags && topApps[1].tags.length > 0" class="tile-tags">
                    <text v-for="tag in topApps[1].tags.slice(0, 2)" :key="tag" class="tile-tag">{{ tag }}</text>
                  </view>
                </view>
              </view>

              <view v-if="topApps[2]" class="tile right-bottom" @click="handleNavigate(topApps[2])">
                <image v-if="!isVideo(topApps[2].cover)" :src="topApps[2].cover" mode="aspectFill" class="tile-image" :lazy-load="true" :webp="true" :fade-show="true"/>
                <video v-else :src="topApps[2].cover" autoplay loop muted object-fit="cover" class="tile-video"/>
                <view class="tile-overlay">
                  <view class="tile-label">{{ topApps[2].title || topApps[2].name || '应用' }}</view>
                  <view v-if="topApps[2].tags && topApps[2].tags.length > 0" class="tile-tags">
                    <text v-for="tag in topApps[2].tags.slice(0, 2)" :key="tag" class="tile-tag">{{ tag }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 无数据状态 -->
        <view v-else class="empty-container" :key="'empty-' + currentTag">
          <text class="empty-text">{{ currentTag }} 暂无应用数据</text>
        </view>
      </transition>
    </view>
       
  <!-- 调整底部占位高度，避免与下一个板块间距过大 -->
  <view style="height: 40rpx;"></view>
    
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


/* 标题栏样式 */
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15rpx;
  padding: 20rpx 25rpx 15rpx 25rpx;
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 15rpx;
    
    .title-text {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
    }
    
    .content-progress {
      display: flex;
      gap: 6rpx;
      align-items: center;
      
      .progress-dot {
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        
        &.active {
          background: #667eea;
          transform: scale(1.2);
        }
      }
    }
  }
  
  .tag-indicators {
    display: flex;
    gap: 8rpx;
    
    .tag-indicator {
      padding: 8rpx 12rpx;
      border-radius: 20rpx;
      background: rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
      
      .tag-name {
        font-size: 24rpx;
        color: #666;
        font-weight: 500;
        transition: color 0.3s ease;
      }
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
        
        .tag-name {
          color: #fff;
          font-weight: 600;
        }
      }
      
      &:hover:not(.active) {
        background: rgba(0, 0, 0, 0.1);
        
        .tag-name {
          color: #333;
        }
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

/* 过渡动画样式 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20rpx);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20rpx);
}

.transitioning {
  pointer-events: none;
}

/* 顶部布局过渡动画 */
.top-layout {
  transition: all 0.3s ease;
  
  &.transitioning {
    opacity: 0.7;
  }
}

/* 顶部三格布局样式（左大右小） */
.top-layout {
  padding: 0 20rpx 10rpx 20rpx;
}
.top-grid {
  display: flex;
  gap: 15rpx;
  align-items: stretch;
  width: 100%;
}
.left-large {
  flex: 2;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  height: 363rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}
.right-top, .right-bottom {
  height: calc((360rpx - 15rpx) / 2);
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
  min-height: 175rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
.tile-image, .tile-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.tile-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 20rpx 16rpx 16rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.tile-label {
  color: #fff;
  font-weight: 700;
  text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.6);
  font-size: 28rpx;
  line-height: 1.3;
  max-height: 70rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.tile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6rpx;
}
.tile-tag {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  font-weight: 500;
}

/* 响应式布局优化 */
@media screen and (max-width: 750rpx) {
  .title-bar {
    padding: 15rpx 20rpx 10rpx 20rpx;
    flex-direction: column;
    align-items: flex-start;
    gap: 10rpx;
    
    .title-section {
      width: 100%;
      justify-content: space-between;
      
      .title-text {
        font-size: 36rpx;
      }
      
      .content-progress {
        .progress-dot {
          width: 6rpx;
          height: 6rpx;
        }
      }
    }
    
    .tag-indicators {
      width: 100%;
      justify-content: center;
      
      .tag-indicator {
        padding: 6rpx 10rpx;
        
        .tag-name {
          font-size: 22rpx;
        }
      }
    }
  }
  
  .top-layout {
    padding: 0 15rpx 10rpx 15rpx;
  }
  
  .top-grid {
    gap: 12rpx;
  }
  
  .left-large {
    height: 320rpx;
  }
  
  .right-top, .right-bottom {
    height: calc((320rpx - 12rpx) / 2);
    min-height: 154rpx;
  }
  
  .tile-label {
    font-size: 26rpx;
  }
  
  .tile-tag {
    font-size: 18rpx;
    padding: 3rpx 6rpx;
  }
}

/* 超小屏幕优化 */
@media screen and (max-width: 600rpx) {
  .title-bar {
    padding: 15rpx 15rpx 10rpx 15rpx;
    
    .title-section {
      .title-text {
        font-size: 32rpx;
      }
      
      .content-progress {
        gap: 4rpx;
        
        .progress-dot {
          width: 5rpx;
          height: 5rpx;
        }
      }
    }
    
    .tag-indicators {
      gap: 6rpx;
      
      .tag-indicator {
        padding: 5rpx 8rpx;
        
        .tag-name {
          font-size: 20rpx;
        }
      }
    }
  }
  
  .top-layout {
    padding: 0 10rpx 10rpx 10rpx;
  }
  
  .left-large {
    height: 280rpx;
  }
  
  /* 保证在超小屏幕时 top-grid 的 gap 与高度计算一致 */
  .top-grid {
    gap: 12rpx;
  }

  .right-top, .right-bottom {
    height: calc((280rpx - 12rpx) / 2);
    min-height: 134rpx;
  }
}
</style>