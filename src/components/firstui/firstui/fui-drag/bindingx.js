// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11 2 7，营业执照号：914   4 0 605     M A 556H    1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	watch: {
		list(vals) {
			this.$nextTick(() => {
				setTimeout(() => {
					this.getRefs(vals)
				}, 50)
			})
		}
	},
	data() {
		return {
			current: -1,
			startTouch: null,
			tDragging: false,
			sId: null,
			preStartKey: null,
			isAndroid: false,
			divisor: 1/2
		}
	},
	created() {
		const res = uni.getSystemInfoSync();
		this.isAndroid = res.platform.toLocaleLowerCase() == "android"
		this.divisor = this.isAndroid ? 5/4 : 1/2
		this.allRefs = []
	},
	methods: {
		getEl(el) {
			return el.ref || el[0].ref;
		},
		getRefs(vals) {
			this.allRefs = []
			if (!vals || vals.length === 0) return;
			vals.forEach((item, index) => {
				let ref = this.getEl(this.$refs[`f_drag_${index}`])
				this.allRefs.push(ref)
				this._animation(ref, index, item.transX, item.transY)
			})
		},
		_animation(ref, index, x, y) {
			animation.transition(ref, {
				styles: {
					transform: `translate(${x},${y})`
				},
				duration: this.current === index ? 0 : 250,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
		},
		outOfRange(x1, y1, x2, y2, x3, y3) {
			return x1 < 0 || x1 >= y1 || x2 < 0 || x2 >= y2 || x3 < 0 || x3 >= y3
		},
		listSort(sKey, eKey) {
			let endRealKey = -1;
			this.list.forEach((item) => {
				if (item.sortKey === eKey) endRealKey = item.realKey;
			});

			return this.list.map((item) => {
				let cKey = item.sortKey;
				let rKey = item.realKey;
				if (sKey < eKey) {
					if (cKey > sKey && cKey <= eKey) {
						--rKey;
						--cKey;
					} else if (cKey === sKey) {
						rKey = endRealKey;
						cKey = eKey;
					}
				} else if (sKey > eKey) {
					if (cKey >= eKey && cKey < sKey) {
						++rKey;
						++cKey;
					} else if (cKey === sKey) {
						rKey = endRealKey;
						cKey = eKey;
					}
				}
				if (item.sortKey !== cKey) {
					let columns = Number(this.columns)
					item.transX = (cKey % columns) * this.cellWidth + "px";
					item.transY = Math.floor(cKey / columns) * this.cellHeight + "px";
					item.sortKey = cKey;
					item.realKey = rKey;
				}
				return item;
			});
		},
		emitsEvent(list, type) {
			let changeList = [],
				itemList = [];

			list.forEach((item) => {
				changeList[item.sortKey] = item;
			});

			changeList.forEach((item) => {
				itemList.push(item.entity);
			});
			if (type == "change") {
				this.change({
					itemList: itemList
				});
			} else {
				this.sortend({
					itemList: itemList
				});
			}
		},
		getXY(touch) {
			if (this.isAndroid) {
				touch.pageX = touch.screenX
				touch.pageY = touch.screenY
			}
			return touch
		},
		longPress(e) {
			if (!this.isDrag) return;
			let touch = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : this.startTouch;
			if (!touch) return;
			this.current = Number(e.currentTarget.dataset.index);
			if (this.tDragging) return;
			let ref = this.allRefs[this.current]
			if (!ref) return;
			touch = this.getXY(touch)
			let transX = this.columns == 1 ? 0 : touch.pageX - (this.cellWidth / 2 + this.wrapLeft) + 'px';
			// this.initY = touch.pageY - (this.wrapTop + this.cellHeight * (Math.ceil(this.current / this.columns)))
			let transY = touch.pageY - (this.cellHeight * this.divisor + this.wrapTop ) + 'px';
			this._animation(ref, this.current, transX, transY)
			this.sId = touch.identifier;
			this.tDragging = true;
		},
		touchstart(e) {
			if (!this.isDrag) return;
			this.startTouch = e.changedTouches[0] || e.touches[0];
		},
		touchmove(e) {
			if (!this.isDrag || !this.tDragging) return;
			let touch = e.changedTouches[0] || e.touches[0];
			// || this.sId !== touch.identifier
			if (!touch) return;
			touch = this.getXY(touch)
			let transX = this.columns == 1 ? 0 : touch.pageX - (this.cellWidth / 2 + this.wrapLeft);
			let transY = touch.pageY - (this.cellHeight * this.divisor + this.wrapTop);
			if (touch.pageY > this.windowHeight - this.cellHeight) {
				this.pageScroll({
					scrollTop: touch.pageY + this.cellHeight - this.windowHeight
				})
			} else if (touch.pageY < this.cellHeight) {
				this.pageScroll({
					scrollTop: touch.pageY - this.cellHeight
				})
			}
			let ref = this.allRefs[this.current]
			if (!ref) return;
			this._animation(ref, this.current, transX + 'px', transY + 'px')
			let startKey = this.list[this.current].sortKey;
			let curX = Math.round(transX / this.cellWidth);
			let curY = Math.round(transY / this.cellHeight);
			let endKey = curX + Number(this.columns) * curY;

			if (this.outOfRange(curX, Number(this.columns), curY, this.rows, endKey, this.list.length)) return;
			if (startKey === endKey || startKey === this.preStartKey) return;
			this.preStartKey = startKey;
			let list = this.listSort(startKey, endKey);
			this.allRefs.forEach((ins, index) => {
				var item = list[index];
				if (index !== this.current) {
					this._animation(ins, index, item.transX, item.transY)
				}
			});
			this.listChange({
				itemList: list
			})
			this.emitsEvent(list, "change");
		},
		touchend(e) {
			if (!this.isDrag || !this.tDragging) return;
			this.emitsEvent(this.list, "sortend");
			let cur = this.current
			this.current = -1;
			let ref = this.allRefs[cur]
			if (!ref) return
			this._animation(ref, cur, this.list[cur].transX, this.list[cur].transY)
			this.preStartKey = -1;
			this.tDragging = false;

		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif