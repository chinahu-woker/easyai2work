<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号： 9 14406    05 M   A 5  56  H1K  XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-rotate__verify-wrap" :class="{'fui-rv__wrap-show':isShow}"
		:style="{background:maskBgColor,zIndex:zIndex}" @tap="maskClose" @touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue" ref="fui_rv_ani">
		<view class="fui-rotate__verify" :style="{width:width+'rpx',background:background}" @tap.stop="stop">
			<view class="fui-rv__close" @tap.stop="closeVerify">
				<fui-icon name="close" :color="closeColor"></fui-icon>
			</view>
			<text class="fui-rv__title" :style="{ color: color, fontSize: size + 'rpx' }">{{ title }}</text>
			<text class="fui-rv__descr" :style="{ color: descrColor, fontSize: descrSize + 'rpx' }">拖动滑块，使图片角度为正</text>
			<view class="fui-rv__image-box"
				:style="{ width: imgW + 'px', height: imgW + 'px',borderRadius:isNvue?(imgW+'px'):'50%' }">
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<image class="fui-rv__image" :src="src"
					:style="{ width: imgW + 'px', height: imgW + 'px',borderRadius:isNvue?(imgW+'px'):'50%' }"
					ref="imgRef">
				</image>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
				<image class="fui-rv__image" :class="{'fui-rv__rest-ani':resetAni}" :src="src"
					:style="{ width: imgW + 'px', height: imgW + 'px',borderRadius:isNvue?(imgW+'px'):'50%',transform:'rotate('+angle+'deg)' }">
				</image>
				<!-- #endif -->
				<view class="fui-rv__result" v-if="showRes || isPass"
					:style="{ width: imgW + 'px', height:imgW + 'px',borderRadius:isNvue?(imgW+'px'):'50%' }">
					<fui-icon :name="isPass?'check':'close'" :size="96" :color="getColor"></fui-icon>
				</view>
			</view>
			<!-- #ifdef APP-VUE || MP-WEIXIN || H5 -->
			<view class="fui-rv__slidebar"
				:style="{width: sliderWidth+'px',height: sliderHeight + 'px', borderColor: borderColor,borderRadius:sliderHeight+'px'}">
				<view class="fui-rv__slider"
					:style="{ width: sliderHeight + 'px', height: (sliderHeight-2) + 'px', background: sliderBgColor,borderColor: borderColor,borderRadius:isNvue?sliderHeight+'px':'50%'}"
					:change:prop="parse.slidereset" :prop="resetNum" :data-width="sliderWidth"
					:data-swidth="sliderHeight" :data-app="isApp" :data-disabled="isPass || disabled || !isShow?1:0"
					@touchstart="parse.touchstart" @touchmove="parse.touchmove" @touchend="parse.touchend"
					@mousedown="parse.mousedown">
					<fui-icon name="slide" :size="60" :color="slideColor"></fui-icon>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view class="fui-rv__slidebar"
				:style="{width: sliderWidth+'px',height: sliderHeight + 'px', borderColor: borderColor,borderRadius:sliderHeight+'px'}">
				<view class="fui-rv__slider"
					:style="{ width: sliderHeight + 'px', height: (sliderHeight-2) + 'px', background: sliderBgColor,borderColor: borderColor,borderRadius:isNvue?sliderHeight+'px':'50%'}"
					@touchstart="touchstart" @horizontalpan="touchmove" @touchend="touchend" ref="sliderRef">
					<fui-icon name="slide" :size="60" :color="slideColor"></fui-icon>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view class="fui-rv__slidebar"
				:style="{width: sliderWidth+'px',height: sliderHeight + 'px', borderColor: borderColor,borderRadius:sliderHeight+'px'}">
				<view class="fui-rv__slider" :class="{'fui-rv__rest-ani':resetAni}"
					:style="{ width: sliderHeight + 'px', height: (sliderHeight-2) + 'px', background: sliderBgColor,borderColor: borderColor,borderRadius:isNvue?sliderHeight+'px':'50%',transform:transform}"
					@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
					<fui-icon name="slide" :size="60" :color="slideColor"></fui-icon>
				</view>
			</view>
			<!-- #endif -->
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
		name: "fui-rotate-verify",
		mixins: [mpjs, weex],
		emits: ['verify'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			//验证弹层外层盒子宽度 rpx
			width: {
				type: [Number, String],
				default: 600
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
				default: 32
			},
			//图片地址（旋转了初始角度后的图片），必传
			//旋转角度建议区间为 -330deg<angle <-30deg 或 30deg<angle<330deg
			src: {
				type: String,
				default: ''
			},
			//图片宽度，单位rpx。默认为正方形图片
			imgWidth: {
				type: [Number, String],
				default: 240
			},
			//滑动条和滑块边框颜色
			borderColor: {
				type: String,
				default: '#EEEEEE'
			},
			sliderBgColor: {
				type: String,
				default: '#FFFFFF'
			},
			closeColor: {
				type: String,
				default: '#B2B2B2'
			},
			slideColor: {
				type: String,
				default: '#333333'
			},
			passColor: {
				type: String,
				default: ''
			},
			failColor: {
				type: String,
				default: ''
			},
			zIndex: {
				type: [Number, String],
				default: 996
			},
			maskBgColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			imgWidth(val) {
				this.imgW = this.getPx(val)
			},
			width(val) {
				this.sliderWidth = this.getPx((Number(val) - 64))
			}
		},
		computed: {
			getColor() {
				const app = uni && uni.$fui && uni.$fui.color;
				let passColor = this.passColor || (app && app.success) || '#09BE4F'
				let failColor = this.failColor || (app && app.danger) || '#FF2B2B'
				return this.isPass ? passColor : failColor
			}
		},
		data() {
			let isNvue = false
			let isApp = 0
			// #ifdef APP-NVUE
			isNvue = true
			// #endif

			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				isNvue,
				isShow: false,
				isPass: false,
				disabled: false,
				showRes: false,
				sliderHeight: 0,
				imgW: 0,
				sliderWidth: 0,
				resetNum: 0
			};
		},
		created() {
			this.sliderWidth = this.getPx((Number(this.width) - 64))
			this.sliderHeight = this.getPx(92)
			this.imgW = this.getPx(this.imgWidth)
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			success() {
				this.isPass = true;
			},
			fail() {
				this.showRes = true;
				this.isPass = false;
				setTimeout(() => {
					this.reset()
				}, 300)
			},
			verify(e) {
				//Math.abs(angle + initAngle - 360) <= range || Math.abs(angle + initAngle) <= range
				//验证中禁止操作
				this.disabled = true
				this.$emit('verify', e)
			},
			/*
			 验证结果，前端验证时使用
			@param {Number} angle 旋转角度
			@param {Number} initAngle 初始化时旋转角度
			@param {Number} range 可误差角度范围
			@param {function} callback 回调函数 返回参数=>是否通过验证(bool)
			*/
			verifyRes(angle, initAngle, range, callback) {
				let res = false
				if (Math.abs(angle + initAngle - 360) <= range || Math.abs(angle + initAngle) <= range) {
					res = true
				}
				callback && callback(res)
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
			reset() {
				this.resetNum += 1
				this.isPass = false;
				this.disabled = false;
				this.showRes = false
			},
			stop() {}
		}
	}
