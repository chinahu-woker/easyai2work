<template>
  <!-- 背景图片容器 -->
  <view class="background-container" :style="containerStyle as any"></view>
  
  <!-- 内容容器 -->
  <view class="new-index-container">
    <!-- 动态页面渲染器 -->
    <scroll-view 
      scroll-y 
      class="content-scroll-view"
      :enable-back-to-top="true"
      :scroll-with-animation="false"
      :enable-passive="true"
      @scroll="onContentScroll"
    >
      <view
        v-for="pageType in cachedPageTypes"
        :key="pageType"
        v-show="currentPageType === pageType"
        class="page-cache-item"
      >
        <dynamic-page-renderer :page-type="pageType" />
      </view>
    </scroll-view>
    
    <!-- 底部导航栏 -->
    <view class="tabbar-container">
      <view 
        v-for="(item, index) in safeFilteredTabbarData" 
        :key="index"
        class="tabbar-item"
        :class="{ active: currentPageIndex === index }"
        @click="handleTabClick(index)"
      >
        <image 
          :src="currentPageIndex === index ? item.selectedIconPath : item.iconPath" 
          class="tabbar-icon"
          mode="aspectFit"
        />
        <text class="tabbar-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, nextTick, provide, onBeforeUnmount } from 'vue'
import { onLoad, onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
import DynamicPageRenderer from '@/components/DynamicPageRenderer.vue'
import { globalTabbarData, pageComponents, dynamicComponentRules } from '@/cofigs/data/globalAppData'
import pagesGlobalData from '@/cofigs/data/pagesGlobalData.json'
import { getShareData, clearShareData } from '@/utils/shareManager'
import type { ShareData } from '@/utils/shareManager'

// 定义类型
interface TabbarItem {
  text: string
  tabText: string
  iconPath: string
  selectedIconPath: string
  organizations?: string[]
}

type ScrollDirection = 'up' | 'down'

interface ScrollTickPayload {
  scrollTop: number
  scrollHeight: number
  direction: ScrollDirection
  deltaY: number
  timestamp: number
}

interface VideoPerformanceBus {
  subscribeScrollTick: (handler: (payload: ScrollTickPayload) => void) => () => void
  emitPauseAll: (options?: Record<string, unknown>) => void
  emitPlayRequest: (options?: Record<string, unknown>) => void
  maxConcurrent: number
}

const VIDEO_PERFORMANCE_KEY = 'videoPerformance'
const MAX_CACHED_PAGES = 3
const DEFAULT_SHARE_APP = pagesGlobalData?.HeadProps?.appName || 'JuleiAI'
const DEFAULT_SHARE_TITLE = pagesGlobalData?.HeadProps?.title || DEFAULT_SHARE_APP
const DEFAULT_SHARE_IMAGE = pagesGlobalData?.HeadProps?.image || ''

function ensureLeadingSlash(path: string) {
  if (!path) {
    return '/pages/index/index'
  }
  return path.startsWith('/') ? path : `/${path}`
}

function addOrUpdateQuery(path: string, key: string, value?: string | number) {
  if (value === undefined || value === null || value === '') {
    return path
  }
  const valueStr = encodeURIComponent(String(value))
  const pattern = new RegExp(`([?&])${key}=[^&]*`)
  if (pattern.test(path)) {
    return path.replace(pattern, `$1${key}=${valueStr}`)
  }
  return `${path}${path.includes('?') ? '&' : '?'}${key}=${valueStr}`
}

function buildSharePath(basePath: string, params: Record<string, string | number | undefined>) {
  let resolvedPath = ensureLeadingSlash(basePath || '/pages/index/index')
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    resolvedPath = addOrUpdateQuery(resolvedPath, paramKey, paramValue)
  })
  return resolvedPath
}

function hasCustomShareData(data: ShareData | undefined | null): data is ShareData {
  if (!data) {
    return false
  }
  return Object.keys(data).some((key) => {
    const value = data[key as keyof ShareData]
    return value !== undefined && value !== null && value !== ''
  })
}

type FrameCallback = (time: number) => void

function useFrameThrottle<T>(handler: (payload: T) => void) {
  const requestFrame = typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : ((cb: FrameCallback) => setTimeout(() => cb(Date.now()), 16) as unknown as number)
  let frameId: number | null = null
  let latestPayload: T
  return (payload: T) => {
    latestPayload = payload
    if (frameId !== null) {
      return
    }
    frameId = requestFrame(() => {
      frameId = null
      handler(latestPayload)
    })
  }
}

