<template class="carousel-container">
  <!-- 骨架屏加载状态 -->
  <SkeletonScreen v-if="isDataLoading && !draw_data.data?.output" />
  
  <!-- 实际内容 -->
  <template v-else>
  <fui-nav-bar background="transparent" :title="draw_data.data?.options?.workflow_title" @leftClick="leftClick">
    <fui-icon name="arrowleft"></fui-icon>
    <view class="nav-right" slot="right">
      <fui-icon name="share" @click="handleShare"></fui-icon>
    </view>
  </fui-nav-bar>


  <view class="carousel-container">
    <swiper class="carousel-swiper" :circular="false" :indicator-dots="true" :autoplay="false" :interval="3000"
      :duration="500" :style="{ height: swiperHeight + 'px' }" @change="onSwiperChange">

      <swiper-item :key="index" class="carousel-item" v-for="(item, index) in (draw_data.data?.output || [])">
        <template v-if="getItemType(item) === 'image'">
          <image class="carousel-image" :src="item" mode="aspectFill" @click="previewImage(item)" :lazy-load="true" :webp="true" :fade-show="true" />
        </template>
        <template v-else>
          <view class="video-wrapper">
            <video class="carousel-video" :id="`video-${index}`" :src="item" :show-progress="false"
              :enable-progress-gesture="false" :custom-cache="true" @play="handleVideoPlay(index)"
              @fullscreenchange="handleVideoFullscreenChange" @error="handleVideoError"></video>
            <!-- 可加播放按钮遮罩 -->
            <view v-if="currentVideoIndex !== index" class="video-play-overlay" @click="playVideo(index)">
              <fui-icon name="play" color="#fff" size="60"></fui-icon>
            </view>
          </view>
        </template>
      </swiper-item>

    </swiper>
    <!-- 自定义指示器 -->
    <view class="thumbnail-nav" v-if="(draw_data.data?.output && draw_data.data.output.length > 1)">
      <view v-for="(item, index_cer) in draw_data.data?.output" :key="index_cer" 
            :class="['thumbnail-wrapper', { active: currentIndex === index_cer }]" 
            @click="goToSlide(index_cer)">
        
        <!-- 图片缩略图 -->
        <image v-if="getItemType(item) === 'image'" 
               :src="item"
               class="thumbnail" 
               mode="aspectFill"
               :lazy-load="true"
               :webp="true"
               :fade-show="true" />
               
        <!-- 视频缩略图 -->
        <view v-else class="video-thumbnail">
          <!-- 尝试使用视频的第一帧作为缩略图 -->
          <image :src="getThumbnailUrl(item)" 
                 class="thumbnail" 
                 mode="aspectFill"
                 :lazy-load="true"
                 :webp="true"
                 :fade-show="true"
                 @error="onThumbnailError" />
          <!-- 视频 -->
          <view class="video-thumbnail-overlay">
            <fui-icon name="play" color="#fff" size="16"></fui-icon>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view class="config-table">
    <view class="table-header">
      <text>参数详情</text>
      <!-- <text>值</text> -->
      <!-- <text>操作</text> -->
    </view>

    <!-- 手动列出你要展示的字段 -->
    <view class="table-row" v-for="key in visibleParams" :key="key">
      <text class="label">{{ formatLabel(key) }}</text>
      <text class="value text-ellipsis">{{ draw_data.data.params?.[key] }}</text>
      <!-- <button class="copy-btn" @click="copyValue(draw_data.data.params?.[key])">复制</button> -->
      <!-- <up-button class="submit-button copy-btn "   @click="copyValue(draw_data.data.params?.[key])" type="primary" shape="circle">
        复制
      </up-button> -->
    </view>

    <!-- <button class="generate-btn" @click="generateSame">画同款</button> -->
    <up-button icon="edit-pen" class="submit-button" @click="generateSame" type="primary" shape="circle">
      画同款
    </up-button>
  </view>

  <!-- ------------------------------------------------------- -->
  <!-- 评论区域 -->
  <view class="comment-section">
    <view class="comment-header">
      <text>用户评论</text>
    </view>



    <!-- 评论列表 -->
    <view class="comment-list">
      <!-- 检查 draw_data.data.comment 是否存在且为数组 -->
      <template v-if="Array.isArray(draw_data.data?.comment)">
        <view class="comment-item" v-for="comment in draw_data.data.comment" :key="comment._id">
          <!-- 在评论项的.comment-item容器内添加 -->
          <!-- {{ comment.author._id == user._id   }}
            
          {{ user  }} -->
          <view class="comment-content-wrapper">

            <view class="comment-header">

              <fui-avatar size="small" :src="comment.author?.avatar_url"></fui-avatar>
              <view class="comment-author">{{ comment.author?.nickname || comment.author?.username || '未知用户' }}</view>

            </view>

            <view class="comment-content">{{ comment?.content }}</view>
            <view class="comment-time">{{ formatTime(comment.created_at) }}</view>
            <view class="reply-list" v-if="comment.replies && comment.replies?.length">
              <view class="reply-item" v-for="reply in comment.replies" :key="reply._id">
                <view class="reply-header">
                  <fui-avatar size="small" :src="reply.author?.avatar_url"></fui-avatar>
                  <view class="reply-author">
                    {{ reply.author?.nickname || reply.author?.username || '未知用户' }}
                    <text class="comment-author">@{{ comment.author?.nickname || comment.author?.username || '未知用户' }}</text>
                  </view>
                </view>
                <view class="reply-content">{{ reply.content }}</view>
                <view class="comment-time">{{ formatTime(reply.created_at) }}</view>

             
                  <!-- <text v-if="comment.author._id === user._id" class="delete-comment"
                    @click="deleteComment(comment._id)">删除</text> -->
                  <!-- <text class="refrenc-comment"
                    @click="RefComments(comment._id, comment._id, comment.author._id)">回复</text> -->
             





              </view>


            </view>
            <text v-if="comment.author?._id === user?._id" class="delete-comment"
              @click="deleteComment(comment._id)">删除</text>
            <text class="refrenc-comment" @click="RefComments(comment._id, comment._id, comment.author?._id)">回复</text>


          </view>
        </view>

        <!-- 暂无评论提示 -->
        <view v-if="!draw_data?.data?.comment?.length" class="no-comment">暂无评论</view>
      </template>
      <!-- 当 comment 数据不存在时的兜底提示 -->
      <view v-else class="no-comment">暂无评论</view>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container">
      <view v-if="activeReply" class="reply-target">
        回复给：{{ activeReply.author.nickname || activeReply.author.username }}

      </view>
      <input class="comment-input" placeholder="写点什么..." v-model="newComment" @confirm="submitComment" />
      <button class="comment-btn submit-button" @click="submitComment">发送</button>
      <button v-if="activeReply" class="comment-btn submit-button" @click="clearReply">取消</button>
      <!-- <text class="cancel-reply" @click="clearReply">取消</text> -->
      <!-- <up-button icon="chat-fill" class="submit-button comment-btn  " @click="submitComment" type="primary" shape="circle">
        发送
      </up-button> -->
    </view>
  </view>
  </template>
