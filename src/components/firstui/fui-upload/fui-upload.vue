<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号：91 4 406 05 M     A55 6   H  1KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-upload__wrap">
		<view class="fui-upload__item" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius+'rpx'}"
			v-for="(item,index) in urls" :key="index">
			<image class="fui-upload__img" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius+'rpx'}"
				:src="item" mode="aspectFill" @tap.stop="previewImage(index)"></image>
			<view class="fui-upload__mask" v-if="status[index]!=='success' && status[index]!=='preupload' ">
				<fui-icon name="warning-fill" color="#fff" :size="48" v-if="status[index]==='error'"></fui-icon>
				<text class="fui-reupload__btn" @tap.stop="reUpload(index)" v-if="status[index]==='error'">重新上传</text>
				<!-- #ifndef APP-NVUE -->
				<view class="fui-upload__loading" ref="fui_reupload_ld" v-if="status[index]==='uploading'"></view>
				<text class="fui-upload__text" v-if="status[index]==='uploading'">请稍候...</text>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<text class="fui-upload__text fui-upload__mtop" v-if="status[index]==='uploading'">正在上传...</text>
				<!-- #endif -->
			</view>
			<view class="fui-upload__del" :style="{background:delColor}" v-if="isDel" @tap.stop="deleteImage(index)">
				<fui-icon name="close" color="#fff" :size="32"></fui-icon>
			</view>
		</view>
		<view class="fui-upload__item"
			:class="[borderColor && borderColor!==true?'fui-upload__border':'fui-upload__noborder']"
			:style="{width:width+'rpx',height:height+'rpx',background:background,borderRadius:radius+'rpx',borderColor:borderColor,borderStyle:borderSytle}"
			v-if="showAdd" @tap.stop="chooseImage">
			<slot>
				<fui-icon name="plus" :size="addSize" :color="addColor"></fui-icon>
			</slot>
		</view>
	</view>
</template>

