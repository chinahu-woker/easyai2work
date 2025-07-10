<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 12  7，营业执照号： 9 1 44 0605   MA 55   6 H1  K  X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-circle__wrap" :style="{width: w+'px',height:w+'px'}">
		<!-- #ifdef APP-NVUE -->
		<gcanvas :ref="circleId" :style="{ width: w + 'px', height: w + 'px' }"></gcanvas>
		<!-- #endif -->
		<!-- #ifdef APP-VUE || H5 -->
		<canvas :start="percentage" :change:start="parse.init" :width="w" :change:width="parse.widthChange"
			:sw="strokeWidth" :change:sw="parse.widthChange" :data-width="w" :data-sw="strokeWidth" :data-lc="lineCap"
			:data-size="size" :data-percent="percentage" :data-color="color || primaryColor" :data-show="show"
			:data-ds="defaultShow" :data-background="background" :data-foreground="foreground || primaryColor"
			:data-gradient="gradient" :data-sa="sAngle" :data-ccw="counterclockwise" :data-speed="speed"
			:data-am="activeMode" :data-cid="circleId" :canvas-id="circleId" :class="[circleId]"
			:style="{width: w + 'px',height: w + 'px'}"></canvas>
		<!-- #endif -->

		<!-- #ifdef MP -->
		<!-- #ifdef MP-ALIPAY -->
		<canvas class="fui-circle__canvas" :canvas-id="circleId" :id="circleId"
			:style="{width: w*4 +'px',height:w*4 +'px'}"></canvas>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<canvas type="2d" class="fui-circle__canvas" :canvas-id="circleId" :id="circleId"
			:style="{width: w +'px',height:w +'px'}" v-if="circleId"></canvas>
		<!-- #endif -->
		<!-- #ifndef MP-ALIPAY || MP-WEIXIN-->
		<!-- 此处加v-if是因为vue3下编译到头条/抖音等小程序动态id失效，需等uni-app官方调整 -->
		<canvas class="fui-circle__canvas" :canvas-id="circleId" :id="circleId" :style="{width: w +'px',height:w +'px'}"
			v-if="circleId"></canvas>
		<!-- #endif -->
		<!-- #endif -->
		<view class="fui-circle__inner">
			<slot></slot>
		</view>
	</view>
