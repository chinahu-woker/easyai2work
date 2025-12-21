<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { onLoad, onReady } from "@dcloudio/uni-app";
import MyPopup from "@/components/common/MyPopup.vue";
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore.ts";
import { onShow } from "@dcloudio/uni-app";

// 当前选中的任务索引
const currentTaskIndex = ref(0)
// 当前选中任务内的输出索引（用于多图片/视频切换）
const currentOutputIndex = ref(0)

const loadingBackground = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/onloading_bg.jpg'
const { localTasks } = storeToRefs(useAppStore())

// 监听任务切换
watch(currentTaskIndex, () => {
	console.log('currentTaskIndex', currentTaskIndex.value)
	currentOutputIndex.value = 0 // 切换任务时重置输出索引
	const currentTask = localTasks.value[currentTaskIndex.value]
	console.log('currentTask:', currentTask)
	if (currentTask && currentTask.output) {
		console.log('currentTask.output:', currentTask.output)
	}
})

const AllList = computed(() => {
	return localTasks.value || []
})
// 当前任务
const currentTask = computed(() => {
	if (!localTasks.value || localTasks.value.length === 0) {
		return null;
	}
	return localTasks.value[currentTaskIndex.value] || null;
})

// 当前任务的输出列表
const currentTaskOutputs = computed(() => {
	if (!currentTask.value || !Array.isArray(currentTask.value.output)) {
		return [];
	}
	return currentTask.value.output;
})

// 当前选中的输出内容
const currentOutput = computed(() => {
	if (currentTaskOutputs.value.length === 0) {
		return '';
	}
	return currentTaskOutputs.value[currentOutputIndex.value] || currentTaskOutputs.value[0] || '';
})

// 获取任务的缩略图
const getTaskThumbnail = (task: any) => {
	if (task && task.status === 1 && Array.isArray(task.output) && task.output.length > 0) {
		return task.output[0];
	}
	return loadingBackground;
}

// 当前任务的进度
const currentProgress = computed(() => {
	if (!currentTask.value) {
		return '暂无任务';
	}
	if (currentTask.value.status === 4 && typeof currentTask.value.progress !== 'undefined') {
		return (currentTask.value.progress ?? 0) + '%';
	} else if (currentTask.value.status === 0 && typeof currentTask.value.queue !== 'undefined') {
		return `队列:${currentTask.value.queue},预计:${currentTask.value.time_remained ?? '-'}s`;
	}
	return '';
})

// 当前任务是否正在进行中
const showProgress = computed(() => {
	return currentTask.value && currentTask.value.status !== 1;
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

// 切换任务
const handleTaskChange = (index: number) => {
	currentTaskIndex.value = index;
	currentOutputIndex.value = 0; // 重置输出索引
}

// 切换输出内容
const handleOutputChange = (index: number) => {
	currentOutputIndex.value = index;
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
		currentTaskIndex.value = excIndex
	}
})

function checkContent(str: any) {
	// 使用正则表达式判断是否是链接
	const linkRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
	if (linkRegex.test(str)) {
		return 1; // 是链接
	} else {
		return 2; // 是文本
	}
}
function judgeContent(input: any) {
	// 定义图片链接的正则表达式
	const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;
	// 定义视频链接的正则表达式
	const videoRegex = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;

	// 检查内容是否为空
	if (!input) {
		console.log('judgeContent - 是空值:', input)
		return 0; // 内容为空
	}
	// 检查内容是否为图片链接
	if (checkContent(input) == 1) {
		if (imageRegex.test(input)) {
			console.log('judgeContent - 是图片:', input)
			return 1; // 是图片链接
		}
		// 检查内容是否为视频链接
		else if (videoRegex.test(input)) {
			console.log('judgeContent - 是视频:', input)
			return 2; // 是视频链接
		}
	}
	// 如果不是图片或视频链接，则认为是文本
	if (checkContent(input) == 2) {
		console.log('judgeContent - 是文本:', input)
		return 3; // 是文本
	}
	console.log('judgeContent - 未知类型:', input)
	return 0;
}

// 获取当前输出的内容类型
const currentContentType = computed(() => {
	if (!currentOutput.value) {
		return 0; // 空内容
	}
	return judgeContent(currentOutput.value);
})

// 当前任务的参数信息
const currentTaskParams = computed(() => {
	if (!currentTask.value || !currentTask.value.params) {
		return {};
	}
	return currentTask.value.params;
})


/*保存到相册*/
const handleSave = () => {
	if (currentTask.value && currentTask.value.status === 1 && currentOutput.value) {
		saveImage(currentOutput.value);
	}
}

