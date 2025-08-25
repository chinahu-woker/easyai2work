<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号： 9 1  440 6 0    5 MA556  H 1 KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-backtop__wrap"
		:style="{width:width+'rpx',height:width+'rpx',borderRadius:isNvue?width+'rpx':'50%' ,bottom: bottom + 'rpx', right: right + 'rpx',background:background }"
		v-if="isShow && visible" @tap.stop="goBacktop">
		<fui-icon :name="name" :size="52" :color="color" v-if="!custom"></fui-icon>
		<slot></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	// #endif
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-backtop",
		emits: ['click'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			scrollTop: {
				type: [Number, String]
			},
			targetRef: {
				type: [String, Object],
				default () {
					return {}
				}
			},
			threshold: {
				type: [Number, String],
				default: 320
			},
			width: {
				type: [Number, String],
				default: 80
			},
			bottom: {
				type: [Number, String],
				default: 160
			},
			right: {
				type: [Number, String],
				default: 40
			},
			background: {
				type: String,
				default: '#FFFFFF'
			},
			name: {
				type: String,
				default: 'top'
			},
			color: {
				type: String,
				default: '#333333'
			},
			custom: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			scrollTop(newValue, oldValue) {
				this.scrollChange();
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				isNvue: isNvue,
				isShow: false,
				visible: true
			};
		},
		methods: {
			goBacktop: function() {
				// #ifndef APP-NVUE
				//防止fixed元素先消失再显示
				this.visible = false;
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 120
				});
				setTimeout(() => {
					this.visible = true;
				}, 220);
				// #endif

				// #ifdef APP-NVUE
				if (this.targetRef) {
					dom.scrollToElement(this.targetRef, {});
				}
				// #endif
				this.$emit('click', {})
			},
			scrollChange() {
				let show = this.scrollTop > this.threshold;
				if ((show && this.isShow) || (!show && !this.isShow)) return;
				this.isShow = show;
			}
		}
	}
</script>

<style scoped>
	.fui-backtop__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		position: fixed;
		z-index: 888;
		/* #ifndef APP-NVUE */
		box-shadow: 0 0 6px rgb(0 0 0 / 12%);
		/* #endif */

		/* #ifdef APP-NVUE */
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
		/* #endif */
		justify-content: center;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
</style>