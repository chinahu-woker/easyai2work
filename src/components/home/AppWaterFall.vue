<script setup lang="ts">
import {computed, onMounted, ref, watch, watchEffect} from 'vue';
import TnWaterFall from "@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.vue";
import {useAppStore} from "@/stores/appStore.ts";
import {storeToRefs} from "pinia";
import {isVideo} from "@/utils/common.ts";
import type { IWorkFlow } from '@/types';

// 组件挂载时初始化工作流数据并获取需要展示的应用
onMounted(() => {
  useAppStore().initWorkFlows_All().then(()=>getshowApps())
})

// 从应用状态管理中解构出工作流数据、当前激活的标签索引和标签列表
const {workflows_all, home_tagActiveIndex, home_tagsList} = storeToRefs(useAppStore())

// 获取瀑布流元素的引用
const waterfallElement=ref()

// 定义展示的应用列表
const showApps=ref<IWorkFlow[]>()

// 根据当前激活的标签获取需要展示的应用
const getshowApps = ()=>{
  console.log('home_tagActiveIndex', home_tagActiveIndex.value)
  if (home_tagActiveIndex.value === 0) {
    showApps.value= [...workflows_all.value] // 如果激活索引为0，则展示所有应用
    return
  }
  // 筛选当前标签对应的应用
  const result = workflows_all.value.filter(item => item.tags?.includes(home_tagsList.value[home_tagActiveIndex.value].name))
  console.log('result', result)
  showApps.value=[...result] // 更新展示的应用列表
}

// 监听当前激活的标签索引变化，重置瀑布流并重新获取需要展示的应用
watch(home_tagActiveIndex,()=>{
  if(waterfallElement.value){
    waterfallElement.value.reset() // 重置瀑布流
  }
  getshowApps() // 重新获取需要展示的应用
})

const appStore=useAppStore()

// 跳转到指定应用的详情页面
const handleNavigate = (item: IWorkFlow) => {
  appStore.tabbarIndex=null // 清除当前选中的标签栏索引
  // console.log("++++++++++++++++++++++++++++itemid++++++++++++++",item._id)	
  uni.navigateTo({url: `/pages/draw/apps/apps?id=${item._id}`});// 跳转到应用详情页面
}
</script>

<template>
    <!-- 使用 TnWaterFall 组件展示瀑布流布局的应用 -->
    <TnWaterFall ref="waterfallElement" :data="showApps" style="margin-bottom:130rpx;">
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
.waterfall-data {
  width: calc(100% - 20rpx);
  margin: 10rpx;
  border-radius: 15rpx;
  box-shadow: #c8c7cc;

  .image {
    width: 100%;
    height: auto;
  }

  .video {
    border-radius: 15rpx;
  }
}
</style>