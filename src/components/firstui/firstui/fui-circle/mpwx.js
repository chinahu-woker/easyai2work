// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：91 440  6 0   5 M A  5 56H 1K   X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef MP-WEIXIN
export default {
	data() {
		return {
			start: 0,
			isReady: false
		}
	},
	created() {
		this.context = null;
		this.canvas = null;
	},
	watch: {
		percent(val) {
			setTimeout(() => {
				this.isReady && this.initDraw()
			}, 20)
		},
		w(val) {
			setTimeout(() => {
				this.isReady && this.initDraw()
			}, 20)
		},
		strokeWidth(val) {
			setTimeout(() => {
				this.isReady && this.initDraw()
			}, 20)
		}
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.init();
			}, 50)
		})
	},
	methods: {
		//初始化绘制
		init() {
			uni.createSelectorQuery().in(this)
				.select(`#${this.circleId}`)
				.fields({
					node: true,
					size: true,
				})
				.exec(this.initDraw.bind(this))
		},
		initDraw(res) {
			this.isReady = true;
			let start = this.activeMode === 'backwards' ? 0 : this.start;
			start = start > this.percent ? 0 : start;
			if (res) {
				const width = res[0].width
				const height = res[0].height
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')
				const dpr = uni.getSystemInfoSync().pixelRatio
				canvas.width = width * dpr
				canvas.height = height * dpr
				ctx.scale(dpr, dpr)
				this.context = ctx;
				this.canvas = canvas
				this.drawCircle(start, ctx, canvas);
			} else {
				this.drawCircle(start, this.context, this.canvas);
			}
		},
		drawDefaultCircle(ctx, canvas) {
			//终止弧度
			let eAngle = Math.PI * 2 + Number(this.sAngle) * Math.PI;
			this.drawArc(ctx, eAngle, this.background);
		},
		drawpercent(ctx, percent) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.color || this.primaryColor;
			ctx.font = this.size + "px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			let radius = this.w / 2;
			percent = this.counterclockwise ? 100 - percent : percent;
			percent = percent.toFixed(0) + "%"
			ctx.fillText(percent, radius, radius);
			ctx.stroke();
			ctx.restore();
		},
		drawCircle(start, ctx, canvas) {
			if (!ctx || !canvas) return;
			let that = this
			let percent = that.percent;
			let requestId = null
			let renderLoop = () => {
				drawFrame((res) => {
					if (res) {
						requestId = canvas.requestAnimationFrame(renderLoop)
					} else {
						canvas.cancelAnimationFrame(requestId)
						requestId = null;
						renderLoop = null;
					}
				})
			}
			requestId = canvas.requestAnimationFrame(renderLoop)

			function drawFrame(callback) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				if (that.defaultShow) {
					that.drawDefaultCircle(ctx, canvas)
				}
				if (that.show) {
					that.drawpercent(ctx, start);
				}
				let isEnd = (percent == 0 || (that.counterclockwise && start == 100));
				if (!isEnd) {
					let eAngle = ((2 * Math.PI) / 100) * start + Number(that.sAngle) * Math.PI;
					let gradient = that.foreground || that.primaryColor;
					if (that.gradient) {
						gradient = ctx.createLinearGradient(0, 0, Number(that.w), 0);
						gradient.addColorStop(0, that.gradient);
						gradient.addColorStop(1, (that.foreground || that.primaryColor));
					}
					that.drawArc(ctx, eAngle, gradient);
				}
				that.$emit('change', {
					percent: start
				});
				if (start >= percent) {
					that.start = start
					that.$emit('end', {
						canvasId: that.circleId,
						percent: percent
					});
					canvas.cancelAnimationFrame(requestId)
					callback && callback(false)
					return;
				}
				let num = start + that.speed
				start = num > percent ? percent : num;
				callback && callback(true)
			}

		},
		drawArc(ctx, eAngle, strokeStyle) {
			ctx.save();
			ctx.beginPath();
			let sw = Number(this.strokeWidth);
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = sw;
			ctx.strokeStyle = strokeStyle;
			let radius = this.w / 2;
			ctx.arc(radius, radius, radius - sw, Number(this.sAngle) * Math.PI, eAngle, this
				.counterclockwise);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	}
}
// #endif


// #ifndef MP-WEIXIN
export default {}
// #endif