<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  1 27，营业执照号：9   1   4406 0  5M  A55 6H 1  KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view @touchmove.stop.prevent="stop">
		<view class="fui-fab__mask" :class="{'fui-fab__mask-show':isShow}" :style="getStyle" ref="fui_mask_ani"
			v-if="mask" @tap.stop="maskClick"></view>

		<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
		<view class="fui-fab__btn-wrap" :data-disabled="isDrag?0:1" :data-width="maxWidth" :data-height="maxHeight"
			:data-left="eLeft" :data-top="eTop" :data-app="isApp" :prop="resetNum" :change:prop="handler.fabreset"
			@touchstart="handler.touchstart" @touchmove="handler.touchmove" @mousedown="handler.mousedown"
			:class="[position==='left'?'fui-fab__wrap-left':'fui-fab__wrap-right']" :style="getStyles">
			<view class="fui-fab__btn-list"
				:class="{'fui-fab__btn-hidden':isHidden,'fui-fab__list-ani':isShow,'fui-fab__list-left':position==='left','fui-fab__list-right':position==='right'}"
				ref="fui_fab_ani">
				<view class="fui-fab__button-box"
					:class="[position==='left'?'fui-fab__button-left':'fui-fab__button-right']"
					v-for="(btn,idx) in fabs" :key="idx" @tap.stop="handleClick($event,idx)">
					<text class="fui-fab__btn-text" v-if="btn[textKey]"
						:style="{fontSize:(btn.size || 32)+'rpx',color:btn.color || '#fff',textAlign:position==='left'?'left':'right'}">{{btn[textKey]}}</text>
					<view class="fui-fab__button" :class="{'fui-fab__btn-color':!getBgColor && !btn.background }"
						:style="{width:width+'rpx',height:width+'rpx',background:btn.background || getBgColor}">
						<fui-icon :name="btn[nameKey]" v-if="btn[nameKey]" :color="btn.abbrColor || '#fff'"
							:size="btn.abbrSize || 64"></fui-icon>
						<image :src="btn[srcKey]"
							:style="{width:(btn.width || 56)+'rpx',height:(btn.height || 56)+'rpx',borderRadius:(btn.radius || 0)+'rpx'}"
							v-if="!btn[nameKey] && btn[srcKey]" mode="widthFix"></image>
						<text class="fui-fab__btn-abbr"
							:style="{fontSize:(btn.abbrSize || 36)+'rpx',lineHeight:(btn.abbrSize || 36)+'rpx',color:btn.abbrColor || '#fff'}"
							v-if="!btn[nameKey] && !btn[srcKey] && btn.abbr">{{btn.abbr}}</text>
					</view>
					<!-- #ifndef H5 -->
					<button class="fui-fab__opentype-btn" :open-type="btn.openType" :app-parameter="btn.appParameter"
						:lang="btn.lang" :sessionFrom="btn.sessionFrom" :sendMessageTitle="btn.sendMessageTitle"
						:sendMessagePath="btn.sendMessagePath" :sendMessageImg="btn.sendMessageImg"
						:showMessageCard="btn.showMessageCard" @contact="bindcontact" @opensetting="bindopensetting"
						@launchapp="bindlaunchapp" v-if="btn.openType"></button>
					<!-- #endif -->
				</view>
			</view>
			<view class="fui-fab__btn-main" :class="{'fui-fab__btn-color':!getBgColor}"
				:style="{width:width+'rpx',height:width+'rpx',background:getBgColor}"
				@tap.stop="handleClick($event,-1)">
				<view class="fui-fab__btn-inner" :class="{'fui-fab__btn-ani':isShow}" ref="fui_fm_ani">
					<slot>
						<fui-icon name="plus" :color="color" :size="80"></fui-icon>
					</slot>
				</view>
				<!-- #ifndef H5 -->
				<button class="fui-fab__opentype-btn" :open-type="openType" :app-parameter="appParameter" :lang="lang"
					:sessionFrom="sessionFrom" :sendMessageTitle="sendMessageTitle" :sendMessagePath="sendMessagePath"
					:sendMessageImg="sendMessageImg" :showMessageCard="showMessageCard" @contact="bindcontact"
					@opensetting="bindopensetting" @launchapp="bindlaunchapp" v-if="openType"></button>
				<!-- #endif -->
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-fab__btn-wrap" @touchstart="touchstart" @touchmove.stop.prevent="touchmove"
			@touchend="touchend" @touchcancel="touchend" ref="fui_fab_move_ref"
			:class="[position==='left'?'fui-fab__wrap-left':'fui-fab__wrap-right']" :style="getStyles">
			<view class="fui-fab__btn-list"
				:class="{'fui-fab__btn-hidden':isHidden,'fui-fab__list-ani':isShow,'fui-fab__list-left':position==='left','fui-fab__list-right':position==='right'}"
				ref="fui_fab_ani">
				<view class="fui-fab__button-box"
					:class="[position==='left'?'fui-fab__button-left':'fui-fab__button-right']"
					v-for="(btn,idx) in fabs" :key="idx" @tap.stop="handleClick($event,idx)">
					<text class="fui-fab__btn-text" v-if="btn[textKey]"
						:style="{fontSize:(btn.size || 32)+'rpx',color:btn.color || '#fff',textAlign:position==='left'?'left':'right'}">{{btn[textKey]}}</text>
					<view class="fui-fab__button" :class="{'fui-fab__btn-color':!getBgColor && !btn.background }"
						:style="{width:width+'rpx',height:width+'rpx',background:btn.background || getBgColor}">
						<fui-icon :name="btn[nameKey]" v-if="btn[nameKey]" :color="btn.abbrColor || '#fff'"
							:size="btn.abbrSize || 64"></fui-icon>
						<image :src="btn[srcKey]"
							:style="{width:(btn.width || 56)+'rpx',height:(btn.height || 56)+'rpx',borderRadius:(btn.radius || 0)+'rpx'}"
							v-if="!btn[nameKey] && btn[srcKey]" mode="widthFix"></image>
						<text class="fui-fab__btn-abbr"
							:style="{fontSize:(btn.abbrSize || 36)+'rpx',lineHeight:(btn.abbrSize || 36)+'rpx',color:btn.abbrColor || '#fff'}"
							v-if="!btn[nameKey] && !btn[srcKey] && btn.abbr">{{btn.abbr}}</text>
					</view>
				</view>
			</view>
			<view class="fui-fab__btn-main" :class="{'fui-fab__btn-color':!getBgColor}"
				:style="{width:width+'rpx',height:width+'rpx',background:getBgColor}"
				@tap.stop="handleClick($event,-1)">
				<view class="fui-fab__btn-inner" :class="{'fui-fab__btn-ani':isShow}" ref="fui_fm_ani">
					<slot>
						<fui-icon name="plus" :color="color" :size="80"></fui-icon>
					</slot>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS  || MP-WEIXIN || H5 -->
		<view class="fui-fab__btn-wrap" @touchstart="touchstart" @touchmove.stop.prevent="touchmove"
			:class="[position==='left'?'fui-fab__wrap-left':'fui-fab__wrap-right']" :style="getStyles">
			<view class="fui-fab__btn-list"
				:class="{'fui-fab__btn-hidden':isHidden,'fui-fab__list-ani':isShow,'fui-fab__list-left':position==='left','fui-fab__list-right':position==='right'}"
				ref="fui_fab_ani">
				<view class="fui-fab__button-box"
					:class="[position==='left'?'fui-fab__button-left':'fui-fab__button-right']"
					v-for="(btn,idx) in fabs" :key="idx" @tap.stop="handleClick($event,idx)">
					<text class="fui-fab__btn-text" v-if="btn[textKey]"
						:style="{fontSize:(btn.size || 32)+'rpx',color:btn.color || '#fff',textAlign:position==='left'?'left':'right'}">{{btn[textKey]}}</text>
					<view class="fui-fab__button" :class="{'fui-fab__btn-color':!getBgColor && !btn.background }"
						:style="{width:width+'rpx',height:width+'rpx',background:btn.background || getBgColor}">
						<fui-icon :name="btn[nameKey]" v-if="btn[nameKey]" :color="btn.abbrColor || '#fff'"
							:size="btn.abbrSize || 64"></fui-icon>
						<image :src="btn[srcKey]"
							:style="{width:(btn.width || 56)+'rpx',height:(btn.height || 56)+'rpx',borderRadius:(btn.radius || 0)+'rpx'}"
							v-if="!btn[nameKey] && btn[srcKey]" mode="widthFix"></image>
						<text class="fui-fab__btn-abbr"
							:style="{fontSize:(btn.abbrSize || 36)+'rpx',lineHeight:(btn.abbrSize || 36)+'rpx',color:btn.abbrColor || '#fff'}"
							v-if="!btn[nameKey] && !btn[srcKey] && btn.abbr">{{btn.abbr}}</text>
					</view>
				</view>
			</view>
			<view class="fui-fab__btn-main" :class="{'fui-fab__btn-color':!getBgColor}"
				:style="{width:width+'rpx',height:width+'rpx',background:getBgColor}"
				@tap.stop="handleClick($event,-1)">
				<view class="fui-fab__btn-inner" :class="{'fui-fab__btn-ani':isShow}" ref="fui_fm_ani">
					<slot>
						<fui-icon name="plus" :color="color" :size="80"></fui-icon>
					</slot>
				</view>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->
<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	const dom = uni.requireNativePlugin('dom');
	// #endif
	import mpjs from './mpjs.js'
	import bindingx from './bindingx.js'
	export default {
		name: "fui-fab",
		mixins: [mpjs, bindingx],
		emits: ['click', 'change', 'opensetting', 'launchapp', 'contact'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			fabs: {
				type: Array,
				default () {
					return []
				}
			},
			nameKey: {
				type: String,
				default: 'name'
			},
			srcKey: {
				type: String,
				default: 'src'
			},
			textKey: {
				type: String,
				default: 'text'
			},
			position: {
				type: String,
				default: 'right'
			},
			distance: {
				type: [Number, String],
				default: 80
			},
			bottom: {
				type: [Number, String],
				default: 120
			},
			width: {
				type: [Number, String],
				default: 108
			},
			background: {
				type: String,
				default: ""
			},
			color: {
				type: String,
				default: "#fff"
			},
			mask: {
				type: Boolean,
				default: true
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
				default: 99
			},
			//V1.9.8+
			isDrag: {
				type: Boolean,
				default: false
			},
			//v2.3.0+
			openType: {
				type: String,
				default: ''
			},
			appParameter: {
				type: String,
				default: ''
			},
			lang: {
				type: String,
				default: 'en'
			},
			sessionFrom: {
				type: String,
				default: ''
			},
			sendMessageTitle: {
				type: String,
				default: ''
			},
			sendMessagePath: {
				type: String,
				default: ''
			},
			sendMessageImg: {
				type: String,
				default: ''
			},
			showMessageCard: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			getStyles() {
				let styles = `bottom:${this.bottom}rpx;z-index:${this.zIndex};`
				if (this.position === 'left') {
					styles += `left:${this.distance}rpx;`
				} else {
					styles += `right:${this.distance}rpx;`
				}
				// #ifndef APP-PLUS || MP-WEIXIN || H5
				if (this.isDrag) {
					styles += `transform:${this.transform};`
				}
				// #endif
				return styles;
			},
			getStyle() {
				return `background:${this.maskBackground};z-index:${Number(this.zIndex)-10};`
			},
			getBgColor() {
				let color = this.background;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		watch: {
			isShow(val) {
				this.$emit("change", {
					isShow: val
				})
			},
			position(val) {
				this.resetNum++;
				this.$nextTick(() => {
					setTimeout(() => {
						this._getSize()
					}, 80);
				})
			}
		},
		data() {
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				isShow: false,
				isHidden: true,
				timer: null,
				maxWidth: 0,
				maxHeight: 0,
				eLeft: 0,
				eTop: 0,
				resetNum: 0
			};
		},
		// #ifndef APP-NVUE
		// #ifndef VUE3
		beforeDestroy() {
			clearTimeout(this.timer)
			this.timer = null
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			clearTimeout(this.timer)
			this.timer = null
		},
		// #endif
		// #endif

		mounted() {
			this.$nextTick(() => {
				// #ifdef APP-NVUE
				if (!this.$refs['fui_fab_ani']) return;
				let styles = {
					transform: 'scale(0)',
					opacity: 0
				}
				animation.transition(
					this.$refs['fui_fab_ani'].ref, {
						styles,
						duration: 0,
						needLayout: false,
						delay: 0
					},
					() => {}
				);
				// #endif
				setTimeout(() => {
					this._getSize()
				}, 50);
			})
		},

		methods: {
			stop() {},
			_getSize() {
				if (!this.isDrag) return;
				const sys = uni.getSystemInfoSync()
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select('.fui-fab__btn-wrap')
					.boundingClientRect()
					.exec(ret => {
						if (ret) {
							this.maxWidth = sys.windowWidth - ret[0].width - ret[0].left;
							this.maxHeight = sys.windowHeight - ret[0].height - ret[0].top;
							this.eLeft = ret[0].left || 0;
							this.eTop = ret[0].top || 0;
						}
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_fab_move_ref'], (ret) => {
					const size = ret.size
					if (size) {
						this.maxWidth = sys.windowWidth - size.width - size.left;
						this.maxHeight = sys.windowHeight - size.height - size.top;
						this.eLeft = size.left || 0;
						this.eTop = size.top || 0;
					}
				})
				// #endif
			},
			// #ifdef APP-NVUE
			_animation(type) {
				let styles = {
					transform: `scale(${type ? 1 : 0})`,
					opacity: type ? 1 : 0
				}
				if (!this.$refs['fui_fab_ani'] || !this.$refs['fui_fm_ani']) return;

				if (this.mask && this.$refs['fui_mask_ani']) {
					animation.transition(
						this.$refs['fui_mask_ani'].ref, {
							styles: {
								transform: `translateX(${type ? '0' : '-100%'})`
							},
							duration: 0,
							needLayout: false,
							delay: 0 //ms
						},
						() => {}
					);
				}
				animation.transition(
					this.$refs['fui_fm_ani'].ref, {
						styles: {
							transform: `rotate(${type ? '135deg' : '0deg'})`
						},
						duration: 250,
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {
						if (!type) {
							this.isHidden = true
						}
					}
				);
				animation.transition(
					this.$refs['fui_fab_ani'].ref, {
						styles,
						duration: 250,
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					() => {}
				);
			},
			// #endif
			handleClick: function(e, index) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif

				// #ifdef APP-NVUE
				if (this.isMove) {
					this.isMove = false;
					return;
				};
				// #endif

				this.isHidden = false
				clearTimeout(this.timer)
				this.$nextTick(() => {
					if (index === -1 && this.fabs.length > 0) {
						this.isShow = !this.isShow
						// #ifdef APP-NVUE
						this._animation(this.isShow)
						// #endif
					} else {
						this.$emit("click", {
							index: index
						})
						this.isShow = false
						// #ifdef APP-NVUE
						this._animation(this.isShow)
						// #endif
					}
					// #ifndef APP-NVUE
					if (!this.isShow) {
						this.timer = setTimeout(() => {
							this.isHidden = true
						}, 250)
					}
					// #endif
				})
			},
			maskClick(e) {
				// #ifdef APP-NVUE
				e.stopPropagation();
				// #endif
				if (!this.maskClosable) return;
				this.isShow = false
				// #ifndef APP-NVUE
				this.timer = setTimeout(() => {
					this.isHidden = true
				}, 250)
				// #endif

				// #ifdef APP-NVUE
				this._animation(this.isShow)
				// #endif

			},
			bindopensetting({
				detail = {}
			} = {}) {
				this.$emit('opensetting', detail);
			},
			bindlaunchapp({
				detail = {}
			} = {}) {
				this.$emit('launchapp', detail);
			},
			bindcontact({
				detail = {}
			} = {}) {
				this.$emit('contact', detail);
			}
		}
	}
</script>

<style scoped>
	.fui-fab__mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
		/* #ifndef APP-NVUE */
		visibility: hidden;
		transition-property: visibility, opacity;
		/* #endif */
		transition-duration: .25s;
		/* #ifdef APP-NVUE */
		transition-property: opacity;
		transition-timing-function: ease-in-out;
		transform: translateX(-100%);
		/* #endif */
	}

	.fui-fab__mask-show {
		opacity: 1;
		/* #ifdef APP-NVUE */
		transform: translateX(0);
		/* #endif */
		/* #ifndef APP-NVUE */
		visibility: visible;
		/* #endif */
	}

	.fui-fab__btn-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		position: fixed;
		bottom: 120rpx;
	}

	.fui-fab__wrap-left {
		align-items: flex-start;
		left: 80rpx;
	}

	.fui-fab__wrap-right {
		align-items: flex-end;
		right: 80rpx;
	}

	.fui-fab__btn-list {
		/* #ifndef APP-NVUE */
		display: flex;
		visibility: hidden;
		transition: all 0.25s ease-in-out;
		transform: scale3d(0, 0, 1);
		opacity: 0;
		/* #endif */
		flex-direction: column;
	}

	.fui-fab__list-left {
		transform-origin: 0 100%;
		align-items: flex-start;
	}

	.fui-fab__list-right {
		transform-origin: 100% 100%;
		align-items: flex-end;
	}

	.fui-fab__btn-hidden {
		width: 0;
		height: 0;
	}

	.fui-fab__list-ani {
		/* #ifndef APP-NVUE */
		opacity: 1;
		transform: scale3d(1, 1, 1);
		visibility: visible;
		/* #endif */
	}

	.fui-fab__button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 32rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-fab__button-left {
		flex-direction: row-reverse;
		justify-content: flex-start;
	}

	.fui-fab__button-right {
		flex-direction: row;
		justify-content: flex-end;
	}


	.fui-fab__btn-text {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		padding-left: 24rpx;
		padding-right: 24rpx;
		font-weight: normal;
	}

	.fui-fab__button {
		/* #ifndef APP-NVUE */
		display: flex;
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 100px;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.fui-fab__btn-abbr {
		text-align: center;
		font-weight: normal;
	}

	.fui-fab__btn-main {
		/* #ifndef APP-NVUE */
		display: flex;
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 100px;
		/* #endif */
		/* #ifndef APP-NVUE */
		box-shadow: 0 10rpx 14rpx 0 rgba(0, 0, 0, 0.1);
		/* #endif */
		align-items: center;
		justify-content: center;
		transform: rotate(0deg);
		overflow: hidden;

		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-fab__btn-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		transform: rotate(0deg);
		transition: transform .25s;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	/* #ifndef APP-NVUE */
	.fui-fab__btn-ani {
		transform: rotate(135deg);
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-fab__btn-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	.fui-fab__opentype-btn {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-width: 0;
		background-color: rgba(0, 0, 0, 0);
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 1;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-fab__opentype-btn::after {
		border-width: 0;
	}

	/* #endif */
</style>