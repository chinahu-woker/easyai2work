<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号： 9     144  0  6 05 M A  55 6H 1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-picker__wrap" @touchend="stop">
		<view class="fui-picker__mask" @touchmove.stop.prevent="stop" :class="{'fui-picker__mask-show':isShow}"
			:style="maskStyl" ref="fui_pkm_ani" @tap.stop="maskClick"></view>
		<view :key="theme" class="fui-picker__content"
			:class="{'fui-picker__content-dark':theme==='dark','fui-picker__content-show':isShow,'fui-picker__radius':radius}"
			:style="{zIndex:zIndex}" ref="fui_pk_ani">
			<view class="fui-picker__header"
				:class="{'fui-picker__header-dark':theme==='dark','fui-picker__radius':radius}" :style="headerStyl">
				<text class="fui-picker__btn-cancel"
					:class="[theme==='dark'?'fui-pk__cancel-color_dark':'fui-pk__cancel-color']" :style="cancelStyl"
					@tap.stop="btnCancel">{{cancelText}}</text>
				<slot>
					<text class="fui-picker__title"
						:class="[theme==='dark'?'fui-pk__title-color_dark':'fui-pk__title-color']"
						:style="titleStyl">{{title}}</text>
				</slot>
				<text class="fui-picker__btn-sure" :class="{'fui-pk__sure-color':!confirmColor || confirmColor===true}"
					:style="confrimStyl" @tap.stop="btnConfirm">{{confirmText}}</text>
			</view>
			<view @touchstart.stop="pickerstart">
				<!--支付宝小程序不支持动态切换 picker-view-column ... 设置高度也不行-->
				<!-- #ifdef MP-ALIPAY -->
				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-picker__indicator':''" class="fui-picker__view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="layer==1">
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in firstArr"
							:key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-picker__indicator':''" class="fui-picker__view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="layer==2">
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in firstArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in secondArr"
							:key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>


				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-picker__indicator':''" class="fui-picker__view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="layer==3">
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in firstArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in secondArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in thirdArr"
							:key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>


				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-picker__indicator':''" class="fui-picker__view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="layer==4">
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in firstArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in secondArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in thirdArr"
							:key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" class="fui-picker__text" v-for="(item,index) in fourthArr"
							:key="index" :class="{'fui-picker__color-dark':theme==='dark'}">{{item}}</view>
					</picker-view-column>
				</picker-view>
				<!-- #endif -->

				<!-- #ifndef MP-ALIPAY -->
				<picker-view :mask-top-style="theme==='dark'?darkStyle:''"
					:mask-bottom-style="theme==='dark'?darkBottomStyle:''" :mask-style="theme==='dark'?darkStyle:''"
					:indicator-style="theme==='dark'?indicatorStyl:'height: 44px;border-top-width:0.5px;border-bottom-width:0.5px;'"
					:indicator-class="theme==='dark'?'fui-picker__indicator':''" class="fui-picker__view"
					:style="{height:height+'rpx'}" :key="theme+layer" :value="vals" :immediate-change="immediate"
					@change="pickerChange">
					<picker-view-column>
						<text :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in firstArr"
							:key="index">{{item}}</text>
					</picker-view-column>
					<picker-view-column v-if="layer==2 || layer==3  || layer==4">
						<text :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in secondArr"
							:key="index">{{item}}</text>
					</picker-view-column>
					<picker-view-column v-if="layer==3  || layer==4">
						<text :style="contentStyl" class="fui-picker__text"
							:class="{'fui-picker__color-dark':theme==='dark'}" v-for="(item,index) in thirdArr"
							:key="index">{{item}}</text>
					</picker-view-column>
					<picker-view-column v-if="layer==4">
						<text :style="contentStyl" class="fui-picker__text" v-for="(item,index) in fourthArr"
							:key="index" :class="{'fui-picker__color-dark':theme==='dark'}">{{item}}</text>
					</picker-view-column>
				</picker-view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: "fui-picker",
		emits: ['change', 'cancel'],
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			layer: {
				type: [Number, String],
				default: 1
			},
			show: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Array, String, Number],
				default () {
					return []
				}
			},
			linkage: {
				type: Boolean,
				default: false
			},
			fields: {
				type: Array,
				default () {
					return ['text', 'value', 'children']
				}
			},
			radius: {
				type: Boolean,
				default: false
			},
			height: {
				type: [Number, String],
				default: 520
			},
			size: {
				type: [Number, String],
				default: 16
			},
			color: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			titleSize: {
				type: [Number, String],
				default: 28
			},
			titleColor: {
				type: String,
				default: ''
			},
			confirmText: {
				type: String,
				default: '确定'
			},
			confirmColor: {
				type: String,
				default: ''
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			cancelColor: {
				type: String,
				default: ''
			},
			btnSize: {
				type: [Number, String],
				default: 32
			},
			background: {
				type: String,
				default: ''
			},
			theme: {
				type: String,
				default: 'light'
			},
			maskClosable: {
				type: Boolean,
				default: true
			},
			maskBackground: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			zIndex: {
				type: [Number, String],
				default: 996
			},
			isClose: {
				type: Boolean,
				default: true
			},
			//自定义参数
			param: {
				type: [Number, String],
				default: 0
			}
		},
		created() {
			this.initialize()
			this.isShow = this.show
		},
		// #ifdef APP-NVUE
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.hiddenNvuePicker()
				}, 50)
			})
		},
		// #endif
		computed: {
			cancelStyl() {
				let styles = `fontSize:${this.btnSize}rpx;`
				if (this.cancelColor) {
					styles += `color:${this.cancelColor};`
				}
				return styles
			},
			confrimStyl() {
				let styles = `font-size:${this.btnSize}rpx;`
				let color = this.confirmColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				if (color) {
					styles += `color:${color};`
				}
				return styles
			},
			titleStyl() {
				let styles = `font-size:${this.titleSize}rpx;`
				if (this.titleColor) {
					styles += `color:${this.titleColor};`
				}
				return styles
			},
			contentStyl() {
				let styles = `font-size:${this.size}px;`
				if (this.color) {
					styles += `color:${this.color};`
				} else {
					// #ifdef MP-ALIPAY
					styles += `color:${this.theme==='dark'?'#d1d1d1':'#181818'};`
					// #endif
				}
				return styles
			},
			headerStyl() {
				let styles = ''
				if (this.background) {
					styles += `background:${this.background};`
				}
				return styles
			},
			maskStyl() {
				return `background:${this.maskBackground};z-index:${Number(this.zIndex-10)};`
			}
		},
		watch: {
			layer(val) {
				this.reset();
			},
			value(val) {
				if (val) {
					this.setDefaultOptions()
				}
			},
			options(val) {
				setTimeout(() => {
					this.initialize()
				}, 50)
			},
			fields(val) {
				setTimeout(() => {
					this.initialize()
				}, 50)
			},
			isShow: {
				handler(newVal) {
					if (newVal) {
						this.isInitShow = true;
						// #ifdef APP-NVUE
						this.openPicker();
						// #endif
					} else {
						// #ifdef APP-NVUE
						this.closePicker();
						// #endif
					}
				},
				immediate: true
			},
			show(val) {
				this.isShow = val;
			}
		},
		data() {
			//抖音小程序此属性有问题，设置为true,change事件可能不触发
			let immediate = true;
			// #ifdef MP-TOUTIAO
			immediate = false
			// #endif
			return {
				immediate,
				firstArr: [],
				secondArr: [],
				thirdArr: [],
				fourthArr: [],
				vals: [],
				nvueVals: [],
				// #ifndef APP-NVUE
				darkStyle: 'background-image: -webkit-linear-gradient(top, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6)), -webkit-linear-gradient(bottom, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
				indicatorStyl: 'border-color: #333;height: 44px;',
				darkBottomStyle: '',
				// #endif
				// #ifdef APP-NVUE
				darkStyle: 'background: linear-gradient(to bottom, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
				darkBottomStyle: 'background: linear-gradient(to top, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
				indicatorStyl: 'border-color: #333;height: 44px;border-top-width:0.5px;border-bottom-width:0.5px',
				// #endif
				tKey: 'text',
				vKey: 'value',
				cKey: 'children',
				isEnd: true,
				isShow: false,
				isInitShow: false
			};
		},
		methods: {
			// #ifdef APP-NVUE
			hiddenNvuePicker() {
				if (!this.$refs['fui_pkm_ani'] || !this.$refs['fui_pk_ani']) return;
				this._transtion('fui_pkm_ani', {
					transform: 'translateX(-100%)'
				}, 0)
				this._transtion('fui_pk_ani', {
					transform: 'translateY(100%)'
				}, 0)
			},
			// #endif
			initialize() {
				if (this.linkage) {
					this.getFields(this.fields)
					this.setLayerData(-1, 0, 0, 0);
				} else {
					this.initData()
				}
				this.$nextTick(() => {
					setTimeout(() => {
						this.setDefaultOptions()
					}, 50)
				})
			},
			getFields(vals) {
				if (!vals || vals.length === 0) return;
				this.tKey = vals[0] || 'text';
				this.vKey = vals[1] || 'value';
				this.cKey = vals[2] || 'children';
			},
			btnCancel(e) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif
				this.isShow = false;
				this.$emit('cancel', {
					param: this.param
				})
			},
			maskClick(e) {
				if (!this.maskClosable) return;
				this.btnCancel(e)
			},
			getValue(layer = 1) {
				let vals = this.vals;
				let result = {}
				if (this.linkage) {
					let data = this.options;
					const cKey = this.cKey;
					if (layer == 1) {
						result = data[vals[0]]
					} else if (layer == 2) {
						if (data[vals[0]][cKey])
							result = data[vals[0]][cKey][vals[1]]

					} else if (layer == 3) {
						if (data[vals[0]][cKey] && data[vals[0]][cKey][vals[1]][cKey])
							result = data[vals[0]][cKey][vals[1]][cKey][vals[2]]

					} else {
						if (data[vals[0]][cKey] && data[vals[0]][cKey][vals[1]][cKey] && data[vals[0]][cKey][vals[1]][cKey]
							[vals[2]][cKey])
							result = data[vals[0]][cKey][vals[1]][cKey][vals[2]][cKey][vals[3]]
					}
				} else {
					if (layer == 1) {
						result = this.firstArr[vals[0]] || ''
					} else if (layer == 2) {
						result = this.secondArr[vals[1]] || ''
					} else if (layer == 3) {
						result = this.thirdArr[vals[2]] || ''
					} else {
						result = this.fourthArr[vals[3]] || ''
					}
				}

				return result;
			},
			checkChildrenData(data, layer, first, second, third) {
				let arr = [];
				const children = this.cKey;
				if (layer == 1) {
					if (data[first])
						arr = data[first][children] || [];
				} else if (layer == 2) {
					if (data[first] && data[first][children] && data[first][children][second])
						arr = data[first][children][second][children] || [];
				} else {
					if (data[first] && data[first][children] && data[first][children][second] && data[first][children][
							second
						][children] && data[first][children][second][children][third])
						arr = data[first][children][second][children][third][children] || [];
				}
				return arr;
			},
			handleData(data, tKey) {
				tKey = tKey || this.tKey;
				let arr = [];
				if (data && data.length > 0) {
					for (let item of data) {
						arr.push(item[tKey]);
					}
				}
				return arr;
			},
			initData() {
				let data = this.options;
				if (!data || data.length === 0) {
					this.firstArr = [];
					this.secondArr = [];
					this.thirdArr = [];
					this.fourthArr = [];
					return;
				}
				if (this.layer == 1 && !Array.isArray(data[0])) {
					this.firstArr = data
				} else {
					this.firstArr = data[0]
				}
				if (this.layer == 2) {
					this.secondArr = data[1]
				} else if (this.layer == 3) {
					this.secondArr = data[1]
					this.thirdArr = data[2]
				} else if (this.layer == 4) {
					this.secondArr = data[1]
					this.thirdArr = data[2]
					this.fourthArr = data[3]
				}
			},
			setLayerData(reset, first, second, third) {
				let data = this.options;
				if (!data || data.length === 0) {
					this.firstArr = [];
					this.secondArr = [];
					this.thirdArr = [];
					this.fourthArr = [];
					return;
				};
				if (this.layer == 1) {
					this.firstArr = this.handleData(data)
				} else if (this.layer == 2) {
					if (reset == -1)
						this.firstArr = this.handleData(data)

					this.secondArr = this.handleData(this.checkChildrenData(data, 1, first))
				} else if (this.layer == 3) {
					if (reset == -1)
						this.firstArr = this.handleData(data)

					if (reset == 1 || reset == -1)
						this.secondArr = this.handleData(this.checkChildrenData(data, 1, first))

					this.thirdArr = this.handleData(this.checkChildrenData(data, 2, first, second))
				} else {
					if (reset == -1)
						this.firstArr = this.handleData(data)

					if (reset == 1 || reset == -1)
						this.secondArr = this.handleData(this.checkChildrenData(data, 1, first))

					if (reset == 1 || reset == -1 || reset == 2)
						this.thirdArr = this.handleData(this.checkChildrenData(data, 2, first, second))

					this.fourthArr = this.handleData(this.checkChildrenData(data, 3, first, second, third))
				}
			},
			reset() {
				const vals = [
					[0],
					[0, 0],
					[0, 0, 0],
					[0, 0, 0, 0]
				][Number(this.layer) - 1]
				this.vals = [...vals];
				// #ifdef APP-NVUE
				this.nvueVals = [...vals]
				// #endif
			},
			open() {
				this.isShow = true;
			},
			//手动关闭弹框
			close() {
				this.isShow = false;
			},
			setDefaultOptions() {
				let values = this.value;
				if (this.layer == 1 && !Array.isArray(values)) {
					values = values ? [values] : []
				}
				let vals = [];
				let txtArr = this.firstArr;
				const len = values.length;
				const index = txtArr.indexOf(values[0])
				if (len > 0 && index !== -1) {
					vals.push(index)
					for (let i = 1; i < len; i++) {
						if (i === 1) {
							if (this.linkage) {
								this.secondArr = this.handleData(this.checkChildrenData(this.options, 1, vals[0]))
							}
							vals.push(this.secondArr.indexOf(values[i]))
						} else if (i === 2) {
							if (this.linkage) {
								this.thirdArr = this.handleData(this.checkChildrenData(this.options, 2, vals[0],
									vals[1]))
							}
							vals.push(this.thirdArr.indexOf(values[i]))
						} else {
							if (this.linkage) {
								this.fourthArr = this.handleData(this.checkChildrenData(this.options, 3, vals[0],
									vals[1], vals[2]))
							}
							vals.push(this.fourthArr.indexOf(values[i]))
						}
					}
					if (this.vals.join('') === vals.join('')) return;
					this.vals = []
					this.$nextTick(() => {
						setTimeout(() => {
							this.vals = [...vals];
							// #ifdef APP-NVUE
							this.nvueVals = [...vals]
							// #endif
						}, 200)
					})
				} else {
					this.vals = []
					this.$nextTick(() => {
						setTimeout(() => {
							this.reset()
						}, 200)
					})
				}
			},
			setOneLayers(value) {
				if (this.vals[0] != value[0]) {
					this.vals = value;
				}
			},
			setTwoLayers(value) {
				if (this.vals[0] != value[0]) {
					this.setLayerData(0, value[0])
					this.vals = [value[0], 0]
				} else {
					this.vals = value
				}
			},
			setThreeLayers(value) {
				if (this.vals[0] != value[0]) {
					this.setLayerData(1, value[0], 0)
					this.vals = [value[0], 0, 0]
				} else if (this.vals[1] != value[1]) {
					this.setLayerData(0, value[0], value[1])
					this.vals = [value[0], value[1], 0]
				} else {
					this.vals = value
				}
			},
			setFourLayers(value) {
				if (this.vals[0] != value[0]) {
					this.setLayerData(1, value[0], 0, 0)
					this.vals = [value[0], 0, 0, 0]
				} else if (this.vals[1] != value[1]) {
					this.setLayerData(2, value[0], value[1], 0)
					this.vals = [value[0], value[1], 0, 0]
				} else if (this.vals[2] != value[2]) {
					this.setLayerData(0, value[0], value[1], value[2])
					this.vals = [value[0], value[1], value[2], 0]
				} else {
					this.vals = value
				}
			},
			emitChange() {
				let text = [];
				let value = [];
				let result = '';
				if (this.options.length > 0) {
					if (this.layer == 1) {
						const vals = this.getValue()
						if (this.linkage) {
							text = vals[this.tKey];
							value = vals[this.vKey];
						} else {
							text = vals;
							value = vals;
						}
						result = text;
					} else if (this.layer == 2) {
						const vals = this.getValue();
						const vals2 = this.getValue(2);
						if (this.linkage) {
							text = [vals[this.tKey], vals2[this.tKey] || ''];
							value = [vals[this.vKey], vals2[this.vKey] || ''];
						} else {
							text = [vals, vals2 || ''];
							value = [vals, vals2 || ''];
						}
						result = text.join('');
					} else if (this.layer == 3) {
						const vals = this.getValue();
						const vals2 = this.getValue(2);
						const vals3 = this.getValue(3);
						if (this.linkage) {
							text = [vals[this.tKey], vals2[this.tKey] || '', vals3[this.tKey] || ''];
							value = [vals[this.vKey], vals2[this.vKey] || '', vals3[this.vKey] || ''];
						} else {
							text = [vals, vals2 || '', vals3 || ''];
							value = [vals, vals2 || '', vals3 || ''];
						}
						result = text.join('');
					} else {
						const vals = this.getValue();
						const vals2 = this.getValue(2);
						const vals3 = this.getValue(3);
						const vals4 = this.getValue(4);
						if (this.linkage) {
							text = [vals[this.tKey], vals2[this.tKey] || '', vals3[this.tKey] || '', vals4[this.tKey] ||
								''
							];
							value = [vals[this.vKey], vals2[this.vKey] || '', vals3[this.vKey] || '', vals4[this.vKey] ||
								''
							];
						} else {
							text = [vals, vals2 || '', vals3 || '', vals4 || ''];
							value = [vals, vals2 || '', vals3 || '', vals4 || ''];
						}
						result = text.join('');
					}
				}
				// #ifdef APP-NVUE
				this.nvueVals = [...this.vals];
				// #endif
				this.$emit('change', {
					text: text,
					value: value,
					index: this.vals,
					result: result,
					param: this.param
				})
			},
			waitForTrigger(index = 0) {
				if (this.isEnd) {
					this.emitChange()
				} else {
					index++
					// #ifdef H5
					if (index >= 10) {
						this.isEnd = true
					}
					// #endif
					// #ifndef H5
					if (index >= 20) {
						this.isEnd = true
					}
					// #endif
					setTimeout(() => {
						this.waitForTrigger(index)
					}, 50)
				}
			},
			btnConfirm(e) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif
				setTimeout(() => {
					if (this.isClose) {
						this.isShow = false;
					}
					this.waitForTrigger()
				}, 50)
			},
			pickerChange(e) {
				let value = e.detail.value;
				if (!this.isInitShow || value.length != this.layer) return;
				if (this.linkage) {
					if (this.layer == 1) {
						this.setOneLayers(value)
					} else if (this.layer == 2) {
						this.setTwoLayers(value)
					} else if (this.layer == 3) {
						this.setThreeLayers(value)
					} else {
						this.setFourLayers(value)
					}
				} else {
					this.vals = value;
				}
				this.isEnd = true;
			},
			pickerstart() {
				this.isEnd = false
			},
			// #ifdef APP-NVUE
			openPicker() {
				setTimeout(() => {
					this.vals = [...this.nvueVals];
					this._animation(true);
				}, 20);
			},
			closePicker() {
				this._animation(false);
			},
			_transtion(ref, styles, duration, callback) {
				animation.transition(
					this.$refs[ref].ref, {
						styles: styles,
						duration: duration,
						needLayout: false,
						delay: 0
					}, (e) => {
						callback && callback()
					});
			},
			_animation(type) {
				if (!this.$refs['fui_pkm_ani'] || !this.$refs['fui_pk_ani']) return;
				if (type) {
					this._transtion('fui_pkm_ani', {
						transform: 'translateX(0)'
					}, 0, () => {
						this._transtion('fui_pkm_ani', {
							opacity: 1
						}, 250)
					})
				} else {
					this._transtion('fui_pkm_ani', {
						opacity: 0
					}, 250, () => {
						this._transtion('fui_pkm_ani', {
							transform: 'translateX(-100%)'
						}, 0)
					})
				}
				this._transtion('fui_pk_ani', {
					transform: `translateY(${type ? '0' : '100%'})`
				}, 250)
			},
			// #endif
			stop(e) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif
			}
		}
	}
