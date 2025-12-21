<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11  2 7，营业执照号：9 1440    60 5 MA 55  6 H   1K   XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-gallery__wrap" :style="{zIndex:zIndex}" :class="[show?'fui-gallery__show':'fui-gallery__hidden']"
		v-if="show || !isNvue">
		<swiper class="fui-gallery__img-wrap" :style="{height:height+'px'}" :indicator-dots="false" @change="change"
			:current="defActive" :autoplay="false" :duration="500">
			<swiper-item :style="{height:height+'px'}" v-for="(item,index) in imgUrls" :key="index">
				<view class="fui-gallery__swiper-item" :style="{height:height+'px'}">
					<image mode="aspectFit" class="fui-gallery__img" :style="{height:height+'px'}" :src="item[srcKey]"
						@tap.stop="hideGallery"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="fui-gallery__index-wrap" :style="{top:top+'px'}">
			<text class="fui-gallery__index">{{active+1}}/{{imgUrls.length}}</text>
		</view>
		<view class="fui-gallery__descr-wrap" :class="{'fui-gallery__weex-safe':iphoneX && safeArea}" v-if="descr">
			<text class="fui-gallery__descr" :class="{'fui-gallery__text-ellipsis':ellipsis}">{{descr}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'fui-gallery',
		emits: ['change', 'hide'],
		props: {
			urls: {
				type: Array,
				default () {
					return []
				}
			},
			srcKey: {
				type: String,
				default: 'src'
			},
			descrKey: {
				type: String,
				default: 'descr'
			},
			show: {
				type: Boolean,
				default: false
			},
			current: {
				type: [Number, String],
				default: 0
			},
			//文字超出是否省略成一行
			ellipsis: {
				type: Boolean,
				default: false
			},
			zIndex: {
				type: [Number, String],
				default: 1001
			},
			//是否适配底部安全区
			safeArea: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			urls(newVal, oldVal) {
				this.initData(newVal)
			},
			current(newVal) {
				this.defActive = this.active;
				let val = Number(newVal)
				setTimeout(() => {
					this.defActive = val;
					this.active = val;
				}, 20)
			}
		},
		mounted() {
			let sys = uni.getSystemInfoSync()
			this.height = sys.windowHeight
			this.top = sys.statusBarHeight + 20
			// #ifdef APP-NVUE || MP-TOUTIAO
			this.iphoneX = this.isPhoneX(sys)
			// #endif
			this.defActive = Number(this.current);
			this.active = this.defActive;
			this.initData(this.urls)
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				isNvue: isNvue,
				imgUrls: [],
				active: 0,
				defActive: 0,
				top: 20,
				descr: '',
				iphoneX: false,
				height: 800
			};
		},
		methods: {
			initData(vals) {
				if (vals && vals.length > 0) {
					if (typeof vals[0] === 'string') {
						vals = vals.map(item => {
							return {
								[this.srcKey]: item
							}
						})
					}
					this.imgUrls = vals;
					this.$nextTick(() => {
						setTimeout(() => {
							this.getDescr(this.active)
						}, 10)
					})
				}
			},
			change(e) {
				this.active = e.detail.current
				this.getDescr(this.active)
				this.$emit('change', {
					index: this.active
				});
			},
			getDescr(index) {
				let item = this.imgUrls[index]
				if (item) {
					this.descr = item[this.descrKey] || ''
				}
			},
			// #ifdef APP-NVUE || MP-TOUTIAO
			isPhoneX(res) {
				if (!this.safeArea) return false;
				let iphonex = false;
				let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax',
					'iphone12', 'iphone12mini', 'iphone12pro', 'iphone12promax', 'iphone13', 'iphone13mini',
					'iphone13pro', 'iphone13promax', 'iphone14', 'iphone14mini',
					'iphone14pro', 'iphone14promax', 'iphone15', 'iphone15mini',
					'iphone15pro', 'iphone15promax'
				]
				const model = res.model.replace(/\s/g, "").toLowerCase()
				const newModel = model.split('<')[0]
				if (models.includes(model) || models.includes(newModel) || (res.safeAreaInsets && res.safeAreaInsets
						.bottom > 0)) {
					iphonex = true;
				}
				return iphonex;
			},
			// #endif
			hideGallery() {
				this.$emit('hide', {});
			}
		}
	}
</script>

<style scoped>
	.fui-gallery__wrap {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #000;
	}

	.fui-gallery__img-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
		position: relative;
		font-size: 0;
	}

	.fui-gallery__swiper-item {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.fui-gallery__hidden {
		/* #ifndef APP-NVUE */
		display: none;
		visibility: hidden;
		/* #endif */
	}

	.fui-gallery__show {
		/* #ifndef APP-NVUE */
		display: flex;
		visibility: visible;
		/* #endif */
		flex-direction: column;
	}

	.fui-gallery__index-wrap {
		position: absolute;
		left: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.fui-gallery__index {
		/* #ifndef APP-NVUE */
		display: flex;
		align-items: center;
		justify-content: center;
		/* #endif */
		font-size: 34rpx;
		line-height: 34rpx;
		color: #fff;
		text-align: center;
		font-weight: normal;
		padding: 6rpx 20rpx;
		border-radius: 100px;
		background: rgba(0, 0, 0, .6);
	}

	.fui-gallery__descr-wrap {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(17, 17, 17, .6);
		/* #ifndef APP-NVUE || MP-TOUTIAO */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	/* #ifdef APP-NVUE || MP-TOUTIAO */
	.fui-gallery__weex-safe {
		padding-bottom: 34px;
	}

	/* #endif */

	.fui-gallery__descr {
		flex: 1;
		font-size: 30rpx;
		color: #fff;
		font-weight: normal;
		padding: 26rpx 32rpx;
		/* #ifndef APP-NVUE */
		display: block;
		box-sizing: border-box;
		z-index: 10;
		/* #endif */
	}

	.fui-gallery__text-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
	}

	.fui-gallery__img {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
	}
</style>