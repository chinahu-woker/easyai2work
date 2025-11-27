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
        <view v-else-if="graphicDatas.length > 0" class="waterfall-container">
            <view class="waterfall-column">
                <view v-for="(item, index) in leftColumnData" :key="`left-${item.id}-${index}`" class="waterfall-item"
                    @click="goToEntire(item.id)">
                    <MyGraphicCard :avatar="item.avatar" :title="item.title" :username="item.username"
                        :description="item.description" :tags="item.tags" :content="item.content" :images="item.images"
                        :view-count="item.viewCount" :show-hot="false" :show-comment="false" :show-like="false"
                        :view-user-avatars="item.viewUserAvatars" :show-more="false" :show-view-user="false"
                        :show-brief-info="true" :show-tags="false" :show-bottom-info="false">
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
                        :view-user-avatars="item.viewUserAvatars" :show-more="false" :show-view-user="false"
                        :show-brief-info="true" :show-tags="false" :show-bottom-info="false">
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import MyGraphicCard from "@/components/custom/MyGraphicCard/MyGraphicCard.vue"
import { request } from "@/utils/request.ts"
import type { IDrawHistoryItem, User } from "@/types"
import { formatDateTime } from "@/utils/common.ts"
import fuiFooter from "@/components/firstui/fui-footer/fui-footer.vue"
import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
import { PosterGenerator, type PosterData } from "@/utils/posterGenerator.ts"
import { setShareData, generateDetailShareData } from "@/utils/shareManager.ts"
import { defaultAssets } from "@/cofigs/data/globalAppData"

type HistoryApiItem = IDrawHistoryItem & {
    user?: User
    user_id?: string | User
    output_content?: Array<{ url?: string | null; type?: string | null; mediaSize?: unknown }>
    workflow?: { title?: string; name?: string }
    workflow_title?: string
    workflow_name?: string
}

const FALLBACK_AVATAR = typeof defaultAssets.avatar === 'string' && defaultAssets.avatar.trim().length
    ? defaultAssets.avatar
    : 'https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250521115936505-3434-06.png'
const FALLBACK_SUMMARY = '精彩内容敬请期待'
const VIDEO_SUMMARY = '视频内容'
const MEDIA_URL_PATTERN = /\.(jpg|jpeg|png|gif|bmp|webp|avif|svg|tiff|tif|ico|mp4|mov|webm|avi|mkv|wmv)(\?|$)/i

type CommunityCard = {
    id: string
    avatar: string
    title: string
    username: string
    description: string
    tags: string[]
    content: string
    type: string
    mediaSize: HistoryApiItem['mediaSize'] | null
    workflowName: string
    images: string[]
    viewCount: number
    viewUserAvatars: string[]
    originalData: HistoryApiItem
}

const resolveHistoryItems = (payload: unknown): HistoryApiItem[] => {
    if (Array.isArray(payload)) {
        return payload as HistoryApiItem[]
    }
    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        const directItems = record.items
        if (Array.isArray(directItems)) {
            return directItems as HistoryApiItem[]
        }
        const data = record.data
        if (data && typeof data === 'object') {
            const nestedItems = (data as Record<string, unknown>).items
            if (Array.isArray(nestedItems)) {
                return nestedItems as HistoryApiItem[]
            }
        }
    }
    return []
}

const resolveHistoryTotal = (payload: unknown, fallback: number): number => {
    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        const totalValue = record.total ?? (record.data && typeof record.data === 'object' ? (record.data as Record<string, unknown>).total : undefined)
        if (typeof totalValue === 'number' && Number.isFinite(totalValue)) {
            return totalValue
        }
    }
    return fallback
}

const resolveUserInfo = (item: HistoryApiItem): User | undefined => {
    if (item.user && typeof item.user === 'object') {
        return item.user
    }
    if (item.user_id && typeof item.user_id === 'object') {
        return item.user_id as User
    }
    return undefined
}

const isValidMediaUrl = (url?: string | null): url is string => {
    if (!url || typeof url !== 'string') return false
    const trimmed = url.trim()
    if (!trimmed) return false
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false
    return MEDIA_URL_PATTERN.test(trimmed)
}

const truncateText = (value: string, maxLength: number) => {
    if (!value) return ''
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

const toPlainObject = (value: unknown): Record<string, any> => (value && typeof value === 'object') ? value as Record<string, any> : {}

const toArray = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : []

const parseHistoryResponse = (payload: unknown) => {
    const items = resolveHistoryItems(payload)
    const total = Math.max(resolveHistoryTotal(payload, items.length), items.length)
    return { items, total }
}

const mergeHistoryItems = (current: HistoryApiItem[], incoming: HistoryApiItem[]) => {
    if (!incoming.length) return current
    const merged = current.slice()
    const indexMap = new Map<string, number>()
    merged.forEach((item, idx) => {
        if (item?._id) indexMap.set(item._id, idx)
    })
    incoming.forEach(item => {
        if (!item) return
        if (item._id && indexMap.has(item._id)) {
            merged[indexMap.get(item._id)!] = item
        } else {
            if (item?._id) indexMap.set(item._id, merged.length)
            merged.push(item)
        }
    })
    return merged
}

const collectResultMediaUrls = (entry: HistoryApiItem) => {
    const fromOutputs = toArray(entry?.output)
        .map(value => {
            if (typeof value === 'string') return value
            if (value && typeof value === 'object' && 'url' in value) {
                const possible = (value as { url?: string | null }).url
                return typeof possible === 'string' ? possible : undefined
            }
            return undefined
        })
        .filter(isValidMediaUrl)

    const fromOutputContent = toArray<{ url?: string | null }>(entry?.output_content)
        .map(item => item?.url)
        .filter(isValidMediaUrl)

    return Array.from(new Set([...fromOutputs, ...fromOutputContent]))
}

const createSummary = (typeValue: unknown, workflowTitle: string | undefined, positive: string) => {
    if (typeValue === 'video') {
        if (workflowTitle && positive) return `${workflowTitle}: ${truncateText(positive, 80)}`
        if (workflowTitle) return workflowTitle
        if (positive) return truncateText(positive, 120)
        return VIDEO_SUMMARY
    }
    return positive ? truncateText(positive, 120) : FALLBACK_SUMMARY
}

// 数据获取
const loading = ref(true)
const errorMsg = ref('')

// 分页状态管理
const pageSize = ref(10)
const hasMoreData = ref(true)
const loadingMore = ref(false)
const totalCount = ref(0)
const allImageData = ref<HistoryApiItem[]>([])
const displayedCount = ref(pageSize.value)

const getTestImageData = async (isLoadMore = false) => {
    try {
        if (isLoadMore) {
            loadingMore.value = true
        } else {
            loading.value = true
            errorMsg.value = ''
        }

        const response = await request<unknown>('draw/history/findMany', {
            method: 'POST',
            data: {
                history: {
                    is_deleted: false,
                    is_public: true,
                }
            }
        })

        const { items, total } = parseHistoryResponse(response)

        if (isLoadMore) {
            allImageData.value = mergeHistoryItems(allImageData.value, items)
            totalCount.value = Math.max(totalCount.value, total, allImageData.value.length)
            const maxAvailable = Math.max(totalCount.value, allImageData.value.length)
            displayedCount.value = Math.min(displayedCount.value + pageSize.value, maxAvailable)
        } else {
            allImageData.value = items
            totalCount.value = total
            displayedCount.value = Math.min(pageSize.value, allImageData.value.length)
        }

        const available = Math.max(totalCount.value, allImageData.value.length)
        hasMoreData.value = displayedCount.value < available
    } catch (err) {
        console.error('=== NewCommunity组件：获取数据失败 ===', err)
        if (!isLoadMore) {
            const message = (err as { message?: string })?.message || '未知错误'
            errorMsg.value = '数据加载失败: ' + message
            allImageData.value = []
            displayedCount.value = 0
            totalCount.value = 0
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
    await getTestImageData(true)
}

// 图文卡片展示的数据 - 基于显示数量控制
const graphicDatas = computed<CommunityCard[]>(() => {
    const source = Array.isArray(allImageData.value) ? allImageData.value : []
    const limited = source.slice(0, displayedCount.value)
    const cards: CommunityCard[] = []

    limited.forEach((entry, index) => {
        const plain = toPlainObject(entry)
        const entryId = entry?._id || plain._id || `history-${index}`
        const userInfo = resolveUserInfo(entry)
        const displayName = userInfo?.nickname || userInfo?.username || '匿名用户'
        const avatarUrl = userInfo?.avatar_url || FALLBACK_AVATAR

        const createdAtValue = plain.created_at ?? entry?.created_at ?? Date.now()
        const createdAt = new Date(createdAtValue)
        const description = Number.isNaN(createdAt.getTime()) ? formatDateTime(new Date()) : formatDateTime(createdAt)

        const paramsRecord = toPlainObject(entry?.params)
        const positive = typeof paramsRecord.positive === 'string' ? paramsRecord.positive : ''
        const workflowTitle = [entry?.workflow?.title, entry?.workflow?.name, entry?.workflow_title, entry?.workflow_name, plain.workflow_title, plain.workflow_name]
            .find(value => typeof value === 'string' && value.trim()) as string | undefined

        const tags: string[] = []

        const images = collectResultMediaUrls(entry)
        if (!images.length) {
            return
        }
        const typeValue = typeof entry?.type === 'string' ? entry.type : typeof plain.type === 'string' ? plain.type : 'image'

        const viewCountSource = plain.view_count ?? plain.viewCount
        const viewCount = typeof viewCountSource === 'number' ? viewCountSource : Math.floor(Math.random() * 1000)

        const rawViewAvatars = plain.view_user_avatars ?? plain.viewUserAvatars
        const viewUserAvatars = toArray<string>(rawViewAvatars).filter(Boolean)

        cards.push({
            id: entryId,
            avatar: avatarUrl,
            title: displayName,
            username: displayName,
            description,
            tags,
            content: createSummary(typeValue, workflowTitle, positive),
            type: typeValue,
            mediaSize: entry?.mediaSize || plain.mediaSize || null,
            workflowName: workflowTitle || '',
            images,
            viewCount,
            viewUserAvatars,
            originalData: entry
        })
    })
    return cards
})

const emitCommunityImages = (items: CommunityCard[]) => {
    try {
        const uniqueImages = Array.from(new Set(
            items.flatMap(item => item.images.filter(url => MEDIA_URL_PATTERN.test(url)))
        )).slice(0, 60)
        console.log('NewCommunity - emitting community-images, count:', uniqueImages.length, 'first:', uniqueImages[0])
        uni.$emit && uni.$emit('community-images', uniqueImages)
        try { uni.setStorageSync && uni.setStorageSync('communityImages', uniqueImages) } catch (error) {}
    } catch (error) {
        console.warn('emitCommunityImages error', error)
    }
}

watch(graphicDatas, (cards) => {
    emitCommunityImages(cards)
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
        url: `/pagesDrawLike/alike?id=${encodeURIComponent(id)}`,
        success: () => {
            isNavigating = false
        },
        fail: (error) => {
            isNavigating = false
            console.error('navigateTo /pagesDrawLike/alike 失败:', error)
            uni.showToast({
                title: '打开作品失败',
                icon: 'none'
            })
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
    const shareTitle = itemData ? `${itemData.title} | Julei` : 'Julei | 精美美甲设计分享'

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
    getTestImageData(false)
})

onUnmounted(() => {
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