<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-upload",
		emits: ['success', 'error', 'complete', 'preview', 'reupload', 'delete'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			width: {
				type: [Number, String],
				default: 200
			},
			height: {
				type: [Number, String],
				default: 200
			},
			fileList: {
				type: Array,
				default () {
					return []
				}
			},
			max: {
				type: [Number, String],
				default: 9
			},
			isAdd: {
				type: Boolean,
				default: true
			},
			addColor: {
				type: String,
				default: '#333'
			},
			addSize: {
				type: [Number, String],
				default: 88
			},
			background: {
				type: String,
				default: '#eee'
			},
			radius: {
				type: [Number, String],
				default: 0
			},
			borderColor: {
				type: String,
				default: ''
			},
			//solid、dashed、dotted
			borderSytle: {
				type: String,
				default: 'solid'
			},
			isDel: {
				type: Boolean,
				default: true
			},
			delColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			confirmDel: {
				type: Boolean,
				default: false
			},
			url: {
				type: String,
				default: ''
			},
			immediate: {
				type: Boolean,
				default: false
			},
			//V1.9.8+ 是否调用upload 方法进行上传操作
			callUpload: {
				type: Boolean,
				default: false
			},
			sizeType: {
				type: Array,
				default () {
					return ['original', 'compressed']
				}
			},
			sourceType: {
				type: Array,
				default () {
					return ['album', 'camera']
				}
			},
			//图片后缀名限制
			suffix: {
				type: Array,
				default () {
					return []
				}
			},
			//单张图片大小限制 MB
			size: {
				type: [Number, String],
				default: 4
			},
			name: {
				type: String,
				default: 'file'
			},
			header: {
				type: Object,
				default () {
					return {}
				}
			},
			formData: {
				type: Object,
				default () {
					return {}
				}
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				urls: [],
				tempFiles: [],
				//preupload、uploading、success、error
				status: []
			};
		},
		created() {
			this.initData(this.fileList)
		},
		watch: {
			fileList(vals) {
				this.initData(vals)
			}
		},
		computed: {
			showAdd() {
				let show = true;
				let len = this.urls.length
				if (!this.isAdd || (this.max == -1 && len >= 9) || (this.max != -1 && len >= this.max)) {
					show = false
				}
				return show
			}
		},
		methods: {
			initData(urls) {
				urls = urls || []
				this.status = [];
				let status = [];
				let tempFiles = []
				urls.forEach(item => {
					status.push('success')
					tempFiles.push({
						path: item
					})
				})
				this.urls = [...urls];
				this.tempFiles = tempFiles;
				this.status = status;
			},
			reUpload(index) {
				this.$set(this.status, index, 'uploading')
				if (this.callUpload) {
					this.$emit('reupload', {
						index
					})
				} else {
					this.uploadImage(index, this.urls[index]).then((res) => {
						this._success(res)
					}).catch((res) => {
						this._error(res)
					})
				}
			},
			getStatus() {
				if (this.status.length === 0) return '';
				let status = 'preupload';
				if (this.status.indexOf('preupload') === -1) {
					status = ~this.status.indexOf('uploading') ? 'uploading' : 'success'
					if (status !== 'uploading' && ~this.status.indexOf("error")) {
						// 上传失败
						status = 'error'
					}
				}
				return status
			},
			onComplete(action) {
				let status = this.getStatus()
				this.$emit('complete', {
					status: status,
					urls: this.urls,
					tempFiles: this.tempFiles,
					action: action,
					param: this.param
				})
			},
			_success(res) {
				let status = this.getStatus()
				this.$emit('success', {
					status: status,
					...res,
					param: this.param
				})
			},
			_error(res) {
				let status = this.getStatus()
				this.$emit('error', {
					status: status,
					...res,
					param: this.param
				})
			},
			result(url, index) {
				if (!url || index === undefined) return;
				this.$set(this.urls, index, url)
				setTimeout(() => {
					this.onComplete('upload')
				}, 0)
			},
			toast(text) {
				text && uni.showToast({
					title: text,
					icon: "none"
				});
			},
			chooseImage() {
				let max = Number(this.max)
				uni.chooseImage({
					count: max === -1 ? 9 : max - this.urls.length,
					sizeType: this.sizeType,
					sourceType: this.sourceType,
					success: (e) => {
						let imageArr = [];
						for (let i = 0; i < e.tempFiles.length; i++) {
							let len = this.urls.length;
							if (len >= max && max !== -1) {
								this.toast(`最多可上传${max}张图片`);
								break;
							}
							//过滤图片类型
							let path = e.tempFiles[i].path;

							if (this.suffix.length > 0) {
								let format = ""
								// #ifdef H5
								let type = e.tempFiles[i].type;
								format = type.split('/')[1]
								// #endif

								// #ifndef H5
								format = path.split(".")[(path.split(".")).length - 1];
								// #endif

								if (this.suffix.indexOf(format) == -1) {
									let text = `只能上传 ${this.suffix.join(',')} 格式图片！`
									this.toast(text);
									continue;
								}
							}

							//过滤超出大小限制图片
							let size = e.tempFiles[i].size;

							if (Number(this.size) * 1024 * 1024 < size) {
								let err = `单张图片大小不能超过：${this.size}MB`
								this.toast(err);
								continue;
							}
							imageArr.push(path)
							this.urls.push(path)
							this.tempFiles.push(e.tempFiles[i])
							this.status.push(this.immediate ? 'uploading' : 'preupload')
						}
						this.onComplete('choose')
						let start = this.urls.length - imageArr.length
						if (this.immediate) {
							for (let j = 0; j < imageArr.length; j++) {
								let index = start + j
								this.uploadImage(index, imageArr[j]).then((res) => {
									this._success(res)
								}).catch((res) => {
									this._error(res)
								})
							}
						}
					}
				})
			},
			uploadImage(index, imgUrl, url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.url || url,
						name: this.name,
						header: this.header,
						formData: this.formData,
						filePath: imgUrl,
						success: (res) => {
							if (res.statusCode === 200) {
								this.$set(this.status, index, 'success')
								resolve({
									res,
									index
								})
							} else {
								this.$set(this.status, index, 'error')
								reject({
									res,
									index
								})
							}
						},
						fail: (res) => {
							this.$set(this.status, index, 'error')
							// uni.showModal({
							// 	content: JSON.stringify(res)
							// })
							reject({
								res,
								index
							})
						}
					})
				})
			},
			deleteImage(index) {
				let status = this.getStatus()
				if (status === 'uploading') {
					this.toast('请等待上传结束再进行删除！')
				} else {
					if (this.confirmDel) {
						let _this = this
						uni.showModal({
							content: '确定将该图片删除吗？',
							showCancel: true,
							confirmText: "确定",
							success(res) {
								if (res.confirm) {
									_this.urls.splice(index, 1)
									_this.tempFiles.splice(index, 1)
									_this.status.splice(index, 1)
									_this.onComplete('delete')
									_this.$emit('delete', {
										index: index
									})
								}
							}
						})

					} else {
						this.urls.splice(index, 1)
						this.tempFiles.splice(index, 1)
						this.status.splice(index, 1)
						this.onComplete('delete')
						this.$emit('delete', {
							index: index
						})
					}
				}
			},
			previewImage(index) {
				// #ifndef MP-BAIDU
				if (this.status.length === 0) return;
				uni.previewImage({
					current: this.urls[index],
					loop: true,
					urls: this.urls
				})
				// #endif
				//百度小程序使用
				this.$emit('preview', {
					index: index,
					urls: this.urls
				})
			},
			start() {
				if (!this.url) {
					this.toast('请传入服务器接口地址！');
					return;
				}
				let urls = [...this.urls]
				const len = urls.length
				for (let i = 0; i < len; i++) {
					if (urls[i].startsWith('https')) {
						continue;
					} else {
						this.$set(this.status, i, "uploading")
						this.uploadImage(i, urls[i], this.url).then(res => {
							this._success(res)
						}).catch(error => {
							this._error(error)
						})
					}
				}
			},
			upload(callback, index) {
				// 传入一个返回Promise的文件上传的函数
				//V1.9.8+，新增此方法主要为了更好的扩展使用
				if (index === undefined || index === null) {
					let urls = [...this.urls]
					const len = urls.length
					for (let i = 0; i < len; i++) {
						if (urls[i].startsWith('https')) {
							continue;
						} else {
							this.$set(this.status, i, "uploading")
							if (typeof callback === 'function') {
								callback(this.tempFiles[i]).then(res => {
									this.$set(this.status, i, 'success')
									this.result(res, i)
								}).catch(err => {
									this.$set(this.status, i, 'error')
								})
							}
						}
					}
				} else {
					//如果传入index，则是重新上传时调用
					this.$set(this.status, index, "uploading")
					if (typeof callback === 'function') {
						callback(this.tempFiles[index]).then(res => {
							this.$set(this.status, index, 'success')
							this.result(res, index)
						}).catch(err => {
							this.$set(this.status, index, 'error')
						})
					}
				}
			}
		}
	}
