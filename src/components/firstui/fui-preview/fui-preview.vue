<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11 2  7，营业执照号：     91  4406 0    5 MA556   H1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-preview__wrap" :class="{'fui-preview__unlined':!isBorder,'fui-preview__background':!background}"
		:style="{'border-top-color':borderColor,'border-bottom-color':borderColor,marginTop:marginTop+'rpx',marginBottom:marginBottom+'rpx',background:background}">
		<view class="fui-preview__hd" :style="{paddingLeft:padding+'rpx',paddingRight:padding+'rpx'}"
			v-if="pvd[label] || pvd[value]">
			<view class="fui-preview__item">
				<text class="fui-preview__label" :class="{'fui-preview__gray':!labelColor}"
					:style="{color:labelColor,fontSize:hdLabelSize+'rpx',width:hdLabelWidth>0?hdLabelWidth+'rpx':'auto',marginRight:labelRight+'rpx'}">{{pvd[label] || ''}}</text>
				<text class="fui-preview__value-hd" :class="{'fui-preview__color':!hdValColor}"
					:style="{color:hdValColor,fontSize:hdValSize+'rpx',textAlign:bdAlign}">{{pvd[value] || ''}}</text>
			</view>
			<view :style="{background:borderColor,left:hdLeft+'rpx',right:hdRight+'rpx'}" class="fui-preview__border"
				:class="{'fui-preview__border-color':!borderColor}"></view>
		</view>
		<view class="fui-preview__bd" v-if="pvd[list] && pvd[list].length>0"
			:style="{paddingLeft:padding+'rpx',paddingRight:padding+'rpx'}">
			<view class="fui-preview__item" v-for="(item,index) in pvd[list]" :key="index">
				<text class="fui-preview__label"
					:class="[!labelColor && !item[lColor]?'fui-preview__gray':'','fui-preview__label-'+labelAlign]"
					:style="{color:item[lColor] || labelColor,fontSize:bdSize+'rpx',width:labelWidth>0?labelWidth+'rpx':'auto',marginRight:labelRight+'rpx'}">{{item[label]}}</text>
				<!-- #ifndef APP-NVUE -->
				<text class="fui-preview__value" :class="{'fui-preview__color':!bdColor && !item[valueColor]}"
					:style="{color:item[valueColor] || bdColor,fontSize:bdSize+'rpx',textAlign:bdAlign}"
					@tap="itemClick(index)">{{item[value]}}</text>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view class="fui-preview__value-wrap">
					<text class="fui-preview__value" :class="{'fui-preview__color':!bdColor && !item[valueColor]}"
						:style="{color:item[valueColor] || bdColor,fontSize:bdSize+'rpx',textAlign:bdAlign}"
						@tap="itemClick(index)">{{item[value]}}</text>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<slot></slot>
		<view class="fui-preview__ft" :style="{'border-top-color':borderColor}"
			v-if="pvd[buttons] && pvd[buttons].length>0">
			<view :style="{'border-right-color':idx!==pvd[buttons].length-1?borderColor : 'transparent'}"
				:class="[highlight && !btn[disabled]?'fui-preview__hover-weex':'',idx!==pvd[buttons].length-1?'fui-preview__btn-def':'fui-preview__btn']"
				:hover-class="highlight && !btn[disabled]?'fui-preview_hover':''" :hover-stay-time="150"
				v-for="(btn,idx) in pvd[buttons]" :key="idx" @tap="handleClick(idx)">
				<text :style="{fontSize:btnSize+'rpx',color:btn[color] || '#465CFF'}"
					:class="{'fui-preview__link':!btn[color],'fui-preview__button-disable':btn[disabled]}">{{btn[text]}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "fui-preview",
		emits: ['click', 'valueClick'],
		props: {
			previewData: {
				type: Object,
				default () {
					return {}
				}
			},
			fields: {
				type: Object,
				default () {
					return {}
				}
			},
			// #ifdef APP-NVUE
			background: {
				type: String,
				default: '#fff'
			},
			// #endif
			// #ifndef APP-NVUE
			background: {
				type: String,
				default: ''
			},
			// #endif
			marginTop: {
				type: [Number, String],
				default: 0
			},
			marginBottom: {
				type: [Number, String],
				default: 0
			},
			//左右间距
			padding: {
				type: [Number, String],
				default: 32
			},
			labelWidth: {
				type: [Number, String],
				default: 0
			},
			//left / right / justify
			labelAlign: {
				type: String,
				default: 'left'
			},
			// #ifdef APP-NVUE
			labelColor: {
				type: String,
				default: '#7F7F7F'
			},
			// #endif
			// #ifndef APP-NVUE
			labelColor: {
				type: String,
				default: ''
			},
			// #endif
			//V1.9.9+
			labelRight: {
				type: [Number, String],
				default: 32
			},
			//V1.9.9+
			hdLabelWidth: {
				type: [Number, String],
				default: 0
			},
			hdLabelSize: {
				type: [Number, String],
				default: 32
			},
			hdValSize: {
				type: [Number, String],
				default: 36
			},
			// #ifdef APP-NVUE
			hdValColor: {
				type: String,
				default: '#181818'
			},
			// #endif
			// #ifndef APP-NVUE
			hdValColor: {
				type: String,
				default: ''
			},
			// #endif
			bdSize: {
				type: [Number, String],
				default: 28
			},
			// #ifdef APP-NVUE
			bdColor: {
				type: String,
				default: '#181818'
			},
			// #endif
			// #ifndef APP-NVUE
			bdColor: {
				type: String,
				default: ''
			},
			// #endif
			//V1.9.9+ 内容对齐方式：left、right
			bdAlign: {
				type: String,
				default: 'right'
			},
			btnSize: {
				type: [Number, String],
				default: 32
			},
			//按钮是否有点击效果
			highlight: {
				type: Boolean,
				default: true
			},
			hdLeft: {
				type: [Number, String],
				default: 32
			},
			hdRight: {
				type: [Number, String],
				default: 0
			},
			// #ifdef APP-NVUE
			borderColor: {
				type: String,
				default: '#eee'
			},
			// #endif
			// #ifndef APP-NVUE
			borderColor: {
				type: String,
				default: ''
			},
			// #endif
			//是否需要preview外层上下线条
			isBorder: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			previewData(val) {
				this.initData(val)
			},
			//未做深度监听
			fields(val) {
				this.handleFileds()
			}
		},
		created() {
			this.initData(this.previewData)
		},
		data() {
			return {
				pvd: {},
				label: 'label',
				value: 'value',
				list: 'list',
				lColor: 'labelColor',
				valueColor: 'valueColor',
				buttons: 'buttons',
				text: 'text',
				color: 'color',
				disabled: 'disabled'
			};
		},
		methods: {
			handleFileds() {
				if (this.fields && typeof this.fields === 'object') {
					this.label = this.fields.label || 'label';
					this.value = this.fields.value || 'value';
					this.list = this.fields.list || 'list';
					this.lColor = this.fields.labelColor || 'labelColor';
					this.valueColor = this.fields.valueColor || 'valueColor';
					this.buttons = this.fields.buttons || 'buttons';
					this.text = this.fields.text || 'text';
					this.color = this.fields.color || 'color';
					this.disabled = this.fields.disabled || 'disabled';
				}
			},
			initData(val) {
				this.handleFileds()
				val = val || {};
				val[this.list] = val[this.list] || [];
				val[this.buttons] = val[this.buttons] || [];
				this.pvd = val;
			},
			handleClick(idx) {
				let params = this.pvd[this.buttons][idx] || {}
				if (params.disabled) return;
				this.$emit('click', {
					index: idx,
					...params
				})
			},
			itemClick(index) {
				this.$emit('valueClick', {
					index,
					item: this.pvd[this.list][index]
				})
			},
			setValue(index, value) {
				const idx = Number(index)
				if (idx || idx === 0) {
					const data = JSON.parse(JSON.stringify(this.pvd))
					const item = data[this.list][idx]
					item[this.value] = value;
					this.pvd = data
				}
			}
		}
	}