</script>

<style scoped>
	.fui-rotate__verify-wrap {
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
	.fui-rv__wrap-show {
		opacity: 1;
		transform: scale3d(1, 1, 1);
		visibility: visible;
	}

	/* #endif */

	.fui-rotate__verify {
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

	.fui-rv__close {
		position: absolute;
		padding: 16rpx 16rpx 0 0;
		right: 12rpx;
		top: 12rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-rv__title {
		text-align: center;
		padding-top: 30rpx;
		font-weight: normal;
	}

	.fui-rv__descr {
		text-align: center;
		padding-top: 20rpx;
		font-weight: normal;
	}

	.fui-rv__image-box {
		position: relative;
		margin-top: 48rpx;
		margin-bottom: 64rpx;
		background: #F1F4FA;
	}

	/* #ifndef APP-NVUE */
	.fui-rv__image {
		border-radius: 50%;
		display: block;
		/* #ifndef APP-PLUS || MP-WEIXIN || H5 */
		position: absolute;
		left: 0;
		top: 0;
		/* #endif */
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-rv__rest-ani {
		transition: transform 0.2s;
	}

	/* #endif */

	/* fix：vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

	/* #ifdef VUE3 */
	.fui-rv__un-ani {
		transition: transform 0s;
	}

	/* #endif */

	.fui-rv__result {
		position: absolute;
		z-index: 2;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
	}

	.fui-rv__slidebar {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		position: relative;
		border-width: 1px;
		border-style: solid;
	}

	.fui-rv__slider {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		border-width: 1px;
		border-style: solid;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
</style>