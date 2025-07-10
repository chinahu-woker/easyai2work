<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1  127，营业执照号：91 44 060      5 MA556H1 K       XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-rate__wrap" ref="fui_rate_wrap">
		<view class="fui-rate__item" :class="{'fui-rate__not-allowed':disabled}" :style="{paddingRight:spacing + 'rpx'}"
			v-for="(item,index) in stars" :key="index" @touchstart.stop="touchstart" @touchmove.stop="touchmove"
			@mousedown.stop="mousedown" @mousemove.stop="mousemove" @mouseup="mouseup">
			<fui-icon :disabled="disabled" :name="getName(index,intScore,decimalScore)" :size="size"
				:color="index < intScore || (index == intScore && decimalScore > 0) ? getActiveColor : color"></fui-icon>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		emits: ['change'],
		name: "fui-rate",
		// components:{
		// 	fuiIcon
		// },
		props: {
			max: {
				type: [Number, String],
				default: 5
			},
			score: {
				type: [Number, String],
				default: 0
			},
			color: {
				type: String,
				default: "#CCCCCC"
			},
			activeColor: {
				type: String,
				default: ""
			},
			disabled: {
				type: Boolean,
				default: false
			},
			size: {
				type: [Number, String],
				default: 56
			},
			spacing: {
				type: [Number, String],
				default: 0
			},
			allowHalf: {
				type: Boolean,
				default: false
			},
			halfRate: {
				type: [Number, String],
				default: 0.2
			},
			touchable: {
				type: Boolean,
				default: true
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		watch: {
			max(newValue, oldValue) {
				this.initData(newValue)
			},
			score(newValue, oldValue) {
				this.initRateScore(newValue)
			}
		},
		computed: {
			getActiveColor() {
				let color = this.activeColor;
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.warning) || '#FFB703';
				}
				return color;
			}
		},
		data() {
			return {
				stars: [],
				pageX: 0,
				parentWidth: 0,
				intScore: 0,
				decimalScore: 0,
				isPC: false,
				rated: false,
				isMounted: false
			};
		},
		created() {
			this.initData(this.max)
			this.initRateScore(this.score)
			this.drawer = this.getParent()
		},
		mounted() {
			this.isMounted = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this._getSize()
				}, 100)
			})
			// #ifdef H5
			this.isPC = this.IsPC()
			// #endif
		},
		// #ifdef H5
		updated() {
			if (!this.isMounted && !this.pageX) {
				setTimeout(() => {
					this._getSize()
				}, 50)
			}
		},
		// #endif
		methods: {
			getName(index, iScore, dScore) {
				let name = 'star'
				if (index < iScore) {
					name += '-fill'
				}
				if (index === iScore && dScore > 0) {
					name += 'half'
				}
				return name;
			},
			initData(vals) {
				vals = Number(vals)
				if (isNaN(vals)) {
					vals = 5
				}
				vals = Math.ceil(vals)
				this.stars = Array.from(new Array(vals + 1).keys()).slice(1)
			},
			initRateScore(val) {
				val = Number(val);
				let intVal = parseInt(val);
				let decimalVal = val % 1;
				if (!this.allowHalf) {
					intVal = decimalVal > 0 ? intVal + 1 : intVal;
					decimalVal = 0;
				}
				this.intScore = intVal;
				this.decimalScore = decimalVal;
			},
			// #ifdef H5
			IsPC() {
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
			// #endif
			_setWidth(width) {
				const sys = uni.getSystemInfoSync()
				if (this.pageX < 0) {
					this.parentWidth = width
				} else if (this.pageX > sys.windowWidth) {
					this.parentWidth = -width
				}
			},
			setParentWidth(width) {
				setTimeout(() => {
					this._setWidth(width)
				}, 100)
			},
			initParentWidth() {
				if (this.drawer) {
					const sys = uni.getSystemInfoSync()
					let pWidth = this.drawer.width
					if (!pWidth) {
						this.drawer._getSize((width) => {
							this._setWidth(width)
						})
					} else {
						this._setWidth(pWidth)
					}
				}
			},
			_getSize() {
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select('.fui-rate__wrap')
					.boundingClientRect()
					.exec(ret => {
						if (ret) {
							this.pageX = ret[0].left || 0
							this.initParentWidth()
						}
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_rate_wrap'], (ret) => {
					const size = ret.size
					if (size) {
						this.pageX = size.left
						this.initParentWidth()
					}
				})
				// #endif
			},
			_getRateScore(clientX) {
				const distance = clientX - (this.pageX + this.parentWidth);
				let score = 0;
				if (distance > 0) {
					let width = uni.upx2px((Number(this.size) + Number(this.spacing)));
					score = distance / width;
					let decimalScore = score % 1;
					if (!this.allowHalf) {
						decimalScore = decimalScore > 0 ? 1 : 0;
					} else {
						if (decimalScore > Number(this.halfRate)) {
							decimalScore = decimalScore <= 0.5 ? 0.5 : 1;
						} else {
							decimalScore = 0;
						}
					}
					score = parseInt(score) + decimalScore;
					let max = Number(this.max)
					score = score > max ? max : score;
				}
				this.initRateScore(score)
				this.$emit('change', {
					score: score,
					param: this.param
				});
			},
			touchstart(e) {
				// #ifdef H5
				if (this.isPC) return
				// #endif
				if (this.disabled) return
				const {
					clientX,
					screenX
				} = e.changedTouches[0]
				// Nvue下为 screenX，其他平台为clientX
				this._getRateScore(clientX || screenX)
			},
			touchmove(e) {
				// #ifdef H5
				if (this.isPC) return
				// #endif
				if (this.disabled || !this.touchable) return
				const {
					clientX,
					screenX
				} = e.changedTouches[0]
				this._getRateScore(clientX || screenX)
			},
			mousedown(e) {
				// #ifdef H5
				if (!this.isPC || this.disabled) return
				const {
					clientX,
				} = e
				this._getRateScore(clientX)
				this.rated = true
				// #endif
			},
			mousemove(e) {
				// #ifdef H5
				if (!this.isPC || !this.rated || this.disabled || !this.touchable) return
				const {
					clientX
				} = e
				this._getRateScore(clientX)
				// #endif
			},
			mouseup(e) {
				// #ifdef H5
				if (!this.isPC || this.disabled || !this.touchable) return
				this.rated = false
				// #endif
			},
			getParent(name = 'fui-drawer') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			},
			reset() {
				this._getSize();
			}
		}
	}
</script>

<style scoped>
	.fui-rate__wrap {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		line-height: 1;
		font-size: 0;
		flex-direction: row;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-rate__not-allowed {
		/* #ifdef H5 */
		cursor: not-allowed !important;
		/* #endif */
	}
</style>