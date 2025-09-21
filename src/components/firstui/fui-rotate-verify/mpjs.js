// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号： 914 40 605   M A5   5 6  H 1 KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			angle: 0,
			transform: '',
			startX: 0,
			lastLeft: 0,
			resetAni: false
		}
	},
	watch: {
		resetNum(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(0, 0)
		}
	},
	methods: {
		styleChange(left, deg) {
			if (left == 0 && deg == 0) {
				this.resetAni = true
			} else {
				this.resetAni = false
			}
			this.transform = 'translate3d(' + left + 'px,0,0)'
			this.angle = deg
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX
		},
		touchmove(e) {
			if (this.isPass || this.disabled || !this.isShow) return;
			let touch = e.touches[0] || e.changedTouches[0]
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.sliderWidth - this.sliderHeight;
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			let deg = 360 / width * left
			this.styleChange(left, deg)
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

// #ifdef APP-PLUS|| MP-WEIXIN || H5
export default {}
// #endif