<script setup lang="ts">
import {computed, onMounted, ref, nextTick, shallowRef} from 'vue';
import TnWaterFall from "@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.vue";
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';

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

// 从应用状态管理中解构出工作流数据、当前激活的标签索引和标签列表
const {workflows_all, home_tagActiveIndex, home_tagsList} = storeToRefs(useAppStore())

// 获取瀑布流元素的引用
const waterfallElement = ref()

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 使用 computed 计算展示的应用列表，避免重复和手动管理响应式数据
const showApps = computed<IWorkFlow[]>(() => {
  // 确保数据已加载
  if (!workflows_all.value?.length) {
    return []
  }
  
  const tagIndex = home_tagActiveIndex.value
  console.log('Computing showApps for tagIndex:', tagIndex)
  
  // 如果激活索引为0，则展示所有应用
  if (tagIndex === 0) {
    return workflows_all.value
  }
  
  // 筛选当前标签对应的应用，使用缓存避免重复计算
  const currentTag = home_tagsList.value[tagIndex] as any
  if (!currentTag?.name) {
    return []
  }
  
  const cacheKey = `${tagIndex}-${currentTag.name}-${workflows_all.value.length}`
  
  // 检查缓存
  if (filteredResultCache.value.has(cacheKey)) {
    console.log('Using cached result for tag:', currentTag.name)
    return filteredResultCache.value.get(cacheKey)!
  }
  
  // 计算新结果
  const result = workflows_all.value.filter(item => 
    item.tags?.includes(currentTag.name)
  )
  
  // 缓存结果（限制缓存大小）
  if (filteredResultCache.value.size > 10) {
    const firstKey = filteredResultCache.value.keys().next().value
    if (firstKey) {
      filteredResultCache.value.delete(firstKey)
    }
  }
  filteredResultCache.value.set(cacheKey, result)
  
  console.log('Computed and cached result:', result.length, 'items for tag:', currentTag.name)
  return result
})

// 创建瀑布流的key，确保标签切换时强制重新渲染
const waterfallKey = computed(() => {
  return `waterfall-${home_tagActiveIndex.value}-${showApps.value.length}`
})

const appStore = useAppStore()

// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex = 0 // 清除当前选中的标签栏索引
  // console.log("++++++++++++++++++++++++++++itemid++++++++++++++",item._id)	
  uni.navigateTo({url: `/pages/draw/apps/apps?id=${item._id}`});// 跳转到应用详情页面
}
</script>

<template>
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">正在加载应用...</text>
    </view>
    
    <!-- 使用 TnWaterFall 组件展示瀑布流布局的应用，使用key强制重新渲染 -->
    <TnWaterFall 
      v-else
      ref="waterfallElement" 
      :key="waterfallKey"
      :data="showApps" 
      style="margin-bottom:130rpx;">
      <!-- 左侧瀑布流内容插槽 -->
      <template #left="{ item }">
        <view class="waterfall-data" @click="handleNavigate(item)">
          <!-- 根据应用封面类型展示视频或图片 -->
          <video class="video" v-if="isVideo(item.cover)"
                 autoplay
                 loop
                 muted
                 style="width:100%;"
                 object-fit="cover"
                 :controls="false"
                 :src="item.cover" />
          <image class="image" v-else :src="item.cover" mode="widthFix" />
        </view>
      </template>
      <!-- 右侧瀑布流内容插槽 -->
      <template #right="{ item }">
        <view class="waterfall-data" @click="handleNavigate(item)">
          <!-- 根据应用封面类型展示视频或图片 -->
          <video class="video" v-if="isVideo(item.cover)"
                 autoplay
                 loop
                 muted
                 style="width:100%;"
                 object-fit="cover"
                 :controls="false"
                 :src="item.cover" />
          <image class="image" v-else :src="item.cover" mode="widthFix" />
        </view>
      </template>
    </TnWaterFall>
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

.waterfall-data {
  width: calc(100% - 20rpx);
  margin: 10rpx;
  border-radius: 15rpx;
  box-shadow: #c8c7cc;
  transition: all 0.3s ease;

  .image {
    width: 100%;
    height: auto;
    border-radius: 15rpx;
  }

  .video {
    border-radius: 15rpx;
  }
  
  // 添加点击反馈
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
}
</style>