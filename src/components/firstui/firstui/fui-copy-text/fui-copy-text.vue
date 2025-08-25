<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  1 127，营业执照号：9   1 4 406   0  5 M A556H 1K   X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-copy__text-wrap">
		<!-- #ifndef MP-ALIPAY || APP-NVUE -->
		<text ref="fui_ct__el" :selectable="false" class="fui-copy__text" @longpress.stop="handleCopy"
			@mousedown="handleCopyByPC"
			:style="{ color: color, fontSize: size + 'rpx', fontWeight: fontWeight, background: showTooltip ? background : 'transparent' }">{{ text }}</text>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<text ref="fui_ct__el" class="fui-copy__text" @longpress.stop="handleCopy" @mousedown="handleCopyByPC"
			:style="{ color: color, fontSize: size + 'rpx', fontWeight: fontWeight, background: showTooltip ? background : 'transparent' }">{{ text }}</text>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<view ref="fui_ct__el" class="fui-copy__text" @longpress.stop="handleCopy"
			:style="{ color: color, fontSize: size + 'rpx', fontWeight: fontWeight, background: showTooltip ? background : 'transparent' }">
			{{ text }}
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<view v-if="showTooltip" class="fui-copy__tooltip-list"
			:class="['fui-copy__tooltip-' + direction, (direction == 'left' || direction == 'right') && buttons.length > 0 ? 'fui-copy__list-column' : '']"
			:style="{ zIndex: zIndex }">
			<text :selectable="false" v-if="!removeCopy || buttons.length === 0" class="fui-copy__tooltip-cell"
				:class="{'fui-copy__tooltip-column':(direction == 'left' || direction == 'right') && buttons.length > 0}"
				@tap.stop="copyVal">复制</text>
			<text :selectable="false" class="fui-copy__tooltip-cell"
				:class="{'fui-copy__btn-extend':true,'fui-copy__tooltip-column':direction == 'left' || direction == 'right'}"
				v-for="(item, index) in buttons" :key="index" @tap.stop="buttonTap(index)">{{ item }}</text>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view v-if="showTooltip" class="fui-copy__tl_fixed"
			:class="['fui-copy__tooltip-' + direction,isShow?'fui-ct__tool-show':'fui-ct__tool-hidden',direction==='top' || direction==='bottom'?'fui-ct__dir-col':'fui-ct__dir-row']"
			:style="styles" ref="fui_ct_tool">
			<view class="fui-copy__text-triangle" :class="['fui-ct__triangle-'+direction]"
				v-if="direction==='bottom' || direction==='right'"></view>
			<view class="fui-copy__tooltip-list"
				:class="[(direction == 'left' || direction == 'right') && buttons.length > 0?'fui-copy__list-column':'' ]">
				<text v-if="!removeCopy || buttons.length === 0" class="fui-copy__tooltip-cell"
					:class="{'fui-copy__tooltip-column':(direction == 'left' || direction == 'right') && buttons.length > 0}"
					@tap.stop="copyVal">复制</text>
				<text class="fui-copy__tooltip-cell fui-copy__btn-extend"
					:class="{'fui-copy__tooltip-column':direction == 'left' || direction == 'right'}"
					v-for="(item, index) in buttons" :key="index" @tap.stop="buttonTap(index)">{{ item }}</text>
			</view>
			<view class="fui-copy__text-triangle" :class="['fui-ct__triangle-'+direction]"
				v-if="direction==='top' || direction==='left'"></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import $fui from './lib/index.js'
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: 'fui-copy-text',
		emits: ['click', 'copy'],
		props: {
			text: {
				type: String,
				default: ''
			},
			value: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 28
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			color: {
				type: String,
				default: '#181818'
			},
			background: {
				type: String,
				default: 'transparent'
			},
			showBtn: {
				type: Boolean,
				default: true
			},
			direction: {
				type: String,
				default: 'top'
			},
			zIndex: {
				type: [Number, String],
				default: 1001
			},
			removeCopy: {
				type: Boolean,
				default: false
			},
			//扩展按钮
			buttons: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				// #ifdef APP-NVUE
				width: 60,
				height: 12,
				top: 0,
				left: 0,
				transform: '',
				isShow: false,
				// #endif
				showTooltip: false
			};
		},
		// #ifdef APP-NVUE
		computed: {
			styles() {
				let styles = '';
				switch (this.direction) {
					case 'top':
						styles += `left:${this.width / 2 + this.left}px;top:${this.top+2}px;`
						break;
					case 'left':
						styles += `left:${this.left+2}px;top:${this.height / 2 + this.top}px;`
						break;
					case 'right':
						styles += `left:${this.left+this.width-2}px;top:${this.height / 2 + this.top}px;`
						break;
					case 'bottom':
						styles += `left:${this.width / 2 + this.left}px;top:${this.top +this.height-2}px;`
						break;
					default:
						break;
				}
				return styles
			}
		},
		created() {
			this.transform = {
				top: 'translate(-50%, -100%)',
				left: 'translate(-100%, -50%)',
				right: 'translate(0, -50%)',
				bottom: 'translate(-50%, 0)'
			} [this.direction || 'top']
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.init()
				}, 100)
			})
		},
		// #endif
		methods: {
			// #ifdef APP-NVUE
			init() {
				dom.getComponentRect(this.$refs['fui_ct__el'], option => {
					if (option && option.result && option.size) {
						this.width = option.size.width
						this.height = option.size.height
						this.top = option.size.top
						this.left = option.size.left
					}
				})
			},
			_animation(type) {
				if (!this.$refs['fui_ct_tool']) return;
				animation.transition(
					this.$refs['fui_ct_tool'].ref, {
						styles: {
							transform: this.transform
						},
						duration: 0,
						needLayout: false,
						delay: 0 //ms
					}, () => {
						this.isShow = true;
					});
			},
			// #endif
			isPC() {
				if (typeof navigator !== 'object') return false;
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
				var flag = true;
				for (var v = 0; v < Agents.length - 1; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			handleCopyByPC(e) {
				// #ifdef H5
				if (this.isPC()) {
					this.handleCopy(e);
				}
				// #endif
			},
			handleCopy(e) {
				if (this.showBtn || this.buttons.length > 0) {
					this.showTooltip = true;
					// #ifdef APP-NVUE
					this.$nextTick(() => {
						setTimeout(() => {
							this._animation()
						}, 50)
					})
					// #endif
				} else {
					this.copyVal(e);
				}
			},
			copyVal(e) {
				$fui.getClipboardData(
					this.value || this.text,
					res => {
						if (res) {
							// #ifndef APP-NVUE || MP-QQ
							uni.showToast({
								title: '复制成功',
								icon: 'none'
							});
							// #endif
							this.$emit('copy', {
								text: this.text,
								value: this.value
							});
						}
					},
					e
				);
				this.hiddenTooltip();
			},
			hiddenTooltip() {
				this.showTooltip = false;
				// #ifdef APP-NVUE
				this.isShow = false;
				// #endif
			},
			buttonTap(index) {
				this.$emit('click', {
					index: index,
					text: this.buttons[index]
				});
				this.hiddenTooltip();
			}
		}
	};
</script>

<style scoped>
	.fui-copy__text-wrap {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		position: relative;
		/* #ifdef APP-NVUE */
		flex-direction: row;
		align-items: flex-start;
		/* #endif */
	}

	.fui-copy__text {
		position: relative;
		z-index: 2;
		/* #ifdef MP-ALIPAY */
		display: inline;
		/* #endif */
	}

	.fui-copy__tooltip-list {
		/* #ifndef APP-NVUE */
		display: flex;
		position: absolute;
		/* #endif */
		border-radius: 6px;
		background-color: #181818;
		padding: 5px 0;
		align-items: center;
		flex-direction: row;
	}

	.fui-copy__list-column {
		flex-direction: column !important;
		padding: 0 5px;
	}

	.fui-copy__tooltip-cell {
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		box-sizing: border-box;
		/* #endif */
		color: #ffffff;
		text-align: center;
		padding: 3px 15px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		font-size: 14px;
	}

	.fui-copy__btn-extend {
		/* #ifndef APP-NVUE */
		border-left: 1rpx solid rgba(255, 255, 255, 0.15);
		/* #endif */

		/* #ifdef APP-NVUE */
		border-left-width: 0.5px;
		border-left-style: solid;
		border-left-color: rgba(255, 255, 255, 0.15);
		/* #endif */
	}

	.fui-copy__tooltip-column {
		padding: 8px 10px;
		border-left-width: 0;
		/* #ifndef APP-NVUE */
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.15);
		/* #endif */

		/* #ifdef APP-NVUE */
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		border-bottom-color: rgba(255, 255, 255, 0.15);
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-copy__tooltip-top {
		left: 50%;
		top: 0;
		margin-top: -10px;
		transform: translate(-50%, -100%);
	}

	.fui-copy__tooltip-bottom {
		left: 50%;
		top: 100%;
		margin-top: 10px;
		transform: translate(-50%, 0);
	}

	.fui-copy__tooltip-left {
		left: 0;
		top: 50%;
		margin-left: -10px;
		transform: translate(-100%, -50%);
	}

	.fui-copy__tooltip-right {
		left: 100%;
		top: 50%;
		margin-left: 10px;
		transform: translate(0, -50%);
	}

	.fui-copy__tooltip-column:last-child {
		border-bottom: 0
	}

	.fui-copy__tooltip-top::after {
		content: ' ';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translate(-50%, 0);
		border-width: 5px;
		border-style: solid;
		border-color: #181818 transparent transparent transparent;
	}

	.fui-copy__tooltip-bottom::after {
		content: ' ';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -100%);
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent #181818 transparent;
	}

	.fui-copy__tooltip-left::after {
		content: ' ';
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translate(0, -50%);
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent transparent #181818;
	}

	.fui-copy__tooltip-right::after {
		content: ' ';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(-100%, -50%);
		border-width: 5px;
		border-style: solid;
		border-color: transparent #181818 transparent transparent;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-copy__tl_fixed {
		position: fixed;
		align-items: center;
		justify-content: center;
	}

	.fui-ct__dir-row {
		flex-direction: row;
	}

	.fui-ct__dir-col {
		flex-direction: column;
	}

	.fui-copy__text-triangle {
		width: 12px;
		height: 12px;
		background: #181818;
	}

	.fui-ct__triangle-top {
		transform: rotate(45deg) translateY(-8px);
	}

	.fui-ct__triangle-bottom {
		transform: rotate(45deg) translateY(8px);
	}

	.fui-ct__triangle-right {
		transform: rotate(45deg) translateX(8px);
	}

	.fui-ct__triangle-left {
		transform: rotate(45deg) translateX(-8px);
	}

	.fui-ct__tool-show {
		opacity: 1;
	}

	.fui-ct__tool-hidden {
		opacity: 0;
	}

	/* #endif */
</style>