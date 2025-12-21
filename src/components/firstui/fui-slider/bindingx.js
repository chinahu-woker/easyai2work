// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：  9 1 44 0   6  05M A 55 6  H 1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
//BindingX实现滑动比较流畅（已实现），缺点不好实时更新数据，暂时废弃
// const BindingX = uni.requireNativePlugin('bindingx');
const animation = uni.requireNativePlugin('animation');
export default {
	data() {
		return {
			isRight: false,
			isAndroid: false
		}
	},
	watch: {
		value(val) {
			this.initData(val)
		},
		endValue(val) {
			if (this.section) {
				this.initEndData(val)
			}
		},
		isRight(val) {
			if (!val) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.handleRight = this.getEl(this.$refs['handleRight'])
					}, 50)
				})
			}
		}
	},
	created() {
		const res = uni.getSystemInfoSync();
		this.isAndroid = res.platform.toLocaleLowerCase() == "android"
		this.startX = 0
		this.endX = 0
		this.lastLeft = 0
		this.onceLeft = 0
		this.lastRight = 0
		this.onceRight = 0
		this.tEnd = false
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.handleLeft = this.getEl(this.$refs['handleLeft'])
				this.poleLeft = this.getEl(this.$refs['poleLeft']);
				this.handleRight = null;
				this.poleRight = null;
				this.initData(this.value)
				if (this.section) {
					this.handleRight = this.getEl(this.$refs['handleRight'])
					this.poleRight = this.getEl(this.$refs['poleRight']);
					this.initEndData(this.endValue)
				}
			}, 50)
		})
	},
	methods: {
		getEl(el) {
			return el.ref;
		},
		initData(value) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(Number(value), true)
		},
		initEndData(value) {
			this.endX = 0;
			this.lastRight = 0;
			value = Number(this.max) - Number(value) + Number(this.min)
			this.styleSectionChange(value, true)
		},
		format(value) {
			value = Number(value)
			let step = Number(this.step)
			return Math.round(Math.max(Number(this.min), Math.min(value, Number(this.max))) / step) * step;
		},
		_animation(move, trans, isRight) {
			animation.transition(
				isRight ? this.handleRight : this.handleLeft, {
					styles: {
						transform: move
					},
					duration: 0,
					timingFunction: 'linear',
					needLayout: false,
					delay: 0
				}, () => {
					this.tEnd = false
				});
			animation.transition(
				isRight ? this.poleRight : this.poleLeft, {
					styles: {
						transform: trans
					},
					duration: 0,
					timingFunction: 'linear',
					needLayout: false,
					delay: 0
				}, () => {
					this.tEnd = false
				});
		},
		touchstart(e) {
			if (this.disabled) return;
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.screenX
		},
		endTouchstart(e) {
			if (this.disabled) return;
			let touch = e.touches[0] || e.changedTouches[0];
			this.endX = touch.screenX
		},
		changeValue(value, isStart, isEnd) {
			var params = {
				value: value,
				isStart: isStart
			}
			if (isEnd) {
				this.change(params)
			} else {
				this.changing(params)
			}
		},
		styleChange(value, isEnd) {
			value = this.format(value);
			const min = Number(this.min)
			const max = Number(this.max)
			if (this.section) {
				value = value > this.end ? this.end : value;
			}
			this.changeValue(value, true, isEnd)
			const dvalue = max - min;
			const maxWidth = Number(this.width) - Number(this.blockWidth);
			const width = (value - min) / dvalue * maxWidth;
			this.lastLeft = width
			if (isEnd) {
				this.onceLeft = width
			}
			this._animation(`translateX(${width}px)`, `translateX(-${Number(this.width)-width}px)`, false)
			this.isRight = value === max
		},
		styleSectionChange(value, isEnd) {
			value = this.format(value);
			const min = Number(this.min)
			const max = Number(this.max)
			var total = max + min;
			var val = total - value;
			val = val < this.start ? this.start : val;
			value = total - val;
			this.changeValue(val, false, isEnd)
			var dvalue = max - min;
			var maxWidth = Number(this.width) - Number(this.blockWidth);
			var width = (value - min) / dvalue * maxWidth;
			this.lastRight = width
			if (isEnd) {
				this.onceRight = width
			}
			this._animation(`translateX(-${width}px)`, `translateX(${Number(this.width)-width}px)`, true)
		},
		touchmove(e) {
			if (this.disabled || this.tEnd) return;
			let touch = e.changedTouches[0];
			let pageX = touch.screenX;
			this.drag = true
			let left = pageX - this.startX + (this.onceLeft || 0);
			left = left < 0 ? 0 : left;
			let maxWidth = Number(this.width) - Number(this.blockWidth);
			left = left >= maxWidth ? maxWidth : left;
			let dvalue = Number(this.max) - Number(this.min);
			let value = (left / maxWidth) * dvalue + Number(this.min);
			// this.startX = pageX
			this.lastLeft = left
			this.styleChange(value, false)
		},
		endTouchmove(e) {
			if (this.disabled || this.tEnd) return;
			let touch = e.changedTouches[0];
			let pageX = touch.screenX;
			this.drag = true
			let left = this.endX - pageX + (this.onceRight || 0);
			left = left < 0 ? 0 : left;
			let maxWidth = Number(this.width) - Number(this.blockWidth);
			left = left >= maxWidth ? maxWidth : left;
			let dvalue = Number(this.max) - Number(this.min);
			let value = (left / maxWidth) * dvalue + Number(this.min);
			// this.endX = pageX
			this.lastRight = left
			this.styleSectionChange(value, false)
		},
		touchend(e) {
			if (this.disabled) return;
			if (this.drag) {
				let maxWidth = Number(this.width) - Number(this.blockWidth);
				let dvalue = Number(this.max) - Number(this.min);
				let value = (this.lastLeft / maxWidth) * dvalue + Number(this.min);
				this.tEnd = true;
				this.styleChange(value, true)
			}
		},
		endTouchend(e) {
			if (this.disabled) return;
			if (this.drag) {
				let maxWidth = Number(this.width) - Number(this.blockWidth);
				let dvalue = Number(this.max) - Number(this.min);
				let value = (this.lastRight / maxWidth) * dvalue + Number(this.min);
				this.tEnd = true;
				this.styleSectionChange(value, true)
			}
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif