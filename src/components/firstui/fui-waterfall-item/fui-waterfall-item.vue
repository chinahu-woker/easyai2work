<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  12 7，营业执照号：9     144 06  0 5M A556 H    1 KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view :id="elId" ref="fui_wi__el" class="fui-waterfall__item-wrap" :class="{'fui-waterfall__item-show':isShow}"
		:style="{width:width+'px' ,background:background,borderRadius:radius+'rpx',transform:transform}"
		@tap="handleTap">
		<slot name="upper"></slot>
		<view :class="{'fui-waterfall__img-wrap':!isLoaded,'fui-waterfall__hidden':imgHeight!=0}" :style="getStyl"
			v-if="isSrc">
			<image class="fui-waterfall__img" :src="src" :mode="imgHeight!=0?'scaleToFill':'widthFix'" :webp="webp"
				:draggable="draggable" @load="handleLoad" @error="handleError" :style="getStyles" v-if="isLoaded">
			</image>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: "fui-waterfall-item",
		emits: ['click'],
		inject: ['waterfall'],
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			background: {
				type: String,
				default: '#FFFFFF'
			},
			radius: {
				type: [Number, String],
				default: 16
			},
			src: {
				type: String,
				default: ''
			},
			imgWidth: {
				type: [Number, String],
				default: 0
			},
			//V1.9.8+ 设置图片高度，则不再等图片加载完成后再去渲染
			imgHeight: {
				type: [Number, String],
				default: 0
			},
			webp: {
				type: Boolean,
				default: false
			},
			draggable: {
				type: Boolean,
				default: true
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		created() {
			this.src && (this.isSrc = true);
			if (this.waterfall) {
				this.waterfall.childrenArr.push(this)
				if (this.waterfall.itemWidth) {
					this.width = this.waterfall.itemWidth
				} else {
					this.waterfall.initParam((width) => {
						this.width = width
					})
				}
			}
		},
		computed: {
			getStyles() {
				const width = this.imgWidth != 0 ? `${this.imgWidth}rpx` : `${this.width}px`
				let style =
					`width:${width};border-radius:${this.radius}rpx ${this.radius}rpx 0 0;`

				if (this.imgHeight != 0) {
					style += `height:${this.imgHeight}rpx;`
				}
				return style;
			},
			getStyl() {
				let style = this.getStyles;
				if (this.imgHeight == 0 && !this.isLoaded) {
					style += `height:${this.width}px;`
				}
				return style;
			}
		},
		mounted() {
			if (!this.src || this.imgHeight != 0) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.getWaterfallItemInfo()
					}, 50)
				})
			}
		},
		data() {
			const elId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				elId: elId,
				width: 0,
				height: 0,
				transform: '',
				isShow: false,
				isLoaded: true,
				isSrc: false
			};
		},
		methods: {
			// #ifdef APP-NVUE
			aniTransForm(x, y) {
				animation.transition(
					this.$refs['fui_wi__el'].ref, {
						styles: {
							transform: `translate(${x}px,${y}px)`
						},
						duration: 0,
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {}
				);
			},
			// #endif
			getWaterfallItemInfo() {
				this.getItemHeight((res) => {
					if (this.waterfall) {
						this.waterfall.loadedArr.push('ok')
						if (this.waterfall.childrenArr.length === this.waterfall.loadedArr.length) {
							this.waterfall.startSorting()
						}
					}
				})
			},
			getItemHeight(callback, index = 0) {
				// #ifdef APP-NVUE
				const result = dom.getComponentRect(this.$refs['fui_wi__el'], option => {
					if (option && option.result && option.size) {
						this.height = parseInt(option.size.height + 1)
						callback && callback(this.height)
					}
				})
				// #endif

				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select(`#${this.elId}`)
					.fields({
						size: true
					}, data => {
						if (index >= 20) return
						if (data && data.height) {
							this.height = data.height
							callback && callback(data.height)
						} else {
							index++
							setTimeout(() => {
								this.getItemHeight(callback, index)
							}, 50)
							return
						}
					})
					.exec()
				// #endif
			},
			handleLoad(e) {
				if (this.imgHeight != 0) return;
				setTimeout(() => {
					this.getWaterfallItemInfo()
				}, 50)
			},
			handleError(e) {
				this.isLoaded = false
				if (this.imgHeight != 0) return;
				setTimeout(() => {
					this.getWaterfallItemInfo()
				}, 50)
			},
			handleTap() {
				this.$emit('click', {
					param: this.param
				})
			}
		}
	}
</script>

<style scoped>
	.fui-waterfall__item-wrap {
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		opacity: 0;
		transition-property: opacity;
		transition-duration: .5s;
		flex-direction: column;
	}

	.fui-waterfall__item-show {
		opacity: 1;
	}

	.fui-waterfall__img-wrap {
		background: #F1F4FA;
		overflow: hidden;
	}

	.fui-waterfall__hidden {
		overflow: hidden;
	}

	.fui-waterfall__img {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
</style>