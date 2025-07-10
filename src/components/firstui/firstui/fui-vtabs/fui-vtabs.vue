<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号： 9 14 4  0  60  5MA5   56H1K     XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-vtabs__wrap" :style="{width:vtabsW,height:vtabsH}">
		<view :style="{width:tabWidth+'rpx',background:background}">
			<scroll-view :show-scrollbar="false" class="fui-vtabs__scroll-bar"
				:style="{width:tabWidth+'rpx',height:vtabsH}" scroll-y :scroll-into-view="scrollInto"
				:scroll-with-animation="isTap">
				<view class="fui-vtabs__item__wrap" :style="{width:tabWidth+'rpx'}">
					<view class="fui-vtabs__item"
						:class="{'fui-vtabs__left-border':isBorder,'fui-vtabs__item-hover':!item.disable,'fui-vtabs__item-disable':item.disable,'fui-vtabs__border-color':!getBorderColor && current===index && isBorder}"
						:id="'fui_vtabs_bar_'+index" v-for="(item,index) in vals" :key="index"
						:style="{background:current===index?activeBgColor:background,borderLeftColor:current===index && isBorder?getBorderColor:'transparent',width:tabWidth+'rpx',height:tabHeight+'rpx'}"
						@tap="switchTab(index)">
						<image class="fui-vtabs__icon"
							:style="{width:(item.iconWidth || 40)+'rpx',height:(item.iconHeight || 40)+'rpx'}"
							:src="current===index && item[activeIconKey]?item[activeIconKey]:item[iconKey]"
							v-if="item[iconKey]">
						</image>
						<!-- #ifdef APP-NVUE -->
						<text class="fui-vtabs__text"
							:class="{'fui-vtabs__selected-color':!getActiveColor && current===index}"
							:style="{fontSize:(current===index?activeSize:size)+'rpx',color:current===index?getActiveColor:color,fontWeight:current===index?activeFontWeight:fontWeight}">{{item[nameKey]}}<text
								:class="{'fui-vtabs__badge-color':!getBadgeBackground,'fui-vtabs__badge-dot':isDot,'fui-vtabs__badge':!isDot}"
								:style="{color:badgeColor,background:getBadgeBackground}"
								v-if="item[badgeKey]">{{isDot?'':item[badgeKey]}}</text></text>
							<!-- #endif -->

						<!-- #ifndef APP-NVUE -->
						<view class="fui-vtabs__text"
							:class="{'fui-vtabs__selected-color':!getActiveColor && current===index}"
							:style="{fontSize:(current===index?activeSize:size)+'rpx',color:current===index?getActiveColor:color,fontWeight:current===index?activeFontWeight:fontWeight}">
							{{item[nameKey]}}<text
								:class="{'fui-vtabs__badge-color':!getBadgeBackground,'fui-vtabs__badge-dot':isDot,'fui-vtabs__badge':!isDot}"
								:style="{color:badgeColor,background:getBadgeBackground}"
								v-if="item[badgeKey]">{{isDot?'':item[badgeKey]}}</text>
						</view>
						<!-- #endif -->
					</view>
				</view>
			</scroll-view>
		</view>
		<scroll-view :show-scrollbar="false" :scroll-y="true" :style="{height:vtabsH}" class="fui-vtabs__content-wrap"
			:scroll-top="contentScrollTop" :scroll-with-animation="animation" @scroll="contentScroll"
			@scrolltolower="onScrolltolower">
			<view class="fui-vtabs__content">
				<slot></slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "fui-vtabs",
		emits: ['click', 'change', 'scrolltolower'],
		props: {
			vtabs: {
				type: Array,
				default () {
					return []
				}
			},
			nameKey: {
				type: String,
				default: 'name'
			},
			badgeKey: {
				type: String,
				default: 'badge'
			},
			iconKey: {
				type: String,
				default: 'icon'
			},
			activeIconKey: {
				type: String,
				default: 'activeIcon'
			},
			width: {
				type: [Number, String],
				default: '0'
			},
			height: {
				type: [Number, String],
				default: '0'
			},
			tabWidth: {
				type: [Number, String],
				default: 220
			},
			tabHeight: {
				type: [Number, String],
				default: 110
			},
			size: {
				type: [Number, String],
				default: 26
			},
			activeSize: {
				type: [Number, String],
				default: 26
			},
			color: {
				type: String,
				default: '#333333'
			},
			activeColor: {
				type: String,
				default: ''
			},
			fontWeight: {
				type: [Number, String],
				default: 'normal'
			},
			activeFontWeight: {
				type: [Number, String],
				default: 'normal'
			},
			background: {
				type: String,
				default: '#eeeeee'
			},
			activeBgColor: {
				type: String,
				default: '#ffffff'
			},
			isBorder: {
				type: Boolean,
				default: true
			},
			borderColor: {
				type: String,
				default: ''
			},
			activeTab: {
				type: [Number, String],
				default: 0
			},
			animation: {
				type: Boolean,
				default: true
			},
			badgeColor: {
				type: String,
				default: '#fff'
			},
			badgeBackground: {
				type: String,
				default: ''
			},
			isDot: {
				type: Boolean,
				default: false
			},
			//是否联动，为false时content只需展示对应索引数据
			linkage: {
				type: Boolean,
				default: true
			}
		},
		provide() {
			return {
				vtabs: this
			}
		},
		computed: {
			getActiveColor() {
				let color = this.activeColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			},
			getBorderColor() {
				let color = this.borderColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			},
			getBadgeBackground() {
				let color = this.badgeBackground
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.danger) || '#FF2B2B';
				}
				// #endif
				return color;
			}
		},
		data() {
			return {
				vals: [],
				scrollInto: '',
				current: 0,
				contentScrollTop: 0,
				// contentScrollInto: '',
				heightRecords: [],
				contentHeight: {},
				vtabsW: '320px',
				vtabsH: '600px',
				isTap: false
			};
		},
		watch: {
			vtabs(vals) {
				this.initData(vals)
			},
			activeTab(newVal, oldVal) {
				if (this.linkage) {
					this.setDefaultTab(newVal)
				} else {
					this.switchTab(newVal, true);
				}
			},
			current(val) {
				this.scrollTabBar(val)
			},
			height(val) {
				this.setHeight(val)
			},
			width(val) {
				this.setWidth(val)
			}
		},
		created() {
			this.children = []
			this.setWidth(this.width)
			this.setHeight(this.height)
			this.calcHeightTimer = null
			this.scrollTimer = null
			this.initData(this.vtabs)
		},
		methods: {
			setWidth(width) {
				let res = uni.getSystemInfoSync()
				if (width == 0 || width == '0px' || width == '0rpx') {
					this.vtabsW = res.windowWidth + 'px'
				} else {
					this.vtabsW = width;
				}
			},
			setHeight(height) {
				let res = uni.getSystemInfoSync()
				if (height == 0 || height == '0px' || height == '0rpx') {
					this.vtabsH = res.windowHeight + 'px'
				} else {
					this.vtabsH = height;
				}
			},
			setDefaultTab(index, idx = 0) {
				let len = this.vtabs.length
				if (this.heightRecords.length === len && len > 0) {
					this.switchTab(index, true);
				} else {
					if (idx >= 100) return
					idx++
					setTimeout(() => {
						this.setDefaultTab(index, idx)
					}, 250)
				}
			},
			initData(vals) {
				if (vals && vals.length > 0) {
					if (typeof vals[0] !== 'object') {
						//字符串
						const key = this.nameKey || 'name';
						vals = vals.map(item => {
							return {
								[key]: item
							}
						})
					}
					this.vals = vals;
					this.$nextTick(() => {
						if (this.linkage) {
							setTimeout(() => {
								this.setDefaultTab(this.activeTab);
							}, 50)
						} else {
							this.switchTab(this.activeTab, true);
						}
					})
				}
			},
			scrollTabBar(index) {
				let len = this.vtabs.length;
				if (len === 0) return;
				index = index < 6 ? 0 : index - 5;
				if (index >= len) index = len - 1;
				this.scrollInto = `fui_vtabs_bar_${index}`;
			},
			switchTab(index, init) {
				index = Number(index)
				const item = {
					...this.vals[index]
				}
				if (item.disable) return;
				if (this.linkage) {
					this.contentScrollTop = this.heightRecords[this.current - 1] || 0;
					this.$nextTick(() => {
						setTimeout(() => {
							this.current = index;
							this.contentScrollTop = this.heightRecords[index - 1] || 0;
							// this.contentScrollInto = `fui-vtabs-content__${index}`;
						}, 50)
					});
				} else {
					this.current = index;
				}
				if (!init) {
					this.isTap = true;
					this.$emit('click', {
						index: index,
						...item
					})
				}
			},
			calcHeight() {
				let len = this.vtabs.length;
				let _heightRecords = [];
				let temp = 0;
				for (let i = 0; i < len; i++) {
					_heightRecords[i] = temp + (this.contentHeight[i] || 0);
					temp = _heightRecords[i];
				}
				this.heightRecords = _heightRecords;
			},
			contentScroll(e) {
				if (!this.linkage) return;
				if (this.isTap) {
					if (this.scrollTimer) {
						clearTimeout(this.scrollTimer)
					}
					this.scrollTimer = setTimeout(() => {
						this.isTap = false;
					}, 50)
					return;
				}
				let _heightRecords = this.heightRecords;
				if (_heightRecords.length === 0) return;
				let len = this.vtabs.length;
				let scrollTop = e.detail.scrollTop + (len - 1) * 0.19;
				let index = 0;
				if (scrollTop >= _heightRecords[0]) {
					for (let i = 1; i < len; i++) {
						if (scrollTop >= _heightRecords[i - 1] && scrollTop < _heightRecords[i]) {
							index = i;
							break;
						}
					}
				}
				if (index != this.current) {
					const item = {
						...this.vals[index]
					}
					this.$emit('change', {
						index: index,
						...item
					})
					this.current = index;
				}
			},
			getCalcHeight(height, index) {
				this.contentHeight[index] = height;
				if (this.calcHeightTimer) {
					clearTimeout(this.calcHeightTimer);
				}
				this.calcHeightTimer = setTimeout(() => {
					this.calcHeight();
				}, 150);
			},
			uninstall(tabIndex, target) {
				this.children.forEach((item, index) => {
					if (item === target) {
						this.children.splice(index, 1)
					}
				})
				delete this.contentHeight[tabIndex]
				this.calcHeight()
			},
			//重置列表高度信息
			reset() {
				if (this.linkage) {
					this.children.forEach((item, index) => {
						item.calcHeight((height) => {
							this.getCalcHeight(height, Number(item.tabIndex))
						})
					})
				}
			},
			onScrolltolower(e) {
				if (!this.linkage) {
					this.$emit('scrolltolower', e)
				}
			}
		}
	}
