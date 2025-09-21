<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号：9 1  44 06 0   5  MA 55 6H   1  KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-search__bar-wrap" :class="{'fui-searchbar__wrap-bg':!background}"
		:style="{ background: background, paddingTop: paddingTb+'rpx',paddingBottom:paddingTb+'rpx',paddingLeft:paddingLr+'rpx',paddingRight:paddingLr+'rpx' }">
		<slot></slot>
		<view class="fui-search__bar-form" :style="{height: height+'rpx'}">
			<view class="fui-search__bar-box"
				:class="{'fui-searchbar__focus-invalid':!isFocus && !isSearch && showLabel && !disabled}"
				:style="{ height: height+'rpx', borderRadius: radius+'rpx', background: inputBackground }"
				v-if="showInput">
				<view class="fui-search__bar-icon">
					<view class="fui-sbi__circle"></view>
					<view class="fui-sbi__line"></view>
				</view>
				<input ref="searchBarRef" class="fui-search__bar-input" :class="{'fui-sb__input-color':!color}"
					:style="{color:color,height: height+'rpx'}" placeholder-class="fui-search__bar-pl"
					:placeholder="plholder" :value="val" :focus="isFocus" :disabled="disabled" confirm-type="search"
					@blur="inputBlur" @focus="inputFocus" @input="inputChange" @confirm="search" />
				<view class="fui-sbi__clear-wrap" v-if="val.length > 0 && !disabled" @tap.stop="clearInput">
					<view class="fui-sbi__clear">
						<view class="fui-sbi__clear-a"></view>
					</view>
					<view class="fui-sbi__clear">
						<view class="fui-sbi__clear-b"></view>
					</view>
				</view>
			</view>
			<view class="fui-search__bar-label" :class="[isLeft?'fui-sb__label-left':'fui-sb__label-center']"
				:style="{ borderRadius: radius+'rpx', background: inputBackground }"
				v-if="!isFocus && !isSearch && showLabel" @tap="onShowInput">
				<view class="fui-search__bar-icon">
					<view class="fui-sbi__circle"></view>
					<view class="fui-sbi__line"></view>
				</view>
				<text class="fui-search__bar-text">{{ placeholder }}</text>
			</view>
		</view>
		<text v-if="cancel && isSearch && !val && cancelText && cancelText!==true && cancelText!=='true'"
			class="fui-search__bar-btn" :style="{ color: cancelColor }" @tap="hideInput">{{ cancelText }}</text>
		<text v-if="val && !disabled && isSearch && searchText && searchText!==true && searchText!=='true'"
			class="fui-search__bar-btn" :class="{'fui-sb__btn-color':!searchColor}" :style="{ color: getSearchColor }"
			@tap="search">{{ searchText }}</text>
	</view>
</template>