</script>

<style scoped>
	.fui-upload__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.fui-upload__item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;

		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.fui-upload__noborder {
		border-width: 0;
	}

	.fui-upload__border {
		border-width: 1px;
	}

	.fui-upload__del {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		height: 40rpx;
		width: 40rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		display: flex;
		/* #endif */

		/* #ifdef APP-NVUE */
		border-radius: 20rpx;
		/* #endif */
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.fui-upload__mask {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.fui-reupload__btn {
		width: 144rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 4rpx 0;
		font-size: 24rpx;
		border: 1px solid #FFFFFF;
		color: #fff;
		border-radius: 32rpx;
		margin-top: 16rpx;
		font-weight: normal;
	}

	.fui-reupload__btn:active {
		opacity: .5;
	}

	.fui-upload__loading {
		width: 32rpx;
		height: 32rpx;
		border-width: 2px;
		border-style: solid;
		border-top-color: #FFFFFF;
		border-left-color: #7F7F7F;
		border-right-color: #7F7F7F;
		border-bottom-color: #7F7F7F;
		/* #ifdef APP-NVUE */
		border-radius: 20rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		animation: fui-rotate 0.7s linear infinite;
		/* #endif */
		margin-bottom: 8rpx;
	}

	.fui-upload__text {
		font-size: 24rpx;
		color: #fff;
		margin-top: 16rpx;
		font-weight: normal;
	}

	/* #ifdef APP-NVUE */
	.fui-upload__mtop {
		margin-top: 0;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	@keyframes fui-rotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* #endif */
</style>