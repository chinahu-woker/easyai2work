<template>


  <ParamCard>

    <template #title>
      <MyTitle :title="title"></MyTitle>
    </template>
    <template #body>
      <scroll-view  scroll-y="true" class="image-preview-container">
        <view class="image-grid">
          <view
              class="image-item"
              v-for="(image, index) in images"
              :key="index"
              :class="{'selected': selectedIndex === index}"
              @click="selectImage(index)"
          >
              <image
                  :class="{'selected': selectedIndex === index}"
                  :src="image.src"
                  mode="aspectFill" />
            <view class="tn-text-xs tn-text-center tn-text-ellipsis-1">{{image.title}}</view>
            <view class="selected-icon">
              <TnIcon
                  v-if="index===selectedIndex"
                   name="check"/>
            </view>

          </view>
        </view>
      <!--选中的预览-->
<!--        <view class="selected-preview">-->
<!--          <img-->
<!--              :src="selectedImage"-->
<!--              alt="Selected Image"-->
<!--              class="selected-image"-->
<!--          />-->
<!--        </view>-->
      </scroll-view>
    </template>
  </ParamCard>

</template>

<script setup lang="ts">



import {computed, ref, watch, inject} from "vue";
import ParamCard from "@/components/common/ParamCard.vue";
import MyTitle from "@/components/common/MyTitle.vue";
import type {IDynamicOptions, IImageSelectItem} from "@/types";
import TnIcon from "@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue";
import {onLoad} from "@dcloudio/uni-app";

interface Props {
  title?:string
  options?:IDynamicOptions | any  // 允许任何类型以接收完整的 item 对象
}

const props=withDefaults(defineProps<Props>(),{
  title:'选择风格'
})

// 获取父组件的 bindParam 对象，用于多参数绑定
const bindParam = inject<any>('bindParam', ref({}))

onLoad(()=>{
//   兼容原有的设定，options是数组
//   console.log("props",typeof JSON.parse(props.options));
//   if(Array.isArray(JSON.parse(props.options))){
//     props.options.imageSelectItems=JSON.parse(props.options);
//     console.log("props.options",props.options);
//   }
})


const selectedValue = defineModel<string | null>({default:null});
const selectedIndex = ref(0);

// 处理多参数绑定
watch(selectedIndex,()=>{
  const selectedItem = images.value[selectedIndex.value];
  if (!selectedItem) return;
  
  // 检查是否有多参数配置（从 options.params 获取）
  if (props.options && 'params' in props.options && Array.isArray(props.options.params)) {
    props.options.params.forEach((param: any) => {
      if (param.bindAttrItemValueKey && (selectedItem as any)[param.bindAttrItemValueKey] !== undefined) {
        // 直接更新 bindParam 中对应的参数
        if (bindParam.value) {
          bindParam.value[param.name] = (selectedItem as any)[param.bindAttrItemValueKey];
        }
      }
    });
  } else {
    // 单参数绑定（保持向后兼容）
    selectedValue.value = selectedItem.value as string;
  }
})

const images = computed<IImageSelectItem[]>(()=>{
  if(!props.options) return [];
  
  // 如果 options 有 attributes 属性，尝试解析它
  let attributesData = props.options.attributes;
  if (typeof attributesData === 'string') {
    try {
      attributesData = JSON.parse(attributesData);
    } catch (e) {
      console.error('Failed to parse attributes:', e);
      return [];
    }
  }
  
  //兼容原来的预览图像设定
  if(typeof props.options==='string' && Array.isArray(JSON.parse(props.options))){
    return JSON.parse(props.options) as IImageSelectItem[];
  }

  if(Array.isArray(props.options)){
    return props.options as IImageSelectItem[];
  }
  
  if(Array.isArray(attributesData)){
    return attributesData as IImageSelectItem[];
  }
  
  // 新的数据格式
  const options = props.options as IDynamicOptions;
  if(options.imageSelectItems){
    return options.imageSelectItems
  }else{
    return [];
  }
})


// const images = ref([
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://oss.gptpro.ink/temps/image/dW2Et6-0001.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://oss.gptpro.ink/temps/image/dW2Et6-0001.png',
//   'https://oss.gptpro.ink/temps/image/1725323142925.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://oss.gptpro.ink/temps/image/1725323142925.png',
//   'https://oss.gptpro.ink/temps/image/1725284691901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://oss.gptpro.ink/temps/image/1725284691901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
//   'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image/temps/1718244224901.png',
// ]);

const selectedImage=computed(()=>{
  return images.value[selectedIndex.value];
})


const selectImage=(index: number)=> {
  selectedIndex.value = index;
}
</script>

<style scoped lang="scss">
.image-preview-container {
  min-height: 260rpx;
  max-height: 400rpx;
  padding: 10rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.image-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
}

.image-item image.selected {
  box-shadow: 4px 4px 10rpx rgba(2, 22, 37, 0.5);
  //放大
  transform: scale(1.05);

}
  //遮罩 暂时没用
.image-item.selected::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.image-item image {
  width: 100%;
  height: 160rpx;
  transition: transform 0.3s;
  //父元素中居中
  margin: auto;
}

.selected-preview {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-image {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.selected-icon{
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 0 5rpx 5rpx;
  background-color: $u-primary;
  color: white;
}
</style>