<script>
	export default {
		name: 'fui-search-bar',
		emits: ['clear', 'focus', 'blur', 'click', 'cancel', 'input', 'update:modelValue', 'search'],
		props: {
			// #ifdef APP-NVUE
			background: {
				type: String,
				default: '#F1F4FA'
			},
			// #endif
			// #ifndef APP-NVUE
			background: {
				type: String,
				default: ''
			},
			// #endif
			//搜索栏上下padding（padding-top，padding-bottom）
			paddingTb: {
				type: [Number, String],
				default: 16
			},
			paddingLr: {
				type: [Number, String],
				default: 24
			},
			height: {
				type: [Number, String],
				default: 72
			},
			radius: {
				type: [Number, String],
				default: 8
			},
			// #ifdef APP-NVUE
			color: {
				type: String,
				default: '#181818'
			},
			// #endif

			// #ifndef APP-NVUE
			color: {
				type: String,
				default: ''
			},
			// #endif
			//input框背景色
			inputBackground: {
				type: String,
				default: '#fff'
			},
			focus: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: '请输入搜索关键词'
			},
			isLeft: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Number, String],
				default: ''
			},
			// #ifdef VUE3
			modelValue: {
				type: [Number, String],
				default: ''
			},
			// #endif
			disabled: {
				type: Boolean,
				default: false
			},
			cancel: {
				type: Boolean,
				default: true
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			cancelColor: {
				type: String,
				default: '#7F7F7F'
			},
			searchText: {
				type: String,
				default: '搜索'
			},
			searchColor: {
				type: String,
				default: ''
			},
			//是否显示搜索输入框
			showInput: {
				type: Boolean,
				default: true
			},
			//是否显示输入框占位标签，当平台不支持focus属性时可隐藏
			showLabel: {
				type: Boolean,
				default: true
			},
			//v2.1.0
			fixed: {
				type: Boolean,
				default: false
			}
		},
		created() {
			// #ifndef VUE3
			this.val = String(this.value)
			// #endif

			// #ifdef VUE3
			if (this.value && !this.modelValue) {
				this.val = String(this.value)
			} else {
				this.val = String(this.modelValue)
			}
			// #endif

			// #ifndef MP-WEIXIN
			this.plholder = this.placeholder;
			// #endif

			// #ifdef MP-WEIXIN
			if (!this.showLabel || !this.fixed || this.focus || this.val.length > 0) {
				this.plholder = this.placeholder;
			}
			// #endif

			if (this.focus || this.val.length > 0) {
				this.isSearch = true;
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.isFocus = this.focus;
				}, 300)
			})
		},
		watch: {
			focus(val) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.isFocus = val;
						this.isSearch = val;
					}, 20)
				})
			},
			// #ifdef APP-NVUE
			isFocus(val) {
				if (!this.$refs.searchBarRef) return;
				this.$nextTick(() => {
					setTimeout(() => {
						if (val) {
							this.$refs.searchBarRef.focus()
						}
					}, 50)
				})
			},
			// #endif
			// #ifdef VUE3
			modelValue(newVal) {
				this.val = String(newVal)
				if (this.focus || this.val.length > 0) {
					this.isSearch = true;
				}
			},
			// #endif
			value(val) {
				this.val = String(val);
				if (this.focus || this.val.length > 0) {
					this.isSearch = true;
				}
			},
			placeholder(val) {
				// #ifndef MP-WEIXIN
				this.plholder = this.placeholder;
				// #endif

				// #ifdef MP-WEIXIN
				if (!this.showLabel || !this.fixed) {
					this.plholder = this.placeholder;
				}
				// #endif
			}
		},
		computed: {
			getSearchColor() {
				let color = this.searchColor
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
			return {
				isSearch: false,
				isFocus: false,
				val: '',
				plholder: ''
			};
		},
		methods: {
			clearInput() {
				this.val = '';
				this.isFocus = false;
				// TODO　兼容　vue2
				this.$emit('input', this.val);
				// TODO　兼容　vue3
				// #ifdef VUE3
				this.$emit('update:modelValue', this.val)
				// #endif
				uni.hideKeyboard()
				this.$emit('clear');
			},
			inputFocus(e) {
				if (!this.showLabel) {
					this.isSearch = true
				} else {
					// #ifdef H5 || MP-ALIPAY
					this.onShowInput()
					// #endif
				}
				this.$emit('focus', e);
			},
			inputBlur(e) {
				this.isFocus = false;
				if (!this.cancel && !this.val) {
					// #ifdef MP-WEIXIN
					if (this.fixed && this.showLabel) {
						this.plholder = '';
					}
					// #endif
					this.isSearch = false;
				}
				this.$emit('blur', e);
			},
			onShowInput() {
				if (!this.disabled && this.showInput) {
					this.isSearch = true;
					// #ifdef MP-WEIXIN
					if (this.fixed && this.showLabel) {
						this.plholder = this.placeholder;
					}
					// #endif
					this.$nextTick(() => {
						setTimeout(() => {
							this.isFocus = true;
						}, 50)
					})
				}
				this.$emit('click', {});
			},
			hideInput() {
				// #ifdef MP-WEIXIN
				if (this.fixed && this.showLabel) {
					this.plholder = '';
				}
				// #endif
				this.isSearch = false;
				this.isFocus = false;
				uni.hideKeyboard()
				this.$emit('cancel', {});
			},
			inputChange(e) {
				this.val = e.detail.value;
				// TODO　兼容　vue2
				this.$emit('input', this.val);
				// TODO　兼容　vue3
				// #ifdef VUE3
				this.$emit('update:modelValue', this.val)
				// #endif
			},
			search() {
				this.$emit('search', {
					detail: {
						value: this.val
					}
				});
			},
			reset() {
				this.isSearch = false;
				this.isFocus = false;
				this.val = '';
				uni.hideKeyboard()
			}
		}
	};
