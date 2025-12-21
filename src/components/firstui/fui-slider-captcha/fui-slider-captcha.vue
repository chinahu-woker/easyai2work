<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11 2 7，营业执照号： 9 1     440 60 5  M A5  5 6H1KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-slider__captcha-wrap" :class="{'fui-sc__wrap-show':isShow}"
		:style="{background:maskBgColor,zIndex:zIndex}" @tap="maskClose" @touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue" ref="fui_sc_ani">
		<!-- #ifndef APP-NVUE -->
		<!--如果隐藏导致不工作，则使用v-if控制-->
		<canvas class="fui-sc__canvas" :canvas-id="canvasId" :id="canvasId"
			:style="{ width: w + 'px', height:h + 'px'  }" v-if="canvasId"></canvas>
		<!-- #endif -->
		<view class="fui-slider__captcha" :style="{background:background}" @tap.stop="stop">
			<text class="fui-sc__title"
				:style="{ width: w + 'px',color: color, fontSize: size + 'rpx' }">{{ title }}</text>
			<text class="fui-sc__descr"
				:style="{width: w + 'px',color:descrColor, fontSize: descrSize + 'rpx'}">拖动下方滑块完成拼图</text>
			<view class="fui-sc__img-box" :style="{width: w + 'px'}">
				<image class="fui-sc__img" :src="src" :style="{width: w + 'px', height:h + 'px'}" v-if="src"></image>
				<view v-if="slotSrc" class="fui-sc__slot"
					:class="{'fui-sc__slot-circle':circle,'fui-sc__slot-bs':!isNvueAndroid}"
					:style="{left:x1+'px',top:y+'px'}">
				</view>
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="fui-sc__slot-box" ref="imgRef"
					:class="{'fui-sc__slot-circle':circle,'fui-sc__sb-hidden':!slotSrc,'fui-sc__sb-bs':!isNvueAndroid}"
					:style="{left:x+'px',top:y+'px'}">
					<image :src="slotSrc" class="fui-sc__slot-img"
						:class="{'fui-sc__slot-circle':circle && isNvue,'fui-sc__img-border':isNvueAndroid}"></image>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="fui-sc__slot-box"
					:class="{'fui-sc__sb-bs':true,'fui-sc__slot-circle':circle,'fui-sc__reset-ani':resetAni}"
					:style="{left:x+'px',top:y+'px',transform:transformSlot}" v-if="slotSrc">
					<image :src="slotSrc" class="fui-sc__slot-img"></image>
				</view>
				<!-- #endif -->
			</view>
			<view class="fui-sc__sliderbar" :style="{width: w + 'px',height:sliderH+'px'}">
				<view class="fui-sc__bar" :style="{width: w + 'px',height:(sliderH/2)+'px',borderRadius:sliderH+'px'}">
				</view>
				<!-- #ifdef APP-VUE || MP-WEIXIN  || H5-->
				<view class="fui-sc__slider" :class="{'fui-sc__slider-bg':!getSliderBgColor}"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:getSliderBgColor}"
					:change:prop="parse.slidereset" :prop="resetNum" :data-type="type" :data-width="w" :data-start="x"
					:data-end="x1" :data-swidth="sliderH * 2" :data-app="isApp"
					:data-disabled="!slotSrc || isPass || disabled || !isShow?1:0" :data-range="range"
					@touchstart="parse.touchstart" @touchmove="parse.touchmove" @touchend="parse.touchend"
					@mousedown="parse.mousedown">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view ref="sliderRef" class="fui-sc__slider" :class="{'fui-sc__slider-bg':!getSliderBgColor}"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:getSliderBgColor}"
					@touchstart="touchstart" @horizontalpan="touchmove" @touchend="touchend">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
				<view class="fui-sc__slider"
					:class="{'fui-sc__slider-bg':!getSliderBgColor,'fui-sc__reset-ani':resetAni}"
					:style="{width:(sliderH * 2)+'px',height:sliderH+'px',borderRadius:sliderH+'px',background:getSliderBgColor,transform:transform}"
					@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
					<fui-icon name="slide" :size="56" :color="slideColor"></fui-icon>
				</view>
				<!-- #endif -->

			</view>
			<view class="fui-sc__close " @tap.stop="closeVerify">
				<fui-icon name="close" :color="closeColor"></fui-icon>
			</view>
		</view>
	</view>
