<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 1 27，营业执照号：9   1 4  4  06 0 5  M A 5 56H1K  XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-vtabs-content__wrap" ref="fui_vtabs__el" :id="'fui-vtabs-content__'+tabIndex">
		<slot></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	// #endif
	export default {
		name: "fui-vtabs-content",
		inject: ['vtabs'],
		props: {
			tabIndex: {
				type: [Number, String],
				default: 0
			}
		},
		mounted() {
			if (this.vtabs && this.vtabs.linkage) {
				this.vtabs.children.push(this)
				this.$nextTick(()=>{
					setTimeout(() => {
						this.calcHeight((height) => {
							this.vtabs.getCalcHeight(height, Number(this.tabIndex))
						})
					}, 300)
				})
			}
		},
		// #ifndef VUE3
		// TODO vue2
		beforeDestroy() {
			this.uninstall()
		},
		// #endif
		// #ifdef VUE3
		// TODO vue3
		beforeUnmount() {
			this.uninstall()
		},
		// #endif
		methods: {
			calcHeight(callback, index = 0) {
				// #ifdef APP-NVUE
				const result = dom.getComponentRect(this.$refs['fui_vtabs__el'], option => {
					if (option && option.result && option.size) {
						callback && callback(option.size.height + 1)
					}
				})
				// #endif

				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select(`#fui-vtabs-content__${this.tabIndex}`)
					.fields({
						size: true
					}, data => {
						if (index >= 12) return
						if (data && data.height) {
							callback && callback(data.height)
						} else {
							index++
							setTimeout(() => {
								this.calcHeight(callback, index)
							}, 50)
							return
						}
					})
					.exec()
				// #endif
			},
			uninstall() {
				if (this.vtabs && this.vtabs.linkage) {
					this.vtabs.uninstall(Number(this.tabIndex),this)
				}
			}
		}
	}
</script>

<style scoped>
	.fui-vtabs-content__wrap {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}
</style>