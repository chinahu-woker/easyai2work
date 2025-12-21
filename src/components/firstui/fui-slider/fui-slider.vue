<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号： 9 14  40  6 0     5  MA5 56H  1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-slider__wrap-outer">
		<text class="fui-slider__value" :class="['fui-slider__vr']"
			:style="{width:valueWidth+'px',color:valueColor,fontSize:valueSize+'px'}"
			v-if="section && showValue">{{start}}</text>
		<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
		<view class="fui-slider__wrap" :style="{width:width+'px',height:(blockHeight<height?height:blockHeight)+'px'}">
			<view class="fui-slider__pole"
				:style="{width:width+'px',height:height+'px',borderRadius:radius+'px',background:background}">
				<view class="fui-slider__pole-left" :class="{'fui-slider__pole-bg':!getActiveColor}"
					:style="{background:getActiveColor}"></view>
				<view class="fui-slider__pole-right" :class="{'fui-slider__pole-bg':!getActiveColor}"
					:style="{background:getActiveColor}"></view>
			</view>
			<view class="fui-slider__handle"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:blockRadius+'px',background:blockColor}"
				:class="['fui-slider__handle-left',disabled?'fui-slider__disabled':'']"
				:change:prop="handler.slidevalue" :prop="initValue" :data-blockWidth="blockWidth" :data-width="width"
				:data-step="step" :data-min="min" :data-max="max" :data-disabled="disabled?1:0" :data-value="start"
				:data-end="end" :data-section="section?1:0" :data-app="isApp" @touchstart="handler.touchstart"
				@touchmove="handler.touchmove" @touchend="handler.touchend" @mousedown="handler.mousedown"></view>

			<view class="fui-slider__handle"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:blockRadius+'px',background:blockColor}"
				:class="['fui-slider__handle-right',disabled?'fui-slider__disabled':'']"
				:change:prop="handler.sectionSlidevalue" :prop="initEndValue" :data-blockWidth="blockWidth"
				:data-width="width" :data-step="step" :data-min="min" :data-max="max" :data-disabled="disabled?1:0"
				:data-value="start" :data-end="end" :data-app="isApp" :data-section="section?1:0" @touchstart="handler.sectionTouchstart"
				@touchmove="handler.sectionTouchmove" @touchend="handler.sectionTouchend"
				@mousedown="handler.endMousedown" v-if="section">
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-slider__wrap" :style="{width:width+'px',height:(blockHeight<height?height:blockHeight)+'px'}">
			<view class="fui-slider__pole"
				:style="{width:width+'px',height:height+'px',borderRadius:radius+'px',background:background}">
				<view class="fui-slider__pole-left" :class="['fui-slider__pole-r']" ref="poleLeft"
					:style="{background:getActiveColor}"></view>
				<view class="fui-slider__pole-right" :class="['fui-slider__pole-l']" ref="poleRight"
					:style="{background:getActiveColor}"></view>
			</view>
			<view class="fui-slider__handle" :fireEventSync="true" @touchstart="touchstart" @horizontalpan="touchmove"
				@touchend="touchend" ref="handleLeft"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:24+'px',background:blockColor}"
				:class="['fui-slider__handle-left',isAndroid?'fui-slider__border':'fui-slider__shadow']"></view>
			<view class="fui-slider__handle" :fireEventSync="true" @touchstart="endTouchstart"
				@horizontalpan="endTouchmove" @touchend="endTouchend" ref="handleRight"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:24+'px',background:blockColor}"
				:class="['fui-slider__handle-right',isAndroid?'fui-slider__border':'fui-slider__shadow']"
				v-if="!isRight && section"></view>
		</view>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS|| MP-WEIXIN || H5 -->
		<view class="fui-slider__wrap" :style="{width:width+'px',height:(blockHeight<height?height:blockHeight)+'px'}">
			<view class="fui-slider__pole"
				:style="{width:width+'px',height:height+'px',borderRadius:radius+'px',background:background}">
				<view class="fui-slider__pole-left"
					:class="['fui-slider__pole-r',getActiveColor?'':'fui-slider__pole-bg']"
					:style="{background:getActiveColor,transform:transLeft}">
				</view>
				<view class="fui-slider__pole-right"
					:class="['fui-slider__pole-l',getActiveColor?'':'fui-slider__pole-bg']"
					:style="{background:getActiveColor,transform:transRight}">
				</view>
			</view>
			<view class="fui-slider__handle"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:blockRadius+'px',background:blockColor,transform:moveLeft}"
				:class="['fui-slider__handle-left',isRight?'fui-slider__handle-zi':'']" @touchstart="touchstart"
				@touchmove.stop.prevent="touchmove" @touchend="touchend"></view>
			<view class="fui-slider__handle"
				:style="{width:blockWidth+'px',height:blockHeight+'px',borderRadius:blockRadius+'px',background:blockColor,transform:moveRight}"
				:class="['fui-slider__handle-right']" @touchstart="endTouchstart" @touchmove.stop.prevent="endTouchmove"
				@touchend="endTouchend" v-if="section"></view>
		</view>
		<!-- #endif -->
		<text class="fui-slider__value" :class="['fui-slider__vl']"
			:style="{width:valueWidth+'px',color:valueColor,fontSize:valueSize+'px'}"
			v-if="showValue">{{section?end:start}}</text>
	</view>