</template>
<!-- #ifdef APP-VUE  || MP-WEIXIN  || H5-->
<script src="./index.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
	import weex from './weex.js'
	import mpjs from './mpjs.js'
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	// #ifdef MP-WEIXIN
	const canvasId = `fui_sc_${Math.ceil(Math.random() * 10e5).toString(36)}`
	// #endif
	export default {
		name: "fui-slider-captcha",
		mixins: [mpjs, weex],
		emits: ['success', 'fail', 'verify', 'init', 'close'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			type: {
				type: [Number, String],
				default: 1
			},
			range: {
				type: [Number, String],
				default: 3
			},
			location: {
				type: Object,
				default () {
					return {}
				}
			},
			src: {
				type: String,
				default: ''
			},
			imageType: {
				type: [Number, String],
				default: 1
			},
			width: {
				type: [Number, String],
				default: 640
			},
			height: {
				type: [Number, String],
				default: 320
			},
			background: {
				type: String,
				default: '#FFFFFF'
			},
			title: {
				type: String,
				default: '安全验证'
			},
			color: {
				type: String,
				default: '#B2B2B2'
			},
			size: {
				type: [Number, String],
				default: 28
			},
			descrColor: {
				type: String,
				default: '#333333'
			},
			descrSize: {
				type: [Number, String],
				default: 36
			},
			closeColor: {
				type: String,
				default: '#B2B2B2'
			},
			sliderBgColor: {
				type: String,
				default: ''
			},
			slideColor: {
				type: String,
				default: '#FFFFFF'
			},
			zIndex: {
				type: [Number, String],
				default: 996
			},
			maskBgColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			src(newValue, oldValue) {
				if (this.type == 1) {
					newValue && this.handleImage()
				} else {
					if (this.location.x !== undefined && newValue) {
						this.handleImage()
					}
				}
			},
			location(obj) {
				if (this.type == 2 && obj) {
					this.x = obj.x || 10
					this.y = obj.y || 10
					this.x1 = obj.x1 || 160
					if ((this.x + this.y + this.x1) % 2 === 0) {
						this.circle = true
					} else {
						this.circle = false
					}
					this.src && this.handleImage()
				}
			},
			isShow(val) {
				if (!val) {
					this.$emit('close', {})
				}
			}
		},
		computed: {
			getSliderBgColor() {
				let color = this.sliderBgColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		data() {
			let sys = uni.getSystemInfoSync()
			// #ifndef MP-WEIXIN
			const canvasId = `fui_sc_${Math.ceil(Math.random() * 10e5).toString(36)}`
			// #endif
			let isNvue = false
			let pixelRatio = 2
			let isNvueAndroid = false
			let isApp = 0
			pixelRatio = sys.pixelRatio == 1 ? 2 : sys.pixelRatio
			// #ifdef APP-NVUE
			isNvue = true
			isNvueAndroid = sys.platform === 'android'
			// #endif
			// #ifdef APP
			isApp = 1
			// #endif
			return {
				isApp,
				pixelRatio,
				isNvueAndroid,
				canvasId,
				isNvue,
				isShow: false,
				w: 320,
				h: 160,
				sliderH: 0,
				imgSrc: '',
				slotSrc: '',
				x: 0,
				y: 0,
				x1: 0,
				circle: false,
				resetNum: 0,
				isPass: false,
				disabled: false,
				times: 0
			};
		},
		created() {
			this.w = this.getPx(this.width)
			this.h = this.getPx(this.height)
			this.sliderH = this.getPx(64)
			//后端验证时使用
			this.$emit('init', {
				width: this.w,
				height: this.h,
				//切割图片的宽高，固定为44px
				cutGraphWidth: 44
			})
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.type == 1) {
						this.src && this.handleImage()
					} else {
						if (this.location.x !== undefined && this.src) {
							this.handleImage()
						}
					}
				}, 50);
			})
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			//网络图片转成本地文件（必须确保图片可以下载）
			getImage(url, callback) {
				uni.downloadFile({
					url: url,
					success: res => {
						callback && callback(res.tempFilePath)
					},
					fail: res => {
						callback && callback(false)
					}
				})
			},
			// #ifdef APP-PLUS || MP-WEIXIN || H5
			//当服务器端返回图片base64时,转成本地文件
			//微信小程序不支持直接绘制base64，其他平台可根据支持情况进行处理
			getImagebyBase64(base64, callback) {
				//使用前先查看支持平台
				const uniqueId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`

				// #ifdef MP-WEIXIN
				const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
				let arrayBuffer = wx.base64ToArrayBuffer(bodyData)
				//uniqueId：注意这里名称需要动态生成（名称相同部分机型会出现写入失败，显示的是上次生成的图片）
				const filePath = `${wx.env.USER_DATA_PATH}/${uniqueId}.${format}`;
				//此处可能会出现存储空间不足的情况，可清理缓存解决
				//fail the maximum size of the file storage limit is exceeded
				wx.getFileSystemManager().writeFile({
					filePath,
					data: arrayBuffer,
					encoding: 'binary',
					success() {
						callback && callback(filePath)
					},
					fail() {
						callback && callback(false)
					}
				})
				// #endif
				// #ifdef APP-PLUS
				let bitmap = new plus.nativeObj.Bitmap(uniqueId);
				bitmap.loadBase64Data(base64, function() {
					//console.log("加载Base64图片数据成功");
					bitmap.save(`_doc/${uniqueId}.png`, {}, function(e) {
						//console.log('保存图片成功：' + JSON.stringify(i));
						// let width = e.width; // 保存后图片的实际宽度，单位为px
						// let height = e.height; // 保存后图片的实际高度，单位为px
						let target = e.target; // 保存后的图片url路径，以"file://"开头
						callback && callback(target)

					}, function(e) {
						console.log('保存图片失败：' + JSON.stringify(e));
						callback && callback(false)
					});
				}, function() {
					console.log('加载Base64图片数据失败：' + JSON.stringify(e));
					callback && callback(false)
				});
				// #endif

				// #ifdef H5
				callback && callback(base64)
				// #endif

			},
			toast(text) {
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			// #endif
			getRandom(min, max) {
				let range = Array.from(new Array(max + 1).keys()).slice(min);
				let index = Math.floor((Math.random() * range.length));
				return range[index]
			},
			getXY() {
				this.x = this.getRandom(20, this.w / 2 - 44)
				this.y = this.getRandom(20, this.h - 60)
				this.x1 = this.getRandom(this.w / 2 + 44, this.w - 60)
				if ((this.x + this.y + this.x1) % 2 === 0) {
					this.circle = true
				} else {
					this.circle = false
				}
			},
			// #ifdef APP-NVUE
			getClipImg(imgUrl) {
				let f_dst = `_documents/${Math.ceil(Math.random() * 10e5).toString(36)}.jpg`;
				plus.zip.compressImage({
						src: imgUrl,
						dst: f_dst,
						quality: 100,
						overwrite: true,
						format: 'jpg',
						width: this.w * this.pixelRatio + 'px',
						height: this.h * this.pixelRatio + 'px',
						clip: {
							top: `${this.y * this.pixelRatio}px`,
							left: `${this.x1 * this.pixelRatio}px`,
							width: `${44*this.pixelRatio}px`,
							height: `${44*this.pixelRatio}px`
						}
					},
					i => {
						this.slotSrc = i.target;
					},
					e => {
						this.toast('图片资源处理失败~');
					}
				);
			},
			// #endif
			darwImage(src) {
				// #ifdef APP-NVUE
				this.getClipImg(src)
				// #endif

				// #ifndef APP-NVUE
				let context = uni.createCanvasContext(this.canvasId, this)
				context.drawImage(src, 0, 0, this.w, this.h)
				context.draw(false, (() => {
					setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: this.canvasId,
							// #ifdef MP-QQ
							x: this.x1 / this.pixelRatio,
							y: this.y / this.pixelRatio,
							width: 44 / this.pixelRatio,
							height: 44 / this.pixelRatio,
							destWidth: 44 * this.pixelRatio * 2,
							destHeight: 44 * this.pixelRatio * 2,
							// #endif
							// #ifndef MP-QQ
							x: this.x1,
							y: this.y,
							width: 44,
							height: 44,
							// #endif
							success: (res) => {
								this.slotSrc = res.tempFilePath
							},
							fail: (err) => {
								this.toast('图片资源处理失败~')
							}
						}, this);
					}, 200)
				}))
				// #endif
			},
			handleImage() {
				this.slotSrc = ''
				this.times = 0;
				if (this.type == 1) {
					this.getXY()
				}
				this.reset()
				if (this.imageType == 1) {
					this.getImage(this.src, (res) => {
						if (!res) {
							this.toast('图片资源处理失败~')
						} else {
							this.imgSrc = res
							this.darwImage(res)
						}
					})
				} else if (this.imageType == 2) {
					// #ifdef APP-PLUS || MP-WEIXIN || H5
					this.getImagebyBase64(this.src, (res) => {
						if (!res) {
							this.toast('图片资源处理失败~')
						} else {
							this.imgSrc = res
							this.darwImage(res)
						}
					})
					// #endif

					// #ifndef APP-PLUS || MP-WEIXIN || H5
					this.toast('暂不支持base64图片！')
					// #endif

				} else {
					// #ifdef APP-NVUE
					this.imgSrc = plus.io.convertLocalFileSystemURL(this.src)
					// #endif
					// #ifndef APP-NVUE
					this.imgSrc = this.src;
					// #endif
					this.darwImage(this.imgSrc)
				}
			},
			reset() {
				this.resetNum += 1
				this.isPass = false;
				this.disabled = false;
			},
			verify(e) {
				//验证中禁止操作
				this.disabled = true
				this.$emit('verify', {
					x: this.x,
					x1: this.x1,
					slipDistance: e.slip
				})
			},
			success() {
				this.isPass = true;
				if (this.type == 1) {
					this.$emit('success', {})
				}
			},
			fail() {
				if (this.type == 1) {
					this.times += 1;
					this.$emit('fail', {
						times: this.times
					})
				}
				this.reset()
			},
			maskClose() {
				if (!this.maskClosable) return;
				this.closeVerify()
			},
			closeVerify() {
				this.reset();
				// #ifndef APP-NVUE
				this.isShow = false;
				// #endif

				// #ifdef APP-NVUE
				this.closeAni()
				// #endif
			},
			show(refresh) {
				if (refresh) {
					if (this.type == 1) {
						this.src && this.handleImage()
					} else {
						if (this.location.x !== undefined && this.src) {
							this.handleImage()
						}
					}
				}
				// #ifndef APP-NVUE
				this.isShow = true;
				// #endif

				// #ifdef APP-NVUE
				this.openAni()
				// #endif
			},
			stop() {}
		}
	}
</script>

<style scoped>
	.fui-slider__captcha-wrap {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transition-property: all;
		transition-timing-function: ease-in;
		transition-duration: 0.2s;
		display: flex;
		transform: scale3d(1, 1, 0);
		visibility: hidden;
		/* #endif */
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	/* #ifndef APP-NVUE */
	.fui-sc__wrap-show {
		opacity: 1;
		transform: scale3d(1, 1, 1);
		visibility: visible;
	}

	/* #endif */
	.fui-slider__captcha {
		padding: 60rpx 32rpx;
		text-align: center;
		border-radius: 24rpx;
		overflow: hidden;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	/* #ifndef APP-NVUE */
	.fui-sc__canvas {
		position: fixed;
		z-index: 10;
		pointer-events: none;
		left: -6666px;
		top: -6666px;
	}

	/* #endif */

	.fui-sc__title {
		text-align: left;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		font-weight: normal;
	}

	.fui-sc__descr {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		text-align: left;
		padding-bottom: 36rpx;
		font-weight: 600;
		padding-top: 12rpx;
	}

	.fui-sc__img-box {
		position: relative;
		background: #F1F4FA;
	}

	/* #ifndef APP-NVUE */
	.fui-sc__img {
		display: block;
	}

	/* #endif */
	.fui-sc__slot {
		position: absolute;
		width: 44px;
		height: 44px;
		background: rgba(0, 0, 0, .5);
		z-index: 3;
	}

	.fui-sc__slot-bs {
		box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
	}

	.fui-sc__sb-bs {
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.8);
	}

	.fui-sc__slot-box {
		position: absolute;
		width: 44px;
		height: 44px;
		opacity: 1;
		z-index: 5;
	}

	.fui-sc__sb-hidden {
		opacity: 0;
	}

	.fui-sc__slot-img {
		width: 44px;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-sc__img-border {
		border: 0.5px solid rgba(255, 255, 255, .2)
	}

	/* #endif */

	.fui-sc__slot-circle {
		border-radius: 22px;
		overflow: hidden;
	}

	.fui-sc__close {
		position: absolute;
		padding: 16rpx 16rpx 0 0;
		right: 12rpx;
		top: 12rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-sc__sliderbar {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 48rpx;
	}

	.fui-sc__bar {
		background: #EEEEEE;
	}

	.fui-sc__slider {
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-sc__slider-bg {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.fui-sc__reset-ani {
		transition: transform 0.2s;
	}

	/* #endif */

	/* fix：vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

	/* #ifdef VUE3 */
	.fui-sc__un-ani {
		transition: transform 0s;
	}

	/* #endif */
</style>