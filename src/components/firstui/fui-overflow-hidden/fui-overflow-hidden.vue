<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11 2  7，营业执照号：  91 4 4   060  5M  A55  6H1 KX   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view :key="visible" class="fui-overflow__hidden-wrap"
		:class="{'fui-overflow__hidden':type==1,'fui-gradient__hidden':type==2 && !visible,'fui-text__nowrap':type==1 && rows==1}"
		:style="{width:width,height:type==1 || visible?'auto':height,paddingTop:type==2?padding[0]:'0',paddingRight:type==2?padding[1]:0,paddingBottom:type==2?(padding[2] || padding[0]):0,paddingLeft:type==2?(padding[3] || padding[1]):0,background:background,fontSize:size+'rpx',color:color,fontWeight:fontWeight,'-webkit-line-clamp':type==1?rows:'none',textOverflow:overflow,textAlign:align}"
		@tap="handleTap">
		<!-- #ifdef APP-NVUE -->
		<text :key="visible"
			:style="{width:width,height:type==1 || visible?'auto':height,fontSize:size+'rpx',color:color,fontWeight:fontWeight,lines:type==1?rows:0,textOverflow:overflow,textAlign:align}"
			v-if="text">{{text}}</text>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		{{text}}
		<!-- #endif -->
		<slot></slot>
		<view class="fui-oh__gradient-wrap" :style="{background:getGradientBgColor}" v-if="type==2 && !visible"></view>
	</view>
</template>

<script>
	export default {
		name: "fui-overflow-hidden",
		emits: ['click'],
		props: {
			text: {
				type: String,
				default: ''
			},
			type: {
				type: [Number, String],
				default: 1
			},
			rows: {
				type: [Number, String],
				default: 1
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: 'auto'
			},
			padding: {
				type: Array,
				default () {
					return ['0', '0']
				}
			},
			align: {
				type: String,
				default: 'left'
			},
			background: {
				type: String,
				default: 'transparent'
			},
			size: {
				type: [Number, String],
				default: 32
			},
			color: {
				type: String,
				default: '#333333'
			},
			fontWeight: {
				type: [Number, String],
				default: 'normal'
			},
			overflow: {
				type: String,
				default: 'ellipsis'
			},
			gradientColor: {
				type: String,
				default: '#FFFFFF'
			},
			visible: {
				type: Boolean,
				default: false
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		computed: {
			getGradientBgColor() {
				// #ifdef APP-NVUE
				return `linear-gradient(to bottom, rgba(255,255,255,0), ${this.gradientColor})`
				// #endif

				// #ifndef APP-NVUE
				return `-webkit-linear-gradient(top, rgba(255,255,255,0), ${this.gradientColor})`
				// #endif
			}
		},
		methods: {
			handleTap(e) {
				this.$emit('click', {
					param: this.param
				})
			}
		}
	}
</script>

<style scoped>
	.fui-overflow__hidden-wrap {
		position: relative;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		flex-shrink: 0;
		/* #endif */
		flex: 1;
	}

	.fui-overflow__hidden {
		/* #ifndef APP-NVUE */
		display: -webkit-box;
		word-break: break-all;
		white-space: normal;
		-webkit-box-orient: vertical;
		/* #endif */
		overflow: hidden;
	}

	.fui-gradient__hidden {
		/* #ifndef APP-NVUE */
		display: block;
		word-break: break-all;
		/* #endif */
		overflow: hidden;
	}

	/* #ifndef APP-NVUE */
	.fui-text__nowrap {
		display: inline-block !important;
		word-break: normal !important;
		white-space: nowrap !important;
	}

	/* #endif */
	.fui-oh__gradient-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		z-index: 2;
		/* #endif */
		flex: 1;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>