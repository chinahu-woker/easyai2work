<script setup lang="ts">

import TnImageUpload from "@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.vue";
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { uploadFile } from "@/utils/request.ts";
import MyTitle from "@/components/common/MyTitle.vue";
import ParamCard from "@/components/common/ParamCard.vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
import type { IDynamicOptions } from "@/types";

// 导入 Canvas 相关类型
import type { CanvasRenderingContext2D } from 'canvas';

// 定义 ImageUploadFile 类型
interface ImageUploadFile {
  url?: string;
  name?: string;
  size?: number;
  path: string;
  maskedUrl?: string;
}

// 定义 ImageUploadCustomFunction 类型
type ImageUploadCustomFunction = (file: ImageUploadFile) => Promise<ImageUploadFile>;

interface Props {
  title?: string
  options?: IDynamicOptions
}

const props = withDefaults(defineProps<Props>(), {
  title: "上传",
})

// 修改为 ImageUploadFile[] 类型
const modelValue = defineModel<string[]>({
  default: () => []
})

// 修改为 ImageUploadFile[] 类型
const imageList = ref<ImageUploadFile[]>([])

// 遮罩相关状态
const isMaskModalVisible = ref(false);
const currentImage = ref<ImageUploadFile | null>(null);
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const drawMode = ref<'brush' | 'box'>('brush'); // 绘制模式：画笔或框选
const brushWidth = ref(10); // 画笔粗细
const drawList = ref<any[]>([]); // 绘制历史
const tempDraw = ref<any>(null); // 临时绘制
const maskComplete = ref<(file: ImageUploadFile) => void | null>(null);

onReady(() => {
  // 延迟执行滚动列表初始化
  setTimeout(() => {
    // 调用 TnScrollList 的方法
    initScrollList();
  }, 100);
});
watch(imageList, (newVal) => {
  console.log("imageList 更新:", newVal);
  modelValue.value = [...newVal];
}, { deep: true });

const uploadFilePromise: ImageUploadCustomFunction = async (file: ImageUploadFile) => {
  const url = (file as UniApp.ChooseImageSuccessCallbackResultFile).path;
  return new Promise(async (resolve, reject) => {
    try {
      // 先显示遮罩绘制模态框
      currentImage.value = file;
      isMaskModalVisible.value = true;

      // 等待遮罩绘制完成（通过自定义事件触发）
      await new Promise((innerResolve) => {
        maskComplete.value = (completedFile) => {
          innerResolve(completedFile);
        };
      });

      // 上传带遮罩的图片
      const uploadResult = await uploadFile<string>(file.maskedUrl || url);

      console.log("uploadResult", uploadResult);
      if (uploadResult) {
        // ✅ 正确格式应直接返回URL字符串
        // ❌ 原代码返回复杂对象导致组件无法识别
        resolve(uploadResult); // 修改此处
      } else {
        reject(new Error('上传失败'));
      }
    } catch (error) {
      console.error('上传错误', error);
      reject(error);
    }
  });
};

const imageUploadRef = ref<TnImageUploadInstance>()
const chooseFile = () => {
  imageUploadRef.value?.chooseFile()
}

// 遮罩相关方法

// 初始化画布
const initCanvas = () => {
  if (!currentImage.value) return;

  const query = uni.createSelectorQuery();
  query.select('#maskCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (!res[0]) return;

      const canvas = res[0].node as unknown as HTMLCanvasElement;
      ctx.value = canvas.getContext('2d');

      // 设置画布尺寸
      canvasWidth.value = res[0].width;
      canvasHeight.value = res[0].height;

      // 加载图片
      const img = new Image();
      img.src = currentImage.value.path;
      img.onload = () => {
        // 清空画布
        clearCanvas();

        // 在画布上绘制图片作为背景
        ctx.value?.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);

        // 重绘所有已保存的绘制
        redrawCanvas();
      };
    });
};

// 清空画布
const clearCanvas = () => {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  }
};

// 重绘画布
const redrawCanvas = () => {
  if (!ctx.value) return;

  // 先绘制图片背景
  const img = new Image();
  img.src = currentImage.value?.path || '';
  img.onload = () => {
    ctx.value?.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);

    // 绘制所有已保存的遮罩
    drawList.value.forEach(item => {
      if (item.type === 'brush') {
        drawBrushPath(item.points);
      } else if (item.type === 'box') {
        drawBox(item);
      }
    });

    // 绘制临时绘制
    if (tempDraw.value) {
      if (tempDraw.value.type === 'brush') {
        drawBrushPath(tempDraw.value.points);
      } else if (tempDraw.value.type === 'box') {
        drawBox(tempDraw.value);
      }
    }
  };
};

// 绘制画笔路径
const drawBrushPath = (points: { x: number, y: number }[]) => {
  if (!ctx.value || points.length < 2) return;

  ctx.value.beginPath();
  ctx.value.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.value.lineTo(points[i].x, points[i].y);
  }

  ctx.value.lineWidth = brushWidth.value;
  ctx.value.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.value.stroke();
};

// 绘制矩形框
const drawBox = (box: { x1: number, y1: number, x2: number, y2: number }) => {
  if (!ctx.value) return;

  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;

  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.value.fillRect(box.x1, box.y1, width, height);
};

// 触摸事件处理
let isDrawing = false;
let startX = 0;
let startY = 0;

const handleTouchStart = (e: any) => {
  if (!ctx.value || !currentImage.value) return;

  isDrawing = true;
  const touch = e.touches[0];
  startX = touch.x;
  startY = touch.y;

  if (drawMode.value === 'brush') {
    tempDraw.value = {
      type: 'brush',
      points: [{ x: startX, y: startY }]
    };
  } else if (drawMode.value === 'box') {
    tempDraw.value = {
      type: 'box',
      x1: startX,
      y1: startY,
      x2: startX,
      y2: startY
    };
  }
};

