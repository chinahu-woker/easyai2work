<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  112 7，营业执照号： 91   4 406 05   MA 5 56 H1K   X  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-image__cropper" :style="{zIndex:zIndex,background:background}" @touchmove.stop.prevent="stop">
		<!-- #ifdef APP-VUE || MP-WEIXIN || H5 -->
		<image :data-app="isApp" @touchstart="handler.touchstart" @touchmove="handler.touchmove" @touchend="handler.touchend"
			@mousedown="handler.mousedown" class="fui-cropper__img"
			:class="{'fui-cropper__img-hidden':!src || !initVal}" :src="src"
			:style="{width: (imgWidth ? imgWidth : width) + 'px',height: imgHeight ? imgHeight + 'px' : 'auto',transitionDuration: ani ?'0.25s' : '0s'}"
			mode="widthFix">
		</image>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<image ref="fui_cropper_img" class="fui-cropper__img" :src="src"
			:style="{width: (imgWidth ? imgWidth : width) + 'px',height: imgHeight ? imgHeight + 'px' : 'auto'}"
			mode="widthFix">
		</image>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
		<image @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" class="fui-cropper__img"
			:class="{'fui-cropper__img-hidden':!src || !initVal}" :src="src"
			:style="{width: (imgWidth ? imgWidth : width) + 'px',height: imgHeight ? imgHeight + 'px' : 'auto',transitionDuration: ani ?'0.25s' : '0s',transform:getTransform}"
			mode="widthFix">
		</image>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-cropper__mask">
			<view class="fui-cropper__top" :style="{height:(windowHeight-canvasHeight)/2+'px'}"></view>
			<view class="fui-cropper__left" :style="{width:(windowWidth-canvasWidth)/2+'px',height:height+'px'}"></view>
			<view class="fui-cropper__right" :style="{width:(windowWidth-canvasWidth)/2+'px',height:height+'px'}">
			</view>
			<view class="fui-cropper__bottom" :style="{height:(windowHeight-canvasHeight)/2+'px'}"></view>
			<view class="fui-cropper__border"
				:style="{width:width+'px',height:height+'px', borderRadius: round ? canvasWidth/2+'px' : '0',borderColor:borderColor}">
			</view>
			<view class="fui-cropper__real-el"
				:style="{width: (imgWidth ? imgWidth : width) + 'px',height: imgHeight ? imgHeight + 'px' : 'auto'}"
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" ref="fui_cropper_real"></view>
		</view>
		<!-- #endif -->

		<!-- #ifndef APP-NVUE -->
		<view class="fui-cropper__mask"
			:style="{ width: width + 'px', height: height + 'px', borderRadius: round ? '50%' : '0' }">
			<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
			<view class="fui-cropper__border" :change:prop="handler.valsChange" :prop="changeval" :data-width="width"
				:data-height="height" :data-windowheight="windowHeight" :data-windowwidth="windowWidth"
				:data-imgwidth="imgWidth" :data-imgheight="imgHeight" :data-imgtop="imgTop" :data-imgLeft="imgLeft"
				:data-angle="angle" :style="{ borderRadius: round ? '50%' : '0',borderColor:borderColor}"></view>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
			<view class="fui-cropper__border" :style="{ borderRadius: round ? '50%' : '0',borderColor:borderColor}">
			</view>
			<!-- #endif -->
		</view>
		<!-- #endif -->

		<!-- #ifndef APP-NVUE -->
		<canvas canvas-id="fui_image_cropper" id="fui_image_cropper" :disable-scroll="true"
			:style="{ width: nWidth * nScaleRatio + 'px', height:  nHeight * nScaleRatio + 'px' }"
			class="fui-cropper__canvas"></canvas>
		<!-- #endif -->
	</view>
</template>

<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->

