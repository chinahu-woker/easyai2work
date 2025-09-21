<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1  127，营业执照号：   91 4 40 605M      A    556H1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-tabbar__wrap" :class="{'fui-tabbar__fixed':isFixed}"
		:style="{background:background,zIndex:zIndex}">
		<view class="fui-tabbar__inner" :class="{'fui-tababr__border':isBorder}"
			:style="{borderTopColor:isBorder && isNvue?borderColor:'transparent'}">
			<view class="fui-tabbar__item" v-for="(item,index) in tabs" :key="index" @tap="itemClick(index)">
				<view class="fui-tabbar__icon-wrap"
					:style="{width:(isNvue && item.midButton && item.width?item.width:56)+'rpx',height:(isNvue && item.midButton && item.height?item.height:56)+'rpx'}"
					v-if="item.iconPath || item.iconName">
					<image class="fui-tabbar__icon" :src="current==index?item.selectedIconPath:item.iconPath"
						v-if="!item.midButton && item.iconPath"></image>
					<!-- #ifdef APP-NVUE -->
					<image v-if="item.midButton" class="fui-tabbar__icon" :src="item.iconPath"
						:style="{width:(item.width || 56)+'rpx',height:(item.height || 56)+'rpx'}">
					</image>
					<!-- #endif -->
					<fui-icon v-if="item.iconName && !item.iconPath && !item.midButton"
						:name="current==index?item.selectedIconName:item.iconName" :size="item.iconSize || iconSize"
						:unit="item.iconUnit || iconUnit"
						:color="current==index?(item.selectedColor || getSelectedColor):(item.color || color)"
						:customPrefix="item.customPrefix || ''"></fui-icon>
					<text
						:class="[item.dot?'fui-tabbar__dot':'fui-tabbar__badge',badgeBackground?'':'fui-tabbar__badge-color']"
						:style="{background:getBadgeBgColor,color:badgeColor,width:getWidth(item.badge,item.dot)}"
						v-if="item.badge">{{item.dot?'':item.badge}}</text>
				</view>
				<text class="fui-tabbar__text"
					:style="{fontSize:size+'rpx',fontWeight:fontWeight,color:current==index?(item.selectedColor || getSelectedColor):(item.midButton?(item.color || color):color)}"
					v-if="item.text">{{item.text}}</text>

				<!-- #ifndef APP-NVUE -->
				<image v-if="item.midButton" class="fui-tabbar__mid-button"
					:class="{'fui-tabbar__mid-center':item.center}" :src="item.iconPath"
					:style="{width:(item.width || 56)+'rpx',height:(item.height || 56)+'rpx',bottom:item.bottom+'rpx'}">
				</image>
				<!-- #endif -->

			</view>
		</view>
		<view class="fui-tabbar__safe-area" :class="{'fui-tabbar__safe-weex':safeAreaH>0}"
			v-if="(safeAreaH>0 || !isNvue) && safeArea && isFixed"></view>
	</view>
</template>

<script>
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: 'fui-tabbar',
		emits: ['init', 'click'],
		// components: {
		// 	fuiIcon
		// },
		props: {
			tabBar: {
				type: Array,
				default () {
					return [];
				}
			},
			//当前索引
			current: {
				type: [Number, String],
				default: 0
			},
			size: {
				type: [Number, String],
				default: 24
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			//V2.2.0+ 字体图标字体大小 rpx
			iconSize: {
				type: [Number, String],
				default: 56
			},
			//V2.2.0+ 字体图标字体大小 rpx
			iconUnit: {
				type: String,
				default: 'rpx'
			},
			//字体颜色
			color: {
				type: String,
				default: '#333333'
			},
			//字体选中颜色
			selectedColor: {
				type: String,
				default: ''
			},
			//背景颜色
			background: {
				type: String,
				default: '#FFFFFF'
			},
			isBorder: {
				type: Boolean,
				default: true
			},
			borderColor: {
				type: String,
				default: '#EEEEEE'
			},
			//固定在底部
			isFixed: {
				type: Boolean,
				default: true
			},
			//角标字体颜色
			badgeColor: {
				type: String,
				default: '#FFFFFF'
			},
			//角标背景颜色
			badgeBackground: {
				type: String,
				default: ''
			},
			//z-index
			zIndex: {
				type: [Number, String],
				default: 980
			},
			//是否适配底部安全区
			safeArea: {
				type: Boolean,
				default: true
			},
			//v1.9.9+ 非nvue端是否返回安全区固定高度
			fixedHeight: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			tabBar(vals) {
				this.initData(vals)
			}
		},
		computed: {
			getSelectedColor() {
				let color = this.selectedColor

				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				return color
			},
			getBadgeBgColor() {
				let color = this.badgeBackground
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.danger) || '#FF2B2B';
				}
				// #endif
				return color
			}
		},
		data() {
			let isNvue = false
			// #ifdef APP-NVUE
			isNvue = true
			// #endif
			return {
				tabs: [],
				safeAreaH: 0,
				isNvue: isNvue
			};
		},
		created() {
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.safeAreaH = this.isPhoneX() ? 34 : 0;
			// #endif
			// #ifndef APP-NVUE || MP-TOUTIAO
			if (this.fixedHeight) {
				this.safeAreaH = this.isPhoneX() ? 34 : 0;
			}
			// #endif
			//非nvue端在iphonex等异形屏包含安全区域高度需将属性 fixedHeight 设为true
			this.$emit('init', {
				height: uni.upx2px(100) + this.safeAreaH
			})
			this.initData(this.tabBar)
		},
		methods: {
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
			getWidth(value, dot) {
				return dot ? '16rpx' : ((String(value).length * 12 + 20) + 'rpx')
			},
			itemClick(index) {
				this.$emit('click', {
					index: index,
					...this.tabs[index]
				})
			}
		}
	};
</script>

<style scoped>
	.fui-tabbar__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-tabbar__fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.fui-tabbar__inner {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex: 1;
		height: 100rpx;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.fui-tababr__border {
		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-tababr__border::before {
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

	.fui-tabbar__item {
		flex: 1;
		height: 100rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-tabbar__icon-wrap {
		width: 56rpx;
		height: 56rpx;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.fui-tabbar__badge {
		position: absolute;
		height: 32rpx;
		padding: 0 8rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 32rpx;
		border-radius: 16rpx;
		/* #ifndef APP-NVUE */
		min-width: 32rpx !important;
		display: flex;
		box-sizing: border-box;
		z-index: 10;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		right: -20rpx;
		/* #endif */
		/* #ifdef APP-NVUE */
		right: 0;
		/* #endif */
		top: 0;
		text-align: center;
	}

	.fui-tabbar__dot {
		position: absolute;
		height: 16rpx;
		width: 16rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		right: -4rpx;
		top: -4rpx;
		/* #endif */

		/* #ifdef APP-NVUE */
		border-radius: 8rpx;
		right: 0;
		top: 0;
		/* #endif */
	}

	.fui-tabbar__icon {
		width: 56rpx;
		height: 56rpx;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-tabbar__mid-button {
		position: absolute;
		z-index: 4;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fui-tabbar__mid-center {
		top: 50% !important;
		transform: translate(-50%, -50%) !important;
	}

	/* #endif */

	.fui-tabbar__safe-area {
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

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-tabbar__safe-weex {
		padding-bottom: 34px;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-tabbar__badge-color {
		background: var(--fui-color-danger, #FF2B2B) !important;
	}

	/* #endif */
</style>