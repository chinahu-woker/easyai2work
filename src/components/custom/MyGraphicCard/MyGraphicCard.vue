<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	import TnPhotoAlbum from '@tuniao/tnui-vue3-uniapp/components/photo-album/src/photo-album.vue'
	import TnAvatar from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue'
	import TnAvatarGroup from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar-group.vue'
	import TnLazyLoad from '@tuniao/tnui-vue3-uniapp/components/lazy-load/src/lazy-load.vue'
	import { graphicCardEmits, graphicCardProps } from './types'
	import { useGraphicCard, useGraphicCardCustomStyle } from './composables'
	import { setShareData } from '@/utils/shareManager'
	import type { ShareData } from '@/utils/shareManager'

	const props = defineProps(graphicCardProps)
	const emits = defineEmits(graphicCardEmits)

	// 媒体加载状态管理
	const imageLoadingStates = reactive<Record<number, boolean>>({})
	const imageErrorStates = reactive<Record<number, boolean>>({})
	const videoLoadingStates = reactive<Record<number, boolean>>({})
	const videoErrorStates = reactive<Record<number, boolean>>({})

	const {
		viewUserAvatars,
		viewUserCount,
		imageCount,
		previewImageHandle,
		cardClickEvent,
		handleAvatarClick,
		handleMoreClick,
		handleCommentClick,
		handleHotClick,
		handleLikeClick,
	} = useGraphicCard(props, emits)
	const {
		ns,
		tagClass,
		tagStyle,
		hotClass,
		hotStyle,
		commentClass,
		commentStyle,
		likeClass,
		likeStyle,
	} = useGraphicCardCustomStyle(props)

	// 图片事件处理
	const onImageLoad = (event: any) => {
		// 简化处理：由于uni-app限制，我们使用一个通用的处理方式
		console.log('图片加载成功')
	}

	const onImageError = (event: any) => {
		console.error('图片加载失败:', event)
		uni.showToast({
			title: '图片加载失败',
			icon: 'none',
			duration: 2000
		})
	}

	// 视频事件处理
	const onVideoLoadStart = (event: any) => {
		console.log('视频开始加载')
	}

	const onVideoCanPlay = (event: any) => {
		console.log('视频可以播放')
	}

	const onVideoError = (event: any) => {
		console.error('视频加载失败:', event)
		uni.showToast({
			title: '视频加载失败',
			icon: 'none',
			duration: 2000
		})
	}

	// 简化的索引获取函数
	const getMediaIndex = (target: any): number => {
		// 由于uni-app的DOM限制，这里返回0作为默认值
		// 在实际项目中，可以通过其他方式来追踪具体的媒体项
		return 0
	}

	// 重试加载图片
	const retryLoadImage = (index: number, src: string) => {
		console.log('重试加载图片:', src)
		// 重新加载逻辑可以通过父组件的数据更新来实现
		uni.showToast({
			title: '正在重新加载...',
			icon: 'loading',
			duration: 1000
		})
	}

	// 获取视频海报图
	const getVideoPoster = (videoUrl: string): string => {
		// 可以从videoUrl推断海报图URL，或返回默认海报
		// 这里返回空字符串，让video组件使用默认行为
		return ''
	}

	const buildCurrentPagePath = () => {
		try {
			const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
			const currentPage = Array.isArray(pages) && pages.length ? pages[pages.length - 1] : null
			if (!currentPage) {
				return '/pages/index/index'
			}
			const route = (currentPage as any).route ? `/${(currentPage as any).route}` : '/pages/index/index'
			const options = (currentPage as any).options || {}
			const queryKeys = Object.keys(options)
			if (!queryKeys.length) {
				return route
			}
			const query = queryKeys
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
				.join('&')
			return `${route}?${query}`
		} catch (error) {
			console.warn('构建分享路径时出错:', error)
			return '/pages/index/index'
		}
	}

	const prepareShareDataForCurrentPage = () => {
		const payload: ShareData = {
			title: props.title || props.description || '聚类AI',
			path: buildCurrentPagePath(),
		}
		const fallbackImage = Array.isArray(props.images) && props.images.length
			? props.images[0]
			: props.avatar
		if (fallbackImage) {
			payload.imageUrl = fallbackImage
		}
		setShareData(payload)
		uni.showToast({
			title: '分享内容已更新',
			icon: 'none',
			duration: 1200
		})
	}

	const handleShareAction = () => {
		prepareShareDataForCurrentPage()
		handleMoreClick()
	}

	function linkType(url: string | undefined): number {
		// 如果输入不是字符串，返回 2（未知类型）
		if (typeof url !== 'string') return 2;

		// 移除 URL 中的查询参数和锚点，获取纯净的文件路径
		const cleanUrl = url.split('?')[0].split('#')[0];

		// 图片扩展名正则表达式 - 包含 WebP、AVIF 等现代格式
		const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|avif|svg|tiff|tif|ico)$/i;
		
		// 视频扩展名正则表达式 - 包含更多视频格式
		const videoExtensions = /\.(mp4|avi|mov|mkv|flv|wmv|webm|m4v|3gp|ogv|asf|rm|rmvb|vob|ts|mts|m2ts)$/i;

		// 判断是否为图片
		if (imageExtensions.test(cleanUrl)) return 0; // 返回 0 表示图片
		
		// 判断是否为视频
		if (videoExtensions.test(cleanUrl)) return 1; // 返回 1 表示视频

		// 通过 MIME 类型判断（如果URL包含MIME信息）
		if (url.includes('image/')) return 0;
		if (url.includes('video/')) return 1;

		// 都不是，返回 2（未知类型）
		return 2;
	}
</script>

<template>
	<view :class="[ns.b()]" @tap="cardClickEvent">
		<!-- 简要信息 -->
		<view v-if="showBriefInfo" :class="[ns.e('brief-info')]">
			<view :class="[ns.e('brief-info__content')]">
				<view :class="[ns.e('brief-info__avatar')]" @tap.stop="handleAvatarClick">
					<!--          <image class="image" :src="avatar" mode="aspectFill" />-->
					<TnAvatar v-if="avatar" :url="avatar" :size="40" />
					<TnAvatar v-else :size="40">{{username?.slice(0,1)}}</TnAvatar>
				</view>
				<view :class="[ns.e('brief-info__data')]">
					<view class="title tn-text-ellipsis-1">{{ title }}</view>
					<view v-if="description" class="desc tn-text-ellipsis-1">
						{{ description }}
					</view>
				</view>
			</view>
			<view v-if="showMore" :class="[ns.e('brief-info__operation')]">
				<slot name="briefOperation">
					<view :class="[ns.em('brief-info__operation', 'more')]" @tap.stop="handleShareAction">
						<TnIcon name="share" />
					</view>
				</slot>
			</view>
		</view>
		<!-- 内容容器 -->
		<view :class="[ns.e('container')]">
			<!-- 内容 -->
			<view :class="[ns.e('content')]">
				<!-- 图片/视频轮播 -->
				<view v-if="!!imageCount" :class="[ns.e('swiper-container')]">
					<swiper 
						class="media-swiper" 
						:indicator-dots="imageCount > 1" 
						:autoplay="false" 
						:interval="3000" 
						:duration="500"
						indicator-color="rgba(255, 255, 255, 0.5)"
						indicator-active-color="#007aff">
						<swiper-item v-for="(item, index) in images" :key="`${index}-${item}`" :class="[ns.e('swiper-item')]">
							<!-- 图片 -->
							<view v-if="linkType(item) == 0" @tap.stop="previewImageHandle(index)" style="width: 100%; height: 100%; position: relative;">
								<!-- 主图片 - 添加安卓优化 -->
								<image 
									class="swiper-image" 
									mode="aspectFill" 
									:src="item" 
									style="width: 100%; height: 100%; border-radius: 12rpx;"
									:show-menu-by-longpress="false"
									:lazy-load="true"
									:webp="true"
									:fade-show="true"
									@load="onImageLoad"
									@error="onImageError">
								</image>
							</view>
							
							<!-- 视频 -->
							<view v-else-if="linkType(item) == 1" style="width: 100%; height: 100%; position: relative;">
								<video 
									class="swiper-video"
									:src="item" 
									:controls="true"
									:show-center-play-btn="true"
									:show-play-btn="true"
									:enable-play-gesture="true"
									:object-fit="'cover'"
									:poster="getVideoPoster(item)"
									style="width: 100%; height: 100%; border-radius: 12rpx;"
									@error="onVideoError"
									@loadstart="onVideoLoadStart"
									@canplay="onVideoCanPlay">
								</video>
							</view>
							
							<!-- 未识别类型 -->
							<view v-else style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12rpx;">
								<TnIcon name="file" size="40" color="#ccc" />
								<text style="color: #999; font-size: 24rpx; margin-top: 8rpx;">不支持的格式</text>
								<text style="color: #ccc; font-size: 20rpx; margin-top: 4rpx;">{{ item.split('.').pop()?.toUpperCase() }}</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
				<!-- 无图片时的占位符 -->
				<view v-else :class="[ns.e('swiper-container')]" style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
					<view style="text-align: center; color: #999;">
						<TnIcon name="image" size="60" color="#ccc" style="margin-bottom: 16rpx;" />
						<text style="font-size: 24rpx; display: block;">暂无图片</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 标签区域（底部显示） -->
		<view v-if="showTags && tags && tags.length" :class="[ns.e('tags')]">
			<view v-for="(tagItem, tagIndex) in tags" :key="tagIndex" class="tag-item" :class="[tagClass]"
				:style="tagStyle">
				<TnIcon name="topics-fill" />
				<text class="tag-text">{{ tagItem }}</text>
			</view>
		</view>

		<!-- 底部信息 -->
		<view v-if="showBottomInfo" :class="[ns.e('bottom-info'), ns.is('no-content', !!$slots.bottomRight)]">
			<view :class="[ns.e('bottom-info__actions')]">
				<view :class="[ns.e('bottom-info__left')]">
					<view v-if="showHot" class="count-item-data" :class="[hotClass]" :style="hotStyle"
						@tap.stop="handleHotClick">
						<TnIcon :name="activeHot ? activeHotIcon : hotIcon"  size="20px"  />
						<view class="count">{{ hotCount }}</view>
					</view>
					<view v-if="showComment" class="count-item-data" :class="[commentClass]" :style="commentStyle"
						@tap.stop="handleCommentClick">
						<TnIcon :name="activeComment ? activeCommentIcon : commentIcon"  size="20px" />
						<view class="count">{{ commentCount }}</view>
					</view>
					<view v-if="showLike" class="count-item-data" :class="[likeClass]" :style="likeStyle"
						@tap.stop="handleLikeClick">
						<TnIcon :name="activeLike ? activeLikeIcon : likeIcon"  size="20px" />
						<view class="count">{{ likeCount }}</view>
					</view>
				</view>
				<view v-if="(showViewUser && viewUserAvatars.length) || $slots.bottomRight"
					:class="[ns.e('bottom-info__right')]">
					<slot name="bottomRight">
						<!-- 查看用户头像列表 -->
						<view :class="[ns.e('view-user-list')]">
							<TnAvatarGroup border size="sm">
								<TnAvatar v-for="(viewUserAvatar, viewUserIndex) in viewUserAvatars" :key="viewUserIndex"
									:url="viewUserAvatar" />
							</TnAvatarGroup>
						</view>
						<!-- 查看用户数量 -->
						<view :class="[ns.e('view-user-count')]">
							{{ viewCount !== undefined ? viewCount : viewUserCount }}人
						</view>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	@import './theme-chalk/index.scss';

	// 媒体加载状态样式
	.image-loading-overlay,
	.video-loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 12rpx;
		z-index: 10;
	}

	.video-loading-overlay {
		background: rgba(0, 0, 0, 0.6);
	}

	.image-error-overlay,
	.video-error-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(245, 245, 245, 0.9);
		border-radius: 12rpx;
		cursor: pointer;
		z-index: 10;
		transition: all 0.3s ease;

		&:hover {
			background: rgba(240, 240, 240, 0.95);
		}
	}

	.loading-spinner-small {
		width: 40rpx;
		height: 40rpx;
		border: 3rpx solid rgba(255, 255, 255, 0.3);
		border-top: 3rpx solid #007aff;
		border-radius: 50%;
		animation: spin-small 1s linear infinite;
	}

	@keyframes spin-small {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	// 视频样式优化
	.swiper-video {
		border-radius: 12rpx;
		background: #000;
	}

	// 图片样式优化
	.swiper-image {
		transition: all 0.3s ease;
		
		&:hover {
			transform: scale(1.02);
		}
	}

	// 媒体容器样式
	.media-swiper {
		border-radius: 12rpx;
		overflow: hidden;
	}
</style>