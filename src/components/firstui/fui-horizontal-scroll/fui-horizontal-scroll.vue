<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 12  7，营业执照号：9      1 4 40 6    05MA556H1KX    H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-horizontal__scroll" :style="{marginTop:marginTop+'rpx',marginBottom:marginBottom+'rpx'}"
		ref="fui_horizontal__scroll">
		<!-- #ifdef APP-VUE  || MP-WEIXIN || H5-->
		<scroll-view :show-scrollbar="false" :scroll-x="true" :upper-threshold="0" :lower-threshold="0" :data-width="width" :data-bgwidth="bgWidth"
			:data-blockwidth="blockWidth" @scroll="handler.scroll" @scrolltoupper="handler.scrolltoupper"
			@scrolltolower="handler.scrolltolower" class="fui-hor__scroll-view">
			<view class="fui-hor__scroll-wrap">
				<slot></slot>
			</view>
		</scroll-view>

		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<scroller class="fui-hor__scroll-view" ref="fui_scroller_view" scroll-direction="horizontal"
			:show-scrollbar="false" :offset-accuracy="2" @scroll="nvueScrollHandler">
			<view class="fui-hor__scroll-wrap">
				<slot></slot>
			</view>
		</scroller>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS || MP-WEIXIN || H5-->
		<scroll-view :show-scrollbar="false" :scroll-x="true" :upper-threshold="0" :lower-threshold="0" class="fui-hor__scroll-view"
			@scroll="scrollHandler" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower">
			<view class="fui-hor__scroll-wrap">
				<slot></slot>
			</view>
		</scroll-view>
		<!-- #endif -->
		<view class="fui-hor__scrollbar-wrap" :style="{marginTop:scrollGap+'rpx'}" v-if="scroll">
			<view class="fui-hor__scrollbar" :class="{'fui-hor__scroll-radius':scrollCap==='round'}"
				:style="{height:blockHeight+'px',width:bgWidth+'px',background:background}">
				<view class="fui-hor__scroll-indicator"
					:class="{'fui-hor__scroll-radius':scrollCap==='round','fui-hor__scroll-bg':!scrollBarColor}"
					:style="getStyles" ref="fui_hor_indicator"></view>
			</view>
		</view>
	</view>
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->
<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	import bindingx from './bindingx.js'
	import mpjs from './mpjs.js'
	export default {
		name: "fui-horizontal-scroll",
		mixins: [mpjs, bindingx],
		emits: ['scrolltoupper', 'scrolltolower'],
		props: {
			marginTop: {
				type: [String, Number],
				default: 0
			},
			marginBottom: {
				type: [String, Number],
				default: 0
			},
			// 是否显示滚动条
			scroll: {
				type: Boolean,
				default: true
			},
			// 滚动条区域宽度/长度
			scrollWidth: {
				type: [String, Number],
				default: 96
			},
			// 滚动条的宽度
			scrollBarWidth: {
				type: [String, Number],
				default: 32
			},
			// 滚动区域/滚动条高度
			scrollHeight: {
				type: [String, Number],
				default: 8
			},
			//滚动条两端样式，可选值为 square、round
			scrollCap: {
				type: String,
				default: 'round'
			},
			scrollBarColor: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: '#EEEEEE'
			},
			//自定义滚动条距离上方内容间距
			scrollGap: {
				type: [String, Number],
				default: 24
			}
		},
		data() {
			return {
				width: 0,
				//滚动条背景长度
				bgWidth: 0,
				//滚动条滑块长度
				blockWidth: 0,
				blockHeight: 0,
				transform: '',
				isMounted: false
			};
		},
		created() {
			this.bgWidth = this.getPx(this.scrollWidth || 96)
			this.blockWidth = this.getPx(this.scrollBarWidth || 32)
			this.blockHeight = this.getPx(this.scrollHeight || 8)
		},
		mounted() {
			this.isMounted = true
			this.$nextTick(() => {
				this.init()
			})
		},
		// #ifdef H5
		updated() {
			if(!this.isMounted && !this.width){
				setTimeout(() => {
					this.init()
				}, 0)
			}
		},
		// #endif
		watch: {
			scrollWidth(val) {
				this.bgWidth = this.getPx(val || 96)
			},
			scrollBarWidth(val) {
				this.blockWidth = this.getPx(this.scrollBarWidth || 32)
			},
			scrollHeight(val) {
				this.blockHeight = this.getPx(this.scrollHeight || 8)
			}
		},
		computed: {
			getStyles() {
				let style = `height:${this.blockHeight}px;width:${this.blockWidth}px;`
				let color = this.scrollBarColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				if (color && color !== true) {
					style += `background:${color};`
				}
				// #ifndef APP-PLUS || MP-WEIXIN
				style += `transform:${this.transform}`
				// #endif
				return style
			}
		},
		methods: {
			//如果初始化有误，可调用此方法重新初始化
			init() {
				setTimeout(() => {
					this._getSize()
				}, 80);
			},
			getPx(rpx) {
				let px = Math.floor(uni.upx2px(Number(rpx)));
				px = px % 2 === 0 ? px : px + 1
				return px;
			},
			scrollEvent(edge) {
				const event = edge === 'left' ? 'scrolltoupper' : 'scrolltolower'
				this.$emit(event)
			},
			_getSize() {
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select('.fui-horizontal__scroll')
					.boundingClientRect()
					.exec(ret => {
						if (ret) {
							this.width = ret[0].width || 0
						}
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_horizontal__scroll'], (ret) => {
					const size = ret.size
					if (size) {
						this.width = size.width
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	::-webkit-scrollbar {
		width: 0 !important;
		height: 0 !important;
		color: transparent !important;
		display: none;
	}

	/* #endif */
	.fui-horizontal__scroll,
	.fui-hor__scroll-view,
	.fui-hor__scroll-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
	}

	.fui-horizontal__scroll {
		flex-direction: column;
		align-items: stretch;
		/* #ifndef APP-NVUE */
		align-content: flex-start;
		/* #endif */
	}

	.fui-hor__scrollbar-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
	}

	.fui-hor__scrollbar {
		position: relative;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		transform: translateZ(0);
		/* #endif */

	}

	.fui-hor__scroll-radius {
		border-radius: 100px;
	}

	.fui-hor__scroll-indicator {
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		transition: all 0.1s linear;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-hor__scroll-bg {
		background-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
</style>