<script setup lang="ts">


// import TaskExcuting from "@/components/common/TaskExcuting.vue";
// import BottomNavigation from "@/components/BottomNavigation.vue";
// import PaymentPopup from "@/components/home/PaymentPopup.vue";
// import MyBackToTop from "@/components/common/MyBackToTop.vue";
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/appStore.ts';
const {showPay}=storeToRefs(useAppStore())

import TaskExcuting from "@/components/common/TaskExcuting.vue";
import BottomNavigation from "@/components/BottomNavigation.vue";
import PaymentPopup from "@/components/home/PaymentPopup.vue";
import MyBackToTop from "@/components/common/MyBackToTop.vue";



</script>

<template>
  <view class="baseLayoutContainer">
    <slot></slot>
    <!-- <BottomNavigation/> -->
    <TaskExcuting/>
    <PaymentPopup v-if="showPay"/>
    <MyBackToTop/>
  </view>
</template>

<style scoped lang="scss">
.baseLayoutContainer{
}

</style>