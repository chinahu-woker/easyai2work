<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11   27，营业执照号：  91  440605MA556 H 1 K     X     H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-form__item-wrap"
		:style="{background:background,marginTop:marginTop+'rpx',marginBottom:marginBottom+'rpx',borderRadius:radius}">
		<view class="fui-form__item-outer" :class="{'fui-form__highlight':highlight}"
			:style="{paddingTop:padding[0] || 0,paddingBottom:padding[2] || padding[0] || 0}" @tap="handleClick">
			<view class="fui-form__wrap-inner"
				:style="{paddingRight:padding[1] || 0,paddingLeft:padding[3] || padding[1] || 0}">
				<!-- #ifdef APP-NVUE -->
				<view class="fui-form__asterisk" :style="{left:getAkPosi}" v-if="asterisk">
					<text :style="{color:asteriskColor || akColor || dangerColor}"
						class="fui-form__asterisk-text">*</text>
				</view>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<view class="fui-form__asterisk" v-if="asterisk"
					:style="{color:asteriskColor || akColor || dangerColor,left:getAkPosi}">*</view>
				<!-- #endif -->
				<text class="fui-form__item-sizing"
					:style="{width:getLabelWidth,fontSize:getLabelSize,color:labelColor || lColor || '#333',paddingRight:getLabelRight,textAlign:getLabelAlign,fontWeight:getLabelWeight}"
					v-if="label">{{label}}</text>
				<view class="fui-form__item-content">
					<slot></slot>
				</view>
				<slot name="right"></slot>
				<view class="fui-form__item-arrow" v-if="arrow" :style="{'border-color':arrowColor}">
				</view>
			</view>
			<view v-if="bottomBorder" :style="{background:borderColor,left:left+'rpx',right:right+'rpx'}"
				class="fui-form__item-bottom"></view>
		</view>
		<slot name="vertical"></slot>
		<view class="fui-form__item-error"
			:class="{'fui-form__error-absolute':getErrorPosition==1,'fui-form__error-right':getErrorAlign=='right','fui-form__error-active':errorMsg && errorMsg!==true}"
			v-if="getErrorPosition==1 && showError && prop"
			:style="{paddingLeft:getErrorLeft,paddingRight:padding[1] || '32rpx'}">
			<text class="fui-form__error-text" :class="{'fui-form__error-right':getErrorAlign=='right'}"
				:style="{color:asteriskColor || akColor || dangerColor}">{{errorMsg}}</text>
		</view>
		<view class="fui-form__item-error"
			:class="{'fui-form__error-relative':getErrorPosition==2,'fui-form__error-right':getErrorAlign=='right'}"
			v-if="getErrorPosition==2 && errorMsg && errorMsg!==true && showError && prop"
			:style="{paddingLeft:getErrorLeft,paddingRight:padding[1] || '32rpx'}">
			<text class="fui-form__error-text" :class="{'fui-form__error-right':getErrorAlign=='right'}"
				:style="{color:asteriskColor || akColor || dangerColor}">{{errorMsg}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'fui-form-item',
		emits: ['click'],
		inject: {
			form: {
				value: "form",
				default: null
			}
		},
		props: {
			//padding值，上、右、下、左
			padding: {
				type: Array,
				default () {
					return ['30rpx', '32rpx']
				}
			},
			//margin-top 单位rpx
			marginTop: {
				type: [Number, String],
				default: 0
			},
			//margin-bottom 单位rpx
			marginBottom: {
				type: [Number, String],
				default: 0
			},
			//标签文本
			label: {
				type: String,
				default: ''
			},
			//标题字体大小 默认使用全局设置值
			labelSize: {
				type: [Number, String],
				default: 0
			},
			labelColor: {
				type: String,
				default: ''
			},
			//label宽度 rpx 默认使用全局设置值
			labelWidth: {
				type: [Number, String],
				default: 0
			},
			//默认使用全局设置值
			labelRight: {
				type: [Number, String],
				default: 0
			},
			//label 对齐方式：left，right
			labelAlign: {
				type: String,
				default: ''
			},
			labelWeight: {
				type: [Number, String],
				default: 0
			},
			//是否显示必填的红色星号
			asterisk: {
				type: Boolean,
				default: false
			},
			asteriskColor: {
				type: String,
				default: ''
			},
			//left,right
			asteriskPosition: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: '#fff'
			},
			highlight: {
				type: Boolean,
				default: false
			},
			arrow: {
				type: Boolean,
				default: false
			},
			arrowColor: {
				type: String,
				default: '#B2B2B2'
			},
			bottomBorder: {
				type: Boolean,
				default: true
			},
			borderColor: {
				type: String,
				default: '#EEEEEE'
			},
			//下边框left值，单位rpx
			left: {
				type: [Number, String],
				default: 32
			},
			//下边框right值，单位rpx
			right: {
				type: [Number, String],
				default: 0
			},
			radius: {
				type: String,
				default: '0'
			},
			param: {
				type: [Number, String],
				default: 0
			},
			//v2.1.0+ 表单域 model 字段，在使用校验时该属性是必填的
			prop: {
				type: String,
				default: ''
			},
			//v2.1.0+ 1-absolute 2-relative
			errorPosition: {
				type: [Number, String],
				default: 0
			},
			//v2.1.0+ left/center/right
			errorAlign: {
				type: String,
				default: ''
			},
			//V2.2.0 表单验证规则，部分平台不支持嵌套传入函数，请使用setRules方法传入
			rules: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		computed: {
			//优先级：form-item组件props > form组件props > 全局属性值
			getLabelSize() {
				const labelSize = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.labelSize) || 32
				return `${this.labelSize || this.lSize || labelSize}rpx`
			},
			getLabelWidth() {
				const labelWidth = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.labelWidth) || 160
				return `${this.labelWidth || this.lWidth || labelWidth}rpx`
			},
			getLabelRight() {
				const labelRight = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.labelRight) || 30
				return `${this.labelRight || labelRight}rpx`
			},
			getLabelAlign() {
				const labelAlign = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.labelAlign) || 'left'
				return this.labelAlign || this.lAlign || labelAlign
			},
			getLabelWeight() {
				const global = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.labelWeight) || 400
				return this.labelWeight || this.lWeight || global
			},
			getAkPosi() {
				const akPosi = (uni.$fui && uni.$fui.fuiFormItem && uni.$fui.fuiFormItem.asteriskPosition) || 'left'
				const position = this.asteriskPosition || this.akPosi || akPosi
				const lWidth = this.getLabelWidth.replace('rpx', '')
				const lRight = this.getLabelRight.replace('rpx', '')
				const pr = this.padding[1]
				const pdr = pr ? pr.replace('rpx', '').replace('px', '') : 0;
				return position === 'right' ? `${Number(lWidth) + Number(pdr || 0) - Number(lRight || 0)}rpx` : '12rpx'
			},
			dangerColor() {
				const app = uni && uni.$fui && uni.$fui.color;
				return (app && app.danger) || '#FF2B2B';
			},
			getErrorLeft() {
				const align = this.getErrorAlign
				let left = '32rpx'
				if (align === 'center') {
					const lWidth = this.getLabelWidth.replace('rpx', '').replace('px', '')
					const pr = this.padding[1]
					const pdr = pr ? pr.replace('rpx', '').replace('px', '') : 0;
					left = (Number(lWidth) + Number(pdr)) + 'rpx'
				}
				return left;
			},
			getErrorPosition() {
				return this.errorPosition || this.ePosition
			},
			getErrorAlign() {
				return this.errorAlign || this.eAlign
			}
		},
		data() {
			return {
				lSize: 0,
				lColor: '',
				lWidth: 0,
				lAlign: '',
				lWeight: 0,
				akColor: '',
				akPosi: '',
				ePosition: 1,
				eAlign: 'left',
				errorMsg: '',
				//此参数由fui-form中获取
				showError: false,
				//由父组件赋值
				itemValue: '',
				watchKey: '',
				//是否实时校验
				isRealTime: false,
				//item项自己的rules
				formItemRules: null
			}
		},
		watch: {
			prop: {
				handler(val) {
					setTimeout(() => {
						const key = `form.model.${val || 'fui_unknown'}`
						if (val && val !== true && this.form && key != this.watchKey) {
							this.watchKey = key
							this.$watch(key, (val) => {
								if (this.isRealTime && this.prop && this.form) {
									this.form.realTimeValidator(this.prop).then(res => {
										if (res.isPassed) {
											this.errorMsg = ''
										} else {
											this.errorMsg = res.errorMsg
										}
									}).catch(err => {
										console.log(err.errorMsg)
									})
								} else {
									if (this.showError && val != this.itemValue) {
										this.errorMsg = ''
									}
								}
							})
						}
					}, 50)
				},
				immediate: true
			}
		},
		created() {
			this.initParam();
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.uninstall()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.uninstall()
		},
		// #endif
		methods: {
			//备用方案，如果watch无法使用则使用赋值方式
			setValue(val) {
				if (this.showError && val != this.itemValue) {
					this.errorMsg = ''
				}
			},
			initParam(isReset) {
				//后续做功能扩展，如错误消息提示
				if (this.form) {
					!isReset && this.form.children.push(this)
					//主要用于动态表单初始化值
					this.isRealTime = this.form.isRealTime;
					this.showError = this.form.show ? false : true;
					this.lSize = this.form.labelSize;
					this.lColor = this.form.labelColor;
					this.lWidth = this.form.labelWidth;
					this.lWeight = this.form.labelWeight;
					this.lAlign = this.form.labelAlign;
					this.akColor = this.form.asteriskColor;
					this.akPosi = this.form.asteriskPosition;
					this.ePosition = this.form.errorPosition;
					this.eAlign = this.form.errorAlign;
				}
			},
			//是否开启实时校验
			switchRealTimeValidator(isOpen) {
				this.isRealTime = isOpen;
			},
			// Form组件获取当前FormItem 项 rules数据
			getRules() {
				//优先使用setRules 方法传入的rules值
				const rules = this.formItemRules || this.rules
				if (!rules.name && (rules.rule || rules.validator)) {
					rules['name'] = this.prop
				}
				//当未传入prop、rule 或 validator 则不校验
				return !rules.name ? null : rules
			},
			//设置校验规则
			setRules(rules) {
				this.formItemRules = rules
			},
			//设置校验规则，并合并或替换Form组件中该prop对应的rules【当页面调用Form组件校验方法传入rules时进行合并操作】
			setRulesMerge(rules) {
				this.formItemRules = rules || this.rules
				if (this.form) {
					const index = this.form.mergeRules.findIndex(e => e.name === rules.name || e.name === this.prop)
					const rule = this.getRules()
					if (!rule) return;
					if (index === -1) {
						this.form.mergeRules.push(rule)
					} else {
						this.form.mergeRules[index] = rule
					}
				}
			},
			/**
			 * 验证方法
			 * @param {any} value 值，不传则使用Form组件model中值
			 */
			validator(value) {
				const rules = this.getRules()
				return new Promise((resolve, reject) => {
					if (this.form && rules) {
						const model = {}
						let val = value;
						if (val === undefined || val === null) {
							val = this.form.model[rules.name] || null
						}
						model[rules.name] = val;
						this.form.realTimeValidator(rules.name, model, [rules]).then(res => {
							if (res.isPassed) {
								this.errorMsg = ''
							} else {
								this.errorMsg = res.errorMsg
							}
							resolve(res)
						}).catch(err => {
							reject(err)
							console.log(err.errorMsg)
						})
					} else {
						reject({
							isPassed: false,
							errorMsg: '未检查到Form组件或校验规则rules数据！'
						})
					}
				})
			},
			clearValidate() {
				this.errorMsg = ''
			},
			uninstall() {
				this.form && this.form.uninstall(this)
			},
			handleClick() {
				this.$emit('click', {
					param: this.param
				});
			}
		}
	}
