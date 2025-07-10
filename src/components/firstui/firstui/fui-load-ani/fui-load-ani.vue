<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11 2  7，营业执照号：9 1 44     06 0   5 M  A556H 1K  XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-load__ani" :class="{'fui-load__ani-fixed':isFixed}"
		:style="{background:isFixed?maskColor:'transparent'}">
		<!-- #ifndef APP-NVUE -->
		<view class="fui-load__ani-1" v-if="type==1">
			<view class="fui-load__ani-a" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
			<view class="fui-ani__ani-b" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
			<view :class="{'fui-load__ani-bg':!color || color==='true'}" :style="{background:color}"></view>
		</view>

		<view class="fui-load__ani-2" v-if="type==2">
			<view class="fui-load__ani-line fui-load__ani-c" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
			<view class="fui-load__ani-line fui-load__ani-d" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
			<view class="fui-load__ani-line fui-load__ani-e" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
		</view>

		<view class="fui-load__ani-3" :class="{'fui-load__ani-border':!color || color===true}"
			:style="{'border-left-color':color,'border-right-color':color}" v-if="type==3">
		</view>

		<view class="fui-load__ani-4" :class="{'fui-load__ani-bcolor':!color || color===true}"
			:style="{borderColor:color}" v-if="type==4">
			<view class="fui-load__ani-f" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
		</view>

		<view class="fui-load__ani-5" :class="{'fui-load__ani-bg':!color || color===true}" :style="{background:color}"
			v-if="type==5">
			<view class="fui-load__ani-g" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
			<view class="fui-load__ani-h" :class="{'fui-load__ani-bg':!color || color===true}"
				:style="{background:color}"></view>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-load__ani-1n" v-if="type==1">
			<view class="fui-loadani__1" :style="{background:color}" ref="ani_11"></view>
			<view class="fui-loadani__1" :style="{background:color}" ref="ani_12"></view>
			<view class="fui-loadani__1" ref="ani_13" :style="{background:color}"></view>
		</view>
		<view class="fui-load__ani-2n" v-if="type==2">
			<view class="fui-load__ani-line" ref="ani_11" :style="{background:color}"></view>
			<view class="fui-load__ani-line" ref="ani_12" :style="{background:color}"></view>
			<view class="fui-load__ani-line" ref="ani_13" :style="{background:color}"></view>
		</view>
		<view class="fui-load__ani-3n" ref="fui_loadani34"
			:style="{'border-left-color':color,'border-right-color':color}" v-if="type==3">
		</view>
		<view class="fui-load__ani-4n" ref="fui_loadani34" v-if="type==4">
			<view class="fui-load__ani-41" :style="{borderColor:color}"></view>
			<view class="fui-load__ani-42" :style="{background:color}"></view>
		</view>

		<view class="fui-load__ani-5n" v-if="type==5">
			<view class="fui-load__ani-i" ref="ani_11" :style="{background:color}"></view>
			<view class="fui-load__ani-i" ref="ani_12" :style="{background:color}"></view>
			<view class="fui-load__ani-i" ref="ani_13" :style="{background:color}"></view>
		</view>

		<!-- #endif -->

	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = weex.requireModule('animation')
	// #endif
	export default {
		name: "fui-load-ani",
		props: {
			//loading 类型：1~5
			type: {
				type: [Number, String],
				default: 1
			},
			//loading颜色
			// #ifdef APP-NVUE
			color: {
				type: String,
				default: '#465CFF'
			},
			// #endif
			// #ifndef APP-NVUE
			color: {
				type: String,
				default: ''
			},
			// #endif
			//是否固定在屏幕中间显示
			isFixed: {
				type: Boolean,
				default: false
			},
			//isFixed=true时有效
			maskColor: {
				type: String,
				default: 'transparent'
			}
		},
		// #ifdef APP-NVUE
		created() {
			this.timer = null;
			this.deg = 0;
			this.stop = false;
		},
		mounted() {
			clearInterval(this.timer)
			this.$nextTick(() => {
				if (this.type == 1 || this.type == 2 || this.type == 5) {
					setTimeout(() => {
						this.startAni()
					}, 50)
					this.timer = setInterval(() => {
						this.startAni()
					}, 1200)
				} else if (this.type == 3 || this.type == 4) {
					setTimeout(() => {
						this.deg += 360;
						this._animation()
					}, 50)
				}
			})
		},
		// #ifndef VUE3
		beforeDestroy() {
			clearInterval(this.timer)
			this.deg = 0;
			this.stop = true;
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			clearInterval(this.timer)
			this.deg = 0;
			this.stop = true;
		},
		// #endif
		methods: {
			transition(el, options, duration, delay = 0) {
				return new Promise((resolve) => {
					animation.transition(el.ref, {
						duration,
						delay,
						timingFunction: 'linear',
						needLayout: false,
						...options,
					}, resolve)
				})
			},
			ani(el) {
				let styles = {}
				let styles2 = {}
				if (this.type == 5) {
					styles.opacity = 0.25
					styles2.opacity = 1
				} else {
					styles.transform = this.type == 1 ? 'scale(0)' : `translateY(0)`
					styles2.transform = this.type == 1 ? 'scale(1)' : `translateY(100%)`
				}
				this.transition(el, {
					styles
				}, 500, 0).then(() => {
					this.transition(el, {
						styles: styles2
					}, 500, 0)
				})
			},
			startAni() {
				this.ani(this.$refs['ani_11'])
				setTimeout(() => {
					this.ani(this.$refs['ani_12'])
				}, 300)
				setTimeout(() => {
					this.ani(this.$refs['ani_13'])
				}, 500)
			},
			_animation() {
				if (!this.$refs['fui_loadani34'] || this.stop) return;
				animation.transition(
					this.$refs['fui_loadani34'].ref, {
						styles: {
							transform: `rotate(${this.deg}deg)`
						},
						duration: 800, //ms
						timingFunction: 'linear',
						iterationCount: 'infinite',
						needLayout: false,
						delay: 0 //ms
					}, () => {
						this.deg += 360;
						this._animation()
					}
				);

			}
		}

		// #endif
	}
