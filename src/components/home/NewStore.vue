<script setup lang="ts">
import {computed, onMounted, ref, nextTick, shallowRef, watch, onBeforeUnmount} from 'vue';
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';
import type { PropType } from 'vue';
import { storeProps } from '@/cofigs/data/globalAppData.ts';

// 加载状态
const isLoading = ref(true)
// 瀑布流初始化状态
const isWaterfallReady = ref(false)

// 获取瀑布流元素的引用
const waterfallElement = ref()

// 防抖定时器
let debounceTimer: number | null = null

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    await useAppStore().initWorkFlows_All()
  } finally {
    isLoading.value = false
    // 数据加载完成后启用瀑布流
    nextTick(() => {
      setTimeout(() => {
        isWaterfallReady.value = true
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
  if (updateTimer) {
    clearTimeout(updateTimer)
    updateTimer = null
  }
})

// 从应用状态管理中解构出工作流数据、当前激活的标签索引和标签列表
const {workflows_all, home_tagActiveIndex, home_tagsList} = storeToRefs(useAppStore())

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 支持通过 prop 指定要显示的标签（默认：AI团队）
const props = defineProps({
  showTag: { type: String, default: storeProps.showTag },
  // 支持多标签筛选，可以传入标签数组，默认为三种主要标签
  showTags: { type: Array as PropType<string[]>, default: () => storeProps.showTags },
  // 筛选模式：'any' 匹配任一标签，'all' 匹配所有标签，'single' 单标签匹配
  filterMode: { type: String as PropType<'any' | 'all' | 'single'>, default: storeProps.filterMode }
})

// 只展示标签包含指定 showTag 的卡片
const showApps = computed<IWorkFlow[]>(() => {
  if (!workflows_all.value?.length) return []
  
  // 根据筛选模式决定使用的标签
  let targetTags: string[] = []
  if (props.filterMode === 'single') {
    targetTags = [props.showTag]
  } else if (props.showTags.length > 0) {
    targetTags = props.showTags
  } else {
    targetTags = [props.showTag]
  }
  
  // 使用缓存避免重复计算
  const cacheKey = `${props.filterMode}-${targetTags.join(',')}-${workflows_all.value.length}`
  if (filteredResultCache.value.has(cacheKey)) {
    return filteredResultCache.value.get(cacheKey)!
  }
  
  let result: IWorkFlow[] = []
  
  switch (props.filterMode) {
    case 'any':
      // 匹配任一标签：应用的标签中包含目标标签中的任何一个
      result = workflows_all.value.filter(item => 
        item.tags?.some(tag => targetTags.includes(tag))
      )
      break
    case 'all':
      // 匹配所有标签：应用的标签中包含目标标签中的所有标签
      result = workflows_all.value.filter(item => 
        targetTags.every(targetTag => item.tags?.includes(targetTag))
      )
      break
    case 'single':
    default:
      // 单标签匹配：应用的标签中包含指定的单个标签
      result = workflows_all.value.filter(item => item.tags?.includes(targetTags[0]))
      break
  }
  
  filteredResultCache.value.set(cacheKey, result)
  console.log(`Filtering showApps by mode="${props.filterMode}", tags="${targetTags.join(',')}", found:`, result.length)
  return result
})

// 创建瀑布流的key，确保标签切换时强制重新渲染
const waterfallKey = computed(() => {
  const targetTags = props.showTags.length > 0 ? props.showTags.join(',') : props.showTag
  return `waterfall-${props.filterMode}-${targetTags}-${showApps.value.length}`
})

// 顶部 3 个应用（左大右小）与其余应用
const topApps = computed(() => {
  return showApps.value.slice(0, 3)
})

const remainingApps = computed(() => {
  return showApps.value.length > 3 ? showApps.value.slice(3) : []
})

// 防抖重置瀑布流
const debouncedResetWaterfall = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    isWaterfallReady.value = false
    nextTick(() => {
      setTimeout(() => {
        isWaterfallReady.value = true
      }, 50)
    })
  }, 100) as any
}

// 图片加载状态管理
const imageLoadStates = ref(new Map<string, boolean>())
const loadedImageCount = ref(0)

// 强制更新瀑布流布局
const forceUpdateWaterfall = () => {
  // 由于forceUpdate方法不存在，我们通过重新渲染来解决
  isWaterfallReady.value = false
  nextTick(() => {
    setTimeout(() => {
      isWaterfallReady.value = true
      console.log('Waterfall re-rendered')
    }, 50)
  })
}

// 防抖更新瀑布流
let updateTimer: number | null = null
const debouncedUpdateWaterfall = () => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  updateTimer = setTimeout(() => {
    forceUpdateWaterfall()
  }, 200) as any
}

// 处理图片加载完成
const handleImageLoad = (itemId: string) => {
  if (!imageLoadStates.value.get(itemId)) {
    imageLoadStates.value.set(itemId, true)
    loadedImageCount.value++
    console.log(`Image loaded: ${itemId}, total loaded: ${loadedImageCount.value}`)
    
    // 使用防抖更新，避免频繁重新渲染
    debouncedUpdateWaterfall()
  }
}

// 处理图片加载错误
const handleImageError = (itemId: string) => {
  console.warn(`Image load error: ${itemId}`)
  if (!imageLoadStates.value.get(itemId)) {
    imageLoadStates.value.set(itemId, true)
    loadedImageCount.value++
    
    // 使用防抖更新
    debouncedUpdateWaterfall()
  }
}