</script>

<style scoped>
	.fui-picker__mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transition: all 0.25s ease-in-out;
		visibility: hidden;
		opacity: 0;
		/* #endif */
		/* #ifdef APP-NVUE */
		transition-property: opacity;
		transition-timing-function: ease-in-out;
		transition-duration: .25s;
		opacity: 0.001;
		/* #endif */
	}

	.fui-picker__mask-show {
		/* #ifndef APP-NVUE */
		visibility: visible;
		/* #endif */
		opacity: 1;
	}

	.fui-picker__content {
		/* #ifndef APP-NVUE */
		width: 100%;
		visibility: hidden;
		/* #endif */
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 100%, 0);
		transition: all 0.25s ease-in-out;
		/* #endif */

		/* #ifdef APP-NVUE */
		transition-property: transform;
		transition-duration: .25s;
		transform: translateY(100%);
		/* #endif */
		transform-origin: center center;
		flex-direction: column;
		background: #fff;
	}

	.fui-picker__content-dark {
		background: #222;
	}

	.fui-picker__content-show {
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 0, 0);
		visibility: visible;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateY(0);
		/* #endif */
	}

	.fui-picker__radius {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		overflow: hidden;
	}

	.fui-picker__header {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding: 0 20rpx;
		background: #fff;
		position: relative;

		/* #ifdef APP-NVUE */
		border-bottom-width: 0.5px;
		border-bottom-color: #eee;
		border-bottom-style: solid;
		/* #endif */
	}

	.fui-picker__header-dark {
		background: #222;
		border-bottom-color: #333;
	}

	/* #ifndef APP-NVUE */
	.fui-picker__header::after {
		content: '';
		position: absolute;
		border-bottom: 1px solid #eee;
		transform: scaleY(0.5) translateZ(0);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.fui-picker__header-dark::after {
		border-bottom-color: #333;
	}

	/* #endif */

	.fui-picker__btn-cancel,
	.fui-picker__btn-sure {
		font-weight: normal;
		height: 88rpx;
		padding: 0 24rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		text-align: center;
		/* #ifdef APP-NVUE  */
		line-height: 88rpx;
		/* #endif */

		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-picker__btn-cancel:active {
		opacity: .5;
	}

	.fui-picker__btn-sure:active {
		opacity: .5;
	}

	.fui-picker__title {
		font-weight: normal;
		font-size: 28rpx;
		flex: 1;
		padding: 0 24rpx;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}


	.fui-pk__title-color {
		color: #333333;
	}

	.fui-pk__title-color_dark {
		color: #A3A3A3;
	}

	.fui-pk__cancel-color {
		color: #181818;
	}

	.fui-pk__cancel-color_dark {
		color: #D1D1D1;
	}

	/* #ifndef APP-NVUE */
	.fui-pk__sure-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
	.fui-picker__view {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		height: 520rpx;
	}

	.fui-picker__text {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: block;
		white-space: nowrap;
		box-sizing: border-box;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		line-height: 44px;
		/* #endif */
		text-align: center;
		font-size: 16px;
		font-weight: normal;
		color: #181818;
		flex: 1;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0 4rpx;
	}


	.fui-picker__color-dark {
		color: #D1D1D1;
	}


	/* #ifndef APP-NVUE*/
	::v-deep .fui-picker__indicator {
		position: relative;
		border-color: transparent;
	}

	::v-deep .fui-picker__indicator::before {
		border-color: #333;
	}

	::v-deep .fui-picker__indicator::after {
		border-color: #333;
	}

	/* #endif */
</style>