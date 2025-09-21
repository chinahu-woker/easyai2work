<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11 2 7，营业执照号：9 1440 6  05M        A 556 H 1 K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-white__space-wrap" :class="['fui-white__space-'+(getHeight?'':getSize)]" :style="getStyles"
		@tap="handleClick">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		emits: ['click'],
		name: "fui-white-space",
		props: {
			//small、default、large 默认优先使用全局配置
			size: {
				type: String,
				default: ''
			},
			height: {
				type: [Number, String],
				default: 0
			},
			background: {
				type: String,
				default: ''
			}
		},
		computed: {
			getSize() {
				const app = uni && uni.$fui && uni.$fui.fuiWhiteSpace;
				return this.size || (app && app.size) || 'default'
			},
			getHeight() {
				let style = ''
				const app = uni && uni.$fui && uni.$fui.fuiWhiteSpace;
				const h = Number(String(this.height || (app && app.height) || 0).replace('rpx', ''))
				if (h && h > 0) {
					style += `height:${h}rpx;`
				}
				return style
			},
			getStyles() {
				const app = uni && uni.$fui && uni.$fui.fuiWhiteSpace;
				let style = `background:${this.background || (app && app.background) || 'transparent'};`
				style += this.getHeight;
				return style;
			}
		},
		methods: {
			handleClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style scoped>
	.fui-white__space-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
	}

	.fui-white__space-small {
		height: 8rpx
	}

	.fui-white__space-default {
		height: 16rpx
	}

	.fui-white__space-large {
		height: 24rpx
	}
</style>