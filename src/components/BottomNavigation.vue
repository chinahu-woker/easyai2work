<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore.ts";
import { onMounted, ref } from 'vue';

const TAB_STORAGE_KEY = 'currentTab'
const PAGE_ROUTES = [
  '/pages/index/index',
  '/pages/creative/creative',
  '/pages/setting/setting'
]

const { tabbarIndex } = storeToRefs(useAppStore())
const currentTab = ref(0)
const tabbarData = [
  {
    name: '首页',
    icon: 'home',
    activeIcon: 'write-fill'
  },
  {
    name: '创意',
    icon: 'edit-pen',
    activeIcon: 'shop-fill'
  },
  {
    name: '我的',
    icon: 'account',
    activeIcon: 'my-circle-fill'
  }
]

const resolveIndex = (payload: number | { index?: number }) => {
  if (typeof payload === 'number') {
    return payload
  }
  if (payload && typeof payload.index === 'number') {
    return payload.index
  }
  return Number.NaN
}

const navigateByIndex = (index: number) => {
  const target = PAGE_ROUTES[index]
  if (!target) {
    return
  }
  const url = `${target}?currentTab=${index}`
  if (index === 0) {
    uni.reLaunch({ url })
  } else {
    uni.redirectTo({ url })
  }
}

const updateState = (index: number) => {
  if (index < 0 || index >= PAGE_ROUTES.length) {
    return
  }
  currentTab.value = index
  tabbarIndex.value = index
  uni.setStorageSync(TAB_STORAGE_KEY, index)
}

const changeHomePage = (payload: number | { index?: number }) => {
  const nextIndex = resolveIndex(payload)
  if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= PAGE_ROUTES.length) {
    return
  }
  if (nextIndex === currentTab.value) {
    return
  }
  updateState(nextIndex)
  navigateByIndex(nextIndex)
}

onMounted(() => {
  const storedValue = uni.getStorageSync(TAB_STORAGE_KEY)
  const parsed = typeof storedValue === 'number' ? storedValue : parseInt(storedValue, 10)
  if (!Number.isNaN(parsed) && parsed >= 0 && parsed < PAGE_ROUTES.length) {
    updateState(parsed)
  }
})
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
                :center="false" :short="true" :scroll='false' itemPadding="25" :height='400' :current="currentTab"
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