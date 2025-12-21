<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1  127，营业执照号： 9 144   0 6   05  M  A556H  1 KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-bubble__box-wrap" ref="fui_bb_wrap">
		<slot></slot>
		<view @touchmove.stop.prevent="stop" class="fui-bubble__box-mask"
			:class="[show?'fui-bb__unnvue-show':'',isShow?'fui-bb__opciaty-show':'fui-bb__opciaty-hidden']"
			:style="getMaskStyl" v-if="isMask && isVisible" @tap="handleClose"></view>
		<view class="fui-bubble__box-inner" ref="fui_bb_el" :style="getBbStyl"
			:class="[direction==='top' || direction==='bottom'?'fui-bubble__box-col':'fui-bubble__box-row',position==='absolute'?('fui-bb__list-'+direction):'',show?'fui-bb__unnvue-show':'',isShow?'fui-bb__opciaty-show':'fui-bb__opciaty-hidden']"
			v-if="isVisible">
			<view class="fui-bb__triangle-wrap" :style="getStyle" v-if="direction==='bottom' || direction==='right'">
				<view class="fui-bubble__box-triangle" :style="getStyles" :class="['fui-bb__triangle-'+direction]">
				</view>
			</view>
			<view class="fui-bubble__box-list" :style="{background:background,width:width+'rpx'}">
				<view class="fui-bubble__box-item"
					:style="{paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0}"
					v-for="(item,index) in items" :key="index" @tap.stop="handleClick(index)">
					<fui-icon :name="item.name" :size="item.size || 60" :color="item.color || color" v-if="item.name">
					</fui-icon>
					<image :src="item.src" :style="{width:(item.width || 48)+'rpx',height:(item.height || 48)+'rpx'}"
						v-if="item.src && !item.name"></image>
					<text :class="{'fui-bubble__box-text':item.name || item.src}"
						:style="{fontSize:size+'rpx',color:color,fontWeight:fontWeight}">{{item.text}}</text>
					<view class="fui-bubble__box-line"
						:class="[direction==='left'?'fui-bb__line-right':'fui-bb__line-left']"
						:style="{background:lineColor,left:direction==='left'?0:(padding[3] || padding[1] || 0),right:direction==='left'?(padding[3] || padding[1] || 0):0}"
						v-if="index!==items.length-1 && showLine"></view>
				</view>
				<slot name="content"></slot>
			</view>
			<view class="fui-bb__triangle-wrap" :style="getStyle" v-if="direction==='top' || direction==='left'">
				<view class="fui-bubble__box-triangle" :style="getStyles" :class="['fui-bb__triangle-'+direction]">
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	const animation = uni.requireNativePlugin('animation');
	// #endif
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: 'fui-bubble-box',
		emits: ['click', 'close'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			show: {
				type: Boolean,
				default: false
			},
			items: {
				type: Array,
				default () {
					return []
				}
			},
			width: {
				type: [Number, String],
				default: 300
			},
			padding: {
				type: Array,
				default () {
					return ['26rpx', '32rpx']
				}
			},
			position: {
				type: String,
				default: 'fixed'
			},
			left: {
				type: [Number, String],
				default: 0
			},
			right: {
				type: [Number, String],
				default: 0
			},
			top: {
				type: [Number, String],
				default: 0
			},
			bottom: {
				type: [Number, String],
				default: 0
			},
			direction: {
				type: String,
				default: 'bottom'
			},
			zIndex: {
				type: [Number, String],
				default: 997
			},
			background: {
				type: String,
				default: '#fff'
			},
			size: {
				type: [Number, String],
				default: 32
			},
			color: {
				type: String,
				default: '#181818'
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			showLine: {
				type: Boolean,
				default: true
			},
			lineColor: {
				type: String,
				default: '#eee'
			},
			triangle: {
				type: Object,
				default () {
					return {}
				}
			},
			isMask: {
				type: Boolean,
				default: true
			},
			maskBackground: {
				type: String,
				default: 'transparent'
			},
			maskClosable: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			getStyle() {
				let styles = ''
				if (this.direction === 'left' || this.direction === 'right') {
					styles += 'width:8px;'
				} else {
					styles += 'height:8px;'
				}
				return styles
			},
			getBbStyl() {
				let styl = `position:${this.position};z-index:${this.zIndex};`;
				// #ifdef APP-NVUE
				styl = 'position:fixed;';
				// #endif
				if (this.direction === 'top' || this.direction === 'bottom') {
					styl += `width:${this.width}rpx;`
				}
				if (this.position === 'fixed') {
					let tb = Number(this.top) ? `top:${this.top}rpx;` : '';
					tb += Number(this.bottom) ? `bottom:${this.bottom}rpx;` : '';
					styl += tb ? tb : `top:${this.top}rpx;`
					let lr = Number(this.left) ? `left:${this.left}rpx;` : '';
					lr += Number(this.right) ? `right:${this.right}rpx;` : '';
					styl += lr ? lr : `left:${this.left}rpx;`;
				} else {
					// #ifdef APP-NVUE
					switch (this.direction) {
						case 'top':
							styl += `left:${this.n_width / 2 + this.n_left}px;top:${this.n_top+2}px;`
							break;
						case 'left':
							styl += `left:${this.n_left+2}px;top:${this.n_height / 2 + this.n_top}px;`
							break;
						case 'right':
							styl += `left:${this.n_left+this.n_width-2}px;top:${this.n_height / 2 + this.n_top}px;`
							break;
						case 'bottom':
							styl += `left:${this.n_width / 2 + this.n_left}px;top:${this.n_top +this.n_height-2}px;`
							break;
						default:
							break;
					}
					// #endif

					let tb = Number(this.top) ? `margin-top:${this.top}rpx;` : '';
					tb += Number(this.bottom) ? `margin-top:-${this.bottom}rpx;` : '';
					styl += tb ? tb : `margin-top:${this.top}rpx;`
					let lr = Number(this.left) ? `margin-left:${this.left}rpx;` : '';
					lr += Number(this.right) ? `margin-left:-${this.right}rpx;` : '';
					styl += lr ? lr : `margin-left:${this.left}rpx;`;
				}
				return styl
			},
			getStyles() {
				let $this = this.triangle || {};
				let styl = `background:${this.background};${this.direction}:0;`
				if (this.direction === 'top' || this.direction === 'bottom') {
					styl += $this.left ? `left:${Math.max(32,$this.left || 0)}rpx;` :
						`right:${Math.max(32,$this.right || 0)}rpx;`;
				} else {
					styl += $this.top ? `top:${Math.max(32,$this.top || 0)}rpx;` :
						`bottom:${Math.max(32,$this.bottom || 0)}rpx;`;
				}
				return styl
			},
			getMaskStyl() {
				return `background:${this.maskBackground};z-index:${Number(this.zIndex) - 1};`
			}
		},
		watch: {
			show(val) {
				// #ifdef APP-NVUE
				if (!val) {
					this.isShow = false;
					setTimeout(() => {
						this.isVisible = val;
					}, 300)
				} else {
					this.isVisible = val;
					this.$nextTick(() => {
						setTimeout(() => {
							this._animation()
						}, 50)
					})
				}
				// #endif
			}
		},
		data() {
			return {
				isVisible: true,
				isShow: false,
				// #ifdef APP-NVUE
				n_width: 60,
				n_height: 12,
				n_top: 0,
				n_left: 0,
				transform: ''
				// #endif
			}
		},
		// #ifdef APP-NVUE
		created() {
			this.isVisible = this.show;
			if (this.position !== 'fixed') {
				this.transform = {
					top: 'translate(-50%, -100%)',
					left: 'translate(-100%, -50%)',
					right: 'translate(0, -50%)',
					bottom: 'translate(-50%, 0)'
				} [this.direction || 'top']
			}
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
			//nvue端每次点击时需要先调用此方法，回调中再进行显示
			init(callback) {
				if (this.position === 'fixed') return;
				dom.getComponentRect(this.$refs['fui_bb_wrap'], option => {
					if (option && option.result && option.size) {
						this.n_width = option.size.width
						this.n_height = option.size.height
						this.n_top = option.size.top
						this.n_left = option.size.left
						callback && callback(true)
					}
				})
			},
			_animation(type) {
				if (this.position === 'fixed') {
					this.isShow = true;
				} else {
					if (!this.$refs['fui_bb_el']) return;
					animation.transition(
						this.$refs['fui_bb_el'].ref, {
							styles: {
								transform: this.transform
							},
							duration: 0,
							needLayout: false,
							delay: 0 //ms
						}, () => {
							this.isShow = true;
						});
				}
			},
			// #endif
			handleClose() {
				if (!this.maskClosable) return;
				this.$emit('close', {});
			},
			handleClick(index) {
				this.$emit('click', {
					index: index
				});
			},
			stop() {
				return false;
			}
		}
	};
