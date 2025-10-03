<script setup lang="ts">
import {computed, onMounted, ref, nextTick, shallowRef, watch, onBeforeUnmount} from 'vue';
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';
import { payWorkProps } from '@/cofigs/data/globalAppData.ts'

// 加载状态
const isLoading = ref(true)

// 组件挂载时初始化工作流数据
onMounted(async () => {
  try {
    isLoading.value = true
    await useAppStore().initWorkFlows_All()
  } catch (error) {
    console.error('NewWaterFall: 初始化失败', error)
  } finally {
    isLoading.value = false
  }
})

// 清理定时器
onBeforeUnmount(() => {
  // 原生实现不需要特殊的清理逻辑
})

// 从应用状态管理中解构出工作流数据、当前激活的标签索引和标签列表
const {workflows_all, home_tagActiveIndex, home_tagsList} = storeToRefs(useAppStore())

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 瀑布流布局算法：双列自适应高度
const waterfallColumns = ref<IWorkFlow[][]>([[], []])
const columnHeights = ref([0, 0])
const columnItemHeights = ref<Map<string, number>>(new Map())

// 计算瀑布流双列布局
const calculateWaterfallLayout = () => {
  // 重置列状态
  waterfallColumns.value = [[], []]
  columnHeights.value = [0, 0]
  
  showApps.value.forEach((item, index) => {
    // 找到高度较小的列
    const shortestColumnIndex = columnHeights.value[0] <= columnHeights.value[1] ? 0 : 1
    
    // 添加到该列
    waterfallColumns.value[shortestColumnIndex].push(item)
    
    // 估算高度（图片默认高度 + 间距）
    const estimatedHeight = columnItemHeights.value.get(item._id) || 300
    columnHeights.value[shortestColumnIndex] += estimatedHeight + 20 // 20rpx间距
  })
}

// 记录实际加载的图片高度，用于更精确的布局计算
const updateItemHeight = (itemId: string, height: number) => {
  columnItemHeights.value.set(itemId, height)
  // 重新计算布局
  nextTick(() => {
    calculateWaterfallLayout()
  })
}

// 支持通过 prop 指定要显示的标签（默认：热门应用）
const props = defineProps({
  showTag: { type: String, default: payWorkProps.showTag }
})

// 只展示标签包含指定 showTag 的卡片
const showApps = computed<IWorkFlow[]>(() => {
  if (!workflows_all.value?.length) return []
  const tag = props.showTag
  
  // 使用缓存避免重复计算
  const cacheKey = `${tag}-${workflows_all.value.length}`
  if (filteredResultCache.value.has(cacheKey)) {
    return filteredResultCache.value.get(cacheKey)!
  }
  
  const result = workflows_all.value.filter(item => item.tags?.includes(tag))
  filteredResultCache.value.set(cacheKey, result)
  return result
})

// 监听数据变化重新计算布局
watch(showApps, () => {
  calculateWaterfallLayout()
}, { immediate: true })

// 图片加载状态管理
const imageLoadStates = ref(new Map<string, boolean>())
const loadedImageCount = ref(0)
const firstBatchCount = 6
const firstBatchLoaded = ref(0)
let firstBatchRefreshed = false
const loadedOrErroredIds = new Set<string>()

// 处理媒体加载完成 - 统一的媒体加载处理函数
function handleMediaSettled(id: string, status: 'ok' | 'err') {
  if (!loadedOrErroredIds.has(id)) {
    loadedOrErroredIds.add(id)
    if (loadedOrErroredIds.size <= firstBatchCount) {
      firstBatchLoaded.value++
      if (firstBatchLoaded.value === Math.min(firstBatchCount, showApps.value.length) && !firstBatchRefreshed) {
        calculateWaterfallLayout()
        firstBatchRefreshed = true
      }
    } else {
      // 重新计算布局
      calculateWaterfallLayout()
    }
  }
}

// 处理图片加载完成
const handleImageLoad = (itemId: string, event?: any) => {
  if (!imageLoadStates.value.get(itemId)) {
    imageLoadStates.value.set(itemId, true)
    loadedImageCount.value++
    
    // 记录实际图片高度用于布局优化
    if (event && event.detail && event.detail.height) {
      updateItemHeight(itemId, event.detail.height)
    }
    
    // 调用统一的媒体加载处理
    handleMediaSettled(itemId, 'ok')
  }
}

// 处理图片加载错误
const handleImageError = (itemId: string) => {
  console.warn(`Image load error: ${itemId}`)
  if (!imageLoadStates.value.get(itemId)) {
    imageLoadStates.value.set(itemId, true)
    loadedImageCount.value++
    // 调用统一的媒体加载处理
    handleMediaSettled(itemId, 'err')
  }
}

// 处理视频加载完成
const handleVideoLoad = (itemId: string) => {
  // 调用统一的媒体加载处理
  handleMediaSettled(itemId, 'ok')
}

// 重置图片加载状态 - 统一的重置函数
const resetImageLoadStates = () => {
  imageLoadStates.value.clear()
  loadedImageCount.value = 0
  firstBatchLoaded.value = 0
  firstBatchRefreshed = false
  loadedOrErroredIds.clear()
}

