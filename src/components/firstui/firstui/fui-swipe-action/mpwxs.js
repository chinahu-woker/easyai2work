// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  112 7，营业执照号：91     440 605 M A 55 6H1K  X     H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-VUE|| MP-WEIXIN || H5
export default {
	data() {
		return {
			isShow: false,
			isDisabled: false,
			thresholdVal: 30
		}
	},
	watch: {
		show(newVal) {
			this.isShow = this.show ? 'right' : 'none'
		},
		disabled(val) {
			this.isDisabled = this.disabled
		},
		threshold(val) {
			this.thresholdVal = Number(this.threshold)
		}
	},
	created() {
		this.group = this.getParent()
		if (this.group.children !== undefined) {
			this.group.children.push(this)
		}
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.isShow = this.show ? 'right' : 'none'
				this.isDisabled = this.disabled
				this.thresholdVal = Number(this.threshold)
			}, 10)
		})
	},
	methods: {
		closeSwipe(e) {
			if (!this.autoClose) return
			this.group && this.group.closeAuto(this)
		},
		change(e) {
			const isOpen = e.open === 'right'
			this.$emit('change', {
				isOpen: isOpen,
				param: this.param
			})
			if (this.isShow !== e.open) {
				this.isShow = e.open
			}
		},
		isPC() {
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
			var flag = true;
			for (let v = 0; v < Agents.length - 1; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		//解决 ios 13 点击区域错位的问题
		appTouchStart(e) {
			// #ifdef H5
			if (this.isPC()) return
			// #endif
			const {
				clientX
			} = e.changedTouches[0]
			this.clientX = clientX
			this.timestamp = new Date().getTime()
		},
		appTouchEnd(e, index, item) {
			// #ifdef H5
			if (this.isPC()) return
			// #endif
			const {
				clientX
			} = e.changedTouches[0]
			let diff = Math.abs(this.clientX - clientX)
			let time = (new Date().getTime()) - this.timestamp
			if (diff < 40 && time < 300) {
				this.$emit('click', {
					index,
					item,
					param: this.param
				})
			}
		},
		handleClick(index, item) {
			// #ifdef H5
			if (!this.isPC()) return
			this.$emit('click', {
				index,
				item,
				param: this.param
			})
			// #endif
		}
	}
}

// #endif
// #ifndef APP-VUE|| MP-WEIXIN || H5
export default {}
// #endif