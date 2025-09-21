<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1  127，营业执照号：914 4   0  6  05     MA556 H1  KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-cascader__wrap">
		<view class="fui-cascader__header-wrap">
			<scroll-view :scroll-x="true" scroll-with-animation :show-scrollbar="false" :scroll-into-view="scrollViewId"
				:style="{ background: headBackground }" class="fui-cascader__scroll">
				<view class="fui-cascader__header" :style="{ height: headHeight+'rpx'}">
					<view class="fui-cascader__header-item" :id="`fui_cr_${idx}`" v-for="(item, idx) in selectedArr"
						:key="idx" @tap.stop="swichTabs(idx)">
						<text class="fui-cascader__header-text"
							:class="{'fui-cascader__hi-width':item[textKey].length>6,'fui-cascader__color':idx === current && !getActiveColor}"
							:style="{ color: idx === current ? getActiveColor : color, fontSize: size + 'rpx',fontWeight:idx === current?'bold':'normal' }">{{ item[textKey] }}</text>
						<view class="fui-cascader__header-line" :class="{'fui-cascader__bg':!getActiveColor}"
							:style="{ background: getActiveColor }" v-if="idx === current && showLine"></view>
					</view>
				</view>
			</scroll-view>
			<view class="fui-cascader__border" :style="{background:borderColor}" v-if="showBorder"></view>
		</view>
		<!-- #ifdef MP-TOUTIAO -->
		<view :style="{ height: height+'rpx', background: background}">
			<swiper class="fui-cascader__list" :current="defCurrent" :circular="false" :duration="300"
				@change="switchTab" :style="{ height: height+'rpx', background: background}" v-if="isShow">
			<!-- #endif -->
				<!-- #ifndef MP-TOUTIAO -->
				<swiper class="fui-cascader__list" :current="defCurrent" :circular="false" :duration="300"
					@change="switchTab" :style="{ height: height+'rpx', background: background}">
				<!-- #endif -->
					<swiper-item v-for="(item, index) in selectedArr" :key="index">
						<scroll-view :show-scrollbar="false" scroll-y :scroll-into-view="item.scrollViewId"
							class="fui-cascader__item-scroll" :style="{ height: height+'rpx', background: background }">
							<view class="fui-cascader__seat"></view>
							<view class="fui-cascader__cell" :id="`fui_c_${subi}`" v-for="(sub, subi) in item.data"
								:key="subi" @tap.stop="change(index, subi, sub)">
								<view class="fui-cascader__checkmark"
									:class="{'fui-cascader__icon-border':!getActiveColor}"
									:style="{borderBottomColor:checkMarkColor || getActiveColor,borderRightColor:checkMarkColor || getActiveColor}"
									v-if="item.index === subi"></view>
								<image :src="sub[srcKey]" v-if="sub[srcKey]" class="fui-cascader__img"
									:style="{ width: imgWidth+'rpx', height: imgHeight+'rpx', borderRadius: radius+'rpx' }">
								</image>
								<text class="fui-cascader__text"
									:style="{ color: item.index === subi ? textActiveColor : textColor, fontSize: textSize + 'rpx',fontWeight:item.index === subi?'bold':'normal' }">{{ sub[textKey] }}</text>
							</view>
							<view class="fui-cascader__seat"></view>
						</scroll-view>
					</swiper-item>
				</swiper>
		<!-- #ifdef MP-TOUTIAO -->
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "fui-cascader",
		emits: ['change', 'complete'],
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			textKey: {
				type: String,
				default: 'text'
			},
			valueKey: {
				type: String,
				default: 'value'
			},
			childrenKey: {
				type: String,
				default: 'children'
			},
			srcKey: {
				type: String,
				default: 'src'
			},
			value: {
				type: Array,
				default () {
					return []
				}
			},
			defaultKey: {
				type: String,
				default: 'value'
			},
			stepLoading: {
				type: Boolean,
				default: false
			},
			showBorder: {
				type: Boolean,
				default: true
			},
			borderColor: {
				type: String,
				default: '#eee'
			},
			headHeight: {
				type: [Number, String],
				default: 88
			},
			headBackground: {
				type: String,
				default: '#FFFFFF'
			},
			text: {
				type: String,
				default: '请选择'
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: '#181818'
			},
			//选中颜色
			activeColor: {
				type: String,
				default: ''
			},
			showLine: {
				type: Boolean,
				default: true
			},
			height: {
				type: [Number, String],
				default: 600
			},
			//item  swiper 内容部分背景颜色
			background: {
				type: String,
				default: '#FFFFFF'
			},
			checkMarkColor: {
				type: String,
				default: ''
			},
			imgWidth: {
				type: [Number, String],
				default: 48
			},
			imgHeight: {
				type: [Number, String],
				default: 48
			},
			radius: {
				type: [Number, String],
				default: 0
			},
			textSize: {
				type: [Number, String],
				default: 26
			},
			textColor: {
				type: String,
				default: '#181818'
			},
			textActiveColor: {
				type: String,
				default: '#181818'
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
			return {
				current: 0,
				defCurrent: 0,
				selectedArr: [],
				scrollViewId: 'fui_cr__0',
				isShow: true
			};
		},
		watch: {
			options(vals) {
				this.setDefaultOptions(this.value);
			},
			value(vals) {
				this.setDefaultOptions(vals)
			},
			selectedArr(val) {
				console.log(val)
			}
		},
		created() {
			this.setDefaultOptions(this.value)
		},
		methods: {
			//重置选择，暴露给用户使用
			reset() {
				this.initData(this.options, -1);
			},
			//设置请求返回数据，暴露给用户使用（分级加载数据）
			setRequestData(data, layer) {
				this.subLevelData(data, layer)
			},
			//无子级数据，选择结束
			end(layer) {
				this.subLevelData([], layer)
			},
			subLevelData(data, layer) {
				if (!data || data.length === 0) {
					if (layer == -1) return;
					let arr = this.selectedArr;
					if (layer < arr.length - 1) {
						let newArr = arr.slice(0, layer + 1);
						this.selectedArr = newArr;
					}
					// #ifdef MP-TOUTIAO
					this.isShow = false
					this.$nextTick(() => {
						setTimeout(() => {
							this.isShow = true
						}, 10)
					})
					// #endif
					let result = JSON.parse(JSON.stringify(this.selectedArr));
					let lastItem = result[result.length - 1] || {};
					let text = [];
					let value = [];
					let src = [];
					result.map(item => {
						text.push(item[this.textKey]);
						value.push(item[this.valueKey])
						src.push(item[this.srcKey])
						delete item['data'];
						delete item['index'];
						delete item['scrollViewId'];
						return item;
					});
					this.$emit('complete', {
						result: result,
						[this.valueKey]: value,
						[this.textKey]: text,
						[this.srcKey]: src
					});
					setTimeout(() => {
						this.scrollViewId = `fui_cr_${layer}`;
					}, 50)
				} else {
					let item = [{
						[this.textKey]: this.text,
						[this.valueKey]: this.text,
						[this.srcKey]: '',
						index: -1,
						scrollViewId: 'fui_c__0',
						data
					}];
					if (layer == -1) {
						this.selectedArr = item;
					} else {
						let retainArr = this.selectedArr.slice(0, layer + 1) || [];
						this.selectedArr = retainArr.concat(item);
					}
					let current = this.selectedArr.length - 1;
					if (current >= this.current) {
						this.defCurrent = this.current
					}
					this.$nextTick(() => {
						setTimeout(() => {
							this.defCurrent = current;
							this.current = current;
							this.scrollViewId = `fui_cr_${this.current > 1?this.current - 1:0}`;
						}, 50)
					});
				}
			},
			getDefaultIndex(arr, val) {
				if (!arr || arr.length === 0 || val === undefined) return -1;
				let key = this.defaultKey || this.valueKey;
				let index = -1;
				for (let i = 0, len = arr.length; i < len; i++) {
					if (arr[i][key] == val) {
						index = i;
						break;
					}
				}
				return index;
			},
			removeChildren(data) {
				let list = data.map(item => {
					delete item[this.childrenKey];
					return item;
				});
				return list;
			},
			getItemList(layer, index, selectedArr) {
				let list = [];
				let arr = JSON.parse(JSON.stringify(this.options));
				selectedArr = selectedArr || this.selectedArr
				if (layer == -1) {
					list = this.removeChildren(arr);
				} else {
					let subi = selectedArr[0].index;
					subi = subi === undefined || subi == -1 ? index : subi;
					if (arr[subi] && arr[subi][this.childrenKey]) {
						list = arr[subi][this.childrenKey]
					}
					if (layer > 0) {
						for (let i = 1; i < layer + 1; i++) {
							let val = layer === i ? index : selectedArr[i].index;
							list = val === -1 ? [] : (list[val][this.childrenKey] || []);
							if (list.length === 0) break;
						}
					}
					list = this.removeChildren(list);
				}
				return list;
			},
			setDefaultOptions(vals) {
				let options = this.options || []
				if (!options || options.length === 0) return;
				vals = vals || [];
				let selectedArr = []
				if (vals.length > 0) {
					//分级加载
					if (this.stepLoading) {
						options.forEach((item, index) => {
							let subi = this.getDefaultIndex(item, vals[index])
							let obj = item[subi] || {}
							selectedArr.push({
								[this.textKey]: obj[this.textKey] || this.text,
								[this.valueKey]: obj[this.valueKey] || '',
								[this.srcKey]: obj[this.srcKey] || '',
								index: subi,
								scrollViewId: `fui_c_${subi}`,
								data: item
							})
						})
					} else {
						let subi = -1
						for (let j = 0, len = vals.length; j < len; j++) {
							let item = vals[j]
							let list = []
							let obj = {}
							if (j === 0) {
								list = this.getItemList(-1)
							} else {
								list = this.getItemList(j - 1, subi, selectedArr)
							}
							subi = this.getDefaultIndex(list, item)
							if (subi !== -1) {
								obj = list[subi]
							}
							selectedArr.push({
								[this.textKey]: obj[this.textKey] || this.text,
								[this.valueKey]: obj[this.valueKey] || '',
								[this.srcKey]: obj[this.srcKey] || '',
								index: subi,
								scrollViewId: `fui_c_${subi}`,
								data: list
							})
							if (subi === -1) break;
						}
					}
					this.selectedArr = selectedArr;
					this.defCurrent = this.current;
					let current = selectedArr.length - 1;
					this.$nextTick(() => {
						setTimeout(() => {
							this.defCurrent = current;
							this.current = current;
							this.checkTabs();
						}, 30)
					});
				} else {
					this.initData(options, -1);
				}
			},
			initData(data, layer) {
				if (!data || data.length === 0) return;
				if (this.stepLoading) {
					if (Array.isArray(data[0])) {
						data = data[0]
					}
					this.subLevelData(data, layer);
				} else {
					this.subLevelData(this.getItemList(layer, -1), layer);
				}
			},
			swichTabs(current) {
				if (this.current != current) {
					this.defCurrent = this.current;
					setTimeout(() => {
						this.defCurrent = current;
						this.current = current;
					}, 30)
				}
			},
			checkTabs() {
				let current = this.current;
				let item = this.selectedArr[current] || {};
				item.scrollViewId = 'fui_c__0';
				this.$nextTick(() => {
					setTimeout(() => {
						let index = Number(item.index)
						let val = index < 2 ? 0 : index - 2;
						item.scrollViewId = `fui_c_${val}`;
					}, 30);
				});
				this.scrollViewId = `fui_cr_${current > 1?current - 1:0}`;
			},
			switchTab(e) {
				this.current = e.detail.current;
				this.checkTabs();
			},
			change(index, subi, sub) {
				let item = this.selectedArr[index];
				if (item.index == subi) return;
				item.index = subi;
				item[this.textKey] = sub[this.textKey];
				item[this.valueKey] = sub[this.valueKey];
				item[this.srcKey] = sub[this.srcKey] || '';
				this.$emit('change', {
					layer: index,
					index: subi,
					...sub
				});
				if (!this.stepLoading) {
					let data = this.getItemList(index, subi);
					this.subLevelData(data, index);
				}
			}
		}
	}
