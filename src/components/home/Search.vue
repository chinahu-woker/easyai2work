<script lang="ts" setup>
import { ref } from 'vue'

const searchValue = ref('')

const searchInputEvent = (value: string) => {
  // eslint-disable-next-line no-console
  console.log('searchInputEvent', value)
}
const searchBtnClickEvent = (value: string) => {
  // eslint-disable-next-line no-console
  console.log('searchBtnClickEvent', value)
}
</script>

<template>
	<view class='searchColor'>
  <up-search   placeholder="搜应用搜创意，一键直达" v-model="searchValue"></up-search>
  </view>
</template>

<style>
.search{
  /* margin: 0 50rpx 0 50rpx; */
  border-color:gray;
  
}
.searchColor{
	margin-left: 5%;
	margin-right: 5%;
	}
</style>