<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  12 7，营业执照号： 91  4 4 0    605 MA   5 56H1  KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-collapse__wrap" :style="{background:background}">
		<slot></slot>
	</view>
</template>
<script>
	export default {
		name: 'fui-collapse',
		emits: ['change'],
		props: {
			// 是否开启手风琴效果
			accordion: {
				type: Boolean,
				default: false
			},
			background: {
				type: String,
				default: 'transparent'
			}
		},
		created() {
			this.children = []
		},
		methods: {
			collapseChange(obj, isOpen, idx) {
				if (this.accordion && isOpen) {
					this.children.forEach((item, index) => {
						if (item !== obj) {
							item.isOpen = false
						}
					})
				}
				this.$emit('change', {
					index: idx,
					isOpen: isOpen
				})
			}
		}
	}
</script>
<style scoped>
	.fui-collapse__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
	}
</style>