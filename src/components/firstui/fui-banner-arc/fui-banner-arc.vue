<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  11 27，营业执照号：91440 6  0 5   M A 5  5 6 H1   KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-banner__arc-wrap" ref="fui_banner__arc"
		:style="{height:height+'rpx',marginTop:marginTop+'rpx',marginBottom:marginBottom+'rpx'}" @tap="handleClick">
		<!-- #ifndef APP-NVUE -->
		<view class="fui-banner__arc-inner"
			:style="{background:background,height:height+'rpx',width:width+'%',paddingLeft:(width-100)/2+'%',paddingRight:(width-100)/2+'%',left:'-'+(width-100)/2+'%'}">
			<slot></slot>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view class="fui-banner__arc-inner"
			:style="{background:background,height:width+'px',width:width+'px',paddingLeft:(width-bannerWidth)/2+'px',paddingRight:(width-bannerWidth)/2+'px',left:'-'+(width-bannerWidth)/2+'px'}">
			<slot></slot>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	export default {
		name: "fui-banner-arc",
		emits: ['click'],
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			height: {
				type: [Number, String],
				default: 400
			},
			//圆弧view宽度与banner宽度比率，最小值 1.2:1
			ratio: {
				type: [Number, String],
				default: 1.2
			},
			background: {
				type: String,
				default: ''
			},
			marginTop: {
				type: [Number, String],
				default: 0
			},
			marginBottom: {
				type: [Number, String],
				default: 0
			}
		},
		watch: {
			ratio(val) {
				// #ifdef APP-NVUE
				if (this.bannerWidth) {
					this.initArcWidth()
				}
				// #endif
				// #ifndef APP-NVUE
				this.initArcWidth()
				// #endif
			}
		},
		data() {
			return {
				// #ifdef APP-NVUE
				width: 450,
				// #endif
				// #ifndef APP-NVUE
				width: 120,
				// #endif
				bannerWidth: 375
			};
		},
		// #ifdef APP-NVUE
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this._getSize()
				}, 50)
			});
		},
		// #endif
		// #ifndef APP-NVUE
		created() {
			this.initArcWidth()
		},
		// #endif
		methods: {
			initArcWidth() {
				let ratio = Number(this.ratio || 0)

				// #ifdef APP-NVUE
				ratio = ratio < 1.5 ? 1.5 : ratio;
				let width = Math.ceil(this.bannerWidth * ratio)
				width = width % 2 === 0 ? width : width + 1;
				this.width = width;
				// #endif

				// #ifndef APP-NVUE
				ratio = ratio < 1.2 ? 1.2 : ratio;
				this.width = 100 * ratio;
				// #endif
			},
			// #ifdef APP-NVUE
			_getSize() {
				dom.getComponentRect(this.$refs['fui_banner__arc'], (ret) => {
					const size = ret.size
					if (size) {
						this.bannerWidth = size.width
						this.initArcWidth()
					}
				})
			},
			// #endif
			handleClick() {
				this.$emit('click', {})
			}
		}
	}
</script>

<style scoped>
	.fui-banner__arc-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		position: relative;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	.fui-banner__arc-inner {
		position: absolute;
		/* #ifndef APP-NVUE */
		top:0;
		box-sizing: border-box;
		z-index: 1;
		border-radius: 0 0 50% 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		bottom: 0;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 10000px;
		border-bottom-left-radius: 10000px;
		justify-content: flex-end;
		/* #endif */
		overflow: hidden;
	}
</style>