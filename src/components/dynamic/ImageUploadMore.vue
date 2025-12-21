<script setup lang="ts">
import TnImageUpload from "@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.vue";
import type { ImageUploadCustomFunction, ImageUploadFile, TnImageUploadInstance } from "@tuniao/tnui-vue3-uniapp";
import { ref, watch, computed } from "vue";
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
  options: () => ({}) as IDynamicOptions,
});

// 修改为 string[] | string 类型提示，运行时父组件可能传入 string 或 string[]，
// 我们会检测父端的初始类型并按原样回写以避免类型抖动
const modelValue = defineModel<string[] | string>({
  default: () => [],
});

// 记录父组件传入的初始类型（array or not），以及父端是否传入了多行字符串（多个 URL 以 separator 连接）
// 将在 onReady 时确认或在 modelValue watcher 更新
const parentModelIsArray = ref<boolean>(false);
const parentModelIsMultiline = ref<boolean>(false);

// 修改为 string[] 类型
const imageList = ref<string[]>([]);

// 归一化供 TnImageUpload 使用的 v-model 值，确保始终为 string[]
const tnValue = computed<string[]>({
  get() {
    // 将 imageList 中的不同格式统一为字符串 URL 数组
    return imageList.value.map((it) => {
      if (!it) return '';
      // 支持传入对象 { url } / {path} 或直接字符串
      if (typeof it === 'string') return it;
      try {
        // @ts-ignore
        return it.url || it.path || String(it);
      } catch (e) {
        return String(it);
      }
    }).filter(Boolean);
  },
  set(val: string[]) {
    // 当组件更新时，把数组中的值标准化回 imageList（字符串数组），并移除空/无效项
    imageList.value = Array.isArray(val) ? val.filter(Boolean).map(v => String(v)) : [];
  }
});

onReady(() => {
  // 直接赋值，兼容 modelValue 为 string 或 string[] 的情况
  // derive separator and limit from props.options if provided
  const separator = (props.options && (props.options as any).separator) || '\n';
  const limit = (props.options && (props.options as any).limit) || 6;

  if (Array.isArray(modelValue.value)) {
    parentModelIsArray.value = true;
    parentModelIsMultiline.value = false;
    imageList.value = (modelValue.value as string[]).filter(Boolean).map(v => String(v));
  } else if (modelValue.value && typeof modelValue.value === 'string') {
    const val = modelValue.value as string;
    // 支持自定义 separator（后端传入），以及常见换行符的兜底
    const sepRegex = separator ? new RegExp(separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')) : /(?:\r\n|\r|\n|\u21B5)/;
    // 如果后端传入的 separator 是特殊换行占位符（例如 ↵），允许同时按换行拆分
    const parts = val.split(sepRegex).map(s => s.trim()).filter(Boolean);
    // 兜底：若 parts 只有一项但包含换行符，则再用常见换行符拆分
    if (parts.length === 1 && /(?:\r\n|\r|\n|\u21B5)/.test(val)) {
      const parts2 = val.split(/(?:\r\n|\r|\n|\u21B5)/).map(s => s.trim()).filter(Boolean);
      imageList.value = parts2 as string[];
      parentModelIsMultiline.value = parts2.length > 1;
    } else {
      imageList.value = parts as string[];
      parentModelIsMultiline.value = parts.length > 1;
    }
    parentModelIsArray.value = false;
  } else {
    parentModelIsArray.value = Array.isArray(modelValue.value);
    parentModelIsMultiline.value = false;
    imageList.value = [];
  }
});

watch(imageList, (newVal) => {
  // 过滤空值，避免把空字符串传给子组件造成占位或空白渲染
  const cleaned = Array.isArray(newVal) ? newVal.filter(Boolean).map(v => String(v)) : [];
  // 立即清理本地列表，防止 UI 渲染空格占位
  if (cleaned.length !== imageList.value.length) {
    imageList.value = cleaned;
  }

  // 当本地图片变化时，根据父组件最初传入的类型进行回写，避免将字符串改写为数组导致父组件问题
  // 使用 props.options.separator 优先，其次回退为换行符
  const separator = (props.options && (props.options as any).separator) || '\n';
  if (parentModelIsArray.value) {
    modelValue.value = [...cleaned];
  } else if (parentModelIsMultiline.value) {
    modelValue.value = cleaned.join(separator);
  } else {
    modelValue.value = cleaned.length > 0 ? cleaned[0] : '';
  }
}, { deep: true });

// 监听 modelValue 变化并同步到 imageList，确保外部更新能正确反映到组件内
watch(modelValue, (newVal) => {
  // 更新父端类型标记
  parentModelIsArray.value = Array.isArray(newVal);
  // 如果父端传入字符串，检测是否为多行字符串
  if (!parentModelIsArray.value && typeof newVal === 'string') {
    parentModelIsMultiline.value = /(?:\r\n|\r|\n|\u21B5)/.test(newVal);
  } else {
    parentModelIsMultiline.value = false;
  }

  // 规范成字符串数组并过滤空值
  const newArr = Array.isArray(newVal) ? (newVal as any[]).filter(Boolean).map(v => String(v)) : (newVal ? [String(newVal)] : []);
  // 避免不必要的赋值导致循环更新
  const isSame = newArr.length === imageList.value.length && newArr.every((v, i) => v === imageList.value[i]);
  if (!isSame) {
    imageList.value = newArr;
  }
}, { deep: true, immediate: true });

// 从 props.options 中读取 limit，用于限制上传张数，兜底为 6
const effectiveLimit = computed(() => {
  const l = props.options && (props.options as any).limit;
  const n = Number(l);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 6;
});

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
        v-model="tnValue"
        :limit="effectiveLimit"
        :custom-upload-handler="uploadFilePromise"
        :multiple="true"
        :image-choose-options="{
          count: effectiveLimit,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        }"
      >
        <!-- 自定义上传按钮，确保在没有图片时显示合理的上传按钮 -->
        <template #uploadBtn>
          <view class="custom-upload-btn">
            <view class="upload-icon">
              <text class="upload-text">点击上传图片</text>
            </view>
          </view>
        </template>
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

.custom-upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f8f9fa;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10rpx;
  
  &:hover {
    background-color: #f0f1f3;
    border-color: #7041ed;
  }
}

.upload-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}
</style>