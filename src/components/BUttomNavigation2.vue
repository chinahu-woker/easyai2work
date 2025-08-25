<script setup lang="ts">

import TnTabbarItem from "@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar-item.vue";
import TnTabbar from "@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar.vue";
import {storeToRefs} from "pinia";
import {useAppStore} from "@/stores/appStore.ts";
import { onMounted } from 'vue';


onMounted(() => {
    // 获取当前选中的 Tab 索引
    const currentTab = uni.getStorageSync('currentTab');
    if (currentTab !== undefined) {
		console.log('-++++++++++++++++++++++++++++++++++++++-',currentTab.value)
        currentTab2.value = currentTab;
    }
});	

const currentTab2 = 0  
const {tabbarIndex}=storeToRefs(useAppStore())

//处理导航栏点击事件
const changeHomePage = (index: number) => {
    tabbarIndex.value = index.index;
    console.log('index', tabbarIndex.value);

    let url = '';
    if (tabbarIndex.value === 0) {
        url = `/pages/index/index?currentTab=${tabbarIndex.value}`;
    } else if (tabbarIndex.value === 1) {
        url = `/pages/creative/creative?currentTab=${tabbarIndex.value}`;
    } else if (tabbarIndex.value === 2) {
        url = `/pages/setting/setting?currentTab=${tabbarIndex.value}`;
    }
	console.log(url)
    uni.redirectTo({
        url
    });
};

const handleTabbarClick = (index: number) => {
  console.log('index',index)
  tabbarIndex.value=index
  if(tabbarIndex.value===0){
	uni.navigateTo({
		url:'/pages/index/index'
	})
  //   uni.redirectTo ({
  //     url:'/pages/index/index'
  //   })
  }
  else if(tabbarIndex.value===1){
	  uni.navigateTo({
	  	url:'/pages/creative/creative'
	  })
    // uni.redirectTo ({
    //   url:'/pages/creative/creative'
    // })
  }else if(tabbarIndex.value===2){
	  uni.navigateTo({
	  	url:'/pages/setting/setting'
	  })
    // uni.redirectTo ({
    //   url:'/pages/setting/setting'
    // })
  }
}

// 导航栏数据
const tabbarData = [
  {
    name: '首页',
    icon: 'home',
    activeIcon: 'write-fill',
    to: '/pages/index/index',
    onClick: handleTabbarClick
  },
  {
    name: '创意',
    icon: 'edit-pen',
    activeIcon: 'shop-fill',
    to:'/pages/creative/creative',
    onClick:handleTabbarClick
  },
  {
    name: '我的',
    icon: 'account',
    activeIcon: 'my-circle-fill',
    onClick:handleTabbarClick,
  }
]



const handleChange = (index: number) => {
  console.log(index);
}
const handleClick = (index: number) => {
  console.log('click');
}

</script>

<template>
  <!--  底部导航-->
<!--  <TnTabbar v-model="currentTabbar" fixed @change="handleChange" @click="handleClick">-->
<!--    <TnTabbarItem-->
<!--        @click="handleClick"-->
<!--        v-for="(item, index) in tabbarData"-->
<!--        :key="index"-->
<!--        :icon="item.icon"-->
<!--        :active-icon="item.activeIcon"-->
<!--        :text="item.name"-->
<!--    />-->
<!--  </TnTabbar>-->
<view style="margin-top: 10%; margin-bottom: 10%;">

						<fui-nav-bar custom background>
							<view class="fui-search__box ">
								<fui-tabs class="tabs_class" direction='column' color='#ACB0D0' :isSlider='false'
									selectedColor='#17135F' :tabs="tabbarData" scale='1.5' @change="changeHomePage"
									:center="false" :short="true" :scroll='false' itemPadding="25" :height='400' :current="currentTab2"
									size='28' fontWeight='900' background></fui-tabs>

							</view>

							

						</fui-nav-bar>

					</view>

  <!-- <up-tabbar
      :value="tabbarIndex"
      :fixed="true"
      :placeholder="false"
      :safeAreaInsetBottom="false"
  >

			
      <up-tabbar-item :text="item.name" :icon="item.icon" @click="item.onClick" ></up-tabbar-item>
    </template> 
  </up-tabbar> -->
</template>

<style scoped lang="scss">
	.fui-search__box {
	
		background: transparent;
		width: 520rpx;
		height: 48px;
		margin-left: -0%;
		box-sizing: border-box;
	
		border-radius: 0px;
		display: flex;
		align-items: center;
		justify-content: left;}
	
	
	
	
	.tabs_class {
		
		margin-top: -40%;
	}

</style>