<template>

    <scroll-view 
        class="community-container" 
        scroll-y="true" 
        @scrolltolower="loadMoreData"
        :lower-threshold="100">
        <view style="margin-bottom: -55rpx;">
            <text style="font-size: 40rpx; margin-left: 25rpx; ">热门作品</text>
            <fui-icon custom-prefix="iconfontIndex" name="icon-remen" size="45"></fui-icon>
        </view>

        <up-status-bar />

        <!-- 加载状态 -->
        <view v-if="loading" class="loading-container">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 错误状态 -->
        <view v-else-if="errorMsg" class="error-container">
            <text class="error-text">{{ errorMsg }}</text>
            <button class="retry-btn" @click="() => getTestImageData(false)">重试</button>
        </view>

        <!-- 空数据状态 -->
        <view v-else-if="graphicDatas.length === 0" class="empty-container">
            <text class="empty-text">暂无社区内容</text>
        </view>

        <!-- 瀑布流容器 -->
        <view v-else-if="graphicDatas.length > 0 && isComponentReady" class="waterfall-container">
            <view class="waterfall-column">
                <view v-for="(item, index) in leftColumnData" :key="`left-${item.id}-${index}`" class="waterfall-item"
                    @click="goToEntire(item.id)">
                    <MyGraphicCard :avatar="item.avatar" :title="item.title" :username="item.username"
                        :description="item.description" :tags="item.tags" :content="item.content" :images="item.images"
                        :view-count="item.viewCount" :show-hot="false" :show-comment="false" :show-like="false"
                        :view-user-avatars="item.viewUserAvatars">
                        <template #bottomRight>
                            <!-- 暂时注释分享按钮 -->
                            <!-- <view class="share-actions">
                                <view class="share-btn" @click.stop="generatePoster(item)">
                                    <fui-icon name="partake" color="#465CFF"></fui-icon>
                                </view>
                            </view> -->
                        </template>
                    </MyGraphicCard>
                </view>
            </view>

            <view class="waterfall-column">
                <view v-for="(item, index) in rightColumnData" :key="`right-${item.id}-${index}`" class="waterfall-item"
                    @click="goToEntire(item.id)">
                    <MyGraphicCard :avatar="item.avatar" :title="item.title" :username="item.username"
                        :description="item.description" :tags="item.tags" :content="item.content" :images="item.images"
                        :view-count="item.viewCount" :show-hot="false" :show-comment="false" :show-like="false"
                        :view-user-avatars="item.viewUserAvatars">
                        <template #bottomRight>
                            <!-- 暂时注释分享按钮 -->
                            <!-- <view class="share-actions">
                                <view class="share-btn" @click.stop="generatePoster(item)">
                                    <fui-icon name="partake" color="#465CFF"></fui-icon>
                                </view>
                            </view> -->
                        </template>
                    </MyGraphicCard>
                </view>
            </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="loading-more-container">
            <view class="loading-more-spinner"></view>
            <text class="loading-more-text">加载更多中...</text>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMoreData && graphicDatas.length > 0" class="no-more-data">
            <text class="no-more-text">已显示全部内容</text>
        </view>

        <!-- 底部版权信息 -->
        <view class="footer-space">
            <fui-footer text="内容由AI生成请仔细甄别"></fui-footer>
        </view>
  

        <!-- 调试信息 -->

        <!-- 隐藏的Canvas用于生成海报 -->
        <canvas canvas-id="posterCanvas"
            style="position: fixed; top: -9999px; left: -9999px; width: 750px; height: 1334px;"></canvas>
    </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import MyGraphicCard from "@/components/custom/MyGraphicCard/MyGraphicCard.vue"
import { request } from "@/utils/request.ts"
import type { IDrawHistoryItem } from "@/types"
import { formatDateTime } from "@/utils/common.ts"
import fuiFooter from "@/components/firstui/fui-footer/fui-footer.vue"
import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
import { PosterGenerator, type PosterData } from "@/utils/posterGenerator.ts"
import { setShareData, generateDetailShareData } from "@/utils/shareManager.ts"

// 数据获取
const loading = ref(true)
const errorMsg = ref('')
const isComponentReady = ref(false)

// 分页状态管理
const currentPage = ref(1)
const pageSize = ref(10)
const hasMoreData = ref(true)
const loadingMore = ref(false)
const allImageData = ref<IDrawHistoryItem[]>([])
const displayedCount = ref(10) // 当前显示的数据数量

const getTestImageData = async (isLoadMore = false) => {
    try {
        if (!isLoadMore) {
            loading.value = true
            errorMsg.value = ''
        } else {
            loadingMore.value = true
        }

        const response = await request<IDrawHistoryItem[]>('draw/history/findMany', {
            method: 'POST',
            data: {
                history: {
                    is_deleted: false,
                    is_public: true,
                }
            }
        })

        if (response && Array.isArray(response) && response.length > 0) {
            if (!isLoadMore) {
                // 首次加载，重置所有数据
                allImageData.value = response
                displayedCount.value = Math.min(pageSize.value, response.length)
                hasMoreData.value = response.length > pageSize.value
            } else {
                // 加载更多，保持原有数据不变，只增加显示数量
                const newDisplayCount = Math.min(displayedCount.value + pageSize.value, allImageData.value.length)
                displayedCount.value = newDisplayCount
                hasMoreData.value = newDisplayCount < allImageData.value.length
            }
        } else {
            if (!isLoadMore) {
                allImageData.value = []
                displayedCount.value = 0
            }
            hasMoreData.value = false
        }

    } catch (err) {
        console.error('=== NewCommunity组件：获取数据失败 ===', err)
        if (!isLoadMore) {
            errorMsg.value = '数据加载失败: ' + (err as any)?.message || '未知错误'
            allImageData.value = []
            displayedCount.value = 0
        } else {
            uni.showToast({
                title: '加载失败，请重试',
                icon: 'error'
            })
        }
        hasMoreData.value = false
    } finally {
        if (!isLoadMore) {
            loading.value = false
        } else {
            loadingMore.value = false
        }
    }
}

// 加载更多数据
const loadMoreData = async () => {
    if (loadingMore.value || !hasMoreData.value) return
    
    console.log('触发加载更多数据')
    await getTestImageData(true)
}

const imageData = ref<IDrawHistoryItem[]>([])

