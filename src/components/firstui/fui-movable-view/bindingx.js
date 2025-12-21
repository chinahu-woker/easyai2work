// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 12 7，营业执照号：   91 4 40 6   05MA 5 56H1 KX     H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	data() {
		return {
			startX: 0,
			startY: 0,
			lastLeft: 0,
			lastTop: 0
		}
	},
	created() {
		this.refFab = null;
		this.loop = null
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.refFab = this.getEl(this.$refs['fui-movable__view'])
			}, 50)
		})
	},
	methods: {
		getEl(el) {
			return el.ref || el[0].ref;
		},
		_aniMove(x, y) {
			if (!this.refFab || this.direction === 'none') return
			animation.transition(this.refFab, {
				styles: {
					transform: `translate(${x}px,${y}px)`
				},
				duration: 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			}, () => {
				this.change({
					left: x,
					top: y
				})
			});
		},
		touchstart(e) {
			if (this.direction === 'none') return;
			var touch = e.touches || e.changedTouches
			if (this.direction === 'all') {
				this.startX = touch[0].screenX
				this.startY = touch[0].screenY
			} else if (this.direction === 'vertical') {
				this.startY = touch[0].screenY
			} else {
				this.startX = touch[0].screenX
			}
		},
		getLeft(pageX) {
			var left = pageX - this.startX + this.lastLeft;
			left = left < -this.eLeft ? -this.eLeft : left;
			left = left > this.maxWidth ? this.maxWidth : left;

			return left
		},
		getTop(pageY) {
			var top = pageY - this.startY + this.lastTop;
			top = top < -this.eTop ? -this.eTop : top;
			top = top > this.maxHeight ? this.maxHeight : top;

			return top
		},
		touchmove(e) {
			if (this.direction === 'none') return;
			var touch = e.touches || e.changedTouches
			let pageX = touch[0].screenX,
				pageY = touch[0].screenY;

			let left = 0,
				top = 0;
			if (this.direction === 'all') {
				left = this.getLeft(pageX)
				this.startX = pageX
				top = this.getTop(pageY)
				this.startY = pageY
			} else if (this.direction === 'vertical') {
				top = this.getTop(pageY)
				this.startY = pageY
			} else {
				left = this.getLeft(pageX)
				this.startX = pageX
			}

			this.lastLeft = left
			this.lastTop = top
			this._aniMove(left, top)
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif