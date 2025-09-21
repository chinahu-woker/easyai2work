<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号： 91   4406 0 5 M A 55  6H1 K  X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-autograph__wrap" :style="{ width: w + 'px', height:h + 'px',background:background  }"
		ref="fui_gcanvas_ag">
		<!-- #ifdef APP-NVUE -->
		<gcanvas @touchstart="onTouchstart" @touchmove="onTouchmove" @touchend="onTouchend" @touchcancel="onTouchCancel"
			:ref="canvasId" :style="{ width: w + 'px', height:h + 'px'  }">
		</gcanvas>
		<!-- #endif -->

		<!-- #ifndef APP-NVUE || MP-TOUTIAO || MP-QQ-->
		<canvas :disable-scroll="!completed" :canvas-id="canvasId" :id="canvasId" @touchstart="onTouchstart"
			@touchmove="onTouchmove" @touchend="onTouchend" @touchcancel="onTouchCancel"
			:style="{width:w+'px',height:h+'px'}" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup"
			@mouseleave="mouseleave"></canvas>
		<!-- #endif -->

		<!-- #ifdef MP-QQ -->
		<canvas :disable-scroll="!completed" canvas-id="canvas_autograph" @touchstart="onTouchstart"
			@touchmove="onTouchmove" @touchend="onTouchend" @touchcancel="onTouchCancel"
			:style="{width:w+'px',height:h+'px'}"></canvas>
		<!-- #endif -->

		<!-- #ifdef MP-TOUTIAO -->
		<canvas :disable-scroll="!completed" :canvas-id="canvasId" :id="canvasId" @touchstart="onTouchstart"
			@touchmove.stop.prevent="onTouchmove" @touchend="onTouchend" @touchcancel="onTouchCancel"
			:style="{width:w+'px',height:h+'px'}" v-if="canvasId"></canvas>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge
	} from './gcanvas/index.js';
	const dom = weex.requireModule('dom')
	// #endif
	// #ifdef MP-WEIXIN
	const canvasId = `fui_ag_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif
	export default {
		name: "fui-autograph",
		emits: ['ready'],
		props: {
			width: {
				type: [Number, String],
				default: 0
			},
			height: {
				type: [Number, String],
				default: 400
			},
			background: {
				type: String,
				default: '#ffffff'
			},
			//px
			lineWidth: {
				type: [Number, String],
				default: 5
			},
			color: {
				type: String,
				default: '#181818'
			},
			tips: {
				type: String,
				default: '请签名！'
			}
		},
		watch: {
			width(val) {
				if (val) {
					this.w = uni.upx2px(Number(val))
				}
			},
			height(val) {
				if (val) {
					this.h = uni.upx2px(Number(val))
				}
			}
		},
		data() {
			// #ifndef MP-WEIXIN || MP-QQ
			const canvasId = `fui_ag_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			// #ifdef MP-QQ
			const canvasId = 'canvas_autograph'
			// #endif
			return {
				// #ifdef APP-NVUE
				isAndroid: true,
				nTop: 0,
				nLeft: 0,
				// #endif
				canvasId: canvasId,
				w: 300,
				h: 200,
				completed: false,
				autograph: false
			};
		},
		created() {
			let sys = uni.getSystemInfoSync()
			// #ifdef APP-NVUE
			this.isAndroid = sys.platform.toLocaleLowerCase() === "android";
			// #endif
			this.w = this.width == 0 ? sys.windowWidth : uni.upx2px(Number(this.width));
			this.h = uni.upx2px(Number(this.height) || 400)
			this.ctx = null;
			this.touchs = null;
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					// #ifdef APP-NVUE
					let ganvas = this.$refs[this.canvasId];
					/*通过元素引用获取canvas对象*/
					let canvasObj = enable(ganvas, {
						bridge: WeexBridge
					});
					/*获取绘图所需的上下文，暂不支持3d*/
					this.ctx = canvasObj.getContext('2d');
					if (!this.isAndroid) {
						this.getDom()
					}
					// #endif

					// #ifndef APP-NVUE
					this.ctx = uni.createCanvasContext(this.canvasId, this)
					// #endif

					// #ifdef MP-BAIDU
					this.redraw()
					// #endif

					this.$emit('ready', {
						canvasId: this.canvasId
					})
				}, 50)
			})
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.ctx = null;
			this.touchs = null;
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.ctx = null;
			this.touchs = null;
		},
		// #endif
		methods: {
			// #ifdef APP-NVUE
			getDom() {
				dom.getComponentRect(this.$refs['fui_gcanvas_ag'], option => {
					if (option && option.result && option.size) {
						this.nTop = option.size.top
						this.nLeft = option.size.left
					}
				})
			},
			// #endif
			isPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
				var flag = true;
				for (let v = 0; v < Agents.length - 1; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			onTouchstart(e) {
				if (this.completed) return;
				let point = {};
				// #ifndef APP-NVUE
				point = {
					x: e.touches[0].x,
					y: e.touches[0].y
				};
				// #endif
				// #ifdef APP-NVUE
				point = {
					x: e.touches[0].pageX - this.nLeft,
					y: e.touches[0].pageY - this.nTop
				};
				// #endif
				this.ctx.setStrokeStyle(this.color);
				this.ctx.setLineWidth(this.lineWidth);
				this.ctx.setLineCap('round');
				this.touchs = [point];
			},
			mousedown(e) {
				// #ifdef H5
				if (!this.isPC() || this.completed) return;
				let point = {
					x: e.pageX - e.target.offsetLeft,
					y: e.pageY - e.target.offsetTop
				};
				this.ctx.setStrokeStyle(this.color);
				this.ctx.setLineWidth(this.lineWidth);
				this.ctx.setLineCap('round');
				this.touchs = [point];
				// #endif
			},
			onTouchmove(e) {
				if (this.completed) return;
				let point = null;
				// #ifndef APP-NVUE
				point = {
					x: e.touches[0].x,
					y: e.touches[0].y
				};
				// #endif
				// #ifdef APP-NVUE
				//changedTouches
				point = {
					x: e.touches[0].pageX - this.nLeft,
					y: e.touches[0].pageY - this.nTop
				};
				// #endif
				point && this.touchs.push(point)
				if (this.touchs.length >= 2) {
					this.startDraw();
				}
			},
			mousemove(e) {
				// #ifdef H5
				if (!this.isPC() || this.completed || !this.touchs) return;
				let point = {
					x: e.pageX - e.target.offsetLeft,
					y: e.pageY - e.target.offsetTop
				};
				this.touchs.push(point)
				if (this.touchs.length >= 2) {
					this.startDraw();
				}
				// #endif
			},
			onTouchend(e) {
				if (this.completed) return;
				this.touchs = null
			},
			mouseup(e) {
				// #ifdef H5
				if (!this.isPC() || this.completed) return;
				this.touchs = null
				// #endif
			},
			mouseleave(e) {
				// #ifdef H5
				if (!this.isPC() || this.completed) return;
				this.touchs = null
				// #endif
			},
			onTouchCancel(e) {
				if (this.completed) return;
				// console.log('touchCancel：', e)
			},
			startDraw() {
				this.autograph = true;
				const point1 = this.touchs[0];
				const point2 = this.touchs[1];
				this.touchs.shift();
				this.ctx.moveTo(point1.x, point1.y);
				this.ctx.lineTo(point2.x, point2.y);
				this.ctx.stroke();
				this.ctx.draw(true);
			},
			//重新绘制
			redraw() {
				this.completed = false;
				this.touchs = null;
				this.autograph = false;
				this.ctx.clearRect(0, 0, this.w, this.h);
				this.ctx.beginPath()
				this.ctx.draw();
			},
			drawComplete(callback) {
				if (!this.autograph && this.tips && this.tips !== true && this.tips !== 'true') {
					uni.showToast({
						title: this.tips,
						icon: 'none'
					});
					return;
				}
				this.completed = true;
				const platform = uni.getSystemInfoSync().platform;
				let time = 50;
				if (platform === 'android') {
					time = 200;
				}
				setTimeout(() => {
					// #ifdef MP-ALIPAY
					this.ctx.toTempFilePath({
						success: res => {
							callback && callback(res.apFilePath)
						},
						fail: err => {
							callback && callback(false)
						}
					});
					// #endif
					// #ifndef MP-ALIPAY || APP-NVUE
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						canvasId: this.canvasId,
						fileType: 'png',
						quality: 1,
						success: function(res) {
							callback && callback(res.tempFilePath)
						},
						fail() {
							callback && callback(false)
						}
					}, this)
					// #endif

					// #ifdef APP-NVUE
					this.ctx.toTempFilePath(
						0,
						0,
						this.w * 2,
						this.h * 2,
						this.w * 2,
						this.h * 2,
						"png",
						1,
						function(res) {
							callback && callback(res.tempFilePath)
						},
						function() {
							callback && callback(false)
						}
					)
					// #endif
				}, time)
			}
		}
	}
</script>

<style scoped></style>