// 图文卡片展示的数据 - 基于显示数量控制
const graphicDatas = computed(() => {
    if (!Array.isArray(allImageData.value)) {
        return []
    }

    // 只取当前应该显示的数据数量
    const dataToShow = allImageData.value.slice(0, displayedCount.value)

    const result = dataToShow.map((item, index) => {
        const it: any = item || {}

        // 调试信息：输出视频类型的数据
        if (it.type === 'video') {
            console.log('处理视频数据:', {
                id: it._id,
                type: it.type,
                workflowName: it.workflow_name,
                outputCount: it.output?.length || 0,
                outputUrls: it.output
            })
        }

        const mappedItem = {
            id: it._id,
            avatar: it.user_id?.avatar_url || 'https://static.nailoffice.cn/default-avatar.png',
            title: it.user_id?.nickname || it.user_id?.username || '匿名用户',
            username: it.user_id?.nickname || it.user_id?.username || '匿名用户',
            description: formatDateTime(new Date(it.created_at || Date.now())),
            tags: it.tags || [],
            content: (() => {
                if (it.type === 'video') {
                    // 视频类型显示工作流名称和描述
                    const workflowTitle = it.workflow_title || it.workflow_name || ''
                    const positive = it.params?.positive || ''
                    if (workflowTitle && positive) {
                        return `${workflowTitle}: ${positive.slice(0, 80)}...`
                    } else if (workflowTitle) {
                        return workflowTitle
                    } else if (positive) {
                        return positive.slice(0, 120) + '...'
                    } else {
                        return '视频内容'
                    }
                } else {
                    // 图片类型显示原来的逻辑
                    return (it.params?.positive?.slice(0, 120) || '') + "..."
                }
            })(),
            type: it.type || 'image', // 添加类型信息
            mediaSize: it.mediaSize || null, // 添加媒体尺寸信息
            workflowName: it.workflow_name || it.workflow_title || '', // 工作流名称
            images: (() => {
                const inputImages: string[] = []
                const paramsAny = it.params as Record<string, any> | undefined
                
                // 收集输入图片
                if (paramsAny) {
                    for (const key in paramsAny) {
                        if (key.startsWith('image_path_') && paramsAny[key]) {
                            // 只有当参数值是图片URL时才添加
                            const value = paramsAny[key]
                            if (typeof value === 'string' && 
                                value.match(/\.(jpg|jpeg|png|gif|bmp|webp|avif|svg|tiff|tif|ico)(\?|$)/i)) {
                                inputImages.push(value)
                            }
                        }
                    }
                }
                
                let allMediaUrls = []
                
                // 根据数据类型处理输出内容
                if (it.type === 'video') {
                    // 如果是视频类型，output 中的内容应该作为视频处理
                    if (it.output && Array.isArray(it.output)) {
                        allMediaUrls = [...inputImages, ...it.output]
                    } else {
                        allMediaUrls = inputImages
                    }
                } else {
                    // 如果不是视频类型，按原来的逻辑处理（主要是图片）
                    if (it.output && Array.isArray(it.output)) {
                        allMediaUrls = [...inputImages, ...it.output]
                    } else {
                        allMediaUrls = inputImages
                    }
                }
                
                // 过滤无效的媒体URL
                const validMediaUrls = allMediaUrls.filter(media => 
                    media && 
                    typeof media === 'string' && 
                    media.trim() !== '' &&
                    (media.startsWith('http://') || media.startsWith('https://'))
                )
                
                // 如果没有有效媒体，返回空数组
                return validMediaUrls.length > 0 ? validMediaUrls : []
            })(),
            viewCount: (it.view_count ?? it.viewCount ?? Math.floor(Math.random() * 1000)),
            viewUserAvatars: it.view_user_avatars ?? it.viewUserAvatars ?? [],
            // 原始数据，用于海报生成
            originalData: it
        }

        return mappedItem
    })

    return result
})

// 监听数据变化，确保组件准备状态正确设置
watch(graphicDatas, (newData) => {
    if (newData && newData.length > 0 && !loading.value) {
        nextTick(() => {
            isComponentReady.value = true
        })
    }
}, { immediate: true })

// 左列数据（偶数索引）
const leftColumnData = computed(() => {
    return graphicDatas.value.filter((_, index) => index % 2 === 0)
})

// 右列数据（奇数索引）
const rightColumnData = computed(() => {
    return graphicDatas.value.filter((_, index) => index % 2 === 1)
})

// 导航功能
let isNavigating = false
function goToEntire(id: any) {
    if (isNavigating) return
    isNavigating = true

    uni.navigateTo({
        url: `/pages/drawLike/alike?id=${id}`,
        complete: () => {
            isNavigating = false
        }
    })
}

// 海报生成功能
const posterGenerating = ref(false)

async function generatePoster(item: any) {
    if (posterGenerating.value) return

    try {
        posterGenerating.value = true
        console.log('开始生成海报:', item)

        // 获取小程序码（二维码）
        const qrCodeUrl = await generateMiniProgramCode(item.id)

        // 准备海报数据
        const posterData: PosterData = {
            title: item.title,
            content: item.content,
            image: item.images[0] || '',
            avatar: item.avatar,
            username: item.username,
            qrCode: qrCodeUrl,
            tags: item.tags || []
        }

        // 生成海报图片
        const posterUrl = await PosterGenerator.generatePoster(posterData)

        // 保存到相册并分享
        await saveAndSharePoster(posterUrl, item)

    } catch (error) {
        console.error('生成海报失败:', error)
        uni.showToast({
            title: '生成失败，请重试',
            icon: 'error'
        })
    } finally {
        posterGenerating.value = false
    }
}

