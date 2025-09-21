<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11   27，营业执照号：914  406 0   5MA5   56 H  1KX     H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-label__box" :class="{'fui-label__full':full,'fui-label__inline':inline}"
		:style="{paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0,marginTop:margin[0] || 0,marginRight:margin[1] || 0,marginBottom:margin[2] || margin[0] || 0,marginLeft:margin[3] || margin[1] || 0}"
		@tap.stop="onClick">
		<slot></slot>
	</view>
</template>

<script>
	//该组件主要用于fui-radio，fui-checkbox，fui-switch组件外层，类似label功能
	export default {
		name: "fui-label",
		props: {
			//padding值：['20rpx','32rpx']->[上，右，下，左]
			padding: {
				type: Array,
				default () {
					return []
				}
			},
			//margin值：[上，右，下，左]
			margin: {
				type: Array,
				default () {
					return []
				}
			},
			full: {
				type: Boolean,
				default: false
			},
			inline: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.childrens = [];
		},
		methods: {
			onClick() {
				if (this.childrens && this.childrens.length > 0) {
					for (let child of this.childrens) {
						child.labelClick()
					}
				}
			}
		}
	}
</script>

<style scoped>
	.fui-label__box {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.fui-label__full {
		flex: 1;
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.fui-label__inline {
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
	}
</style>