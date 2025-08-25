<script setup lang="ts">
	import { computed, ref, watch } from 'vue';
	import MyPopup from "@/components/common/MyPopup.vue";
	import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	import { storeToRefs } from "pinia";
	import { useAppStore } from "@/stores/appStore.ts";
	import { onShow } from "@dcloudio/uni-app";
	import $fui from '@/components/firstui/fui-clipboard';


	const currentSwiperIndex = ref(0)
	watch(currentSwiperIndex, () => {
		console.log('currentSwiperIndex', currentSwiperIndex.value)
	})

	const loadingBackground = 'https://static.51easyai.com/comfy/onloading_bg.jpg'

	const { localTasks } = storeToRefs(useAppStore())


	// 如果任务完成则使用完成的图片，如果任务没有完成则是用loading图片
	const swiperData = computed(() => {
		if (localTasks.value.length === 0) {
			return [loadingBackground]
		}
		return localTasks.value.map(item => {
			return item.status === 1 ? item.output[0] : loadingBackground
		})
	})

	// 当前任务的进度
	const currentProgress = computed(() => {
		if (localTasks.value.length === 0) {
			return '暂无任务'
		}
		// 进度更新
		const currentTask = localTasks.value[currentSwiperIndex.value]
		if (currentTask && currentTask.status === 4) {
			return currentTask.progress + '%'
		} else if (currentTask && currentTask.status === 0 && currentTask.queue) {
			return `对列:${currentTask.queue},预计:${currentTask.time_remained}s`
		}
		return ''
	})
	//当前任务的图片张数
	const currentImageCount = computed(() => {
		const currentTask = localTasks.value[currentSwiperIndex.value]
		if (currentTask && currentTask.status === 1) {
			return currentTask.output.length
		} else {
			return 0
		}
	})

	const showProgress = computed(() => {
		return localTasks.value[currentSwiperIndex.value]?.status !== 1
	})

	const progressAnimation = ref({}); // 存储动画数据
	// 创建动画实例并设置动画效果
	const createAnimation = () => {
		const animation = uni.createAnimation({
			duration: 500, // 动画时长
			timingFunction: 'ease', // 动画缓动函数
		});

		// 设置从透明到不透明的动画效果
		animation.opacity(0).step();
		progressAnimation.value = animation.export();
		return animation;
	};

	function handleChange(index : any) {
		currentSwiperIndex.value = index.current; // 更新当前索引
	}

	const showPopup = defineModel({
		default: false
	})

	// 处理触摸开始事件
	const handleTouchStart = () => {
		const animation = createAnimation();

		// 在触摸开始时隐藏 progress-container
		animation.opacity(0).step(); // 透明度设置为0
		progressAnimation.value = animation.export(); // 应用动画
	};

	// 处理触摸结束事件
	const handleTouchEnd = () => {
		const animation = createAnimation();

		// 在触摸结束时显示 progress-container
		animation.opacity(1).step(); // 透明度设置为1

		setTimeout(() => progressAnimation.value = animation.export(), 200)
	};

	const handleFindExecutingTaskIndex = () => {
		return localTasks.value.findIndex(item => item.status === 4)
	}

	onShow(() => {
		const excIndex = handleFindExecutingTaskIndex()
		console.log('task onshow', excIndex)
		if (excIndex !== -1) {
			currentSwiperIndex.value = handleFindExecutingTaskIndex()
		}
	})

	function checkContent(str) {
		// 使用正则表达式判断是否是链接
		const linkRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		if (linkRegex.test(str)) {
			return 1; // 是链接
		} else {
			return 2; // 是文本
		}
	}
	function judgeContent(input) {
		// 定义图片链接的正则表达式
		const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;
		// 定义视频链接的正则表达式
		const videoRegex = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;

		// 检查内容是否为空
		if (!input) {
			console.log('==============', '是空值')
			return 0; // 内容为空
		}

		// 检查内容是否为图片链接
		if (checkContent(input) == 1) {

			if (imageRegex.test(input)) {
				console.log('==============', '是图片')
				return 1; // 是图片链接
			}
			// 检查内容是否为视频链接
			else if (videoRegex.test(input)) {
				console.log('==============', '是视频')
				return 2; // 是视频链接
			}
		}
		// 如果不是图片或视频链接，则认为是文本
		if (checkContent(input) == 2) {
			return 3; // 是文本
		}
	}
	const StringImag = ref()
	const StringCont = ref('')
	const showOrSleep = ref(0)
	const generateParams = computed(() => {
		console.log('----------------------------{{generateParams}}----------------', localTasks.value[currentSwiperIndex.value])
		const output = localTasks.value[currentSwiperIndex.value]?.output[currentSwiperIndex.value];
		const contentType = judgeContent(output);
		//  1是图片 2是视频 3是文本
		if (contentType === 0) {
			showOrSleep.value = 1;
		} else if (contentType === 1) {
			showOrSleep.value = 0;
			StringImag.value = output;
			StringCont.value = '';
			console.log('----------output---showOrSleep.value = 0;---------', output)
		} else if (contentType === 2) {
			showOrSleep.value = 1;
			StringCont.value = "";
			StringImag.value = "output";
			console.log('----------output---showOrSleep.value = 1;---------', output)
		} else if (contentType === 3) {
			showOrSleep.value = 2;
			StringCont.value = output;
			console.log('----------output---showOrSleep.value = 2;---------', output)
			StringImag.value = localTasks.value[currentSwiperIndex.value]?.params?.image_path_mask;
		}

		// return localTasks.value[currentSwiperIndex.value]?.params;
	})


	/*保存到相册*/
	const handleSave = () => {
		const currentTask = localTasks.value[currentSwiperIndex.value]
		if (currentTask && currentTask.status === 1) {
			saveImage(currentTask.output[0])
		}
	}

	const handleGotoHistory = () => {
		uni.navigateTo({ url: '/pages/history/history_fui/history_fui' })
	}

	// 下载网络图片并保存到相册
	const saveImage = (url : string) => {
		// 第一步：下载图片
		uni.downloadFile({
			url: url, // 图片的网络地址
			success: (res) => {
				if (res.statusCode === 200) {
					// 第二步：下载成功后，获取本地路径
					const localPath = res.tempFilePath;
					console.log('localPath', localPath);
					// 第三步：保存图片到相册
					uni.saveImageToPhotosAlbum({
						filePath: localPath,
						success: () => {
							uni.showToast({
								title: '图片已保存',
								icon: 'success'
							});
						},
						fail: (error) => {
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
							console.error('保存图片失败:', error);
						}
					});
				} else {
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					});
				}
			},
			fail: (error) => {
				uni.showToast({
					title: '下载失败',
					icon: 'none'
				});
				console.error('下载图片失败:', error);
			}
		});
	}

	/**预览图片 */
	const handlePreview = () => {

		const currentTask = localTasks.value[currentSwiperIndex.value]
		if (currentTask && currentTask.status === 1) {
			console.log("preview")
			uni.previewImage({ urls: currentTask.output })
		}
	}
	const fabs = [{
		name: 'edit',
		text: '复制文本'
	},
		// {
		// 	name: 'share',
		// 	text: '分享海报'
		// },
	]

	const show = ref(false)
	function handleClick(e, StringTxt) {
		if (e.index == 0) {
			console.log('---------------(e)------------', e)
			uni.setClipboardData({
				data: StringTxt, // 需要设置到剪切板的内容
				showToast: true, // 是否显示提示，默认为true
				success: function () {
					console.log('复制成功');
				},
				fail: function (err) {
					console.error('复制失败', err);
				}
			});
		}
		else if (e.index == 1) {
			uni.value.toast("还在开发中.....");

		}

	}
	const isLeft = true
</script>

<template>
	<!-- <fui-dialog :show="show" content="还在开发中....." maskClosable ></fui-dialog> -->
	<MyPopup v-model="showPopup">

		<view >
			<view style="padding: 200rpx 40rpx 0 40rpx;position: relative;" @touchend="handleTouchEnd"
				@touchstart="handleTouchStart">
				<!-- v-if="checkContent(currentSwiperIndex) == 1" -->
				<view>
					<view>
						<view v-if="showOrSleep==0">
						<up-swiper @click="handlePreview" @change="handleChange" :current="currentSwiperIndex"
							:list="swiperData" previousMargin="20" nextMargin="20" imgMode="aspectFill" height="500"
							indicator indicatorMode="line" circular :autoplay="false" radius="20" keyName="url"
							indicatorStyle="bottom">
						</up-swiper>
						
						</view>
						<view v-else-if="showOrSleep==1">
						
						<view >
								<view class="fui-list__item CardStyle">
									<!-- <image class="fui-cover" :src="`${resUrl}/cooperate/dark/img_banner_3x.png`" mode="widthFix"></image> -->
									<video style="width: 80%; height: 480px; margin-top: 0%; background-color:transparent; " id="myVideo"
										:src="StringImag" controls></video>
								</view>
						</view>
						</view>
						
						<!-- <view style="margin-top: 6%;">
							<video style="width: 100%; height: 390px; background-color:transparent;" id="myVideo" :src="StringImag"
								controls></video>
						</view> -->
						
						<view v-else-if="showOrSleep==2">
							<fui-background-image
								src="@/src/static/Home2 (1).jpgHome2(1).jpg">
							</fui-background-image>
							<view style="margin-left:10% ;margin-right: 10%;margin-top: 15%;">
								<scroll-view scroll-y="true" class="scroll-Y">
									<view style="text-align: center;">
										<image style="width: 200px; height: 300px; background-color: #eeeeee;" mode="scaleToFill"
											:src="StringImag"></image>
									</view>
									<fui-parse-group class="custom-view" :thBgcolor="false">
										<fui-parse :nodes="StringCont" language="html"></fui-parse>
									</fui-parse-group>
								</scroll-view>
								<fui-fab :position="isLeft?'left':'right'" :fabs="fabs"
									@click="handleClick($event,StringCont)"></fui-fab>
							</view>
						</view>
						<!--显示图片数量-->
						<view class="image-count">
							<TnIcon style="color: gainsboro;" name="image"></TnIcon>
							<span style="color: gainsboro;margin-left: 3rpx;"
								class="tn-text-sm">{{currentImageCount}}</span>
						</view>
					</view>

					<view class="progress-container" v-if="showProgress" :animation="progressAnimation">
						<view class="tn-text-center">
							<TnIcon name="starry" size="100" color="tn-white" />
						</view>
						<view class="tn-text tn-text-center tn-text-bold tn-white_text">
							{{ currentProgress }}
						</view>
						<view class="tn-text-sm tn-text-center tn-white_text">
							关闭页面不影响生成结果
						</view>
					</view>
				</view>

				<view style="margin-top: 6rpx;">
					<view>
						<TnIcon name="starry" size="50" class="params-icon" />
						<span class="tn-text ">提示词</span>
					</view>

					<span style="padding: 10rpx;"
						class="tn-text tn-text-ellipsis-3">{{ generateParams?.positive }}</span>
					<view>
					</view>
				</view>

			</view>
			<!--      底部按钮-->
			<view class="bottom-container">
				<view style="display: flex; ">
					<view class="bottom-icon">
						<tn-icon name="download-simple" size="50rpx" @click="handleSave"></tn-icon>
					</view>
					<view class="bottom-icon">
						<tn-icon name="send" size="50rpx"></tn-icon>
					</view>
				</view>

				<view class="bottom-icon">
					<tn-icon name="right-arrow" size="50rpx" @click="handleGotoHistory"></tn-icon>
				</view>
			</view>
		</view>
		<!-- <view v-else-if="showOrSleep==3">
			<fui-background-image
				src="@/src/static/Home2 (1).jpgHome2(1).jpg">
			</fui-background-image>
			<view style="margin-left:10% ;margin-right: 10%;margin-top: 15%;">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view style="text-align: center;">
						<image style="width: 200px; height: 300px; background-color: #eeeeee;" mode="scaleToFill"
							:src="StringImag"></image>
					</view>
				</scroll-view>
				<fui-fab :position="isLeft?'left':'right'" :fabs="fabs"
					@click="handleClick($event,StringCont)"></fui-fab>
			</view>

		</view> -->
	
		<view>

		</view>

	</MyPopup>

