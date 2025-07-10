<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  12 7，营业执照号：91  4  40 60 5   MA55     6H1KX   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-slider__captcha-wrap" :class="{'fui-sc__wrap-show':isShow}"
		:style="{background:maskBgColor,zIndex:zIndex}" @tap="maskClose" @touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue" ref="fui_sc_ani">
		<view class="fui-slider__captcha" :style="{background:background}" @tap.stop="stop">
			<text class="fui-sc__title"
				:style="{ width: width + 'px',color: color, fontSize: size + 'rpx' }">{{ title }}</text>
			<text class="fui-sc__descr"
				:style="{width: width + 'px',color:descrColor, fontSize: descrSize + 'rpx'}">拖动下方滑块完成拼图</text>
			<view class="fui-sc__img-box" :style="{width: width + 'px'}">
				<image class="fui-sc__img" :src="src" :style="{width: width + 'px', height:height + 'px'}" v-if="src">
				</image>
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="fui-sc__slot-box" ref="imgRef"
					:class="{'fui-sc__sb-hidden':!cutSrc,'fui-sc__sb-bs':!isNvueAndroid}"
					:style="{left:x+'px',top:y+'px'}">
					<image :src="cutSrc" class="fui-sc__slot-img" :class="{'fui-sc__img-border':isNvueAndroid}">
					</image>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="fui-sc__slot-box" :class="{'fui-sc__sb-bs':true,'fui-sc__reset-ani':resetAni}"
					:style="{left:x+'px',top:y+'px',transform:transformSlot}" v-if="cutSrc">
					<image :src="cutSrc" class="fui-sc__slot-img"></image>
				</view>
				<!-- #endif -->
			</view>
			<view class="fui-sc__sliderbar" :style="{width: width + 'px',height:sliderH+'px'}">
				<view class="fui-sc__bar"
					:style="{width: width + 'px',height:(sliderH/2)+'px',borderRadius:sliderH+'px'}">
				</view>
				<!-- #ifdef APP-VUE || MP-WEIXIN  || H5-->
				<view class="fui-sc__slider" :class="{'fui-sc__slider-bg':!sliderBgColor}"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:sliderBgColor}"
					:change:prop="parse.slidereset" :prop="resetNum" :data-width="width" :data-start="x"
					:data-swidth="sliderH * 2" :data-app="isApp"
					:data-disabled="!cutSrc || isPass || disabled || !isShow?1:0" @touchstart="parse.touchstart"
					@touchmove="parse.touchmove" @touchend="parse.touchend" @mousedown="parse.mousedown">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view ref="sliderRef" class="fui-sc__slider"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:getSliderBgColor}"
					@touchstart="touchstart" @horizontalpan="touchmove" @touchend="touchend">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
				<view class="fui-sc__slider" :class="{'fui-sc__slider-bg':!sliderBgColor,'fui-sc__reset-ani':resetAni}"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:sliderBgColor,transform:transform}"
					@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->

			</view>
			<view class="fui-sc__close " @tap.stop="closeVerify">
				<fui-icon name="close" :color="closeColor"></fui-icon>
			</view>
		</view>
	</view>
