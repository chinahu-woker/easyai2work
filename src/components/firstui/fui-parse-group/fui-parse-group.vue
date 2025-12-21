<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号：9 14  4 0 6 0 5  M   A     556H1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-parse__group">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "fui-parse-group",
		emits: ['atap', 'preview'],
		provide() {
			return {
				parsegroup: this
			}
		},
		props: {
			imgPreview: {
				type: Boolean,
				default: true
			},
			thBgcolor: {
				type: Boolean,
				default: true
			}
		},
		data() {
			const pageNodeKey = `fui_parse_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				pageNodeKey
			}
		},
		methods: {
			onATap(href) {
				this.$emit('atap', href)
			},
			previewImage(src, imageUrls) {
				this.$emit('preview', {
					src,
					imageUrls
				})
			}
		},
	}
</script>

<style scoped>
	.fui-parse__group {
		width: 100%;
	}
</style>