// 生成小程序码
async function generateMiniProgramCode(itemId: string): Promise<string> {
    try {
        // 调用后端API生成小程序码，包含跳转到详情页的path
        const qrData = {
            page: 'pages/drawLike/alike',
            scene: `id=${itemId}`,
            width: 280
        }

        console.log('生成小程序码参数:', qrData)

        // 方案1: 调用后端API生成真实的小程序码（推荐）
        // const response = await request('wechat/generateQRCode', {
        //     method: 'POST',
        //     data: qrData
        // })
        // return response.qrCodeUrl

        // 方案2: 暂时使用一个在线的测试二维码（确保URL有效）
        // return 'https://via.placeholder.com/280x280/007aff/ffffff?text=QR'

        // 方案3: 不使用二维码，海报生成器会自动跳过
        return ''

    } catch (error) {
        console.error('生成小程序码失败:', error)
        return ''
    }
}

// 保存并分享海报
async function saveAndSharePoster(posterUrl: string, itemData?: any) {
    try {
        // 保存到相册
        await uni.saveImageToPhotosAlbum({
            filePath: posterUrl
        })

        // 显示分享选项
        uni.showActionSheet({
            itemList: ['分享给朋友', '分享到朋友圈', '复制详情链接'],
            success: (res) => {
                switch (res.tapIndex) {
                    case 0:
                        // 分享给朋友
                        shareToFriend(posterUrl, itemData)
                        break
                    case 1:
                        // 分享到朋友圈
                        shareToTimeline(posterUrl, itemData)
                        break
                    case 2:
                        // 复制链接
                        copyShareLink(itemData)
                        break
                }
            }
        })

    } catch (error) {
        console.error('保存海报失败:', error)
        uni.showToast({
            title: '保存失败',
            icon: 'error'
        })
    }
}