</template>
<!-- #ifdef APP-VUE || H5 -->
<script module="parse" lang="renderjs">
	export default {
		methods: {
			widthChange(w, oldW, owner, ins) {
				let res = ins.getDataset();
				let percent = Number(res.percent);
				this.init(percent, percent, owner, ins)
			},
			init(percent, oldPercent, owner, ins) {
				let state = ins.getState();
				let res = ins.getDataset();
				const am = this.format(res.am);
				let start = am === 'backwards' ? 0 : (state.start || 0);
				start = start > percent ? 0 : start;
				if (!state.context || !state.canvas) {
					const width = res.width;
					let ele = `.${res.cid}>canvas`
					const canvas = document.querySelectorAll(this.format(ele))[0];
					if (!canvas) return;
					const ctx = canvas.getContext('2d');
					state.context = ctx;
					state.canvas = canvas;
					this.drawCircle(start, ctx, canvas, percent, res, state, owner);
				} else {
					this.drawCircle(start, state.context, state.canvas, percent, res, state, owner);
				}
			},
			drawDefaultCircle(ctx, canvas, res) {
				let sa = Number(res.sa) * Math.PI
				let eAngle = Math.PI * 2 + sa;
				this.drawArc(ctx, eAngle, this.format(res.background), res);
			},
			drawPercent(ctx, percent, res) {
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = this.format(res.color);
				ctx.font = res.size + "px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				let radius = res.width / 2;
				percent = this.bool(res.ccw) ? 100 - percent : percent;
				ctx.fillText(percent + '%', radius, radius);
				ctx.stroke();
				ctx.restore();
			},
			drawCircle(start, ctx, canvas, percent, res, state, owner) {
				if (!ctx || !canvas) return;
				let _this = this
				let gradient = res.foreground;
				if (this.format(res.gradient)) {
					gradient = ctx.createLinearGradient(0, 0, Number(res.width), 0);
					gradient.addColorStop(0, this.format(res.gradient));
					gradient.addColorStop(1, this.format(res.foreground));
				}
				let requestId = null
				let renderLoop = () => {
					drawFrame((res) => {
						if (res) {
							requestId = requestAnimationFrame(renderLoop)
						} else {
							setTimeout(() => {
								cancelAnimationFrame(requestId)
								requestId = null;
								renderLoop = null;
							}, 20)
						}
					})
				}
				renderLoop()

				function drawFrame(callback) {
					ctx.clearRect(0, 0, canvas.width, canvas.width);
					if (_this.bool(res.ds)) {
						_this.drawDefaultCircle(ctx, canvas, res)
					}
					if (_this.bool(res.show)) {
						_this.drawPercent(ctx, start, res);
					}
					let isEnd = percent === 0 || (_this.bool(res.ccw) && start === 100);
					if (!isEnd) {
						let sa = Number(res.sa) * Math.PI
						let eAngle = ((2 * Math.PI) / 100) * start + sa;
						_this.drawArc(ctx, eAngle, gradient, res);
					}
					owner.callMethod('change', {
						percent: start
					})
					if (start >= percent) {
						state.start = start;
						owner.callMethod('end', {
							canvasId: _this.format(res.cid)
						})
						callback && callback(false)
					} else {
						let num = start + Number(res.speed)
						start = num > percent ? percent : num;
						callback && callback(true)
					}
				}
			},
			//创建弧线
			drawArc(ctx, eAngle, strokeStyle, res) {
				ctx.save();
				ctx.beginPath();
				ctx.lineCap = this.format(res.lc);
				ctx.lineWidth = Number(res.sw);
				ctx.strokeStyle = strokeStyle;
				let radius = res.width / 2;
				let sa = Number(res.sa) * Math.PI
				ctx.arc(radius, radius, radius - Number(res.sw), sa, eAngle, this.bool(res.ccw));
				ctx.stroke();
				ctx.closePath();
				ctx.restore();
			},
			format(str) {
				if (!str) return str;
				return str.replace(/\"/g, "");
			},
			bool(str) {
				return str === 'true' || str == true ? true : false
			}
		}
	}
</script>
<!-- #endif -->
<script>
	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge
	} from './gcanvas/index.js';
	// #endif
	//注意：app-nvue端canvas性能不如app-vue
	import mpjs from './mpjs.js'
	import mpwx from './mpwx.js'
	import render from './render.js'
	import nvue from './nvue.js'
	// #ifdef MP-WEIXIN
	const circleId = `fui_cc_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif
	export default {
		name: "fui-circle",
		mixins: [mpjs, mpwx, render, nvue],
		emits: ['change', 'end'],
		props: {
			//进度百分比 0~100
			percent: {
				type: [Number, String],
				default: 0
			},
			width: {
				type: [Number, String],
				default: 120
			},
			//背景填充颜色，仅nvue ios有效
			fillStyle: {
				type: String,
				default: '#FFFFFF'
			},
			//进度环的宽度，单位 px
			strokeWidth: {
				type: [Number, String],
				default: 4
			},
			//进度环的线头样式，可选值为 square、round、butt
			lineCap: {
				type: String,
				default: 'round'
			},
			//圆环进度字体大小,px
			size: {
				type: [Number, String],
				default: 12
			},
			//圆环进度字体颜色
			color: {
				type: String,
				default: ''
			},
			//是否显示进度文字
			show: {
				type: Boolean,
				default: true
			},
			//默认背景颜色
			background: {
				type: String,
				default: '#CCCCCC'
			},
			//是否显示默认背景色
			defaultShow: {
				type: Boolean,
				default: true
			},
			//默认前景颜色
			foreground: {
				type: String,
				default: ''
			},
			//进度条渐变颜色，结合foreground使用
			gradient: {
				type: String,
				default: ''
			},
			//起始弧度，单位弧度 实际  Math.PI * sAngle
			sAngle: {
				type: Number,
				default: 0
			},
			//指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针
			counterclockwise: {
				type: Boolean,
				default: false
			},
			//动画执行速度，值越大动画越快（1~100）
			speed: {
				type: [Number, String],
				default: 1
			},
			//backwards: 动画从头播；forwards：动画从上次结束点接着播
			activeMode: {
				type: String,
				default: 'forwards'
			}
		},
		watch: {
			width(val) {
				this.initWidth(val)
			}
		},
		computed: {
			primaryColor() {
				const app = uni && uni.$fui && uni.$fui.color;
				return (app && app.primary) || '#465CFF';
			}
		},
		data() {
			// #ifndef MP-WEIXIN
			const circleId = `fui_cc_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			return {
				circleId: circleId,
				w: 60
			};
		},
		created() {
			// #ifdef APP-NVUE
			this.context = null
			// #endif
			this.initWidth(this.width)
		},
		// #ifdef APP-NVUE
		mounted() {
			//以下代码写在nvue.js中 android端可能会出现canvas大小不受控制
			setTimeout(() => {
				let ganvas = this.$refs[this.circleId];
				let canvas = enable(ganvas, {
					bridge: WeexBridge
				});
				this.context = canvas.getContext('2d');
			}, 50);
		},
		// #endif
		methods: {
			initWidth(val) {
				val = uni.upx2px(Number(val) || 120)
				this.w = val % 2 === 0 ? val : val + 1
			}
		}
	}
</script>

<style scoped>
	.fui-circle__wrap {
		position: relative
	}

	.fui-circle__inner {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		z-index: 10;
		/* #endif */
		text-align: center;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	/* #ifdef MP */
	.fui-circle__canvas {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 5;
		/* #ifdef MP-ALIPAY */
		zoom: 0.25;
		/* #endif */
	}

	/* #endif */
</style>