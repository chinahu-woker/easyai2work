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
	uni.navigateTo({ url: '/pages/history/history_fui/history_fui' })
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
			<view class="main-content">
				<!-- 侧边栏缩略图列表 -->
				<view class="sidebar-thumbnails">
					<scroll-view scroll-y="true" class="thumbnail-scroll">
						<view 
							v-for="(task, index) in AllList" 
							:key="task._id || index"
							:class="['thumbnail-item', { 'active': index === currentTaskIndex }]"
							@click="handleTaskChange(index)"
						>
							<image 
								class="thumbnail-img" 
								mode="aspectFill"
								:src="getTaskThumbnail(task)"
							/>
							<!-- 任务状态指示器 -->
							<view class="task-status">
								<view v-if="task.status === 1" class="status-success">
									<TnIcon name="check" size="24" color="#fff" />
								</view>
								<view v-else-if="task.status === 4" class="status-processing">
									<TnIcon name="starry" size="24" color="#007AFF" />
								</view>
								<view v-else-if="task.status === 2" class="status-failed">
									<TnIcon name="close" size="24" color="#fff" />
								</view>
								<view v-else class="status-pending">
									<TnIcon name="clock" size="24" color="#999" />
								</view>
							</view>
							<!-- 多输出数量指示 -->
							<view v-if="task.output && task.output.length > 1" class="output-count">
								<text class="count-text">{{ task.output.length }}</text>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 主内容区域 -->
				<view class="content-area">
					<!-- 输出内容区域 -->
					<view class="output-section">
						<!-- 图片类型 -->
						<view v-if="currentContentType === 1" class="image-output">
							<!-- 多图片切换 -->
							<view v-if="currentTaskOutputs.length > 1" class="output-tabs">
								<view 
									v-for="(output, index) in currentTaskOutputs" 
									:key="index"
									:class="['output-tab', { 'active': index === currentOutputIndex }]"
									@click="handleOutputChange(index)"
								>
									<image class="tab-thumb" mode="aspectFill" :src="output" />
								</view>
							</view>
							<!-- 主图片显示 -->
							<view class="main-image" @click="handlePreview">
								<image class="output-image" mode="aspectFit" :src="currentOutput" />
							</view>
						</view>

						<!-- 视频类型 -->
						<view v-else-if="currentContentType === 2" class="video-output">
							<video class="output-video" :src="currentOutput" controls></video>
						</view>

						<!-- 文本类型 -->
						<view v-else-if="currentContentType === 3" class="text-output">
							<view class="reference-image" v-if="(currentTaskParams as any).image_path_origin">
								<image class="ref-img" mode="aspectFill" :src="(currentTaskParams as any).image_path_origin" />
							</view>
							<view class="text-content">
								<scroll-view scroll-y="true" class="text-scroll">
									<fui-parse-group class="custom-view" :thBgcolor="false">
										<fui-parse :nodes="currentOutput" language="html"></fui-parse>
									</fui-parse-group>
								</scroll-view>
							</view>
							<!-- 文本复制功能 -->
							<fui-fab :position="isLeft ? 'left' : 'right'" :fabs="fabs"
								@click="handleClick($event, currentOutput)"></fui-fab>
						</view>

						<!-- 空状态或加载中 -->
						<view v-else class="empty-output">
							<view class="empty-content">
								<TnIcon name="image" size="80" color="#ccc" />
								<text class="empty-text">正在生成中...</text>
							</view>
						</view>
					</view>

					<!-- 参数信息区域 -->
					<view class="params-section">
						<view class="params-header">
							<TnIcon name="setting" size="32" color="#666" />
							<text class="params-title">生成参数</text>
						</view>
						<scroll-view scroll-y="true" class="params-scroll">
							<view class="param-item" v-for="(value, key) in currentTaskParams" :key="key">
								<view class="param-label">{{ key }}</view>
								<view class="param-value">
									<text v-if="typeof value === 'string' && (value as string).length > 50" class="param-text-long">
										{{ (value as string).substring(0, 50) }}...
									</text>
									<text v-else class="param-text">{{ value }}</text>
								</view>
							</view>
							<!-- 任务信息 -->
							<view class="task-info" v-if="currentTask">
								<view class="info-item">
									<text class="info-label">生成时间</text>
									<text class="info-value">{{ formatTime(currentTask.created_at || '') }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">工作流</text>
									<text class="info-value">{{ currentTask.options?.workflow_title || '未知' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">状态</text>
									<text class="info-value">
										{{ 
											currentTask.status === 1 ? '完成' : 
											currentTask.status === 4 ? '进行中' : 
											currentTask.status === 2 ? '失败' : '等待中' 
										}}
									</text>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
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
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<view class="action-buttons">
				<view class="action-btn" @click="handleSave">
					<tn-icon name="download-simple" size="50rpx"></tn-icon>
					<text class="btn-text">保存</text>
				</view>
				<view class="action-btn" @click="handlePreview">
					<tn-icon name="eye" size="50rpx"></tn-icon>
					<text class="btn-text">预览</text>
				</view>
				<view class="action-btn" @click="handleGotoHistory">
					<tn-icon name="right-arrow" size="50rpx"></tn-icon>
					<text class="btn-text">历史</text>
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
	display: flex;
	flex-direction: column;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(102, 126, 234, 0.1) 0%, 
			rgba(118, 75, 162, 0.1) 50%, 
			rgba(255, 154, 158, 0.1) 100%);
		backdrop-filter: blur(10px);
		z-index: 0;
	}
}

