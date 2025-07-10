<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  1 127，营业执照号：9 1 4  4 0  60 5  M   A 556 H 1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view v-if="isShow || !isNvue">
		<!-- @touchmove.stop.prevent="stop" -->
		<view class="fui-select__mask" :class="{'fui-select__mask-show':show}" :style="getStyles" @tap.stop="maskClose"
			ref="fui_select_mk_ani"></view>
		<view class="fui-select__wrap" ref="fui_select_ani"
			:class="{'fui-select__wrap-show':show,'fui-select__weex-android':isAndroid,'fui-select__safe-weex':iphoneX && safeArea}"
			:style="{borderTopLeftRadius:radius+'rpx',borderTopRightRadius:radius+'rpx',background:background,zIndex:zIndex}">
			<slot>
				<view class="fui-select__header"
					:style="{background:headerBackground,borderTopLeftRadius:radius+'rpx',borderTopRightRadius:radius+'rpx'}">
					<text class="fui-select__header-text"
						:style="{fontSize:titleSize+'rpx',color:titleColor,fontWeight:fontWeight}">{{title}}</text>
					<view class="fui-select__header-close" @tap.stop="handleClose">
						<fui-icon name="close" color="#b2b2b2" :size="48"></fui-icon>
					</view>
					<view class="fui-select__header-line" :style="{background:lineColor}"></view>
				</view>
			</slot>
			<scroll-view :scroll-y="true" class="fui-select__scroll" :show-scrollbar="false"
				:style="{height:height+'rpx'}">
				<view class="fui-select__list">
					<fui-list-cell v-for="(model,index) in itemList" :key="index"
						:highlight="highlight && !model.disabled" :padding="padding"
						:bottomBorder="splitLine && itemList.length-1!==index" :borderColor="lineColor"
						:background="background" :bottomLeft="bottomLeft" :arrow="type==='list'"
						:arrowColor="arrowColor" @click="itemClick(index)">
						<view class="fui-select__item"
							:class="{'fui-select__reverse':isReverse && type==='select','fui-sitem__disable':model.disabled}">
							<view class="fui-select__checkbox"
								:class="{'fui-select__is-checkmark ':isCheckMark,'fui-select__checkbox-color':(!checkboxColor || checkboxColor===true) && model.checked && !isCheckMark}"
								:style="{background:model.checked && !isCheckMark ?getCheckboxColor:'transparent',borderColor:model.checked && !isCheckMark ?getCheckboxColor:borderColor}"
								v-if="type==='select'">
								<view class="fui-select__checkmark"
									:style="{borderBottomColor:checkmarkColor,borderRightColor:checkmarkColor}"
									v-if="model.checked"></view>
							</view>
							<view class="fui-select__flex">
								<view class="fui-select__icon-box"
									:class="{'fui-select__icon-ml':!isReverse && type==='select','fui-select__icon-mr':isReverse}"
									:style="{width:iconWidth+'rpx',height:iconWidth+'rpx',backgroundColor:iconBgColor}"
									v-if="model[srcKey]">
									<image :src="model[srcKey]" :style="{width:iconWidth+'rpx',height:iconWidth+'rpx'}"
										:mode="iconMode"></image>
								</view>
								<text class="fui-select__item-text"
									:class="{'fui-select__text-pl':!isReverse && (type==='select' || model[srcKey]),'fui-select__text-pr':isReverse && (type==='select' || model[srcKey])}"
									:style="{fontSize:size+'rpx',color:color}">{{model[textKey]}}</text>
							</view>
						</view>
					</fui-list-cell>
					<slot name="list"></slot>
				</view>
			</scroll-view>
			<view class="fui-select__btn-wrap" v-if="type==='select'">
				<view class="fui-select__btn" :class="{'fui-select__btn-color':!btnBackground}"
					:style="{background:getBgColor}">
					<text class="fui-select__btn" :class="['fui-select__btn-text']" :style="{color:btnColor}"
						@tap.stop="handleClick(false)">{{btnText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	//非easycom模式取消注释引入组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	// import fuiListCell from "@/components/firstui/fui-list-cell/fui-list-cell.vue"
	export default {
		name: "fui-select",
		emits: ['click', 'confirm', 'close', 'change'],
		// components:{
		// 	fuiIcon,
		// 	fuiListCell
		// },
		props: {
			show: {
				type: Boolean,
				default: false
			},
			options: {
				type: Array,
				default () {
					return []
				}
			},
			//v1.9.9+
			textKey: {
				type: String,
				default: 'text'
			},
			//v1.9.9+
			srcKey: {
				type: String,
				default: 'src'
			},
			height: {
				type: [Number, String],
				default: 600
			},
			type: {
				type: String,
				default: 'select'
			},
			radius: {
				type: [Number, String],
				default: 24
			},
			headerBackground: {
				type: String,
				default: '#fff'
			},
			title: {
				type: String,
				default: '请选择'
			},
			titleSize: {
				type: [Number, String],
				default: 32
			},
			titleColor: {
				type: String,
				default: '#181818'
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			multiple: {
				type: Boolean,
				default: false
			},
			background: {
				type: String,
				default: '#fff'
			},
			padding: {
				type: Array,
				default () {
					return ['32rpx', '32rpx']
				}
			},
			//选择框选中后颜色
			checkboxColor: {
				type: String,
				default: ''
			},
			borderColor: {
				type: String,
				default: '#ccc'
			},
			isCheckMark: {
				type: Boolean,
				default: false
			},
			checkmarkColor: {
				type: String,
				default: '#fff'
			},
			isReverse: {
				type: Boolean,
				default: false
			},
			splitLine: {
				type: Boolean,
				default: true
			},
			lineColor: {
				type: String,
				default: '#EEEEEE'
			},
			bottomLeft: {
				type: [Number, String],
				default: 32
			},
			arrowColor: {
				type: String,
				default: '#B2B2B2'
			},
			highlight: {
				type: Boolean,
				default: true
			},
			iconWidth: {
				type: [Number, String],
				default: 48
			},
			iconBgColor: {
				type: String,
				default: 'rgba(0,0,0,0)'
			},
			iconMode: {
				type: String,
				default: 'widthFix'
			},
			size: {
				type: [Number, String],
				default: 30
			},
			color: {
				type: String,
				default: '#181818'
			},
			btnText: {
				type: String,
				default: '确定'
			},
			btnBackground: {
				type: String,
				default: ''
			},
			btnColor: {
				type: String,
				default: '#fff'
			},
			maskBackground: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			maskClosable: {
				type: Boolean,
				default: false
			},
			zIndex: {
				type: [Number, String],
				default: 1001
			},
			//是否适配底部安全区
			safeArea: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			getStyles() {
				return `background:${this.maskBackground};z-index:${Number(this.zIndex)-1};`
			},
			getCheckboxColor() {
				let color = this.checkboxColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			},
			getBgColor() {
				let color = this.btnBackground
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			}
		},
		watch: {
			// #ifdef APP-NVUE
			show: {
				handler(newVal) {
					if (newVal) {
						this.open();
					} else {
						this.close();
					}
				},
				immediate: true
			},
			// #endif
			options(newVal) {
				this.initData(newVal)
			}
		},
		data() {
			let isAndroid = false;
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			const res = uni.getSystemInfoSync();
			isAndroid = res.platform.toLocaleLowerCase() == "android"
			// #endif
			return {
				isNvue: isNvue,
				isAndroid: isAndroid,
				itemList: [],
				index: -1,
				isShow: false,
				iphoneX: false
			};
		},
		created() {
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.iphoneX = this.isPhoneX();
			// #endif
			this.initData(this.options)
		},
		methods: {
			// #ifdef APP-NVUE || MP-TOUTIAO
			isPhoneX() {
				if (!this.safeArea) return false;
				//34px
				const res = uni.getSystemInfoSync();
				let iphonex = false;
				let models = ['iphonex', 'iphonexr', 'iphonexsmax']
				for (let i = 11; i < 20; i++) {
					models.push(`iphone${i}`)
					models.push(`iphone${i}mini`)
					models.push(`iphone${i}pro`)
					models.push(`iphone${i}promax`)
				}
				const model = res.model.replace(/\s/g, "").toLowerCase()
				const newModel = model.split('<')[0]
				if (models.includes(model) || models.includes(model) || (res.safeAreaInsets && res.safeAreaInsets.bottom >
						0)) {
					iphonex = true;
				}
				return iphonex;
			},
			// #endif
			// #ifdef APP-NVUE
			open() {
				this.isShow = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this._animation(true);
					}, 50);
				})
			},
			close() {
				this._animation(false);
			},
			_animation(type) {
				if (!this.$refs['fui_select_ani'] || !this.$refs['fui_select_mk_ani']) return;
				animation.transition(
					this.$refs['fui_select_mk_ani'].ref, {
						styles: {
							opacity: type ? 1 : 0
						},
						duration: 250,
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {}
				);
				//android 部分手机隐藏时动画有抖动感，调整duration去动画
				animation.transition(
					this.$refs['fui_select_ani'].ref, {
						styles: {
							transform: `translateY(${type ? '0' : '100%'})`,
							opacity: type ? 1 : 0
						},
						duration: 250,
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {
						if (!type) {
							this.isShow = false
						}
					}
				);
			},
			// #endif
			initData(vals) {
				vals = JSON.parse(JSON.stringify(vals))
				if (vals && vals.length > 0) {
					if (typeof vals[0] !== 'object') {
						vals = vals.map(item => {
							return {
								[this.textKey]: item,
								checked: false,
								disabled: false
							}
						})
					} else {
						vals.map((item, index) => {
							item.checked = item.checked || false
							if (this.type === 'select' && !this.multiple && item.checked) {
								this.index = index
							}
						})
					}
					this.itemList = vals;
				} else {
					this.itemList = []
				}
			},
			itemClick(index) {
				let vals = [...this.itemList]
				let item = vals[index]
				if (item && item.disabled) return;
				if (this.type === 'select') {
					if (this.multiple) {
						item.checked = !item.checked;
					} else {
						vals.forEach((item, idx) => {
							if (index === idx) {
								item.checked = true
							} else {
								item.checked = false
							}
						})
						this.index = index
					}
					this.itemList = vals;
					this.handleClick(true)
				} else {
					this.$emit('click', {
						index: index,
						options: this.options[index]
					})
				}
			},
			handleClick(isChange) {
				if (this.type !== 'select') return;
				if (this.multiple) {
					let items = []
					this.itemList.forEach((item, idx) => {
						if (item.checked) {
							items.push(item)
						}
					})
					const params = {
						options: items
					}
					if (isChange) {
						this.$emit('change', params)
					} else {
						this.$emit('confirm', params)
					}
				} else {
					let index = this.index;
					const param = {
						index: index,
						options: index === -1 ? '' : this.options[this.index]
					}
					if (isChange) {
						this.$emit('change', param)
					} else {
						this.$emit('confirm', param)
					}
				}

			},
			maskClose() {
				if (!this.maskClosable) return;
				this.handleClose()
			},
			handleClose() {
				this.$emit('close', {})
			},
			stop() {}
		}
	}
</script>

<style scoped>
	.fui-select__mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transition: all ease-in-out .3s;
		visibility: hidden;
		opacity: 0;
		/* #endif */
		/* #ifdef APP-NVUE */
		opacity: 0.001;
		/* #endif */

	}


	.fui-select__mask-show {
		/* #ifndef APP-NVUE */
		opacity: 1;
		visibility: visible;
		/* #endif */

		/* #ifdef APP-NVUE */
		opacity: 1;
		/* #endif */
	}


	.fui-select__wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		width: 100%;
		transform: translate3d(0, 100%, 0);
		transition: all 0.3s ease-in-out;
		min-height: 20rpx;
		opacity: 0;
		visibility: hidden;
		/* #endif */

		/* #ifdef APP-NVUE */
		flex-direction: column;
		/* transition-property: transform;
		transition-duration: 0.3s; */
		transform: translateY(100%);
		/* #endif */

		/* #ifndef APP-NVUE || MP-TOUTIAO */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-select__weex-android {
		transform: translateY(950rpx);
	}

	/* #endif */


	.fui-select__wrap-show {
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 0, 0);
		opacity: 1;
		visibility: visible;
		/* #endif */

		/* #ifdef APP-NVUE */
		/* transform: translateY(0); */
		/* #endif */
	}



	.fui-select__scroll {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
	}

	.fui-select__list {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-select__item {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		position: relative;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-sitem__disable {
		opacity: .5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.fui-select__flex {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
	}

	.fui-select__reverse {
		justify-content: space-between;
		flex-direction: row-reverse;
	}

	.fui-select__checkbox {
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
		display: inline-flex;
		box-sizing: border-box;
		border-radius: 50%;
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
	.fui-select__checkbox-color {
		background: var(--fui-color-primary, #465CFF) !important;
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-select__btn-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
	.fui-select__is-checkmark {
		border-width: 0 !important;
		background: transparent !important;
	}

	.fui-select__checkmark {
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

	.fui-select__item-text {
		/* #ifndef APP-NVUE */
		word-break: break-all;
		/* #endif */
		font-weight: normal;
	}

	.fui-select__text-pl {
		padding-left: 24rpx;
	}

	.fui-select__text-pr {
		padding-right: 24rpx;
	}

	.fui-select__icon-box {
		overflow: hidden;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.fui-select__icon-ml {
		margin-left: 24rpx;
	}

	.fui-select__icon-mr {
		margin-right: 24rpx;
	}

	.fui-select__header {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
		height: 98rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.fui-select__header-line {
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
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

	.fui-select__header-text {
		text-align: center;
		/* #ifndef APP-NVUE */
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		box-sizing: border-box;
		/* #endif */
		text-overflow: ellipsis;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		flex: 1;
		padding: 0 88rpx;
	}

	.fui-select__header-close {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		right: 32rpx;
		top: 24rpx;
		text-align: right;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-select__btn-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 32rpx;
	}

	.fui-select__btn {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		border-radius: 44rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		font-size: 32rpx;
		font-weight: normal;
		text-align: center;
	}

	/* #ifdef APP-NVUE */
	.fui-select__btn-text {
		line-height: 88rpx;
	}

	/* #endif */
	.fui-select__btn-text:active {
		background: rgba(0, 0, 0, .2);
	}

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-select__safe-weex {
		padding-bottom: 34px;
	}

	/* #endif */
</style>