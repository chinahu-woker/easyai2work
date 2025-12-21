<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 1 27，营业执照号：91 4 40      605 MA5  56   H1KX   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view @appear="handleAppear" class="fui-lazyload__wrap"
		:style="{background:background,width:width==-1?'100%':width+'rpx',height:(height==0 || height==-1)?'auto':height+'rpx',borderRadius:radius+'rpx',marginTop:marginTop+'rpx',marginRight:marginRight+'rpx',marginBottom:marginBottom+'rpx',marginLeft:marginLeft+'rpx'}"
		@tap="handleTap">
		<image class="fui-lazyload__img" lazy-load :class="[visible?'fui-lazyload__visible':'fui-lazyload__hidden']"
			:style="getStyl" :src="show?src:placeholder" :mode="(height==0 || height==-1)?'widthFix':mode" :webp="webp"
			:draggable="draggable" @load="handleLoad" @error="handleError" :id="elId"></image>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "fui-lazyload",
		emits: ['error', 'load', 'click'],
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			src: {
				type: String,
				default: ''
			},
			width: {
				type: [String, Number],
				default: 320
			},
			height: {
				type: [String, Number],
				default: 320
			},
			radius: {
				type: [String, Number],
				default: 0
			},
			placeholder: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: '#EEEEEE'
			},
			mode: {
				type: String,
				default: 'widthFix'
			},
			webp: {
				type: Boolean,
				default: false
			},
			draggable: {
				type: Boolean,
				default: true
			},
			marginTop: {
				type: [String, Number],
				default: 0
			},
			marginRight: {
				type: [String, Number],
				default: 0
			},
			marginBottom: {
				type: [String, Number],
				default: 0
			},
			marginLeft: {
				type: [String, Number],
				default: 0
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		computed: {
			getStyl() {
				const width = this.width == -1 ? '100%' : `${this.width}rpx`;
				let style = `width:${width};border-radius:${this.radius}rpx;`;
				// TODO：如果有平台自适应不显示图片，auto时将写法改为height:rpx;
				if (this.height != 0 || this.height != -1) {
					style += `height:${this.height}rpx;`
				}
				return style
			}
		},
		data() {
			return {
				show: false,
				visible: false,
				isMounted: false,
				elId: `fui_lazy_${Math.ceil(Math.random() * 10e5).toString(36)}`
			};
		},
		created() {
			this.visible = this.placeholder ? true : false;
			this.observer = null;
		},
		mounted() {
			this.$nextTick(() => {
				// #ifndef APP-NVUE
				this.isMounted = true
				setTimeout(() => {
					// #ifdef H5
					if (window.self === window.top) {
						this.startObserver()
					} else {
						//嵌套在iframe中
						this.handleFade()
					}
					// #endif

					// #ifndef H5
					this.startObserver()
					// #endif
				}, 50)
				// #endif

				// #ifdef APP-NVUE
				setTimeout(() => {
					!this.show && this.handleAppear()
				}, 2500)
				// #endif
			})
		},
		// #ifdef H5
		updated() {
			if (!this.isMounted) {
				this.handleFade()
			}
		},
		// #endif
		// #ifndef VUE3
		beforeDestroy() {
			this.endObserver()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.endObserver()
		},
		// #endif
		methods: {
			handleFade() {
				setTimeout(() => {
					this.show = true
				}, 200)
				this.visible = false;
				setTimeout(() => {
					this.visible = true;
				}, 500)
			},
			endObserver() {
				if (this.observer) {
					this.observer.disconnect()
					this.observer = null;
				}
			},
			startObserver() {
				if (this.observer || this.show) return;
				try {
					const observer = uni.createIntersectionObserver(this)
					observer.relativeToViewport({
						bottom: 50
					}).observe(`#${this.elId}`, (res) => {
						if (res.intersectionRatio > 0 && !this.show) {
							this.handleFade()
							this.endObserver()
						}
					})
					this.observer = observer
				} catch (e) {
					this.handleFade()
					this.endObserver()
				}
			},
			handleAppear(e) {
				if (this.observer || this.show) return;
				this.handleFade()
			},
			handleError(e) {
				if (!this.show) return;
				this.$emit('error', {
					detail: e.detail,
					param: this.param
				})
			},
			handleLoad(e) {
				if (!this.show) return;
				this.$emit('load', {
					detail: e.detail,
					param: this.param
				})
			},
			handleTap() {
				this.$emit('click', {
					param: this.param
				})
			}
		}
	}
</script>

<style scoped>
	.fui-lazyload__wrap {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		flex-shrink: 0;
		/* #endif */
		position: relative;
	}

	.fui-lazyload__img {
		/* #ifndef APP-NVUE */
		display: block;
		flex-shrink: 0;
		/* #endif */
		transition-duration: .35s;
		transition-property: opacity;
		transition-timing-function: linear;
	}

	.fui-lazyload__visible {
		/* #ifndef APP-NVUE */
		visibility: visible;
		/* #endif */
		opacity: 1;
	}

	.fui-lazyload__hidden {
		/* #ifndef APP-NVUE */
		visibility: hidden;
		/* #endif */
		opacity: 0;
	}
</style>