</template>
<!-- #ifdef APP-VUE  || MP-WEIXIN  || H5-->
<script src="./index.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
	import weex from './weex.js'
	import mpjs from './mpjs.js'
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-puzzle-verify",
		mixins: [mpjs, weex],
		emits: ['verify', 'init'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			src: {
				type: String,
				default: ''
			},
			cutSrc: {
				type: String,
				default: ''
			},
			x: {
				type: [Number, String],
				default: 10
			},
			y: {
				type: [Number, String],
				default: 10
			},
			width: {
				type: [Number, String],
				default: 300
			},
			height: {
				type: [Number, String],
				default: 150
			},
			background: {
				type: String,
				default: '#FFFFFF'
			},
			title: {
				type: String,
				default: '安全验证'
			},
			color: {
				type: String,
				default: '#B2B2B2'
			},
			size: {
				type: [Number, String],
				default: 28
			},
			descrColor: {
				type: String,
				default: '#333333'
			},
			descrSize: {
				type: [Number, String],
				default: 36
			},
			closeColor: {
				type: String,
				default: '#B2B2B2'
			},
			sliderBgColor: {
				type: String,
				default: ''
			},
			slideColor: {
				type: String,
				default: '#FFFFFF'
			},
			zIndex: {
				type: [Number, String],
				default: 996
			},
			maskBgColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			src(newValue, oldValue) {
				setTimeout(() => {
					this.reset()
				}, 50);
			},
			cutSrc(val) {
				setTimeout(() => {
					this.reset()
				}, 50);
			}
		},
		computed: {
			getSliderBgColor() {
				let color = this.sliderBgColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			}
		},
		data() {
			let sys = uni.getSystemInfoSync()
			let isNvue = false
			let isNvueAndroid = false
			let isApp = 0;
			// #ifdef APP-NVUE
			isNvue = true
			isNvueAndroid = sys.platform === 'android'
			// #endif

			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				isNvueAndroid,
				isNvue,
				isShow: false,
				w: 300,
				h: 150,
				sliderH: 0,
				resetNum: 0,
				isPass: false,
				disabled: false
			};
		},
		created() {
			this.sliderH = this.getPx(64)
			//结合后端验证使用
			this.$emit('init', {
				//切割图片的宽高，固定为44px
				cutGraphWidth: 44
			})
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			verify(e) {
				//验证中禁止操作
				this.disabled = true
				this.$emit('verify', {
					slipDistance: e.slip
				})
			},
			success() {
				this.isPass = true;
			},
			reset() {
				this.resetNum += 1
				this.isPass = false;
				this.disabled = false;
			},
			maskClose() {
				if (!this.maskClosable) return;
				this.closeVerify()
			},
			closeVerify() {
				this.reset();
				// #ifndef APP-NVUE
				this.isShow = false;
				// #endif

				// #ifdef APP-NVUE
				this.closeAni()
				// #endif
			},
			show() {
				// #ifndef APP-NVUE
				this.isShow = true;
				// #endif

				// #ifdef APP-NVUE
				this.openAni()
				// #endif
			},
			stop() {}
		}
	}
</script>

<style scoped>
	.fui-slider__captcha-wrap {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transition-property: all;
		transition-timing-function: ease-in;
		transition-duration: 0.2s;
		display: flex;
		transform: scale3d(1, 1, 0);
		visibility: hidden;
		/* #endif */
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	/* #ifndef APP-NVUE */
	.fui-sc__wrap-show {
		opacity: 1;
		transform: scale3d(1, 1, 1);
		visibility: visible;
	}

	/* #endif */
	.fui-slider__captcha {
		padding: 60rpx 32rpx;
		text-align: center;
		border-radius: 24rpx;
		overflow: hidden;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.fui-sc__title {
		text-align: left;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		font-weight: normal;
	}

	.fui-sc__descr {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		text-align: left;
		padding-bottom: 36rpx;
		font-weight: 600;
		padding-top: 12rpx;
	}

	.fui-sc__img-box {
		position: relative;
		background: #F1F4FA;
	}

	/* #ifndef APP-NVUE */
	.fui-sc__img {
		display: block;
	}

	/* #endif */

	.fui-sc__slot-bs {
		box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
	}

	.fui-sc__sb-bs {
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.8);
	}

	.fui-sc__slot-box {
		position: absolute;
		width: 44px;
		height: 44px;
		opacity: 1;
		z-index: 5;
	}

	.fui-sc__sb-hidden {
		opacity: 0;
	}

	.fui-sc__slot-img {
		width: 44px;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-sc__img-border {
		border: 0.5px solid rgba(255, 255, 255, .2)
	}

	/* #endif */

	.fui-sc__close {
		position: absolute;
		padding: 16rpx 16rpx 0 0;
		right: 12rpx;
		top: 12rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-sc__sliderbar {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 48rpx;
	}

	.fui-sc__bar {
		background: #EEEEEE;
	}

	.fui-sc__slider {
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-sc__slider-bg {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-sc__reset-ani {
		transition: transform 0.2s;
	}

	/* #endif */

	/* fix：Vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

	/* #ifdef VUE3 */
	.fui-pv__un-ani {
		transition: transform 0s;
	}

	/* #endif */
</style>