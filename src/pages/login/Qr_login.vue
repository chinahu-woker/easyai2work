<template>
  <view class="qr-login-page">
    <fui-nav-bar title="扫码登录" background="transparent" @leftClick="goBack">
      <fui-icon name="arrowleft" size="40" color="#333" />
    </fui-nav-bar>

    <view class="section card" v-if="!weSessionToken">
      <view class="title">正在获取登录凭证...</view>
      <view class="desc">系统正在自动获取微信登录凭证，请稍候。</view>
      <view class="row">
        <fui-button height="80rpx" width="300rpx" background="#7041ed" color="#fff" @click="getWeSession" :loading="loading.session">重新获取</fui-button>
      </view>
    </view>

    <view class="section card" v-if="weSessionToken">
      <view class="title">🎯 扫描二维码登录</view>
      <view class="desc">请扫描网页端显示的登录二维码完成登录。</view>
      <view v-if="countdown > 0" class="countdown">⏰ 凭证有效期：{{ formatCountdown(countdown) }}</view>
      <view class="scan-action">
        <fui-button height="120rpx" width="400rpx" background="#42b883" color="#fff" @click="scanQr" :loading="loading.scanBtn">
          📱 开始扫码
        </fui-button>
      </view>
      <view class="tip">扫码成功后网页端将自动登录，请切换回浏览器查看。</view>
    </view>

    <view class="section card" v-if="scanResult">
      <view class="title">{{ scanResult.success ? '✅ 扫码成功' : '❌ 扫码失败' }}</view>
      <view class="desc">{{ scanResult.message }}</view>
    </view>

    <!-- 调试面板 -->
    <view class="section card" v-if="debugEnabled">
      <view class="title">调试信息</view>
      <view class="row">
        <fui-button height="64rpx" width="220rpx" background="#999" color="#fff" @click="clearLogs">清空日志</fui-button>
        <fui-button height="64rpx" width="220rpx" background="#42b883" color="#fff" @click="copyLogs">复制日志</fui-button>
      </view>
      <scroll-view style="height:240rpx; margin-top:12rpx;" scroll-y>
        <view class="debug-log" v-for="(l, idx) in debugLogs" :key="idx">{{ l }}</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getWeSession as apiGetWeSession, confirmScan as apiConfirmScan } from '@/composables/aiChat'

// 运行环境判断：仅在小程序真机/预览支持 wx.login
declare const wx: any

const weSessionToken = ref('')
const sessionUser = ref<any>({})
const isNewUser = ref(false)
const qrToken = ref('')
const loading = ref({ session: false, scanBtn: false })
const countdown = ref(0)
const scanResult = ref<{success: boolean, message: string} | null>(null)
// 调试开关：优先使用 Vite 注入的 VITE_DEBUG，或者运行时 storage('DEBUG')
const debugEnabled = !!(((import.meta as any)?.env?.VITE_DEBUG) || uni.getStorageSync('DEBUG'))
const debugLogs = ref<string[]>([])

function dbg(...parts: any[]) {
  const text = parts.map(p => {
    try { return typeof p === 'string' ? p : JSON.stringify(p) } catch { return String(p) }
  }).join(' ')
  console.debug('[QrLogin]', text)
  if (debugEnabled) debugLogs.value.unshift(`${new Date().toLocaleTimeString()} ${text}`)
}

function clearLogs() { debugLogs.value = [] }
function copyLogs() { try { uni.setClipboardData({ data: debugLogs.value.join('\n') }); uni.showToast({ title: '已复制到剪贴板', icon: 'success' }) } catch { uni.showToast({ title: '复制失败', icon: 'none' }) } }

onLoad(async (options: any) => {
  // 自动获取 we_session_token
  await getWeSession()
  
  // 如果带了 qr_token 参数，直接处理
  if (options && options.qr_token) {
    qrToken.value = options.qr_token
    await confirmScan()
  }
})

function goBack() {
  uni.navigateBack()
}