<script>
	import mpjs from './mpjs.js'
	import bindingx from './bindingx.js'
	export default {
		name: "fui-image-cropper",
		mixins: [mpjs, bindingx],
		props: {
			src: {
				type: String,
				default: ''
			},
			//裁剪框高度 px
			height: {
				type: [Number, String],
				default: 280
			},
			//裁剪框宽度 px
			width: {
				type: [Number, String],
				default: 280
			},
			//是否为圆形裁剪框
			round: {
				type: Boolean,
				default: false
			},
			borderColor: {
				type: String,
				default: '#B2B2B2'
			},
			// #ifndef MP-QQ
			scaleRatio: {
				type: [Number, String],
				default: 2
			},
			// #endif
			// #ifdef MP-QQ
			scaleRatio: {
				type: [Number, String],
				default: 3
			},
			// #endif
			//图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
			quality: {
				type: Number,
				default: 0.8
			},
			fileType: {
				type: String,
				default: 'png'
			},
			//是否为网络图片
			network: {
				type: Boolean,
				default: false
			},
			background: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			zIndex: {
				type: [Number, String],
				default: 10
			},
			isNav: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			src(val) {
				this.initVal && this.handleImage(val)
			},
			ani(val) {
				clearTimeout(this.aniTimer);
				if (val) {
					this.aniTimer = setTimeout(() => {
						this.ani = false;
					}, 220);
				}
			},
			scaleRatio(val) {
				this.nScaleRatio = Number(val) || 2
			},
			width(val) {
				this.nWidth = Number(val) || 280
				this.changeReset()
			},
			height(val) {
				this.nHeight = Number(val) || 280
				this.changeReset()
			}
		},
		data() {
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				windowHeight: 600,
				windowWidth: 400,
				cutX: 0,
				cutY: 0,
				imgWidth: 0,
				imgHeight: 0,
				scale: 1,
				angle: 0,
				ani: false,
				imgTop: 0,
				imgLeft: 0,
				changeval: '',
				initVal: false,
				naturalWidth: 0,
				naturalHeight: 0,
				picturePath: '',
				rotateAngle: 0,
				nScaleRatio: 2,
				nWidth: 280,
				nHeight: 280
			};
		},
		created() {
			this.cutTimer = null;
			this.aniTimer = null;
			this.ctx = null;
			this.nScaleRatio = Number(this.scaleRatio) || 2
			this.nWidth = Number(this.width) || 280
			this.nHeight = Number(this.height) || 280
		},
		mounted() {
			let sys = uni.getSystemInfoSync();
			let windowHeight = sys.windowHeight;
			this.windowWidth = sys.windowWidth
			// #ifdef H5
			if (this.isNav) {
				//使用了自带导航栏
				windowHeight += 44;
			}
			// #endif
			this.windowHeight = windowHeight;
			this.imgTop = windowHeight / 2;
			this.imgLeft = sys.windowWidth / 2;
			this.$nextTick(() => {
				// #ifndef APP-NVUE
				this.ctx = uni.createCanvasContext('fui_image_cropper', this);
				// #endif
				setTimeout(() => {
					this.changeval = `1_${this.getRandom()}`;
					this.initVal = true
					setTimeout(() => {
						this.src && this.handleImage(this.src)
					}, 50);
				}, 220);
			})
		},
		methods: {
			stop() {},
			getRandom() {
				return Math.ceil(Math.random() * 10e5).toString(36)
			},
			loading() {
				uni.showLoading({
					// #ifndef MP-ALIPAY
					mask: true,
					// #endif
					title: '请稍候...'
				});
			},
			reset() {
				this.scale = 1;
				this.angle = 0;
				let sys = uni.getSystemInfoSync();
				let windowHeight = sys.windowHeight;
				// #ifdef H5
				if (this.isNav) {
					windowHeight += 44;
				}
				// #endif
				this.imgTop = windowHeight / 2;
				this.imgLeft = sys.windowWidth / 2;
				this.changeval = `4_${this.getRandom()}`;
			},
			changeReset() {
				this.reset()
				this.$nextTick(() => {
					setTimeout(() => {
						this.changeval = `1_${this.getRandom()}`;
						setTimeout(() => {
							this.src && this.handleImage(this.src)
						}, 50);
					}, 50);
				})
			},
			calcSize(width, height) {
				let imgWidth = width,
					imgHeight = height;
				if (imgWidth > 0 && imgHeight > 0) {
					if (imgWidth / imgHeight > this.nWidth / this.nHeight) {
						imgHeight = this.nHeight;
						imgWidth = (width / height) * imgHeight;
					} else {
						imgWidth = this.nWidth;
						imgHeight = (height / width) * imgWidth;
					}
				} else {
					imgWidth = uni.getSystemInfoSync().windowWidth;
					imgHeight = 0;
				}
				this.imgWidth = imgWidth;
				this.imgHeight = imgHeight;
				this.changeval = `2_${this.getRandom()}`;
				uni.hideLoading()
			},
			// #ifdef APP-NVUE
			async compressImage(url, width, height, orientation) {
				let imgUrl = url;
				if (this.network) {
					imgUrl = await this.getLocalImage(url);
					if (!imgUrl) {
						this.toast('网络图片处理失败~');
						return;
					}
				}
				let defaultAngle = {
					up: 0,
					down: 180,
					left: 270,
					right: 90
				} [orientation] || 0;
				let f_dst = `_documents/${this.getRandom()}.jpg`;
				plus.zip.compressImage({
						src: imgUrl,
						dst: f_dst,
						overwrite: true,
						rotate: defaultAngle,
						format: 'jpg'
					},
					i => {
						this.picturePath = i.target;
						this.calcSize(width, height);
						this.changeval = `3_${this.getRandom()}`;
					},
					e => {
						this.picturePath = imgUrl;
						this.calcSize(width, height);
						this.changeval = `3_${this.getRandom()}`;
					}
				);
			},
			// #endif
			handleImage(src) {
				this.reset();
				this.loading();
				uni.getImageInfo({
					src: src,
					success: res => {
						let width = res.width;
						let height = res.height;
						this.naturalWidth = width;
						this.naturalHeight = height;
						let orientation = res.orientation;
						if (orientation && orientation != 'up') {
							//此处需要测试，可能导致裁剪出错
							// #ifdef APP-NVUE
							//宽高传值颠倒
							width = orientation == 'down' ? res.width : res.height;
							height = orientation == 'down' ? res.height : res.width;
							this.compressImage(src, width, height, orientation);
							// #endif
						} else {
							// #ifdef APP-NVUE
							this.calcSize(width, height);
							this.changeval = `3_${this.getRandom()}`;
							// #endif
						}

						// #ifndef APP-NVUE
						this.calcSize(width, height);
						this.changeval = `3_${this.getRandom()}`;
						// #endif
					},
					fail: err => {
						this.calcSize(0, 0);
						this.changeval = `3_${this.getRandom()}`;
					}
				});
			},
			change(e) {
				this.cutX = e.cutX || 0;
				this.cutY = e.cutY || 0;
				this.imgWidth = e.imgWidth || this.imgWidth;
				this.imgHeight = e.imgHeight || this.imgHeight;
				this.scale = e.scale || 1;
				this.angle = e.angle || 0;
				this.imgTop = e.imgTop || 0;
				this.imgLeft = e.imgLeft || 0;
			},
			async getLocalImage(src) {
				return await new Promise((resolve, reject) => {
					uni.downloadFile({
						url: src,
						success: res => {
							resolve(res.tempFilePath);
						},
						fail: res => {
							reject(false);
						}
					});
				});
			},
			moveStop() {
				clearTimeout(this.cutTimer);
				this.cutTimer = setTimeout(() => {
					this.changeval = `5_${this.getRandom()}`;
				}, 600);
			},
			moveDuring() {
				clearTimeout(this.cutTimer);
			},
			rotate() {
				if (!this.src) {
					this.toast('请选择要裁剪的图片！')
					return;
				}
				this.ani = true;
				let angle = this.angle + 90;
				if (angle % 90) {
					angle = Math.round(angle / 90) * 90;
				}
				this.angle = angle
				this.moveStop();
				this.changeval = `3_${this.getRandom()}`;
			},
			toast(text) {
				uni.showToast({
					title: text,
					icon: 'none'
				});
			},
			// #ifdef APP-NVUE
			getImageByNvue(callback) {
				let getCutImg = async () => {
					let imgUrl = this.picturePath || this.src;
					if (this.network) {
						imgUrl = await this.getLocalImage(this.src);
						if (!imgUrl) {
							this.toast('网络图片处理失败~');
							return;
						}
					}
					let f_dst = `_documents/${this.getRandom()}.${this.fileType}`;
					let multiple = Math.round(this.angle / 90);
					let angle = 0,
						x = 0,
						y = 0,
						left = 0,
						top = 0,
						clipHeight = 0,
						clipWidth = 0;
					let sys = uni.getSystemInfoSync();
					let isAndroid = sys.platform.toLocaleLowerCase() == 'android';

					if (multiple % 2 == 0) {
						angle = this.angle % 360 == 0 || this.angle == 0 ? 0 : 180;
						if (!isAndroid || (isAndroid && angle == 0)) {
							x = this.imgLeft - (this.imgWidth * this.scale) / 2;
							y = this.imgTop - (this.imgHeight * this.scale) / 2;
							left = (((this.cutX - x) / this.imgWidth / this.scale) * 100).toFixed(2);
							top = (((this.cutY - y) / this.imgHeight / this.scale) * 100).toFixed(2);
							clipWidth = ((this.canvasWidth / this.imgWidth / this.scale) * 100).toFixed(2);
							clipHeight = ((this.canvasHeight / this.imgHeight / this.scale) * 100).toFixed(2);
						} else {
							x = this.imgLeft - (this.imgWidth * this.scale) / 2;
							y = this.imgTop - (this.imgHeight * this.scale) / 2;
							left = (((this.imgWidth * this.scale - (this.cutX - x) - this.canvasWidth) / this
								.imgWidth / this.scale) * 100).toFixed(2);
							top = (((this.imgHeight * this.scale - (this.cutY - y) - this.canvasHeight) / this
								.imgHeight / this.scale) * 100).toFixed(2);
							clipWidth = ((this.canvasWidth / this.imgWidth / this.scale) * 100).toFixed(2);
							clipHeight = ((this.canvasHeight / this.imgHeight / this.scale) * 100).toFixed(2);
						}
					} else {
						angle = this.angle % 270 == 0 ? 270 : 90;
						if (isAndroid) {
							if (angle == 90) {
								x = this.imgLeft - (this.imgHeight * this.scale) / 2;
								y = this.imgTop - (this.imgWidth * this.scale) / 2;
								top = (((this.imgHeight * this.scale - (this.cutX - x) - this.canvasHeight) / this
									.imgHeight / this.scale) * 100).toFixed(2);
								left = (((this.imgWidth * this.scale - (this.cutY - y) - this.canvasWidth) / this
									.imgWidth / this.scale) * 100).toFixed(2);
								clipHeight = ((this.canvasWidth / this.imgHeight / this.scale) * 100).toFixed(2);
								clipWidth = ((this.canvasHeight / this.imgWidth / this.scale) * 100).toFixed(2);
							} else {
								x = this.imgLeft - (this.imgHeight * this.scale) / 2;
								y = this.imgTop - (this.imgWidth * this.scale) / 2;
								top = (((this.cutX - x) / this.imgHeight / this.scale) * 100).toFixed(2);
								left = (((this.cutY - y) / this.imgWidth / this.scale) * 100).toFixed(2);
								clipHeight = ((this.canvasWidth / this.imgHeight / this.scale) * 100).toFixed(2);
								clipWidth = ((this.canvasHeight / this.imgWidth / this.scale) * 100).toFixed(2);
							}
						} else {
							x = this.imgLeft - (this.imgHeight * this.scale) / 2;
							y = this.imgTop - (this.imgWidth * this.scale) / 2;
							left = (((this.cutX - x) / this.imgHeight / this.scale) * 100).toFixed(2);
							top = (((this.cutY - y) / this.imgWidth / this.scale) * 100).toFixed(2);
							clipWidth = ((this.canvasWidth / this.imgHeight / this.scale) * 100).toFixed(2);
							clipHeight = ((this.canvasHeight / this.imgWidth / this.scale) * 100).toFixed(2);
						}
					}
					let width = (this.imgWidth < this.naturalWidth ? this.naturalWidth : this.imgWidth) * this
						.scale;
					let height = (this.imgHeight < this.naturalHeight ? this.naturalHeight : this.imgHeight) * this
						.scale;
					width = `${width}px`;
					height = `${height}px`;
					left = Number(left) <= 0 ? 0 : left;
					top = Number(top) <= 0 ? 0 : top;
					plus.zip.compressImage({
							src: imgUrl,
							dst: f_dst,
							quality: this.quality * 100,
							overwrite: true,
							format: this.fileType,
							width: width,
							height: height,
							rotate: angle,
							clip: {
								top: `${top}%`,
								left: `${left}%`,
								width: `${clipWidth}%`,
								height: `${clipHeight}%`
							}
						},
						i => {
							uni.hideLoading();
							callback && callback(i.target)
						},
						e => {
							console.log(e);
							uni.hideLoading();
							this.toast('图片裁剪失败,请稍候再试~');
						}
					);
				};
				setTimeout(() => {
					getCutImg();
				}, 20);
			},
			// #endif
			//裁剪
			cutting(callback) {
				if (!this.src) {
					this.toast('请选择要裁剪的图片！')
					return;
				}
				this.loading();
				// #ifdef APP-NVUE
				this.getImageByNvue(callback)
				// #endif

				// #ifndef APP-NVUE
				let draw = async () => {
					let imgWidth = this.imgWidth * this.scale * this.nScaleRatio;
					let imgHeight = this.imgHeight * this.scale * this.nScaleRatio;
					let xpos = this.imgLeft - this.cutX;
					let ypos = this.imgTop - this.cutY;
					this.ctx.translate(xpos * this.nScaleRatio, ypos * this.nScaleRatio);
					this.ctx.rotate((this.angle * Math.PI) / 180);
					let src = this.src;
					// #ifdef APP-PLUS || MP
					if (this.network) {
						src = await this.getLocalImage(this.src);
					}
					// #endif
					this.ctx.drawImage(src, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
					this.ctx.draw(false, () => {
						let params = {
							width: this.nWidth * this.nScaleRatio,
							height: Math.round(this.nHeight * this.nScaleRatio),
							// #ifdef MP-QQ
							destWidth: this.nWidth * this.nScaleRatio * 2,
							destHeight: Math.round(this.nHeight) * this.nScaleRatio * 2,
							// #endif

							// #ifndef MP-QQ
							destWidth: this.nWidth * this.nScaleRatio,
							destHeight: Math.round(this.nHeight) * this.nScaleRatio,
							// #endif
							fileType: this.fileType,
							quality: this.quality
						};
						setTimeout(() => {
							// #ifdef MP-ALIPAY
							this.ctx.toTempFilePath({
								...params,
								success: res => {
									uni.hideLoading();
									this.ctx.rotate(((360 - this.angle % 360) * Math
										.PI) / 180);
									this.ctx.translate(-xpos * this.nScaleRatio, -
										ypos * this.nScaleRatio);
									this.ctx.clearRect(0, 0, this.nWidth * this
										.nScaleRatio, this.nHeight * this
										.nScaleRatio);
									this.ctx.draw();
									callback && callback(res.apFilePath)
								}
							});
							// #endif

							// #ifndef MP-ALIPAY
							uni.canvasToTempFilePath({
									...params,
									canvasId: 'fui_image_cropper',
									success: res => {
										uni.hideLoading();
										callback && callback(res.tempFilePath)
									},
									fail(err) {
										console.log(err);
									}
								},
								this
							);
							// #endif
						}, 80)
					});
				};
				draw();
				// #endif
			}
		}
	}
