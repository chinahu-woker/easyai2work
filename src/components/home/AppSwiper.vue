<script setup lang="ts">
import TnSwiper from '@tuniao/tnui-vue3-uniapp/components/swiper/src/swiper.vue'
import {ref, reactive, computed} from 'vue'
import type {IBanner, IMiniProgramContent} from "@/types";
import {getPageContent} from "@/composables/useCommon.ts";
import {onLoad} from "@dcloudio/uni-app";

const currentSwiperIndex = ref(0)

// 轮播图数据
// const swiperData1 = [
//   'https://www.sctu.edu.cn/images/banner121500.jpg',
//   'https://www.sctu.edu.cn/images/banner121500.jpg',
//   'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new.jpg',
//   'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new1.png',
// ]


// const swiperData = reactive([{
//   url: 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/ComfyUI_temp_urfvg_00032_.png',
//   title: 'x14',
//   poster: 'https://resource.tuniaokj.com/images/xiongjie/x14.jpg'
// }, {
//   url: 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/ComfyUI_temp_alvso_00018_.png',
//   title: 'xiong-3d-2',
//   poster: 'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-2.jpg'
// }, {
//   url: 'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new.jpg',
//   title: 'xiong-3d-new',
//   poster: 'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new.jpg'
// }, {
//   url: 'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new1.png',
//   title: 'xiong-3d-new1',
//   poster: 'https://resource.tuniaokj.com/images/xiongjie/xiong-3d-new1.png'
// }])

				
const pageContent=ref<IMiniProgramContent>()
onLoad(async ()=>{
  pageContent.value=await getPageContent()
})

const swiperData=computed(()=>{
	
  return pageContent.value?.home_banner.map(item =>{
    return {
      url: item.src,
      title: item.label,
    }
  })
})

</script>

<template>
  <!-- <view class="swiper-container"> -->
<!--      <TnSwiper-->
<!--          v-model="currentSwiperIndex"-->
<!--          :data="swiperData1"-->
<!--          autoplay-->
<!--          width="100%"-->
<!--          height="600rpx"-->
<!--      >-->
<!--        <template #default="{ data }">-->
<!--          <view class="swiper-data">-->
<!--            <image class="image" :src="data" mode="aspectFill" />-->
<!--          </view>-->
<!--        </template>-->
<!--      </TnSwiper>-->
<!--    <up-swiper
        :list="swiperData"
        imgMode="aspectFill"
        height="280"
        indicator
        indicatorMode="line"
        circular
        radius="0"
        keyName="url"
        indicatorStyle="bottom"
    ></up-swiper> -->
  <!-- </view> -->

  	<view style='margin-top: 0%;' >
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
		width: 780rpx;
		height: 450rpx;
		margin-left: 0%;
		margin-right: 0%;
	}
	.fui-banner__item2 {
		background-size: cover;
		height: 450rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 600;
		border-radius: 25rpx;
		margin-left: 2%;
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