// 状态管理
const appStore = useAppStore()
const { user } = storeToRefs(appStore)
// 本地计算登录状态（store 中未直接提供 isLogin）
const isLogin = computed(() => {
  try {
    return user && user.value && Object.keys(user.value).length > 0
  } catch (e) {
    return false
  }
})

// 当前页面索引
const currentPageIndex = ref(0)

const cachedPageTypes = ref<string[]>([])

const registerCachedPage = (pageType?: string) => {
  if (!pageType) {
    return
  }
  const pages = cachedPageTypes.value
  const existingIndex = pages.indexOf(pageType)
  if (existingIndex !== -1) {
    pages.splice(existingIndex, 1)
    pages.push(pageType)
    return
  }
  if (pages.length >= MAX_CACHED_PAGES) {
    pages.shift()
  }
  pages.push(pageType)
}

// 安全访问过滤后的导航栏数据
const safeFilteredTabbarData = computed(() => {
  try {
    return Array.isArray(filteredTabbarData?.value) ? filteredTabbarData.value : []
  } catch (error) {
    console.warn('Error accessing filteredTabbarData:', error)
    return []
  }
})

const getActiveTabLabel = () => {
  const tabs = safeFilteredTabbarData.value
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return DEFAULT_SHARE_TITLE
  }
  const safeIndex = Math.min(Math.max(0, currentPageIndex.value), tabs.length - 1)
  return tabs[safeIndex]?.text || DEFAULT_SHARE_TITLE
}

// 处理标签点击事件，增加一层防御性包装
const handleTabClick = (index: number) => {
  try {
    // 确保索引在安全的导航栏数据范围内
    const safeData = safeFilteredTabbarData.value
    if (index >= 0 && index < safeData.length) {
      switchPage(index)
    } else {
      console.warn('Tab index out of bounds:', index)
    }
  } catch (error) {
    console.error('Error in handleTabClick:', error)
  }
}

// 检查用户是否有访问指定页面的权限
const checkPagePermission = (pageConfig: TabbarItem) => {
  try {
    // 如果页面没有配置 organizations 或为空数组，表示所有人都可以访问
    if (!pageConfig.organizations || !Array.isArray(pageConfig.organizations) || pageConfig.organizations.length === 0) {
      return true
    }

    const requiredOrgs = pageConfig.organizations

    // 如果 organizations 包含 "None"，表示未登录用户也可以访问
    if (requiredOrgs.includes("None")) {
      return true
    }

    // 如果用户未登录，且没有 "None" 权限，无法访问有权限要求的页面
    // 添加更多的防御性检查
    if (!isLogin || !isLogin.value) {
      return false
    }
    
    if (!user || !user.value) {
      return false
    }
    
    if (!Array.isArray(user.value.organizations)) {
      return false
    }

    const userOrgs = user.value.organizations

    // 检查用户的组织ID列表是否与页面要求的组织ID有交集
    return userOrgs.some((userOrgId: string) => requiredOrgs.includes(userOrgId))
  } catch (e) {
    console.error('检查页面权限时出错:', e)
    return false
  }
}

// 过滤后的导航栏数据（根据权限）
const filteredTabbarData = computed(() => {
  // 添加防止无限循环的条件判断
  if (!globalTabbarData) {
    console.warn('globalTabbarData is not defined, returning empty array')
    return []
  }
  const tabbarData = Array.isArray(globalTabbarData) ? globalTabbarData : []
  
  // 深拷贝避免直接修改全局配置对象
  const arr = tabbarData.map((item: TabbarItem) => ({ ...item }))

  // 过滤掉用户没有权限访问的页面
  const filtered = arr.filter((item: TabbarItem) => {
    return checkPagePermission(item)
  })

  // 未登录时，确保有登录入口：将最后一项改为登录页
  if (isLogin && !isLogin.value && filtered.length > 0) {
    const lastIndex = filtered.length - 1
    filtered[lastIndex] = {
      ...filtered[lastIndex],
      text: '登录',
      tabText: 'login'
    }
  } else if (isLogin && isLogin.value && filtered.length > 0) {
    // 已登录时，最后一项显示为"我的"
    const lastIndex = filtered.length - 1
    filtered[lastIndex] = {
      ...filtered[lastIndex],
      text: '我的',
      tabText: 'profile'
    }
  }

  return filtered
})

