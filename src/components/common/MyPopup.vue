<script setup lang="ts">
import TnPopup from '@tuniao/tnui-vue3-uniapp/components/popup/src/popup.vue'
const showPopup = defineModel({default:false})
</script>

<template>
	<!-- <fui-bottom-popup  :show="showPopup" > -->
		
  <TnPopup
 top="100rpx"
      style="z-index: 100"
      v-model="showPopup"
      close-btn
      width="100%" height="100%">
	 
    <slot name="default">
      <view class="tn-p-lg"> 弹框内容 </view>
    </slot>

  </TnPopup>
  <!-- </fui-bottom-popup> -->
</template>

<style scoped lang="scss">

</style>