<script setup lang="ts">
import TnSwiper from '@tuniao/tnui-vue3-uniapp/components/swiper/src/swiper.vue'
import {ref, reactive, computed} from 'vue'
import type {IBanner, IMiniProgramContent} from "@/types";
import {getPageContent} from "@/composables/useCommon.ts";
import {onLoad} from "@dcloudio/uni-app";

const currentSwiperIndex = ref(0)


				
const pageContent=ref<IMiniProgramContent>()
onLoad(async ()=>{
  pageContent.value=await getPageContent()
})

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
  

  	<view style='margin-top: 0%;' v-if="swiperData && swiperData.length">
 			<swiper easing-function='default' previous-margin='20rpx' next-margin='60rpx'
 				class="fui-banner__wrap2"  circular :indicator-dots="false" autoplay>
 				<swiper-item v-for="(item,index) in swiperData" :key="index">
 					<view class="fui-banner__item2"
 						:style="{'background-image':'url('+ item.url +')' }">
 			
 					</view>
 					<view class="SwTitle2"> {{item.title}}</view>
 				</swiper-item>
 			</swiper>
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

</style>