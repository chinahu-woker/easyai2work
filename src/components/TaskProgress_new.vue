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

const simpleLinkRegex = /^(?:https?:\/\/|\/\/)[^\s]+$/i;

function checkContent(str: any) {
	if (typeof str !== 'string') {
		return 2;
	}

	const trimmed = str.trim();
	if (!trimmed) {
		return 2;
	}

	if (trimmed.startsWith('data:image') || trimmed.startsWith('blob:')) {
		return 1;
	}

	const canUseURL = typeof URL === 'function';

	if (canUseURL) {
		try {
			new URL(trimmed);
			return 1;
		} catch (_err) {
			// ignore and try decoded string
		}
		try {
			const decoded = decodeURIComponent(trimmed);
			new URL(decoded);
			return 1;
		} catch (_err) {
			// fall through
		}
	}

	return simpleLinkRegex.test(trimmed) ? 1 : 2;
}
function judgeContent(input: any) {
	// 定义图片链接的正则表达式
	const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
	// 定义视频链接的正则表达式
	const videoRegex = /\.(mp4|avi|mov|mkv|flv|wmv|webm)$/i;

	const normalized = (() => {
		if (typeof input !== 'string') {
			return '';
		}
		try {
			return decodeURIComponent(input);
		} catch (err) {
			return input;
		}
	})();

	const pathForMatch = normalized.split(/[?#]/)[0];
	const linkType = checkContent(normalized);

	// 检查内容是否为空
	if (!input) {
		console.log('judgeContent - 是空值:', input)
		return 0; // 内容为空
	}
	// 检查内容是否为图片链接
	if (linkType === 1) {
		if (imageRegex.test(pathForMatch)) {
			console.log('judgeContent - 是图片:', input)
			return 1; // 是图片链接
		}
		// 检查内容是否为视频链接
		else if (videoRegex.test(pathForMatch)) {
			console.log('judgeContent - 是视频:', input)
			return 2; // 是视频链接
		}
	}
	// 如果不是图片或视频链接，则认为是文本
	if (linkType !== 1) {
		console.log('judgeContent - 是文本:', input)
		return 3; // 是文本
	}
	console.log('judgeContent - 未知类型，按文本处理:', input)
	return 3;
}

// 获取当前输出的内容类型
const currentContentType = computed(() => {
	if (!currentOutput.value) {
		return 0; // 空内容
	}
	return judgeContent(currentOutput.value);
})

// 当前任务的参数信息
const currentTaskParams = computed<Record<string, unknown>>(() => {
	if (!currentTask.value || !currentTask.value.params) {
		return {};
	}
	return currentTask.value.params as Record<string, unknown>;
})

const currentTaskParamEntries = computed<[string, unknown][]>(() => {
	return Object.entries(currentTaskParams.value ?? {}) as [string, unknown][];
})

const isLongString = (value: unknown): value is string => typeof value === 'string' && value.length > 50;

const getTruncatedValue = (value: unknown): string => {
	if (typeof value === 'string') {
		return `${value.substring(0, 50)}...`;
	}
	return String(value ?? '');
};

const formatParamValue = (value: unknown): string => {
	if (typeof value === 'string') {
		return value;
	}
	if (Array.isArray(value)) {
		return value.join(', ');
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	if (value && typeof value === 'object') {
		try {
			return JSON.stringify(value);
		} catch (_err) {
			return '[object]';
		}
	}
	return '';
};

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
							<view class="reference-image" v-if="currentTaskParams['image_path_origin']">
								<image class="ref-img" mode="aspectFill" :src="String(currentTaskParams['image_path_origin'] || '')" />
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
							<view class="param-item" v-for="([key, value]) in currentTaskParamEntries" :key="key">
								<view class="param-label">{{ key }}</view>
								<view class="param-value">
									<text v-if="isLongString(value)" class="param-text-long">
										{{ getTruncatedValue(value) }}
									</text>
									<text v-else class="param-text">{{ formatParamValue(value) }}</text>
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
	display: flex;
	padding: 20rpx;
	gap: 20rpx;
	overflow: hidden;
}

/* 侧边栏缩略图列表 */
.sidebar-thumbnails {
	width: 160rpx;
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.thumbnail-scroll {
	height: 100%;
	padding: 20rpx;
}

.thumbnail-item {
	position: relative;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	overflow: hidden;
	border: 3rpx solid transparent;
	transition: all 0.3s ease;
	
	&.active {
		border-color: #007AFF;
		transform: scale(1.05);
	}
	
	&:last-child {
		margin-bottom: 0;
	}
}

.thumbnail-img {
	width: 100%;
	height: 120rpx;
	border-radius: 8rpx;
}

.task-status {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.status-success {
	background-color: #4CAF50;
}

.status-processing {
	background-color: rgba(255, 255, 255, 0.9);
}

.status-failed {
	background-color: #F44336;
}

.status-pending {
	background-color: rgba(255, 255, 255, 0.9);
}

.output-count {
	position: absolute;
	bottom: 8rpx;
	right: 8rpx;
	background-color: rgba(0, 0, 0, 0.7);
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
}

.count-text {
	color: #fff;
	font-size: 20rpx;
}

/* 主内容区域 */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	overflow: hidden;
}

/* 输出内容区域 */
.output-section {
	flex: 2;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
}

/* 图片输出样式 */
.image-output {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.output-tabs {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.output-tab {
	width: 80rpx;
	height: 80rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
	
	&.active {
		border-color: #007AFF;
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
	border-radius: 12rpx;
	overflow: hidden;
}

.output-image {
	max-width: 100%;
	max-height: 100%;
	border-radius: 12rpx;
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
	gap: 20rpx;
}

.reference-image {
	width: 200rpx;
	flex-shrink: 0;
}

.ref-img {
	width: 100%;
	height: 280rpx;
	border-radius: 12rpx;
}

.text-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.text-scroll {
	flex: 1;
	background-color: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
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
}

.empty-text {
	display: block;
	margin-top: 24rpx;
	font-size: 28rpx;
	color: #999;
}

/* 参数信息区域 */
.params-section {
	flex: 1;
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.params-header {
	display: flex;
	align-items: center;
	padding: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.params-title {
	margin-left: 12rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.params-scroll {
	flex: 1;
	padding: 20rpx 24rpx;
}

.param-item {
	margin-bottom: 20rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid #f5f5f5;
	
	&:last-child {
		margin-bottom: 0;
		border-bottom: none;
	}
}

.param-label {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
	font-weight: 500;
}

.param-value {
	font-size: 26rpx;
	color: #333;
	line-height: 1.4;
}

.param-text-long {
	color: #555;
}

.param-text {
	word-break: break-all;
}

/* 任务信息 */
.task-info {
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 2rpx solid #f0f0f0;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.info-label {
	font-size: 26rpx;
	color: #666;
	font-weight: 500;
}

.info-value {
	font-size: 26rpx;
	color: #333;
	max-width: 60%;
	text-align: right;
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
	z-index: 1000;
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
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 120rpx;
	height: 120rpx;
	background-color: #007AFF;
	border-radius: 50%;
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

.btn-text {
	font-size: 20rpx;
	color: #fff;
	margin-top: 8rpx;
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
		width: 100rpx;
		height: 100rpx;
	}
}
</style>