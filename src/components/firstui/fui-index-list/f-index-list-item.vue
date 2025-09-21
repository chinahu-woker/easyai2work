<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号：91 4406 0  5MA5 5  6  H  1     K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-index__list-item" :class="{'fui-il__between':subRight}" @tap="onClick">
		<view class="fui-index__list-left">
			<view class="fui-il__checkbox"
				:class="{'fui-il__checkbox-color':(!selectedColor || selectedColor === true) && model.checked}"
				:style="{background:model.checked?getSelectedColor:'#fff',borderColor:model.checked?getSelectedColor:borderColor}"
				v-if="isSelect">
				<view class="fui-il__checkmark" v-if="model.checked"></view>
			</view>
			<view class="fui-il__img-box" v-if="isSrc">
				<image v-if="model.src" :src="model.src" class="fui-index__list-img" mode="widthFix"></image>
			</view>
			<text class="fui-index__list-main">{{model.text || ''}}</text>
		</view>
		<text class="fui-index__list-sub">{{model.subText || ''}}</text>
		<view class="fui-il__border-bottom" v-if="!last"></view>
	</view>
</template>

<script>
	//此组件为索引列表item项，若不满足要求可自行调整样式
	export default {
		name: 'f-index-list-item',
		props: {
			model: {
				type: Object,
				default () {
					return {}
				}
			},
			isSelect: {
				type: Boolean,
				default: false

			},
			selectedColor: {
				type: String,
				default: ''
			},
			//checkbox未选中时边框颜色
			borderColor: {
				type: String,
				default: '#ccc'
			},
			//是否显示图片
			isSrc: {
				type: Boolean,
				default: false
			},
			//次要内容是否居右侧
			subRight: {
				type: Boolean,
				default: true
			},
			last: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			index: {
				type: Number,
				default: 0
			}
		},
		computed: {
			getSelectedColor() {
				let color = this.selectedColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif

				return color;
			}
		},
		methods: {
			onClick() {
				this.$emit("itemClick", {
					idx: this.idx,
					index: this.index
				})
			}
		}
	};
</script>

<style scoped>
	.fui-index__list-item {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		padding: 32rpx 64rpx 32rpx 32rpx;
		background-color: #FFFFFF;
		position: relative;
	}

	.fui-il__border-bottom {
		position: absolute;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		background-color: #EEEEEE;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		z-index: 1;
		background-color: var(--fui-color-border, #EEEEEE);
		/* #endif */
		left: 32rpx;
		right: 0;
	}

	.fui-index__list-item:active {
		/* #ifdef APP-NVUE */
		background-color: rgba(0, 0, 0, 0.2) !important;
		/* #endif */

		/* #ifndef APP-NVUE */
		background-color: var(--fui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
		/* #endif */
	}

	.fui-il__between {
		justify-content: space-between;
	}

	.fui-index__list-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		overflow: hidden;
	}

	.fui-il__checkbox {
		font-size: 0;
		color: rgba(0, 0, 0, 0);
		width: 40rpx;
		height: 40rpx;
		border-width: 1px;
		border-style: solid;
		/* #ifdef APP-NVUE */
		border-radius: 40rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: inline-flex;
		box-sizing: border-box;
		border-radius: 50%;
		vertical-align: top;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
		margin-right: 24rpx;
	}

	/* #ifndef APP-NVUE */
	.fui-il__checkbox-color {
		background: var(--fui-color-primary, #465CFF) !important;
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	.fui-il__checkmark {
		width: 20rpx;
		height: 40rpx;
		border-bottom-style: solid;
		border-bottom-width: 3px;
		border-bottom-color: #FFFFFF;
		border-right-style: solid;
		border-right-width: 3px;
		border-right-color: #FFFFFF;
		transform: rotate(45deg) scale(0.5);
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		transform: rotate(45deg) scale(0.5) translateZ(0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(45deg) scale(0.5);
		/* #endif */
		transform-origin: 54% 48%;
	}

	.fui-il__img-box {
		/* #ifndef APP-NVUE */
		display: flex;
		background-color: var(--fui-bg-color-content, #F8F8F8);
		/* #endif */
		width: 72rpx;
		height: 72rpx;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		background-color: #F8F8F8;
		/* #endif */
		margin-right: 24rpx;
	}

	.fui-index__list-img {
		width: 72rpx;
		height: 72rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
		border-radius: 8rpx;
	}

	.fui-index__list-main {
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		font-size: 32rpx;
		font-weight: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fui-index__list-sub {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		font-weight: normal;
		font-size: 28rpx;
		color: #999;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		padding-left: 24rpx;
	}
</style>