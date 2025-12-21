<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 12 7，营业执照号：91440         6 05M A55   6H1   KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-drag__item-outer" :style="{width:width+'px',height:height+'px'}">
		<view class="fui-drag__item-wrap" :class="{'fui-drag__item-padding':type==2}"
			:style="{width:width-(padding*2)+'px',height:height-(padding*2)+'px',background:background,'justify-content':type==1?'center':'space-between'}">
			<view class="fui-drag__item-inner" :class="{'fui-drag__item-column':type==1}">
				<view class="fui-drag__item-icon" @tap.stop="handleDel" :class="{'fui-drag__item-mr':type==2}"
					v-if="type==2 && isDel">
					<fui-icon name="minussign-fill" :color="delColor" :size="48"></fui-icon>
				</view>
				<image :draggable="false" :style="{width:width-(padding*2)+'px',height:height-(padding*2)+'px'}"
					:src="src" class="fui-drag__item-img" :class="{'fui-drag__item-mr':type==2}"
					v-if="src && src!==true && src!=='true' && type==1">
				</image>
				<view class="fui-drag__item-icon" @tap.stop="handleDel" :class="{'fui-drag__item-ab':type==1}"
					v-if="type==1 && isDel">
					<fui-icon name="clear-fill" :color="delColor" :size="48"></fui-icon>
				</view>
				<text class="fui-drag__item-text" :style="{color:color,fontSize:size+'rpx'}"
					v-if="text!='' && text!==true && type==2">{{text}}</text>
			</view>
			<fui-icon v-if="type==2 && isMenu" name="menu" :size="48" :color="slideColor"></fui-icon>
		</view>
	</view>
</template>

<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "f-drag-item",
		emits: ['delete'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			width: {
				type: [Number, String],
				default: 40
			},
			height: {
				type: [Number, String],
				default: 40
			},
			src: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			index: {
				type: [Number, String],
				default: 0
			},
			styles: {
				type: Object,
				default () {
					return {}
				}
			},
			isMenu: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				type: 1,
				padding: 0,
				background: "#fff",
				size: 30,
				color: '#181818',
				isDel: false,
				delColor: '#FF2B2B',
				slideColor: '#B2B2B2'
			}
		},
		watch: {
			styles(vals) {
				this.init(vals)
			}
		},
		created() {
			this.init(this.styles)
		},
		methods: {
			init(styles) {
				styles = styles || {}
				this.type = styles.type || 1
				this.padding = Number(styles.padding || 0)
				this.background = styles.background || "#fff"
				this.size = styles.size || 30
				this.color = styles.color || '#181818'
				this.isDel = styles.isDel || false
				const app = uni && uni.$fui && uni.$fui.color;
				const dangerColor = (app && app.danger) || '#FF2B2B';
				this.delColor = styles.delColor || dangerColor
				this.slideColor = styles.slideColor || '#B2B2B2'
			},
			handleDel() {
				this.$emit('delete', {
					index: this.index
				})
			}
		}
	}
</script>

<style scoped>
	.fui-drag__item-outer {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.fui-drag__item-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-drag__item-padding {
		padding: 0 32rpx;
		position: absolute;
		/* #ifdef APP-NVUE */
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		border-bottom-color: #eee;
		z-index: -1;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-drag__item-padding::after {
		content: '';
		position: absolute;
		border-bottom: 1px solid #eee;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 100%;
		left: 32rpx;
		right: 0;
		bottom: 0;
		z-index: 1;
	}

	/* #endif */

	.fui-drag__item-inner {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-drag__item-icon {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
	}

	.fui-drag__item-ab {
		position: absolute;
		right: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		z-index: 2;
		/* #endif */
	}

	.fui-drag__item-mr {
		margin-right: 20rpx;
	}

	.fui-drag__itemicon {
		position: absolute;
	}

	.fui-drag__item-img {
		/* #ifndef APP-NVUE */
		display: block;
		pointer-events: none;
		flex-shrink: 0;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		/* #endif */
	}

	.fui-drag__item-text {
		font-size: 30rpx;
		font-weight: normal;
		flex: 1;
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
		text-overflow: ellipsis;
	}
</style>