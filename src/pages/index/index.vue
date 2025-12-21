<template>
  <!-- 背景图片容器 -->
  <view class="background-container" :style="containerStyle as any"></view>
  
  <!-- 内容容器 -->
  <view class="new-index-container">
    <!-- 分享按钮 -->
   
    
    <!-- 动态页面渲染器 -->
    <scroll-view
      scroll-y
      class="content-scroll-view"
      :enable-back-to-top="true"
      :scroll-with-animation="false"
      :enable-passive="true"
    >
      <!-- 使用v-show替代组件的重新创建，保持组件状态 -->
      <view  v-for="(pageType, index) in pageTypes" :key="pageType" v-show="currentPageIndex === index">
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
    
    <!-- 隐藏的画布用于生成分享图片 -->
    <canvas canvas-id="pageCaptureCanvas" type="2d" style="position: fixed; top: -9999px; left: -9999px; width: 750px; height: 1334px;"></canvas>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, watch, getCurrentInstance, nextTick, toRaw } from 'vue'
import { onLoad, onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
import DynamicPageRenderer from '@/components/DynamicPageRenderer.vue'
import { globalTabbarData, pageComponents, dynamicComponentRules } from '@/cofigs/data/globalAppData'
import pagesGlobalData from '@/cofigs/data/pagesGlobalData.json'
import { setShareData, generateCommunityShareData } from '@/utils/shareManager'
import { PageCapture } from '@/utils/pageCapture'
import { getShareData } from '@/utils/shareManager'

// 获取当前分享数据
const currentGlobalShareData = computed(() => getShareData())

// 页面背景图片URL - 使用pagesGlobalData中的backGroundImage
const pageBackgroundImageUrl = computed(() => {
  const defaultImageUrl = pagesGlobalData?.backGroundImage
  console.log('使用页面背景图:', defaultImageUrl)
  return defaultImageUrl || ''
})

// 分享背景图片URL - 优先使用全局分享参数中的imageUrl，其次使用globalAppData中的分享背景图
const shareBackgroundImageUrl = computed(() => {
  const globalImageUrl = currentGlobalShareData.value?.imageUrl
  const shareBackgroundImage = pagesGlobalData?.globalAppData?.share?.backGroundImage
  
  // 如果全局分享数据中有imageUrl，优先使用
  if (globalImageUrl && globalImageUrl.trim() !== '') {
    console.log('使用全局分享参数的背景图:', globalImageUrl)
    return globalImageUrl
  }
  
  // 否则使用分享专用背景图
  console.log('使用分享专用背景图:', shareBackgroundImage)
  return shareBackgroundImage || ''
})

// 定义类型
interface TabbarItem {
  text: string
  tabText: string
  iconPath: string
  selectedIconPath: string
  organizations?: string[]
  navigateToMiniProgram?: {
    appId: string
    path: string
    extraData?: any
    envVersion?: 'develop' | 'trial' | 'release'
    shortLink?: string
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

// 存储当前生成的分享图片
const currentShareImage = ref('')

// 安全访问过滤后的导航栏数据
const safeFilteredTabbarData = computed(() => {
  try {
    return Array.isArray(filteredTabbarData?.value) ? filteredTabbarData.value : []
  } catch (error) {
    console.warn('Error accessing filteredTabbarData:', error)
    return []
  }
})

// 处理标签点击事件，增加一层防御性包装
const handleTabClick = (index: number) => {
  try {
    // 确保索引在安全的导航栏数据范围内
    const safeData = safeFilteredTabbarData.value
    if (index >= 0 && index < safeData.length) {
      const currentTab = safeData[index]
      
      // 检查是否配置了小程序跳转
      if (currentTab.navigateToMiniProgram) {
        const miniProgramConfig = currentTab.navigateToMiniProgram
        
        // 如果配置了 shortLink，优先使用短链接跳转（微信小程序支持）
        if (miniProgramConfig.shortLink) {
          console.log('使用小程序短链接跳转:', miniProgramConfig.shortLink)
          // 尝试使用短链接，如果失败则降级到普通跳转
          uni.openEmbeddedMiniProgram({
            appId: miniProgramConfig.appId,
            path: miniProgramConfig.path,
            extraData: miniProgramConfig.extraData || {},
            envVersion: miniProgramConfig.envVersion || 'release',
            success: (res) => {
              console.log('小程序跳转成功:', res)
            },
            fail: (err) => {
              console.error('小程序跳转失败:', err)
              uni.showToast({
                title: '跳转失败，请稍后重试',
                icon: 'none'
              })
            }
          })
          return
        }
        
        // 普通小程序跳转
        console.log('跳转到其他小程序:', miniProgramConfig)
        uni.navigateToMiniProgram({
          appId: miniProgramConfig.appId,
          path: miniProgramConfig.path,
          extraData: miniProgramConfig.extraData || {},
          envVersion: miniProgramConfig.envVersion || 'release',
          success: (res) => {
            console.log('小程序跳转成功:', res)
          },
          fail: (err) => {
            console.error('小程序跳转失败:', err)
            uni.showToast({
              title: '跳转失败，请稍后重试',
              icon: 'none'
            })
          }
        })
        return
      }
      
      // 没有配置小程序跳转，执行正常的页面切换
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
  return {
    backgroundImage: `url(${pageBackgroundImageUrl.value})`,
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
    const pageType = currentPageType && currentPageType.value ? currentPageType.value : 'unknown'
    
    console.log('切换到页面:', {
      index,
      type: pageType,
      text: tabbarData[index]?.text
    })
  } catch (error) {
    console.error('切换页面时发生错误:', error)
  }
}

// 页面加载时的处理
onLoad((options: any = {}) => {
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
  
  // 页面切换时，重新生成分享图片
  generateShareImage().then((image) => {
    currentShareImage.value = image
    console.log('页面切换，重新生成分享图片成功')
  }).catch((error) => {
    console.error('页面切换，重新生成分享图片失败:', error)
  })
})

// 页面显示时的处理
onShow(() => {
  console.log('页面显示，当前页面索引:', currentPageIndex.value)
  
  // 预生成分享图片（异步，不阻塞页面显示）
  generateShareImage().then((image) => {
    currentShareImage.value = image
    console.log('预生成分享图片成功')
  }).catch((error) => {
    console.error('预生成分享图片失败:', error)
  })
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
  
  // 如果导航栏配置改变了（通常是权限变化导致），需要检查当前页面索引是否仍然有效
  if (oldData && Array.isArray(oldData) && tabbarData.length !== oldData.length) {
    // 如果当前页面索引超出了新的导航栏范围，重置到首页
    if (currentPageIndex.value >= tabbarData.length) {
      console.log('页面索引超出范围，重置到首页')
      currentPageIndex.value = 0
    }
  }
})

// 生成当前页面的分享图片
const generateShareImage = async () => {
  try {
    // 确保 filteredTabbarData 存在
    if (!filteredTabbarData || !filteredTabbarData.value) {
      throw new Error('导航栏数据未加载')
    }
    
    // 确保 filteredTabbarData.value 是数组
    const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
    
    // 获取当前页面信息
    const currentPage = tabbarData[currentPageIndex.value]
    if (!currentPage) {
      throw new Error('当前页面信息不存在')
    }
    
    // 获取邀请码
    const inviteCodeArray = appStore.user?.my_invite_code
    const inviteCode = Array.isArray(inviteCodeArray) ? inviteCodeArray[0] : (inviteCodeArray || '')
    
    // 使用分享专用背景图
    const bgImage = shareBackgroundImageUrl.value
    
    console.log('生成分享图片，使用背景图:', bgImage)
    
    // 生成分享海报，传入当前页面信息
    const shareImage = await PageCapture.capturePage({
      title: `Julei - ${currentPage.text}`,
      subtitle: '专业AI助手',
      backgroundImage: bgImage,
      inviteCode: inviteCode
    })
    
    return shareImage
  } catch (error) {
    console.error('生成分享图片失败:', error)
    throw error
  }
}

// 分享功能
const handleShare = async () => {
  try {
    // 显示加载提示
    uni.showLoading({
      title: '正在生成分享图片...',
      mask: true
    })
    
    // 生成当前页面的分享图片
    const shareImage = await generateShareImage()
    
    // 保存当前分享图片
    currentShareImage.value = shareImage
    
    // 隐藏加载提示
    uni.hideLoading()
    
    // 显示分享选项
    uni.showActionSheet({
      itemList: ['分享给朋友', '分享到朋友圈', '保存图片'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 分享给朋友
          // 设置分享数据，包含生成的图片
          const shareData = {
            title: 'Julei - 专业美甲设计助手',
            path: '/pages/index/index',
            imageUrl: shareImage
          }
          setShareData(toRaw(shareData))
          
          uni.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
          })
        } else if (res.tapIndex === 1) {
          // 分享到朋友圈
          // 设置分享数据，包含生成的图片
          const shareData = {
            title: 'Julei - 专业美甲设计助手',
            path: '/pages/index/index',
            imageUrl: shareImage
          }
          setShareData(toRaw(shareData))
          
          uni.showShareMenu({
            withShareTicket: true,
            menus: ['shareTimeline']
          })
        } else if (res.tapIndex === 2) {
          // 保存图片
          uni.saveImageToPhotosAlbum({
            filePath: shareImage,
            success: () => {
              uni.showToast({
                title: '图片已保存到相册',
                icon: 'success'
              })
            },
            fail: () => {
              uni.showToast({
                title: '保存失败，请检查权限设置',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  } catch (error) {
    uni.hideLoading()
    console.error('生成分享图片失败:', error)
    uni.showToast({
      title: '生成分享图片失败',
      icon: 'none'
    })
  }
}

// 分享给朋友
onShareAppMessage(() => {
  // 获取当前页面信息
  const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
  const currentPage = tabbarData[currentPageIndex.value]
  const pageTitle = currentPage ? `Julei - ${currentPage.text}` : 'Julei - 专业AI助手'
  
  // 获取邀请码
  const inviteCodeArray = appStore.user?.my_invite_code
  const inviteCode = Array.isArray(inviteCodeArray) && inviteCodeArray.length > 0 ? inviteCodeArray[0] : ''
  
  // 使用当前已生成的分享图片，如果没有则使用分享专用背景图
  const shareImage = currentShareImage.value || shareBackgroundImageUrl.value || ''
  
  // 设置分享数据
  const shareData = {
    title: pageTitle,
    path: '/pages/index/index',
    imageUrl: shareImage
  }
  setShareData(toRaw(shareData))
  
  // 构建分享路径
  let sharePath = shareData.path
  if (inviteCode && !sharePath.includes('inviteCode=')) {
    sharePath = sharePath.includes('?') ? `${sharePath}&inviteCode=${inviteCode}` : `${sharePath}?inviteCode=${inviteCode}`
  }
  
  console.log('首页分享路径:', sharePath)
  console.log('分享图片:', shareData.imageUrl)
  
  return {
    title: shareData.title,
    path: sharePath,
    imageUrl: shareData.imageUrl
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  // 获取当前页面信息
  const tabbarData = Array.isArray(filteredTabbarData.value) ? filteredTabbarData.value : []
  const currentPage = tabbarData[currentPageIndex.value]
  const pageTitle = currentPage ? `Julei - ${currentPage.text}` : 'Julei - 专业AI助手'
  
  // 获取邀请码
  const inviteCodeArray = appStore.user?.my_invite_code
  const inviteCode = Array.isArray(inviteCodeArray) && inviteCodeArray.length > 0 ? inviteCodeArray[0] : ''
  
  // 使用当前已生成的分享图片，如果没有则使用分享专用背景图
  const shareImage = currentShareImage.value || shareBackgroundImageUrl.value || ''
  
  // 设置分享数据
  const shareData = {
    title: pageTitle,
    path: '/pages/index/index',
    imageUrl: shareImage
  }
  setShareData(shareData)
  
  // 构建分享路径
  let sharePath = shareData.path
  if (inviteCode && !sharePath.includes('inviteCode=')) {
    sharePath = sharePath.includes('?') ? `${sharePath}&inviteCode=${inviteCode}` : `${sharePath}?inviteCode=${inviteCode}`
  }
  
  console.log('首页朋友圈分享路径:', sharePath)
  console.log('分享图片:', shareData.imageUrl)
  
  return {
    title: shareData.title,
    path: sharePath,
    imageUrl: shareData.imageUrl
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
  background-color: rgba(255, 255, 255, 0);
  /* iOS保留毛玻璃效果 */
}

/* iOS设备也保持透明，不使用毛玻璃效果 */

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

.tabbar-container {
  width: 100%;
  height: 100rpx;
  /* 使用更透明的背景，让背景图透过 */
  background-color: rgba(255, 255, 255, 0.8);
  border-top: 1rpx solid rgba(240, 240, 240, 0.3);
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

/* iOS设备使用轻微毛玻璃效果，保持透明 */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .tabbar-container {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
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

/* 分享按钮样式 */
.share-button {
  position: fixed;
  top: 120rpx;
  right: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
}

.share-button:active {
  transform: scale(0.95);
  background-color: rgba(255, 255, 255, 0.8);
}
</style>