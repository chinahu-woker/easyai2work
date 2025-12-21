<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 9   14  4060  5M A   556H  1  KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-steps__wrap" :class="{'fui-steps__flex':direction==='row'}"
		:style="{paddingTop:padding[0] || 0,paddingRight:padding[1]||0,paddingBottom:padding[2] || padding[0]||0,paddingLeft:padding[3] || padding[1]||0,background:background}">
		<view class="fui-steps__node-wrap"
			:class="[direction==='column'?'fui-steps__flex-row':'fui-steps__flex-col',direction==='row'?'fui-steps__nw-col':'fui-steps__nw-row']"
			v-for="(item,index) in items" :key="index" @tap.stop="handleClick(index)">
			<view class="fui-steps__node-box"
				:class="[direction==='row'?'fui-steps__flex-row':'fui-steps__flex-col',direction==='row'?'':'fui-steps__node-weex']"
				:style="getStyles">
				<view class="fui-steps__line"
					:class="['fui-steps__line-'+direction+(lineBold?'_bold':''),index<=current && index!==0 && !getColor(index,current,true)?'fui-steps__background':'']"
					:style="{background:index===0?'transparent':(index<=current?getColor(index,current,true):nodeColor)}"
					v-if="direction==='row'"></view>
				<view class="fui-steps__node"
					:class="{'fui-steps__node-size':direction!='row' || (direction==='row' && !lineThrough)}">
					<text class="fui-steps__node-text"
						:class="{'fui-steps__background':index<=current && !getActiveColor,'fui-steps__border':index<=current && !getActiveColor}"
						v-if="item[textKey] && !(isMark && index==current)"
						:style="{background:index<=current?getActiveColor:'#fff',borderColor:index<=current?getActiveColor:nodeColor,color:index<=current?'#fff':color}">{{item[textKey]}}</text>
					<view class="fui-steps__checkbox"
						:class="{'fui-steps__background':!getActiveColor && !processColor}"
						:style="{background:processColor || getActiveColor}" v-if="isMark && index==current">
						<template v-if="processStatus==='fail'">
							<view class="fui-steps__ia-fail"></view>
							<view class="fui-steps__ib-fail"></view>
						</template>
						<view class="fui-steps__ic-waiting" v-else-if="processStatus==='wait'"></view>
						<view class="fui-steps__checkmark" v-else></view>
					</view>
					<view class="fui-steps__node-dot"
						:class="{'fui-steps__background':index<=current && !getActiveColor}"
						:style="{background:index<=current?getActiveColor:nodeColor}"
						v-if="!item[textKey] && !item[srcKey] && !(isMark && index==current)">
					</view>
					<image :src="index<=current?(item[activeSrcKey] || item[srcKey]):item[srcKey]" mode="widthFix"
						class="fui-steps__node-icon" v-if="!item[textKey] && item[srcKey] && !(isMark && index==current)"
						:style="{borderRadius:radius || 0}"></image>
				</view>
				<view class="fui-steps__line"
					:class="['fui-steps__line-'+direction+(lineBold?'_bold':''),index!==items.length-1 && !getColor(index,current,true,true)  && (index<current || (index==current && isWait && direction==='row' && !processColor))?'fui-steps__background':'']"
					:style="{background:index===items.length-1?'transparent':((index<current) || (index==current && isWait && direction==='row')?getColor(index,current,true,true):nodeColor)}">
				</view>
			</view>
			<view class="fui-steps__content"
				:class="[direction==='row'?'fui-steps__content-row':'fui-steps__content-col']"
				:style="{paddingBottom:index===items.length-1 || direction==='row'? '0rpx':(itemGap+'rpx'),paddingLeft:direction==='row'?'20rpx':(isNvue?`${height+24}rpx`:'24rpx')}">
				<text class="fui-steps__title"
					:class="{'fui-steps__text-row':direction==='row','fui-steps__color':(index<current && !getActiveColor) || (index===current && !processColor && !getActiveColor)}"
					v-if="item[titleKey]"
					:style="{color:index<=current?getColor(index,current):color,fontSize:size+'rpx',fontWeight:fontWeight}">{{item[titleKey]}}</text>
				<text class="fui-steps__descr"
					:class="{'fui-steps__text-row':direction==='row','fui-steps__color':(index<current && !getActiveColor) || (index===current && !processColor && !getActiveColor)}"
					v-if="item[descrKey]"
					:style="{color:index<=current?getColor(index,current):descrColor,fontSize:descrSize+'rpx'}">{{item[descrKey]}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "fui-steps",
		emits: ['click'],
		props: {
			items: {
				type: Array,
				default () {
					return []
				}
			},
			titleKey: {
				type: String,
				default: 'title'
			},
			descrKey: {
				type: String,
				default: 'descr'
			},
			textKey: {
				type: String,
				default: 'text'
			},
			srcKey: {
				type: String,
				default: 'src'
			},
			activeSrcKey: {
				type: String,
				default: 'activeSrc'
			},
			current: {
				type: [Number, String],
				default: 0
			},
			//row/column
			direction: {
				type: String,
				default: 'row'
			},
			padding: {
				type: Array,
				default () {
					return []
				}
			},
			background: {
				type: String,
				default: 'transparent'
			},
			height: {
				type: [Number, String],
				default: 50
			},
			nodeColor: {
				type: String,
				default: '#ccc'
			},
			color: {
				type: String,
				default: '#181818'
			},
			size: {
				type: [Number, String],
				default: 32
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			descrColor: {
				type: String,
				default: '#B2B2B2'
			},
			descrSize: {
				type: [Number, String],
				default: 24
			},
			activeColor: {
				type: String,
				default: ''
			},
			//V1.9.8+ 设置当前步骤的状态 wait /  fail / success
			processStatus: {
				type: String,
				default: ''
			},
			//V1.9.8+ 设置当前步骤的状态 颜色
			processColor: {
				type: String,
				default: ''
			},
			radius: {
				type: String,
				default: '0rpx'
			},
			//完成到当前步骤时是否需要对号标识
			isMark: {
				type: Boolean,
				default: true
			},
			isWait: {
				type: Boolean,
				default: false
			},
			//步骤线条是否加粗 V1.9.8+
			lineBold: {
				type: Boolean,
				default: false
			},
			//V2.1.0+ item项之间间隔，仅纵向有效
			itemGap: {
				type: [Number, String],
				default: 64
			},
			//V2.1.0+ 当默认节点为小圆点时线条是否贯穿，仅横向有效
			lineThrough: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			getStyles() {
				let styles = `height:${this.height}rpx`;
				if (this.direction === 'column') {
					styles = `width:${this.height}rpx`;
				}
				return styles
			},
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
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				isNvue
			}
		},
		methods: {
			getColor(index, current, isLine, isRight) {
				let color = this.getActiveColor
				if (index === current || (index === current - 1 && !this.isWait && isLine && isRight)) {
					color = this.processColor || color
				}
				return color;
			},
			handleClick(index) {
				this.$emit('click', {
					index: index,
					...this.items[index]
				})
			}
		}
	}