const handleGotoHistory = () => {
	uni.navigateTo({ url: '/pagesHistorySub/history_fui/history_fui' })
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
	if (currentTask.value && currentTask.value.status === 1 && currentTaskOutputs.value.length > 0) {
		console.log("preview")
		uni.previewImage({ urls: currentTaskOutputs.value })
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
function handleClick(e: any, StringTxt: any) {
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
		uni.showToast({
			title: "还在开发中...",
			icon: 'none'
		});

	}

}
const isLeft = true
const current = ref(0)


console.log("--------****************------------", AllList.value)

// 格式化时间函数
const formatTime = (timestamp: string | number) => {
	if (!timestamp) return '未知时间';
	const date = new Date(timestamp);
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
}

// ===================================新增分享功能========================================

</script>

<template>
	
	<MyPopup v-model="showPopup">
		
		<view class="task-progress-container">
			<!-- 安全区域顶部间距 -->
			<view class="safe-area-top"></view>

			<!-- 主内容区域 -->
			<view class="main-content" @touchend="handleTouchEnd" @touchstart="handleTouchStart">
				<!-- 任务列表轮播 -->
				<swiper class="task-swiper" @change="change" circular :indicator-dots="false" :autoplay="true"
					:interval="10000" :duration="150">
					<swiper-item v-for="(item, index) in AllList" :key="index">
						<view class="task-item">
							<!-- 图片类型 -->
							<view v-if="item && Array.isArray(item.output) && item.output.length > 0 && judgeContent(item.output[0]) == 1" class="content-wrapper">
								<view class="image-container">
									<up-swiper @click="handlePreview" @change="handleChange"
										:current="currentSwiperIndex" :list="swiperData" previousMargin="20"
										nextMargin="20" imgMode="aspectFill" height="400" indicator indicatorMode="line"
										circular :autoplay="false" radius="16" keyName="url" indicatorStyle="bottom">
									</up-swiper>
								</view>

								<!-- 生成信息卡片 -->
								<view class="info-card">
									<view class="info-header">
										<view class="info-title">生成信息</view>
									</view>

									<view class="param-section">
										<view class="param-label">
											<TnIcon name="starry" size="32" color="#666" />
											<text class="label-text">描述词</text>
										</view>
										<view class="param-content">
											{{ item.params.positive || '暂无描述' }}
										</view>
									</view>

									<view class="param-section">
										<view class="param-label">
											<text class="label-text">负面描述词</text>
										</view>
										<view class="param-content">
											{{ item.params.negative || '/' }}
										</view>
									</view>

									
								</view>
							</view>

							<!-- 视频类型 -->
							<view v-else-if="item && Array.isArray(item.output) && item.output.length > 0 && judgeContent(item.output[0]) == 2" class="content-wrapper">
								<view class="video-container">
									<video class="video-player" :src="item.output[0]" controls></video>
								</view>

								<!-- 生成信息卡片 -->
								<view class="info-card">
									<view class="info-header">
										<view class="info-title">生成信息</view>
									</view>

									<view class="param-section">
										<view class="param-label">
											<TnIcon name="starry" size="32" color="#666" />
											<text class="label-text">描述词</text>
										</view>
										<view class="param-content">
											{{ item.params.positive || '暂无描述' }}
										</view>
									</view>

									<view class="info-details">
										<view class="detail-item">
											<text class="detail-label">类型</text>
											<text class="detail-value">视频生成</text>
										</view>
										<view class="detail-item">
											<text class="detail-label">生成时间</text>
											<text class="detail-value">{{ formatTime(item.created_at) }}</text>
										</view>
									</view>
								</view>
							</view>

							<!-- 文本类型 -->
							<view v-else-if="item && Array.isArray(item.output) && item.output.length > 0 && judgeContent(item.output[0]) == 3" class="content-wrapper">
								<view class="text-container">
									<view class="reference-image">
										<image class="ref-img" mode="aspectFill"
											:src="item?.params?.image_path_origin || loadingBackground">
										</image>
									</view>

									<view class="text-content">
										<scroll-view scroll-y="true" class="text-scroll">
											<fui-parse-group class="custom-view" :thBgcolor="false">
												<fui-parse :nodes="item.output[0]" language="html"></fui-parse>
											</fui-parse-group>
										</scroll-view>
									</view>
								</view>

								<!-- 生成信息卡片 -->
								<view class="info-card">
									<view class="info-header">
										<view class="info-title">生成信息</view>
									</view>

									<view class="info-details">
										<view class="detail-item">
											<text class="detail-label">类型</text>
											<text class="detail-value">文本生成</text>
										</view>
										<view class="detail-item">
											<text class="detail-label">生成时间</text>
											<text class="detail-value">{{ formatTime(item.created_at) }}</text>
										</view>
									</view>
								</view>

								<fui-fab :position="isLeft ? 'left' : 'right'" :fabs="fabs"
									@click="handleClick($event, item.output[0])"></fui-fab>
							</view>

							<!-- 空状态或加载中 -->
							<view v-else class="empty-state">
								<view class="empty-content">
									<TnIcon name="image" size="80" color="#ccc" />
									<text class="empty-text">正在生成中...</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- </fui-swiper-dot> -->
				<!-- --------------------------------------------------------------------------------------------- -->
				</view>

			<!-- 进度覆盖层 -->
			<view class="progress-overlay" v-if="showProgress" :animation="progressAnimation">
				<view class="progress-content">
					<view class="progress-icon">
						<TnIcon name="starry" size="80" color="#007AFF" />
					</view>
					<view class="progress-text">
						{{ currentProgress }}
					</view>
					<view class="progress-tip">
						关闭页面不影响生成结果
					</view>
					<view class="progress-tip">
						视频生成时间较长，稍后可到"绘图历史"中查询
					</view>
				</view>
			</view>

			<!-- 图片计数 -->
			<view class="image-count" v-if="currentImageCount > 0">
				<TnIcon name="image" size="28" color="#999"></TnIcon>
				<text class="count-text">{{ currentImageCount }}</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<view class="action-buttons">
				<view class="action-btn" @click="handleSave">
					<tn-icon name="download-simple" size="50rpx"></tn-icon>
				</view>
				<view class="action-btn" @click="handleGotoHistory">
					<tn-icon name="right-arrow" size="50rpx"></tn-icon>
				</view>
			</view>
		</view>
	
	</MyPopup>

	<canvas style="position: absolute; left: -9999rpx; top: -9999rpx;" canvas-id="posterCanvas"
		:style="{ width: '750rpx', height: '1334rpx' }"></canvas>
</template>

<style scoped lang="scss">
/* 主容器 */
.task-progress-container {
	height: 100vh;
	background-color: #f8f9fa;
	display: flex;
	flex-direction: column;
}

/* 安全区域 */
.safe-area-top {
	height: env(safe-area-inset-top, 44px);
	min-height: 44px;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	padding: 40rpx;
	position: relative;
	overflow: hidden;
}

/* 任务轮播 */
.task-swiper {
	height: 100%;
}

.task-item {
	display: flex;
	flex-direction: column;
	height: 100%;
}

/* 内容包装器 */
.content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
}

