<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, getCurrentInstance } from 'vue'
import { getContentConfig } from '@/composables/useCommon.ts'

// 组件可配置参数
const props = withDefaults(defineProps<{ 
  speed?: number; 
  minDuration?: number;
}>(), {
  speed: 40,
  minDuration: 4,
})

// 在 setup 顶部同步获取组件实例,避免异步丢失上下文
const instance = getCurrentInstance()

// 响应式数据
const announcements = ref<any[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// 当前显示的公告索引
const currentIndex = ref(0)
const currentAnnouncement = computed(() => announcements.value[currentIndex.value] || null)

// 弹窗控制
const showPopup = ref(false)
const popupContent = ref('')
const popupTitle = ref('')

// 滚动相关
// 在小程序端 (mp-weixin) 部分环境不支持 / 或节流 requestAnimationFrame，这里增加 setInterval 回退方案
const scrollAnimation = ref<number | null>(null) // rAF id（H5优先）
const scrollInterval = ref<number | null>(null)  // interval id（小程序回退）
const scrollPosition = ref(0)
const containerWidth = ref(0)
const contentWidth = ref(0)
const needScroll = ref(false)
const isPaused = ref(false)

// 获取公告数据
const fetchAnnouncements = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const contentConfig = await getContentConfig()
    console.log('获取到的内容配置:', contentConfig)
    
    // 访问 page_content.home_announcements
    const homeAnnouncements = contentConfig?.page_content?.home_announcements
    console.log('公告数据:', homeAnnouncements)
    
    if (homeAnnouncements) {
      // 处理公告数据，可能是字符串或数组
      if (typeof homeAnnouncements === 'string') {
        // 如果是字符串，尝试解析为JSON
        try {
          const parsed = JSON.parse(homeAnnouncements)
          announcements.value = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          // 如果解析失败，作为单个公告处理
          announcements.value = [{
            id: 'announcement-1',
            content: homeAnnouncements
          }]
        }
      } else if (Array.isArray(homeAnnouncements)) {
        announcements.value = homeAnnouncements
      } else {
        announcements.value = [homeAnnouncements]
      }
      
      // 数据加载后，开始切换轮播
      if (announcements.value.length > 1) {
        startCarousel()
      }
    }
  } catch (error) {
    console.error('获取公告失败:', error)
    errorMessage.value = '获取公告失败'
  } finally {
    isLoading.value = false
  }
}

// 格式化公告内容
const formatAnnouncementContent = (announcement: any) => {
  if (typeof announcement === 'string') {
    return announcement
  }
  return announcement.content || announcement.title || announcement.description || ''
}

// 轮播定时器
const carouselTimer = ref<number | null>(null)

// 开始轮播（多条公告时）
const startCarousel = () => {
  stopCarousel()
  if (announcements.value.length > 1) {
    carouselTimer.value = setInterval(() => {
      if (!isPaused.value) {
        currentIndex.value = (currentIndex.value + 1) % announcements.value.length
      }
    }, 5000) as unknown as number // 每5秒切换一次
  }
}

// 停止轮播
const stopCarousel = () => {
  if (carouselTimer.value) {
    clearInterval(carouselTimer.value)
    carouselTimer.value = null
  }
}

// 开始文本滚动动画（当单条公告过长时）
const startScrollAnimation = () => {
  stopScrollAnimation()
  if (!needScroll.value) return

  // speed 代表 每秒（px / s），之前逻辑是 speed/10 每帧（约等价 60fps）。统一换算：frameDelta = speed * frameMs / 1000。
  const pxPerSecond = props.speed || 40
  const frameMs = 16.67
  const frameDelta = (pxPerSecond * frameMs) / 1000

  // 优先使用 rAF；若不可用或在 mp-weixin 下被节流，使用 setInterval 兜底。
  // 使用 import.meta.env 读取平台，避免使用 process 在小程序类型缺失导致报错
  const platform = (import.meta as any).env && (import.meta as any).env.UNI_PLATFORM
  const useInterval = typeof requestAnimationFrame === 'undefined' || platform === 'mp-weixin'

  console.log('[滚动动画] 启动:', { platform, useInterval, pxPerSecond, frameDelta, contentWidth: contentWidth.value })

  if (useInterval) {
    // 小程序回退方案
    console.log('[滚动动画] 使用 setInterval 方案')
    scrollInterval.value = setInterval(() => {
      if (isPaused.value) return
      scrollPosition.value -= frameDelta
      // 无缝循环：当滚动超过一份内容宽度时重置，利用DOM中复制的第二份内容实现无缝
      if (Math.abs(scrollPosition.value) >= contentWidth.value) {
        scrollPosition.value = 0
      }
    }, frameMs) as unknown as number
  } else {
    console.log('[滚动动画] 使用 requestAnimationFrame 方案')
    const animate = () => {
      if (!isPaused.value) {
        scrollPosition.value -= frameDelta
        // 无缝循环：当滚动超过一份内容宽度时重置，利用DOM中复制的第二份内容实现无缝
        if (Math.abs(scrollPosition.value) >= contentWidth.value) {
          scrollPosition.value = 0
        }
      }
      scrollAnimation.value = requestAnimationFrame(animate)
    }
    scrollAnimation.value = requestAnimationFrame(animate)
  }
}

