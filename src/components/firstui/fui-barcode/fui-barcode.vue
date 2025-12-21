<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11  2 7，营业执照号： 9    1440  605MA 5 5 6H    1  K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<!-- #ifdef APP-NVUE -->
	<gcanvas @longpress="longtap" @touchstart="touchstart" @touchend="touchend" :ref="canvasId"
		:style="{ width: w + 'px', height:h + 'px'  }">
	</gcanvas>
	<!-- #endif -->

	<!-- #ifdef MP-QQ -->
	<canvas canvas-id="canvas_barcode" :style="{width:w+'px',height:h+'px'}" @longtap="longtap" @touchstart="touchstart"
		@touchend="touchend"></canvas>
	<!-- #endif -->

	<!-- #ifdef MP-WEIXIN -->
	<canvas type="2d" :canvas-id="canvasId" :id="canvasId" :style="{width:w+'px',height:h+'px'}" @longtap="longtap"
		@touchstart="touchstart" @touchend="touchend" v-if="canvasId"></canvas>
	<!-- #endif -->

	<!-- #ifndef APP-NVUE || MP-QQ || MP-WEIXIN -->
	<canvas :canvas-id="canvasId" :id="canvasId" :style="{width:w+'px',height:h+'px'}" @longtap="longtap"
		@touchstart="touchstart" @touchend="touchend" v-if="canvasId"></canvas>
	<!-- #endif -->


</template>

<script>
	import barcode from './barcode.js'
	import {
		code128
	} from './barcode-code128.js';


	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge
	} from './gcanvas/index.js';
	// #endif
	const defalutOptions = {
		number: true,
		prefix: true,
		color: '#181818',
		debug: false,
		onValid() {},
		onInvalid() {},
		onSuccess() {},
		onError() {}
	}
	// #ifdef MP-WEIXIN
	const canvasId = `fui_bc_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif

	// #ifdef MP-QQ
	const canvasId = 'canvas_barcode'
	// #endif
	export default {
		name: "fui-barcode",
		emits: ['ready', 'longclick', 'touchStart', 'touchEnd'],
		props: {
			width: {
				type: [Number, String],
				default: 480
			},
			height: {
				type: [Number, String],
				default: 200
			},
			value: {
				type: [Number, String],
				default: ''
			},
			//条形码类型:1-EAN-13 2-Code 128
			type: {
				type: [Number, String],
				default: 1
			}
		},
		data() {
			// #ifndef MP-WEIXIN || MP-QQ
			const canvasId = `fui_bc_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			return {
				canvasId,
				defalutOptions,
				w: 240,
				h: 100
			};
		},
		watch: {
			width(val) {
				this.w = uni.upx2px(val || 480)
			},
			height(val) {
				this.h = uni.upx2px(val || 200)
			}
		},
		created() {
			this.w = Math.round(uni.upx2px(this.width || 480))
			this.h = Math.round(uni.upx2px(this.height || 200))
			this.ctx = null;
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.$emit('ready', {
						canvasId: this.canvasId
					})
				}, 50)
			});
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.ctx = null;
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.ctx = null;
		},
		// #endif
		methods: {
			// #ifdef MP-WEIXIN
			getContext(callback) {
				const query = uni.createSelectorQuery().in(this)
				query.select(`#${this.canvasId}`)
					.fields({
						node: true,
						size: true
					})
					.exec((res) => {
						const canvas = res[0].node
						const ctx = canvas.getContext('2d')
						const dpr = wx.getSystemInfoSync().pixelRatio
						canvas.width = res[0].width * dpr
						canvas.height = res[0].height * dpr
						ctx.scale(dpr, dpr)
						this.ctx = ctx;
						callback && callback()
					})
			},
			// #endif
			drawBarcode(options) {
				// #ifdef MP-WEIXIN
				this.ctx.clearRect(0, 0, this.w, this.h);
				// #endif

				if (!this.ctx) {
					// #ifdef APP-NVUE
					let ganvas = this.$refs[this.canvasId];
					/*通过元素引用获取canvas对象*/
					let canvasObj = enable(ganvas, {
						bridge: WeexBridge
					});
					/*获取绘图所需的上下文，暂不支持3d*/
					this.ctx = canvasObj.getContext('2d');
					// #endif

					// #ifndef APP-NVUE || MP-WEIXIN
					this.ctx = uni.createCanvasContext(this.canvasId, this)
					// #endif
				}

				if (this.type == 1) {
					const opts = Object.assign({}, this.defalutOptions, options)
					new barcode(String(this.value), Object.assign({
						width: this.w,
						height: this.h
					}, opts), this.ctx)
				} else {
					code128(this.ctx, String(this.value), this.w, this.h)
				}
			},
			draw(options = {}) {
				// #ifdef MP-WEIXIN
				if (!this.ctx) {
					this.getContext(() => {
						this.drawBarcode(options)
					})
				} else {
					this.drawBarcode(options)
				}
				// #endif

				// #ifndef MP-WEIXIN
				this.drawBarcode(options)
				// #endif
			},
			longtap() {
				this.$emit('longclick', {})
			},
			touchstart() {
				this.$emit('touchStart', {})
			},
			touchend() {
				this.$emit('touchEnd', {})
			}
		}
	}
</script>

<style scoped></style>