</script>

<style scoped>
	.fui-bubble__box-wrap {
		position: relative;
	}

	.fui-bubble__box-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		transition: all 0.3s ease-in-out;
		visibility: hidden;
		opacity: 0;
		/* #endif */
		/* #ifdef APP-NVUE */
		transition: opacity 0.3s ease-in-out;
		/* #endif */
		/* margin-top: -120rpx; */
		/* margin-left: 20rpx; */

	}


	.fui-bubble__box-list {
		border-radius: 8rpx;
		overflow: hidden;
		position: relative;
		/* #ifndef APP-NVUE */
		z-index: 5;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-bb__list-top {
		left: 50%;
		top: 0;
		/* margin-top: -10px; */
		transform: translate(-50%, -100%);
	}

	.fui-bb__list-bottom {
		left: 50%;
		top: 100%;
		/* margin-top: 10px; */
		transform: translate(-50%, 0);
	}

	.fui-bb__list-left {
		left: 0;
		top: 50%;
		/* margin-left: -10px; */
		transform: translate(-100%, -50%);
	}

	.fui-bb__list-right {
		left: 100%;
		top: 50%;
		/* margin-left: 10px; */
		transform: translate(0, -50%);
	}

	/* #endif */
	.fui-bubble__box-row {
		flex-direction: row;
	}

	.fui-bubble__box-col {
		flex-direction: column;
	}

	.fui-bubble__box-item {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-bubble__box-item:active {
		background: rgba(0, 0, 0, .2);
	}

	.fui-bubble__box-line {
		position: absolute;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 1px;
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		z-index: 1;
		/* #endif */
	}

	.fui-bb__line-left {
		left: 32rpx;
		right: 0;
	}

	.fui-bb__line-right {
		left: 0;
		right: 32rpx;
	}

	.fui-bubble__box-text {
		padding-left: 16rpx;
	}

	.fui-bubble__box-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifdef APP-NVUE */
		transition: opacity 0.3s ease-in-out;
		/* #endif */
		/* #ifndef APP-NVUE */
		opacity: 0;
		transition: all 0.3s ease-in-out;
		visibility: hidden;
		z-index: 3;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-bb__unnvue-show {
		opacity: 1 !important;
		visibility: visible !important;
	}

	/* #endif */

	.fui-bb__triangle-wrap {
		position: relative;
		overflow: hidden;
	}


	.fui-bubble__box-triangle {
		width: 10px;
		height: 10px;
		position: absolute;
	}

	.fui-bb__triangle-top {
		/* #ifndef APP-NVUE */
		transform: rotate(-45deg) translateY(-8px);
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: rotate(-45deg) translateY(-6.5px);
		/* #endif */
	}

	.fui-bb__triangle-bottom {
		/* #ifndef APP-NVUE */
		transform: rotate(45deg) translateY(8px);
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: rotate(45deg) translateY(6.5px);
		/* #endif */
	}

	.fui-bb__triangle-right {
		/* #ifndef APP-NVUE */
		transform: rotate(45deg) translateX(8px);
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: rotate(45deg) translateX(6.5px);
		/* #endif */

	}

	.fui-bb__triangle-left {
		/* #ifndef APP-NVUE */
		transform: rotate(-45deg) translateX(-8px);
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: rotate(-45deg) translateX(-6.5px);
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-bb__opciaty-show {
		opacity: 1;
	}

	.fui-bb__opciaty-hidden {
		opacity: 0;
	}

	/* #endif */
</style>