// 停止文本滚动动画
const stopScrollAnimation = () => {
  if (scrollAnimation.value) {
    cancelAnimationFrame(scrollAnimation.value)
    scrollAnimation.value = null
  }
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value)
    scrollInterval.value = null
  }
}

// 计算当前公告是否需要滚动
const calculateWidths = async () => {
  await nextTick()
  
  // 小程序环境需要用 in(this) 指定组件实例上下文,否则查询不到元素
  // instance 已在 setup 顶部同步获取,避免异步丢失
  if (!instance) {
    console.error('[宽度计算] 组件实例为 null,无法查询')
    return
  }
  
  const query = uni.createSelectorQuery().in(instance)
  
  query.select('.announcement-container').boundingClientRect((containerRect) => {
    if (containerRect && !Array.isArray(containerRect)) {
      containerWidth.value = containerRect.width || 0
      console.log('[宽度计算] 容器宽度:', containerWidth.value)
    }
  })
  
  query.select('.announcement-text').boundingClientRect((contentRect) => {
    if (contentRect && !Array.isArray(contentRect)) {
      // 当needScroll为true时,DOM中有两份内容,所以总宽度是单份的2倍多(还有间隙)
      // 当needScroll为false时,DOM中只有一份内容
      // 所以我们需要先获取原始宽度来判断是否需要滚动
      
      const measuredWidth = contentRect.width || 0
      
      // 如果还没有启用滚动(首次测量),用测量宽度判断
      if (!needScroll.value) {
        contentWidth.value = measuredWidth
        needScroll.value = measuredWidth > containerWidth.value
        
        console.log('[宽度计算] 首次测量 - 内容宽度:', measuredWidth, '容器宽度:', containerWidth.value, '需要滚动:', needScroll.value)
        
        if (needScroll.value) {
          scrollPosition.value = 0
          console.log('[滚动动画] 准备启动滚动')
          // 等待DOM更新(添加第二份内容后)再次测量
          setTimeout(() => {
            const query2 = uni.createSelectorQuery().in(instance)
            query2.select('.announcement-text').boundingClientRect((rect) => {
              if (rect && !Array.isArray(rect)) {
                // 现在获取的是包含两份内容的宽度,取一半作为重置点
                contentWidth.value = (rect.width || 0) / 2
                console.log('[宽度计算] 二次测量 - 总宽度:', rect.width, '单份宽度:', contentWidth.value)
                startScrollAnimation()
              }
            })
            query2.exec()
          }, 100)
        } else {
          stopScrollAnimation()
        }
      } else {
        // 已经在滚动状态,直接使用测量值的一半
        contentWidth.value = measuredWidth / 2
        console.log('[宽度计算] 更新测量 - 总宽度:', measuredWidth, '单份宽度:', contentWidth.value)
      }
    }
  })
  
  query.exec()
}

// 监听当前公告变化，重新计算宽度
watch(currentAnnouncement, () => {
  needScroll.value = false
  scrollPosition.value = 0
  stopScrollAnimation()
  setTimeout(() => calculateWidths(), 100)
})

// 点击公告显示详情弹窗
const handleAnnouncementClick = () => {
  if (currentAnnouncement.value) {
    const content = formatAnnouncementContent(currentAnnouncement.value)
    popupContent.value = content
    popupTitle.value = '公告详情'
    showPopup.value = true
  }
}

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false
}

// 鼠标悬停暂停
const handleMouseEnter = () => {
  isPaused.value = true
}

const handleMouseLeave = () => {
  isPaused.value = false
}

// 生命周期
onMounted(async () => {
  await fetchAnnouncements()
  
  // 等待DOM渲染完成后计算宽度
  setTimeout(() => calculateWidths(), 500)
  
  // 添加窗口大小变化监听
  uni.onWindowResize(() => {
    setTimeout(() => calculateWidths(), 100)
  })
})

onUnmounted(() => {
  stopScrollAnimation()
  stopCarousel()
})
</script>

