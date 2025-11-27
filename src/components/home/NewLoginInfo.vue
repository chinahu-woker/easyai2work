<template>
  <view class="page-container">
      <view class="user-info-container trans_back u-flex u-flex-y-center u-flex-around user-box u-p-l-30 u-p-r-20 u-p-b-30">
        <view class="u-m-r-10" @click="handleLogin">
          <up-avatar :src="user.avatar_url" :size="80">
          </up-avatar>
          <view v-if="!isLogin" class="tn-text-center tn-text-sm tn-gray-dark_text"
            style="position: relative;bottom: 0;">点击登录</view>
        </view>
        <view class="u-flex-1">
          <view v-if="isLogin" class="u-font-18 u-p-b-10 tn-text">昵称：{{ user.nickname }}</view>
          <view v-else class="u-font-18 u-p-b-10 tn-gray-dark_text">未登录</view>
          <!--        会员信息-->
          <view>
            <UserMemberInfo></UserMemberInfo>
          </view>
          <!--        完善用户信息-->
          <view v-if="isLogin" class="tn-text-xs tn-gray-dark_text">余额：{{ user.balance }}</view>
          <GetUserInfoPopup />
        </view>

        <view class="u-m-l-10 u-p-10" @click='scanQrLogin'>
          <up-icon :name="loginInfoIcons.scanIcon" color="#969799" size="28"></up-icon>
        </view>
        <view class="u-m-l-10 u-p-10" @click='toEmpty'>
          <up-icon :name="loginInfoIcons.arrowIcon" color="#969799" size="28"></up-icon>
        </view>
      </view>
      
      <!-- Banner图片 -->
      <view class="banner-container">
        <image @click="img2pay"
          class="banner-image"
          mode="scaleToFill"
          :src="loginInfoIcons.bannerImage">
        </image>
      </view>
      
      <view class="function-container u-m-t-20">
        <up-cell-group color='#fff' :border="false" class="trans_back">
          <!--        <up-cell icon="star" title="收藏(暂未开放)"></up-cell>-->

          <view v-if="isLogin" class="function-item">
            <up-cell :border='false' @click="handleGotoHistory">
              <template #icon>
                <up-icon size="30"
                  :name="loginInfoIcons.historyIcon"></up-icon>
              </template>
              <template #title>
                <text class="u-cell-text" style='color: #000000;'>绘图历史</text>
              </template>
            </up-cell>
          </view>

          <view class="function-item">
            <button class="customer-service-button"
              open-type="contact">
              <up-cell :border="false">
                <template #icon>
                  <up-icon size="30"
                    :name="loginInfoIcons.chatIcon"></up-icon>
                </template>
                <template #title>
                  <text class="u-cell-text" style='color: #000000;'>联系客服</text>
                </template>
              </up-cell>
            </button>
          </view>
          
          <view v-if="isLogin" class="function-item">
            <up-cell :border='false' @click="handleLoginOut">
              <template #icon>
                  <up-icon size="30"
                    :name="loginInfoIcons.logoutIcon"></up-icon>
                </template>
              <template #title>
                <text class="u-cell-text" style='color: #000000;'>退出登录</text>
              </template>
            </up-cell>
          </view>
          
          <view v-if='role' class="function-item">
            <up-cell :border='false' @click="ToConsole">
              <template #icon>
                  <up-icon size="30"
                    :name="loginInfoIcons.consoleIcon"></up-icon>
                </template>
              <template #title>
                <text class="u-cell-text" style='color: #000000;'>管理台</text>
              </template>
            </up-cell>
          </view>
          <!--        <up-cell icon="coupon" title="卡券(暂未开放)"></up-cell>-->
          <!--        <up-cell icon="heart" title="关注(暂未开放)"></up-cell>-->
        </up-cell-group>
        <!-- 	<button open-type="share">分享到微信</button> -->
      </view>
      
      <!-- 支付弹窗组件 -->
      <PaymentPopup v-if="showPay"/>
      <TaskExcuting/>
      <MyBackToTop/>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GetUserInfoPopup from "@/components/GetUserInfoPopup.vue";
