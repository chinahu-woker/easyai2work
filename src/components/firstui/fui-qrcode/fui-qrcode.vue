<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  12 7，营业执照号：  9 1   4406 05  MA55 6     H1 KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<!-- #ifdef APP-NVUE -->
	<gcanvas @longpress="longtap" @touchstart="touchstart" @touchend="touchend" :ref="canvasId"
		:style="{ width: w + 'px', height:h + 'px'  }">
	</gcanvas>
	<!-- #endif -->

	<!-- #ifdef MP-QQ -->
	<canvas canvas-id="canvas_qrcode" :style="{width:w+'px',height:h+'px'}" @longtap="longtap" @touchstart="touchstart"
		@touchend="touchend"></canvas>
	<!-- #endif -->

	<!-- #ifdef MP-WEIXIN -->
	<canvas type="2d" :canvas-id="canvasId" :id="canvasId" :style="{width:w+'px',height:h+'px'}" @longtap="longtap"
		@touchstart="touchstart" @touchend="touchend" v-if="canvasId"></canvas>
	<!-- #endif -->

	<!-- #ifndef APP-NVUE || MP-QQ || MP-WEIXIN-->
	<canvas :canvas-id="canvasId" :id="canvasId" :style="{width:w+'px',height:h+'px'}" @longtap="longtap"
		@touchstart="touchstart" @touchend="touchend" v-if="canvasId"></canvas>
	<!-- #endif -->

</template>

<script>
	import fuiQr from './fui-qr/index.js'

	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge
	} from './gcanvas/index.js';
	// #endif

	const utf16to8 = (str) => {
		const len = str.length
		let out = ''

		for (let i = 0; i < len; i++) {
			const c = str.charCodeAt(i)

			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i)
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
			}
		}

		return out
	}
	// #ifdef MP-WEIXIN
	const canvasId = `fui_qr_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif

	// #ifdef MP-QQ
	const canvasId = 'canvas_qrcode'
	// #endif
	export default {
		name: "fui-qrcode",
		emits: ['ready', 'longclick', 'touchStart', 'touchEnd'],
		props: {
			width: {
				type: [Number, String],
				default: 400
			},
			height: {
				type: [Number, String],
				default: 400
			},
			value: {
				type: String,
				default: ''
			},
			foreground: {
				type: String,
				default: '#181818'
			},
			background: {
				type: String,
				default: '#ffffff'
			}
		},
		data() {
			// #ifndef MP-WEIXIN || MP-QQ
			const canvasId = `fui_qr_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			return {
				canvasId,
				//误差校正等级
				errorCorrectLevel: 2,
				//类型
				typeNumber: -1,
				w: 200,
				h: 200
			};
		},
		computed: {
			initDraw() {
				return `${this.width}_${this.height}_${this.foreground}_${this.background}_${this.value}`
			}
		},
		watch: {
			initDraw(val) {
				this.w = uni.upx2px(this.width || 400)
				this.h = uni.upx2px(this.height || 400)
				this.$nextTick(() => {
					this.draw()
				})
			}
		},
		created() {

			this.ctx = null;
		},
		mounted() {
			this.w = uni.upx2px(this.width || 400)
			this.h = uni.upx2px(this.height || 400)
			this.$nextTick(() => {
				setTimeout(() => {
					this.draw()
					this.$emit('ready', {
						canvasId: this.canvasId
					})
				}, 50)
			})
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
						const dpr = uni.getSystemInfoSync().pixelRatio
						canvas.width = this.w * dpr
						canvas.height = this.h * dpr
						ctx.scale(dpr, dpr)
						this.ctx = ctx;
						callback && callback()
					})
			},
			// #endif
			drawQrcode() {
				// #ifdef MP-WEIXIN
				this.ctx.clearRect(0, 0, this.w, this.h);
				// #endif
				const qrcode = fuiQr(utf16to8(this.value), {
					typeNumber: this.typeNumber,
					errorCorrectLevel: this.errorCorrectLevel,
				})
				const cells = qrcode.modules
				const tileW = this.w / cells.length
				const tileH = this.h / cells.length

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
				// #ifndef MP-WEIXIN
				this.ctx.scale(1, 1)
				// #endif
				cells.forEach((row, rdx) => {
					row.forEach((cell, cdx) => {
						// #ifdef MP-WEIXIN
						this.ctx.fillStyle = cell ? this.foreground : this.background
						// #endif
						// #ifndef MP-WEIXIN
						this.ctx.setFillStyle(cell ? this.foreground : this.background)
						// #endif
						const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
						const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
						this.ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
					})
				})

				// #ifndef MP-WEIXIN
				this.ctx.draw()
				// #endif
			},
			draw() {
				// #ifdef MP-WEIXIN
				if (!this.ctx) {
					this.getContext(() => {
						this.drawQrcode()
					})
				} else {
					this.drawQrcode()
				}
				// #endif

				// #ifndef MP-WEIXIN
				this.drawQrcode()
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