// 分享给朋友
function shareToFriend(imageUrl: string, itemData?: any) {
    if (itemData) {
        // 设置当前分享的数据到全局状态
        const shareData = generateDetailShareData(itemData.id, itemData.title, imageUrl)
        setShareData(shareData)
    }

    // #ifdef MP-WEIXIN
    // 在微信小程序中，通过右上角分享菜单分享
    const shareTitle = itemData ? `${itemData.title} - 精美美甲设计` : '发现一个很棒的美甲设计！'

    uni.showModal({
        title: '分享提示',
        content: `请点击右上角的分享按钮，分享"${shareTitle}"给朋友`,
        showCancel: false
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.showToast({
        title: '请在微信小程序中使用分享功能',
        icon: 'none'
    })
    // #endif
}

// 分享到朋友圈
function shareToTimeline(imageUrl: string, itemData?: any) {
    if (itemData) {
        // 设置当前分享的数据到全局状态
        const shareData = generateDetailShareData(itemData.id, itemData.title, imageUrl)
        setShareData(shareData)
    }

    // #ifdef MP-WEIXIN
    // 在微信小程序中，通过右上角分享菜单分享到朋友圈
    const shareTitle = itemData ? `${itemData.title} | NAILOFFICE-AI` : 'NAILOFFICE-AI | 精美美甲设计分享'

    uni.showModal({
        title: '分享提示',
        content: `请点击右上角的分享按钮，选择分享到朋友圈`,
        showCancel: false
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.showToast({
        title: '请在微信小程序中使用分享功能',
        icon: 'none'
    })
    // #endif
}

// 复制分享链接
function copyShareLink(itemData?: any) {
    if (itemData) {
        // 设置当前分享的数据到全局状态
        const shareData = generateDetailShareData(itemData.id, itemData.title, itemData.images?.[0] || '')
        setShareData(shareData)
    }

    let shareLink = 'https://your-domain.com/share?page=community'

    if (itemData && itemData.id) {
        // 生成具体内容的分享链接
        shareLink = `https://your-domain.com/share?page=detail&id=${itemData.id}`
    }

    uni.setClipboardData({
        data: shareLink,
        success: () => {
            uni.showToast({
                title: '详情链接已复制',
                icon: 'success'
            })
        }
    })
}

onMounted(() => {
    console.log('=== NewCommunity组件：已挂载 ===')
    getTestImageData(false)
})

// 组件挂载时处理已有数据
onMounted(async () => {
    // 获取数据
    await getTestImageData(false)
    
    // 如果数据已经存在，立即初始化
    if (graphicDatas.value && graphicDatas.value.length > 0) {
        nextTick(() => {
            isComponentReady.value = true
        })
    }
})

onUnmounted(() => {
    console.log('=== NewCommunity组件：已卸载 ===')
    // 销毁当前组件
    allImageData.value = []
    displayedCount.value = 0
    hasMoreData.value = true
    loadingMore.value = false
})
</script>
<style scoped lang="scss">
.community-container {
    background: transparent;
    min-height: 100vh;
    height: 100vh;
    padding: 0 20rpx;
    box-sizing: border-box;
}

/* 瀑布流容器 */
.waterfall-container {
    display: flex;
    gap: 20rpx;
    align-items: flex-start;
    min-height: 200rpx;
}

.waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    width: calc(50% - 10rpx);
}

.waterfall-item {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    margin-bottom: 20rpx;
    break-inside: avoid;
    page-break-inside: avoid;

    &:hover {
        transform: translateY(-4rpx);
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
    }
}

.footer-space {
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    margin-top: 20rpx;
    margin-bottom: 260rpx;
}

/* 响应式布局 */
@media (max-width: 600rpx) {
    .community-container {
        padding: 0 10rpx;
    }

    .waterfall-container {
        gap: 15rpx;
    }

    .waterfall-column {
        gap: 15rpx;
    }
}

/* 加载状态样式 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400rpx;
    padding: 40rpx;
}

.loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid #f3f3f3;
    border-top: 6rpx solid #007aff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #666;
}

/* 错误状态样式 */
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400rpx;
    padding: 40rpx;
}

.error-text {
    font-size: 28rpx;
    color: #e74c3c;
    margin-bottom: 30rpx;
}

.retry-btn {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
    cursor: pointer;
}

/* 空数据状态样式 */
.empty-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400rpx;
    padding: 40rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}

/* 调试信息样式 */
.debug-info {
    position: fixed;
    bottom: 100rpx;
    left: 20rpx;
    right: 20rpx;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    z-index: 1000;

    text {
        display: block;
        margin-bottom: 10rpx;
    }
}

/* 分享按钮样式 */
.share-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.share-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rpx;
    background: rgba(0, 122, 255, 0.1);
    border-radius: 8rpx;
    border: 1rpx solid #007aff;
    transition: all 0.3s ease;
    width: 60rpx;
    height: 60rpx;

    &:active {
        background: rgba(0, 122, 255, 0.2);
        transform: scale(0.95);
    }
}

.share-icon {
    font-size: 32rpx;
    margin-bottom: 8rpx;
}

.share-text {
    font-size: 22rpx;
    color: #007aff;
    font-weight: 500;
}

/* 加载更多样式 */
.loading-more-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    margin-top: 20rpx;
}

.loading-more-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #f3f3f3;
    border-top: 4rpx solid #007aff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-more-text {
    margin-top: 20rpx;
    font-size: 26rpx;
    color: #666;
}

/* 无更多数据样式 */
.no-more-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    margin-top: 20rpx;
}

.no-more-text {
    font-size: 26rpx;
    color: #999;
    opacity: 0.8;
}
</style>