// 获取所有页面类型
const pageTypes = computed(() => {
  try {
    // 确保 filteredTabbarData 存在
    if (!filteredTabbarData) {
      console.warn('filteredTabbarData is not defined')
      return ['home']
    }
    
    // 确保 filteredTabbarData.value 是数组
    const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
    
    // 提取所有页面的tabText
    return tabbarData.map(tab => tab.tabText || 'home')
  } catch (error) {
    console.error('Error in pageTypes:', error)
    return ['home']
  }
})

// 容器样式，使用 pagesGlobalData 中的背景图片
const containerStyle = computed(() => {
  const backgroundImage = pagesGlobalData?.backGroundImage || 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg'
  return {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '-1'
  }
})

// 获取当前页面类型
const currentPageType = computed(() => {
  try {
    // 确保 pageTypes 存在且是数组
    const types = Array.isArray(pageTypes.value) ? pageTypes.value : ['home']
    
    // 确保 currentPageIndex 存在
    if (!currentPageIndex) {
      console.warn('currentPageIndex is not defined')
      return 'home'
    }
    
    // 确保 currentPageIndex.value 在有效范围内
    const index = Math.min(Math.max(0, currentPageIndex.value), types.length - 1)
    
    return types[index] || 'home'
  } catch (error) {
    console.error('Error in currentPageType:', error)
    return 'home'
  }
})

let lastScrollTop = 0

const emitScrollTick = useFrameThrottle<ScrollTickPayload>((payload) => {
  uni.$emit('global:scroll-tick', payload)
})

const onContentScroll = (event: any) => {
  const { detail } = event
  const scrollTop = detail?.scrollTop ?? 0
  const scrollHeight = detail?.scrollHeight ?? 0
  const rawDeltaY = typeof detail?.deltaY === 'number' ? detail.deltaY : scrollTop - lastScrollTop
  const direction: ScrollDirection = rawDeltaY >= 0 ? 'down' : 'up'
  lastScrollTop = scrollTop
  emitScrollTick({
    scrollTop,
    scrollHeight,
    direction,
    deltaY: rawDeltaY,
    timestamp: Date.now()
  })
}

const subscribeScrollTick = (handler: (payload: ScrollTickPayload) => void) => {
  const listener = (payload: ScrollTickPayload) => handler(payload)
  uni.$on('global:scroll-tick', listener)
  return () => {
    uni.$off('global:scroll-tick', listener)
  }
}

const broadcastPageActivated = (pageType: string) => {
  uni.$emit('global:page:activated', { pageType })
}

const broadcastPageDeactivated = (pageType: string, reason: string) => {
  uni.$emit('global:page:deactivated', { pageType, reason })
}

const videoPerformanceBus: VideoPerformanceBus = {
  subscribeScrollTick,
  emitPauseAll: (options) => uni.$emit('global:video-pause', options ?? {}),
  emitPlayRequest: (options) => uni.$emit('global:video-play', options ?? {}),
  maxConcurrent: 3
}

provide(VIDEO_PERFORMANCE_KEY, videoPerformanceBus)
provide('activePageType', currentPageType)

// 切换页面
const switchPage = (index: number) => {
  try {
    // 确保 filteredTabbarData 存在
    if (!filteredTabbarData) {
      console.warn('filteredTabbarData is not defined')
      return
    }
    
    // 确保 filteredTabbarData.value 是数组
    const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
    
    // 确保 index 在有效范围内
    if (index < 0 || index >= tabbarData.length) {
      console.warn('无效的页面索引:', index)
      return
    }
    
    // 如果点击的是登录页且用户未登录
    if (isLogin && !isLogin.value && index === tabbarData.length - 1) {
      uni.navigateTo({
        url: "/pages/login/login"
      })
      return
    }
    
    // 确保 currentPageIndex 存在
    if (currentPageIndex) {
      // 使用 nextTick 确保DOM更新完成后再切换页面
      nextTick(() => {
        currentPageIndex.value = index
      })
    }
    
    // 确保 currentPageType 存在
    const targetPageType = tabbarData[index]?.tabText || 'unknown'
    videoPerformanceBus.emitPauseAll({ keepPageType: targetPageType })

    console.log('切换到页面:', {
      index,
      type: targetPageType,
      text: tabbarData[index]?.text
    })
  } catch (error) {
    console.error('切换页面时发生错误:', error)
  }
}

