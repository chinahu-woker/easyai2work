<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号：9 144060  5    M  A556H       1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view :style="getStyle">
		<view class="fui-nav__bar"
			:class="{'fui-nav__bar-line':splitLine,'fui-nva__bar-bg':!background,'fui-nav__bar-fixed':isFixed}"
			:style="{background:background,'border-bottom-color':lineColor,paddingLeft:padding+'px',paddingRight:padding+'px',zIndex:zIndex}">
			<view class="fui-nav__status-bar" :style="{height:statusBarHeight+'px'}" v-if="statusBar"></view>
			<view class="fui-nav__header" v-if="!custom">
				<view class="fui-nav__left" @tap="leftClick">
					<slot></slot>
				</view>
				<view class="fui-nav__title" v-if="title" @tap="titleClick">
					<text class="fui-nav__title-text"
						:style="{fontSize:size+'px',color:color,fontWeight:fontWeight}">{{title}}</text>
				</view>
				<view class="fui-nav__right" @tap="rightClick">
					<slot name="right"></slot>
				</view>
			</view>
			<view class="fui-nav__header" v-if="custom">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	var sys = uni.getSystemInfoSync();
	export default {
		name: "fui-nav-bar",
		emits: ['init', 'leftClick', 'rightClick', 'titleClick'],
		props: {
			//navbar左右padding值，单位px
			padding: {
				type: [Number, String],
				default: 8
			},
			//标题
			title: {
				type: String,
				default: ''
			},
			//标题字体大小，单位px
			// #ifdef H5
			size: {
				type: [Number, String],
				default: 16
			},
			// #endif
			// #ifndef H5
			size: {
				type: [Number, String],
				default: 17
			},
			// #endif
			//标题颜色
			// #ifdef APP-NVUE
			color: {
				type: String,
				default: '#181818'
			},
			// #endif

			// #ifndef APP-NVUE
			color: {
				type: String,
				default: ''
			},
			// #endif

			fontWeight: {
				type: [Number, String],
				default: 500
			},
			// #ifdef APP-NVUE
			background: {
				type: String,
				default: '#fff'
			},
			// #endif

			// #ifndef APP-NVUE
			background: {
				type: String,
				default: ''
			},
			// #endif
			//是否需要底部分割线
			splitLine: {
				type: Boolean,
				default: false
			},
			//分割线颜色，仅Nvue生效
			lineColor: {
				type: String,
				default: '#eee'
			},
			//是否包含状态栏
			statusBar: {
				type: Boolean,
				default: true
			},
			//是否固定在顶部
			isFixed: {
				type: Boolean,
				default: false
			},
			//z-index
			zIndex: {
				type: [Number, String],
				default: 996
			},
			//自定义navbar内容，title、右插槽失效
			custom: {
				type: Boolean,
				default: false
			},
			//v1.9.9+
			isOccupy: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			getStyle() {
				let style = ''
				if (this.isOccupy) {
					let height = this.statusBar ? (this.statusBarHeight + 44) : 44
					style += `height:${height}px;`
				}
				return style
			}
		},
		data() {
			return {
				statusBarHeight: sys.statusBarHeight
			};
		},
		created() {
			let obj = {};
			// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
			obj = uni.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			this.$emit('init', {
				windowWidth: sys.windowWidth,
				//不包含状态栏高度固定为：44px
				height: 44,
				statusBarHeight: this.statusBarHeight,
				//小程序右上角悬浮按钮左边界坐标，单位：px
				left: obj.left || -1,
				//小程序右上角悬浮按钮宽度，单位：px
				btnWidth: obj.width || 0,
				//小程序右上角悬浮按钮高度，单位：px
				btnHeight: obj.height || 0
			})
		},
		methods: {
			leftClick() {
				this.$emit("leftClick");
			},
			rightClick() {
				this.$emit("rightClick");
			},
			titleClick() {
				this.$emit("titleClick");
			}
		}
	}
</script>

<style scoped>
	.fui-nav__status-bar {
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
	}

	.fui-nav__header {
		height: 44px;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
	}

	.fui-nav__bar {
		flex: 1;
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-nva__bar-bg {
		background: var(--fui-bg-color, #fff) !important;
	}

	/* #endif */
	.fui-nav__bar-line {
		position: relative;
		/* #ifdef APP-NVUE */
		border-bottom: 0.5px;
		border-bottom-style: solid;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-bottom: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-nav__bar-line::after {
		content: '';
		position: absolute;
		border-bottom: 1px solid var(--fui-color-border, #EEEEEE) !important;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		bottom: 0;
		right: 0;
		left: 0;
	}

	/* #endif */
	.fui-nav__left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 150rpx;
		justify-content: flex-start;
		align-items: center;
	}

	.fui-nav__right {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 150rpx;
		justify-content: flex-end;
		align-items: center;
	}

	.fui-nav__title {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 0 30rpx;
	}

	/* #ifndef APP-NVUE */
	.fui-nav__title-color {
		color: var(--fui-color-title, #181818) !important;
	}

	/* #endif */

	.fui-nav__title-text {
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */

		/* #ifndef APP-NVUE */
		display: block;
		overflow: hidden;
		white-space: nowrap;
		/* #endif */

		text-overflow: ellipsis;
	}

	.fui-nav__bar-fixed {
		position: fixed;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		/* #ifndef H5 */
		left: 0;
		right: 0;
		/* #endif */
		top: 0;
	}
</style>