<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { onLoad, onReady } from "@dcloudio/uni-app";
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

const loadingBackground = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/onloading_bg.jpg'
// uni.getStorageSync('name')
const { localTasks } = storeToRefs(useAppStore())
const AllList = computed(() => {
	uni.setStorageSync('name', localTasks.value);
	const returnvalue = uni.getStorageSync('name')
	return returnvalue

})
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

function handleChange(index: any) {
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
const allValueList = ref([{
	class: 'pic',
	params: '',  // 替换为实际参数
	output: '',  // 替换为实际输出
	textImg: ' ' // 替换为实际图片路径
}])

// const allValueList = ref([]);


const generateParams = computed(() => {
	console.log('----------------------------{{generateParams}}----------------', localTasks.value[currentSwiperIndex.value])
	const output = localTasks.value[currentSwiperIndex.value]?.output[currentSwiperIndex.value];
	const contentType = judgeContent(output);
	allValueList.value = []
	//  1是图片 2是视频 3是文本
	if (contentType === 0) {
		showOrSleep.value = 0;
	} else if (contentType === 1) {
		// 图片
		showOrSleep.value = 0;
		allValueList.value.push({
			class: 'pic',
			params: localTasks.value[currentSwiperIndex.value]?.params || '',  // 替换为实际参数
			output: output,  // 替换为实际输出
			textImg: ' ' // 替换为实际图片路径
		});
		console.log('----------------------------{{generateParams}}------allValueList----------', allValueList.value)
		StringImag.value = output;
		StringCont.value = '';
		console.log('----------output---showOrSleep.value = 0;---------', output)
	} else if (contentType === 2) {
		allValueList.value.push({
			class: 'video',
			params: localTasks.value[currentSwiperIndex.value]?.params || '',  // 替换为实际参数
			output: output,  // 替换为实际输出
			textImg: ' ' // 替换为实际图片路径
		});
		showOrSleep.value = 1;
		StringCont.value = "";
		StringImag.value = "output";

		console.log('----------output---showOrSleep.value = 1;---------', output)
	} else if (contentType === 3) {
		allValueList.value.push({
			class: 'text',
			params: localTasks.value[currentSwiperIndex.value]?.params || '',  // 替换为实际参数
			output: output,  // 替换为实际输出
			textImg: localTasks.value[currentSwiperIndex.value]?.params?.image_path_mask // 替换为实际图片路径
		});


		showOrSleep.value = 2;
		StringCont.value = output;
		console.log('----------output---showOrSleep.value = 2;---------', output, allValueList)
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
 
const handleGotoHistory= () => {
  uni.navigateTo({url: '/pages/history/history_fui/history_fui'})
}

// 下载网络图片并保存到相册
const saveImage = (url: string) => {
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
const current = ref(0)
const SWitems = [{
	background: '#09BE4F'
}, {
	background: '#FFB703'
}, {
	background: '#B2B2B2'
}]

function change(e) {
	current.value = e.detail.current;
}


console.log("--------****************------------", AllList, localTasks)

// ===================================新增分享功能========================================

</script>

<template>


	<!-- <fui-dialog :show="show" content="还在开发中....." maskClosable ></fui-dialog> -->
	<MyPopup v-model="showPopup">


		<view>
			<fui-background-image style='z-index: 1;'
				src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/%C3%A7%C2%A4%C2%BE%C3%A4%C2%BA%C2%A4APP.jpg">
			</fui-background-image>
			<view style="padding: 200rpx 40rpx 0 40rpx;position: relative;" @touchend="handleTouchEnd"
				@touchstart="handleTouchStart">
				<!-- v-if="checkContent(currentSwiperIndex) == 1" -->
				<view>
					<view>
						<!-- <view v-if="showOrSleep==0">
							<up-swiper @click="handlePreview" @change="handleChange" :current="currentSwiperIndex"
								:list="swiperData" previousMargin="20" nextMargin="20" imgMode="aspectFill" height="500"
								indicator indicatorMode="line" circular :autoplay="false" radius="20" keyName="url"
								indicatorStyle="bottom">
							</up-swiper>

						</view> -->
						<!-- <view v-else-if="showOrSleep==1">

							<view>
								<view class="fui-list__item CardStyle">
									<video
										style="width: 80%; height: 480px; margin-top: 0%; background-color:transparent; "
										id="myVideo" :src="StringImag" controls></video>
								</view>
							</view>
						</view> -->

						<!-- <view style="margin-top: 6%;">
							<video style="width: 100%; height: 390px; background-color:transparent;" id="myVideo" :src="StringImag"
								controls></video>
						</view> -->

						<!-- <view v-else-if="showOrSleep==2">
							<fui-background-image
								src="@/src/static/Home2 (1).jpgHome2(1).jpg">
							</fui-background-image>
							<view style="margin-left:10% ;margin-right: 10%;margin-top: 15%;">
								<scroll-view scroll-y="true" class="scroll-Y">
									<view style="text-align: center;">
										<image style="width: 200px; height: 300px; background-color: #eeeeee;"
											mode="scaleToFill" :src="StringImag"></image>
									</view>
									<fui-parse-group class="custom-view" :thBgcolor="false">
										<fui-parse :nodes="StringCont" language="html"></fui-parse>
									</fui-parse-group>
								</scroll-view>
								<fui-fab :position="isLeft?'left':'right'" :fabs="fabs"
									@click="handleClick($event,StringCont)"></fui-fab>
							</view>
						</view> -->
						<view>
							<!-- --------------------------------------------------------------------------------------------- -->
							<!-- currentImageCount -->
							<!-- <fui-swiper-dot :items="currentImageCount " :current="current"> -->
							<swiper class="fui-banner__wrap" @change="change" circular :indicator-dots="false"
								:autoplay='true' :interval="10000" :duration="150">


								<swiper-item v-for="(item, index) in AllList" :key="index">

									<view>
										<!-- <view v-if="judgeContent(item.output[0]) == 0 ">
												
												<fui-empty src="/static/images/component/empty/img_news_3x.png" title="暂无新消息"></fui-empty>
												
											</view> -->
										<view v-if="judgeContent(item.output[0]) == 1">
											<up-swiper @click="handlePreview" @change="handleChange"
												:current="currentSwiperIndex" :list="swiperData" previousMargin="20"
												nextMargin="20" imgMode="aspectFill" height="500" indicator
												indicatorMode="line" circular :autoplay="false" radius="20"
												keyName="url" indicatorStyle="bottom">
											</up-swiper>
											<view style="margin-top: 6rpx;">
												<view>
													<TnIcon name="starry" size="50" class="params-icon" />
													<span class="tn-text ">提示词</span>
												</view>

												<span style="padding: 10rpx;" class="tn-text tn-text-ellipsis-3 ">{{
													item.params.positive }}</span>
												<view>
												</view>
											</view>

										</view>
										<view v-if="judgeContent(item.output[0]) == 2">
											<view>
												<view class="fui-list__item CardStyle">
													<video
														style="width: 80%; height: 480px; margin-top: 0%; background-color:transparent; "
														id="myVideo" :src="item.output[0]" controls></video>
												</view>
											</view>
										</view>
										<view v-if="judgeContent(item.output[0]) == 3">
											<view style="margin-left:10% ;margin-right: 10%;margin-top: 0%;">
												<scroll-view scroll-y="true" class="scroll-Y">
													<view style="text-align: center;">
														<image
															style="width: 200px; height: 300px; background-color: #eeeeee;"
															mode="scaleToFill"
															:src="item?.params?.image_path_origin || loadingBackground">
														</image>
													</view>
													<fui-parse-group class="custom-view" :thBgcolor="false">
														<fui-parse :nodes="item.output[0]" language="html"></fui-parse>
													</fui-parse-group>
												</scroll-view>
												<fui-fab :position="isLeft ? 'left' : 'right'" :fabs="fabs"
													@click="handleClick($event, item.output[0])"></fui-fab>
											</view>

										</view>

									</view>
								</swiper-item>

							</swiper>
							<!-- </fui-swiper-dot> -->
							<!-- --------------------------------------------------------------------------------------------- -->
						</view>
						<view>
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
								<view class="tn-text-sm tn-text-center tn-white_text">
									视频生成时间较长，稍后可到
								</view>
								<view class="tn-text-sm tn-text-center tn-white_text">
									“绘图历史”中查询
								</view>
							</view>
						</view>
						<!--显示图片数量-->

						<view class="image-count">
							<TnIcon style="color: gainsboro;" name="image"></TnIcon>
							<span style="color: gainsboro;margin-left: 3rpx;"
								class="tn-text-sm">{{ currentImageCount }}</span>
						</view>

					</view>


				</view>



			</view>
			<!--      底部按钮-->
			<view>


			</view>
			<view class="bottom-container">
				<view style="display: flex; ">
					<view class="bottom-icon">
						<tn-icon name="download-simple" size="50rpx"></tn-icon>

					</view>
					<!-- <view class="bottom-icon">
						<tn-icon name="send" size="50rpx"></tn-icon>

					</view> -->

					<view class="bottom-icon">
						<tn-icon name="right-arrow" size="50rpx" @click="handleGotoHistory"></tn-icon>
					</view>
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

	<canvas style="position: absolute; left: -9999rpx; top: -9999rpx;" canvas-id="posterCanvas"
		:style="{ width: '750rpx', height: '1334rpx' }"></canvas>

</template>

<style scoped lang="scss">
.fui-banner__item {
	width: 100%;
	height: 1400rpx;
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
	font-weight: 600;
}

.fui-banner__wrap {
	z-index: 110;
	height: 1500rpx;
}

// -------------------------------
.CardStyle {
	margin-top: 20%;
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
	z-index: 110;
	position: absolute;
	top: 35%;
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