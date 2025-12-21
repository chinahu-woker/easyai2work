// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 1 27，营业执照号：   9 1440605   MA  5  56     H1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
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
			if (!this.$refs['fui_sc_ani']) return;
			animation.transition(
				this.$refs['fui_sc_ani'].ref, {
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
		getSlipDistance(left) {
			let width = this.w - this.x - 44
			let distance = left / (this.w - (this.sliderH * 2)) * width
			return distance > width ? width : distance
		},
		_animation(left) {
			let slotLeft = this.getSlipDistance(left).toFixed(2)
			left = left.toFixed(2)
			if (!this.imgRef || !this.sliderRef) return;
			animation.transition(this.imgRef, {
				styles: {
					transform: 'translate(' + slotLeft + 'px,0)'
				},
				duration: left == 0 ? 200 : 0,
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
			if (this.isPass || this.disabled || !this.slotSrc || !this.isShow) return;
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.screenX
		},
		touchmove(e) {
			if (this.isPass || this.disabled || !this.slotSrc || !this.isShow) return;
			let touch = e.changedTouches[0];
			let pageX = touch.screenX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.w - (this.sliderH * 2);
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			this._animation(left)
		},
		touchend(e) {
			if (this.isPass || this.disabled || !this.slotSrc || !this.isShow) return;
			let slotLeft = this.getSlipDistance(this.lastLeft)
			if (this.type == 1) {
				let width = this.x1 - this.x
				if (Math.abs(slotLeft - width) <= this.range) {
					this.disabled = true
					this.success()
				} else {
					setTimeout(() => {
						this.startX = 0;
						this.lastLeft = 0;
						this.disabled = false;
						this._animation(0)
						this.fail()
					}, 20)
				}
			} else {
				//后端验证
				this.verify({
					slip: slotLeft
				})
			}
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif