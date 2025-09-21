<script lang="ts" setup>
	import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	import TnPhotoAlbum from '@tuniao/tnui-vue3-uniapp/components/photo-album/src/photo-album.vue'
	import TnAvatar from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue'
	import TnAvatarGroup from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar-group.vue'
	import TnLazyLoad from '@tuniao/tnui-vue3-uniapp/components/lazy-load/src/lazy-load.vue'
	import { graphicCardEmits, graphicCardProps } from './types'
	import { useGraphicCard, useGraphicCardCustomStyle } from './composables'

	const props = defineProps(graphicCardProps)
	const emits = defineEmits(graphicCardEmits)

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



	function linkType(url: string | undefined): number {
		// console.log("------------------------imageCount----------",images)
		// 如果输入不是字符串，返回 2（未知类型）
		if (typeof url !== 'string') return 2;

		// 图片扩展名正则表达式
		const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
		// 视频扩展名正则表达式
		const videoExtensions = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;

		// 判断是否为图片
		if (imageExtensions.test(url)) return 0; // 返回 0 表示图片
		// 判断是否为视频
		if (videoExtensions.test(url)) return 1; // 返回 1 表示视频

		// 都不是，返回 2（未知类型）
		return 2;
	}
</script>

<template>
	<view :class="[ns.b()]" @tap="cardClickEvent">
		<!-- 简要信息 -->
		<view :class="[ns.e('brief-info')]">
			<view :class="[ns.e('brief-info__content')]">
				<view :class="[ns.e('brief-info__avatar')]" @tap.stop="handleAvatarClick">
					<!--          <image class="image" :src="avatar" mode="aspectFill" />-->
					<TnAvatar v-if="avatar" :url="avatar" />
					<TnAvatar v-else :size="80">{{username?.slice(0,1)}}</TnAvatar>
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
					<view :class="[ns.em('brief-info__operation', 'more')]" @tap.stop="handleMoreClick">
						<TnIcon name="more-vertical" />
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
							<view v-if="linkType(item) == 0" @tap.stop="previewImageHandle(index)" style="width: 100%; height: 100%;">
								<!-- 原生image作为备选方案 -->
								<image 
									class="swiper-image" 
									mode="aspectFill" 
									:src="item" 
									style="width: 100%; height: 100%; border-radius: 12rpx;"
									@load="() => $nextTick(() => $forceUpdate())"
									@error="() => $nextTick(() => $forceUpdate())" />
								<!-- TnLazyLoad备选 -->
								<!-- <TnLazyLoad 
									class="swiper-image" 
									mode="aspectFill" 
									:src="item" 
									:width="'100%'"
									:height="'100%'"
									:lazy="false" /> -->
							</view>
							<!-- 视频 -->
							<view v-else-if="linkType(item) == 1" style="width: 100%; height: 100%;">
								<video 
									class="swiper-video"
									:src="item" 
									controls
									style="width: 100%; height: 100%; object-fit: cover;">
								</video>
							</view>
							<!-- 未识别类型 -->
							<view v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
								<text style="color: #999;">无法显示内容</text>
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
		<view v-if="tags && tags.length" :class="[ns.e('tags')]">
			<view v-for="(tagItem, tagIndex) in tags" :key="tagIndex" class="tag-item" :class="[tagClass]"
				:style="tagStyle">
				<TnIcon name="topics-fill" />
				{{ tagItem }}
			</view>
		</view>

		<!-- 底部信息 -->
		<view :class="[ns.e('bottom-info'), ns.is('no-content', !!$slots.bottomRight)]">
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
</style>