<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：9    1  440  605MA   55  6 H1K X  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<a v-if="isShowA" class="fui-link__text" :href="href"
		:class="{'fui-link__underline':underline,'fui-link__defcolor':!color,'fui-link__active':highlight}"
		:style="{color:getColor,fontSize:size+'rpx',fontWeight:fontWeight}" :download="download">
		<slot>{{text || href}}</slot>
	</a>
	<!-- #ifndef APP-NVUE -->
	<text v-else class="fui-link__text" :class="{'fui-link__underline':underline,'fui-link__defcolor':!color,'fui-link__active':highlight}"
		:style="{color:getColor,fontSize:size+'rpx',fontWeight:fontWeight}" @tap="openURL">
		<slot>{{text || href}}</slot>
	</text>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<text v-else class="fui-link__text" :class="{'fui-link__underline':underline,'fui-link__defcolor':!color,'fui-link__active':highlight}"
		:style="{color:getColor,fontSize:size+'rpx',fontWeight:fontWeight}" @tap="openURL">{{text || href}}</text>
	<!-- #endif -->
</template>

<script>
	export default {
		name: 'fui-link',
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			href: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			download: {
				type: String,
				default: ''
			},
			underline: {
				type: [Boolean, String],
				default: false
			},
			copyTips: {
				type: String,
				default: '链接已复制'
			},
			color: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 28
			},
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			highlight: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			isShowA() {
				let h5 = false
				// #ifdef H5
				h5 = true;
				// #endif
				if ((this.isMail() || this.isTel()) && h5) {
					return true;
				}
				return false;
			},
			getColor() {
				let color = this.color;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.link) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		methods: {
			isMail() {
				return this.href.startsWith('mailto:');
			},
			isTel() {
				return this.href.startsWith('tel:');
			},
			openURL() {
				// #ifdef APP-PLUS
				if (this.isTel()) {
					this.makePhoneCall(this.href.replace('tel:', ''));
				} else {
					plus.runtime.openURL(this.href);
				}
				// #endif
				// #ifdef H5
				window.open(this.href)
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: this.href,
					success: () => {
						uni.showToast({
							title: this.copyTips,
							icon: 'none'
						});
					}
				});

				// #endif
			},
			makePhoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})
			}
		}
	}
</script>

<style scoped>
	/* #ifdef H5 */
	.fui-link__text {
		cursor: pointer;
	}

	/* #endif */
	.fui-link__underline {
		text-decoration: underline;
	}

	/* #ifndef APP-NVUE */
	.fui-link__defcolor {
		color: var(--fui-color-link, #465CFF) !important;
	}

	/* #endif */
	.fui-link__active:active{
		opacity: .5;
	}
</style>