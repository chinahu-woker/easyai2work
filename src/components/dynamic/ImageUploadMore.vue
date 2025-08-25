<script setup lang="ts">
import TnImageUpload from "@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.vue";
import type { ImageUploadCustomFunction, ImageUploadFile, TnImageUploadInstance } from "@tuniao/tnui-vue3-uniapp";
import { ref, watch } from "vue";
import { uploadFile } from "@/utils/request.ts";
import MyTitle from "@/components/common/MyTitle.vue";
import ParamCard from "@/components/common/ParamCard.vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
import type { IDynamicOptions } from "@/types";

interface Props {
  title?: string;
  options?: IDynamicOptions;
}

const props = withDefaults(defineProps<Props>(), {
  title: "上传",
});

// 修改为 string[] 类型
const modelValue = defineModel<string[]>({
  default: () => [],
});

// 修改为 string[] 类型
const imageList = ref<string[]>([]);

onReady(() => {
  // 直接赋值
  imageList.value = [...(modelValue.value || [])];
});

watch(imageList, (newVal) => {
  modelValue.value = [...newVal];
}, { deep: true });

const uploadFilePromise: ImageUploadCustomFunction = async (file: ImageUploadFile) => {
  const url = (file as UniApp.ChooseImageSuccessCallbackResultFile).path;
  return new Promise(async (resolve, reject) => {
    try {
      // 上传文件并获取服务器返回的URL
      const uploadResult = await uploadFile<string>(url);
      console.log("uploadResult", uploadResult);
      if (uploadResult) {
        // 仅返回图片URL字符串
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

const imageUploadRef = ref<TnImageUploadInstance>();
const chooseFile = () => {
  imageUploadRef.value?.chooseFile();
};
</script>

<template>
  <ParamCard>
    <template #title>
      <MyTitle :title="title" />
    </template>
    <template #body>
      <TnImageUpload
        ref="imageUploadRef"
        v-model="imageList"
        :limit="6"
        :custom-upload-handler="uploadFilePromise"
        :multiple="true"
        :image-choose-options="{
          count: 6,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        }"
      >
      </TnImageUpload>
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
</style>