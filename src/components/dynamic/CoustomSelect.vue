<script setup lang="ts">
import Picker from "@/components/dynamic/Picker.vue";
import { ref, computed, watch } from "vue";
import { getModelListByWorkflowId } from "@/composables/useWorkFlow.ts";
import type { IDynamicOptions } from "@/types";
interface Props {
  title?: string;
  workflow_id: string;
  options?: IDynamicOptions;
}

const props = defineProps<Props>();
const mergedOptions = computed(() => {
  if (Array.isArray(props.options)) {
    return { attributes: props.options };
  }
  return props.options && props.options.attributes
    ? props.options
    : { attributes: [] };
});

// 解析 attributes，生成 Picker 需要的选项数组（label/value）
const pickerOptions = computed(() => {
  if (mergedOptions.value && Array.isArray(mergedOptions.value.attributes)) {
    return mergedOptions.value.attributes.map((item: any) => ({
      label: item.title,
      value: item.value,
    }));
  }
  return [];
});

// v-model 返回字符串（选中项的 value）
const selectValue = defineModel<string | null>({ default: null });

// 初始化：若无初始值则使用第一个 option 的 value
const initSelect = () => {
  const hasPicker = pickerOptions.value && pickerOptions.value.length > 0
  if ((selectValue.value === null || selectValue.value === undefined || selectValue.value === '') && hasPicker) {
    selectValue.value = pickerOptions.value[0].value
  } else if (selectValue.value && hasPicker) {
    const exists = pickerOptions.value.some((p: any) => p.value === selectValue.value)
    if (!exists) selectValue.value = pickerOptions.value[0].value
  }
}

// 监听 options 变化以确保当前值合法
watch(pickerOptions, (newVal) => {
  if (!newVal || newVal.length === 0) return
  const exists = newVal.some((p: any) => p.value === selectValue.value)
  if (!exists) selectValue.value = newVal[0].value
}, { immediate: true })

const modelList = ref<string[]>([]);
const handleInitData = async () => {
  if (!props.workflow_id) {
    return;
  }
  const result = await getModelListByWorkflowId(props.workflow_id);
  if (result) {
    modelList.value = result;
  }
};

console.log("Merged Options:", mergedOptions.value);
console.log("Picker Options:", pickerOptions.value);
console.log("Props Options:", props.options);

handleInitData();
// 延迟初始化，以便 pickerOptions 在被计算后正确生效
initSelect();


// {"output":"",
// "image_path":"https://static.nailoffice.cn/2025-09-18/6841119cb9df852ec0a2c684/upload/20250919021230765-生成像素风美少女.png",
// "seed":197745295709,
// "batch_size":1,
// "lora_name1":"cat-dark0610.safetensors",
// "lora_trigger_text1":"Dark personality style",
// "lora_name":"https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250610231341023-短梯-51.png",
// "lora_trigger_text":""}


// 绘图参数{"output":"",
// "advance_select_single_chips_1":"almond shaped fake nail",
// "image_path":"https://static.nailoffice.cn/image/temps/6841119cb9df852ec0a2c684/ub6Pc4gn3Ihg1a7af55d9717a80d96d55c02c419897c.png",
// "advance_select_single_chips":"1024x1024 (1.0)",
// "batch_size":1,
// "seed":663877820688,"
// custom_dropselect":"flux-lora-1nail.safetensors",
// "1nial":"https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250611225554395-细狗长尖_1.png",
// "lora_trigger_text":"",
// "lora_name":"https://ai-1357282892.cos.ap-shanghai.myqcloud.com/6811db59c58c28287e07e45c/upload/20250610231341023-短梯-51.png",
// "custom_number_slider":20,
// "lora_name1":"cat-dark0610.safetensors",
// "lora_trigger_text1":"Dark personality style"}

</script>

<template>
  <Picker
    :title="title"
    v-model="selectValue"
    :options="pickerOptions"
  />
</template>

<style scoped lang="scss"></style>