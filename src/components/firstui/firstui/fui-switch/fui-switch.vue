<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号： 9 1440 6   05  M     A556H 1K  X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-switch__input" :style="{zoom:isNvue?1:scaleRatio,transform:`scale(${isNvue?scaleRatio:1})`}">
		<!-- #ifdef APP-NVUE -->
		<switch v-if="type==='switch'" @change="change" :name="name" :checked="val" :disabled="disabled"
			:color="getColor">
		</switch>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<view class="fui-switch__input-def"
			:style="{background:val?color:'#dfdfdf',borderColor:val?color:borderColor}"
			:class="{'fui-checkbox__disabled':disabled,'fui-switch__color':val && !color}" v-if="type==='switch'">
			<view class="fui-switch__input-before" :class="{'fui-switch__input--checked':val}"
				:style="{background:background}"></view>
			<view class="fui-switch__input-after" :style="{background:val?(btnColor?btnColor:btnBgColor):btnBgColor}"
				:class="{'fui-switch__input--after':val}">
				<slot></slot>
			</view>
			<switch class="fui-switch__hidden" :class="{'fui-pointer__events':isLabel}" @change="change" :name="name"
				:checked="val" :disabled="disabled" :color="color">
			</switch>
		</view>
		<!-- #endif -->
		<view class="fui-checkbox__self"
			:class="{'fui-checkbox__disabled':disabled,'fui-switch__color':!getColor && val}"
			:style="{background:val?getColor:background,border:val?`1px solid ${getColor}`:`1px solid ${borderColor}`}"
			v-else>
			<view class="fui-check__mark" :style="{borderBottomColor:checkMarkColor,borderRightColor:checkMarkColor}"
				v-if="val"></view>
			<switch class="fui-switch__hidden" :class="{'fui-pointer__events':isLabel}"
				style="opacity: 0;position: absolute;" @change="change" :name="name" type="checkbox" :checked="val"
				:disabled="disabled"></switch>
		</view>
	</view>
</template>

<script>
	export default {
		name: "fui-switch",
		emits: ['change'],
		// #ifdef MP-WEIXIN
		behaviors: ['wx://form-field-group'],
		// #endif
		// #ifdef MP-BAIDU
		behaviors: ['swan://form-field'],
		// #endif
		// #ifdef MP-QQ
		behaviors: ['qq://form-field'],
		// #endif
		// #ifdef H5
		behaviors: ['uni://form-field'],
		// #endif
		props: {
			//开关选择器名称
			name: {
				type: String,
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
			//样式，有效值：switch, checkbox
			type: {
				type: String,
				default: 'switch'
			},
			//switch选中颜色
			color: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: '#fdfdfd'
			},
			//switch选中时按钮颜色 V2.3.0+（nvue不支持）
			btnColor: {
				type: String,
				default: ''
			},
			btnBgColor: {
				type: String,
				default: '#fff'
			},
			//边框颜色，type=checkbox时生效
			borderColor: {
				type: String,
				default: '#ccc'
			},
			//对号颜色，type=checkbox时生效
			checkMarkColor: {
				type: String,
				default: '#fff'
			},
			scaleRatio: {
				type: [Number, String],
				default: 1
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
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				val: false,
				isNvue: isNvue,
				isLabel: false
			};
		},
		watch: {
			checked(val) {
				this.val = val;
			}
		},
		created() {
			this.val = this.checked;
			this.label = this.getParent();
			if (this.label) {
				this.isLabel = true
				this.label.childrens.push(this)
			}
		},
		methods: {
			change(e, label) {
				if (this.label && !label) return;
				this.val = e.detail.value;
				this.$emit('change', e)
			},
			labelClick() {
				if (this.disabled) return;
				let e = {
					detail: {
						value: !this.val
					}
				}
				this.change(e, true)
			},
			getParent(name = 'fui-label') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	.fui-switch__input {
		display: inline;
		margin: 0;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-switch__input {
		border: 1px solid transparent;
	}

	/* #endif */

	.fui-checkbox__self {
		font-size: 0;
		width: 40rpx;
		height: 40rpx;
		/* #ifdef APP-NVUE */
		border-radius: 40rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		display: inline-flex;
		box-sizing: border-box;
		vertical-align: top;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
	}

	/* #ifndef APP-NVUE */
	.fui-switch__input-def {
		position: relative;
		width: 52px;
		height: 32px;
		border: 1px solid #CCCCCC;
		outline: 0;
		border-radius: 16px;
		box-sizing: border-box;
		transition: background-color .1s, border .1s;
	}

	.fui-switch__input-before {
		position: absolute;
		top: 0;
		left: 0;
		width: 50px;
		height: 30px;
		border-radius: 15px;
		transition: transform .3s
	}

	.fui-switch__input-after {
		position: absolute;
		top: 0;
		left: 0;
		width: 30px;
		height: 30px;
		border-radius: 15px;
		background-color: #fff;
		box-shadow: 0 0 3px rgba(0, 0, 0, .4);
		transition: transform .3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fui-switch__input--checked {
		transform: scale(0)
	}

	.fui-switch__input--after {
		transform: translateX(20px)
	}

	.fui-switch__color {
		background: var(--fui-color-primary, #465CFF) !important;
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	/* #ifdef H5 || APP-VUE */
	::v-deep .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	/* #ifdef MP-WEIXIN */
	.wx-switch-input {
		margin-right: 0 !important;
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
		transform: rotate(45deg) scale(0.5);
		transform-origin: 54% 48%;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.fui-switch__hidden {
		position: absolute;
		top: -1px;
		left: -1px;
		opacity: 0;
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		border: 0 none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		z-index: 2;
		/* #endif */

		/* #ifdef APP-NVUE */
		width: 100wx;
		height: 100wx;
		right: 0;
		bottom: 0;
		border-width: 0;
		/* #endif */
	}

	/* #ifdef H5 */
	.fui-pointer__events {
		pointer-events: none;
	}

	/* #endif */

	.fui-checkbox__disabled {
		opacity: 0.6;
	}
</style>