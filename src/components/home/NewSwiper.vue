<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import type {IBanner, IMiniProgramContent, IPageContent} from "@/types";
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
const isLoading = ref(false)
const errorMessage = ref('')

const pageContent=ref<IMiniProgramContent | null>(null);
const fullPageContent=ref<IPageContent | null>(null);
const appStore = useAppStore();

// 移除默认轮播图数据 - 只从接口获取

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
      // 使用更安全的方式获取页面类型
      // @ts-ignore - uniapp页面实例可能包含自定义属性
      return currentPage.type || currentPage.route?.split('/')?.[1] || 'home'
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
    isLoading.value = true;
    errorMessage.value = '';
    
    // 如果不是强制刷新，先尝试从缓存获取
    if (!forceRefresh) {
      try {
        const cachedData = uni.getStorageSync(currentCacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // 检查缓存是否过期
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            pageContent.value = data;
            console.log('使用缓存数据:', data);
            return;
          } else {
            console.log('缓存已过期，将获取新数据');
          }
        }
      } catch (cacheError) {
        console.error('读取缓存失败:', cacheError);
      }
    }
    
    // 缓存不存在或已过期，从服务器获取新数据
    console.log('从服务器获取新数据');
    fullPageContent.value = await getPageContent();
    
    // 验证响应数据
    if (!fullPageContent.value) {
      throw new Error('服务器返回空数据');
    }
    
    console.log('[轮播图] API返回的完整数据:', fullPageContent.value);
    
    // 尝试多种可能的数据路径
    let miniProgramData = null;
    
    // 路径1: fullPageContent.page_content.miniProgramContent (标准结构)
    if (fullPageContent.value.page_content?.miniProgramContent) {
      miniProgramData = fullPageContent.value.page_content.miniProgramContent;
      console.log('[轮播图] 使用路径1: page_content.miniProgramContent');
    }
    // 路径2: fullPageContent 直接就是 miniProgramContent (缓存或简化返回)
    else if ((fullPageContent.value as any).home_banner && Array.isArray((fullPageContent.value as any).home_banner)) {
      miniProgramData = fullPageContent.value as any;
      console.log('[轮播图] 使用路径2: 数据本身就是 miniProgramContent');
    }
    
    if (!miniProgramData || !miniProgramData.home_banner || !Array.isArray(miniProgramData.home_banner)) {
      console.warn('[轮播图] 无法找到有效的轮播图数据');
      pageContent.value = {
        home_banner: []
      };
    } else {
      // 直接使用 miniProgramContent 数据
      const plainData = JSON.parse(JSON.stringify(miniProgramData));
      pageContent.value = plainData;
      console.log('[轮播图] 数据加载成功，数量:', plainData.home_banner.length);
    }
    
    // 将新数据存入缓存
    try {
      uni.setStorageSync(currentCacheKey, JSON.stringify({
        data: pageContent.value,
        timestamp: Date.now()
      }));
      console.log('数据已缓存:', pageContent.value);
    } catch (saveError) {
      console.error('保存缓存失败:', saveError);
    }
  } catch (error) {
    console.error('获取页面内容失败:', error);
    errorMessage.value = '数据加载失败，请稍后重试';
    
    // 不再使用缓存回退，直接显示错误状态以便用户重试
    pageContent.value = {
      home_banner: []
    };
  } finally {
    isLoading.value = false;
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
  errorMessage.value = '';
  await fetchPageContent(true);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 1000);
};

// 取所有轮播图数据,不限制数量
const swiperData = computed(() => {
  const content = pageContent.value;
  if (!content) {
    console.log('pageContent.value为null或undefined，返回空数组');
    return [];
  }

  const bannerSource = Array.isArray((content as any).home_banner)
    ? (content as any).home_banner
    : [];

  if (bannerSource.length === 0) {
    console.log('服务器返回空轮播数据');
    return [];
  }

  const result: { url: string; title?: string; href?: string }[] = [];
  bannerSource.forEach((item: IBanner | Record<string, any> | string) => {
    const candidate = typeof item === 'string' ? { src: item } : item;
    const url =
      (candidate as any)?.src ||
      (candidate as any)?.url ||
      (candidate as any)?.image ||
      (candidate as any)?.imageUrl ||
      (candidate as any)?.cover ||
      (candidate as any)?.pic ||
      (candidate as any)?.bannerUrl;

    if (!url) {
      console.warn('[轮播图] 跳过无效 banner 项:', candidate);
      return;
    }

    result.push({
      url,
      title: (candidate as any)?.label || (candidate as any)?.title || '',
      href: (candidate as any)?.href || (candidate as any)?.link || ''
    });
  });

  console.log('处理后的轮播数据:', result);
  return result;
});

</script>

<template>
  	<view style='margin-top: 0%;'>
 			<!-- 显示轮播图 -->
      <swiper v-if="!isLoading && swiperData && swiperData.length" 
				easing-function='default' 
				previous-margin='30rpx' 
				next-margin='30rpx'
 				class="fui-banner__wrap2"  
				circular 
				:indicator-dots="true"
				indicator-color="rgba(255, 255, 255, 0.5)"
				indicator-active-color="#ffffff"
				autoplay 
				:interval="3000"
				:duration="500">
        <swiper-item v-for="(item,index) in swiperData" :key="index">
          <view class="fui-banner__item2">
            <image
              :src="item.url"
              class="banner-image"
              mode="aspectFill"
              :lazy-load="true"
              show-menu-by-longpress
            />
          </view>
        </swiper-item>
 			</swiper>
 			
			<!-- 加载状态 -->
 			<view v-else-if="isLoading" class="loading-container">
				<text>加载轮播图中...</text>
			</view>
			
			<!-- 空状态 - 当数据加载完成但没有轮播图时 -->
			<view v-else-if="!isLoading && (!swiperData || swiperData.length === 0)" class="empty-container">
				<text>暂无轮播图</text>
				<button @click="refreshData" class="retry-button">重新加载</button>
			</view>
			
			<!-- 错误状态 -->
			<view v-else-if="errorMessage && !isRefreshing" class="error-container">
				<text>{{errorMessage}}</text>
				<button @click="refreshData" class="retry-button">重试</button>
			</view>
  	</view>
</template>

<style scoped lang="scss">
	.fui-banner__wrap2 {
		background-color: transparent;
		align-items: center;
		width: 100%;
		height: 280rpx;
		padding: 0;
		box-sizing: border-box;
	}
	
  .fui-banner__item2 {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
  }

  .banner-image {
    width: 100%;
    height: 100%;
    display: block;
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

	.loading-container, .error-container, .empty-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 260rpx;
		background-color: #f5f5f5;
		border-radius: 28rpx;
		color: #666;
		font-size: 28rpx;
	}
	
	.error-container {
		background-color: #fef0f0;
		color: #f56c6c;
	}
	
	.empty-container {
		background-color: #f9f9f9;
		color: #999;
	}
	
	.retry-button {
		margin-top: 20rpx;
		padding: 10rpx 30rpx;
		background-color: #007aff;
		color: white;
		border-radius: 30rpx;
		font-size: 24rpx;
		border: none;
	}
	
	.error-container .retry-button {
		background-color: #f56c6c;
	}
	
	.empty-container .retry-button {
		background-color: #999;
	}
</style>