/* 图片容器 */
.image-container {
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 32rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

/* 视频容器 */
.video-container {
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 32rpx;
	background-color: #fff;
	padding: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.video-player {
	width: 100%;
	height: 400rpx;
	border-radius: 12rpx;
}

/* 文本容器 */
.text-container {
	display: flex;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.reference-image {
	flex-shrink: 0;
}

.ref-img {
	width: 200rpx;
	height: 280rpx;
	border-radius: 12rpx;
	background-color: #f0f0f0;
}

.text-content {
	flex: 1;
}

.text-scroll {
	height: 280rpx;
	background-color: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 信息卡片 */
.info-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	margin-top: auto;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.info-header {
	margin-bottom: 24rpx;
}

.info-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1a1a1a;
}

/* 参数部分 */
.param-section {
	margin-bottom: 24rpx;
}

.param-label {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.label-text {
	margin-left: 12rpx;
	font-size: 28rpx;
	color: #666;
	font-weight: 500;
}

.param-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	padding: 16rpx 20rpx;
	background-color: #f8f9fa;
	border-radius: 12rpx;
	border-left: 4rpx solid #007AFF;
}

/* 详情信息 */
.info-details {
	border-top: 1rpx solid #f0f0f0;
	padding-top: 24rpx;
}

.detail-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.detail-item:last-child {
	margin-bottom: 0;
}

.detail-label {
	font-size: 28rpx;
	color: #666;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 进度覆盖层 */
.progress-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
	backdrop-filter: blur(10px);
}

.progress-content {
	text-align: center;
}

.progress-icon {
	margin-bottom: 24rpx;
}

.progress-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #007AFF;
	margin-bottom: 16rpx;
}

.progress-tip {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

/* 图片计数 */
.image-count {
	position: absolute;
	bottom: 140rpx;
	right: 40rpx;
	display: flex;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.6);
	padding: 12rpx 20rpx;
	border-radius: 20rpx;
	backdrop-filter: blur(10px);
}

.count-text {
	margin-left: 8rpx;
	font-size: 24rpx;
	color: #fff;
}

/* 底部操作按钮 */
.bottom-actions {
	padding: 32rpx 40rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom, 0px));
	background-color: #fff;
	border-top: 1rpx solid #f0f0f0;
}

.action-buttons {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.action-btn {
	width: 120rpx;
	height: 120rpx;
	background-color: #007AFF;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	box-shadow: 0 6rpx 20rpx rgba(0, 122, 255, 0.3);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.action-btn:active {
	transform: scale(0.95);
	box-shadow: 0 3rpx 10rpx rgba(0, 122, 255, 0.4);
}

.action-btn::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	transform: scale(0);
	opacity: 0;
	transition: transform 0.6s, opacity 0.6s;
}

.action-btn:active::before {
	transform: scale(4);
	opacity: 1;
}

/* 兼容性样式 */
.custom-view {
	padding: 20rpx;
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
}

/* 空状态样式 */
.empty-state {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400rpx;
}

.empty-content {
	text-align: center;
}

.empty-text {
	display: block;
	margin-top: 24rpx;
	font-size: 28rpx;
	color: #999;
}

/* 响应式适配 */
@media screen and (max-width: 400rpx) {
	.main-content {
		padding: 20rpx;
	}

	.info-card {
		padding: 24rpx;
	}

	.action-btn {
		width: 100rpx;
		height: 100rpx;
	}
}
</style>