async function getWeSession() {
  loading.value.session = true
  try {
    const loginRes = await new Promise<any>((resolve, reject) => {
      if (typeof wx === 'undefined' || !wx.login) {
        reject(new Error('当前环境不支持 wx.login'))
        return
      }
      wx.login({ success: resolve, fail: reject })
    })
    
    const data: any = await apiGetWeSession(loginRes.code)
  dbg('apiGetWeSession response', data)
    if (!data.we_session_token) throw new Error('未返回 we_session_token')
    
    weSessionToken.value = data.we_session_token
    isNewUser.value = !!data.is_new_user
    sessionUser.value = data.user || {}
    uni.setStorageSync('we_session_token', weSessionToken.value)
    
    // 启动倒计时
    startCountdown(data.expires_in || 300)
  } catch (e: any) {
    if (e.message?.includes('MANAGER_API_URL')) {
      uni.showToast({ title: e.message, icon: 'none' })
    } else {
      uni.showToast({ title: '获取登录凭证失败', icon: 'none' })
    }
  } finally {
    loading.value.session = false
  }
}

async function confirmScan() {
  if (!qrToken.value || !weSessionToken.value) return
  
  try {
    const data: any = await apiConfirmScan(qrToken.value, weSessionToken.value)
    
    if (data.status === 'ok') {
      scanResult.value = { success: true, message: '登录成功！请返回网页查看。' }
      uni.showToast({ title: '登录成功', icon: 'success' })
    } else {
      scanResult.value = { success: false, message: '登录失败，请重试。' }
      uni.showToast({ title: '登录失败', icon: 'none' })
    }
  } catch (e: any) {
    if (e.message?.includes('MANAGER_API_URL')) {
      uni.showToast({ title: e.message, icon: 'none' })
    } else {
      scanResult.value = { success: false, message: '网络错误，请重试。' }
      uni.showToast({ title: '网络错误', icon: 'none' })
    }
  }
}

// 扫码功能
async function scanQr() {
  if (loading.value.scanBtn) return
  loading.value.scanBtn = true
  scanResult.value = null
  
  try {
    const res: any = await new Promise((resolve, reject) => {
      if (typeof uni.scanCode !== 'function') return reject(new Error('当前平台不支持扫码'))
      uni.scanCode({ success: resolve, fail: reject })
    })
    
    const raw = res.result || ''
  dbg('scan raw result', raw)
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
        // URL 解析失败，当作纯 token 处理
      }
    }
    
    if (!token) token = raw.trim()
    if (!token) {
      uni.showToast({ title: '未识别到有效的登录码', icon: 'none' })
      return
    }
    
    qrToken.value = token
  dbg('parsed qr token', token)
    
    // 自动确认登录
    if (weSessionToken.value) {
      await confirmScan()
    } else {
      // 无凭证时先获取再确认
      await getWeSession()
      if (weSessionToken.value) {
        await confirmScan()
      }
    }
  } catch (e: any) {
    dbg('scan error', e)
    uni.showToast({ title: '扫码失败', icon: 'none' })
  } finally {
    loading.value.scanBtn = false
  }
}

// 开始倒计时显示 we_session_token 有效期
function startCountdown(seconds = 300) {
  countdown.value = seconds
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      uni.showToast({ title: '登录凭证已过期，请重新获取', icon: 'none' })
      weSessionToken.value = ''
      uni.removeStorageSync('we_session_token')
    }
  }, 1000)
}

// 格式化倒计时显示
const formatCountdown = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.qr-login-page { 
  padding: 40rpx 32rpx 120rpx; 
  box-sizing: border-box; 
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section { 
  margin-bottom: 40rpx; 
}

.card { 
  background: rgba(255,255,255,0.95); 
  backdrop-filter: blur(10px); 
  padding: 40rpx 32rpx; 
  border-radius: 24rpx; 
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.12); 
  border: 1rpx solid rgba(255,255,255,0.2);
}

.title { 
  font-size: 32rpx; 
  font-weight: 600; 
  margin-bottom: 20rpx; 
  color: #222; 
  text-align: center; 
}

.desc { 
  font-size: 26rpx; 
  line-height: 1.6; 
  color: #666; 
  margin-bottom: 24rpx; 
  text-align: center; 
}

.row { 
  display: flex; 
  flex-direction: row; 
  gap: 24rpx; 
  flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
}

.countdown { 
  margin-top: 16rpx; 
  font-size: 26rpx; 
  color: #42b883; 
  font-weight: 600; 
  text-align: center; 
  padding: 12rpx 24rpx;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 20rpx;
}

.tip { 
  margin-top: 20rpx; 
  font-size: 24rpx; 
  color: #888; 
  line-height: 1.5; 
  text-align: center; 
}

.scan-action { 
  display: flex; 
  justify-content: center; 
  margin: 32rpx 0; 
}

.scan-action fui-button {
  box-shadow: 0 4rpx 16rpx rgba(66, 184, 131, 0.3);
}
</style>