<template>
  <view class="announcement-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @touchstart="handleMouseEnter" @touchend="handleMouseLeave">
    <!-- 公告图标 -->
    <view class="announcement-icon">
      <text class="icon">📢</text>
    </view>
    
    <!-- 公告内容区域 -->
    <view class="announcement-container" @click="handleAnnouncementClick">
      <!-- 加载状态 -->
      <view v-if="isLoading" class="state-text">
        加载中...
      </view>
      
      <!-- 错误状态 -->
      <view v-else-if="errorMessage" class="state-text error">
        {{ errorMessage }}
      </view>
      
      <!-- 空状态 -->
      <view v-else-if="announcements.length === 0" class="state-text">
        暂无公告
      </view>
      
      <!-- 公告文本 -->
      <view v-else class="announcement-text-wrapper">
        <text 
          class="announcement-text" 
          :style="{ transform: needScroll ? `translateX(${scrollPosition}px)` : 'translateX(0)' }"
        >
          {{ formatAnnouncementContent(currentAnnouncement) }}
          <text v-if="needScroll" class="scroll-gap">　　</text>
          <text v-if="needScroll">{{ formatAnnouncementContent(currentAnnouncement) }}</text>
        </text>
      </view>
      
      <!-- 指示器（多条公告时显示） -->
      <view v-if="announcements.length > 1" class="indicator">
        {{ currentIndex + 1 }} / {{ announcements.length }}
      </view>
    </view>
  </view>
  
  <!-- 详情弹窗 -->
  <view v-if="showPopup" class="popup-overlay" @click="closePopup">
    <view class="popup-container" @click.stop>
      <view class="popup-header">
        <text class="popup-title">{{ popupTitle }}</text>
        <text class="popup-close" @click="closePopup">✕</text>
      </view>
      <view class="popup-content">
        <text class="popup-text">{{ popupContent }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
// 主容器 - 透明磨砂玻璃风格
.announcement-wrapper {
  display: flex;
  align-items: center;
  padding: 20rpx 28rpx;
  margin: 24rpx 0;
  // 安卓优化：使用纯色背景
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(31, 38, 135, 0.08);
  overflow: hidden;
  transition: opacity 0.2s ease;
  
  &:active {
    opacity: 0.8;
  }
}

// iOS设备使用毛玻璃
@supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
  .announcement-wrapper {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8rpx 32rpx rgba(31, 38, 135, 0.1);
    
    &:active {
      opacity: 1;
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.4);
    }
  }
}

// 公告图标
.announcement-icon {
  margin-right: 20rpx;
  flex-shrink: 0;
  
  .icon {
    font-size: 36rpx;
    line-height: 1;
  }
}

// 公告容器
.announcement-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 44rpx;
  display: flex;
  align-items: center;
  width: 0; // 关键：强制flex子元素缩小，配合flex:1生效
}

// 状态文本（加载/错误/空）
.state-text {
  font-size: 28rpx;
  color: rgba(51, 51, 51, 0.7);
  line-height: 44rpx;
  white-space: nowrap;
  
  &.error {
    color: rgba(245, 108, 108, 0.9);
  }
}

// 公告文本包装器
.announcement-text-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 44rpx;
  line-height: 44rpx;
}

// 公告文本
.announcement-text {
  display: inline-block;
  font-size: 28rpx;
  color: rgba(51, 51, 51, 0.95);
  line-height: 44rpx;
  white-space: nowrap;
  will-change: transform;
  transition: none;
  vertical-align: top;
  
  .scroll-gap {
    display: inline;
    padding: 0 20rpx; // 减小间隙,实现更紧密的无缝循环
  }
}

// 指示器
.indicator {
  margin-left: 20rpx;
  padding: 4rpx 12rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12rpx;
  font-size: 22rpx;
  color: rgba(51, 51, 51, 0.8);
  line-height: 1.4;
  white-space: nowrap;
  flex-shrink: 0;
}

// 弹窗遮罩
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

// iOS设备使用毛玻璃
@supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
  .popup-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

// 弹窗容器
.popup-container {
  width: 85%;
  max-width: 600rpx;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 28rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 16rpx 64rpx rgba(31, 38, 135, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

// iOS设备使用毛玻璃
@supports (backdrop-filter: blur(30px)) or (-webkit-backdrop-filter: blur(30px)) {
  .popup-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }
}

// 弹窗头部
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.5);
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.popup-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.9);
  }
}

// 弹窗内容
.popup-content {
  padding: 32rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.popup-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #666;
  word-break: break-all;
  white-space: pre-wrap;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>