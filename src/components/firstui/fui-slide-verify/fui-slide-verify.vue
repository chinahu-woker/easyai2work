<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  11 27，营业执照号：91 44  0 605MA   5   5 6H    1 KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-slideverify__wrap" :style="{width:totalWidth+'px',height:height+'rpx',background:background}">
		<text class="fui-sv__text-tip" :style="{fontSize:size+'rpx',background:getBackground,color:color}"
			:class="{'fui-sv__opacity':isPass}">拖动滑块至虚线框内</text>
		<!-- #ifdef APP-PLUS  || MP-WEIXIN || H5-->
		<view class="fui-sv__foreground" ref="foreground" :class="{'fui-sv__background':!getActiveBgColor}"
			:style="{background:getActiveBgColor}">
		<!-- #endif -->
			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view class="fui-sv__foreground"
				:class="{'fui-sv__background':!getActiveBgColor,'fui-sv__reset-ani':resetAni}"
				:style="{background:getActiveBgColor,width:fwidth+'px'}">
			<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<text :class="{'fui-sv__opacity':!isPass}" class="fui-sv__text-res"
					:style="{fontSize:size+'rpx',color:activeColor,lineHeight:height+'rpx',width:passWidth+'px'}">验证通过</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<text :class="{'fui-sv__opacity':!isPass}" class="fui-sv__text-res"
					:style="{fontSize:size+'rpx',color:activeColor}">验证通过</text>
				<!-- #endif -->
				<text :class="{'fui-sv__opacity':isPass}" class="fui-sv__text-cover"
					:style="{width:totalWidth+'px',fontSize:size+'rpx',height:height+'rpx',lineHeight:height+'rpx',color:activeColor}">拖动滑块至虚线框内</text>
			</view>
			<!-- #ifdef APP-VUE || MP-WEIXIN  || H5-->
			<view class="fui-sv__slider" :class="{'fui-sv__border-color':!getPassColor && isPass}"
				:style="{width:sliderW+'px',borderColor:isPass?getPassColor: borderColor}"
				:change:prop="parse.slidereset" :prop="resetNum" :data-width="totalWidth" :data-tleft="targetWidth"
				:data-swidth="sliderW" :data-app="isApp" :data-pass="isPass?1:0" :data-range="range"
				@touchstart="parse.touchstart" @touchmove="parse.touchmove" @touchend="parse.touchend"
				@mousedown="parse.mousedown">
				<fui-icon name="right" :color="arrowColor" :size="iconSize" v-if="!isPass"></fui-icon>
				<fui-icon name="checkbox-fill" :color="getPassColor" primary :size="iconSize" v-else></fui-icon>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view class="fui-sv__slider" @touchstart="touchstart" @horizontalpan="touchmove" @touchend="touchend"
				ref="slider" :style="{width:sliderW+'px',borderColor:isPass?getPassColor: borderColor}">
				<fui-icon name="right" :color="arrowColor" :size="iconSize" v-if="!isPass"></fui-icon>
				<fui-icon name="checkbox-fill" :color="getPassColor" :size="iconSize" v-else></fui-icon>
			</view>
			<!-- #endif -->

			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view class="fui-sv__slider"
				:class="{'fui-sv__border-color':!getPassColor && isPass,'fui-sv__reset-ani':resetAni}"
				:style="{width:sliderW+'px',borderColor:isPass?getPassColor: borderColor,transform:transform}"
				@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
				<fui-icon name="right" :color="arrowColor" :size="iconSize" v-if="!isPass"></fui-icon>
				<fui-icon name="checkbox-fill" :color="getPassColor" primary :size="iconSize" v-else></fui-icon>
			</view>
			<!-- #endif -->
			<view class="fui-sv__dotted-box"
				:style="{'border-color':lineColor,'border-width':isPass?0:'1px',width:sliderW+'px',left:(targetWidth-sliderW)+'px'}">
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
		name: "fui-slide-verify",
		mixins: [mpjs, weex],
		emits: ['success', 'fail'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			range: {
				type: [Number, String],
				default: 3
			},
			error: {
				type: [Number, String],
				default: 3
			},
			width: {
				type: [Number, String],
				default: 640
			},
			height: {
				type: [Number, String],
				default: 80
			},
			background: {
				type: String,
				default: "#EEEEEE"
			},
			activeBgColor: {
				type: String,
				default: ""
			},
			sliderWidth: {
				type: [Number, String],
				default: 80
			},
			sliderBgColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: '#EEEEEE'
			},
			passColor: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: "#333333"
			},
			activeColor: {
				type: String,
				default: "#FFFFFF"
			},
			iconSize: {
				type: [Number, String],
				default: 48
			},
			arrowColor: {
				type: String,
				default: "#B2B2B2"
			},
			lineColor: {
				type: String,
				default: "#B2B2B2"
			}
		},
		computed: {
			getBackground() {
				// #ifndef APP-NVUE
				return `-webkit-gradient(linear, left top, right top, color-stop(0, ${this.color}), color-stop(.4, ${this.color}), color-stop(.5, white), color-stop(.6, ${this.color}), color-stop(1, ${this.color}))`
				// #endif

				// #ifdef APP-NVUE
				return 'transparent'
				// #endif
			},
			getActiveBgColor() {
				let color = this.activeBgColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			},
			getPassColor() {
				let color = this.passColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		watch: {
			width(val) {
				this.totalWidth = this.getPx(val)
			},
			sliderWidth(val) {
				this.sliderW = this.getPx(val)
			}
		},
		data() {
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				totalWidth: 0,
				targetWidth: 0,
				sliderW: 0,
				isPass: false,
				resetNum: 0,
				times: 0
			};
		},
		created() {
			this.totalWidth = this.getPx(this.width)
			this.sliderW = this.getPx(this.sliderWidth)
			this.changeTargetPosi()
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			changeTargetPosi() {
				let range = Array.from(new Array(100 + 1).keys()).slice(50);
				let index = Math.floor((Math.random() * range.length));
				let width = uni.upx2px(parseInt((this.width * (range[index] || 100)) / 100))
				width = width <= this.sliderW ? this.sliderW + 20 : width
				this.targetWidth = parseInt(width)
			},
			reset() {
				this.resetNum += 1
				this.isPass = false;
				this.times = 0
				this.changeTargetPosi()
			},
			success() {
				this.isPass = true;
				this.$emit('success', {})
			},
			fail() {
				this.times++;
				if (this.times >= Number(this.error)) {
					this.changeTargetPosi()
					this.times = 0
				}
				this.$emit('fail', {})
			}
		}
	}