</template>

<script setup lang="ts">

import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { ref } from 'vue'
import { getdetail, Comment, allUserName, delComment } from "@/composables/aiChat.ts";
import { useAppStore } from "@/stores/appStore.ts";
import {
  isLogin
} from "@/composables/useCommon.ts";
import { storeToRefs } from "pinia";
import { globalAppData } from "@/cofigs/data/globalAppData.ts";
import { getShareData, clearShareData } from "@/utils/shareManager";
import SkeletonScreen from "@/components/common/SkeletonScreen.vue";

const { user } = storeToRefs(useAppStore())
// 在 script setup 顶部添加
interface CommentItem {
  _id: string
  content: string
  created_at: number
  author: {
    _id: string
    username: string
    avatar_url?: string
  }
  replyTo?: {
    _id: string
  }
  replies?: CommentItem[]
}
function leftClick() {
  try {
    const pages = getCurrentPages();
    if (pages && pages.length > 1) {
      uni.navigateBack();
    } else {
      // 从分享页打开时没有历史，回首页以避免卡住
      uni.navigateTo({ url: '/pages/index/index' });
    }
  } catch (e) {
    uni.navigateTo({ url: '/pages/index/index' });
  }
}

// 分享按钮点击处理
function handleShare() {
  // 显示分享菜单
  uni.showActionSheet({
    itemList: ['分享给好友', '分享到朋友圈'],
    success: function (res) {
      if (res.tapIndex === 0) {
        // 分享给好友
        // 在小程序中，这会触发 onShareAppMessage
        uni.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage']
        });
      } else if (res.tapIndex === 1) {
        // 分享到朋友圈
        // 在小程序中，这会触发 onShareTimeline
        uni.showShareMenu({
          withShareTicket: true,
          menus: ['shareTimeline']
        });
      }
    },
    fail: function (err) {
      console.log('分享失败:', err);
    }
  });
}