</script>

<style scoped>
	.fui-steps__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
	}

	.fui-steps__flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		/* #ifdef APP-NVUE */
		align-items: flex-start !important;
		/* #endif */
	}

	.fui-steps__node-wrap {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
	}

	.fui-steps__nw-col {
		flex: 1;
	}

	.fui-steps__flex-row {
		flex-direction: row;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
	}

	.fui-steps__flex-col {
		flex-direction: column;
	}

	/* #ifdef APP-NVUE */
	.fui-steps__nw-row {
		align-items: flex-start;
	}

	/* #endif */

	.fui-steps__line {
		/* #ifndef APP-NVUE */
		transform-origin: center;
		/* #endif */
		flex: 1;
	}

	.fui-steps__line-row {
		/* #ifdef APP-NVUE */
		height: 0.5px;
		/* #endif */

		/* #ifndef APP-NVUE */
		height: 1px;
		transform: scaleY(.5) translateZ(0);
		/* #endif */
	}

	.fui-steps__line-row_bold {
		height: 1px;
	}

	.fui-steps__line-column {
		/* #ifdef APP-NVUE */
		width: 0.5px;
		/* #endif */

		/* #ifndef APP-NVUE */
		width: 1px;
		transform: scaleX(.5) translateZ(0);
		/* #endif */
	}

	.fui-steps__line-column_bold {
		width: 1px;
	}

	.fui-steps__node-box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		overflow: hidden;
	}

	/* #ifdef APP-NVUE */
	.fui-steps__node-weex {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
	}

	/* #endif */

	.fui-steps__node {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.fui-steps__node-size {
		width: 44rpx;
		height: 44rpx;
	}

	.fui-steps__node-text {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		border-radius: 50%;
		/* #endif */
		width: 44rpx;
		height: 44rpx;
		/* #ifdef APP-NVUE */
		border-radius: 24rpx;
		line-height: 44rpx;
		/* #endif */
		background-color: #fff;
		border-style: solid;
		border-width: 1rpx;
		font-size: 28rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: normal;
		overflow: hidden;
	}

	.fui-steps__node-icon {
		width: 44rpx;
		height: 44rpx;
		/* #ifndef APP-NVUE */
		display: block;
		flex-shrink: 0;
		/* #endif */
	}

	.fui-steps__node-dot {
		width: 9px;
		height: 9px;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 9px;
		/* #endif */
		background-color: #ccc;
	}

	.fui-steps__content {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: column;
	}

	.fui-steps__content-row {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		word-break: break-all;
		/* #endif */
		padding: 12rpx 20rpx 0;
		align-items: center;
		overflow: hidden;
	}

	.fui-steps__content-col {
		padding-left: 24rpx;
		padding-bottom: 64rpx;
	}

	.fui-steps__title,
	.fui-steps__descr {
		/* #ifndef APP-NVUE */
		display: block;
		word-break: break-all;
		/* #endif */
		padding-bottom: 8rpx;
		font-weight: normal;
	}

	.fui-steps__text-row {
		text-align: center;
	}

	.fui-steps__checkbox {
		width: 44rpx;
		height: 44rpx;
		/* #ifdef APP-NVUE */
		border-radius: 44rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: inline-flex;
		box-sizing: border-box;
		border-radius: 50%;
		vertical-align: top;
		flex-shrink: 0;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;

	}

	.fui-steps__checkmark {
		width: 22rpx;
		height: 44rpx;
		border-bottom-style: solid;
		border-bottom-width: 3px;
		border-bottom-color: #FFFFFF;
		border-right-style: solid;
		border-right-width: 3px;
		border-right-color: #FFFFFF;
		transform: rotate(45deg) scale(0.5);
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		transform: rotate(45deg) scale(0.5) translateZ(0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(45deg) scale(0.5);
		/* #endif */
		transform-origin: 54% 48%;
	}

	/* #ifndef APP-NVUE */
	.fui-steps__color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-steps__border {
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-steps__background {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	.fui-steps__ia-fail {
		width: 48rpx;
		height: 3px;
		transform: rotate(45deg) scale(0.5);
		background: #FFFFFF;
	}

	.fui-steps__ib-fail {
		width: 48rpx;
		height: 3px;
		margin-top: -3px;
		transform: rotate(-45deg) scale(0.5);
		background: #FFFFFF;
	}

	.fui-steps__ic-waiting {
		height: 32rpx;
		width: 32rpx;
		border-style: solid;
		border-bottom-width: 3px;
		border-left-width: 3px;
		border-top-width: 0;
		border-right-width: 0;
		border-color: #fff;
		margin-left: 6rpx;
		margin-top: -6rpx;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		transform: scale(.5);
	}
</style>