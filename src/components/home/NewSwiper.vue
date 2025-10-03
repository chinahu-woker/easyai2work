<script setup lang="ts">
import TnSwiper from '@tuniao/tnui-vue3-uniapp/components/swiper/src/swiper.vue'
import {ref, computed, onMounted} from 'vue'
import type {IBanner, IMiniProgramContent} from "@/types";
import {getPageContent} from "@/composables/useCommon.ts";
import {onLoad, onShow} from "@dcloudio/uni-app";
import { useAppStore } from '@/stores/appStore.ts'

// 定义props
const props = defineProps({
  pageType: {
    type: String,
    default: 'home'
  }
})

const currentSwiperIndex = ref(0)
const isRefreshing = ref(false)

const pageContent=ref<IMiniProgramContent>();
const appStore = useAppStore();

// 获取当前页面类型
const getCurrentPageType = () => {
  try {
    // 优先使用props中的pageType
    if (props.pageType && props.pageType !== 'home') {
      return props.pageType
    }
    
    // 从页面栈中获取当前页面信息
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      // 假设页面类型存储在页面实例的type属性中
      return currentPage.type || 'home'
    }
    return 'home'
  } catch (error) {
    console.error('获取页面类型失败:', error)
    return 'home'
  }
}

// 缓存键名 - 根据页面类型动态生成
const getCacheKey = () => {
  const pageType = getCurrentPageType()
  return `${pageType}_page_content`
}

// 缓存过期时间（毫秒）- 30分钟
const CACHE_EXPIRY = 30 * 60 * 1000;

// 获取页面内容的函数（带缓存）
const fetchPageContent = async (forceRefresh = false) => {
  // 获取当前缓存键
  const currentCacheKey = getCacheKey();
  
  try {
    // 如果不是强制刷新，先尝试从缓存获取
    if (!forceRefresh) {
      const cachedData = uni.getStorageSync(currentCacheKey);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // 检查缓存是否过期
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          pageContent.value = data;
          console.log('使用缓存数据');
          return;
        }
      }
    }
    
    // 缓存不存在或已过期，从服务器获取新数据
    console.log('从服务器获取新数据');
    pageContent.value = await getPageContent();
    
    // 将新数据存入缓存
    uni.setStorageSync(currentCacheKey, JSON.stringify({
      data: pageContent.value,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('获取页面内容失败:', error);
    // 如果请求失败，尝试使用缓存数据（即使已过期）
    const cachedData = uni.getStorageSync(currentCacheKey);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      pageContent.value = data;
      console.log('请求失败，使用过期缓存数据');
    }
  }
}

// 组件加载时获取数据
onLoad(async ()=>{
  await fetchPageContent();
});

// 页面显示时，只在没有数据时才获取
onShow(async ()=>{
  if (!pageContent.value) {
    await fetchPageContent();
  }
});

// 使用onMounted作为备用方案
onMounted(async ()=>{
  if (!pageContent.value) {
    await fetchPageContent();
  }
});

// 提供手动刷新的方法
const refreshData = async () => {
  isRefreshing.value = true;
  await fetchPageContent(true);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 1000);
};

// 只取第1到第3张（1-based），即索引0、1、2
const swiperData=computed(()=>{
  const arr = pageContent.value?.home_banner || []
  const result: {url?: string; title?: string}[] = []
  const indices: number[] = [0,1,2]
  indices.forEach((i: number) => {
    const item = arr[i]
    if (item && item.src) {
      result.push({ url: item.src, title: item.label })
    }
  })
  return result
})

</script>

<template>
  	<view style='margin-top: 0%;'>
 			<swiper v-if="swiperData && swiperData.length" easing-function='default' previous-margin='20rpx' next-margin='60rpx'
 				class="fui-banner__wrap2"  circular :indicator-dots="false" autoplay>
 				<swiper-item v-for="(item,index) in swiperData" :key="index">
 					<view class="fui-banner__item2"
 						:style="{'background-image':'url('+ item.url +')' }">
 			
 					</view>
 					<view class="SwTitle2"> {{item.title}}</view>
 				</swiper-item>
 			</swiper>
 			<view v-else class="loading-container">
				<text>加载中...</text>
			</view>
  	</view>
</template>

<style scoped lang="scss">
	.fui-banner__wrap2 {
		background-color: transparent;
		align-items: center;
		/* 设计稿 750, 直接 100% 占满容器，左右留 24rpx 内边距可由外层决定 */
		width: 800rpx;
		height: 260rpx; /* 略增高度，避免被圆角裁切感过重 */
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	.fui-banner__item2 {
		background-size: cover;
		background-position: center;
		height: 100%;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 600;
		border-radius: 28rpx;
		margin-left: 0;
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
		overflow: hidden;
	}
	// .SwTitle2 {
	// 	font-size: 20px;
	// 	margin-top: 4%;
	// 	/* background-color: blue; */
	// 	// margin-left: 5%;
		
	// 	text-align: center;
	// 	width: 300px;
	// 	/* 设置元素的宽度 */	
	// 	white-space: nowrap;
	// 	/* 保持文本在一行内 */
	// 	overflow: hidden;
	// 	/* 隐藏超出部分的内容 */
	// 	text-overflow: ellipsis;
	// 	/* 超出部分显示省略号 */
	
	// }

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 260rpx;
		background-color: #f5f5f5;
		border-radius: 28rpx;
	}
</style>