/* 安全区域 */
.safe-area-top {
	height: env(safe-area-inset-top, 44px);
	min-height: 44px;
	position: relative;
	z-index: 1;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	display: flex;
	padding: 20rpx;
	gap: 20rpx;
	overflow: hidden;
	position: relative;
	z-index: 1;
}

/* 侧边栏缩略图列表 */
.sidebar-thumbnails {
	width: 160rpx;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(25px);
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	-webkit-backdrop-filter: blur(25px);
}

.thumbnail-scroll {
	height: 100%;
	padding: 24rpx 16rpx;
}

.thumbnail-item {
	position: relative;
	margin-bottom: 24rpx;
	border-radius: 16rpx;
	overflow: hidden;
	border: 3rpx solid transparent;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	
	&.active {
		border-color: #007AFF;
		transform: scale(1.08) translateY(-4rpx);
		box-shadow: 0 12rpx 28rpx rgba(0, 122, 255, 0.3);
		background: rgba(255, 255, 255, 0.4);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	&:last-child {
		margin-bottom: 0;
	}
	
	&:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}
}

.thumbnail-img {
	width: 100%;
	height: 120rpx;
	border-radius: 12rpx;
}

.task-status {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(10px);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.status-success {
	background: linear-gradient(135deg, #4CAF50, #45a049);
	box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.status-processing {
	background: linear-gradient(135deg, rgba(0, 122, 255, 0.9), rgba(0, 100, 200, 0.9));
	box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.status-failed {
	background: linear-gradient(135deg, #F44336, #d32f2f);
	box-shadow: 0 4rpx 12rpx rgba(244, 67, 54, 0.3);
}

.status-pending {
	background: linear-gradient(135deg, rgba(153, 153, 153, 0.9), rgba(119, 119, 119, 0.9));
	box-shadow: 0 4rpx 12rpx rgba(153, 153, 153, 0.3);
}

.output-count {
	position: absolute;
	bottom: 8rpx;
	right: 8rpx;
	background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
	padding: 6rpx 12rpx;
	border-radius: 16rpx;
	backdrop-filter: blur(10px);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.count-text {
	color: #fff;
	font-size: 22rpx;
	font-weight: 600;
}

/* 主内容区域 */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	overflow: hidden;
}

/* 输出内容区域 */
.output-section {
	flex: 2;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(25px);
	-webkit-backdrop-filter: blur(25px);
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	overflow: hidden;
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.1) 0%, 
			rgba(255, 255, 255, 0.05) 50%, 
			rgba(255, 255, 255, 0.1) 100%);
		pointer-events: none;
		z-index: 0;
	}
	
	> * {
		position: relative;
		z-index: 1;
	}
}

/* 图片输出样式 */
.image-output {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.output-tabs {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
	padding-bottom: 24rpx;
	border-bottom: 2rpx solid rgba(240, 240, 240, 0.5);
}

.output-tab {
	width: 88rpx;
	height: 88rpx;
	border-radius: 12rpx;
	overflow: hidden;
	border: 3rpx solid transparent;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	
	&.active {
		border-color: #007AFF;
		transform: scale(1.1);
		box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.3);
	}
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.1) 0%, 
			rgba(255, 255, 255, 0) 100%);
		pointer-events: none;
	}
}

