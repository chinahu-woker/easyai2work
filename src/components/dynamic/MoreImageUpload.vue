<template>
  <view class="image-editor-container" @click="onClick">
    <!-- 显示标题 -->
    <MyTitle :title="title"></MyTitle>
    
    <!-- 点击触发选择图片 -->
    <view class="frosted-glass-container" v-if="!imageList_mask || imageList_mask.length === 0">
	    <!-- 无图片时显示占位符 -->
	    <view class="icon-area">
	      <view class="circle"></view>
	      <view class="ring"></view>
	    </view>
	    <view class="rect rect-1"></view>
	    <view class="rect rect-2"></view>
	  </view>
    
    <view v-else-if="imageList_mask && imageList_mask.length > 0" class="edit-trigger">
      <!-- 有图时渲染已上传图片 -->
      <view class="uploaded-list">
        <image 
          v-for="(image, index) in imageList_mask" 
          :key="index" 
          :src="image"
          v-if="image" 
          class="uploaded-img"
        />
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
import { ref,  nextTick, watch ,onMounted} from 'vue';
import chjImgEdit from "@/components/chj-imgEdit/chj-imgEdit.vue";
import MyTitle from "@/components/common/MyTitle.vue";
import type {ImageUploadCustomFunction, ImageUploadFile,TnImageUploadInstance} from "@tuniao/tnui-vue3-uniapp";
import { uploadFile} from "@/utils/request.ts";
// 自定义事件
const emit = defineEmits(['update:modelValue']);

// 状态管理
const show = ref(false);
const imagePath = ref('');
const chjImgEditRef = ref(null);
const isComponentReady = ref(false); 
      // 存储已上传图片，改用数组更通用
const placeholderImg = ref('/static/placeholder.png'); // 无图占位图，需自行放置资源
const ediIcon = '/static/graffiti.png';
const modelValue = defineModel({
  default: () => ({
    "advance_onlineEdit_origin": '',
    "advance_onlineEdit_mask": ''
  })
})
interface Props{
  title?:string;
  workflow_id:string
  options?:IDynamicOptions
};
const props = withDefaults(defineProps<Props>(),{
  title:'遮罩绘制',
})
// 监听组件挂载
onMounted(() => {
  // 初始化时将对象转换为适合本地展示的格式
  if (modelValue.value['advance_onlineEdit_mask']) {
    imageList_mask.value = [modelValue.value['advance_onlineEdit_mask'],modelValue.value['advance_onlineEdit_origin']];
  }
})

// 监听本地数据变化同步到父组件
watch(modelValue, (newVal) => {
  if (newVal['advance_onlineEdit_mask']) {
    imageList_mask.value = [newVal['advance_onlineEdit_mask'],newVal['advance_onlineEdit_origin']];
  }
}, { deep: true })
// 选择图片逻辑
const onClick = async () => {
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
const  imageList_mask = ref([])


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

const confirm = async (emtData) => {
  console.log('编辑确认，返回数据:', emtData);
  try {
    // 假设chj-imgEdit返回包含原图和遮罩图路径的对象
    // 实际属性名可能需要根据chj-imgEdit组件调整
    const { originPath, maskPath } = emtData;
    if (!originPath || !maskPath) {
      throw new Error('缺少原图或遮罩图路径');
    }

    // 分别上传原图和遮罩图，使用与ImageUpload.vue一致的上传逻辑
    const [originResult, maskResult] = await Promise.all([
       uploadFile<string>(originPath),
      uploadFile<string>(maskPath)
    ]);
    const uploadResults = await Promise.all([originResult, maskResult]);
    console.log("uploadResults", uploadResults);

    // 构建符合要求的对象结构
    // 关键修改：使用工作流参数定义的name作为键名
    const result = {
      // 替换为工作流中定义的参数name（示例：originUrl和maskUrl）
      "advance_onlineEdit_origin": originResult,
      "advance_onlineEdit_mask": maskResult
    };

    // 更新modelValue为对象类型（需同步修改modelValue定义）
    modelValue.value = result;
    console.log('上传成功，结果:', result);
    uni.showToast({ title: '上传成功', icon: 'success' });
  } catch (error) {
    console.error('图片上传失败:', error);
    uni.showToast({ title: '上传失败: ' + error.message, icon: 'error' });
  }
  show.value = false;
};

const cancel = () => {
  console.log('编辑取消');
  show.value = false;
};

// 获取线条长度
const getLineLength = (length) => {
  console.log('线条长度:', length + 'px');
};

// 获取矩形位置
const getRectPosition = (obj) => {
  console.log('矩形位置:', obj);
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

/* 触发区域样式：无图时占位置，有图时承载图片 */
.edit-trigger {
  width: 100%;
  min-height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5; /* 浅灰底色 */
  border-radius: 8rpx;
  overflow: hidden; /* 防止图片溢出圆角 */
  padding: 20rpx;
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
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.uploaded-img {
  max-width: 200rpx;
  max-height: 200rpx;
  width: auto;
  height: auto;
  margin: 10rpx;
  object-fit: contain;
  border-radius: 8rpx;
}

/* 编辑弹窗容器 */
.editor-wrapper {
  margin-top: 20rpx;
  width: 100%;
  min-height: 500rpx;
}
</style>