</script>

<style scoped>
	.fui-slideverify__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.fui-sv__text-tip {
		font-weight: normal;
		width: 338rpx;
		text-align: center;
		opacity: 1;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		-webkit-background-clip: text !important;
		-webkit-text-fill-color: transparent !important;
		-webkit-animation: ani_sv 2s infinite;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	@-webkit-keyframes ani_sv {
		from {
			background-position: -160rpx;
		}

		to {
			background-position: 160rpx;
		}
	}

	@keyframes ani_sv {
		from {
			background-position: -160rpx;
		}

		to {
			background-position: 160rpx;
		}
	}

	.fui-sv__background {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-sv__border-color {
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
	.fui-sv__foreground {
		width: 0;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.fui-sv__text-res {
		opacity: 1;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
		text-align: center;
		font-weight: normal;
		/* #ifdef APP-NVUE */
		position: absolute;
		left: 0;
		top: 0;
		/* #endif */
	}

	.fui-sv__slider {
		/* #ifndef APP-NVUE */
		display: flex;
		z-index: 3;
		box-sizing: border-box;
		/* #endif */
		align-items: center;
		justify-content: center;
		border-width: 1rpx;
		border-style: solid;
		background: #FFFFFF;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		transition-property: border-color;
		transition-duration: 0.08s;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-sv__dotted-box {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 5;
		border-style: dashed;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		transition-property: left;
		transition-duration: 0.2s;
	}

	.fui-sv__opacity {
		opacity: 0 !important;
	}

	.fui-sv__text-cover {
		/* #ifndef APP-NVUE */
		display: flex;
		white-space: nowrap;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: absolute;
		left: 0;
		top: 0;
		font-weight: normal;
		opacity: 1;
	}

	/* #ifndef APP-NVUE */
	.fui-sv__reset-ani {
		transition: transform 0.2s;
	}

	/* #endif */

	/* fix：vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

	/* #ifdef VUE3 */
	.fui-sv__un-ani {
		transition: transform 0s;
	}

	/* #endif */
</style>