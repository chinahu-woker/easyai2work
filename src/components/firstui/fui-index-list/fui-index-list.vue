<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号：   9  1   4 4 060 5MA556  H1  K X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-index__list" ref="fui_index_list" id="fui_index_list">
		<!-- #ifdef APP-NVUE -->
		<list class="fui-index__list-sv" :scrollable="true" :show-scrollbar="false" :loadmoreoffset="10"
			@loadmore="scrolltolower">
			<cell>
				<slot></slot>
			</cell>

			<!-- #ifdef VUE2 -->
			<template v-for="(list, idx) in lists">
				<!-- #endif -->
				<!-- #ifdef VUE3 -->
				<template v-for="(list, idx) in lists" :key="list.key">
					<!-- #endif -->
					<header :ref="'fui_il_letter_' + idx">
						<view class="fui-index__list-letter" :class="{'fui-il__key-bg':!background}"
							:style="{background:background}">
							<text class="fui-il__letter-text"
								:style="{color:color}">{{list.descr || list.letter}}</text>
						</view>
					</header>
					<!-- #ifdef VUE2 -->
					<cell :key="list.key">
						<!-- #endif -->
						<!-- #ifdef VUE3 -->
						<cell>
							<!-- #endif -->
							<!-- #endif -->
							<!-- #ifndef APP-NVUE -->
							<scroll-view class="fui-index__list-sv" :scroll-y="true" :scroll-into-view="scrollViewId"
								@scrolltolower="scrolltolower">
								<slot></slot>
								<view :id="'fui_il_letter_'+idx" v-for="(list, idx) in lists" :key="list.key">
									<view class="fui-index__list-letter" :class="{'fui-il__key-bg':!background}"
										:style="{background:background}">
										<text class="fui-il__letter-text"
											:style="{color:color}">{{list.descr || list.letter}}</text>
									</view>
									<!-- #endif -->
									<!-- 解构插槽 item项样式内容自定义 -->
									<view v-if="custom">
										<view v-for="(model,index) in list.data" :key="index" @tap="onTap(idx,index)">
											<slot name="item" :model="model" :idx="idx" :index="index"
												:last="list.data.length-1===index" :isSelect="isSelect" :isSrc="isSrc"
												:subRight="subRight"></slot>
										</view>
									</view>
									<view v-else>
										<f-index-list-item @itemClick="onClick" :model="model" :idx="idx" :index="index"
											:last="list.data.length-1===index" :isSelect="isSelect"
											:borderColor="borderColor" :selectedColor="selectedColor" :isSrc="isSrc"
											:subRight="subRight" v-for="(model,index) in list.data" :key="index">
										</f-index-list-item>
									</view>
									<!-- #ifndef APP-NVUE -->
								</view>
								<slot name="footer"></slot>
							</scroll-view>
							<!-- #endif -->
							<!-- #ifdef APP-NVUE -->
						</cell>
				</template>
				<cell>
					<slot name="footer"></slot>
				</cell>
		</list>
		<!-- #endif -->
		<!-- #ifndef VUE3 -->
		<view class="fui-il__indicator" :class="{'fui-il__nvue-android':nvueAndroid}"
			:style="{ top: indicators[touchmoveIndex] + 'px' }" v-if="touching && touchmoveIndex!==-1">
			<view class="fui-il__indicator-after"></view>
			<text class="fui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
		</view>
		<!-- #endif -->

		<!-- #ifdef VUE3 -->
		<!-- #ifndef APP-NVUE -->
		<view class="fui-il__indicator" :class="{'fui-il__nvue-android':nvueAndroid}"
			:style="{ top: indicators[touchmoveIndex] + 'px' }" v-if="touching && touchmoveIndex!==-1">
			<view class="fui-il__indicator-after"></view>
			<text class="fui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-il__indicator" :class="{'fui-il__nvue-android':nvueAndroid}"
			:style="{ top: idtHeight/2 + 'px' }" v-if="touching && touchmoveIndex!==-1">
			<view class="fui-il__indicator-after"></view>
			<text class="fui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
		</view>
		<!-- #endif -->

		<!-- #endif -->

		<view class="fui-index__letter" :style="styles" @touchstart="touchStart" @touchmove.stop.prevent="touchMove"
			@touchend="touchEnd" @mousedown.stop="mousedown" @mousemove.stop.prevent="mousemove"
			@mouseleave.stop="mouseleave" v-if="!isNvue || styles">
			<view class="fui-letter__item" v-for="(item, i) in lists" :key="i">
				<!-- @tap="letterTap(i)" -->
				<text class="fui-letter__key" :class="{'fui-il__key-color':i === touchmoveIndex && !activeBackground}"
					:style="{ background: i === touchmoveIndex ? getActiveBgColor : 'transparent', color: i === touchmoveIndex? activeColor : keyColor }">{{ item.letter }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	import fIndexListItem from './f-index-list-item.vue'
	// #ifdef APP-PLUS
	function throttle(func, delay) {
		var prev = Date.now();
		return function() {
			var context = this;
			var args = arguments;
			var now = Date.now();
			if (now - prev >= delay) {
				func.apply(context, args);
				prev = Date.now();
			}
		}
	}

	function touchMove(e) {
		let pageY = e.touches[0].pageY
		let index = this.getIndex(pageY - this.winOffsetY)
		if (this.touchmoveIndex === index) {
			return false
		}
		let item = this.lists[index]
		if (item) {
			// #ifndef APP-NVUE
			this.scrollViewId = `fui_il_letter_${index}`
			this.touchmoveIndex = index
			// #endif
			// #ifdef APP-NVUE
			dom.scrollToElement(this.$refs[`fui_il_letter_${index}`][0], {
				animated: false
			})
			this.touchmoveIndex = index
			// #endif
		}
	}
	const throttleTouchMove = throttle(touchMove, 40)
	// #endif
	export default {
		name: 'fui-index-list',
		emits: ['click', 'init', 'scrolltolower'],
		components: {
			fIndexListItem
		},
		props: {
			//列表数据
			listData: {
				type: Array,
				default () {
					return []
				}
			},
			height: {
				type: [Number, String],
				default: 64
			},
			color: {
				type: String,
				default: '#181818'
			},
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
			keyColor: {
				type: String,
				default: '#7F7F7F'
			},
			activeColor: {
				type: String,
				default: '#FFFFFF'
			},
			activeBackground: {
				type: String,
				default: ''
			},
			isSelect: {
				type: Boolean,
				default: false
			},
			//checkbox未选中时边框颜色
			borderColor: {
				type: String,
				default: '#ccc'
			},
			selectedColor: {
				type: String,
				default: ''
			},
			//是否显示图片
			isSrc: {
				type: Boolean,
				default: false
			},
			//次要内容是否居右侧
			subRight: {
				type: Boolean,
				default: true
			},
			custom: {
				type: Boolean,
				default: false
			},
			//H5端使用，是否使用了默认导航栏，默认44px
			isHeader: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			listData(val) {
				this.initData()
			}
		},
		computed: {
			getActiveBgColor() {
				let color = this.activeBackground;
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
				lists: [],
				idtHeight: 0,
				winOffsetY: 0,
				winHeight: 0,
				styles: '',
				indicators: [],
				top: -1,
				start: 0,
				touching: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmovable: true,
				loaded: false,
				isPC: false,
				nvueAndroid: false,
				isNvue: isNvue
			};
		},
		mounted() {
			// #ifdef APP-NVUE
			const res = uni.getSystemInfoSync();
			if (res.platform.toLocaleLowerCase() == 'android') {
				this.nvueAndroid = true;
			}
			// #endif

			// #ifdef H5
			this.isPC = this.IsPC()
			// #endif
			this.$nextTick(() => {
				setTimeout(() => {
					this.initData()
				}, 50)
			})
		},
		methods: {
			//滚动到底部，会触发 scrolltolower 事件
			scrolltolower() {
				this.$emit('scrolltolower', {})
			},
			getIndex(y) {
				let index = -1;
				// #ifdef H5
				if (this.isHeader) {
					y += 44
				}
				// #endif
				// #ifdef APP-NVUE
				if (this.nvueAndroid) {
					index = Math.floor(y / uni.upx2px(40))
				} else {
					index = Math.floor((y - this.start) / uni.upx2px(40))
				}
				// #endif

				// #ifndef APP-NVUE
				// if (y > this.start && y < this.start + uni.upx2px(this.idtHeight)) {}
				index = Math.floor((y - this.start) / uni.upx2px(40))
				// #endif
				return index
			},
			initData() {
				this.lists = []
				let height = 0;
				let lists = [];
				let tempArr = [...(this.listData || [])]
				for (let i = 0, len = tempArr.length; i < len; i++) {
					let model = tempArr[i]
					if (!model.data || model.data.length === 0) {
						continue;
					}
					height += 40;
					model.originalIndex = i;
					model.key = `fui_key_${Math.ceil(Math.random() * 10e5).toString(36)}`
					lists.push(model)
				}
				this.idtHeight = height;
				this.styles = `height:${height}rpx;`;
				//nvue vue3 rpx 失效
				// #ifdef APP-NVUE
				// #ifdef VUE3
				this.idtHeight = uni.upx2px(height)
				this.styles = `height:${this.idtHeight}px;`;
				// #endif
				// #endif
				this.lists = lists;
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select('#fui_index_list')
					.boundingClientRect()
					.exec(ret => {
						this.winOffsetY = ret[0].top
						this.winHeight = ret[0].height
						this.setStyles()
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_index_list'], (res) => {
					this.winOffsetY = res.size.top
					this.winHeight = res.size.height
					this.setStyles()
				})
				// #endif
				this.$nextTick(() => {
					this.$emit('init')
				})
			},
			setStyles() {
				this.indicators = []

				this.styles =
					`height:${this.idtHeight}rpx;top:${this.winHeight / 2}px;-webkit-transform: translateY(-${this.idtHeight/2}rpx);transform: translateY(-${this.idtHeight/2}rpx)`
				// #ifdef APP-NVUE
				// #ifdef VUE3
				this.styles =
					`height:${this.idtHeight}px;top:${this.winHeight / 2}px;-webkit-transform: translateY(-${this.idtHeight/2}px);transform: translateY(-${this.idtHeight/2}px)`
				// #endif
				// #endif
				let start = this.winHeight / 2 - uni.upx2px(this.idtHeight) / 2
				this.start = start;
				this.lists.forEach((item, index) => {
					//20为40的一半，50为100的一半
					const top = start + uni.upx2px(index * 40 + 20 - 50)
					this.indicators.push(top)
				})
			},
			startEmits(idx, index) {
				let item = this.lists[idx]
				let data = item.data[index] || {}
				this.$emit('click', {
					index: item.originalIndex,
					letter: item.letter,
					subIndex: index,
					...data
				})
			},
			onTap(idx, index) {
				this.startEmits(idx, index)
			},
			// #ifdef H5
			IsPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
				var flag = true;
				for (let v = 0; v < Agents.length - 1; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			// #endif
			onClick(e) {
				const {
					idx,
					index
				} = e;
				this.startEmits(idx, index)
			},
			touchStart(e) {
				this.touching = true
				let pageY = this.isPC ? e.pageY : e.touches[0].pageY
				let index = this.getIndex(pageY - this.winOffsetY)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = `fui_il_letter_${index}`
					this.touchmoveIndex = index
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs[`fui_il_letter_${index}`][0], {
						animated: false
					})
					// #endif
				}
			},
			touchMove(e) {
				// #ifndef APP-PLUS
				let pageY = this.isPC ? e.pageY : e.touches[0].pageY
				let index = this.getIndex(pageY - this.winOffsetY)
				if (this.touchmoveIndex === index) return false;
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = `fui_il_letter_${index}`
					this.touchmoveIndex = index
				}
				// #endif
				// #ifdef APP-PLUS
				throttleTouchMove.call(this, e)
				// #endif
			},
			touchEnd() {
				this.touching = false
				this.touchmoveIndex = -1
			},
			mousedown(e) {
				if (!this.isPC) return
				this.touchStart(e)
			},
			mousemove(e) {
				if (!this.isPC) return
				this.touchMove(e)
			},
			mouseleave(e) {
				if (!this.isPC) return
				this.touchEnd(e)
			}
			//开发工具中移动端如果touch事件失效，请检查开发工具或者真机调试
			// letterTap(index) {
			// #ifdef H5
			// if (this.touching) return;
			// let item = this.lists[index]
			// if (item) {
			// 	this.scrollViewId = `fui_il_letter_${index}`
			// 	this.touchmoveIndex = index
			// }
			// this.touchEnd()
			// #endif
			// }
		}
	};