import UserMemberInfo from "@/components/home/UserMemberInfo.vue";
import PaymentPopup from "@/components/home/PaymentPopup.vue";
import TaskExcuting from "@/components/common/TaskExcuting.vue";
import MyBackToTop from "@/components/common/MyBackToTop.vue";
import { isLogin, loginOut, refreshUserInfo, getLoginInfo } from "@/composables/useCommon.ts";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore.ts";
import { loginInfoIcons } from "@/cofigs/data/globalAppData.ts";

// 在模块顶层创建唯一的 appStore 实例，供文件内各处使用
const appStore = useAppStore()
const { showPay } = storeToRefs(appStore)

// 用户信息计算属性
const user = computed(() => {
  // 添加防止无限循环的条件判断
  if (!isLogin || !isLogin.value) {
    return {
      avatar_url: '',
      nickname: '未登录',
      balance: '0'
    }
  }
  
  // 登录状态下获取用户信息
  const info = getLoginInfo()
  
  // 显式设置默认值，防止undefined导致的响应式问题
  return {
    avatar_url: info && info.avatar_url ? info.avatar_url : '',
    nickname: info && info.nickname ? info.nickname : '未知用户',
    balance: info && info.balance ? info.balance : '0'
  }
})

// 角色信息
const role = ref(false)
const name_value = ref('我的')

// 处理登录
const handleLogin = async () => {
  // 如果已经登录，不跳转到登录页面，让用户查看个人信息
  if (isLogin.value) {
    return
  }

  // 未登录时跳转到登录页面
  uni.navigateTo({
    url: "/pages/login/login"
  })
}

// 扫码登录
const scanQrLogin = () => {
  if (!isLogin.value){
    // 提示并跳转到登录页，改善用户体验
    uni.showToast({ title: '请先登录', icon: 'none' })
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  // 直接调用扫码功能
  if (typeof uni.scanCode !== 'function') {
    uni.showToast({ title: '当前环境不支持扫码', icon: 'none' })
    return
  }
  
  uni.scanCode({
    success: async (res) => {
      const raw = res.result || ''
      let token = ''
      
      // 解析扫码结果
      if (/^https?:\/\//i.test(raw)) {
        try {
          const url = new URL(raw)
          token = url.searchParams.get('token') || url.searchParams.get('qr_token') || ''
          if (!token) {
            const hash = url.hash.replace(/^#/, '')
            if (hash.startsWith('token=')) token = hash.split('=')[1]
          }
        } catch (e) {
          // URL解析失败，当作纯token处理
        }
      }
      
      if (!token) token = raw.trim()
      if (!token) {
        uni.showToast({ title: '未识别到有效的登录码', icon: 'none' })
        return
      }
      
      // 跳转到扫码登录页面并传递token
      uni.navigateTo({
        url: `/pages/login/Qr_login?qr_token=${encodeURIComponent(token)}`
      })
    },
    fail: () => {
      uni.showToast({ title: '扫码失败', icon: 'none' })
    }
  })
}

// 空函数
const toEmpty = () => {
  // 需要登录后才能访问扫码登录页面（管理端扫码）
  if (!isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  // 跳转到扫码登录页面（二维码登录）
  uni.navigateTo({ url: '/pages/login/Qr_login' })
}

// 退出登录
const handleLoginOut = () => {
  uni.showLoading({
    title: '正在退出登录...',
    mask: true
  })

  loginOut()

  uni.hideLoading()
  role.value = false
  uni.showToast({
    title: '退出成功',
    icon: 'none'
  })
  name_value.value = '登录'
}

// 跳转到历史记录
const handleGotoHistory = () => {
  uni.navigateTo({
    url: '/pagesHistorySub/history_fui/history_fui'
  })
}

// 跳转到控制台
const ToConsole = () => {
  uni.navigateTo({
    url: '/pages/console/console'
  })
}

// 支付功能
const img2pay = () => {
  console.log('点击支付')
  showPay.value = true
}
</script>

<style scoped>
.page-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20rpx;
  margin-top: 25%;
}

.user-info-container {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.banner-container {
  width: 100%;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 160rpx;
  background-color: transparent;
  display: block;
}

.function-container {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.function-item {
  margin-top: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1));
  height: 120rpx;
}

.function-item:first-child {
  margin-top: 0;
}

.customer-service-button {
  background-color: transparent;
  margin: 0;
  padding: 0;
  text-align: left;
  border-color: transparent;
  width: 100%;
  height: 100%;
}

.trans_back {
  background-color: transparent;
  border: transparent;
}
</style>