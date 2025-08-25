<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 12 7，营业执照号：9 14  4  06  05MA5 5  6H  1K  X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view>
		<!-- #ifdef APP-VUE || H5 -->
		<view class="fui-movable__view" :class="{'fui-movable__cursor':direction!=='none'}" :data-direction="direction"
			:data-width="maxWidth" :data-height="maxHeight" :data-left="eLeft" :data-top="eTop" :data-app="isApp"
			@touchstart="handler.touchstart" @touchmove="handler.touchmove" @mousedown="handler.mousedown"
			:style="getStyles">
			<slot></slot>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view class="fui-movable__view" :class="{'fui-movable__cursor':direction!=='none'}" :data-direction="direction"
			:data-width="maxWidth" :data-height="maxHeight" :data-left="eLeft" :data-top="eTop" :data-app="isApp"
			@touchstart="handler.touchstart" :catchtouchmove="handler.touchmove" :style="getStyles">
			<slot></slot>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-movable__view" @touchstart="touchstart" @touchmove.stop.prevent="touchmove"
			ref="fui-movable__view" :style="getStyles">
			<slot></slot>
		</view>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
		<view class="fui-movable__view" @touchstart="touchstart" @touchmove.stop.prevent="touchmove" :style="getStyles">
			<slot></slot>
		</view>
		<!-- #endif -->
	</view>
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	const dom = uni.requireNativePlugin('dom');
	// #endif
	import mpjs from './mpjs.js'
	import bindingx from './bindingx.js'
	export default {
		name: "fui-movable-view",
		emits: ['change'],
		mixins: [mpjs, bindingx],
		props: {
			//left值,设置大于-1的值则right失效
			left: {
				type: [Number, String],
				default: -1
			},
			right: {
				type: [Number, String],
				default: 80
			},
			//top值,设置大于-1的值则bottom失效
			top: {
				type: [Number, String],
				default: -1
			},
			bottom: {
				type: [Number, String],
				default: 120
			},
			zIndex: {
				type: [Number, String],
				default: 10
			},
			//移动方向，属性值有all、vertical、horizontal、none
			direction: {
				type: String,
				default: 'all'
			}
		},
		data() {
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				maxWidth: 0,
				maxHeight: 0,
				eLeft: 0,
				eTop: 0,
			};
		},
		watch: {
			position(val) {
				this.$nextTick(() => {
					setTimeout(() => {
						this._getSize()
					}, 50);
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this._getSize()
				}, 50);
			})
		},
		computed: {
			position() {
				return `${this.left}_${this.right}_${this.top}_${this.bottom}`
			},
			getStyles() {
				let styles = `z-index:${this.zIndex};`
				if (this.left != -1) {
					styles += `left:${this.left}rpx;`
				} else {
					styles += `right:${this.right}rpx;`
				}
				if (this.top != -1) {
					styles += `top:${this.top}rpx;`
				} else {
					styles += `bottom:${this.bottom}rpx;`
				}
				// #ifndef APP-PLUS || MP-WEIXIN || H5
				if (this.direction !== 'none') {
					styles += `transform:${this.transform};`
				}
				// #endif
				return styles;
			}
		},
		methods: {
			_getSize() {
				const sys = uni.getSystemInfoSync()
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select('.fui-movable__view')
					.boundingClientRect()
					.exec(ret => {
						if (ret) {
							this.maxWidth = sys.windowWidth - ret[0].width - ret[0].left;
							this.maxHeight = sys.windowHeight - ret[0].height - ret[0].top;
							this.eLeft = ret[0].left || 0;
							this.eTop = ret[0].top || 0;
							this.change({
								left: 0,
								top: 0
							})
						}
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui-movable__view'], (ret) => {
					const size = ret.size
					if (size) {
						this.maxWidth = sys.windowWidth - size.width - size.left;
						this.maxHeight = sys.windowHeight - size.height - size.top;
						this.eLeft = size.left || 0;
						this.eTop = size.top || 0;
						this.change({
							left: 0,
							top: 0
						})
					}
				})
				// #endif
			},
			reset() {
				setTimeout(() => {
					this._getSize()
				}, 50);
			},
			change(e) {
				this.$emit('change', {
					x: e.left + this.eLeft,
					y: e.top + this.eTop
				})
			}
		}
	}
</script>

<style scoped>
	.fui-movable__view {
		position: fixed;
	}

	/* #ifdef H5 */
	.fui-movable__cursor {
		cursor: grab;
	}

	/* #endif */
</style>