</script>

<style scoped>
	.fui-search__bar-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		position: relative;
		align-items: center;
	}

	/* #ifndef APP-NVUE */
	.fui-searchbar__wrap-bg {
		background: var(--fui-bg-color-grey, #F1F4FA) !important;
	}

	/* #endif */
	.fui-search__bar-form {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
	}

	.fui-search__bar-box {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
		padding-left: 24rpx;
		padding-right: 24rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		z-index: 1;
		align-items: center;
		/* #ifdef H5 || MP-ALIPAY */
		opacity: 1;
		/* #endif */
	}

	/* #ifdef H5 || MP-ALIPAY */
	.fui-searchbar__focus-invalid {
		position: relative;
		opacity: 0;
		z-index: 3;
	}

	/* #endif */

	.fui-search__bar-input {
		padding: 0 16rpx;
		border: 0;
		font-size: 28rpx;
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		line-height: normal;
		/* #endif */
		flex: 1;
		background: transparent;
	}


	/* #ifndef APP-NVUE */
	.fui-search__bar-input:focus {
		outline: none;
	}

	/* #endif */

	.fui-search__bar-pl {
		/* #ifndef APP-NVUE */
		color: var(--fui-color-label, #B2B2B2) !important;
		overflow: visible;
		/* #endif */

		/* #ifdef APP-NVUE */
		color: #B2B2B2;
		/* #endif */
	}

	/* #ifdef MP */
	::v-deep .fui-search__bar-pl {
		color: var(--fui-color-label, #B2B2B2);
		overflow: visible;
	}

	/* #endif */

	.fui-search__bar-label {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-sb__label-center {
		justify-content: center;
	}

	.fui-sb__label-left {
		padding-left: 24rpx;
	}

	.fui-search__bar-btn {
		font-size: 30rpx;
		margin-left: 24rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-sb__input-color {
		color: var(--fui-color-title, #181818) !important;
	}

	.fui-sb__btn-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
	.fui-search__bar-btn:active {
		opacity: 0.5;
	}

	.fui-search__bar-text {
		font-size: 28rpx;
		/* line-height: 28rpx; */
		padding-left: 16rpx;
		/* #ifndef APP-NVUE */
		color: var(--fui-color-label, #B2B2B2);
		/* #endif */

		/* #ifdef APP-NVUE */
		color: #B2B2B2;
		/* #endif */
	}

	.fui-search__bar-icon {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		flex-direction: column;
		transform: rotate(-45deg);
		transform-origin: 56% center;
	}

	.fui-sbi__circle {
		width: 24rpx;
		height: 24rpx;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		border: 1px solid var(--fui-color-label, #B2B2B2);
		/* #endif */
		/* #ifdef APP-NVUE */
		border: 1px solid #B2B2B2;
		/* #endif */
		border-radius: 50%;
	}

	.fui-sbi__line {
		width: 1px;
		height: 12rpx;
		/* #ifdef APP-NVUE */
		background-color: #B2B2B2;
		/* #endif */
		/* #ifndef APP-NVUE */
		background-color: var(--fui-color-label, #B2B2B2);
		/* #endif */
		border-bottom-left-radius: 6rpx;
		border-bottom-right-radius: 6rpx;
	}

	.fui-sbi__clear-wrap {
		width: 32rpx;
		height: 32rpx;
		/* #ifdef APP-NVUE */
		background-color: #B2B2B2;
		/* #endif */
		/* #ifndef APP-NVUE */
		background-color: var(--fui-color-label, #B2B2B2);
		/* #endif */
		transform: rotate(45deg);
		position: relative;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		flex-shrink: 0;
		/* #endif */

		/* #ifdef APP-NVUE */
		border-radius: 32rpx;
		/* #endif */

		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-sbi__clear {
		width: 32rpx;
		height: 32rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		transform: scale(0.5) translateZ(0);
	}

	.fui-sbi__clear-a {
		width: 32rpx;
		border: 2rpx solid #fff;
		background-color: #fff;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.fui-sbi__clear-b {
		height: 32rpx;
		border: 2rpx solid #fff;
		background-color: #fff;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}
</style>