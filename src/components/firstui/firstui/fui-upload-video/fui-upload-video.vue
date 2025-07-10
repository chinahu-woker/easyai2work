<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：91 4  4 0 60  5   M A 55 6H1  K X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-uploadv__wrap">
		<view class="fui-uploadv__item" :style="{width:width+'rpx',height:height+'rpx'}" v-for="(item,index) in urls"
			:key="index">
			<video class="fui-upload__video" :style="{width:width+'rpx',height:height-(isView?0:40)+'rpx'}"
				:src="getVideoSrc(item)"></video>
			<view class="fui-uploadv__del-wrap" :style="{width:width+'rpx'}" v-if="!isView">
				<view class="fui-uploadv__flex-row" @tap.stop="reUpload(index)">
					<fui-icon name="checkbox" color="#fff" :size="32" v-if="progress[index]==100"></fui-icon>
					<fui-icon :name="progress[index]==-99?'clear':'wait'" color="#fff" :size="32"
						v-if="progress[index]<0"></fui-icon>
					<text class="fui-uploadv__progress-text"
						:class="{'fui-upt__pl':progress[index]==100 || progress[index]<0}">{{getStatusText(progress[index])}}</text>
					<text class="fui-uploadv__progress-text"
						v-if="progress[index]>=0 && progress[index]<100">{{progress[index]}}%</text>
				</view>
				<view class="fui-uploadv__del" @tap.stop="deleteVideo(index)">
					<fui-icon name="close" color="#fff" :size="28"></fui-icon>
				</view>
				<progress border-radius="6" class="fui-uploadv__progress" backgroundColor="rgba(255, 255, 255, 0.5)"
					:activeColor="getProgressColor" :percent="progress[index]" :stroke-width="3"
					v-if="progress[index]<100 && progress[index]>0"></progress>
			</view>
		</view>
		<view class="fui-uploadv__item"
			:class="[borderColor && borderColor!==true?'fui-upload__border':'fui-upload__noborder']"
			:style="{width:width+'rpx',height:height+'rpx',background:background,borderRadius:radius+'rpx',borderColor:borderColor,borderStyle:borderSytle}"
			v-if="showAdd" @tap.stop="chooseVideo">
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
		name: "fui-upload-video",
		emits: ['success', 'error', 'complete', 'reupload', 'delete'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			width: {
				type: [Number, String],
				default: 640
			},
			height: {
				type: [Number, String],
				default: 320
			},
			fileList: {
				type: Array,
				default () {
					return []
				}
			},
			max: {
				type: [Number, String],
				default: 1
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
			isView: {
				type: Boolean,
				default: false
			},
			progressColor: {
				type: String,
				default: ''
			},
			delColor: {
				type: String,
				default: '#eee'
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
			compressed: {
				type: Boolean,
				default: true
			},
			sourceType: {
				type: Array,
				default () {
					return ['album', 'camera']
				}
			},
			maxDuration: {
				type: Number,
				default: 60
			},
			camera: {
				type: String,
				default: 'back'
			},
			extension: {
				type: Array,
				default () {
					return []
				}
			},
			size: {
				type: [Number, String],
				default: 20
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
				//preupload、uploading、success、error
				status: [],
				progress: [],
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
				if (this.isView || len >= Number(this.max)) {
					show = false
				}
				return show
			},
			getProgressColor() {
				let color = this.progressColor;
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				return color;
			}
		},
		methods: {
			//如果使用平台不支持非https地址视频播放，请自行转为https地址
			getVideoSrc(src) {
				return !src ? '' : src
			},
			getStatusText(progress) {
				let text = '上传中...'
				if (progress === -1) {
					text = '等待上传'
				} else if (progress === -99) {
					text = '上传失败，点击重新上传'
				} else if (progress === 100) {
					text = '已上传'
				}
				return text;
			},
			initData(urls) {
				urls = urls || []
				this.status = [];
				this.progress = [];
				let status = [];
				let progress = [];
				urls.forEach(item => {
					status.push('success')
					progress.push(100)
				})
				this.urls = [...urls];
				this.status = status;
				this.progress = progress;
			},
			reUpload(index) {
				if (this.progress[index] !== -99) return;
				this.$set(this.status, index, 'uploading')
				if (this.callUpload) {
					this.$emit('reupload', {
						index
					})
				} else {
					this.$set(this.progress, index, 0)
					this.uploadVideo(index, this.urls[index]).then((res) => {
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
			chooseVideo() {
				uni.chooseVideo({
					sourceType: this.sourceType,
					compressed: this.compressed,
					maxDuration: this.maxDuration,
					camera: this.camera,
					success: (e) => {
						const path = e.tempFilePath
						if (this.extension.length > 0) {
							const format = path.split(".")[(path.split(".")).length - 1];
							if (format && this.extension.indexOf(format) == -1) {
								let text = `只能上传 ${this.extension.join(',')} 格式视频！`
								this.toast(text);
								return;
							}
						}
						// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-JD
						if (Number(this.size) * 1024 * 1024 < e.size) {
							let err = `单个视频大小不能超过：${this.size}MB`
							this.toast(err);
							return;
						}
						// #endif

						this.urls.push(path)
						this.status.push(this.immediate ? 'uploading' : 'preupload')
						this.progress.push(this.immediate ? 0 : -1)
						this.onComplete('choose')
						if (this.immediate) {
							this.uploadVideo(this.urls.length - 1, path).then((res) => {
								this._success(res)
							}).catch((res) => {
								this._error(res)
							})
						}
					}
				})
			},
			uploadVideo(index, videoUrl, url) {
				return new Promise((resolve, reject) => {
					const uploadTask = uni.uploadFile({
						url: this.url || url,
						name: this.name,
						header: this.header,
						formData: this.formData,
						filePath: videoUrl,
						success: (res) => {
							if (res.statusCode === 200) {
								this.$set(this.status, index, 'success')
								this.$set(this.progress, index, 100)
								resolve({
									res,
									index
								})
							} else {
								this.$set(this.status, index, 'error')
								this.$set(this.progress, index, -99)
								reject({
									res,
									index
								})
							}
						},
						fail: (res) => {
							this.$set(this.status, index, 'error')
							this.$set(this.progress, index, -99)
							reject({
								res,
								index
							})
						}
					})
					uploadTask.onProgressUpdate((res) => {
						this.$set(this.progress, index, res.progress)
					});
				})
			},
			deleteVideo(index) {
				let status = this.getStatus()
				if (status === 'uploading') {
					this.toast('请等待上传结束再进行删除！')
				} else {
					if (this.confirmDel) {
						let _this = this
						uni.showModal({
							content: '确定将该视频删除吗？',
							showCancel: true,
							confirmText: "确定",
							success(res) {
								if (res.confirm) {
									_this.urls.splice(index, 1)
									_this.status.splice(index, 1)
									_this.progress.splice(index, 1)
									_this.onComplete('delete')
									_this.$emit('delete', {
										index: index
									})
								}
							}
						})
					} else {
						this.urls.splice(index, 1)
						this.status.splice(index, 1)
						this.progress.splice(index, 1)
						this.onComplete('delete')
						this.$emit('delete', {
							index: index
						})
					}
				}
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
						this.$set(this.progress, i, 0)
						this.uploadVideo(i, urls[i], this.url).then(res => {
							this._success(res)
						}).catch(error => {
							this._error(error)
						})
					}
				}
			},
			setProgress(progress, index) {
				this.$set(this.progress, index, progress)
			},
			upload(callback, index) {
				// 传入一个返回Promise的文件上传的函数
				//V1.9.8+，新增此方法主要为了更好的扩展使用
				let urls = [...this.urls]
				if (index === undefined || index === null) {
					const len = urls.length
					for (let i = 0; i < len; i++) {
						if (urls[i].startsWith('https')) {
							continue;
						} else {
							this.$set(this.status, i, "uploading")
							this.$set(this.progress, i, 0)
							if (typeof callback === 'function') {
								callback(urls[i], i).then(res => {
									this.$set(this.status, i, 'success')
									this.$set(this.progress, i, 100)
									this.result(res, i)
								}).catch(err => {
									this.$set(this.status, i, 'error')
									this.$set(this.progress, i, -99)
								})
							}
						}
					}
				} else {
					//如果传入index，则是重新上传时调用
					this.$set(this.status, index, "uploading")
					this.$set(this.progress, index, 0)
					if (typeof callback === 'function') {
						callback(urls[index], index).then(res => {
							this.$set(this.status, index, 'success')
							this.$set(this.progress, index, 100)
							this.result(res, index)
						}).catch(err => {
							this.$set(this.status, index, 'error')
							this.$set(this.progress, index, -99)
						})
					}
				}
			}
		}
	}
</script>

<style scoped>
	.fui-uploadv__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.fui-uploadv__item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
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

	.fui-upload__video {
		width: 640rpx;
		height: 320rpx;
	}

	.fui-uploadv__del-wrap {
		height: 40rpx;
		padding: 0 4rpx;
		position: relative;
		/* #ifndef APP-NVUE */
		z-index: 10;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		background-color: #000;
	}

	.fui-uploadv__flex-row {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		flex-direction: row;
		transform: scale(0.8);
		transform-origin: 0 center;
	}

	.fui-uploadv__progress-text {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		font-size: 24rpx;
		line-height: 24rpx;
		font-weight: normal;
		color: #eee;
	}

	.fui-upt__pl {
		padding-left: 8rpx;
	}

	.fui-uploadv__progress {
		border-radius: 4px;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		z-index: 10;
		/* #endif */
	}

	.fui-uploadv__del {
		height: 32rpx;
		width: 32rpx;
		padding-left: 8rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
</style>