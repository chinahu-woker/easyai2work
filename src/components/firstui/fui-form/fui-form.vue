<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 12 7，营业执照号： 9  1 4 4 0 60 5M A55 6     H1 KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-form__wrap"
		:style="{paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0}">
		<slot></slot>
		<view class="fui-form__msg-wrap"
			:style="{top:top+'px',left:left+'rpx',right:right+'rpx',background:getBgColor,borderRadius:radius+'rpx'}"
			v-if="show" :class="{'fui-form__msg-bg':!getBgColor,'fui-form__msg-show':errorMsg}"><text
				class="fui-form__text" :style="{fontSize:size+'rpx',color:color}">{{errorMsg}}</text></view>
		<view class="fui-form__mask" v-if="disabled"></view>
	</view>
</template>

<script>
	import form from './fui-validator.js'
	export default {
		name: "fui-form",
		props: {
			model: {
				type: Object,
				default () {
					return {};
				}
			},
			//表单padding值（上，右，下，左），同css顺序
			padding: {
				type: Array,
				default () {
					return []
				}
			},
			//是否显示校验错误信息，设置false时，则触发formItem校验
			show: {
				type: Boolean,
				default: true
			},
			//是否禁用该表单内的所有组件,透明遮罩层
			disabled: {
				type: Boolean,
				default: false
			},
			//提示框top值 px
			// #ifdef H5
			top: {
				type: [Number, String],
				default: 44
			},
			// #endif
			// #ifndef H5
			top: {
				type: [Number, String],
				default: 0
			},
			// #endif
			left: {
				type: [Number, String],
				default: 24
			},
			right: {
				type: [Number, String],
				default: 24
			},
			//错误提示框背景色
			background: {
				type: String,
				default: ''
			},
			//错误提示字体大小
			size: {
				type: [Number, String],
				default: 28
			},
			//错误提示字体颜色
			color: {
				type: String,
				default: '#fff'
			},
			//错误提示框圆角值
			radius: {
				type: [Number, String],
				default: 16
			},
			//错误消息显示时间 ms
			duration: {
				type: Number,
				default: 2000
			},
			//form-item标题字体大小 默认使用全局设置值
			labelSize: {
				type: [Number, String],
				default: 0
			},
			labelColor: {
				type: String,
				default: ''
			},
			//form-item label宽度,单位rpx 默认使用全局设置值
			labelWidth: {
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
			// form-item 必填项星号颜色
			asteriskColor: {
				type: String,
				default: ''
			},
			//left,right
			asteriskPosition: {
				type: String,
				default: ''
			},
			//v2.1.0+ 1-absolute 2-relative
			errorPosition: {
				type: [Number, String],
				default: 1
			},
			//v2.1.0+ left/center/right
			errorAlign: {
				type: String,
				default: 'center'
			}
		},
		provide() {
			return {
				form: this
			}
		},
		computed: {
			getBgColor() {
				let color = this.background;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.danger) || '#FF2B2B';
				}
				// #endif
				return color;
			}
		},
		watch: {
			/* // 备用方案，暂时未启用
			model: {
				handler: function(vals, oldVal) {
					if (this.children && vals && !this.show) {
						this.children.forEach(item => {
							if (item.prop && item.prop !== true) {
								item.setValue(vals[item] || '')
							}
						})
					}
				},
				deep: true
			},
			*/
			show(val) {
				if (this.children && this.children.length > 0) {
					this.children.forEach(item => {
						item.showError = val ? false : true
					})
				}
			}
		},
		data() {
			return {
				errorMsg: '',
				timer: null,
				rules: [],
				mergeRules: [],
				isRealTime: false
			};
		},
		created() {
			this.children = []
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.clearTimer()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.clearTimer()
		},
		// #endif
		methods: {
			clearTimer() {
				this.children = null
				clearTimeout(this.timer)
				this.timer = null;
			},
			getFormItemRules() {
				let rules = []
				if (this.children && this.children.length > 0) {
					this.children.forEach(child => {
						let rule = child.getRules()
						rule && rules.push(rule)
					})
				}
				return rules;
			},
			getMergeRules(rules) {
				if (this.mergeRules.length === 0) return rules;
				let formRules = [...rules]
				//合并并替换当前rules数据
				this.mergeRules.forEach(item => {
					const index = rules.findIndex(e => e.name === item.name)
					if (index === -1) {
						formRules.push(item)
					} else {
						formRules[index] = item;
					}
				})
				return formRules;
			},
			/**
			 * 校验方法
			 * @param {Object} model 表单数据对象
			 * @param {Array} rules 表单验证规则
			 * @param {Boolean} checkAll 校验所有元素，结合FormItem组件显示校验提示时必须传true
			 */
			validator(model, rules, checkAll = false) {
				model = model || this.model
				rules = rules || []
				return new Promise((resolve, reject) => {
					try {
						if (rules.length === 0) {
							rules = this.getFormItemRules()
						} else {
							rules = this.getMergeRules(rules)
						}
						let res = form.validator(model, rules, checkAll);
						if (!res.isPassed) {
							let errors = res.errorMsg;
							if (this.show) {
								this.clearTimer()
								if (checkAll) {
									errors = errors[0].msg
								}
								this.errorMsg = errors;
								this.timer = setTimeout(() => {
									this.errorMsg = ''
								}, this.duration)
							} else {
								if (checkAll && this.children && this.children.length > 0) {
									//formItem 显示提示
									this.children.forEach(item => {
										const index = errors.findIndex(err => err.name === item.prop)
										if (item.prop && item.prop !== true && ~index) {
											item.errorMsg = errors[index].msg
											item.itemValue = this.model[item.prop]
										}
									})
								}
							}
						}
						resolve(res)
					} catch (e) {
						reject({
							isPassed: false,
							errorMsg: '校验出错，请检查传入的数据格式是否有误！'
						})
					}
				})
			},
			/**
			 * 验证具体的某个字段
			 * @param {Array<string> ｜ String} props 字段key
			 * @param {Object} model 表单数据对象，传null则使用属性中model值
			 * @param {Array} rules 表单验证规则，当传null 或空数组时使用FormItem组件内rules
			 */
			validateField(props, model, rules) {
				if (!rules || rules.length === 0) {
					rules = this.getFormItemRules()
				} else {
					rules = this.getMergeRules(rules)
				}
				const isString = typeof props === 'string';
				const formRules = rules.filter(item => props === item.name || (!isString && props
					.indexOf(item.name) !== -1));
				model = model || this.model
				return this.validator(model, formRules, true)
			},
			//v2.1.0+ 通知formItem组件重置props参数
			resetFormItemParam() {
				if (this.children && this.children.length > 0) {
					this.children.forEach(item => {
						item.initParam(true)
					})
				}
			},
			//v2.1.0+ 通知formItem组件开启实时校验
			switchRealTimeValidator(isOpen, rules = []) {
				this.isRealTime = isOpen;
				if (isOpen) {
					if (!rules || rules.length === 0) {
						rules = this.getFormItemRules()
					} else {
						rules = this.getMergeRules(rules)
					}
					this.rules = rules || []
				}
				if (this.children && this.children.length > 0) {
					this.children.forEach(item => {
						item.switchRealTimeValidator(isOpen)
					})
				}
			},
			//内部方法，提供给FormItem组件使用
			realTimeValidator(prop, model, rules) {
				return new Promise((resolve, reject) => {
					try {
						let res = form.validator(model || this.model, rules || this.rules, true);
						if (!res.isPassed) {
							//formItem 显示提示
							let errors = res.errorMsg;
							const index = errors.findIndex(err => err.name === prop)
							if (~index) {
								res.errorMsg = errors[index].msg
							} else {
								res.isPassed = true
								res.errorMsg = ''
							}
						}
						resolve(res)
					} catch (e) {
						reject({
							isPassed: false,
							errorMsg: '校验出错，请检查传入的数据格式是否有误！'
						})
					}
				})
			},
			clearValidate(props = []) {
				let arr = props;
				arr = !arr ? [] : arr
				if (typeof props === 'string') {
					arr = [props]
				}
				if (this.children && this.children.length > 0) {
					//清除指定字段的表单验证信息
					if (arr && arr.length > 0) {
						this.children.forEach(item => {
							if (item.prop && ~arr.indexOf(item.prop)) {
								item.errorMsg = ''
							}
						})
					} else {
						//清除所有字段的表单验证信息
						this.children.forEach(item => {
							item.errorMsg = ''
						})
					}
				}
			},
			// 移除表单项
			uninstall(instance) {
				if (this.children && this.children.length > 0) {
					const index = this.children.findIndex(item => item === instance)
					if (index !== -1) {
						this.children.splice(index, 1)
					}
					const rules = instance.getRules() || {}
					const prop = instance.prop || rules.name || ''
					const idx = this.mergeRules.findIndex(ru => ru.name === prop)
					if (idx !== -1) {
						this.mergeRules.splice(idx, 1)
					}
				}
			}
		}
	}
</script>

<style scoped>
	.fui-form__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		position: relative;
	}

	.fui-form__msg-wrap {
		padding: 24rpx;
		position: fixed;
		z-index: 900;
		text-align: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		word-break: break-all;
		/* #endif */
		align-items: center;
		justify-content: center;
		opacity: 0;

		/* #ifdef APP-NVUE */
		transform: translateY(-100%);
		transition-property: transform, opacity;
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translate3d(0, -100%, 0);
		visibility: hidden;
		transition-property: all;
		/* #endif */
		transition-duration: 0.25s;
		transition-delay: 0s;
		transition-timing-function: ease-in-out;
	}

	/* #ifndef APP-NVUE */
	.fui-form__msg-bg {
		background: var(--fui-color-danger, #FF2B2B) !important;
	}

	/* #endif */

	.fui-form__text {
		text-align: center;
	}

	.fui-form__msg-show {
		/* #ifndef APP-NVUE */
		visibility: visible;
		transform: translate3d(0, 0, 0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateY(0);
		/* #endif */
		opacity: 1;
	}

	.fui-form__mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0);
		z-index: 99;
	}
</style>