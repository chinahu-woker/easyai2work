<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：914  406  0 5 MA 5  56  H    1 K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<!-- #ifndef MP-QQ -->
	<canvas :style="{ width: w + 'px', height: h + 'px' }" :canvas-id="canvasId" :id="canvasId"
		class="fui-poster__canvas" v-if="canvasId"></canvas>
	<!-- #endif -->

	<!-- #ifdef MP-QQ -->
	<canvas :style="{ width: w + 'px', height: h + 'px' }" canvas-id="canvas_poster"
		class="fui-poster__canvas"></canvas>
	<!-- #endif -->
</template>

<script>
	// #ifdef MP-WEIXIN
	const canvasId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif
	//注意：h5、app-vue 中单个尺寸过大的 canvas 在 iOS/Safari 无法绘制（具体限制尺寸未公布）
	import poster from './index.js';
	export default {
		name: "fui-poster",
		emits: ['ready'],
		props: {
			//画布宽度，单位rpx
			width: {
				type: [Number, String],
				default: 750
			},
			//画布高度，单位rpx
			height: {
				type: [Number, String],
				default: 1024
			},
			//像素比率，缩放比
			pixelRatio: {
				type: [Number, String],
				// #ifdef MP-ALIPAY
				default: 3
				// #endif
				// #ifndef MP-ALIPAY
				default: 2
				// #endif
			}
		},
		data() {
			//如果小程序端无法识别，则使用固定值
			// #ifndef MP-WEIXIN || MP-QQ
			const canvasId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			//vue3下QQ小程序无法使用动态id
			// #ifdef MP-QQ
			const canvasId = 'canvas_poster'
			// #endif
			return {
				canvasId,
				w: 375,
				h: 512
			};
		},
		watch: {
			width(val) {
				this.w = this._toPx(val)
			},
			height(val) {
				this.h = this._toPx(val)
			}
		},
		created() {
			this.w = this._toPx(this.width)
			this.h = this._toPx(this.height)
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					poster.create(Number(this.pixelRatio), this.canvasId, this)
					this.$emit('ready')
				}, 50)
			})
		},
		methods: {
			_toPx(rpx) {
				return uni.upx2px(Number(rpx) * Number(this.pixelRatio))
			},
			_getPosterData(texts, blocks, lines, imgs, qrcode) {
				let queue = [].concat(texts.map((item) => {
					item.type = 'text';
					item.zIndex = item.zIndex || 0;
					return item;
				})).concat(blocks.map((item) => {
					item.type = 'block';
					item.zIndex = item.zIndex || 0;
					return item;
				})).concat(lines.map((item) => {
					item.type = 'line';
					item.zIndex = item.zIndex || 0;
					return item;
				})).concat(qrcode.map((item) => {
					item.type = 'qrcode';
					item.zIndex = item.zIndex || 0;
					return item;
				})).concat(imgs.map((item) => {
					item.type = 'image';
					item.zIndex = item.zIndex || 0;
					return item;
				}));
				// 按照顺序排序
				queue.sort((a, b) => a.zIndex - b.zIndex);
				return queue;
			},
			//生成海报
			generatePoster(params, callback) {
				let {
					texts = [], imgs = [], blocks = [], lines = [], qrcode = []
				} = params;
				//需要看平台支持情况，如果对应平台不支持将会绘制失败
				//图片处理 type：1-无需处理（base64、本地路径、网络路径等，需在平台支持下），2-网络图片，下载 3-base64转本地图片（只支持App，微信小程序，H5）
				if (imgs.length > 0) {
					let funcArr = []
					let idxArr = []
					imgs.forEach((item, index) => {
						if (item.type == 2) {
							funcArr.push(poster.getImage(item.imgResource))
							idxArr.push(index)
						}
						// #ifdef APP-PLUS || H5 || MP-WEIXIN
						if (item.type == 3) {
							funcArr.push(poster.getImagebyBase64(item.imgResource))
							idxArr.push(index)
						}
						// #endif
					})
					if (funcArr.length > 0) {
						Promise.all(funcArr).then(res => {
							res.forEach((imgRes, idx) => {
								let item = imgs[idxArr[idx]]
								item.imgResource = imgRes
								// console.log(imgRes)
							})
							const queue = this._getPosterData(texts, blocks, lines, imgs, qrcode);
							poster.generatePoster(this.width, this.height, queue, callback)

						}).catch(err => {
							// console.log(err)
							uni.showToast({
								title: '图片资源处理失败',
								icon: 'none'
							})
						})
					} else {
						const queue = this._getPosterData(texts, blocks, lines, imgs, qrcode);
						poster.generatePoster(this.width, this.height, queue, callback)
					}
				} else {
					const queue = this._getPosterData(texts, blocks, lines, imgs, qrcode);
					poster.generatePoster(this.width, this.height, queue, callback)
				}
			},
			saveImage(filePath) {
				poster.saveImage(filePath)
			},
			//删除已缓存文件，防止超出存储空间大小限制 【备用】
			//App、微信小程序、支付宝小程序、百度小程序、抖音小程序、飞书小程序、QQ小程序、京东小程序
			removeSavedFile() {
				//使用前请先查看支持平台
				let count = 0;
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-JD || MP-QQ || MP-LARK
					uni.getSavedFileList({
						success(res) {
							count = res.fileList.length;
							if (count > 0) {
								let num = 0;
								let list = res.fileList || []
								list.forEach(item => {
									uni.removeSavedFile({
										filePath: item.filePath,
										complete(res) {
											num++;
											if (num === count) {
												resolve(true)
											}
										}
									})
								})
							} else {
								resolve(true)
							}
						},
						fail() {
							reject(false)
						}
					})
					// #endif

					// #ifndef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-JD || MP-QQ || MP-LARK
					resolve(true)
					// #endif
				})
			}
		}
	}
</script>

<style scoped>
	.fui-poster__canvas {
		position: fixed;
		left: -6666px;
		bottom: 0;
	}
</style>