.tab-thumb {
	width: 100%;
	height: 100%;
}

.main-image {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	overflow: hidden;
	background: linear-gradient(135deg, #f8f9fa, #e9ecef);
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.2) 0%, 
			rgba(255, 255, 255, 0) 50%, 
			rgba(255, 255, 255, 0.1) 100%);
		pointer-events: none;
	}
}

.output-image {
	max-width: 100%;
	max-height: 100%;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	transition: transform 0.3s ease;
	
	&:hover {
		transform: scale(1.02);
	}
}

/* 视频输出样式 */
.video-output {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.output-video {
	width: 100%;
	max-height: 100%;
	border-radius: 12rpx;
}

/* 文本输出样式 */
.text-output {
	height: 100%;
	display: flex;
	gap: 24rpx;
}

.reference-image {
	width: 200rpx;
	flex-shrink: 0;
}

.ref-img {
	width: 100%;
	height: 280rpx;
	border-radius: 16rpx;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
	
	&:hover {
		transform: scale(1.03);
	}
}

.text-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.text-scroll {
	flex: 1;
	background: linear-gradient(135deg, 
		rgba(248, 249, 250, 0.2), 
		rgba(255, 255, 255, 0.15));
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(255, 255, 255, 0.4);
}

/* 空状态样式 */
.empty-output {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.empty-content {
	text-align: center;
	padding: 40rpx;
	border-radius: 16rpx;
	background: linear-gradient(135deg, 
		rgba(255, 255, 255, 0.2), 
		rgba(248, 249, 250, 0.15));
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid rgba(255, 255, 255, 0.4);
}

.empty-text {
	display: block;
	margin-top: 28rpx;
	font-size: 30rpx;
	font-weight: 500;
	color: #666;
	background: linear-gradient(135deg, #666, #999);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

/* 参数信息区域 */
.params-section {
	flex: 1;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(25px);
	-webkit-backdrop-filter: blur(25px);
	border-radius: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.1) 0%, 
			rgba(255, 255, 255, 0.05) 50%, 
			rgba(255, 255, 255, 0.1) 100%);
		pointer-events: none;
		z-index: 0;
	}
	
	> * {
		position: relative;
		z-index: 1;
	}
}

.params-header {
	display: flex;
	align-items: center;
	padding: 28rpx 32rpx;
	border-bottom: 2rpx solid rgba(240, 240, 240, 0.5);
	background: linear-gradient(90deg, 
		rgba(255, 255, 255, 0.1), 
		rgba(255, 255, 255, 0.05));
}

.params-title {
	margin-left: 16rpx;
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
	background: linear-gradient(135deg, #333, #666);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.params-scroll {
	flex: 1;
	padding: 24rpx 32rpx;
}

.param-item {
	margin-bottom: 24rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, 
		rgba(255, 255, 255, 0.2), 
		rgba(248, 249, 250, 0.15));
	border-radius: 16rpx;
	border: 1rpx solid rgba(255, 255, 255, 0.4);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	transition: all 0.3s ease;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	&:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
	}
}

.param-label {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5rpx;
}

.param-value {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
	font-weight: 500;
}

.param-text-long {
	color: #555;
}

.param-text {
	word-break: break-all;
}

/* 任务信息 */
.task-info {
	margin-top: 32rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, 
		rgba(0, 122, 255, 0.1), 
		rgba(0, 122, 255, 0.05));
	border-radius: 16rpx;
	border: 1rpx solid rgba(0, 122, 255, 0.2);
	backdrop-filter: blur(10px);
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid rgba(0, 122, 255, 0.1);
	
	&:last-child {
		margin-bottom: 0;
		border-bottom: none;
	}
}

.info-label {
	font-size: 28rpx;
	color: #007AFF;
	font-weight: 600;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	max-width: 60%;
	text-align: right;
	font-weight: 500;
}

/* 进度覆盖层 */
.progress-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: linear-gradient(135deg, 
		rgba(255, 255, 255, 0.2), 
		rgba(255, 255, 255, 0.15));
	border-radius: 28rpx;
	padding: 80rpx 60rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.25);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 2rpx solid rgba(255, 255, 255, 0.4);
	z-index: 1000;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(0, 122, 255, 0.1) 0%, 
			rgba(0, 122, 255, 0.05) 50%, 
			rgba(0, 122, 255, 0.1) 100%);
		border-radius: 28rpx;
		pointer-events: none;
	}
}

.progress-content {
	text-align: center;
	position: relative;
	z-index: 1;
}

.progress-icon {
	margin-bottom: 32rpx;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% { transform: scale(1); opacity: 1; }
	50% { transform: scale(1.1); opacity: 0.8; }
	100% { transform: scale(1); opacity: 1; }
}

.progress-text {
	font-size: 36rpx;
	font-weight: 700;
	background: linear-gradient(135deg, #007AFF, #0056CC);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 20rpx;
}

.progress-tip {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
	font-weight: 500;
	line-height: 1.4;
}

/* 底部操作按钮 */
.bottom-actions {
	padding: 40rpx 40rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0px));
	background: linear-gradient(135deg, 
		rgba(255, 255, 255, 0.15), 
		rgba(255, 255, 255, 0.1));
	backdrop-filter: blur(25px);
	-webkit-backdrop-filter: blur(25px);
	border-top: 2rpx solid rgba(255, 255, 255, 0.4);
	position: relative;
	z-index: 1;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(0, 122, 255, 0.05) 0%, 
			rgba(0, 122, 255, 0.02) 50%, 
			rgba(0, 122, 255, 0.05) 100%);
		pointer-events: none;
	}
}

.action-buttons {
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: relative;
	z-index: 1;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 140rpx;
	height: 140rpx;
	background: linear-gradient(135deg, #007AFF, #0056CC);
	border-radius: 50%;
	color: #fff;
	box-shadow: 0 12rpx 32rpx rgba(0, 122, 255, 0.4);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	border: 3rpx solid rgba(255, 255, 255, 0.3);
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.2), 
			rgba(255, 255, 255, 0.1));
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	
	&:hover::before {
		opacity: 1;
	}
}

.action-btn:active {
	transform: scale(0.92) translateY(4rpx);
	box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.5);
}

.btn-text {
	font-size: 22rpx;
	color: #fff;
	margin-top: 12rpx;
	font-weight: 600;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.action-btn::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	transform: scale(0);
	opacity: 0;
	transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
}

.action-btn:active::before {
	transform: scale(4);
	opacity: 1;
}

/* 兼容性样式 */
.custom-view {
	padding: 24rpx;
	color: #333;
	font-size: 30rpx;
	line-height: 1.7;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 12rpx;
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
}

/* 响应式适配 */
@media screen and (max-width: 400rpx) {
	.main-content {
		padding: 16rpx;
		gap: 16rpx;
	}

	.sidebar-thumbnails {
		width: 120rpx;
	}

	.thumbnail-scroll {
		padding: 16rpx;
	}

	.output-section,
	.params-section {
		padding: 20rpx;
	}

	.action-btn {
		width: 110rpx;
		height: 110rpx;
	}
	
	.btn-text {
		font-size: 20rpx;
	}
}

/* 动画增强 */
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(20rpx); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
	from { opacity: 0; transform: translateX(-30rpx); }
	to { opacity: 1; transform: translateX(0); }
}

.thumbnail-item {
	animation: slideInLeft 0.6s ease forwards;
}

.param-item {
	animation: fadeIn 0.8s ease forwards;
}

.param-item:nth-child(even) {
	animation-delay: 0.1s;
}

.param-item:nth-child(odd) {
	animation-delay: 0.2s;
}
</style>