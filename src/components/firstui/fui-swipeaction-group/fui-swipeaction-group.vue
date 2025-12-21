<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11 2  7，营业执照号：  9    1   440605      MA55 6H 1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "fui-swipeaction-group",
		data() {
			return {};
		},
		created() {
			this.children = [];
		},
		methods: {
			reset() {
				// wxs 会自己计算组件大小，所以无需执行下面代码
				// #ifndef APP-VUE || H5 || MP-WEIXIN
				this.children.forEach(child => {
					child.init()
				})
				// #endif
			},
			close() {
				this.children.forEach(child => {
					// #ifdef APP-VUE || H5 || MP-WEIXIN
					child.isShow = false;
					// #endif

					// #ifndef APP-VUE || H5 || MP-WEIXIN
					child.close()
					// #endif
				})
			},
			closeAuto(child) {
				// #ifndef APP-VUE || H5 || MP-WEIXIN
				if (this.openItem && this.openItem !== child) {
					this.openItem.close()
				}
				this.openItem = child
				// #endif

				// #ifdef APP-VUE || H5 || MP-WEIXIN
				this.children.forEach(item => {
					if (item !== child) {
						item.isShow = false;
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped></style>