</script>

<style scoped>
	.fui-index__list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.fui-index__list-sv {
		flex: 1;
	}

	.fui-index__list-letter {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		/* #endif */
		flex: 1;
		padding: 0 32rpx;
		height: 64rpx;
		line-height: 64rpx;
		flex-direction: row;
		align-items: center;

		/* #ifdef APP-NVUE */
		border-top-style: solid;
		border-top-width: 0.5px;
		border-top-color: #eee;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
		border-bottom-color: #eee;
		/* #endif */
	}

	.fui-il__letter-text {
		font-size: 28rpx;
		font-weight: 600;
	}

	/* #ifndef APP-NVUE */
	.fui-index__list-letter::before {
		content: " ";
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1px solid var(--fui-color-border, #EEEEEE);
		-webkit-transform: scaleY(0.5) translateZ(0);
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
		z-index: 2;
		pointer-events: none;
	}

	.fui-index__list-letter::after {
		content: '';
		position: absolute;
		border-bottom: 1px solid var(--fui-color-border, #EEEEEE);
		-webkit-transform: scaleY(0.5) translateZ(0);
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 100%;
		bottom: 0;
		right: 0;
		left: 0;
	}

	/* #endif */
	.fui-index__letter {
		position: fixed;
		right: 0;
		text-align: center;
		z-index: 10;
		/* #ifndef APP-NVUE */
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.fui-letter__item {
		flex: 1;
		padding: 0 8rpx;
		font-weight: bold;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.fui-letter__key {
		width: 40rpx;
		height: 40rpx;
		font-size: 26rpx;
		transform: scale(0.8);
		transform-origin: center center;
		/* #ifndef APP-NVUE */
		display: flex;
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 40rpx;
		line-height: 40rpx;
		/* #endif */
		align-items: center;
		justify-content: center;
		text-align: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-il__indicator {
		position: fixed;
		width: 100rpx;
		height: 100rpx;
		z-index: 999;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
		right: 100rpx;
	}

	/* #ifdef APP-NVUE */
	.fui-il__nvue-android {
		width: 128rpx !important;
		padding-right: 28rpx;
		right: 72rpx !important;
	}

	/* #endif */

	.fui-il__indicator-text {
		text-align: center;
		color: #ffffff;
		font-size: 60rpx;
		font-weight: bold;
	}

	.fui-il__indicator-after {
		width: 100rpx;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: -1;
		border-radius: 100rpx 0 100rpx 100rpx;
		background: #c9c9c9;
		transform: rotate(45deg);
	}

	/* #ifndef APP-NVUE */
	.fui-il__key-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-il__key-bg {
		background: var(--fui-bg-color-grey, #F1F4FA) !important;
	}

	/* #endif */
</style>