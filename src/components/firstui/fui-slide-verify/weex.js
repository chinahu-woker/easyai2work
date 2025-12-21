// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  112 7，营业执照号：914 4          0  605MA556H1K X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	data() {
		return {
			passWidth: 0
		};
	},
	watch: {
		resetNum(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this._animation(0)
		}
	},
	created() {
		this.startX = 0
		this.lastLeft = 0
	},
	mounted() {
		this.foreground = this.getEl(this.$refs['foreground'])
		this.slider = this.getEl(this.$refs['slider']);
	},
	methods: {
		getEl(el) {
			return el.ref;
		},
		_animation(left) {
			if (!this.foreground || !this.slider) return;
			animation.transition(this.foreground, {
				styles: {
					width: left + 'px'
				},
				duration: left == 0 ? 200 : 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
			animation.transition(this.slider, {
				styles: {
					transform: 'translate(' + left + 'px,0)'
				},
				duration: left == 0 ? 200 : 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
		},
		touchstart(e) {
			if (this.isPass) return;
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.screenX
		},
		touchmove(e) {
			if (this.isPass) return;
			let touch = e.changedTouches[0];
			let pageX = touch.screenX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.totalWidth - this.sliderW;
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			this._animation(left)
		},
		touchend(e) {
			if (this.isPass) return;
			let left = this.targetWidth - this.sliderW
			if (Math.abs(left - this.lastLeft) <= Number(this.range)) {
				this.passWidth = this.lastLeft;
				this.success()
			} else {
				setTimeout(() => {
					this.startX = 0;
					this.lastLeft = 0;
					this._animation(0)
					this.fail()
				}, 20)
			}
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif