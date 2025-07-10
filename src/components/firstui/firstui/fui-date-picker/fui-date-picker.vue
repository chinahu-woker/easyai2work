<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号：   9  144   06 0   5   MA5 56H1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-date__picker-wrap" @touchend="stop">
		<view class="fui-date__picker-mask" @touchmove.stop.prevent="stop" :class="{'fui-dpk__mask-show':isShow}"
			:style="maskStyl" ref="fui_dpkm_ani" @tap.stop="maskClick"></view>
		<!-- fix：此处key值可解决Nvue端动态切换背景不生效的问题 -->
		<view :key="theme" class="fui-date__picker-content"
			:class="{'fui-dpk__content-dark':theme==='dark','fui-dpk__content-light':theme!=='dark','fui-dpk__content-show':isShow,'fui-date__picker-radius':radius}"
			:style="{zIndex:zIndex}" ref="fui_dpk_ani">
			<view class="fui-date__picker-header"
				:class="{'fui-dpk__header-dark':theme==='dark','fui-date__picker-radius':radius}" :style="headerStyl">
				<text class="fui-dpk_btn-cancel"
					:class="[theme==='dark'?'fui-dpk__cancel-color_dark':'fui-dpk__cancel-color']" :style="cancelStyl"
					@tap.stop="btnCancel">{{cancelText}}</text>
				<text class="fui-date__picker-title"
					:class="[theme==='dark'?'fui-dpk__title-color_dark':'fui-dpk__title-color']"
					:style="titleStyl">{{title}}</text>
				<text class="fui-dpk__btn-sure" :class="{'fui-dpk__sure-color':!confirmColor}" :style="confrimStyl"
					@tap.stop="btnConfirm">{{confirmText}}</text>
			</view>
			<view class="fui-dpk__range-wrap" v-if="range">
				<view class="fui-dpk__range-inner"
					:class="[theme==='dark'?'fui-dpk__range-dark':'fui-dpk__range-light']">
					<text class="fui-dpk__range-text" :class="{'fui-dpk__range-active':isActive==1}" :style="startStyl"
						@tap.stop="rangeChange($event,1)">{{startDate.result || start}}</text>
					<text class="fui-dpk__range-text" :class="{'fui-dpk__range-active':isActive==2}" :style="endStyl"
						@tap.stop="rangeChange($event,2)">{{endDate.result || end}}</text>
				</view>
			</view>
			<view @touchstart.stop="pickerstart">
				<!--支付宝小程序不支持动态切换 picker-view-column ... 设置高度也不行-->
				<!-- #ifdef MP-ALIPAY -->
				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==1">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'年':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==2">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'年':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in months" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'月':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==3">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'年':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in months" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'月':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in days" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'日':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==4">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'年':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in months" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'月':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in days" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'日':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in hours" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'时':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==5">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'年':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in months" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'月':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in days" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'日':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in hours" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'时':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in minutes" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'分':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==6">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in hours" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'时':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in minutes" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'分':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==7">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in hours" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'时':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in minutes" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'分':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in seconds" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'秒':''}}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view :mask-style="theme==='dark'?darkStyle:''"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :value="vals" @change="pickerChange" v-if="type==8">
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in minutes" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'分':''}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view :style="contentStyl" v-for="(item,index) in seconds" :key="index"
							class="fui-date__picker-text" :class="{'fui-dpk__color-dark':theme==='dark'}">
							{{formatVal(item)}}{{unit?'秒':''}}
						</view>
					</picker-view-column>
				</picker-view>
				<!-- #endif -->

				<!-- #ifndef MP-ALIPAY -->
				<picker-view :mask-top-style="theme==='dark'?darkStyle:''"
					:mask-bottom-style="theme==='dark'?darkBottomStyle:''" :mask-style="theme==='dark'?darkStyle:''"
					:indicator-style="theme==='dark'?indicatorStyl:'height: 44px;border-top-width:0.5px;border-bottom-width:0.5px;'"
					:indicator-class="theme==='dark'?'fui-date__picker-indicator':''" class="fui-date__picker-view"
					:style="{height:height+'rpx'}" :key="theme+type" :value="vals" :immediate-change="immediate"
					@change="pickerChange">
					<picker-view-column v-if="dateType==1 || dateType==2 || dateType==3 || dateType==4 || dateType==5">
						<text :style="contentStyl" v-for="(item,index) in years" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'年':''}}</text>
					</picker-view-column>
					<picker-view-column v-if="dateType==2 || dateType==3 || dateType==4 || dateType==5">
						<text :style="contentStyl" v-for="(item,index) in months" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'月':''}}</text>
					</picker-view-column>
					<picker-view-column v-if="dateType==3 || dateType==4 || dateType==5">
						<text :style="contentStyl" v-for="(item,index) in days" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'日':''}}</text>
					</picker-view-column>
					<picker-view-column v-if="dateType==4 || dateType==5  || dateType==6  || dateType==7">
						<text :style="contentStyl" v-for="(item,index) in hours" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'时':''}}</text>
					</picker-view-column>
					<picker-view-column v-if="dateType==5  || dateType==6  || dateType==7 || dateType==8">
						<text :style="contentStyl" v-for="(item,index) in minutes" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'分':''}}</text>
					</picker-view-column>
					<picker-view-column v-if="dateType==7 || dateType==8">
						<text :style="contentStyl" v-for="(item,index) in seconds" :key="index"
							class="fui-date__picker-text"
							:class="{'fui-dpk__color-dark':theme==='dark'}">{{formatVal(item)}}{{unit?'秒':''}}</text>
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
		name: "fui-date-picker",
		emits: ['change', 'cancel'],
		props: {
			show: {
				type: Boolean,
				default: false
			},
			//可选日期类型：1-年 2-年月 3-年月日 4-年月日 时 5-年月日 时分 6-时分 7-时分秒 8-分秒
			type: {
				type: [Number, String],
				default: 1
			},
			value: {
				type: String,
				default: ''
			},
			valueEnd: {
				type: String,
				default: ''
			},
			minDate: {
				type: String,
				default: '2010-01-01'
			},
			maxDate: {
				type: String,
				default: '2030-12-31'
			},
			// 是否处理时分最小值 和 最大值，设为true则minDate 与maxDate 传入格式必须为：2030-12-31 23:59
			timeLimit: {
				type: Boolean,
				default: false
			},
			hourRange: {
				type: Array,
				default () {
					return [0, 23]
				}
			},
			minuteRange: {
				type: Array,
				default () {
					return [0, 59]
				}
			},
			secondRange: {
				type: Array,
				default () {
					return [0, 59]
				}
			},
			unit: {
				type: Boolean,
				default: true
			},
			range: {
				type: Boolean,
				default: false
			},
			start: {
				type: String,
				default: '起始日期'
			},
			end: {
				type: String,
				default: '结束日期'
			},
			showEnd: {
				type: Boolean,
				default: true
			},
			rangeBackground: {
				type: String,
				default: ''
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
			//点击确认按钮后是否立即关闭弹框
			isClose: {
				type: Boolean,
				default: true
			},
			//V2.3.0+ 是否自动赋值
			isAuto: {
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
				let styles = `font-size:${this.btnSize}rpx;`
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
			},
			initChange() {
				return `${this.type}_${this.value}_${this.minDate}_${this.maxDate}`
			},
			startStyl() {
				let style = ''
				let color = this.rangeBackground;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				if (this.isActive == 1 && color) {
					style = `background:${color};`
				}
				return style
			},
			endStyl() {
				let style = ''
				let color = this.rangeBackground;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				if (this.isActive == 2 && color) {
					style = `background:${color};`
				}
				return style
			}
		},
		watch: {
			initChange(val) {
				this.initialize()
			},
			hourRange(val) {
				//设置默认值？
				const vals = this.vals
				this.getHours(vals[0], vals[1], vals[2])
			},
			minuteRange(val) {
				const vals = this.vals
				this.getMinutes(vals[0], vals[1], vals[2], vals[3])
			},
			secondRange(val) {
				this.getSeconds()
			},
			isShow: {
				handler(newVal) {
					if (newVal) {
						this.isInitShow = true

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
			},
			type: {
				handler(val) {
					setTimeout(() => {
						this.dateType = val;
					}, 50)
				},
				immediate: true
			}
		},
		data() {
			let immediate = true;
			// #ifdef MP-TOUTIAO
			immediate = false
			// #endif
			return {
				immediate,
				years: [],
				months: [],
				days: [],
				hours: [],
				minutes: [],
				seconds: [],
				vals: [],
				nvueVals: [],
				values: [],
				minArr: [],
				maxArr: [],
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
				isEnd: true,
				isShow: false,
				isActive: 1,
				startDate: {},
				endDate: {},
				isInitShow: false,
				dateType: -1
			};
		},
		methods: {
			// #ifdef APP-NVUE
			hiddenNvuePicker() {
				if (!this.$refs['fui_dpkm_ani'] || !this.$refs['fui_dpk_ani']) return;
				this._transtion('fui_dpkm_ani', {
					transform: 'translateX(-100%)'
				}, 0)
				this._transtion('fui_dpk_ani', {
					transform: 'translateY(100%)'
				}, 0)
			},
			// #endif
			initialize() {
				this.reset();
				this.getDefaultOptions(this.value)
				const values = [...this.values]
				this.handleDate()
				setTimeout(() => {
					this.initData(values)
				}, 50)
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
			reset() {
				this.vals = [
					[0],
					[0, 0],
					[0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0, 0],
					[0, 0],
					[0, 0, 0],
					[0, 0]
				][Number(this.type) - 1]
				this.isActive = 1;
				this.startDate = {}
				this.endDate = {}
				// #ifdef APP-NVUE
				this.nvueVals = [...this.vals]
				// #endif
			},
			open() {
				this.isShow = true;
			},
			close() {
				this.isShow = false;
			},
			compareDate(start, end) {
				let type = Number(this.type)
				if (type == 1) {
					return Number(start) <= Number(end)
				}
				if (type == 8) {
					start = '00:' + start;
					end = '00:' + end;
				} else if (type == 2) {
					start = start + '-01'
					end = end + '-01'
				}

				start = start.replace(/\-/g, '/');
				end = end.replace(/\-/g, '/');

				if (start.indexOf('/') == -1) {
					start = `2001/01/01 ${start}`
					end = `2001/01/01 ${end}`
				}

				return new Date(start).getTime() <= new Date(end).getTime();
			},
			formatVal(num) {
				return num < 10 ? `0${num}` : num + '';
			},
			toArray(start, end) {
				return Array.from(new Array(end + 1).keys()).slice(start);
			},
			getStrCount(str) {
				const _str = String(str).replace(/\-/g, '/');
				let regex = new RegExp('/', 'g');
				let result = _str.match(regex);
				return !result ? 0 : result.length;
			},
			getValueToDate(val) {
				let values = [];
				let type = Number(this.type)
				if (type == 1 && this.getStrCount(val) === 0) {
					return [Number(val), -1, -1, -1, -1, -1]
				}
				if (type == 8)
					val = '00:' + val;
				let format = val.replace(/\-/g, '/');
				if (this.getStrCount(val) === 1) {
					format += '/01'
				}
				if (format.indexOf('/') == -1) {
					format = `2001/01/01 ${format}`
				}
				try {
					const time = new Date(format);
					const year = time.getFullYear();
					const month = time.getMonth() + 1;
					const day = time.getDate();
					const hour = time.getHours();
					const minute = time.getMinutes();
					const second = time.getSeconds();
					values = [year, month, day, hour, minute, second]

				} catch (e) {
					//TODO handle the exception
					console.log('默认日期时间格式有误！')
				}
				return values;
			},
			getRangeInitRes(vals) {
				const type = Number(this.type);
				let d = {
					param: this.param
				}
				switch (type) {
					case 1:
						d.year = vals[0]
						d.result = d.year
						break;
					case 2:
						d.year = vals[0]
						d.month = this.formatVal(vals[1])
						d.result = `${d.year}-${d.month}`
						break;
					case 3:
						d.year = vals[0]
						d.month = this.formatVal(vals[1])
						d.day = this.formatVal(vals[2])
						d.result = `${d.year}-${d.month}-${d.day}`
						break;
					case 4:
						d.year = vals[0]
						d.month = this.formatVal(vals[1])
						d.day = this.formatVal(vals[2])
						d.hour = this.formatVal(vals[3])
						d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:00`
						break;
					case 5:
						// 5-年月日 时分 6-时分 7-时分秒 8-分秒
						d.year = vals[0]
						d.month = this.formatVal(vals[1])
						d.day = this.formatVal(vals[2])
						d.hour = this.formatVal(vals[3])
						d.minute = this.formatVal(vals[4])
						d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}`
						break;
					case 6:
						d.hour = this.formatVal(vals[3])
						d.minute = this.formatVal(vals[4])
						d.result = `${d.hour}:${d.minute}`
						break;
					case 7:
						d.hour = this.formatVal(vals[3])
						d.minute = this.formatVal(vals[4])
						d.second = this.formatVal(vals[5])
						d.result = `${d.hour}:${d.minute}:${d.second}`
						break;
					case 8:
						d.minute = this.formatVal(vals[4])
						d.second = this.formatVal(vals[5])
						d.result = `${d.minute}:${d.second}`
						break;
					default:
						break;
				}
				return d
			},
			getDefaultOptions(val) {
				//区间选择时默认值必须传值起始时间，否则无效
				if (!val || val === true || val === 'true') {
					this.values = [];
					return;
				}
				if (this.range) {
					const startValues = this.getValueToDate(val);
					if (this.valueEnd) {
						const endValues = this.getValueToDate(this.valueEnd);
						if (endValues.join(',') != this.values.join(',') && this.showEnd) {
							this.values = endValues;
						}
						if (!this.showEnd && startValues.join(',') != this.values.join(',')) {
							this.values = startValues;
						}
						this.startDate = this.getRangeInitRes(startValues);
						this.endDate = this.getRangeInitRes(endValues);
						this.isActive = this.showEnd ? 2 : 1;
					} else {
						if (startValues.join(',') != this.values.join(',')) {
							this.values = startValues;
						}
						this.startDate = this.getRangeInitRes(startValues);
					}
				} else {
					const sVals = this.getValueToDate(val);
					if (sVals.join(',') != this.values.join(',')) {
						this.values = sVals;
					}
				}
			},
			toDate(date, def, isMin) {
				if (date === true || date === 'true' || !date) {
					date = def
				} else {
					const d = date.replace(/\-/g, '/')
					const arr = d.split('/')
					if (arr.length == 1) {
						date = isMin ? `${d}/01/01` : `${d}/12/31`
					} else if (arr.length == 2) {
						if (isMin) {
							date = `${d}/01`
						} else {
							let max = new Date(arr[0], arr[1], 0).getDate();
							date = `${d}/${max}`
						}
					}
				}
				return new Date(date.replace(/\-/g, '/'))
			},
			handleDate() {
				const min = this.toDate(this.minDate, '2010-01-01', true);
				const max = this.toDate(this.maxDate, '2030-12-31', false);

				this.minArr = [min.getFullYear(), min.getMonth() + 1, min.getDate(), min.getHours(), min.getMinutes(), min
					.getSeconds()
				];
				this.maxArr = [max.getFullYear(), max.getMonth() + 1, max.getDate(), max.getHours(), max.getMinutes(), max
					.getSeconds()
				];
			},
			getYears() {
				let min = this.minArr[0];
				let max = this.maxArr[0];
				max = max < min ? min : max
				this.years = this.toArray(min, max);
			},
			getMonths(index) {
				let year = this.years[index]
				let min = 1;
				let max = 12;
				if (year == this.minArr[0]) {
					min = this.minArr[1]
				}
				if (year == this.maxArr[0]) {
					max = this.maxArr[1]
				}
				max = max < min ? min : max
				this.months = this.toArray(min, max);
			},
			getDays(index, idx) {
				let min = 1;
				let year = this.years[index]
				let month = this.months[idx]
				let max = new Date(year, month, 0).getDate();
				if (year == this.minArr[0] && month == this.minArr[1]) {
					min = this.minArr[2]
				}
				if (year == this.maxArr[0] && month == this.maxArr[1]) {
					max = this.maxArr[2]
				}
				max = !max || max < min ? min : max
				this.days = this.toArray(min, max);
			},
			getHours(yi, mi, di) {
				let range = this.hourRange || [0, 23];
				let min = Number(range[0] || 0);
				let max = Number(range[1] || 23);
				min = Math.floor(min < 0 || min > 23 ? 0 : min);
				max = Math.floor(max < 0 || max > 23 ? 23 : max);
				max = max < min ? min : max
				if (this.timeLimit) {
					const mins = this.minArr
					const maxs = this.maxArr
					const year = this.years[yi]
					const month = this.months[mi]
					const day = this.days[di]

					if (year == mins[0] && month == mins[1] && day == mins[2]) {
						min = Math.max(min, mins[3])
					}

					if (year == maxs[0] && month == maxs[1] && day == maxs[2]) {
						max = Math.min(max, maxs[3])
					}
				}
				this.hours = this.toArray(min, max);
			},
			getMinutes(yi, mi, di, hi) {
				let range = this.minuteRange || [0, 59];
				let min = Number(range[0] || 0);
				let max = Number(range[1] || 59);
				min = Math.floor(min < 0 || min > 59 ? 0 : min);
				max = Math.floor(max < 0 || max > 59 ? 59 : max);
				max = max < min ? min : max
				if (this.timeLimit) {
					const mins = this.minArr
					const maxs = this.maxArr
					const year = this.years[yi]
					const month = this.months[mi]
					const day = this.days[di]
					const hour = this.hours[hi]

					if (year == mins[0] && month == mins[1] && day == mins[2] && hour == mins[3]) {
						min = Math.max(min, mins[4])
					}

					if (year == maxs[0] && month == maxs[1] && day == maxs[2] && hour == maxs[3]) {
						max = Math.min(max, maxs[4])
					}
				}
				this.minutes = this.toArray(min, max);
			},
			getSeconds() {
				let range = this.secondRange || [0, 59];
				let min = Number(range[0] || 0);
				let max = Number(range[1] || 59);
				min = Math.floor(min < 0 || min > 59 ? 0 : min);
				max = Math.floor(max < 0 || max > 59 ? 59 : max);
				max = max < min ? min : max
				this.seconds = this.toArray(min, max);
			},
			getIndex(arr, val) {
				if (!arr || arr.length === 0 || !val) return 0;
				let index = arr.indexOf(val);
				return index === -1 ? 0 : index;
			},
			initData(values) {
				let type = Number(this.type);
				let index = 0;
				let idx = 0;
				if (type < 6) {
					this.getYears()
					index = this.getIndex(this.years, values[0]);
					if (type > 1) {
						this.getMonths(index)
						idx = this.getIndex(this.months, values[1]);
						type > 2 && this.getDays(index, idx);
					}
				}

				let di = this.getIndex(this.days, values[2]);
				type > 3 && type < 8 && this.getHours(index, idx, di)
				let hi = this.getIndex(this.hours, values[3]);
				type > 4 && this.getMinutes(index, idx, di, hi)
				type > 6 && this.getSeconds()
				this.$nextTick(() => {
					setTimeout(() => {
						let mi = this.getIndex(this.minutes, values[4])
						let si = this.getIndex(this.seconds, values[5])
						this.vals = [
							[index],
							[index, idx],
							[index, idx, di],
							[index, idx, di, hi],
							[index, idx, di, hi, mi],
							[hi, mi],
							[hi, mi, si],
							[mi, si]
						][type - 1]
						// #ifdef APP-NVUE
						this.nvueVals = [...this.vals]
						// #endif
					}, 150)
				})
			},
			getResult() {
				const vals = this.vals;
				const type = Number(this.type);
				let d = {
					param: this.param
				}
				let index = 0;
				let idx = 0;
				let mc = 0;
				let dc = 0;
				switch (type) {
					case 1:
						d.year = this.years[vals[0]]
						d.result = d.year
						break;
					case 2:
						d.year = this.years[vals[0]]
						index = this.months.length - 1;
						mc = vals[1];
						d.month = this.formatVal(this.months[mc > index ? index : mc])
						d.result = `${d.year}-${d.month}`
						break;
					case 3:
						d.year = this.years[vals[0]]
						index = this.months.length - 1;
						idx = this.days.length - 1;
						mc = vals[1];
						dc = vals[2];
						d.month = this.formatVal(this.months[mc > index ? index : mc])
						d.day = this.formatVal(this.days[dc > idx ? idx : dc])
						d.result = `${d.year}-${d.month}-${d.day}`
						break;
					case 4:
						d.year = this.years[vals[0]]
						index = this.months.length - 1;
						idx = this.days.length - 1;
						mc = vals[1];
						dc = vals[2];
						d.month = this.formatVal(this.months[mc > index ? index : mc])
						d.day = this.formatVal(this.days[dc > idx ? idx : dc])
						d.hour = this.formatVal(this.hours[vals[3]])
						d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:00`
						break;
					case 5:
						// 5-年月日 时分 6-时分 7-时分秒 8-分秒
						d.year = this.years[vals[0]]
						index = this.months.length - 1;
						idx = this.days.length - 1;
						mc = vals[1];
						dc = vals[2];
						d.month = this.formatVal(this.months[mc > index ? index : mc])
						d.day = this.formatVal(this.days[dc > idx ? idx : dc])
						d.hour = this.formatVal(this.hours[vals[3]])
						d.minute = this.formatVal(this.minutes[vals[4]])
						d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}`
						break;
					case 6:
						d.hour = this.formatVal(this.hours[vals[0]])
						d.minute = this.formatVal(this.minutes[vals[1]])
						d.result = `${d.hour}:${d.minute}`
						break;
					case 7:
						d.hour = this.formatVal(this.hours[vals[0]])
						d.minute = this.formatVal(this.minutes[vals[1]])
						d.second = this.formatVal(this.seconds[vals[2]])
						d.result = `${d.hour}:${d.minute}:${d.second}`
						break;
					case 8:
						d.minute = this.formatVal(this.minutes[vals[0]])
						d.second = this.formatVal(this.seconds[vals[1]])
						// d.result = `00:${d.minute}:${d.second}`
						d.result = `${d.minute}:${d.second}`
						break;
					default:
						break;
				}
				return d
			},
			emitChange() {
				let data = {};
				if (this.range) {
					data = {
						startDate: this.startDate,
						endDate: this.endDate
					}
				} else {
					data = this.getResult()
				}
				// #ifdef APP-NVUE
				this.nvueVals = [...this.vals];
				// #endif
				setTimeout(() => {
					this.$emit('change', data)
				}, 0)
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
			toast(text) {
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			btnConfirm(e) {
				// #ifdef APP-NVUE
				e.stopPropagation && e.stopPropagation();
				// #endif
				if (this.range) {
					//判断选择结果
					let start = this.startDate.result;
					let end = this.endDate.result;
					if (!start) {
						if (this.isAuto) {
							this.startDate = this.getResult()
							if (!end) {
								this.isActive = 2
								this.toast(`请选择${this.end}`)
								return;
							} else {
								start = this.startDate.result;
							}
						} else {
							this.toast(`请选择${this.start}`)
							return;
						}
					} else if (start && !end) {
						if (this.isAuto) {
							this.endDate = this.getResult()
							end = this.endDate.result;
						} else {
							this.isActive = 2
							this.toast(`请选择${this.end}`)
							return;
						}
					}
					if (!this.compareDate(start, end)) {
						this.toast(`${this.end}不能小于${this.start}`)
						return;
					}
				}
				setTimeout(() => {
					if (this.isClose) {
						this.isShow = false;
					}
					this.waitForTrigger()
				}, 80)
			},
			pickerChange(e) {
				//1-年 2-年月 3-年月日 4-年月日 时 5-年月日 时分 6-时分 7-时分秒 8-分秒
				let value = e.detail.value;
				let type = Number(this.type)
				const layer = [1, 2, 3, 4, 5, 2, 3, 2][type - 1]
				if (!this.isInitShow) return;
				if (type > 1 && type < 6) {
					if (value[0] != this.vals[0]) {
						this.getMonths(value[0])
						if (type > 2) {
							this.getDays(value[0], value[1])
						}
						if (type > 3) {
							this.getHours(value[0], value[1], value[2])
							if (type == 5) {
								this.getMinutes(value[0], value[1], value[2], value[3])
							}
						}
					} else if (value[1] != this.vals[1] && type > 2) {
						this.getDays(value[0], value[1])
						if (type > 3) {
							this.getHours(value[0], value[1], value[2])
							if (type == 5) {
								this.getMinutes(value[0], value[1], value[2], value[3])
							}
						}
					} else if (value[2] != this.vals[2] && type > 3) {
						this.getHours(value[0], value[1], value[2])
						if (type == 5) {
							this.getMinutes(value[0], value[1], value[2], value[3])
						}
					} else if (value[3] != this.vals[3] && type > 4) {
						this.getMinutes(value[0], value[1], value[2], value[3])
					}
				}
				this.vals = value;
				if (this.range) {
					setTimeout(() => {
						if (this.isActive == 1) {
							this.startDate = this.getResult()
						} else {
							this.endDate = this.getResult()
						}
					}, 50)
				}
				this.isEnd = true;
			},
			pickerstart() {
				this.isEnd = false
			},
			setRangeDefValue(values) {
				const type = Number(this.type);
				let index = 0;
				let idx = 0;
				if (type < 6) {
					index = this.getIndex(this.years, values[0]);
					if (type > 1) {
						idx = this.getIndex(this.months, values[1]);
					}
				}
				let di = this.getIndex(this.days, values[2]);
				let hi = this.getIndex(this.hours, values[3]);
				let mi = this.getIndex(this.minutes, values[4])
				let si = this.getIndex(this.seconds, values[5])
				setTimeout(() => {
					this.vals = [
						[index],
						[index, idx],
						[index, idx, di],
						[index, idx, di, hi],
						[index, idx, di, hi, mi],
						[hi, mi],
						[hi, mi, si],
						[mi, si]
					][type - 1]
				}, 50)
			},
			rangeChange(e, type) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif
				this.isActive = type;
				let values = []
				if (type == 1) {
					const start = this.startDate.result;
					if (start) values = this.getValueToDate(start);
				} else {
					const end = this.endDate.result;
					if (end) values = this.getValueToDate(end);
				}
				if (values.length > 0) this.setRangeDefValue(values);
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
					}, () => {
						callback && callback()
					});
			},
			_animation(type) {
				if (!this.$refs['fui_dpkm_ani'] || !this.$refs['fui_dpk_ani']) return;
				if (type) {
					this._transtion('fui_dpkm_ani', {
						transform: 'translateX(0)'
					}, 0, () => {
						this._transtion('fui_dpkm_ani', {
							opacity: 1
						}, 250)
					})
				} else {
					this._transtion('fui_dpkm_ani', {
						opacity: 0
					}, 250, () => {
						this._transtion('fui_dpkm_ani', {
							transform: 'translateX(-100%)'
						}, 0)
					})
				}
				this._transtion('fui_dpk_ani', {
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
	.fui-date__picker-mask {
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

	.fui-dpk__mask-show {
		/* #ifndef APP-NVUE */
		visibility: visible;
		/* #endif */
		opacity: 1;
	}

	.fui-date__picker-content {
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
	}


	.fui-dpk__content-show {
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 0, 0);
		visibility: visible;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateY(0);
		/* #endif */
	}

	.fui-dpk__content-light {
		background-color: #fff;
	}

	.fui-dpk__content-dark {
		background-color: #222;
		opacity: 1;
	}

	.fui-date__picker-radius {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		overflow: hidden;
	}

	.fui-date__picker-header {
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

	.fui-dpk__header-dark {
		background: #222;
		border-bottom-color: #333;
	}

	/* #ifndef APP-NVUE */
	.fui-date__picker-header::after {
		content: '';
		position: absolute;
		border-bottom: 1px solid #eee;
		transform: scaleY(0.5) translateZ(0);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.fui-dpk__header-dark::after {
		border-bottom-color: #333;
	}

	/* #endif */

	.fui-dpk__range-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 16rpx 32rpx;
	}

	.fui-dpk__range-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 560rpx;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 2px;
	}

	.fui-dpk__range-light {
		background: #fff;
	}

	.fui-dpk__range-dark {
		background: #333;
	}

	.fui-dpk__range-text {
		/* #ifndef APP-NVUE */
		display: block;
		display: flex;
		white-space: nowrap;
		/* #endif */
		font-size: 24rpx;
		color: #7F7F7F;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1;
		border-radius: 16rpx;
		height: 56rpx;
		/* #ifdef APP-NVUE */
		line-height: 56rpx;
		/* #endif */
		font-weight: normal;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-dpk__range-active {
		color: #fff;
		/* #ifndef APP-NVUE */
		background: var(--fui-color-primary, #465CFF);
		/* #endif */
	}


	.fui-dpk_btn-cancel,
	.fui-dpk__btn-sure {
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
		/* #ifdef APP-NVUE */
		line-height: 88rpx;
		/* #endif */

		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-dpk_btn-cancel:active {
		opacity: .5;
	}

	.fui-dpk__btn-sure:active {
		opacity: .5;
	}

	.fui-date__picker-title {
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


	.fui-dpk__title-color {
		color: #333333;
	}

	.fui-dpk__title-color_dark {
		color: #A3A3A3;
	}

	.fui-dpk__cancel-color {
		color: #181818;
	}

	.fui-dpk__cancel-color_dark {
		color: #D1D1D1;
	}

	/* #ifndef APP-NVUE */
	.fui-dpk__sure-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
	.fui-date__picker-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		height: 520rpx;
	}

	.fui-date__picker-text {
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


	.fui-dpk__color-dark {
		color: #D1D1D1;
	}


	/* #ifndef APP-NVUE*/
	::v-deep .fui-date__picker-indicator {
		position: relative;
		border-color: transparent;
	}

	::v-deep .fui-date__picker-indicator::before {
		border-color: #333;
	}

	::v-deep .fui-date__picker-indicator::after {
		border-color: #333;
	}

	/* #endif */
</style>