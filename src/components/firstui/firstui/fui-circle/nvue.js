// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  1 27，营业执照号：9   1 44 06 05M A5 5    6H1 K  X  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
import {
	enable,
	WeexBridge
} from './gcanvas/index.js';
export default {
	data() {
		return {
			start: 0
		}
	},
	watch: {
		percent(val) {
			setTimeout(() => {
				this.init();
			}, 50)
		},
		w(val) {
			setTimeout(() => {
				this.init();
			}, 50)
		},
		strokeWidth(val) {
			setTimeout(() => {
				this.init();
			}, 50)
		}
	},
	created() {
		let sys = uni.getSystemInfoSync()
		this.isAndroid = sys.platform.toLocaleLowerCase() == "android"
		this.fontSize = this.isAndroid ? Number(this.size) : Number(this.size) * sys.pixelRatio
	},
	mounted() {
		setTimeout(() => {
			this.init(true);
		}, 50);
	},
	// #ifndef VUE3
	beforeDestroy() {
		this.context = null;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.context = null;
	},
	// #endif
	methods: {
		//初始化绘制
		init(init) {
			let start = this.activeMode === 'backwards' ? 0 : this.start;
			this.drawCircle(start);
		},
		//默认背景
		drawDefaultCircle(ctx) {
			ctx.setLineWidth(Number(this.strokeWidth));
			ctx.setStrokeStyle(this.background);
			let eAngle = Math.PI * 2 + Number(this.sAngle) * Math.PI;
			this.drawArc(ctx, eAngle, true);
		},
		//进度圆环
		drawCircle(start) {
			let ctx = this.context;
			if (!ctx) {
				let ganvas = this.$refs[this.circleId];
				let canvas = enable(ganvas, {
					bridge: WeexBridge
				});
				ctx = canvas.getContext('2d');
				//android赋值后，canvas大小可能不受控制
				this.context = ctx;
			}
			//绘制默认背景
			if (!this.isAndroid) {
				ctx.setFillStyle(this.fillStyle)
				ctx.fillRect(0, 0, this.w, this.w)
			}
			// ctx.clearRect(0, 0, this.w, this.w)
			this.defaultShow && this.drawDefaultCircle(ctx)
			ctx.setLineWidth(Number(this.strokeWidth));
			ctx.beginPath()
			let gradient = this.foreground || this.primaryColor;
			// if (this.gradient) {
			// 	gradient = ctx.createLinearGradient(0, 0, this.w, 0);
			// 	gradient.addColorStop(0, this.gradient);
			// 	gradient.addColorStop(1, this.foreground);
			// }
			ctx.setStrokeStyle(gradient);
			let percentage = Number(this.percent)
			if (percentage > 0) {
				start += Number(this.speed);
				start = start > percentage ? percentage : start;
			}
			if (this.show) {
				ctx.setFontSize(this.fontSize);
				ctx.setFillStyle(this.color || this.primaryColor);
				ctx.setTextAlign('center');
				ctx.setTextBaseline('middle');
				let percent = `${this.counterclockwise ? 100 - start : start}%`;
				let radius = this.w / 2;
				ctx.fillText(percent, radius, radius);
			}
			if (percentage == 0 || (this.counterclockwise && start == 100)) {
				ctx.draw();
			} else {
				let eAngle = ((2 * Math.PI) / 100) * start + Number(this.sAngle) * Math.PI;
				this.drawArc(ctx, eAngle);
			}
			setTimeout(() => {
				this.start = start;
				if (start == percentage) {
					this.$emit('end', {
						canvasId: this.circleId,
						percent: start
					});
				} else {
					this.drawCircle(start);
				}
				this.$emit('change', {
					percent: start
				});
			}, 1000 / 60);
		},
		drawArc(ctx, eAngle, def) {
			ctx.setLineCap(this.lineCap);
			ctx.beginPath();
			let radius = this.w / 2;
			ctx.arc(radius, radius, radius - Number(this.strokeWidth), Number(this.sAngle) * Math.PI, eAngle, this
				.counterclockwise);
			ctx.stroke();
			!def && ctx.draw();
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif