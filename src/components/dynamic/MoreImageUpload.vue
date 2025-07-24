<template>
	<template #title>
	  <MyTitle :title="title"></MyTitle>
	</template>
  <view class="image-editor-container" @click="onClick">
	   
    <!-- 点击触发选择图片 -->
	 <view class="frosted-glass-container" v-if="!imageList_mask || imageList_mask.length === 0" >
	    <!-- 这里可根据实际需求填充内容，比如模拟的图标、文字等 -->
	    <view class="icon-area">
	      <view class="circle"></view>
	      <view class="ring"></view>
	    </view>
	    <view class="rect rect-1"></view>
	    <view class="rect rect-2"></view>
	  </view>
	 
    
    <view v-else  class="edit-trigger">
      <!-- 有图时循环渲染已上传图片（如果是单图可简化，这里保留原数组逻辑） -->
      <view  v-for="(image, index) in [imageList_mask]" :key="index" class="uploaded-list">
        <image 
         
          :src="image" 
          class="uploaded-img"
        />
      </view>
    </view>

    <!-- 图片编辑弹窗，v-show 控制显隐 -->
    <view v-show="show" class="editor-wrapper">
      <fui-backdrop :show="show" closable @click="zehzhao">
        <chj-imgEdit 
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
import { ref, defineEmits, nextTick, watch ,onMounted} from 'vue';
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
const modelValue = defineModel({ default: [] as string[] })
interface Props{
  title?:string;
  workflow_id:string
  options?:IDynamicOptions
};
const props = withDefaults(defineProps<Props>(),{
  title:' ',
})
// 监听组件挂载
onMounted(() => {
  imageList_mask.value = modelValue.value || []
})

// 监听本地数据变化同步到父组件
watch(imageList_mask, (newVal) => {
  modelValue.value = newVal
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


const confirm = async (emtData) => {
  console.log('编辑确认，路径:', emtData.Sync);
  try {
    const imagePaths = Array.isArray(emtData.paths) ? emtData.paths : [emtData.paths];
    console.log('imagePaths:', imagePaths);

    // 优化：使用与 ImageUpload.vue 一致的上传逻辑
    const uploadPromises = imagePaths.map(path => 
      uploadFile<string>(url:path, action:'/file/upload')
    );
    const uploadResults = await Promise.all(uploadPromises);

    // 优化：遵循 ImageUpload.vue 的数组存储规范
    imageList_mask.value = uploadResults[1];
    // 保持与 apps.vue 中参数绑定一致（单值/数组自动适配）
    modelValue.value = uploadResults[1];

    console.log('所有图片上传成功:', uploadResults);
  } catch (error) {
    console.error('图片上传失败:', error);
    uni.showToast({ title: '上传失败', icon: 'error' });
  }
  show.value = false;
};


// 取消回调
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
	.placeholder-upload {
  width: 150rpx; /* 可根据需求调整宽高 */
  height: 150rpx;
  background-color: #333; /* 深灰色背景，模拟你提供的效果，可按需修改 */
  border-radius: 12rpx; /* 圆角，让外观更柔和，可调整 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.plus-icon {
  width: 60rpx;
  height: 60rpx;
}
	.placeholder-upload {
	  width: 150rpx; /* 可根据需求调整宽高 */
	  height: 150rpx;
	  background-color: #333; /* 深灰色背景，模拟你提供的效果，可按需修改 */
	  border-radius: 12rpx; /* 圆角，让外观更柔和，可调整 */
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.plus-icon {
	  width: 60rpx;
	  height: 60rpx;
	}
.image-editor-container {
	margin-top: 2%;
	margin-bottom: 2%;
  padding: 20rpx;
}

/* 触发区域样式：无图时占位置，有图时承载图片 */
.edit-trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5; /* 浅灰底色 */
  border-radius: 8rpx;
  overflow: hidden; /* 防止图片溢出圆角 */
}

/* 无图占位图样式 */
.placeholder-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图标完整 */
}

/* 已上传图片列表（单图场景也适用） */
.uploaded-list {
  width: 100%;
  height: 100%;
}
.uploaded-img {
  width: 200rpx;
  height:200rpx;
  margin: 0;
  object-fit: cover; /* 覆盖填充，按需求可改contain */
}

/* 编辑弹窗容器 */
.editor-wrapper {
  margin-top: 20rpx;
  width: 100%;
  min-height: 500rpx;
}
</style>