watch(currentPageType, (newType, oldType) => {
  if (newType) {
    registerCachedPage(newType)
    broadcastPageActivated(newType)
  }
  if (oldType && oldType !== newType) {
    broadcastPageDeactivated(oldType, 'hidden')
  }
}, { immediate: true })

// 页面加载时的处理
onLoad((options: any = {}) => {
  if (typeof uni.showShareMenu === 'function') {
    try {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    } catch (error) {
      console.warn('showShareMenu 调用失败:', error)
    }
  }
  
  // 处理页面索引参数
  if (options && options.pageindex) {
    const targetIndex = parseInt(options.pageindex)
    // 延迟设置页面索引，等待 filteredTabbarData 计算完成
    setTimeout(() => {
      // 添加防御性检查
      if (filteredTabbarData && filteredTabbarData.value && Array.isArray(filteredTabbarData.value)) {
        if (targetIndex >= 0 && targetIndex < filteredTabbarData.value.length) {
          currentPageIndex.value = targetIndex
        }
      }
    }, 100)
  }
  
  // 设置页面类型，供子组件获取
  const instance = getCurrentInstance()
  if (instance && instance.proxy) {
    ;(instance.proxy as any).type = 'home'
  }
})

// 监听页面索引变化，更新页面类型
watch(() => currentPageIndex.value, (newIndex) => {
  const instance = getCurrentInstance()
  if (instance && instance.proxy) {
    // 根据当前索引设置页面类型
    const pageType = pageTypes.value[newIndex] || 'home'
    ;(instance.proxy as any).type = pageType
    console.log(`页面类型已更新为: ${pageType}`)
  }
})

// 页面显示时的处理
onShow(() => {
  console.log('页面显示，当前页面索引:', currentPageIndex.value)
})

onBeforeUnmount(() => {
  if (currentPageType.value) {
    broadcastPageDeactivated(currentPageType.value, 'unmount')
  }
})

// 监听登录状态变化
watch(() => isLogin.value, (newLoginStatus) => {
  console.log('登录状态变化:', newLoginStatus)
  // 确保 filteredTabbarData.value 是数组
  const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
  
  // 如果当前页面索引超出了新的导航栏范围，重置到首页
  if (currentPageIndex.value >= tabbarData.length) {
    currentPageIndex.value = 0
  }
})

// 监听导航栏数据变化
// 移除 deep: true 配置以防止响应式依赖循环
watch(() => filteredTabbarData.value, (newData, oldData) => {
  // 确保 newData 是数组
  const tabbarData = Array.isArray(newData) ? newData : []
  const validTypes = new Set(tabbarData.map(item => item?.tabText || ''))
  cachedPageTypes.value = cachedPageTypes.value.filter(page => validTypes.has(page))
  registerCachedPage(currentPageType.value)
  
  // 如果导航栏配置改变了（通常是权限变化导致），需要检查当前页面索引是否仍然有效
  if (oldData && Array.isArray(oldData) && tabbarData.length !== oldData.length) {
    // 如果当前页面索引超出了新的导航栏范围，重置到首页
    if (currentPageIndex.value >= tabbarData.length) {
      console.log('页面索引超出范围，重置到首页')
      currentPageIndex.value = 0
    }
  }
})

onShareAppMessage(() => {
  const inviteCode = (user.value as any)?.my_invite_code || ''
  const shareData = getShareData()
  // 使用 pagesGlobalData 中配置的固定分享文案
  const configuredAppInfo = pagesGlobalData?.globalAppData?.share?.appInfo
  const fixedTitle = typeof configuredAppInfo === 'string' && configuredAppInfo.trim().length > 0
    ? configuredAppInfo
    : DEFAULT_SHARE_APP

  // 首先尝试从全局 shareData 获取图片
  let imageCandidate: string | undefined = shareData?.imageUrl || undefined

  // 如果没有，尝试从社区缓存中取一张用户当前可见的图片
  if (!imageCandidate) {
    try {
      const communityImages = uni.getStorageSync && uni.getStorageSync('communityImages')
      if (Array.isArray(communityImages) && communityImages.length) {
        imageCandidate = communityImages[0]
      }
    } catch (e) {
      // ignore
    }
  }

  // 最终回退为默认图
  if (!imageCandidate) {
    imageCandidate = DEFAULT_SHARE_IMAGE || undefined
  }

  if (hasCustomShareData(shareData)) {
    clearShareData()
    const basePath = shareData.path || '/pages/index/index'
    const shouldAttachPageIndex = basePath.includes('/pages/index/index') && !/pageindex=/i.test(basePath)
    const finalPath = buildSharePath(basePath, {
      inviteCode: inviteCode || undefined,
      pageindex: shouldAttachPageIndex ? currentPageIndex.value : undefined
    })

    return {
      title: fixedTitle,
      path: finalPath,
      imageUrl: shareData.imageUrl || imageCandidate
    }
  }

  return {
    title: fixedTitle,
    path: buildSharePath('/pages/index/index', {
      pageindex: currentPageIndex.value,
      inviteCode: inviteCode || undefined
    }),
    imageUrl: imageCandidate
  }
})