</script>

<style scoped>
	.fui-image__cropper {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 1;
	}

	.fui-cropper__img,
	.fui-cropper__real-el {
		/* #ifndef APP-NVUE */
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		/* #endif */
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		transform-origin: center;
	}

	/* #ifndef APP-NVUE */
	.fui-cropper__img-hidden {
		opacity: 0;
		visibility: hidden;
	}

	/* #endif */
	.fui-cropper__mask {
		position: fixed;
		z-index: 4;
		/* #ifndef APP-NVUE */
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border: 3000px solid rgba(0, 0, 0, 0.5);
		pointer-events: none;
		/* #endif */

		/* #ifdef APP-NVUE */
		border-style: solid;
		border-color: rgba(0, 0, 0, 0.5);
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		align-items: center;
		justify-content: center;
		/* #endif */
	}

	.fui-cropper__border {
		/* #ifndef APP-NVUE */
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		box-sizing: border-box;
		pointer-events: none;
		/* #endif */
		border-width: 1px;
		border-style: solid;
	}

	/* #ifndef APP-NVUE */
	.fui-cropper__canvas {
		position: fixed;
		left: -3000px;
		top: -3000px;
		pointer-events: none;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.fui-cropper__top {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.fui-cropper__left {
		position: absolute;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.fui-cropper__right {
		position: absolute;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.fui-cropper__bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	/* #endif */
</style>