// 监听数据变化，重置图片加载状态
watch([showApps, () => props.showTag], () => {
  if (!isLoading.value) {
    resetImageLoadStates()
    // 重新计算布局
    calculateWaterfallLayout()
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
    <text style="font-size: 40rpx; margin-left: 25rpx; margin-bottom: 15rpx;" >热门应用</text>
  <fui-icon custom-prefix="iconfontIndex" name="icon-remen" size="45"></fui-icon>
  
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">正在加载应用...</text>
    </view>
    
    <!-- 调试信息（临时关闭以减少干扰） -->
    <!-- <view v-if="!isLoading" style="padding: 20rpx; background: #f0f0f0; margin: 10rpx; border-radius: 10rpx;">
      <text style="font-size: 24rpx; color: #666;">
        调试信息: 总数据{{workflows_all?.length || 0}}个，筛选后{{showApps.length}}个，标签"{{props.showTag}}"
      </text>
      <text style="font-size: 20rpx; color: #999; margin-top: 10rpx; display: block;">
        瀑布流状态: {{isWaterfallReady ? '已就绪' : '未就绪'}}, 已加载图片: {{loadedImageCount}}
      </text>
      <text v-if="showApps.length > 0" style="font-size: 20rpx; color: #999; margin-top: 5rpx; display: block;">
        第一个应用: {{showApps[0]?.name || '无名称'}}, Cover: {{showApps[0]?.cover || '无封面'}}
      </text>
    </view> -->
    
    <!-- 瀑布流内容 - 原生双列布局 -->
    <view v-if="!isLoading && showApps.length > 0" class="waterfall-container" style="margin-bottom:130rpx;">
      <!-- 左列 -->
      <view class="waterfall-column">
        <view
          v-for="(item, index) in waterfallColumns[0]"
          :key="`left-${item._id}-${index}`"
          class="waterfall-item"
          @click="handleNavigate(item)"
        >
          <view class="waterfall-data">
            <!-- 视频内容 -->
            <video 
              class="video" 
              v-if="item.cover && isVideo(item.cover)"
              autoplay
              loop
              muted
              style="width:100%; height: 200rpx;"
              object-fit="cover"
              :controls="false"
              :src="item.cover"
              @loadeddata="() => handleVideoLoad(item._id)"
              @error="() => handleImageError(item._id)"
            />
            
            <!-- 图片内容 -->
            <image 
              class="image" 
              v-else-if="item.cover" 
              :src="item.cover" 
              mode="widthFix" 
              style="width: 100%;"
              @load="(e) => handleImageLoad(item._id, e)"
              @error="() => handleImageError(item._id)"
              :lazy-load="false"
              :fade-show="true"
            />
            
            <!-- 无封面占位符 -->
            <view v-else class="no-cover-placeholder">
              <text style="color: #999; font-size: 24rpx;">暂无封面</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 右列 -->
      <view class="waterfall-column">
        <view
          v-for="(item, index) in waterfallColumns[1]"
          :key="`right-${item._id}-${index}`"
          class="waterfall-item"
          @click="handleNavigate(item)"
        >
          <view class="waterfall-data">
            <!-- 视频内容 -->
            <video 
              class="video" 
              v-if="item.cover && isVideo(item.cover)"
              autoplay
              loop
              muted
              style="width:100%; height: 200rpx;"
              object-fit="cover"
              :controls="false"
              :src="item.cover"
              @loadeddata="() => handleVideoLoad(item._id)"
              @error="() => handleImageError(item._id)"
            />
            
            <!-- 图片内容 -->
            <image 
              class="image" 
              v-else-if="item.cover" 
              :src="item.cover" 
              mode="widthFix" 
              style="width: 100%;"
              @load="(e) => handleImageLoad(item._id, e)"
              @error="() => handleImageError(item._id)"
              :lazy-load="false"
              :fade-show="true"
            />
            
            <!-- 无封面占位符 -->
            <view v-else class="no-cover-placeholder">
              <text style="color: #999; font-size: 24rpx;">暂无封面</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 无数据状态 -->
    <view v-else-if="!isLoading && showApps.length === 0" class="empty-container">
      <text class="empty-text">暂无应用数据</text>
    </view>
       
    <view style="height: 250rpx;"></view>
    
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  position: relative;
  z-index: 0; // 加载容器在背景层
  
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

/* 原生瀑布流布局样式 */
.waterfall-container {
  display: flex;
  padding: 10rpx;
  gap: 10rpx;
  box-sizing: border-box;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.waterfall-item {
  margin-bottom: 20rpx;
  width: 100%;
}

.waterfall-data {
  width: calc(100% - 20rpx);
  margin: 10rpx;
  border-radius: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(200, 199, 204, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  background: #fff;
  position: relative;
  z-index: 1; // 确保内容在骨架屏之上

  .image {
    width: 100%;
    height: auto;
    border-radius: 15rpx;
    display: block;
    // 防止图片加载时闪烁
    background-color: #f5f5f5;
    position: relative;
    z-index: 1; // 确保图片在骨架屏之上
  }

  .video {
    border-radius: 15rpx;
    display: block;
    background-color: #000;
    position: relative;
    z-index: 1; // 确保视频在骨架屏之上
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

// 无封面占位符样式
.no-cover-placeholder {
  width: 100%;
  height: 200rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 0; // 占位符在背景层
  border-radius: 15rpx;
}
</style>