const currentIndex = ref(0)
const swiperHeight = ref(400)


const swiperRef = ref()

const currentVideoIndex = ref<number | null>(null)
const videoContexts = ref<UniApp.VideoContext[]>([])

// 获取 item 类型
function getItemType(url: string): 'image' | 'video' {
  if (!url || typeof url !== 'string') return 'image'
  
  // 移除URL参数，只检查文件扩展名
  const cleanUrl = url.split('?')[0].split('#')[0]
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|m4v|3gp)$/i
  
  return videoExtensions.test(cleanUrl) ? 'video' : 'image'
}

// 获取缩略图URL - 为视频生成预览图
function getThumbnailUrl(url: string): string {
  if (getItemType(url) === 'video') {
    // 对于视频，返回默认的视频图标
    return '/static/video-placeholder.png'
  }
  
  return url
}

// 缩略图加载错误处理
function onThumbnailError(event: any) {
  // 当视频缩略图加载失败时，使用存在的logo图标作为备用
  const target = event.target
  if (target) {
    target.src = '/static/logo.png'
    target.onerror = null // 防止无限循环
  }
}

// 获取视频上下文
function getVideoContext(index: number) {
  if (!videoContexts.value[index]) {
    videoContexts.value[index] = uni.createVideoContext(`video-${index}`, {
      componentInstance: this
    })
  }
  return videoContexts.value[index]
}

// 播放指定视频
function playVideo(index: number) {
  const videoCtx = getVideoContext(index)
  if (videoCtx) {
    videoCtx.play()
    currentVideoIndex.value = index
  }
}

// 当前视频开始播放
function handleVideoPlay(index: number) {
  currentVideoIndex.value = index
}

// 全屏切换（可选）
function handleVideoFullscreenChange(e) {
  console.log('全屏变化:', e.detail.fullScreen)
}

// 错误处理
function handleVideoError(e) {
  uni.showToast({ title: '视频加载失败', icon: 'none' })
  console.error('视频错误:', e.detail.errMsg)
}

// 切换轮播时暂停视频
function onSwiperChange(e) {
  currentIndex.value = e.detail.current
  const item = draw_data.value[currentIndex.value]

  if (currentVideoIndex.value !== null && currentVideoIndex.value !== currentIndex.value) {
    const videoCtx = getVideoContext(currentVideoIndex.value)
    if (videoCtx) {
      videoCtx.pause()
    }
    currentVideoIndex.value = null
  }

  if (item?.output?.height) {
    swiperHeight.value = Math.min(
      Math.max(item.output.height, 300),
      600
    )
  }
}
// 跳转到指定 slide
function goToSlide(index: number) {
  if (swiperRef.value && typeof swiperRef.value.setCurrent === 'function') {
    swiperRef.value.setCurrent(index)
  } else {
    console.warn('setCurrent 方法不可用或 swiper 未正确初始化')
  }
}
function getAvatarUrl(userId: string): string {
  const users = uni.getStorageSync('allUserNames') || []
  if (!Array.isArray(users)) return 'https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250521115936505-3434-06.png'

  const user = (users as any[]).find(u => u._id === userId)
  return user?.avatar_url || 'https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250521115936505-3434-06.png'
}


// function onSwiperChange(e) {
//   currentIndex.value = e.detail.current
//   // 动态调整高度
//   const item = draw_data.value[currentIndex.value]
//   if (item?.output?.height) {
//     swiperHeight.value = Math.min(
//       Math.max(item.output.height, 300),
//       600
//     )
//   }
// }
// 添加点击预览功能
function previewImage(url) {
  uni.previewImage({
    // urls: draw_data.value.map(item => item.output),
    urls: url,
    current: url
  })
}

// 添加加载状态
const isLoading = ref(true)
const loadProgress = ref(0)

function onImageLoad() {
  loadProgress.value += 1
  if (loadProgress.value === draw_data.value.length) {
    isLoading.value = false
  }
}

