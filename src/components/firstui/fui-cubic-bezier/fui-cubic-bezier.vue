<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：   9 14  4   0605M A 55   6H1  KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<!-- #ifndef APP-NVUE -->
	<view class="fui-cubicbezier__wrap" @tap.stop="handleClick">
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view class="fui-cubicbezier__wrap" @touchstart="appTouchStart" @touchend="appTouchEnd">
			<!-- #endif -->
			<view class="fui-ani__cb-x" v-if="animate" :style="style_x">
				<view class="fui-ani__cb-y" :class="{'fui-ani__cb-android':android}" :style="style_y">
					<slot name="badge"></slot>
				</view>
			</view>
			<slot></slot>
		</view>
</template>

<script>
	export default {
		name: 'fui-cubic-bezier',
		emits: ['click'],
		props: {
			direction: {
				type: String,
				default: 'lb'
			},
			top: {
				type: [Number, String],
				default: 100
			},
			bottom: {
				type: [Number, String],
				default: 100
			},
			left: {
				type: [Number, String],
				default: 60
			},
			right: {
				type: [Number, String],
				default: 60
			},
			navbar: {
				type: Boolean,
				default: true
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				// #ifdef APP-NVUE
				timestamp: 0,
				touches: {},
				// #endif
				time: 0,
				animate: false,
				width: 375,
				height: 1334,
				style_x: '',
				style_y: '',
				navH: 0,
				android: false
			};
		},
		created() {
			let sys = uni.getSystemInfoSync()
			this.width = sys.windowWidth
			this.height = sys.windowHeight
			// #ifdef APP-NVUE
			this.android = sys.platform.toLocaleLowerCase() === "android"
			if (this.navbar) {
				this.navH = sys.statusBarHeight + 44
			}
			// #endif
		},
		methods: {
			// #ifdef APP-NVUE
			appTouchStart(e) {
				this.touches = e.changedTouches[0]
				this.timestamp = new Date().getTime()
			},
			appTouchEnd(e) {
				const {
					screenX
				} = e.changedTouches[0]
				let diff = Math.abs(this.touches.screenX - screenX)
				let time = (new Date().getTime()) - this.timestamp
				if (diff < 5 && time < 300) {
					this.handleClick({
						touches: [this.touches]
					})
				}
			},
			// #endif
			handleClick(e) {
				if (new Date().getTime() - this.time <= 550) return;
				this.time = new Date().getTime();
				setTimeout(() => {
					this.time = 0;
				}, 540);
				this.cbAni(e);
				this.$emit('click', {
					param: this.param
				});
			},
			cbAni(e) {
				let touch = null;

				// #ifdef MP-ALIPAY
				touch = e.detail;
				// #endif

				// #ifdef MP-BAIDU
				touch = e.changedTouches[0]
				// #endif

				// #ifndef MP-ALIPAY || MP-BAIDU
				touch = e.touches[0];
				// #endif

				// #ifdef APP-NVUE
				touch = {
					clientX: touch.screenX,
					clientY: touch.screenY
				}
				// #endif
				let diff = {
					x: 0,
					y: 0
				};
				//rt 右上、rb 右下、lb 左下、lt 左上
				switch (this.direction) {
					case 'rt':
						diff.x = this.width - touch.clientX - uni.upx2px(Number(this.right));
						diff.y = uni.upx2px(Number(this.top)) - touch.clientY;
						break;
					case 'rb':
						diff.x = this.width - touch.clientX - uni.upx2px(Number(this.right));
						diff.y = this.height - touch.clientY - uni.upx2px(Number(this.bottom));
						break;
					case 'lb':
						diff.x = uni.upx2px(Number(this.left)) - touch.clientX;
						diff.y = this.height - touch.clientY - uni.upx2px(Number(this.bottom));
						break;
					case 'lt':
						diff.x = uni.upx2px(Number(this.left)) - touch.clientX;
						diff.y = uni.upx2px(Number(this.top)) - touch.clientY;
						break;
					default:
						break;
				}

				//移动距离
				// #ifdef APP-NVUE
				this.style_x = `left:${touch.clientX}px;top:${touch.clientY-this.navH}px;`
				// #endif
				this.animate = true;
				this.$nextTick(() => {
					setTimeout(() => {
						// #ifdef APP-NVUE
						this.style_x +=
							`transform:translate(${diff.x}px,0px);`;
						this.style_y = `transform:translate(0px,${diff.y+this.navH}px);`;

						// #endif
						// #ifndef APP-NVUE
						this.style_x = `transform:translate3d(${diff.x}px,0,0)`;
						this.style_y = `transform:translate3d(0,${diff.y}px,0)`;
						// #endif
						setTimeout(() => {
							this.animate = false;
							//恢复到最初状态
							this.style_x = '';
							this.style_y = '';
						}, 540);
					}, 50)
				})
			}
		}
	};
</script>

<style scoped>
	.fui-cubicbezier__wrap {
		position: relative;
	}

	.fui-ani__cb-x {
		/* #ifdef APP-NVUE */
		position: fixed;
		/* #endif */
		/* #ifndef APP-NVUE */
		position: absolute;
		left: 0;
		top: 0;
		display: inline-block;
		z-index: 1008;
		/* #endif */

		transition-property: transform;
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0, 0, 0, 0);
	}

	.fui-ani__cb-y {
		/*#ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		transition-property: transform;
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0.3, -0.2, 1, 0);
	}

	/* #ifdef APP-NVUE */
	.fui-ani__cb-android {
		width: 600rpx;
		height: 2000px;
		transition-timing-function: cubic-bezier(0.3, -0.02, 1, 0);
	}

	/* #endif */
</style>