// 处理视频加载完成
const handleVideoLoad = (itemId: string) => {
  console.log(`Video loaded: ${itemId}`)
  debouncedUpdateWaterfall()
}

// 重置图片加载状态
const resetImageLoadStates = () => {
  imageLoadStates.value.clear()
  loadedImageCount.value = 0
}

// 监听数据变化，重置瀑布流
watch([showApps, () => props.showTag, () => props.showTags, () => props.filterMode], () => {
  if (!isLoading.value) {
    resetImageLoadStates()
    // 数据变化时使用防抖更新
    debouncedUpdateWaterfall()
  }
}, { deep: true, immediate: false })

const appStore = useAppStore()
const logo = 'https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250521115157378-no.png'

// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex = 0 // 清除当前选中的标签栏索引
  uni.navigateTo({url: `/pages/draw/apps/apps?id=${item._id}`});// 跳转到应用详情页面
}

// 瀑布流初始化完成回调
const handleWaterfallInit = () => {
  console.log('Waterfall initialized')
}

// 瀑布流布局完成回调
const handleWaterfallEnd = () => {
  console.log('Waterfall layout completed')
}
</script>

<template>
  <!-- 标题栏 -->
  <view class="title-bar">
    <text class="title-text">AI团队</text>
    
  </view>
  
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">正在加载应用...</text>
    </view>
    
    <!-- 调试信息 -->
    <!-- <view v-if="!isLoading" style="padding: 20rpx; background: #f0f0f0; margin: 10rpx; border-radius: 10rpx;">
      <text style="font-size: 24rpx; color: #666;">
        调试信息: 总数据{{workflows_all?.length || 0}}个，筛选后{{showApps.length}}个，标签"{{props.showTag}}"
      </text>
    </view> -->
    
    <!-- 顶部 3 格布局（左大右小） -->
    <view v-if="!isLoading && showApps.length > 0" class="top-layout">
      <view class="top-grid">
        <view v-if="topApps[0]" class="tile left-large" @click="handleNavigate(topApps[0])">
          <image v-if="!isVideo(topApps[0].cover)" :src="topApps[0].cover" mode="aspectFill" class="tile-image"/>
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
            <image v-if="!isVideo(topApps[1].cover)" :src="topApps[1].cover" mode="aspectFill" class="tile-image"/>
            <video v-else :src="topApps[1].cover" autoplay loop muted object-fit="cover" class="tile-video"/>
            <view class="tile-overlay">
              <view class="tile-label">{{ topApps[1].title || topApps[1].name || '应用' }}</view>
              <view v-if="topApps[1].tags && topApps[1].tags.length > 0" class="tile-tags">
                <text v-for="tag in topApps[1].tags.slice(0, 2)" :key="tag" class="tile-tag">{{ tag }}</text>
              </view>
            </view>
          </view>

          <view v-if="topApps[2]" class="tile right-bottom" @click="handleNavigate(topApps[2])">
            <image v-if="!isVideo(topApps[2].cover)" :src="topApps[2].cover" mode="aspectFill" class="tile-image"/>
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

      <!-- 如果还有剩余应用，使用小型瀑布或列表展示 -->
      <fui-waterfall 
        v-if="isWaterfallReady && remainingApps.length > 0"
        :key="`rest-${waterfallKey}`"
        style="margin-top: 30rpx; margin-bottom:130rpx; padding: 0 20rpx;"
        @init="handleWaterfallInit"
        @end="handleWaterfallEnd"
      >
        <fui-waterfall-item v-for="(item, index) in remainingApps" :key="`${item._id}-rest-${index}`">
          <view class="waterfall-data" @click="handleNavigate(item)">
            <video 
              class="video" 
              v-if="isVideo(item.cover)"
              autoplay
              loop
              muted
              style="width:100%;"
              object-fit="cover"
              :controls="false"
              :src="item.cover"
              @loadeddata="() => handleVideoLoad(item._id)"
              @error="() => handleImageError(item._id)"
            />
            <image 
              class="image" 
              v-else 
              :src="item.cover" 
              mode="widthFix" 
              @load="() => handleImageLoad(item._id)"
              @error="() => handleImageError(item._id)"
              :lazy-load="true"
              :fade-show="true"
            />
          </view>
        </fui-waterfall-item>
      </fui-waterfall>
    </view>
    
    <!-- 无数据状态 -->
    <view v-else-if="!isLoading && showApps.length === 0" class="empty-container">
      <text class="empty-text">暂无应用数据</text>
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

.waterfall-data {
  width: calc(100% - 20rpx);
  margin: 10rpx;
  border-radius: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(200, 199, 204, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  background: #fff;

  .image {
    width: 100%;
    height: auto;
    border-radius: 15rpx;
    display: block;
    // 防止图片加载时闪烁
    background-color: #f5f5f5;
  }

  .video {
    border-radius: 15rpx;
    display: block;
    background-color: #000;
  }
  
  // 添加点击反馈
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  // 鼠标悬停效果（H5端）
  &:hover {
    box-shadow: 0 4rpx 16rpx rgba(200, 199, 204, 0.4);
    transform: translateY(-2rpx);
  }
}

/* 标题栏样式 */
.title-bar {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 20rpx 25rpx 15rpx 25rpx;
  
  .title-text {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
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
    padding: 15rpx 20rpx 10rpx 20rpx;
    
    .title-text {
      font-size: 36rpx;
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