</script>

<style scoped>
	.fui-form__item-wrap,
	.fui-form__item-outer {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: column;
	}


	.fui-form__wrap-inner {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		align-items: center;
		position: relative;
	}

	.fui-form__highlight:active {
		/* #ifdef APP-NVUE */
		background-color: rgba(0, 0, 0, 0.2) !important;
		/* #endif */

		/* #ifndef APP-NVUE */
		background-color: var(--fui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
		/* #endif */
	}

	.fui-form__asterisk {
		position: absolute;
		left: 12rpx;
		/* #ifndef APP-NVUE */
		height: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		line-height: 1.15;
		/* #endif */
		/* #ifdef APP-NVUE */
		top: 28rpx;
		bottom: 28rpx;
		align-items: center;
		justify-content: center;
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-form__asterisk-text {
		font-size: 32rpx;
		height: 32rpx;
	}

	/* #endif */

	.fui-form__item-label {
		padding-right: 12rpx;
		/* #ifndef APP-NVUE */
		display: inline-block;
		flex-shrink: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-form__item-sizing {
		box-sizing: border-box;
	}

	/* #endif */

	.fui-form__item-content {
		flex: 1;
	}

	.fui-form__item-bottom {
		position: absolute;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 1px;
		-webkit-transform: scaleY(0.5) translateZ(0);
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 100%;
		z-index: 1;
		/* #endif */
	}

	.fui-form__item-arrow {
		height: 40rpx;
		width: 40rpx;
		border-width: 3px 3px 0 0;
		border-style: solid;
		transform: rotate(45deg) scale(0.5);
		/* #ifndef APP-NVUE */
		border-radius: 4rpx;
		flex-shrink: 0;
		margin-left: auto;
		box-sizing: border-box;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-top-right-radius: 3rpx;
		/* #endif */
		transform-origin: center center;
		margin-right: -5.8579rpx;
	}

	.fui-form__item-error {
		/* #ifndef APP-NVUE */
		width: 100%;
		z-index: 2;
		box-sizing: border-box;
		/* #endif */
		font-size: 24rpx;
		line-height: 32rpx;
	}

	.fui-form__error-relative {
		position: relative;
		padding-top: 4rpx;
		padding-bottom: 4rpx;
	}

	.fui-form__error-absolute {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		transform: translateY(-100%);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateY(-24rpx);
		/* #endif */
		opacity: 0;
		transition-property: transform, opacity;
		transition-duration: 0.3s;
	}

	.fui-form__error-active {
		opacity: 1;
		transform: translateY(0);
	}

	.fui-form__error-text {
		font-size: 24rpx;
	}

	.fui-form__error-right {
		text-align: right;
	}
</style>