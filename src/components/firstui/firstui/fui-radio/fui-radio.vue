<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 9 144        06   05  MA 55 6H1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-radio__input"
		:class="{'fui-radio__disabled':disabled,'fui-radio__color':!getColor && val && (!isCheckMark || styleType==2),'fui-radio__active-bgcolor':!getColor && val && !isCheckMark && styleType==1}"
		:style="{background:getBackgroundColor(val,isCheckMark,styleType),borderColor:getBorderColor(val,isCheckMark,styleType),zoom:isNvue?1:scaleRatio,transform:`scale(${isNvue?scaleRatio:1})`,borderRadius:borderRadius}"
		@tap.stop="radioChange">
		<view class="fui-check__mark" :style="{borderBottomColor:checkMarkColor,borderRightColor:checkMarkColor}"
			v-if="val && styleType==1"></view>
		<view class="fui-check__mark-circle" :class="{'fui-radio__active-bgcolor':dotColor=='' || dotColor===true}"
			:style="{background:dotColor || getColor}" v-if="val && styleType==2">
		</view>
		<radio class="fui-radio__hidden" style="opacity: 0;position: absolute;" :color="getColor" :disabled="disabled"
			:value="getValue" :checked="val"></radio>
	</view>
</template>

<script>
	export default {
		name: "fui-radio",
		emits: ['change'],
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			checked: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			//radio选中背景颜色
			color: {
				type: String,
				default: ''
			},
			//radio未选中时边框颜色
			borderColor: {
				type: String,
				default: '#ccc'
			},
			// #ifdef APP-NVUE
			borderRadius: {
				type: String,
				default: '40rpx'
			},
			// #endif

			// #ifndef APP-NVUE
			borderRadius: {
				type: String,
				default: '50%'
			},
			// #endif

			//是否只展示对号，无边框背景
			isCheckMark: {
				type: Boolean,
				default: false
			},
			//对号颜色
			checkMarkColor: {
				type: String,
				default: '#fff'
			},
			dotColor: {
				type: String,
				default: ''
			},
			scaleRatio: {
				type: [Number, String],
				default: 1
			},
			styleType: {
				type: [Number, String],
				default: 1
			}
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.unInstall()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.unInstall()
		},
		// #endif
		created() {
			this.val = this.checked;
			this.group = this.getParent()
			if (this.group) {
				this.group.childrens.push(this);
				if (this.group.value) {
					this.val = this.value === this.group.value
				}
				// #ifdef VUE3
				if (this.group.modelValue) {
					this.val = this.value === this.group.modelValue
				}
				// #endif
			}
			this.label = this.getParent('fui-label')
			if (this.label) {
				this.label.childrens.push(this);
			}
		},
		watch: {
			checked(newVal) {
				this.val = newVal;
			},
			val(newVal) {
				if (newVal && this.group) {
					this.group.changeValue(this.value, this);
				}
			}
		},
		computed: {
			getColor() {
				let color = this.color;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			},
			getValue() {
				return String(this.value)
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				val: false,
				isNvue: isNvue
			};
		},
		methods: {
			unInstall() {
				if (this.group) {
					this.group.childrens.forEach((item, index) => {
						if (item === this) {
							this.group.childrens.splice(index, 1)
						}
					})
				}
			},
			getBackgroundColor(val, isCheckMark, styleType) {
				let color = val && styleType == 1 ? this.getColor : '#fff'
				if (isCheckMark && styleType == 1) {
					color = 'transparent'
				}
				return color;
			},
			getBorderColor(val, isCheckMark, styleType) {
				let color = val ? this.getColor : this.borderColor;
				if (isCheckMark && styleType == 1) {
					color = 'transparent'
				}
				return color;
			},
			radioChange(e) {
				if (this.disabled || this.val) return;
				this.val = true;
				this.$emit('change', {
					checked: this.val,
					value: this.value
				})
			},
			getParent(name = 'fui-radio-group') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			},
			labelClick() {
				this.radioChange()
			}
		}
	}
</script>

<style scoped>
	.fui-radio__input {
		font-size: 0;
		color: rgba(0, 0, 0, 0);
		width: 40rpx;
		height: 40rpx;
		border-width: 1px;
		border-style: solid;
		/* #ifdef APP-NVUE */
		border-radius: 40rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		display: inline-flex;
		box-sizing: border-box;
		vertical-align: top;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
	}

	/* #ifndef APP-NVUE */
	.fui-radio__active-bgcolor {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-radio__color {
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	.fui-check__mark {
		width: 20rpx;
		height: 40rpx;
		border-bottom-style: solid;
		border-bottom-width: 3px;
		border-bottom-color: #FFFFFF;
		border-right-style: solid;
		border-right-width: 3px;
		border-right-color: #FFFFFF;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		transform: rotate(45deg) scale(0.5) translateZ(0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(45deg) scale(0.5);
		/* #endif */
		transform-origin: 54% 48%;
	}

	.fui-check__mark-circle {
		width: 16rpx;
		height: 16rpx;
		/* #ifdef APP-NVUE */
		border-radius: 16rpx;
		/* #endif */

		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
	}

	.fui-radio__hidden {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		border: 0 none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		pointer-events: none;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 100wx;
		height: 100wx;
		border-width: 0;
		/* #endif */
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		z-index: 2;
	}

	.fui-radio__disabled {
		opacity: 0.6;
	}
</style>