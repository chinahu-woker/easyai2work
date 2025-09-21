<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  112 7，营业执照号：91 440 6 0    5   MA556 H 1     KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-bottom__navbar-wrap" :class="{'fui-bottom__navbar-fixed':isFixed}"
		:style="{background:background,zIndex:zIndex}">
		<view class="fui-bottom__navbar-inner" :class="{'fui-bottom__navbar-border':isBorder}"
			:style="{height:height+'rpx',borderTopColor:isBorder && isNvue?lineColor:'transparent'}">
			<view class="fui-bottom__navbar-item" :style="{height:height+'rpx'}" v-for="(item,index) in tabs"
				:key="index" @tap="itemClick(index)">
				<fui-icon :name="item.name" :size="item.size || 24" :color="item.color || color" v-if="item.name">
				</fui-icon>
				<image :src="item.src" :style="{width:(item.width || 40)+'rpx',height:(item.height || 40)+'rpx'}"
					v-if="item.src && !item.name"></image>
				<text
					:style="{fontSize:size+'rpx',color:color,fontWeight:fontWeight,paddingLeft:(item.name || item.src?left:0)+'rpx'}">{{item.text}}</text>
				<view class="fui-bottom__navbar-line" :style="{borderRightColor:lineColor}"
					v-if="index!==tabs.length-1 && isDivider"></view>
			</view>
		</view>
		<view class="fui-bn__safe-area" :class="{'fui-bn__safe-weex':iphoneX}"
			v-if="(iphoneX || !isNvue) && isFixed && safeArea">
		</view>
	</view>
</template>

<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-bottom-navbar",
		emits: ['init', 'click'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			items: {
				type: Array,
				default () {
					return []
				}
			},
			height: {
				type: [Number, String],
				default: 100
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
				default: '#333333'
			},
			left: {
				type: [Number, String],
				default: 0
			},
			background: {
				type: String,
				default: '#FFFFFF'
			},
			isBorder: {
				type: Boolean,
				default: true
			},
			isDivider: {
				type: Boolean,
				default: true
			},
			lineColor: {
				type: String,
				default: '#EEEEEE'
			},
			isFixed: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: [Number, String],
				default: 900
			},
			//是否适配底部安全区
			safeArea: {
				type: Boolean,
				default: true
			}
		},
		data() {
			let isNvue = false
			// #ifdef APP-NVUE
			isNvue = true
			// #endif
			return {
				tabs: [],
				iphoneX: false,
				isNvue: isNvue
			};
		},
		created() {
			// #ifndef H5
			this.emitInit()
			// #endif
			this.initData(this.items)
		},
		// #ifdef H5
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.emitInit()
				}, 50)
			})
		},
		// #endif
		watch: {
			items(vals) {
				this.initData(vals)
			}
		},
		methods: {
			emitInit() {
				const res = uni.getSystemInfoSync();
				let iphonex = this.isPhoneX(res);
				// #ifdef APP-NVUE || MP-TOUTIAO
				this.iphoneX = iphonex;
				// #endif
				let safeAreaH = iphonex ? 34 : 0
				this.$emit('init', {
					height: uni.upx2px(this.height) + safeAreaH,
					windowWidth: res.windowWidth
				})
			},
			initData(vals) {
				if (vals && vals.length > 0) {
					if (typeof vals[0] === 'string') {
						vals = vals.map(item => {
							return {
								text: item
							}
						})
					}
					this.tabs = vals;
				}
			},
			isPhoneX(res) {
				if (!this.safeArea) return false;
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
			itemClick(index) {
				this.$emit('click', {
					index: index,
					...this.tabs[index]
				})
			}
		}
	}
</script>

<style scoped>
	.fui-bottom__navbar-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-bottom__navbar-fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.fui-bottom__navbar-inner {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.fui-bottom__navbar-border {
		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-bottom__navbar-border::before {
		content: ' ';
		border-top: 1px solid var(--fui-color-border, #EEEEEE);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
		display: block;
		z-index: 3;
	}

	/* #endif */
	.fui-bottom__navbar-item {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-bottom__navbar-item:active {
		background: rgba(0, 0, 0, .2);
	}

	.fui-bottom__navbar-line {
		position: absolute;
		/* #ifdef APP-NVUE */
		border-right-width: 0.5px;
		/* #endif */
		border-right-style: solid;
		border-right-color: #EEEEEE;
		/* #ifndef APP-NVUE */
		border-right-width: 1px;
		transform: scaleX(0.5) translateZ(0);
		/* #endif */
		right: 0;
		top: 16rpx;
		bottom: 16rpx;
	}

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-bn__safe-weex {
		padding-bottom: 34px;
	}

	/* #endif */
	.fui-bn__safe-area {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */

		/* #ifndef APP-NVUE || MP-TOUTIAO */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		flex: 1;
		flex-direction: row;
		background-color: transparent;
	}
</style>