<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：  9 1440 6 05  M A55      6H 1K  XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-digital__keyboard-wrap"
		:class="{'fui-digital__keyboard__ani':show,'fui-dk__theme-light':theme==='light','fui-dk__theme-dark':theme==='dark','fui-dk__safe-weex':iphoneX && safeArea}"
		:style="{zIndex:zIndex}" ref="fui_dk_ani">
		<slot></slot>
		<view class="fui-digital__keyboard-grids">
			<view class="fui-digital__keyboard-left">
				<view class="fui-dk__left-wrap" v-for="(item,index) in items" :key="item.id">
					<view class="fui-dk__grid-left" v-for="(val,idx) in item.keys" :key="idx">
						<text :key="theme" :style="{fontSize:`${index===3 && idx===0? spareSize:40}rpx`}"
							class="fui-digital__keyboard-key"
							:class="{'fui-dk__key-dark':theme==='dark','fui-dk__key-light':theme!=='dark','fui-dk__highlight-dark':theme==='dark','fui-dk__highlight':theme==='light' && val}"
							@tap="keyClick(index,idx,val)">{{val}}</text>
					</view>
				</view>
			</view>
			<view class="fui-digital__keyboard-right">
				<view class="fui-dk__grid-right">
					<view :key="theme" class="fui-digital__keyboard-key"
						:class="{'fui-dk__key-dark':theme==='dark','fui-dk__key-light':theme!=='dark','fui-dk__highlight-dark':theme==='dark','fui-dk__highlight':theme!=='dark'}"
						@tap="backspace">
						<fui-icon :name="name" :size="56" :color="theme==='dark'?'#d1d1d1':'#333'"></fui-icon>
					</view>
				</view>
				<view class="fui-dk__button-wrap">
					<view class="fui-dk__button"
						:class="{'fui-dk__button-color':!getBgColor,'fui-dk__btn-disabled':disabled}"
						:style="{background:getBgColor}">
						<text class="fui-dk__button-text"
							:style="{color:color,fontSize:size+'rpx',fontWeight:fontWeight}">{{text}}</text>
						<view class="fui-dk__button-ck" :class="{'fui-dk__highlight':!disabled}" @tap.stop="confirm">
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: 'fui-digital-keyboard',
		emits: ['click', 'backspace', 'confirm', 'spare'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			show: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: '确定'
			},
			background: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#fff'
			},
			size: {
				type: [Number, String],
				default: 32
			},
			fontWeight: {
				type: [Number, String],
				default: 600
			},
			disabled: {
				type: Boolean,
				default: false
			},
			name: {
				type: String,
				default: 'backspace-fill'
			},
			decimal: {
				type: Boolean,
				default: false
			},
			spareKey: {
				type: String,
				default: ''
			},
			spareSize: {
				type: [Number, String],
				default: 32
			},
			theme: {
				type: String,
				default: 'light'
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
			decimal(val) {
				this.initData()
			},
			spareKey(val) {
				this.initData()
			}
		},
		computed: {
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
		data() {
			return {
				iphoneX: false,
				items: [{
					id: 'dk_1',
					keys: ['1', '2', '3']
				}, {
					id: 'dk_2',
					keys: ['4', '5', '6']
				}, {
					id: 'dk_3',
					keys: ['7', '8', '9']
				}, {
					id: 'dk_4',
					keys: ['', '0', '']
				}]
			};
		},
		created() {
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.iphoneX = this.isPhoneX();
			// #endif
			this.initData()
		},
		methods: {
			initData() {
				let keyArr = [...this.items];
				let sk = this.spareKey.toString()
				keyArr[3].keys[0] = sk && sk !== 'true' && sk !== 'undefined' ? sk : ''
				keyArr[3].keys[2] = this.decimal ? '.' : ''
				this.items = keyArr
			},
			// #ifdef APP-NVUE
			open() {
				setTimeout(() => {
					this._animation(true);
				}, 50);
			},
			close() {
				this._animation(false);
			},
			_animation(type) {
				let styles = {
					transform: `translateY(${type ? '0' : '100%'})`,
					opacity: type ? 1 : 0
				}
				if (!this.$refs['fui_dk_ani']) return;
				animation.transition(
					this.$refs['fui_dk_ani'].ref, {
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
				if (models.includes(model) || models.includes(newModel) || (res.safeAreaInsets && res.safeAreaInsets
						.bottom > 0)) {
					iphonex = true;
				}
				return iphonex;
			},
			// #endif
			keyClick(index, idx, val) {
				if (!this.show || !val) return;
				if (index === 3 && idx === 0) {
					this.$emit('spare', {
						value: val
					})
				} else {
					this.$emit('click', {
						value: val
					})
				}
			},
			backspace() {
				if (!this.show) return;
				this.$emit('backspace', {})
			},
			confirm() {
				if (this.disabled || !this.show) return;
				this.$emit('confirm', {})
			}
		}
	};
</script>

<style scoped>
	.fui-digital__keyboard-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transition-property: transform, visibility;
		transition-duration: .25s;
		transition-timing-function: ease-in-out;
		/* #endif */

		/* #ifndef APP-NVUE || MP-TOUTIAO */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		transform-origin: center center;
		/* #ifdef APP-NVUE */
		transform: translate(0, 100%);
		opacity: 0.01;
		border-top-style: solid;
		border-top-width: 0.5px;
		/* #endif */
	}

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-dk__safe-weex {
		padding-bottom: 34px;
	}

	/* #endif */


	.fui-dk__theme-light {
		background: #F8F8F8;
		/* #ifdef APP-NVUE */
		border-top-color: rgba(51, 51, 51, .1);
		/* #endif */
	}

	.fui-dk__theme-dark {
		background: #1B1B1B;
		/* #ifdef APP-NVUE */
		border-top-color: #333;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-digital__keyboard-wrap::before {
		content: " ";
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		-webkit-transform: scaleY(0.5) translateZ(0);
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
		z-index: 2;
		pointer-events: none;
	}

	.fui-dk__theme-light::before {
		border-top: 1px solid rgba(51, 51, 51, .1);
	}

	.fui-dk__theme-dark::before {
		border-top: 1px solid #333;
	}

	/* #endif */

	.fui-digital__keyboard__ani {
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 0, 0);
		visibility: visible;
		/* #endif */

		/* #ifdef APP-NVUE */
		opacity: 1;
		/* #endif */
	}


	.fui-digital__keyboard-grids {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: row;
		padding-top: 16rpx;
	}

	.fui-digital__keyboard-left {
		flex: 3;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		padding-right: 8rpx;
	}

	.fui-digital__keyboard-right {
		flex: 1;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: column;
		padding-left: 8rpx;
	}

	.fui-dk__left-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.fui-dk__grid-left {
		flex: 1;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		padding-left: 16rpx;
		padding-bottom: 16rpx;
	}

	.fui-dk__grid-right {
		padding-right: 16rpx;
		padding-bottom: 16rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
	}

	.fui-dk__button-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		flex-shrink: 0;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		padding-right: 16rpx;
		padding-bottom: 16rpx;
		flex: 1;
		flex-direction: column;
		justify-content: center;
	}

	.fui-dk__button {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		position: relative;
	}

	.fui-dk__button-ck {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border-radius: 8rpx;
		background: transparent;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-dk__button-text {
		text-align: center;
	}

	.fui-dk__btn-disabled {
		opacity: 0.5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.fui-digital__keyboard-key {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		flex-shrink: 0;
		overflow: hidden;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		font-size: 40rpx;
		font-weight: 600;
		height: 88rpx;
		/* #ifdef APP-NVUE */
		line-height: 88rpx;
		/* #endif */
		border-radius: 8rpx;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		text-align: center;
	}

	.fui-dk__key-light {
		background-color: #fff;
		color: #181818;
	}

	.fui-dk__key-dark {
		background-color: #222;
		color: #D1D1D1;
	}

	.fui-dk__highlight:active {
		background-color: rgba(0, 0, 0, .2);
	}

	.fui-dk__highlight-dark:active {
		background-color: #333 !important;
	}

	/* #ifndef APP-NVUE */
	.fui-dk__button-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
</style>