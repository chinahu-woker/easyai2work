<script setup lang="ts">
import { ref, watch } from "vue";
import { uploadFile } from "@/utils/request.ts";
import MyTitle from "@/components/common/MyTitle.vue";
import ParamCard from "@/components/common/ParamCard.vue";
import type { IDynamicOptions } from "@/types";

interface Props {
  title?: string;
  options?: IDynamicOptions;
}

const props = withDefaults(defineProps<Props>(), {
  title: "视频上传",
});

const modelValue = defineModel({
  default: "",
});

const videoList = ref<string[]>([]);
const videoSrc = ref<string>("");
const videoName = ref<string>("");

// 初始化时设置默认值
const onReady = () => {
  videoList.value = modelValue.value ? [modelValue.value] : [];
};

// 监听视频列表变化并同步到父组件
watch(videoList, () => {
  modelValue.value = videoList.value[0] || "";
  if (videoList.value[0]) {
    videoSrc.value = videoList.value[0];
    videoName.value = videoList.value[0].split('/').pop() || "默认视频";
  }
});

// 上传文件处理函数
const uploadFilePromise = async (filePath: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadResult = await uploadFile<string>(filePath);
      console.log("uploadResult", uploadResult);
      if (uploadResult) {
        resolve(uploadResult);
      } else {
        reject(new Error('上传失败'));
      }
    } catch (error) {
      console.error('上传错误', error);
      reject(error);
    }
  });
};

// 选择视频文件
const chooseVideoFile = () => {
  uni.chooseVideo({
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
    compressed: true, // 是否压缩所选的视频源文件
    maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒
    success: async (res) => {
      console.log('选择视频成功', res);
      try {
        // 显示上传进度提示
        uni.showLoading({ title: '上传中...' });
        
        // 上传视频文件
        const uploadResult: any = await uploadFilePromise(res.tempFilePath);
        
        // 更新视频列表
        videoList.value = [uploadResult as string];
        
        uni.hideLoading();
        uni.showToast({ title: '上传成功', icon: 'success' });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '上传失败', icon: 'none' });
        console.error('上传失败', error);
      }
    },
    fail: (err) => {
      console.error('选择视频失败', err);
      uni.showToast({ title: '选择视频失败', icon: 'none' });
    }
  });
};
</script>

<template>
  <ParamCard>
    <template #title>
      <MyTitle :title="title" />
    </template>
    <template #body>
      <view class="video-upload-container">
        <view 
          class="video-preview" 
          v-if="videoSrc"
        >
          <video 
            :src="videoSrc" 
            :controls="true" 
            style="width: 100%; height: 200px;"
          ></video>
          <text class="video-name">{{ videoName }}</text>
        </view>
        
        <view 
          v-else
          class="upload-placeholder"
          @click="chooseVideoFile"
        >
          <view class="upload-icon">+</view>
          <text>点击选择视频</text>
        </view>
        
        <button 
          class="upload-button" 
          @click="chooseVideoFile"
        >
          {{ videoSrc ? '重新选择' : '选择视频' }}
        </button>
      </view>
    </template>
  </ParamCard>
</template>

<style scoped lang="scss">
.video-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  
  .video-preview {
    width: 100%;
    margin-bottom: 20rpx;
    
    .video-name {
      display: block;
      margin-top: 10rpx;
      font-size: 28rpx;
      color: #666;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .upload-placeholder {
    width: 100%;
    height: 200px;
    background-color: #f4f5f6;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;
    
    .upload-icon {
      font-size: 100rpx;
      color: #ccc;
      line-height: 1;
      margin-bottom: 10rpx;
    }
    
    text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .upload-button {
    width: 100%;
    background-color: #4338ca;
    color: white;
    border: none;
    border-radius: 10rpx;
    padding: 20rpx;
    font-size: 32rpx;
  }
}
</style>