</script>

<style scoped>
	.fui-load__ani {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-VUE */
		flex: 1;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.fui-load__ani-fixed {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		z-index: 996;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	/* #ifndef APP-NVUE */
	.fui-load__ani-1{
		flex-direction: row;
	}
	.fui-load__ani-1 view {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		display: inline-block;
		animation: ani_1 1.4s infinite ease-in-out;
		animation-fill-mode: both;
	}

	.fui-load__ani-1 .fui-load__ani-a {
		animation-delay: -0.30s;
	}

	.fui-load__ani-1 .fui-load__ani-b {
		animation-delay: -0.15s;
	}

	@keyframes ani_1 {

		0%,
		80%,
		100% {
			-webkit-transform: scale(0)
		}

		40% {
			-webkit-transform: scale(1)
		}
	}

	.fui-load__ani-2 {
		position: relative;
		width: 60rpx;
		height: 60rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.fui-load__ani-line {
		width: 8rpx;
		position: absolute;
		border-top-left-radius: 8rpx;
		border-top-right-radius: 8rpx;
		bottom: 0;
		transform: translateZ(0);
	}

	.fui-load__ani-c {
		animation: ani_2 0.5s ease alternate infinite;
	}

	.fui-load__ani-d {
		left: 20rpx;
		animation: ani_2 0.5s 0.2s ease alternate infinite;
	}

	.fui-load__ani-e {
		left: 40rpx;
		animation: ani_2 0.5s 0.4s ease alternate infinite;
	}

	@keyframes ani_2 {
		0% {
			height: 0;
		}

		100% {
			height: 75%;
		}
	}

	.fui-load__ani-3 {
		width: 40rpx;
		height: 40rpx;
		border: 2px solid transparent;
		border-radius: 50%;
		animation: 0.9s ani_3 linear infinite;
	}

	@keyframes ani_3 {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}


	.fui-load__ani-4 {
		width: 52rpx;
		height: 52rpx;
		border: 1px solid;
		border-radius: 50%;
		-webkit-animation: 1s ani_3 linear infinite;
		animation: .9s ani_3 linear infinite;
		position: relative;
	}

	.fui-load__ani-f {
		width: 16rpx;
		height: 16rpx;
		position: absolute;
		top: -8rpx;
		left: 50%;
		border-radius: 50%;
		opacity: .6;
	}

	.fui-load__ani-5 {
		position: relative;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		animation: ani_4 1s infinite linear;

	}

	.fui-load__ani-g,
	.fui-load__ani-h {
		display: inline-block;
		position: absolute;
		top: 0;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		opacity: 0.25;
	}

	.fui-load__ani-g {
		left: -30rpx;
		animation: ani_4_2 1s infinite linear;

	}

	.fui-load__ani-h {
		left: 30rpx;
		animation: ani_4_1 1s infinite linear;
	}

	@-webkit-keyframes ani_4 {
		0% {
			opacity: 1;
		}

		33% {
			opacity: 0.25;
		}

		66% {
			opacity: 0.25;
		}

		100% {
			opacity: 1;
		}

	}

	@keyframes ani_4_1 {
		0% {
			opacity: 0.25;
		}

		33% {
			opacity: 1;
		}

		66% {
			opacity: 0.25;
		}
	}

	@keyframes ani_4_2 {
		33% {
			opacity: 0.25;
		}

		66% {
			opacity: 1;
		}

		100% {
			opacity: 0.25;
		}
	}

	.fui-load__ani-bcolor {
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-load__ani-border {
		border-left-color: var(--fui-color-primary, #465CFF) !important;
		border-right-color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-load__ani-bg {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-load__ani-1n {
		flex-direction: row;
		align-items: center;
	}

	.fui-loadani__1 {
		width: 36rpx;
		height: 36rpx;
		border-radius: 36rpx;
	}

	.fui-load__ani-2n {
		position: relative;
		width: 56rpx;
		height: 56rpx;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		overflow: hidden;
	}

	.fui-load__ani-line {
		width: 8rpx;
		height: 56rpx;
		border-top-left-radius: 8rpx;
		border-top-right-radius: 8rpx;
		transform: translateY(100%);
	}

	.fui-load__ani-3n {
		width: 40rpx;
		height: 40rpx;
		border: 2px solid transparent;
		border-radius: 24rpx;
	}

	.fui-load__ani-4n {
		width: 68rpx;
		height: 68rpx;
		position: relative;
		align-items: center;
		justify-content: center;
		border: 0;
	}

	.fui-load__ani-41 {
		width: 52rpx;
		height: 52rpx;
		border: 1px solid;
		border-radius: 50%;
	}

	.fui-load__ani-42 {
		width: 16rpx;
		height: 16rpx;
		position: absolute;
		top: 0rpx;
		left: 26rpx;
		border-radius: 12rpx;
		opacity: .6;
	}

	.fui-load__ani-5n {
		width: 76rpx;
		height: 18rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.fui-load__ani-i {
		width: 16rpx;
		height: 16rpx;
		border-radius: 12rpx;
		opacity: .25;
	}

	/* #endif */
</style>