<template class="carousel-container">
  <fui-nav-bar background="transparent" :title="draw_data.data.options?.workflow_title" @leftClick="leftClick">
    <fui-icon name="arrowleft"></fui-icon>
  </fui-nav-bar>


  <view class="carousel-container">
    <swiper class="carousel-swiper" :circular="false" :indicator-dots="true" :autoplay="false" :interval="3000"
      :duration="500" :style="{ height: swiperHeight + 'px' }" @change="onSwiperChange">

      <swiper-item :key="index" class="carousel-item" v-for="(item, index) in draw_data.data?.output">
        <template v-if="getItemType(item) === 'image'">
          <image class="carousel-image" :src="item" mode="aspectFill" @click="previewImage(item)" />
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
    <view class="thumbnail-nav" v-if="draw_data.data?.output?.length > 1">
      <image v-for="(item, index_cer) in draw_data.data?.output" :key="index_cer" :src="item"
        :class="['thumbnail', { active: currentIndex === index_cer }]" @click="goToSlide(index_cer)" />
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
      <text class="value">{{ draw_data.data.params[key] }}</text>
      <!-- <button class="copy-btn" @click="copyValue(draw_data.data.params[key])">复制</button> -->
      <!-- <up-button class="submit-button copy-btn "   @click="copyValue(draw_data.data.params[key])" type="primary" shape="circle">
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

      <view class="comment-item" v-for="comment in draw_data.data.comment" :key="comment._id">
        <!-- 在评论项的.comment-item容器内添加 -->
        <!-- {{ comment.author._id == user._id   }}
          
        {{ user  }} -->
        <view class="comment-content-wrapper">

          <view class="comment-header">

            <fui-avatar size="small" :src="comment.author?.avatar_url"></fui-avatar>
            <view class="comment-author">{{ comment.author?.nickname || comment.author?.username }}</view>

          </view>

          <view class="comment-content">{{ comment?.content }}</view>
          <view class="comment-time">{{ formatTime(comment.created_at) }}</view>
          <view class="reply-list" v-if="comment.replies && comment.replies?.length">
            <view class="reply-item" v-for="reply in comment.replies" :key="reply._id">
              <view class="reply-header">
                <fui-avatar size="small" :src="reply.author?.avatar_url"></fui-avatar>
                <view class="reply-author">
                  {{ reply.author?.nickname || reply.author?.username }}
                  <text class="comment-author">@{{ comment.author?.nickname || comment.author?.username }}</text>
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
          <text v-if="comment.author._id === user._id" class="delete-comment"
            @click="deleteComment(comment._id)">删除</text>
          <text class="refrenc-comment" @click="RefComments(comment._id, comment._id, comment.author._id)">回复</text>


        </view>
      </view>

      <!-- 暂无评论提示 -->
      <view v-if="!draw_data?.data.comment?.length" class="no-comment">暂无评论</view>
      <!-- <view v-if="draw_data.data.comment && !draw_data.data.comment.length" class="no-comment">暂无评论</view> -->
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

<script setup lang="ts">

import { onLoad } from "@dcloudio/uni-app";
import { ref } from 'vue'
import { getdetail, Comment, allUserName, delComment } from "@/composables/aiChat.ts";
import { useAppStore } from "@/stores/appStore.ts";
import {
  isLogin
} from "@/composables/useCommon.ts";
import { storeToRefs } from "pinia";
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
  uni.navigateBack({ url: '/pages/index/index?pageindex=2' });

}

const currentIndex = ref(0)
const swiperHeight = ref(400)


const swiperRef = ref()

const currentVideoIndex = ref<number | null>(null)
const videoContexts = ref<UniApp.VideoContext[]>([])

// 获取 item 类型
function getItemType(url: string): 'image' | 'video' {
  return /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image'
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
// function getAvatarUrl(userId: string): string {
//   const users = uni.getStorageSync('allUserNames') || []
//   if (!Array.isArray(users)) return ''

//   const user = users.find(u => u._id === userId)
//   return user?.avatar_url || '/static/default-avatar.png' // 默认头像路径
// }


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
const draw_data = ref<{ data: { comment?: CommentItem[] } }>({
  data: {}
});

const detailId = ref<string>('')

onLoad(async (params) => {
  try {
    // 验证参数
    if (!params.id) {
      throw new Error('缺少必要参数：id')
    }
    // 加载数据
    console.log('id:', params.id, user.value, draw_data)
    detailId.value = params.id // 保存 id 供后续使用

    await getdetail(user.value, params.id).then(res => {
      console.log('获取到的getUserKey信息:', res.data);
      draw_data.value = res.data
    }).catch(err => {
      console.error('获取getUserKey失败:', err);
    })

  } catch (err) {
    console.error('数据加载失败:', err)
    error.value = '加载失败，请重试'
    loading.value = false
  }
  // fetchAndSaveUserNames()
})
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
  if (draw_data.value.data.is_public) {
    uni.navigateTo({
      url: '/pages/draw/apps/apps?id=' + draw_data.value.data.workflow_id +
        '&isRegenerate=true&regenerateParams=' + encodeURIComponent(JSON.stringify(draw_data.value.data.params))
    });
  }
  else {
    uni.showToast({
      title: '该应用目前不可用',
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

  .copy-btn {
    width: 120rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    color: #fff;
    background-color: #465CFF;
    border-radius: 40rpx;
    padding: 0;
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

.thumbnail {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  opacity: 0.6;
  transition: all 0.3s ease;
  object-fit: cover;
}

.thumbnail.active {
  opacity: 1;
  transform: scale(1.1);
  border: 2rpx solid #465CFF;
}

.thumbnail:active {
  transform: scale(0.95);
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
