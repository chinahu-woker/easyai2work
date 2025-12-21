<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  11 27，营业执照号：914 4 0  605     MA   55 6H1   KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-license__plate-wrap"
		:class="{'fui-license__plate__ani':show,'fui-lp__theme-light':theme==='light','fui-lp__theme-dark':theme==='dark','fui-lp__safe-weex':iphoneX && safeArea}"
		:style="{zIndex:zIndex}" ref="fui_lp_ani">
		<slot></slot>
		<view v-if="toolbar" class="fui-lp__btn-wrap"
			:class="[theme==='light'?'fui-lp__btnwrap-light':'fui-lp__btnwrap-dark']">
			<text class="fui-lp__button" :class="{'fui-lp__button-color':!color}"
				:style="{color:getColor,fontSize:size+'rpx',fontWeight:fontWeight}"
				@tap.stop="onComplete">{{text}}</text>
		</view>
		<view class="fui-license__plate-grids">
			<view class="fui-lp__grid-wrap" v-for="(item,index) in keyList" :key="item.id">
				<view class="fui-lp__grid"
					:class="{'fui-lp__grid-lg':index===3 && idx===0,'fui-lp__grid-hidden':!(type===1?val.cn:val.en)}"
					v-for="(val,idx) in item.keys" :key="idx">
					<text :key="theme" :style="{fontSize:`${index===3 && idx===0? 28:(type===1?32:36)}rpx`}"
						class="fui-license__plate-key"
						:class="{'fui-lp__key-dark':theme==='dark','fui-lp__key-light':theme!=='dark','fui-lp__highlight-dark':theme==='dark' && val,'fui-lp__highlight':theme==='light' && val}"
						@tap.stop="keyClick(index,idx,val)">{{type===1?val.cn:val.en}}</text>
				</view>
				<view class="fui-lp__grid fui-lp__grid-lg" v-if="index===3">
					<view :key="theme" class="fui-license__plate-key"
						:class="{'fui-lp__key-dark':theme==='dark','fui-lp__key-light':theme!=='dark','fui-lp__highlight-dark':theme==='dark','fui-lp__highlight':theme==='light'}"
						@tap.stop="backspace">
						<fui-icon :name="name" :size="48" :color="theme==='dark'?'#d1d1d1':'#333'"></fui-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import keys from './fui-license-plate.js'
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: 'fui-license-plate',
		emits: ['click', 'backspace', 'complete'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			show: {
				type: Boolean,
				default: false
			},
			toolbar: {
				type: Boolean,
				default: true
			},
			text: {
				type: String,
				default: '完成'
			},
			color: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 30
			},
			fontWeight: {
				type: [Number, String],
				default: 500
			},
			name: {
				type: String,
				default: 'backspace-fill'
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
			}
			// #endif
		},
		computed: {
			getColor() {
				let color = this.color;
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
				keyList: [],
				type: 1
			};
		},
		created() {
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.iphoneX = this.isPhoneX();
			// #endif
			this.keyList = keys;
		},
		methods: {
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
				if (!this.$refs['fui_lp_ani']) return;
				animation.transition(
					this.$refs['fui_lp_ani'].ref, {
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
				let text = this.type === 1 ? val.cn : val.en
				if (!this.show || !text) return;
				if (index === 3 && idx === 0) {
					this.type = this.type === 1 ? 2 : 1
				} else {
					this.$emit('click', {
						value: text
					})
				}
			},
			backspace() {
				if (!this.show) return;
				this.$emit('backspace', {})
			},
			onComplete() {
				if (!this.toolbar || !this.show) return;
				this.$emit('complete', {})
			},
			changeKeyboard(type = 'en') {
				this.type = type === 'en' ? 2 : 1
			}
		}
	};
</script>

<style scoped>
	.fui-license__plate-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transition-property: transform, visibility;
		transition-duration: .25s;
		transition-timing-function: ease-in-out;
		overflow: hidden;
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
	.fui-lp__safe-weex {
		padding-bottom: 34px;
	}

	/* #endif */

	.fui-lp__theme-light {
		background: #F1F4FA;
		/* #ifdef APP-NVUE */
		border-top-color: rgba(51, 51, 51, .1);
		/* #endif */
	}

	.fui-lp__theme-dark {
		background: #1B1B1B;
		/* #ifdef APP-NVUE */
		border-top-color: #333;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-license__plate-wrap::before {
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

	.fui-lp__theme-light::before {
		border-top: 1px solid rgba(51, 51, 51, .1);
	}

	.fui-lp__theme-dark::before {
		border-top: 1px solid #333;
	}

	/* #endif */

	.fui-license__plate__ani {
		/* #ifndef APP-NVUE */
		transform: translate3d(0, 0, 0);
		visibility: visible;
		/* #endif */

		/* #ifdef APP-NVUE */
		opacity: 1;
		/* #endif */
	}

	.fui-license__plate-grids {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		padding-top: 24rpx;
		/* #ifdef APP-NVUE */
		/* height: 472rpx; */
		/* #endif */
	}

	.fui-lp__grid-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		overflow: hidden;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.fui-lp__grid {
		width: 75rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		padding-left: 7rpx;
		padding-right: 7rpx;
		padding-bottom: 24rpx;
		opacity: 1;
	}

	.fui-lp__grid-lg {
		width: 112rpx;
	}

	.fui-lp__grid-hidden {
		width: 0;
		padding-left: 0;
		padding-right: 0;
		opacity: 0;
	}

	.fui-license__plate-key {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		font-weight: 500;
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
		/* #ifdef APP-NVUE */
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		/* #endif */
		text-align: center;
		position: relative;
	}

	.fui-lp__key-light {
		background: #fff;
		color: #181818;
		/* #ifdef APP-NVUE */
		border-bottom-color: rgba(0, 0, 0, .1);
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-license__plate-key::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		border-bottom: 1px solid #B2B2B2;
		z-index: 2;
		pointer-events: none;
		border-bottom-left-radius: 8rpx;
		border-bottom-right-radius: 8rpx;
	}

	.fui-lp__key-dark::after {
		border-bottom: 1px solid #4c4c4c !important;
	}

	/* #endif */
	.fui-lp__key-dark {
		/* #ifdef APP-NVUE */
		border-bottom-color: #333;
		/* #endif */
		background: #222;
		color: #D1D1D1;
	}

	.fui-lp__highlight:active {
		background: rgba(0, 0, 0, .2);
	}

	.fui-lp__highlight-dark:active {
		background: #333 !important;
	}

	.fui-lp__btn-wrap {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding: 24rpx 0;

	}

	.fui-lp__btnwrap-light {
		background-color: #F8F8F8;
	}

	.fui-lp__btnwrap-dark {
		background-color: #333;
	}

	.fui-lp__button {
		padding: 0 32rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-lp__button:active {
		opacity: .5;
	}

	/* #ifndef APP-NVUE */
	.fui-lp__button-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
</style>