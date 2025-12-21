// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号：  9   1 44 0 605M  A   5 5 6H1  KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	watch: {
		resetNum(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this._animation(0, 0)
		}
	},
	created() {
		this.startX = 0
		this.lastLeft = 0
		this.imgRef = null
		this.sliderRef = null
	},
	methods: {
		openAni() {
			this.isShow = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.getEl()
					this._ani(true);
				}, 50);
			});
		},
		closeAni(type) {
			this._ani(false);
		},
		_ani(type) {
			let styles = {
				opacity: type ? 1 : 0
			};
			if (!this.$refs['fui_rv_ani']) return;
			animation.transition(
				this.$refs['fui_rv_ani'].ref, {
					styles,
					duration: 200, //ms
					timingFunction: 'ease-in',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isShow = false;
					}
				}
			);
		},
		getEl() {
			this.imgRef = this.$refs['imgRef'].ref
			this.sliderRef = this.$refs['sliderRef'].ref;
		},
		_animation(left, deg) {
			left = Number(left.toFixed(2))
			deg = Number(deg.toFixed(2))
			if (!this.imgRef || !this.sliderRef) return;
			animation.transition(this.imgRef, {
				styles: {
					transform: 'rotate(' + deg + 'deg)'
				},
				duration: deg == 0 ? 200 : 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
			animation.transition(this.sliderRef, {
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
			if (this.isPass || this.disabled || !this.isShow) return;
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.screenX
		},
		touchmove(e) {
			if (this.isPass || this.disabled || !this.isShow) return;
			let touch = e.changedTouches[0];
			let pageX = touch.screenX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.sliderWidth - this.sliderHeight;
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			let deg = 360 / width * left
			this._animation(left, deg)
		},
		touchend(e) {
			if (this.isPass || this.disabled || !this.isShow) return;
			let left = this.sliderWidth - this.sliderHeight;
			let deg = 360 / left * this.lastLeft
			this.verify({
				angle: deg
			})
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif