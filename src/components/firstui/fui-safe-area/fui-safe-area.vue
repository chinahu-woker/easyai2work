<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号：91440   60      5MA 556H  1 K X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-safe__area-wrap" :class="{'fui-safe__area-weex':iphonex}" :style="{background:background}"></view>
</template>

<script>
	export default {
		name: "fui-safe-area",
		props: {
			//背景颜色
			background: {
				type: String,
				default: '#FFFFFF'
			}
		},
		created() {
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.iphonex = this.isPhoneX();
			// #endif
		},
		data() {
			return {
				iphonex: false
			};
		},
		methods: {
			// #ifdef APP-NVUE || MP-TOUTIAO
			isPhoneX() {
				//34px
				const res = uni.getSystemInfoSync();
				let iphonex = false;
				let models = ['iphonex', 'iphonexr', 'iphonexsmax']
				for (let i = 11; i < 21; i++) {
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
			}
			// #endif
		}
	}
</script>

<style scoped>
	.fui-safe__area-wrap {
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
	}

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-safe__area-weex {
		padding-bottom: 34px;
	}

	/* #endif */
</style>