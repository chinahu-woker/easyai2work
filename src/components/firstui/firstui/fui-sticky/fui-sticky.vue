<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号：9 14  4 06   0 5MA5  56  H1 KX    H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-sticky__wrap" :class="{'fui-sticky__fixed':!range}" :style="getStyles" :id="elId"
		ref="fui_sticky__el">
		<view :class="{'fui-sticky__fixed':range,'fui-sticky__fixed-mp':!range && isFixed}" :style="getStyle">
			<slot></slot>
		</view>
		<!-- #ifdef MP-BAIDU || MP-QQ || MP-TOUTIAO -->
		<view class="fui-sticky__seat" :class="{'fui-sticky__seat-hidden':!isFixed}" v-if="!range"
			:style="{height:height+'px'}"></view>
		<!-- #endif -->
		<slot name="content"></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	// #endif
	export default {
		name: "fui-sticky",
		emits: ['sticky'],
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			top: {
				type: [Number, String],
				default: 0
			},
			range: {
				type: Boolean,
				default: false
			},
			scrollTop: {
				type: Number,
				default: 0
			},
			zIndex: {
				type: [Number, String],
				default: 999
			},
			width: {
				type: [Number, String],
				default: 750
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		computed: {
			getStyles() {
				let styles = ''
				// #ifdef APP-NVUE
				styles = `width:${this.width}rpx;`
				// #endif
				if (!this.range) {
					styles += `top:${this.top}px;z-index:${this.zIndex};`
				}
				return styles
			},
			getStyle() {
				let styles = ''
				if (this.range) {
					styles = `top:${this.top}px;z-index:${this.zIndex};`
				}
				return styles
			}
		},
		watch: {
			scrollTop(val) {
				this.updateStickyChange();
			}
		},
		mounted() {
			this.$nextTick(()=>{
				setTimeout(() => {
					this.init(() => {
						this.updateStickyChange();
					});
				}, 50)
			})
		},
		updated(e) {
			this.$nextTick(() => {
				this.init(() => {
					this.updateStickyChange();
				});
			})
		},
		data() {
			const elId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				elId: elId,
				timer: null,
				elTop: 0,
				height: 0,
				isFixed: false
			};
		},
		methods: {
			updateStickyChange() {
				const et = this.elTop;
				const h = this.height;
				const st = this.scrollTop
				const t = this.top
				if (this.range) {
					this.isFixed = (st + t >= et && st + t < et + h) ? true : false
				} else {
					this.isFixed = st + t >= et ? true : false
				}
				//是否吸顶
				this.$emit("sticky", {
					isFixed: this.isFixed,
					param: this.param
				})
			},
			init(callback) {
				// #ifndef APP-NVUE
				const elId = `#${this.elId}`;
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select(elId)
					.fields({
						size: true,
						rect: true
					}, res => {
						if (res) {
							this.elTop = res.top + (this.scrollTop || 0);
							this.height = res.height;
							callback && callback()
						}
					}).exec()
				// #endif

				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_sticky__el'], option => {
					if (option && option.result && option.size) {
						this.height = option.size.height + 1
						this.elTop = option.size.top + (this.scrollTop || 0)
						callback && callback()
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	.fui-sticky__wrap {
		/* #ifndef APP-VUE */
		width: 100%;
		/* #endif */
	}

	.fui-sticky__fixed {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		position: sticky;
		top: 0;
	}

	/* #ifdef MP-QQ || MP-BAIDU || MP-TOUTIAO */
	.fui-sticky__fixed-mp {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
	}

	.fui-sticky__seat {
		width: 100%;
	}

	.fui-sticky__seat-hidden {
		position: fixed;
		left: -9999px;
		z-index: -10;
		visibility: hidden;
	}

	/* #endif */
</style>