</template>

<style scoped lang="scss">
	.CardStyle{
		// margin-top: 40%;
		text-align: center;
	}
	.fui-section__title {
		margin-left: 32rpx;
	}

	.custom-view {


		padding: 10px;
		/* 内边距 */
		color: #333;
		/* 文本颜色 */
		font-size: 16px;
		/* 字体大小 */

	}

	.scroll-Y {
		height: 1200rpx;
	}

	.fui-scroll__view {
		width: 100%;
		height: 600rpx;
	}

	.progress-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.bottom-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 40rpx;
		width: 100%;
		padding-bottom: 5%;
		padding-left: 5%;
		padding-right: 5%;
	}

	.bottom-icon {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90rpx;
		height: 90rpx;
		color: $u-primary-lighten;
		margin-right: 20rpx;
		background-color: $u-bg-color;
		border-radius: 50%;
		font-size: 70rpx;
		box-shadow: 0 5px 15px rgba(46, 54, 80, .3);
		overflow: hidden;
		/* 确保水波纹不超出圆形按钮 */
	}

	.bottom-icon::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.2);
		transform: scale(0);
		opacity: 0;
		pointer-events: none;
		transition: transform 0.6s, opacity 0.6s;
	}

	.bottom-icon:active::before {
		transform: scale(4);
		opacity: 1;
	}

	.params-icon {
		color: gray;
		margin-right: 20rpx;
	}

	.image-count {
		position: absolute;
		right: 120rpx;
		bottom: 120rpx;
	}
</style>