const handleTouchMove = (e: any) => {
  if (!isDrawing || !ctx.value) return;

  const touch = e.touches[0];
  const currentX = touch.x;
  const currentY = touch.y;

  if (drawMode.value === 'brush') {
    tempDraw.value.points.push({ x: currentX, y: currentY });
  } else if (drawMode.value === 'box') {
    tempDraw.value.x2 = currentX;
    tempDraw.value.y2 = currentY;
  }

  redrawCanvas();
};

const handleTouchEnd = () => {
  if (!isDrawing || !ctx.value || !tempDraw.value) return;

  isDrawing = false;

  // 将临时绘制添加到历史记录
  drawList.value.push(tempDraw.value);
  tempDraw.value = null;

  redrawCanvas();
};

// 切换绘制模式
const switchDrawMode = (mode: 'brush' | 'box') => {
  drawMode.value = mode;
};

// 撤销上一步
const undoLastDraw = () => {
  if (drawList.value.length > 0) {
    drawList.value.pop();
    redrawCanvas();
  }
};

// 保存遮罩图片
const saveMaskImage = () => {
  if (!ctx.value || !currentImage.value) return;

  uni.canvasToTempFilePath({
    canvasId: 'maskCanvas',
    success: (res) => {
      console.log('遮罩图片保存成功:', res.tempFilePath);

      // 将遮罩后的图片路径保存到当前图片对象
      if (currentImage.value) {
        currentImage.value.maskedUrl = res.tempFilePath;
      }

      // 关闭模态框
      isMaskModalVisible.value = false;

      // 重置遮罩状态
      resetMaskState();

      // ✅ 触发遮罩绘制完成事件（确保在此处调用）
      if (maskComplete.value) {
        maskComplete.value(currentImage.value);
        maskComplete.value = null; // 及时清理
      }
    },
    fail: (err) => {
      console.error('遮罩图片保存失败:', err);
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
      // ❌ 原代码未处理失败情况，会导致Promise挂起
      if (maskComplete.value) {
        reject(err); // 添加错误处理
        maskComplete.value = null;
      }
    }
  });
};

// 重置遮罩状态
const resetMaskState = () => {
  currentImage.value = null;
  drawList.value = [];
  tempDraw.value = null;
  drawMode.value = 'brush';
};

// 取消遮罩编辑
const cancelMaskEdit = () => {
  isMaskModalVisible.value = false;
  resetMaskState();
};

// 监听遮罩模态框显示状态
watch(isMaskModalVisible, (val) => {
  if (val && currentImage.value) {
    // 当模态框显示时，初始化画布
    nextTick(() => {
      initCanvas();
    });
  }
});

</script>

<template>
  <ParamCard>
    <template #title>
      <MyTitle :title="title"/>
    </template>
    <template #body>
      <TnImageUpload 
        ref="imageUploadRef" 
        v-model="imageList" 
        :limit="6" 
        :custom-upload-handler="uploadFilePromise"
        :multiple="true"   
        
      >
      </TnImageUpload>
    </template>
  </ParamCard>
  
  <!-- 遮罩绘制模态框 -->
  <view class="mask-modal" v-if="isMaskModalVisible">
    <view class="mask-modal-header">
      <text class="mask-modal-title">图片遮罩编辑</text>
      <view class="mask-modal-actions">
        <button class="mask-btn" @click="cancelMaskEdit">取消</button>
        <button class="mask-btn" @click="saveMaskImage">保存</button>
      </view>
    </view>
    
    <view class="mask-canvas-container">
      <!-- 图片和画布容器 -->
      <view class="mask-image-wrap" style="position: relative;">
        <canvas 
          canvas-id="maskCanvas" 
          class="mask-canvas"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        ></canvas>
      </view>
      
      <!-- 工具栏 -->
      <view class="mask-toolbar">
        <button class="mask-tool-btn" :class="{ active: drawMode === 'brush' }" @click="switchDrawMode('brush')">
          <text class="iconfont icon-brush"></text> 画笔
        </button>
        <button class="mask-tool-btn" :class="{ active: drawMode === 'box' }" @click="switchDrawMode('box')">
          <text class="iconfont icon-square"></text> 框选
        </button>
        
        <view class="brush-width-slider">
          <text>画笔粗细:</text>
          <slider 
            :min="1" 
            :max="50" 
            :value="brushWidth" 
            @change="brushWidth = $event.detail.value"
          ></slider>
        </view>
        
        <button class="mask-tool-btn" @click="undoLastDraw">
          <text class="iconfont icon-undo"></text> 撤销
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.upload-new-btn{
  width: 100%;
  height: 300rpx;
  background-color: #f4f5f6;
  border-radius: 10rpx;
}

/* 遮罩模态框样式 */
.mask-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.mask-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.mask-modal-title {
  font-size: 32rpx;
  font-weight: bold;
}

.mask-modal-actions {
  display: flex;
  gap: 20rpx;
}

.mask-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  background-color: #f4f5f6;
  font-size: 28rpx;
}

.mask-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mask-image-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  overflow: hidden;
}

.mask-canvas {
  max-width: 100%;
  max-height: 100%;
}

.mask-toolbar {
  padding: 20rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.mask-tool-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  background-color: #f4f5f6;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mask-tool-btn.active {
  background-color: #1677ff;
  color: #fff;
}

.brush-width-slider {
  flex: 1;
  min-width: 200rpx;
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 0 15rpx;
}
</style>