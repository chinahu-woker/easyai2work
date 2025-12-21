// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号：  9 1    44 0 605M A55  6H1    K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
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
		this.canvasWidth = Number(this.width);
		this.canvasHeight = Number(this.height);
	},
	watch: {
		width(val) {
			this.canvasWidth = Number(val);
		},
		height(val) {
			this.canvasHeight = Number(val);
		},
		changeval(val) {
			this.valsChange(val)
		}
	},
	computed: {
		getTransform: function() {
			return `translate3d(${this.imgLeft - this.imgWidth / 2}px,${this.imgTop - this.imgHeight / 2}px,0) scale(${this.scale}) rotate(${this.angle}deg)`;
		}
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
		imgMarginDetectionPosition(scale) {
			var left = this.imgLeft;
			var top = this.imgTop;
			scale = scale || this.scale;
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
		},
		imgMarginDetectionScale(scale) {
			scale = scale || this.scale;
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
			this.imgMarginDetectionPosition(scale);
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
		},
		imageReset() {
			this.scale = 1;
			this.angle = 0;
		},
		touchstart(e) {
			var touch = e.touches || e.changedTouches
			this.flagEndTouch = false;
			if (touch.length == 1) {
				this.touchRelative[0] = {
					x: touch[0].clientX - this.imgLeft,
					y: touch[0].clientY - this.imgTop
				};
			} else {
				var width = Math.abs(touch[0].clientX - touch[1].clientX);
				var height = Math.abs(touch[0].clientY - touch[1].clientY);
				this.touchRelative = [{
						x: touch[0].clientX - this.imgLeft,
						y: touch[0].clientY - this.imgTop
					},
					{
						x: touch[1].clientX - this.imgLeft,
						y: touch[1].clientY - this.imgTop
					}
				];
				this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
			}
		},
		touchmove(e) {
			var touch = e.touches || e.changedTouches
			if (this.flagEndTouch) return;
			this.moveDuring();
			if (touch.length == 1) {
				var left = touch[0].clientX - this.touchRelative[0].x,
					top = touch[0].clientY - this.touchRelative[0].y;
				this.imgLeft = left;
				this.imgTop = top;
				this.imgMarginDetectionPosition();
			} else {
				var width = Math.abs(touch[0].clientX - touch[1].clientX),
					height = Math.abs(touch[0].clientY - touch[1].clientY),
					hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
					scale = this.scale * (hypotenuse / this.hypotenuseLength),
					current_deg = 0;
				scale = scale <= 0.5 ? 0.5 : scale;
				scale = scale >= 2 ? 2 : scale;
				this.imgMarginDetectionScale(scale);
				var touchRelative = [{
						x: touch[0].clientX - this.imgLeft,
						y: touch[0].clientY - this.imgTop
					},
					{
						x: touch[1].clientX - this.imgLeft,
						y: touch[1].clientY - this.imgTop
					}
				];
				this.touchRelative = touchRelative;
				this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
				this.angle = this.angle + current_deg;
				this.scale = this.scale;
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

// #ifdef APP-PLUS|| MP-WEIXIN || H5
export default {}
// #endif