</template>


<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->

<script>
	import bindingx from './bindingx.js'
	import mpjs from './mpjs.js'
	export default {
		name: "fui-slider",
		mixins: [mpjs, bindingx],
		emits: ['change', 'changing'],
		props: {
			width: {
				type: [Number, String],
				default: 240
			},
			height: {
				type: [Number, String],
				default: 2
			},
			radius: {
				type: [Number, String],
				default: 2
			},
			min: {
				type: [Number, String],
				default: 0
			},
			max: {
				type: [Number, String],
				default: 100
			},
			step: {
				type: [Number, String],
				default: 1
			},
			value: {
				type: [Number, String],
				default: 0
			},
			section: {
				type: Boolean,
				default: false
			},
			endValue: {
				type: [Number, String],
				default: 100
			},
			background: {
				type: String,
				default: '#e1e1e1'
			},
			activeColor: {
				type: String,
				default: ''
			},
			blockWidth: {
				type: [Number, String],
				default: 24
			},
			blockHeight: {
				type: [Number, String],
				default: 24
			},
			blockColor: {
				type: String,
				default: '#fff'
			},
			blockRadius: {
				type: [Number, String],
				default: 12
			},
			disabled: {
				type: Boolean,
				default: false
			},
			showValue: {
				type: Boolean,
				default: false
			},
			valueWidth: {
				type: [Number, String],
				default: 32
			},
			valueSize: {
				type: [Number, String],
				default: 14
			},
			//value字体颜色
			valueColor: {
				type: String,
				default: '#333'
			}
		},
		watch: {
			value(val) {
				let start = this.getStartVal(val)
				this.initValue = start
				this.start = start
			},
			endValue(val) {
				let end = this.getEndVal(val)
				this.initEndValue = end
				this.end = end
			}
		},
		computed: {
			getActiveColor() {
				let color = this.activeColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		data() {
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				start: 0,
				end: 0,
				initValue: 0,
				initEndValue: 0
			};
		},
		mounted() {
		   this.$nextTick(()=>{
			   setTimeout(() => {
			   	this.start = this.getStartVal(this.value);
			   	this.end = this.getEndVal(this.endValue)
			   	this.initValue = this.start;
			   	this.initEndValue = this.end;
			   }, 10)
		   })
		},
		methods: {
			getStartVal(val) {
				val = Number(val)
				let min = Number(this.min)
				val = val < min ? min : val
				return val
			},
			getEndVal(val) {
				val = Number(val)
				let min = Number(this.min)
				let max = Number(this.max)
				val = val < min ? min : val
				val = val > max ? max : val
				return val
			},
			getParams(e) {
				let val = e.value || 0;
				if (this.section && !e.isStart) {
					this.end = val
				} else {
					this.start = val
				}
				let params = {
					value: this.start
				}
				if (this.section) {
					params.endValue = this.end
				}
				return params
			},
			change(e) {
				let params = this.getParams(e)
				this.$emit('change', params);
			},
			changing(e) {
				let params = this.getParams(e)
				this.$emit('changing', params);
			}
		}
	}
</script>

<style scoped>
	.fui-slider__wrap-outer {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-slider__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		flex-direction: row;
		position: relative;
	}

	.fui-slider__pole {
		position: relative;
		z-index: 1;
		overflow: hidden;
	}

	.fui-slider__pole-left {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
	}


	.fui-slider__pole-r {
		right: 0;
		/* #ifndef APP-NVUE */
		transform: translate3d(-100%, 0, 0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateX(-100%);
		/* #endif */
	}

	.fui-slider__pole-l {
		left: 0;
		/* #ifndef APP-NVUE */
		transform: translate3d(100%, 0, 0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateX(100%);
		/* #endif */
	}


	.fui-slider__pole-right {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 2;
	}

	.fui-slider__handle {
		/* #ifndef APP-NVUE */
		box-shadow: 0 0 4px #CCCCCC;
		/* #endif */
		/* #ifdef H5 */
		cursor: grab;
		/* #endif */
		position: absolute;
		top: 0;
	}

	/* #ifdef APP-NVUE */
	.fui-slider__shadow {
		box-shadow: 0 0 4px #CCCCCC;
	}

	.fui-slider__border {
		border: 0.5px solid #eee;
	}

	/* #endif */


	.fui-slider__handle-left {
		left: 0;
		z-index: 3;
	}

	.fui-slider__handle-right {
		right: 0;
		z-index: 4;
	}

	.fui-slider__handle-zi {
		z-index: 5 !important;
	}

	.fui-slider__value {
		/* #ifndef APP-NVUE */
		display: flex;
		white-space: nowrap;
		/* #endif */
		flex-direction: row;
		font-weight: normal;
		align-items: center;
	}

	.fui-slider__vl {
		text-align: left;
		justify-content: flex-start;
		padding-left: 8px;

	}

	.fui-slider__vr {
		text-align: right;
		justify-content: flex-end;
		padding-right: 8px;
	}

	/* #ifndef APP-NVUE */
	.fui-slider__pole-bg {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	/* #ifdef H5 */
	.fui-slider__disabled {
		cursor: not-allowed !important;
	}

	/* #endif */
</style>