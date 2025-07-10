// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 9 1 4  4060 5M  A5 56  H 1 KX    H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
/*!
 * 生成海报
 * poster - v1.8.0 (2023/02/02, 16:52:14 PM)
 * updated V2.2.0+ 2023/11/07
 *
 *
 * 官网地址：https://firstui.cn/
 * 文档地址：https://doc.firstui.cn/
 */
import fuiQr from './fui-qr/index.js'
const poster = {
	_pixelRatio: 2,
	_ctx: null,
	_canvasId: null,
	_this: null,
	create(pixelRatio, canvasId, _this) {
		poster._pixelRatio = pixelRatio;
		poster._canvasId = canvasId;
		poster._this = _this;
		poster._ctx = uni.createCanvasContext(canvasId, _this)
	},
	_toPx(rpx) {
		return uni.upx2px(rpx * poster._pixelRatio)
	},
	_getTextWidth(context, text, fontSize) {
		let width = 0;
		// #ifndef MP-ALIPAY || MP-BAIDU
		width = context.measureText(text).width
		// #endif

		//支付宝小程序ios真机测试measureText获取长度有bug
		//百度小程序有frontText时误差较大，影响绘制效果
		// #ifdef MP-ALIPAY || MP-BAIDU
		let sum = 0;
		for (let i = 0, len = text.length; i < len; i++) {
			if (text.charCodeAt(i) >= 0 && text.charCodeAt(i) <= 255)
				sum = sum + 1;
			else
				sum = sum + 2;
		}
		width = sum / 2 * poster._toPx(fontSize)
		// #endif

		return width;
	},
	//canvas文字换行，rows=-1则不限制行数
	_wrapText(text, fontSize, textWidth, width, context, rows = 2) {
		let textArr = [];
		if (textWidth > width) {
			let fillText = '';
			let lines = 1;
			let arr = text.split('')
			for (let i = 0, len = arr.length; i < len; i++) {
				fillText = fillText + arr[i];
				if (poster._getTextWidth(context, fillText, fontSize) >= width) {
					if (lines === rows && rows !== -1) {
						if (i !== arr.length - 1) {
							fillText = fillText.substring(0, fillText.length - 1) + '...';
						}
						textArr.push(fillText);
						break;
					}
					textArr.push(fillText);
					fillText = '';
					lines++;
				} else if (i === arr.length - 1) {
					textArr.push(fillText);
				}
			}
		} else {
			textArr.push(text)
		}
		return textArr;
	},
	_drawText(context, params) {
		let {
			x,
			y,
			fontSize,
			color,
			baseLine = 'normal',
			textAlign = 'left',
			frontText,
			frontSize,
			spacing, //单位rpx
			text,
			opacity = 1,
			lineThrough = false,
			width = 500, //单位rpx
			rows = 1,
			lineHeight = 0,
			fontWeight = 'normal',
			fontStyle = 'normal',
			fontFamily = "sans-serif"
		} = params;
		context.save();
		context.beginPath();
		context.font = fontStyle + " " + fontWeight + " " + poster._toPx(fontSize) + "px " + fontFamily
		context.setGlobalAlpha(opacity);
		// #ifdef MP-TOUTIAO
		context.setFontSize(poster._toPx(fontSize));
		// #endif
		context.setFillStyle(color);
		context.setTextBaseline(baseLine);
		context.setTextAlign(textAlign);
		let textWidth = poster._getTextWidth(context, text, fontSize);
		width = poster._toPx(width);
		let textArr = poster._wrapText(text, fontSize, textWidth, width, context, rows)
		//如果文本前面有其他文本内容
		if (frontText) {
			context.setFontSize(poster._toPx(frontSize));
			x = poster._getTextWidth(context, frontText, frontSize) + poster._toPx(x + spacing);
			context.setFontSize(poster._toPx(fontSize));
		} else {
			x = poster._toPx(x)
		}
		textArr.forEach((item, index) => {
			context.fillText(item, x, poster._toPx(y + (lineHeight || fontSize) * index))
		})
		context.restore();
		if (lineThrough) {
			let lineY = y;
			// 根据baseLine的不同对贯穿线的Y坐标做相应调整
			switch (baseLine) {
				case 'top':
					lineY += fontSize / 2 + 4;
					break;
				case 'middle':
					break;
				case 'bottom':
					lineY -= fontSize / 2 + 4;
					break;
				default:
					// #ifdef MP-WEIXIN
					lineY -= fontSize / 2 - 3;
					// #endif
					// #ifndef MP-WEIXIN
					lineY -= fontSize / 2 - 4;
					// #endif
					break;
			}
			context.save();
			context.moveTo(x, poster._toPx(lineY));
			context.lineTo(x + textWidth + 2, poster._toPx(lineY));
			context.setStrokeStyle(color);
			context.stroke();
			context.restore();
		}
	},
	_drawRadiusRect(context, params) {
		let {
			x,
			y,
			width,
			height,
			borderRadius
		} = params;
		let r = poster._toPx(borderRadius / 2);

		x = poster._toPx(x)
		y = poster._toPx(y)
		width = poster._toPx(width)
		height = poster._toPx(height)

		context.beginPath();
		context.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
		context.moveTo(x + r, y);
		context.lineTo(x + width - r, y);
		context.lineTo(x + width, y + r);

		context.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
		context.lineTo(x + width, y + height - r);
		context.lineTo(x + width - r, y + height);

		context.arc(x + width - r, y + height - r, r, 0, Math.PI * 0.5);
		context.lineTo(x + r, y + height);
		context.lineTo(x, y + height - r);

		context.arc(x + r, y + height - r, r, Math.PI * 0.5, Math.PI);
		context.lineTo(x, y + r);
		context.lineTo(x + r, y);
	},
	async _getImageInfo(src) {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src: src,
				success: res => {
					resolve({
						width: res.width,
						height: res.height
					})
				},
				fail: err => {
					reject(false)
				}
			});
		})
	},
	async _drawImage(context, params) {
		let {
			imgResource,
			x,
			y,
			width,
			height,
			sx,
			sy,
			sw,
			sh,
			borderRadius = 0,
			borderWidth = 0,
			borderColor,
			imgWidth = 0,
			imgHeight = 0,
			crop = false
		} = params;
		context.save();
		if (borderRadius > 0) {
			this._drawRadiusRect(context, params);
			context.strokeStyle = 'rgba(255,255,255,0)'
			//处理百度/头条小程序黑边问题
			// #ifndef MP-BAIDU || MP-TOUTIAO
			context.stroke();
			// #endif
			context.clip();
		}

		const bg_w = poster._toPx(width)
		const bg_h = poster._toPx(height)
		x = poster._toPx(x)
		y = poster._toPx(y)
		// 等比例裁剪图片，保证图片绘制不变形
		if (imgWidth && imgHeight && crop) {
			let dWidth = bg_w / imgWidth;
			let dHeight = bg_h / imgHeight;

			if (imgWidth > bg_w && imgHeight > bg_h || imgWidth < bg_w && imgHeight < bg_h) {
				if (dWidth > dHeight) {
					context.drawImage(imgResource, 0, (imgHeight - bg_h / dWidth) / 2, imgWidth,
						bg_h /
						dWidth, x, y, bg_w, bg_h)
				} else {
					context.drawImage(imgResource, (imgWidth - bg_w / dHeight) / 2, 0, bg_w /
						dHeight,
						imgHeight, x, y, bg_w, bg_h)
				}
			} else {
				if (imgWidth < bg_w) {
					context.drawImage(imgResource, 0, (imgHeight - bg_h / dWidth) / 2, imgWidth,
						bg_h /
						dWidth, x, y, bg_w, bg_h)
				} else {
					context.drawImage(imgResource, (imgWidth - bg_w / dHeight) / 2, 0, bg_w /
						dHeight,
						imgHeight, x, y, bg_w, bg_h)
				}
			}

		} else {
			context.drawImage(imgResource, x, y, bg_w, bg_h)
		}
		if (borderWidth && borderWidth > 0) {
			context.setStrokeStyle(borderColor);
			context.setLineWidth(poster._toPx(borderWidth));
			context.stroke();
		}
		context.restore();
	},
	_drawBlock(context, params) {
		let {
			width,
			height,
			x,
			y,
			borderWidth,
			backgroundColor,
			gradientColor,
			gradientType = 1,
			borderColor,
			borderRadius = 0,
			opacity = 1,
			shadow
		} = params;
		if (backgroundColor) {
			context.save();
			context.setGlobalAlpha(opacity);
			if (gradientColor) {
				// #ifndef MP-KUAISHOU
				let grd = null;
				if (gradientType == 1) {
					//从上到下
					grd = context.createLinearGradient(0, 0, poster._toPx(width), poster._toPx(height))
				} else {
					//从左到右
					grd = context.createLinearGradient(0, poster._toPx(width), poster._toPx(height), 0)
				}
				grd.addColorStop(0, backgroundColor)
				grd.addColorStop(1, gradientColor)
				// Fill with gradient
				context.setFillStyle(grd);
				// #endif

				// #ifdef MP-KUAISHOU
				context.setFillStyle(backgroundColor);
				// #endif
			} else {
				context.setFillStyle(backgroundColor);
			}

			if (shadow) {
				const {
					offsetX,
					offsetY,
					blur,
					color
				} = shadow;
				context.shadowOffsetX = poster._toPx(offsetX)
				context.shadowOffsetY = poster._toPx(offsetY)
				context.shadowBlur = blur
				context.shadowColor = color
				// context.setShadow(poster._toPx(offsetX), poster._toPx(offsetY), blur, color);
			}

			if (borderRadius > 0) {
				// 画圆角矩形
				poster._drawRadiusRect(context, params);
				context.fill();
			} else {
				context.fillRect(poster._toPx(x), poster._toPx(y), poster._toPx(width), poster._toPx(height));
			}
			context.restore();
		}
		if (borderWidth) {
			// 画线
			context.save();
			context.setGlobalAlpha(opacity);
			context.setStrokeStyle(borderColor);
			context.setLineWidth(poster._toPx(borderWidth));
			if (borderRadius > 0) {
				// 画圆角矩形边框
				poster._drawRadiusRect(context, params);
				context.stroke();
			} else {
				context.strokeRect(poster._toPx(x), poster._toPx(y), poster._toPx(width), poster._toPx(height));
			}
			context.restore();
		}

	},
	_drawLine(context, params) {
		let {
			x,
			y,
			endX,
			endY,
			color,
			width = 1
		} = params;
		context.save();
		context.beginPath();
		context.setStrokeStyle(color);
		context.setLineWidth(poster._toPx(width));
		context.moveTo(poster._toPx(x), poster._toPx(y));
		context.lineTo(poster._toPx(endX), poster._toPx(endY));
		context.stroke();
		context.closePath();
		context.restore();
	},
	_drawQrcode(context, params) {
		let {
			x,
			y,
			width,
			height,
			value,
			foreground = "#181818",
			background = "#ffffff"
		} = params;
		x = poster._toPx(x)
		y = poster._toPx(y)
		width = poster._toPx(width)
		height = poster._toPx(height)
		const qrcode = fuiQr(poster.utf16to8(value), {
			typeNumber: -1,
			errorCorrectLevel: 2,
		})
		const cells = qrcode.modules
		const tileW = width / cells.length
		const tileH = height / cells.length

		cells.forEach((row, rdx) => {
			row.forEach((cell, cdx) => {
				context.setFillStyle(cell ? foreground : background)
				const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
				const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
				context.fillRect(Math.round(cdx * tileW) + x, Math.round(rdx * tileH) + y, w, h)
			})
		})
		context.restore();
	},
	//ios用户拒绝相册访问 ，引导用户到设置页面，开启相册访问权限
	//-1=未请求  1 = 已允许，0 = 拒绝|受限
	_judgeIosPermissionPhotoLibrary() {
		// #ifdef APP-PLUS
		var result = 0;
		var PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
		var authStatus = PHPhotoLibrary.authorizationStatus();
		if (authStatus === 0) {
			result = -1;
		} else if (authStatus == 3) {
			result = 1;
			console.log("相册权限已经开启");
		} else {
			result = 0;
			console.log("相册权限没有开启");
		}
		plus.ios.deleteObject(PHPhotoLibrary);
		return result;
		// #endif
	},
	// Android权限查询
	_requestAndroidPermission(permissionID) {
		// #ifdef APP-PLUS
		return new Promise((resolve, reject) => {
			plus.android.requestPermissions(
				// 理论上支持多个权限同时查询，本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
				[permissionID],
				function(resultObj) {
					var result = 0;
					for (var i = 0; i < resultObj.granted.length; i++) {
						var grantedPermission = resultObj.granted[i];
						console.log('已获取的权限：' + grantedPermission);
						result = 1
					}
					for (var i = 0; i < resultObj.deniedPresent.length; i++) {
						var deniedPresentPermission = resultObj.deniedPresent[i];
						console.log('拒绝本次申请的权限：' + deniedPresentPermission);
						result = 0
					}
					for (var i = 0; i < resultObj.deniedAlways.length; i++) {
						var deniedAlwaysPermission = resultObj.deniedAlways[i];
						console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
						result = -1
					}
					resolve(result);
					// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
				},
				function(error) {
					console.log('申请权限错误：' + error.code + " = " + error.message);
					resolve({
						code: error.code,
						message: error.message
					});
				}
			);
		});
		// #endif
	},
	// 跳转到**应用**的权限页面
	_gotoAppPermissionSetting(isAndroid) {
		// #ifdef APP-PLUS
		if (!isAndroid) {
			var UIApplication = plus.ios.import("UIApplication");
			var application2 = UIApplication.sharedApplication();
			var NSURL2 = plus.ios.import("NSURL");
			// var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
			var setting2 = NSURL2.URLWithString("app-settings:");
			application2.openURL(setting2);

			plus.ios.deleteObject(setting2);
			plus.ios.deleteObject(NSURL2);
			plus.ios.deleteObject(application2);
		} else {
			// console.log(plus.device.vendor);
			var Intent = plus.android.importClass("android.content.Intent");
			var Settings = plus.android.importClass("android.provider.Settings");
			var Uri = plus.android.importClass("android.net.Uri");
			var mainActivity = plus.android.runtimeMainActivity();
			var intent = new Intent();
			intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
			var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
			intent.setData(uri);
			mainActivity.startActivity(intent);
		}
		// #endif
	},
	_modal: function(callback, confirmColor, confirmText) {
		uni.showModal({
			title: '提示',
			content: '您还没有开启相册权限，是否立即设置？',
			showCancel: true,
			cancelColor: '#B2B2B2',
			confirmColor: confirmColor || "#181818",
			confirmText: confirmText || "确定",
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},
	//相册权限查询，如果没有权限则提示打开设置页面
	_judgePermissionPhotoLibrary: async function(callback) {
		// #ifdef H5 || MP-ALIPAY|| MP-360
		//H5端不支持调用api保存到相册
		callback && callback(true)
		// #endif

		// #ifdef APP-PLUS
		const res = uni.getSystemInfoSync();
		let result;
		let isAndroid = res.platform.toLocaleLowerCase() == "android";
		if (isAndroid) {
			result = await poster._requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
		} else {
			result = poster._judgeIosPermissionPhotoLibrary()
		}
		if (result == 1) {
			callback && callback(true)
		} else {
			if (!(!isAndroid && result == -1)) {
				poster._modal((res) => {
					if (res) {
						poster._gotoAppPermissionSetting(isAndroid)
					}
				})
			} else {
				callback && callback(true)
			}
		}
		// #endif

		// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
		uni.authorize({
			scope: 'scope.writePhotosAlbum',
			success() {
				callback && callback(true)
			},
			fail() {
				poster._modal((res) => {
					if (res) {
						uni.openSetting({
							success(res) {
								console.log(res.authSetting)
							}
						});
					}
				})
			}
		})
		// #endif
	},
	//图片转成本地文件
	getImage(url) {
		return new Promise((resolve, reject) => {
			uni.downloadFile({
				url: url,
				success: res => {
					resolve(res.tempFilePath);
				},
				fail: res => {
					reject(false)
				}
			})
		})
	},
	//当服务器端返回图片base64时,转成本地文件
	//微信小程序不支持直接绘制base64，其他平台可根据支持情况进行处理
	getImagebyBase64(base64) {
		//使用前先查看支持平台
		const uniqueId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
		return new Promise((resolve, reject) => {
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
					resolve(filePath);
				},
				fail() {
					reject(false)
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
					resolve(target);

				}, function(e) {
					console.log('保存图片失败：' + JSON.stringify(e));
					reject(false)
				});
			}, function() {
				console.log('加载Base64图片数据失败：' + JSON.stringify(e));
				reject(false)
			});
			// #endif

			// #ifdef H5
			// let img = new Image();
			// img.src = base64;
			resolve(base64);
			// #endif

			//后面查看文档说明再进行转换
			// #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-360
			reject(false)
			// #endif
		})
	},
	async generatePoster(cw, ch, queue, callback) {
		for (let i = 0; i < queue.length; i++) {
			const item = queue[i]
			if (item.type === 'image') {
				const res = await poster._getImageInfo(item.imgResource)
				if (res) {
					item.imgWidth = res.width
					item.imgHeight = res.height
				}
			}
		}
		const context = poster._ctx;
		if (context) {
			context.clearRect(0, 0, poster._toPx(cw), poster._toPx(ch))
			queue.forEach((params) => {
				if (params.type === 'image') {
					poster._drawImage(context, params)
				} else if (params.type === 'text') {
					poster._drawText(context, params)
				} else if (params.type === 'block') {
					poster._drawBlock(context, params)
				} else if (params.type === 'line') {
					poster._drawLine(context, params)
				} else if (params.type === 'qrcode') {
					poster._drawQrcode(context, params)
				}
			});
			const platform = uni.getSystemInfoSync().platform;
			let time = 50;
			if (platform === 'android') {
				time = 300;
			}
			setTimeout(() => {
				context.draw(false, () => {
					setTimeout(() => {
						// #ifdef MP-ALIPAY
						context.toTempFilePath({
							success: res => {
								callback && callback(res.apFilePath)
							},
							fail: err => {
								callback && callback(false)
							}
						});
						// #endif
						// #ifndef MP-ALIPAY
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							canvasId: poster._canvasId,
							fileType: 'png',
							quality: 1,
							success: function(res) {
								callback && callback(res.tempFilePath)
							},
							fail() {
								callback && callback(false)
							}
						}, poster._this)
						// #endif
					}, time)
				})
			}, 50)
		} else {
			callback && callback(false)
		}
	},
	// 将海报图片保存到本地，H5只可预览然后长按保存
	saveImage(file) {
		// #ifndef H5
		//检查是否授权相册权限
		poster._judgePermissionPhotoLibrary((res) => {
			//保存图片
			if (res) {
				uni.saveImageToPhotosAlbum({
					filePath: file,
					success(res) {
						uni.showToast({
							title: '图片保存成功',
							icon: 'none'
						})
					},
					fail(res) {
						uni.showToast({
							title: '图片保存失败',
							icon: 'none'
						})
					}
				})
			}
		})
		// #endif
		// #ifdef H5
		uni.previewImage({
			urls: [file]
		});
		// #endif
	},
	utf16to8(str) {
		const len = str.length
		let out = ''

		for (let i = 0; i < len; i++) {
			const c = str.charCodeAt(i)

			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i)
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
			}
		}

		return out
	}
}

export default {
	create: poster.create,
	generatePoster: poster.generatePoster,
	getImage: poster.getImage,
	getImagebyBase64: poster.getImagebyBase64,
	saveImage: poster.saveImage
};