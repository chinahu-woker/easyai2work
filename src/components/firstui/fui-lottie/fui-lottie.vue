<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  1 127，营业执照号： 9 1 4  4   0605M  A5  5 6H1   K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-lottie__wrap">
		<!-- #ifdef APP-VUE || H5 -->
		<view ref="lottieRef" id="lottieRef" :prop="options" :change:prop="handler.changeProp" :action="actionVal"
			:change:action="handler.changeAction" :style="{width:width+'rpx',height:height+'rpx'}"></view>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<canvas :style="{width:lottieW+'px',height:lottieH+'px'}" :class="canvasId" type="2d"></canvas>
		<!-- #endif -->
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="handler" lang="renderjs">
	import lottie from './fui-lottie-app.js'

	export default {
		data() {
			return {
				ani: null,
				prevAction: '',
				isInit: false
			}
		},
		methods: {
			changeProp(vals, old) {
				let appVue3 = false
				// #ifdef APP-VUE
				// #ifdef VUE3
				appVue3 = true;
				// #endif
				// #endif
				if (!this.isInit && !appVue3) return;
				this.init(vals || old)
			},
			changeAction(newVal, oldVal) {
				const action = newVal || oldVal
				if (action === this.prevAction) return;
				this.prevAction = action;
				try {
					this.ani && this.ani[action]()
				} catch (e) {
					//TODO handle the exception
				}
			},
			init(vals) {
				if (!vals || (!vals.path && !vals.animationData)) return;
				this.ani && this.ani.destroy();
				this.$nextTick(() => {
					this.ani = lottie.loadAnimation({
						// #ifndef H5
						container: document.getElementById('lottieRef'),
						// #endif
						// #ifdef H5
						container: this.$refs.lottieRef.$el,
						// #endif
						renderer: 'svg',
						loop: vals.loop === undefined ? true : vals.loop,
						autoplay: vals.autoplay === undefined ? true : vals.autoplay,
						path: vals.path,
						// 只能加载本地json，优先级高于path
						animationData: vals.animationData
					});
				})
			}
		},
		mounted() {
			setTimeout(() => {
				this.init(this.options)
				this.isInit = true;
			}, 200)
		}
	}
</script>
<!-- #endif -->

<script>
	// #ifdef MP
	import lottieMp from './fui-lottie-mp.js'
	// #endif
	export default {
		name: "fui-lottie",
		props: {
			width: {
				type: [Number, String],
				default: 600
			},
			height: {
				type: [Number, String],
				default: 400
			},
			options: {
				type: Object,
				default () {
					return {
						path: '',
						animationData: '',
						autoplay: true,
						loop: true
					}
				}
			},
			//动画操作，可取值 play、pause、stop、destroy
			action: {
				type: String,
				default: 'play'
			}
		},
		watch: {
			// #ifdef MP
			actionVal() {
				this.changeMpAction()
			},
			options() {
				if (!this.mpInitFlag) return;
				this.initMp();
			},
			// #endif
			action(val) {
				this.actionVal = this.getAction(this.action)
			}
		},
		data() {
			const canvasId = `fui_lt_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				canvasId,
				// #ifdef MP
				lottieW: 300,
				lottieH: 200,
				// #endif
				//可取值 play、pause、stop、destroy
				actionVal: ''
			};
		},
		// #ifdef VUE2
		beforeDestroy() {
			this.actionVal = 'destroy'
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.actionVal = 'destroy'
		},
		// #endif
		// #ifdef MP
		created() {
			this.aniMp = null
			this.mpInitFlag = false
			this.lottieW = uni.upx2px(Number(this.width))
			this.lottieH = uni.upx2px(Number(this.height))
		},
		// #endif
		mounted() {
			this.actionVal = this.getAction(this.action)
			// #ifdef MP
			this.$nextTick(() => {
				setTimeout(() => {
					this.initMp()
				}, 50);
			})
			// #endif
		},
		methods: {
			// #ifdef MP
			changeMpAction() {
				try {
					this.aniMp && this.aniMp[this.actionVal]()
				} catch (e) {
					//TODO handle the exception
				}
			},
			initMp() {
				const options = {
					...this.options
				}
				if (!options.path && !options.animationData) return;
				this.aniMp && this.aniMp.destroy();
				this.$nextTick(() => {
					const query = uni.createSelectorQuery()
						// #ifndef MP-ALIPAY
						.in(this)
					// #endif
					// #ifndef MP-QQ
					query.selectAll(`.${this.canvasId}`).node(res => {
						const canvas = res[0].node;
						const context = canvas.getContext('2d');
						const dpr = uni.getSystemInfoSync().pixelRatio;
						canvas.width = this.lottieW * dpr;
						canvas.height = this.lottieH * dpr;
						context.scale(dpr, dpr);
						lottieMp.setup(canvas)

						this.aniMp = lottieMp.loadAnimation({
							loop: options.loop === undefined ? true : options.loop,
							autoplay: options.autoplay === undefined ? true : options.autoplay,
							//只支持网络地址
							path: options.path,
							animationData: options.animationData,
							rendererSettings: {
								context,
							},
						})
						this.mpInitFlag = true
					}).exec()
					// #endif
				});
			},
			// #endif
			getAction(action) {
				const actions = ['play', 'pause', 'stop', 'destroy']
				let val = 'play'
				if (~actions.indexOf(action)) {
					val = action
				}
				return val
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	.fui-lottie__wrap {
		display: inline-flex;
	}

	/* #endif */
</style>