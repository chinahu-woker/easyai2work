// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号：    9   144 0605MA 55 6  H   1  KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	data() {
		return {
			startX: 0,
			startY: 0,
			lastLeft: 0,
			lastTop: 0,
			isMove: false
		}
	},
	created() {
		this.refFab = null;
		this.loop = null
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.refFab = this.getEl(this.$refs['fui_fab_move_ref'])
			}, 50)
		})
	},
	methods: {
		getEl(el) {
			return el.ref || el[0].ref;
		},
		_aniMove(x, y) {
			if (!this.refFab || !this.isDrag) return
			animation.transition(this.refFab, {
				styles: {
					transform: `translate(${x}px,${y}px)`
				},
				duration: 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			}, () => {
				if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
					this.isMove = true;
				}
			});
		},
		touchstart(e) {
			if (!this.isDrag) return;
			var touch = e.touches || e.changedTouches
			this.startX = touch[0].screenX
			this.startY = touch[0].screenY
		},
		touchmove(e) {
			if (!this.isDrag) return;
			var touch = e.touches || e.changedTouches
			let pageX = touch[0].screenX,
				pageY = touch[0].screenY;
			var left = pageX - this.startX + this.lastLeft;
			left = left < -this.eLeft ? -this.eLeft : left;
			left = left > this.maxWidth ? this.maxWidth : left;
			this.startX = pageX

			var top = pageY - this.startY + this.lastTop;
			top = top < -this.eTop ? -this.eTop : top;
			top = top > this.maxHeight ? this.maxHeight : top;
			this.startY = pageY

			this.lastLeft = left
			this.lastTop = top
			this._aniMove(left, top)
		},
		touchend(e) {
			clearTimeout(this.loop)
			this.loop = setTimeout(() => {
				this.isMove = false
			}, 50)
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif