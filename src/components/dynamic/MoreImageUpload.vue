<template>
  <view class="image-editor-container">
    <!-- 显示标题 -->
    <MyTitle :title="title"></MyTitle>
    
    <!-- 点击触发选择图片 -->
    <view class="frosted-glass-container" v-if="!imageList_mask || imageList_mask.length === 0" @click="onClick">
	    <!-- 无图片时显示占位符 -->
	    <view class="icon-area">
	      <view class="circle"></view>
	      <view class="ring"></view>
	    </view>
	    <view class="rect rect-1"></view>
	    <view class="rect rect-2"></view>
	  </view>
    
    <view v-else-if="imageList_mask && imageList_mask.length > 0" class="edit-trigger" @click="onClick">
      <!-- 有图时渲染已上传图片 -->
      <view class="uploaded-list">
        <view class="image-grid">
          <view 
            v-for="(image, index) in previewImages" 
            :key="index"
            class="image-item"
          >
            <view class="image-label">
              <text>{{ index === 0 ? '遮罩' : '原图' }}</text>
              <text v-if="imageSize(image)" class="image-size">{{ imageSize(image) }}</text>
            </view>
            <image
              :src="image"
              class="uploaded-img"
              mode="aspectFill"
              @load="onImageLoad"
              @error="onImageError"
            />
          </view>
        </view>
        <view class="edit-hint">点击重新编辑</view>
      </view>
    </view>

    <!-- 图片编辑弹窗，v-show 控制显隐 -->
    <view v-if="show" class="editor-wrapper">
      <fui-backdrop :show="show" closable @click="zehzhao">
        <chj-imgEdit 
        :key="imagePath" 
          :isAllCanvas="false" 
          :image-path="imagePath" 
          ref="chjImgEditRef"
          @getLineLength="getLineLength" 
          @getRectPosition="getRectPosition" 
          @confirm="confirm"
          @cancel="cancel" 
        />
      </fui-backdrop>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed, inject, type Ref } from 'vue';
import chjImgEdit from "@/components/chj-imgEdit/chj-imgEdit.vue";
import MyTitle from "@/components/common/MyTitle.vue";
import type {ImageUploadCustomFunction, ImageUploadFile,TnImageUploadInstance} from "@tuniao/tnui-vue3-uniapp";
import { uploadFile} from "@/utils/request.ts";
import type { IDynamicOptions } from "@/types";
// 自定义事件

// 状态管理
const show = ref(false);
const imagePath = ref('');
const chjImgEditRef = ref<any>(null);
const isComponentReady = ref(false); 
      // 存储已上传图片，改用数组更通用
const placeholderImg = ref('/static/placeholder.png'); // 无图占位图，需自行放置资源
const ediIcon = '/static/graffiti.png';
const modelValue = defineModel<string>({ default: '' })
const bindParam = inject<Ref<Record<string, any>> | undefined>('bindParam');
interface Props{
  title?:string;
  workflow_id:string
  options?:IDynamicOptions
};
const props = withDefaults(defineProps<Props>(),{
  title:'遮罩绘制',
})
const maskValue = computed(() => {
  const mask = bindParam?.value?.advance_onlineEdit_mask;
  return typeof mask === 'string' ? mask : '';
});

const updatePreview = (origin: string, mask: string) => {
  console.log('=== updatePreview 详细调试 ===');
  console.log('origin 参数:', origin, '类型:', typeof origin);
  console.log('mask 参数:', mask, '类型:', typeof mask);
  const list: string[] = [];
  if (mask) {
    console.log('✅ 添加 mask:', mask);
    list.push(mask);
  } else {
    console.log('❌ mask 为空');
  }
  if (origin) {
    console.log('✅ 添加 origin:', origin);
    list.push(origin);
  } else {
    console.log('❌ origin 为空');
  }
  imageList_mask.value = list;
  const cached: Record<string, { width: number; height: number }> = {};
  list.forEach((src) => {
    const cache = imageInfoMap.value[src];
    if (cache) {
      cached[src] = cache;
    }
  });
  imageInfoMap.value = cached;
  list.forEach(fetchImageInfo);
  console.log('最终 imageList_mask.value:', imageList_mask.value);
  console.log('数组长度:', list.length);
};

// 监听组件挂载
onMounted(() => {
  console.log('📦 MoreImageUpload 挂载');
  updatePreview(modelValue.value, maskValue.value);
})

watch([modelValue, maskValue], ([origin, mask]) => {
  console.log('=== watch 触发 ===');
  console.log('modelValue (origin) 完整URL:', origin);
  console.log('maskValue (mask) 完整URL:', mask);
  console.log('origin 长度:', origin?.length, '是否为空:', !origin);
  console.log('mask 长度:', mask?.length, '是否为空:', !mask);
  updatePreview(origin, mask);
})
// 选择图片逻辑
const onClick = async () => {
  // 如果已有图片，提示用户是否重新编辑
  if (imageList_mask.value.length > 0) {
    uni.showModal({
      title: '提示',
      content: '是否重新选择图片进行编辑？',
      success: async (res) => {
        if (res.confirm) {
          await selectAndEditImage();
        }
      }
    });
    return;
  }
  
  await selectAndEditImage();
};

const selectAndEditImage = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    });

    if (res.tempFilePaths && res.tempFilePaths.length > 0) {
      imagePath.value = res.tempFilePaths[0];
      show.value = true;
      await waitForComponentReady();

      if (chjImgEditRef.value && typeof chjImgEditRef.value.open === 'function') {
        chjImgEditRef.value.open({
          path: res.tempFilePaths[0],
          isCancelToast: true,
          cancelText: '确定真的退出吗?',
          isConfirmToast: true,
          confirmText: '决定好了吗?',
          iconPath: {
            goForward_active: '/static/goForward.png',
            goForward_inactive: '/static/goForward_inactive.png',
            retreat_active: '/static/retreat.png',
            retreat_inactive: '/static/retreat_inactive.png',
            reset: '/static/reset.png',
            close: '/static/close.png',
            confirm: '/static/determine.png',
            pen: '/static/graffiti.png',
            rubber: '/static/rubber.png'
          },
          iconPathGraffiti: {
            0: '/static/iconPathGraffiti-1.png',
            1: '/static/iconPathGraffiti-2.png',
            2: '/static/iconPathGraffiti-3.png'
          }
        });
      } else {
        console.error('chj-imgEdit组件异常');
        show.value = false;
      }
    }
  } catch (error) {
    console.error('选择图片失败:', error);
  }
};

// 遮罩点击
const zehzhao = () => {
  console.log("用户点击了遮罩")
};

// 等待组件就绪
const waitForComponentReady = async () => {
  const maxRetries = 10; 
  const delay = 100; 
  let retries = 0;

  while (retries < maxRetries && (!isComponentReady.value || !chjImgEditRef.value)) {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, delay));
    retries++;
  }

  if (retries >= maxRetries) {
    console.warn('等待组件超时');
  }
};
const imageList_mask = ref<string[]>([]);
const imageInfoMap = ref<Record<string, { width: number; height: number }>>({});
const pendingImageInfo = new Set<string>();
const previewImages = computed(() => {
  const filtered = imageList_mask.value.filter((item): item is string => Boolean(item));
  return filtered;
})

const fetchImageInfo = async (src: string) => {
  if (!src || imageInfoMap.value[src] || pendingImageInfo.has(src)) return;
  pendingImageInfo.add(src);
  try {
    const info = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: ({ width, height }) => resolve({ width, height }),
        fail: (err) => reject(err)
      });
    });
    imageInfoMap.value = {
      ...imageInfoMap.value,
      [src]: info
    };
  } catch (error) {
    console.error('获取图片信息失败:', error);
  } finally {
    pendingImageInfo.delete(src);
  }
};

const imageSize = (src: string) => {
  const info = imageInfoMap.value[src];
  return info ? `${info.width}×${info.height}` : '';
};


// const confirm = async (emtData) => {
//   console.log('编辑确认，路径:', emtData.Sync);
//   try {
//     const imagePaths = Array.isArray(emtData.paths) ? emtData.paths : [emtData.paths];
//     console.log('imagePaths:', imagePaths);

//     // 优化：使用与 ImageUpload.vue 一致的上传逻辑
//     const uploadPromises = imagePaths.map(path => 
//       uploadFile<string>(url:path, action:'/file/upload')
//     );
//     const uploadResults = await Promise.all(uploadPromises);

//     // 优化：遵循 ImageUpload.vue 的数组存储规范
//     imageList_mask.value = uploadResults[1];
//     // 保持与 apps.vue 中参数绑定一致（单值/数组自动适配）
//     modelValue.value = uploadResults[1];

//     console.log('所有图片上传成功:', uploadResults);
//   } catch (error) {
//     console.error('图片上传失败:', error);
//     uni.showToast({ title: '上传失败', icon: 'error' });
//   }
//   show.value = false;
// };


// 取消回调
const tryParseJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const extractUrlFromPayload = (payload: unknown, key: string): string => {
  if (!payload) {
    return '';
  }

  // 如果是字符串，直接返回
  if (typeof payload === 'string') {
    const parsed = tryParseJSON(payload);
    if (parsed === payload) {
      return parsed;
    }
    return extractUrlFromPayload(parsed, key);
  }

  // 如果是可解析为 JSON 的字符串
  if (typeof payload === 'object' && payload !== null) {
    const queue: any[] = [payload];
    const visited = new Set<any>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || typeof current !== 'object' || visited.has(current)) {
        continue;
      }
      visited.add(current);

      // 直接命中目标 key
      const direct = current[key];
      if (typeof direct === 'string' && direct) {
        return direct;
      }

      // 通用字段命中
      const genericKeys = ['url', 'path', 'fileUrl', 'value'];
      for (const genericKey of genericKeys) {
        const candidate = current[genericKey];
        if (typeof candidate === 'string' && candidate) {
          return candidate;
        }
        if (typeof candidate === 'object' && candidate) {
          queue.push(candidate);
        }
      }

      // data / result / response 内递归查找
      const nestedKeys = ['data', 'result', 'response'];
      for (const nestedKey of nestedKeys) {
        const nested = current[nestedKey];
        if (!nested) {
          continue;
        }
        if (typeof nested === 'string' && nested) {
          const parsed = tryParseJSON(nested);
          if (typeof parsed === 'string') {
            return parsed;
          }
          queue.push(parsed);
          continue;
        }
        queue.push(nested);
      }
    }
  }

  return '';
};

const normalizeUploadResult = (payloads: unknown[], key: string): string => {
  for (const payload of payloads) {
    const url = extractUrlFromPayload(payload, key);
    if (url) {
      return url;
    }
  }
  return '';
};

const confirm = async (emtData: { originPath?: string; maskPath?: string; [key: string]: any }) => {
  console.log('编辑确认，返回数据:', emtData);
  try {
    // 假设chj-imgEdit返回包含原图和遮罩图路径的对象
    // 实际属性名可能需要根据chj-imgEdit组件调整
    const { originPath, maskPath } = emtData;
    if (!originPath || !maskPath) {
      throw new Error('缺少原图或遮罩图路径');
    }
    // 分别上传原图和遮罩图
    const [originResponse, maskResponse] = await Promise.all([
      uploadFile<string>(originPath),
      uploadFile<string>(maskPath)
    ]);

    const originUrl = normalizeUploadResult([originResponse, maskResponse], 'advance_onlineEdit_origin');
    const maskUrl = normalizeUploadResult([maskResponse, originResponse], 'advance_onlineEdit_mask');

    if (typeof originUrl !== 'string' || typeof maskUrl !== 'string' || !originUrl || !maskUrl) {
      throw new Error('上传结果缺少文件地址');
    }

    // 缓存展示使用遮罩在前、原图在后
    imageList_mask.value = [maskUrl, originUrl];

    modelValue.value = originUrl;
    if (bindParam?.value) {
      bindParam.value.advance_onlineEdit_mask = maskUrl;
    }
    
    // 确保更新预览
    await nextTick();
    updatePreview(originUrl, maskUrl);
    
    console.log('上传成功，结果:', modelValue.value);
    console.log('imageList_mask.value:', imageList_mask.value);
    console.log('previewImages:', previewImages.value);
    
    uni.showToast({ title: '上传成功', icon: 'success' });
  } catch (error: any) {
    console.error('图片上传失败:', error);
    uni.showToast({ title: '上传失败: ' + (error?.message || ''), icon: 'error' });
  }
  show.value = false;
};

const cancel = () => {
  console.log('编辑取消');
  show.value = false;
};

// 获取线条长度
const getLineLength = (length: number) => {
  console.log('线条长度:', length + 'px');
};

// 获取矩形位置
const getRectPosition = (obj: Record<string, any>) => {
  console.log('矩形位置:', obj);
};

// 图片加载成功处理
const onImageLoad = (e: any) => {
  console.log('✅ 图片加载成功');
};

// 图片加载失败处理
const onImageError = (e: any) => {
  console.error('❌ 图片加载失败:', e.detail);
};
</script>

<style scoped lang="scss">
	
	
	.frosted-glass-container {
  width: 80%;
  max-width: 500rpx;
  margin: 60rpx auto;
  padding: 40rpx;
  /* 关键：磨砂效果，兼容微信小程序（基础库 2.9.0+ 支持 backdrop-filter） */
  backdrop-filter: blur(10rpx); 
  -webkit-backdrop-filter: blur(10rpx); 
  background-color: rgba(255, 255, 255, 0.3); 
  border-radius: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 模拟中间圆形及环形结构 */
.icon-area {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}
.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f2f3f5; 
}
.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 10rpx solid #d9e0e9; 
}

/* 模拟下方矩形条 */
.rect {
  width: 60%;
  height: 30rpx;
  background-color: #f2f3f5; 
  border-radius: 15rpx;
  margin-bottom: 20rpx;
}
.rect-2 {
  width: 40%;
}
	/* ============================== */
.image-editor-container {
	margin-top: 2%;
	margin-bottom: 2%;
  padding: 20rpx;
}

/* 触发区域样式:无图时占位置,有图时承载图片 */
.edit-trigger {
  width: 100%;
  min-height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: visible;
  padding: 30rpx;
  box-sizing: border-box;
}

/* 无图占位图样式 */
.placeholder-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图标完整 */
}

/* 已上传图片列表 */
.uploaded-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-grid {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  width: 200rpx;
}

.image-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
  padding: 4rpx 12rpx;
  background-color: #f0f0f0;
  border-radius: 20rpx;
}

.image-size {
  font-size: 20rpx;
  color: #999;
}

.uploaded-img {
  width: 200rpx !important;
  height: 200rpx !important;
  object-fit: cover;
  border-radius: 8rpx;
  border: 2rpx solid #e0e0e0;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  display: block;
}

.no-image-placeholder {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  color: #999;
  font-size: 24rpx;
}

.edit-hint {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  padding: 8rpx 16rpx;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
}

/* 编辑弹窗容器 */
.editor-wrapper {
  margin-top: 20rpx;
  width: 100%;
  min-height: 500rpx;
}
</style>