onShareTimeline(() => {
  const inviteCode = (user.value as any)?.my_invite_code || ''
  const shareData = getShareData()
  // 使用 pagesGlobalData 中配置的固定分享文案
  const configuredAppInfo = pagesGlobalData?.globalAppData?.share?.appInfo
  const fixedTitle = typeof configuredAppInfo === 'string' && configuredAppInfo.trim().length > 0
    ? configuredAppInfo
    : DEFAULT_SHARE_APP

  // timeline 也尽量使用动态图片或全局 shareData
  let imageCandidate2: string | undefined = shareData?.imageUrl || undefined
  if (!imageCandidate2) {
    try {
      const communityImages = uni.getStorageSync && uni.getStorageSync('communityImages')
      if (Array.isArray(communityImages) && communityImages.length) {
        imageCandidate2 = communityImages[0]
      }
    } catch (e) {}
  }
  if (!imageCandidate2) imageCandidate2 = DEFAULT_SHARE_IMAGE || undefined

  if (hasCustomShareData(shareData)) {
    clearShareData()
    const basePath = shareData.path || '/pages/index/index'
    const shouldAttachPageIndex = basePath.includes('/pages/index/index') && !/pageindex=/i.test(basePath)
    const finalPath = buildSharePath(basePath, {
      inviteCode: inviteCode || undefined,
      pageindex: shouldAttachPageIndex ? currentPageIndex.value : undefined
    })

    return {
      title: fixedTitle,
      path: finalPath,
      imageUrl: shareData.imageUrl || imageCandidate2
    }
  }

  return {
    title: fixedTitle,
    path: buildSharePath('/pages/index/index', {
      pageindex: currentPageIndex.value,
      inviteCode: inviteCode || undefined
    }),
    // 微信朋友圈分享接口通常只使用 path/title，image 由微信抓取页面内 meta 或小程序图片，但我们仍传回备用
    imageUrl: imageCandidate2
  }
})
</script>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  /* 移除可能导致重绘的属性 */
}

.new-index-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 100rpx;
  overflow: hidden;
  /* 安卓优化：使用纯色背景替代毛玻璃效果 */
  background-color: rgba(255, 255, 255, 0.85);
  /* iOS保留毛玻璃效果 */
}

/* iOS设备使用毛玻璃 */
@supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
  .new-index-container {
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

.content-scroll-view {
  flex: 1;
  width: 100%;
  height: calc(100vh - 100rpx);
  overflow-y: auto;
  box-sizing: border-box;
  background-color: transparent;
  -webkit-overflow-scrolling: touch;
  /* 移除硬件加速相关属性，减少安卓端重绘 */
}

.page-cache-item {
  width: 100%;
}

.tabbar-container {
  width: 100%;
  height: 100rpx;
  /* 安卓优化：使用纯色背景 */
  background-color: rgba(255, 255, 255, 0.95);
  border-top: 1rpx solid rgba(240, 240, 240, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* iOS设备使用毛玻璃 */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .tabbar-container {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

.tabbar-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10rpx 0;
  /* 优化点击响应 */
  transition: opacity 0.2s ease;
}

.tabbar-item:active {
  opacity: 0.7;
}

.tabbar-item.active {
  color: #7041ed;
}

.tabbar-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
  /* 优化图片渲染 */
  image-rendering: -webkit-optimize-contrast;
}

.tabbar-text {
  font-size: 24rpx;
  color: #666666;
}

.tabbar-item.active .tabbar-text {
  color: #7041ed;
}
</style>