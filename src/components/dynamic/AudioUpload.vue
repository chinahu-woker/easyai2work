<script setup lang="ts">
	import { ref, watch, onUnmounted } from "vue";
	import { uploadFile } from "@/utils/request.ts";
	import MyTitle from "@/components/common/MyTitle.vue";
	import ParamCard from "@/components/common/ParamCard.vue";
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import type { IDynamicOptions } from "@/types";
	

	

	interface Props {
		title ?: string;
		options ?: IDynamicOptions;
	}

	const props = withDefaults(defineProps<Props>(), {
		title: "上传",
	});

	const modelValue = defineModel({
		default: "",
	});

	const audioList = ref<string[]>([]);
	const audioSrc = ref<string>("");
	const audioName = ref<string>("默认音频");
	let innerAudioContext : UniApp.InnerAudioContext | null = null;
	const currentTime = ref<number>(0);
	const duration = ref<number>(0);
	const progress = ref<number>(0); // 初始化为 0
	onReady(() => {
		audioList.value = modelValue.value ? [modelValue.value] : [];
	});

	watch(audioList, () => {
		console.log("audioList", audioList.value[0]);
		modelValue.value = audioList.value[0];
		if (audioList.value[0]) {
			audioSrc.value = audioList.value[0];
			audioName.value = audioList.value[0].split('/').pop() || "默认音频";
			initInnerAudioContext();
		}
	});

	const uploadFilePromise = async (file : UniApp.ChooseImageSuccessCallbackResultFile) => {
		const url = file.path;
		return new Promise(async (resolve, reject) => {
			const uploadResult = await uploadFile<string>(url);
			console.log("uploadResult", uploadResult);
			if (uploadResult) {
				resolve(uploadResult);
			}
		});
	};

	const initInnerAudioContext = () => {
		if (innerAudioContext) {
			innerAudioContext.destroy();
		}
		innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = false;
		innerAudioContext.src = audioSrc.value;
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		innerAudioContext.onError((res) => {
			console.log(res.errMsg);
			console.log(res.errCode);
		});
		innerAudioContext.onTimeUpdate(() => {
			currentTime.value = innerAudioContext?.currentTime || 0;
			duration.value = innerAudioContext?.duration || 0;
			progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
		});
	};

	const chooseAudioFile = () => {
		wx.chooseMessageFile({
			count: 1,
			type: 'file',
			extension: ['mp3', 'wav'], // 指定音频文件类型
			success(res) {
				const audioFile = res.tempFiles[0];
				uploadAudioFile(audioFile);
			},
			fail(err) {
				console.error('选择文件失败', err);
			}
		});
	};

	const uploadAudioFile = async (file : UniApp.ChooseImageSuccessCallbackResultFile) => {
		try {
			const uploadResult = await uploadFilePromise(file);
			if (uploadResult) {
				audioSrc.value = uploadResult;
				audioName.value = file.name;
				audioList.value = [uploadResult];
				console.log('上传成功', uploadResult);
			}
		} catch (error) {
			console.error('上传失败', error);
		}
	};
	const buttonShow = ref(false)
	const playAudio = () => {
		if (innerAudioContext) {
			// 确保在播放新音频之前停止当前正在播放的音频
			innerAudioContext.stop();
			innerAudioContext.play();
		}
		buttonShow.value = true
	};

	const pauseAudio = () => {
		if (innerAudioContext) {
			innerAudioContext.pause();
			console.log('暂停播放');
			buttonShow.value = false
		}
	};

	onUnmounted(() => {
		if (innerAudioContext) {
			innerAudioContext.destroy();
		}
	});
	
	
	const formatTime = (time: number): string => {
	  const minutes = Math.floor(time / 60);
	  const seconds = Math.floor(time % 60);
	  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};
</script>

<template>
	<ParamCard>
		<template #title>
			<MyTitle :title="title" />
		</template>
		<template #body>
			<view class='audioCard'>
				<!-- <audio style="width:90%; color: red;" :src="audioSrc" :name="audioName" controls></audio> -->
				<fui-row margin-bottom="24rpx" style="width: 100%; margin-top: 15%; text-align: center;">
					<fui-col :span="3">
						<view style="margin-top: 75%;">
						<fui-icon name="suspend" @click="playAudio" v-show="!buttonShow"></fui-icon>
						<fui-icon name="play" @click="pauseAudio" v-show="buttonShow"></fui-icon>
						</view>
					</fui-col>
					<fui-col :span="21">
						<view style="margin-top: 5%; margin-bottom: 5%; text-align: left;  overflow: hidden; width: 200px;white-space: nowrap; text-overflow: ellipsis;">歌名：{{audioName|| 无}}</view>
					<fui-progress :percent=" progress.toFixed(0) || 0" style="margin-bottom: 24%;"></fui-progress>
					</fui-col>
				</fui-row>
				
				
				<view style="margin-bottom: 10%;"></view>
					<fui-row margin-bottom="24rpx" style="width: 100%;  text-align: right;"> 
						<fui-col :span="24">
							<view style="margin-top: -10%;"><fui-icon name="pullup" @click="chooseAudioFile"></fui-icon></view>
						</fui-col>
					</fui-row>
					
					
					
	
				
			</view>
		</template>
	</ParamCard>
</template>

<style scoped lang="scss">
	.upload-new-btn {
		width: 100%;
		height: 300rpx;
		background-color: #f4f5f6;
		border-radius: 10rpx;
	}

	.audioCard {
		text-align: left;
	}
</style>