// 获取用户列表并存入本地
async function fetchAndSaveUserNames() {
  try {
    await allUserName(user.value)
    // uni.showToast({ title: '用户列表已更新' })
  } catch (err) {
    // console.error('获取用户列表失败:', err)
  }
}
// const draw_data = ref<any>()
// 定义更完整的类型定义，包含 params 字段
const draw_data = ref<{
  data: {
    comment?: CommentItem[],
    params?: Record<string, any>,
    options?: {
      workflow_title?: string
    },
    _id?: string,
    is_public?: boolean,
    workflow_id?: string
  }
}>({
  data: {}
});

const detailId = ref<string>('')
const recordId = ref<string>('')
const isDataLoading = ref(false)

onLoad(async (params) => {
  // 显示骨架屏/加载状态
  uni.showLoading({
    title: '加载中...',
    mask: false  // 不阻塞用户操作
  })
  
  try {
    if (params?.id) {
      recordId.value = params.id
      detailId.value = params.id
      
      // 优先从缓存获取数据（快速显示）
      const cachedData = uni.getStorageSync(`alike_${params.id}`)
      if (cachedData && cachedData.data) {
        draw_data.value = cachedData
        uni.hideLoading()
      }
      
      // 异步加载最新数据
      await loadDetailData(params.id)
    } else {
      throw new Error('缺少必要参数：id')
    }
  } catch (error) {
    console.error('页面加载失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  }
})

// 提取数据加载逻辑
async function loadDetailData(id: string) {
  if (isDataLoading.value) return
  isDataLoading.value = true
  
  try {
    console.log('加载详情数据:', id, user.value)
    const res: any = await getdetail(user.value, id)
    
    if (res && res.data) {
      console.log('获取到的详情信息:', res.data)
      draw_data.value = res.data || { data: {} }
      
      // 缓存数据以便下次快速显示
      uni.setStorageSync(`alike_${id}`, res.data)
      
      // 确保 detailId 设置正确
      if (!detailId.value && res.data?.data?._id) {
        detailId.value = res.data.data._id
      }
      
      uni.hideLoading()
    } else {
      throw new Error('数据格式错误')
    }
  } catch (err) {
    console.error('数据加载失败:', err)
    uni.hideLoading()
    uni.showToast({
      title: '数据加载失败，请刷新重试',
      icon: 'none',
      duration: 2000
    })
    draw_data.value = { data: {} }
  } finally {
    isDataLoading.value = false
  }
}
// ===================================================
// 定义需要显示的字段
const visibleParams = ['positive', 'width', 'height', 'seed']
function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    positive: '提示词',
    width: '宽度',
    height: '高度',
    seed: '随机种子'
  }
  return labelMap[key] || key
}
function copyValue(value: any) {
  uni.setClipboardData({
    data: String(value),
    success: () => {
      uni.showToast({ title: '已复制' });
    },
    fail: () => {
      uni.showToast({ title: '复制失败', icon: 'none' });
    }
  });
}
function generateSame() {
  // 防御性检查：确保数据存在
  const data = draw_data.value?.data;
  if (!data) {
    uni.showToast({
      title: '数据加载中，请稍后重试',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查是否公开
  if (!data.is_public) {
    uni.showToast({
      title: '该应用目前不可用',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查 workflow_id 是否存在
  if (!data.workflow_id) {
    uni.showToast({
      title: '缺少工作流信息',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  try {
    uni.navigateTo({
      url: '/pages/draw/apps/apps?id=' + data.workflow_id +
        '&isRegenerate=true&regenerateParams=' + encodeURIComponent(JSON.stringify(data.params || {}))
    });
  } catch (error) {
    console.error('导航失败:', error);
    uni.showToast({
      title: '页面跳转失败',
      icon: 'none',
      duration: 2000
    });
  }
}

// --------------------------------------------------------------------


// 删除评论方法
async function deleteComment(commentId: string) {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条评论吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await delComment(user.value, commentId)
          uni.showToast({ title: '删除成功' })

          // 重新获取数据保持列表同步
          const res = await getdetail(user.value, detailId.value)
          draw_data.value = res.data
        } catch (err) {
          console.error('删除失败:', err)
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}


function formatTime(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return '刚刚'
  }
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
const newComment = ref('')
function getUsernameById(userId: string | { _id: string }): string {
  let id: string
  if (typeof userId === 'string') {
    id = userId
  } else if (userId && typeof userId._id === 'string') {
    id = userId._id
  } else {
    return '未知用户'
  }
  
  const users = uni.getStorageSync('allUserNames') || []
  if (!Array.isArray(users)) return '未知用户'

  const user = (users as any[]).find(u => u._id === id)
  return user?.nickname || user?.username || '未知用户'
}

// 回复相关状态
const activeReply = ref<{
  _id: string
  author: { _id: string, nickname?: string, username: string }
  rootId: string
} | null>(null)

// 回复目标评论
// 当点击回复按钮时，只记录回复目标信息
function RefComments(targetId: string, rootId: string, replyTo: string) {
  activeReply.value = {
    _id: targetId,
    author: {
      _id: replyTo,
      username: getUsernameById(replyTo)
    },
    rootId: rootId
  }

  // 滚动到输入框位置
  uni.createSelectorQuery()
    .select('.comment-section')
    .boundingClientRect(res => {
      if (res) {
        uni.pageScrollTo({
          scrollTop: res.top - 100,
          duration: 300
        })
      }
    })
    .exec()
}

// ==========================================================
// 清除回复状态
function clearReply() {
  activeReply.value = null
}
// 分享功能
onShareAppMessage((res: any) => {
  const inviteCode = useAppStore().user.my_invite_code || ''

  // 检查是否有特定的分享数据
  const shareData = getShareData()
  if (shareData) {
    // 清除已使用的分享数据
    clearShareData()

    // 确保分享数据中的路径有效
    let sharePath = shareData.path || '/pagesDrawLike/alike'
    // 确保路径以 / 开头
    if (!sharePath.startsWith('/')) {
      sharePath = '/' + sharePath
    }
    
    // 如果路径是alike页面但没有id参数，尝试从当前页面获取
    if (sharePath.includes('/pagesDrawLike/alike') && !sharePath.includes('id=')) {
      const id = detailId.value || draw_data.value?.data?._id
      if (id) {
        sharePath = inviteCode ? `${sharePath}?id=${id}&inviteCode=${inviteCode}` : `${sharePath}?id=${id}`
      } else if (inviteCode) {
        sharePath = `${sharePath}?inviteCode=${inviteCode}`
      }
    } else if (inviteCode && !sharePath.includes('inviteCode=')) {
      // 如果路径中没有inviteCode参数，添加inviteCode
      sharePath = sharePath.includes('?') ? `${sharePath}&inviteCode=${inviteCode}` : `${sharePath}?inviteCode=${inviteCode}`
    }
    
    // 构建完整路径
    console.log('分享路径:', sharePath)
    
    return {
      title: shareData.title,
      path: sharePath,
      imageUrl: shareData.imageUrl || ''
    }
  }

  // 默认分享内容，使用当前作品标题
  const workTitle = draw_data.value?.data?.options?.workflow_title || '精美作品'
  const id = detailId.value || draw_data.value?.data?._id || ''
  
  if (!id) {
    console.error('分享失败：缺少作品ID')
    // 即使没有作品ID，也尝试分享当前页面，而不是跳转到首页
    const currentPath = inviteCode ? `/pagesDrawLike/alike?inviteCode=${inviteCode}` : '/pagesDrawLike/alike'
    console.log('当前页面分享路径:', currentPath)
    return {
      title: `${workTitle} - 精美设计 | AI创作`,
      path: currentPath,
      imageUrl: ''
    }
  }
  
  // 构建作品详情页路径
  const detailPath = inviteCode ? `/pagesDrawLike/alike?id=${id}&inviteCode=${inviteCode}` : `/pagesDrawLike/alike?id=${id}`
  console.log('作品详情页路径:', detailPath)
  return {
    title: `${workTitle} - 精美设计 | AI创作`,
    path: detailPath,
    imageUrl: '' // 可以使用作品的第一张图片作为分享图片
  }
})

// 朋友圈分享
onShareTimeline(() => {
  const inviteCode = useAppStore().user.my_invite_code || ''

  // 检查是否有特定的分享数据
  const shareData = getShareData()
  if (shareData) {
    // 清除已使用的分享数据
    clearShareData()

    // 确保分享数据中的路径有效
    let sharePath = shareData.path || '/pages/index/index'
    // 确保路径以 / 开头
    if (!sharePath.startsWith('/')) {
      sharePath = '/' + sharePath
    }
    
    // 构建完整路径
    const fullPath = inviteCode ? `${sharePath}?inviteCode=${inviteCode}` : sharePath
    console.log('朋友圈分享路径:', fullPath)
    
    return {
      title: shareData.title,
      path: fullPath
    }
  }

  // 默认分享内容，使用当前作品标题
  const workTitle = draw_data.value?.data?.options?.workflow_title || '精美作品'
  const id = detailId.value || draw_data.value?.data?._id || ''
  
  if (!id) {
    console.error('分享失败：缺少作品ID')
    const defaultPath = inviteCode ? `/pages/index/index?inviteCode=${inviteCode}` : '/pages/index/index'
    console.log('朋友圈默认分享路径:', defaultPath)
    return {
      title: `我分享了一个${workTitle}，真的太棒了！`,
      path: defaultPath,
    }
  }
  
  // 构建作品详情页路径
  const detailPath = inviteCode ? `/pagesDrawLike/alike?id=${id}&inviteCode=${inviteCode}` : `/pagesDrawLike/alike?id=${id}`
  console.log('朋友圈作品详情页路径:', detailPath)
  return {
    title: `我分享了一个${workTitle}，真的太棒了！`,
    path: detailPath,
  }
})

async function submitComment() {
  if (!isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'error' })
    return
  }

  if (!newComment.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }

  try {
    const putdata = {
      targetType: "work",
      content: newComment.value,
      targetId: draw_data.value?.data?._id
    }

    if (!putdata.targetId) {
      uni.showToast({ title: '目标ID缺失', icon: 'none', duration: 2000 })
      return
    }
    // 如果是回复
    if (activeReply.value) {
      putdata.rootId = activeReply.value._id
      putdata.replyTo = activeReply.value.author._id
    }
    await Comment(user.value, putdata)
    uni.showToast({ title: '提交成功' })

    // 提交后重新拉取最新数据
    const res = await getdetail(user.value, detailId.value)
    draw_data.value = res.data

    newComment.value = ''

  } catch (err) {
    console.error('评论提交失败:', err)
    uni.showToast({ title: '评论失败，请重试', icon: 'none' })
  }
}
</script>

<style>
.nav-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}

.comment-item {
  position: relative;
  padding: 30rpx 120rpx 30rpx 30rpx;
}

.refrenc-comment {
  position: absolute;
  /* top: 30rpx;         */
  right: -5rpx;

  font-size: 24rpx;
  color: #999;
  /* background: rgba(255, 255, 255, 0.98);   */
  /* padding: 6rpx 14rpx;   */
  /* border-radius: 30rpx;   */
  /* box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);   */
  z-index: 2;
  /* backdrop-filter: blur(4rpx);   */
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #ff4949;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2rpx);
  }

  &:active {
    transform: scale(0.96) translateY(2rpx);
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }
}

.delete-comment {
  position: absolute;
  /* top: 0rpx;         */
  right: 80rpx;
  font-size: 24rpx;
  color: #999;
  /* background: rgba(255, 255, 255, 0.98);   */
  /* padding: 6rpx 14rpx;   */
  /* border-radius: 30rpx;   */
  /* box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);   */
  z-index: 2;
  /* backdrop-filter: blur(4rpx);   */
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #ff4949;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2rpx);
  }

  &:active {
    transform: scale(0.96) translateY(2rpx);
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }
}

.comment-section {
  margin: 60rpx 30rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.comment-header {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.comment-list {
  margin-bottom: 40rpx;
}



.comment-author {
  margin-left: 16rpx;
  max-width: 250rpx;
  /* 设置最大宽度，根据容器大小调整 */
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 超出显示省略号 */
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.comment-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.comment-time {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 10rpx;
}

.no-comment {
  text-align: center;
  color: #bbb;
  padding: 40rpx 0;
}

.comment-input-container {
  display: flex;
  align-items: center;
  border: 2rpx solid #ddd;
  border-radius: 40rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.comment-input {
  flex: 1;
  font-size: 28rpx;
  padding-right: 20rpx;
}

.comment-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: #465CFF;
  border-radius: 30rpx;
  margin-left: 20rpx;
  padding: 0;
  display: flex;
  /* 确保内容正确显示 */
  align-items: center;
  /* 垂直居中对齐 */
  justify-content: center;
  /* 水平居中对齐 */
  line-height: normal;
  /* 取消默认行高 */
}


.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.username {
  margin-left: 16rpx;
  font-weight: bold;
  color: #333;
  max-width: 5vh;
  /* 控制最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reply-list {
  margin-top: 20rpx;
  padding-left: 40rpx;
  border-left: 2rpx solid #eee;
}

.reply-item {
  margin-bottom: 20rpx;
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.reply-author {
  font-weight: bold;
  color: #333;
  margin-left: 16rpx;
}

.at-user {
  margin-left: 8rpx;
  color: #888;
  font-size: 24rpx;
}

.reply-content {
  font-size: 26rpx;
  color: #555;
  margin-left: 56rpx;
}

.submit-button {
  border: none;
  /* 移除边框 */
  box-shadow: none;
  /* 移除阴影 */
  background: linear-gradient(to right, #7E56FF, #4D31B2);
  /* 设置渐变背景 */
  border-radius: 50px;
  /* 圆角 */
  color: #fff;
  /* 文字颜色为白色 */


  cursor: pointer;
  /* 鼠标悬停时变为指针 */
  transition: all 0.3s ease;
  /* 平滑过渡效果 */
  display: flex;

  /* 悬停状态 */
  &:hover {
    background: linear-gradient(to right, #6A4AFF, #3C2A99);
    /* 悬停时渐变色加深 */
  }

  /* 点击状态 */
  &:active {
    transform: scale(0.98);
    /* 点击时轻微缩放 */
  }
}

/* --------------------------------------------------------------- */
.config-table {
  margin: 40rpx 30rpx;
  background-color: #f9f9f9;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  font-size: 28rpx;

  .table-header {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #eee;
    font-weight: bold;
    color: #333;
    justify-content: center;
    align-items: center;
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .label {
    width: 30%;
    color: #666;
  }

  .value {
    width: 50%;
    word-break: break-all;
    color: #333;
  }
  
  .text-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .copy-btn {
    width: 120rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    color: #fff;
    background-color: #465CFF;
    border-radius: 40rpx;
    padding: 0;
    margin-left: 20rpx;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .copy-btn:hover {
    background-color: #3a4bdf;
  }

  .copy-btn:active {
    transform: scale(0.98);
  }

  .generate-btn {
    margin-top: 40rpx;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #465CFF;
    border-radius: 40rpx;
    font-weight: bold;
    box-shadow: 0 8rpx 16rpx rgba(70, 92, 255, 0.3);
  }
}

/* ==================================== */
.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-video {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}

.video-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.thumbnail-nav {
  display: flex;
  justify-content: center;
  /* 居中显示 */
  gap: 20rpx;
  margin-top: 30rpx;
  padding: 0 20rpx;
  overflow-x: auto;
  /* 如果图片太多允许滚动 */
  white-space: nowrap;
}

.thumbnail-wrapper {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  overflow: hidden;
  transition: all 0.3s ease;
}

.thumbnail-wrapper.active {
  transform: scale(1.1);
  border: 2rpx solid #465CFF;
}

.thumbnail-wrapper:active {
  transform: scale(0.95);
}

.thumbnail {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  opacity: 0.6;
  transition: all 0.3s ease;
  object-fit: cover;
}

.thumbnail-wrapper.active .thumbnail {
  opacity: 1;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-thumbnail-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32rpx;
  height: 32rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.thumbnail-nav::-webkit-scrollbar {
  height: 8rpx;
  border-radius: 4rpx;
  background: #f1f1f1;
}

.thumbnail-nav::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4rpx;
}

.carousel-container {
  position: relative;
  margin: 0 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.carousel-swiper {
  height: 400rpx;
  width: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.custom-indicator {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12rpx;
  z-index: 10;
}

.indicator {
  width: 16rpx;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;

  &.active {
    background-color: #ffffff;
    transform: scale(1.2);
  }
}

@media screen and (max-width: 375px) {
  .carousel-swiper {
    height: 320rpx;
  }

  .indicator {
    width: 12rpx;
    height: 12rpx;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.carousel-image {
  animation: fadeIn 0.5s ease-in-out;
}
</style>