</script>

<style scoped>
	.fui-vtabs__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	/* #ifndef APP-NVUE */
	.fui-vtabs__scroll-bar {
		flex-shrink: 0;
	}

	/* #endif */

	.fui-vtabs__item__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.fui-vtabs__item {
		padding: 0 20rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		flex-direction: row;

		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.fui-vtabs__icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
	}

	.fui-vtabs__item-hover {
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-vtabs__item-disable {
		opacity: .5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.fui-vtabs__left-border {
		border-left-width: 8rpx;
		border-left-style: solid;
	}

	.fui-vtabs__text {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex-wrap: wrap;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #endif */
		position: relative;
	}

	.fui-vtabs__badge {
		height: 36rpx;
		padding: 0 12rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 36rpx;
		border-radius: 100px;
		/* #ifndef APP-NVUE */
		min-width: 36rpx !important;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: -32rpx;
		top: -18rpx;
		transform: scale(0.9);
		z-index: 10;
	}

	.fui-vtabs__badge-dot {
		height: 8px !important;
		width: 8px !important;
		/* #ifdef APP-NVUE */
		border-radius: 100px;
		/* #endif */

		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		position: absolute;
		right: -6px;
		top: -3px;
		z-index: 10;
	}

	.fui-vtabs__content-wrap {
		flex: 1;
	}

	.fui-vtabs__content {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-vtabs__selected-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-vtabs__border-color {
		border-left-color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-vtabs__badge-color {
		background: var(--fui-color-danger, #FF2B2B) !important;
	}

	/* #endif */
</style>