</script>

<style scoped>
	.fui-preview__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		border-top-width: 0;
		border-bottom-width: 0;
		/* #endif */
		flex: 1;
		position: relative;
		overflow: hidden;

		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-preview__background {
		background: var(--fui-bg-color, #FFFFFF) !important;
	}

	/* #endif */
	.fui-preview__unlined {
		border-top-width: 0 !important;
		border-bottom-width: 0 !important;
	}

	/* #ifndef APP-NVUE */
	.fui-preview__wrap::before {
		top: 0;
		border-top: 1px solid var(--fui-color-border, #EEEEEE);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5)
	}

	.fui-preview__wrap::after {
		content: " ";
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
	}

	.fui-preview__wrap::before {
		content: " ";
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
	}

	.fui-preview__wrap::after {
		bottom: 0;
		border-bottom: 1px solid var(--fui-color-border, #EEEEEE);
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5)
	}

	.fui-preview__unlined::before {
		border-top-width: 0 !important;
		border-bottom-width: 0 !important;
	}

	.fui-preview__unlined::after {
		border-top-width: 0 !important;
		border-bottom-width: 0 !important;
	}

	/* #endif */
	.fui-preview__hd {
		position: relative;
		padding-top: 32rpx;
		padding-bottom: 32rpx;
		text-align: right;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		line-height: 56rpx;
	}

	.fui-preview__border {
		position: absolute;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		z-index: 1;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-preview__border-color {
		background: var(--fui-color-border, #EEEEEE) !important;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-preview__value-wrap {
		flex: 1;
	}

	/* #endif */
	.fui-preview__value {
		text-align: right;
		/* #ifndef APP-NVUE */
		flex: 1;
		display: block;
		word-break: break-all;
		word-wrap: break-word;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-preview__color {
		color: var(--fui-color-title, #181818) !important;
	}

	/* #endif */

	.fui-preview__value-hd {
		font-style: normal;
		font-size: 36rpx;
		flex: 1;
	}

	.fui-preview__bd {
		flex: 1;
		padding-top: 32rpx;
		padding-bottom: 32rpx;
		line-height: 48rpx;
		/* #ifndef APP-NVUE */
		box-sizing: border-box
			/* #endif */
	}


	.fui-preview__ft {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		position: relative;
		height: 100rpx;
		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: flex;
		border-top-width: 0;
		/* #endif */
		flex-direction: row;
	}

	/* #ifndef APP-NVUE */
	.fui-preview__ft::before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid var(--fui-color-border, #EEEEEE);
		transform-origin: 0 0;
		transform: scaleY(.5)
	}

	/* #endif */

	.fui-preview__item {
		padding: 8rpx 0;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		/* #ifdef APP-NVUE */
		align-items: flex-start;
		/* #endif */
	}

	.fui-preview__label {
		margin-right: 32rpx;
		/* #ifndef APP-NVUE */
		min-width: 112rpx;
		text-align: justify;
		flex-shrink: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-preview__label-right {
		text-align-last: right;
	}

	.fui-preview__label-justify {
		text-align-last: justify;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-preview__gray {
		color: var(--fui-color-subtitle, #7F7F7F) !important;
	}

	/* #endif */

	.fui-preview__btn,
	.fui-preview__btn-def {
		flex: 1;
		text-align: center;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-preview__btn-def {
		position: relative;
		/* #ifdef APP-NVUE */
		border-right-width: 0.5px;
		border-right-style: solid;
		/* #endif */
	}

	.fui-preview__link {
		/* #ifdef APP-NVUE */
		color: #465CFF !important;
		/* #endif */
		/* #ifndef APP-NVUE */
		color: var(--fui-color-link, #465CFF) !important;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-preview__btn-def::after {
		content: " ";
		position: absolute;
		right: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-right: 1px solid var(--fui-color-border, #eee);
		transform-origin: 100% 0;
		transform: scaleX(.5)
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-preview_hover {
		background-color: var(--fui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-preview__hover-weex:active {
		background-color: rgba(0, 0, 0, 0.2) !important;
	}
	/* #endif */

	.fui-preview__button-disable {
		opacity: .5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}
</style>