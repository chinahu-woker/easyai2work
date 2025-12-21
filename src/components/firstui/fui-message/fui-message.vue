<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11  2 7，营业执照号：   91 4 40  6 05 MA  5 56H1   KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view ref="fui_message_ani" class="fui-message__wrap"
		:class="{'fui-message__show':isShow,'fui-message__flex-row':opts_align!=='center'}"
		:style="{paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0,top:top+'px',left:left+'rpx',right:right+'rpx',background:opts_bg,borderRadius:ridus+'rpx',zIndex:zIndex}"
		v-if="!isNvue || isShow">
		<slot></slot>
		<text class="fui-message__text" :class="{'fui-message__text-full':opts_align!=='center'}"
			:style="{color:opts_color,fontSize:opts_size+'rpx',textAlign:opts_align}" v-if="text">{{text}}</text>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: "fui-message",
		props: {
			padding: {
				type: Array,
				default () {
					return ['24rpx', '32rpx']
				}
			},
			background: {
				type: String,
				default: 'rgba(0, 0, 0, 0.6)'
			},
			color: {
				type: String,
				default: '#fff'
			},
			size: {
				type: [Number, String],
				default: 30
			},
			//left/center/right
			textAlign: {
				type: String,
				default: 'center'
			},
			//提示框top值 px
			top: {
				type: [Number, String],
				default: 0
			},
			left: {
				type: [Number, String],
				default: 0
			},
			right: {
				type: [Number, String],
				default: 0
			},
			ridus: {
				type: [Number, String],
				default: 0
			},
			zIndex: {
				type: Number,
				default: 1001
			}

		},
		watch: {
			color(val) {
				this.opts_color = val
			},
			background(val) {
				this.opts_bg = val
			},
			size(val) {
				this.opts_size = val
			},
			textAlign(val) {
				this.opts_align = val
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				text: '',
				timer: null,
				isShow: false,
				isNvue: isNvue,
				opts_bg: 'rgba(0, 0, 0, 0.6)',
				opts_color: '#fff',
				opts_size: 30,
				opts_align: 'center'
			};
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.clearTimer()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.clearTimer()
		},
		// #endif
		created() {
			this.setOptions()
		},
		methods: {
			setOptions(options = {}) {
				this.opts_color = options.color || this.color
				this.opts_bg = options.background || this.background
				this.opts_size = options.size || this.background
				this.opts_align = options.textAlign || this.textAlign
			},
			show(options) {
				this.clearTimer()
				this.setOptions(options)
				this.text = options.text || ''
				let duration = options.duration || 2000
				this.isShow = true;
				// #ifndef APP-NVUE
				this.timer = setTimeout(() => {
					this.isShow = false;
				}, duration)
				// #endif

				// #ifdef APP-NVUE
				this.$nextTick(() => {
					setTimeout(() => {
						this._animation(true, duration)
					}, 50);
				});
				// #endif
			},
			// #ifdef APP-NVUE
			_animation(type, duration = 2000) {
				if (!this.$refs['fui_message_ani']) return;
				animation.transition(
					this.$refs['fui_message_ani'].ref, {
						styles: {
							transform: `translateY(${type ? '0' : '-100%'})`,
							opacity: type ? 1 : 0
						},
						duration: 250, //ms
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {
						if (!type) {
							this.isShow = false;
						} else {
							this.timer = setTimeout(() => {
								this._animation(false)
							}, duration);
						}
					}
				);
			},
			// #endif
			clearTimer() {
				clearTimeout(this.timer)
				this.timer = null;
			}
		},
	}
</script>

<style scoped>
	.fui-message__wrap {
		position: fixed;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		opacity: 0;
		/* #ifdef APP-NVUE */
		transform: translateY(-100%);
		transition-property: transform, opacity;
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translate3d(0, -100%, 0);
		visibility: hidden;
		transition-property: all;
		/* #endif */
		transition-duration: 0.25s;
		transition-delay: 0s;
		transition-timing-function: ease-in-out;
	}

	.fui-message__flex-row {
		flex-direction: row;
	}


	/* #ifndef APP-NVUE */
	.fui-message__show {
		visibility: visible;
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}

	/* #endif */

	.fui-message__text {
		/* #ifndef APP-NVUE */
		display: block;
		word-break: break-all;
		/* #endif */
		font-weight: normal;
	}

	.fui-message__text-full {
		flex: 1;
	}
</style>