</script>

<style scoped>
	.fui-cascader__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-cascader__scroll {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		flex-direction: row;
		/* #endif */
	}

	.fui-cascader__header-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		position: relative;
	}

	.fui-cascader__header {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.fui-cascader__header-item {
		padding: 24rpx 32rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		overflow: hidden;
		/* #endif */
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-cascader__header-text {
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		text-align: center;
	}

	.fui-cascader__hi-width {
		width: 240rpx;
	}

	.fui-cascader__header-line {
		height: 6rpx;
		border-radius: 4rpx;
		position: absolute;
		bottom: 0;
		left: 32rpx;
		right: 32rpx;
		z-index: 2;
	}

	.fui-cascader__border {
		position: absolute;
		left: 0;
		right: 0;
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

	.fui-cascader__list {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-cascader__seat {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		height: 24rpx;
	}

	.fui-cascader__cell {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 20rpx 32rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-cascader__checkmark {
		width: 24rpx;
		height: 48rpx;
		border-bottom-style: solid;
		border-bottom-width: 3px;
		border-bottom-color: #FFFFFF;
		border-right-style: solid;
		border-right-width: 3px;
		border-right-color: #FFFFFF;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		transform: rotate(45deg) scale(0.5) translateZ(0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(45deg) scale(0.5);
		/* #endif */
		transform-origin: 54% 48%;
		margin-right: 16rpx;
	}

	.fui-cascader__img {
		margin-right: 16rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-cascader__color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-cascader__bg {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-cascader__icon-border {
		border-bottom-color: var(--fui-color-primary, #465CFF) !important;
		border-right-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
</style>