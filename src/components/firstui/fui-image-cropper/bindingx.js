// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：9   144  06   0 5M    A 556 H 1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
export default {
	watch: {
		width(val) {
			this.canvasWidth = Number(val);
		},
		height(val) {
			this.canvasHeight = Number(val);
		},
		changeval(val) {
			this.$nextTick(() => {
				setTimeout(() => {
					this.valsChange(val)
				}, 50)
			})
		},
		src(val) {
			this.$nextTick(() => {
				if (val) {
					setTimeout(() => {
						this.ref = this.getEl(this.$refs['fui_cropper_img'])
						this.realRef = this.getEl(this.$refs['fui_cropper_real'])
					}, 50)
				}
			})
		}
	},
	data() {
		return {
			touchRelative: [{
				x: 0,
				y: 0
			}],
			hypotenuseLength: 0,
			flagEndTouch: false,
			canvasWidth: 0,
			canvasHeight: 0
		}
	},
	created() {
		this.ref = null;
		this.realRef = null;
		this.canvasWidth = Number(this.width);
		this.canvasHeight = Number(this.height);
	},
	methods: {
		cutDetectionPosition() {
			var windowHeight = this.windowHeight,
				windowWidth = this.windowWidth;

			var cutDetectionPositionTop = () => {
				if (this.cutY < 0) {
					this.cutY = 0;
				}
				if (this.cutY > windowHeight - this.canvasHeight) {
					this.cutY = windowHeight - this.canvasHeight;
				}
			}

			var cutDetectionPositionLeft = () => {
				if (this.cutX < 0) {
					this.cutX = 0;
				}
				if (this.cutX > windowWidth - this.canvasWidth) {
					this.cutX = windowWidth - this.canvasWidth;
				}
			}
			if (this.cutY == null && this.cutX == null) {
				var cutY = (windowHeight - this.canvasHeight) * 0.5;
				var cutX = (windowWidth - this.canvasWidth) * 0.5;
				this.cutY = cutY;
				this.cutX = cutX;
			} else if (this.cutY != null && this.cutX != null) {
				cutDetectionPositionTop();
				cutDetectionPositionLeft();
			} else if (this.cutY != null && this.cutX == null) {
				cutDetectionPositionTop();
				this.cutX = (windowWidth - this.canvasWidth) / 2;
			} else if (this.cutY == null && this.cutX != null) {
				cutDetectionPositionLeft();
				this.cutY = (windowHeight - this.canvasHeight) / 2;
			}
		},
		imgMarginDetectionPosition(scale, delay) {
			var left = this.imgLeft;
			var top = this.imgTop;
			scale = 1 // scale || this.scale;
			var imgWidth = this.imgWidth;
			var imgHeight = this.imgHeight;
			if ((this.angle / 90) % 2) {
				imgWidth = this.imgHeight;
				imgHeight = this.imgWidth;
			}
			left = this.cutX + (imgWidth * scale) / 2 >= left ? left : this.cutX + (imgWidth * scale) / 2;
			left = this.cutX + this.canvasWidth - (imgWidth * scale) / 2 <= left ? left : this.cutX + this.canvasWidth -
				(imgWidth * scale) / 2;
			top = this.cutY + (imgHeight * scale) / 2 >= top ? top : this.cutY + (imgHeight * scale) / 2;
			top = this.cutY + this.canvasHeight - (imgHeight * scale) / 2 <= top ? top : this.cutY + this.canvasHeight -
				(imgHeight * scale) / 2;

			this.imgLeft = left;
			this.imgTop = top;
			this.scale = scale;
			if (!delay || delay === 'undefined') {
				this._animation()
			}
		},
		imgMarginDetectionScale(scale, delay) {
			scale = 1 //scale || this.scale;
			var imgWidth = this.imgWidth;
			var imgHeight = this.imgHeight;
			if ((this.angle / 90) % 2) {
				imgWidth = this.imgHeight;
				imgHeight = this.imgWidth;
			}
			if (imgWidth * scale < this.canvasWidth) {
				scale = this.canvasWidth / imgWidth;
			}
			if (imgHeight * scale < this.canvasHeight) {
				scale = Math.max(scale, this.canvasHeight / imgHeight);
			}
			this.imgMarginDetectionPosition(scale, delay);
		},
		computeCutSize() {
			if (this.canvasWidth > this.windowWidth) {
				this.canvasWidth = this.windowWidth;
			} else if (this.canvasWidth + this.cutX > this.windowWidth) {
				this.cutX = this.windowWidth - this.cutX;
			}
			if (this.canvasHeight > this.windowHeight) {
				this.canvasHeight = this.windowHeight;
			} else if (this.canvasHeight + this.cutY > this.windowHeight) {
				this.cutY = this.windowHeight - this.cutY;
			}
		},
		setCutCenter() {
			var cutY = (this.windowHeight - this.canvasHeight) * 0.5;
			var cutX = (this.windowWidth - this.canvasWidth) * 0.5;
			this.imgTop = this.imgTop - this.cutY + cutY;
			this.cutY = cutY;
			this.imgLeft = this.imgLeft - this.cutX + cutX;
			this.cutX = cutX;
			this.cutDetectionPosition()
			this._animation()
		},
		imageReset() {
			this.scale = 1;
			this.angle = 0;
			this._animation()
		},
		getEl(el) {
			return el.ref || el[0].ref;
		},
		_animation() {
			if (!this.ref || !this.realRef) return
			var x = this.imgLeft - this.imgWidth / 2;
			var y = this.imgTop - this.imgHeight / 2;
			animation.transition(this.realRef, {
				styles: {
					//暂时去除缩放功能，此功能后期做优化再放出使用
					// transform: `translate(${x}px,${y}px) scale(${this.scale}) rotate(${this.angle}deg)`
					transform: `translate(${x}px,${y}px) rotate(${this.angle}deg)`
				},
				duration: this.ani ? 250 : 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
			animation.transition(this.ref, {
				styles: {
					transform: `translate(${x}px,${y}px) rotate(${this.angle}deg)`
				},
				duration: this.ani ? 250 : 0,
				timingFunction: 'linear',
				needLayout: false,
				delay: 0
			});
		},
		touchstart(e) {
			var touch = e.touches || e.changedTouches
			this.flagEndTouch = false;
			//暂时放弃双指操作，待后期优化
			if (touch.length == 1 && true) {
				this.touchRelative[0] = {
					x: touch[0].screenX - this.imgLeft,
					y: touch[0].screenY - this.imgTop
				};
			} else {
				var width = Math.abs(touch[0].screenX - touch[1].screenX);
				var height = Math.abs(touch[0].screenY - touch[1].screenY);
				this.touchRelative = [{
						x: touch[0].screenX - this.imgLeft,
						y: touch[0].screenY - this.imgTop
					},
					{
						x: touch[1].screenX - this.imgLeft,
						y: touch[1].screenY - this.imgTop
					}
				];
				this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
			}
		},
		touchmove(e) {
			var touch = e.touches || e.changedTouches
			if (this.flagEndTouch || touch.length > 1 || !this.src) return;
			this.moveDuring();
			//暂时放弃双指操作，待后期优化
			if (touch.length == 1 && true) {
				var left = touch[0].screenX - this.touchRelative[0].x,
					top = touch[0].screenY - this.touchRelative[0].y;
				this.imgLeft = left;
				this.imgTop = top;
				this._animation()
				this.imgMarginDetectionPosition();
			} else {
				var width = Math.abs(touch[0].screenX - touch[1].screenX),
					height = Math.abs(touch[0].screenY - touch[1].screenY),
					hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
					scale = this.scale * (hypotenuse / this.hypotenuseLength),
					current_deg = 0;
				scale = scale <= 0.5 ? 0.5 : scale;
				scale = scale >= 2 ? 2 : scale;
				this.imgMarginDetectionScale(scale, true);
				var touchRelative = [{
						x: touch[0].screenX - this.imgLeft,
						y: touch[0].screenY - this.imgTop
					},
					{
						x: touch[1].screenX - this.imgLeft,
						y: touch[1].screenY - this.imgTop
					}
				];
				this.touchRelative = touchRelative;
				this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
				this.angle = this.angle + current_deg;
				this._animation()
			}
		},
		touchend(e) {
			this.flagEndTouch = true;
			this.moveStop();
		},
		valsChange(val) {
			if (val) {
				var params = val.split('_')
				var type = Number(params[0])
				if (type == 3) {
					this._animation()
				}
				switch (type) {
					case 1:
						this.setCutCenter();
						this.computeCutSize();
						this.cutDetectionPosition();
						break;
					case 2:
						this.setCutCenter();
						break;
					case 3:
						this.imgMarginDetectionScale()
						break;
					case 4:
						this.imageReset();
						break;
					case 5:
						this.setCutCenter();
						break;
					default:
						break;
				}
			}
		}
	}
}

// #endif

// #ifndef APP-NVUE
export default {}
// #endif