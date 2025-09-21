<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import TnNumberBox from '@tuniao/tnui-vue3-uniapp/components/number-box/src/number-box.vue'
import ParamCard from "@/components/common/ParamCard.vue";
import MyTitle from "@/components/common/MyTitle.vue";
import type {IDynamicOptions} from "@/types";

interface Props {
  title?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  options?: IDynamicOptions & { min?: number; max?: number; step?: number };
}

const props = withDefaults(defineProps<Props>(), {
  title: '数值滑块',
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: true,
  options: () => ({})
})

const actualMin = computed(() => Number(props.options?.min ?? props.min ?? 0))
const actualMax = computed(() => Number(props.options?.max ?? props.max ?? 100))
const actualStep = computed(() => Number(props.options?.step ?? props.step ?? 1))

const numberValue = defineModel<number>({ default: 0 })

const displayDecimals = computed(() => {
  try {
    const s = String(actualStep.value)
    if (s.indexOf('.') >= 0) return s.split('.')[1].length
    return 0
  } catch (e) {
    return 0
  }
})

const displayValue = computed(() => {
  const v = Number(numberValue.value ?? 0)
  return displayDecimals.value > 0 ? v.toFixed(displayDecimals.value) : String(Math.round(v))
})

const initValue = () => {
  if (numberValue.value === undefined || numberValue.value === null) numberValue.value = actualMin.value
  if (numberValue.value < actualMin.value) numberValue.value = actualMin.value
  else if (numberValue.value > actualMax.value) numberValue.value = actualMax.value
}

watch(() => props.options, (newOpt) => {
  if (newOpt && Object.keys(newOpt).length > 0) initValue()
}, { immediate: true, deep: true })

onMounted(() => initValue())

// 当实际范围改变时也要校准当前值
watch([actualMin, actualMax], () => {
  initValue()
})

const parseEventValue = (e: any) => {
  if (typeof e === 'object') return (e.detail?.value ?? e.value ?? e)
  return e
}

const onChange = (e: any) => {
  const val = Number(parseEventValue(e))
  numberValue.value = Number.isNaN(val) ? numberValue.value : val
}
const onChanging = (e: any) => {
  const val = Number(parseEventValue(e))
  numberValue.value = Number.isNaN(val) ? numberValue.value : val
}

const onNumberBoxChange = (val: number) => {
  if (val < actualMin.value) numberValue.value = actualMin.value
  else if (val > actualMax.value) numberValue.value = actualMax.value
  else numberValue.value = val
}
</script>

<template>
  <ParamCard>
    <template #title>
      <MyTitle :title="props.title || '数值滑块'" />
    </template>

    <template #body>
      <view class="slider-row compact">
        <view class="left">
          <fui-slider
            width="240"
            v-model="numberValue"
            :min="actualMin"
            :max="actualMax"
            :step="actualStep"
            :disabled="props.disabled"
            @change="onChange"
            @changing="onChanging"
          />

          <!-- <view class="minmax">
            <text class="min">{{ actualMin }}</text>
            <text class="max">{{ actualMax }}</text>
          </view> -->
        </view>

        <view class="right">
          <!-- <text v-if="props.showValue" class="value-label">{{ displayValue }}</text> -->
          <TnNumberBox
            v-model="numberValue"
            :min="actualMin"
            :max="actualMax"
            :step="actualStep"
            :disabled="props.disabled"
            @change="onNumberBoxChange"
            width="200rpx"
          />
        </view>
      </view>
    </template>
  </ParamCard>
</template>

<style scoped lang="scss">
.slider-row.compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  padding: 8rpx;
  background: #fff;
  border-radius: 6rpx;
  border: 1rpx solid #f1f1f3;
}

.slider-row .left {
  flex: 1 1 auto;
  padding-right: 8rpx;
}

.compact-slider {
  width: 100%;
}

.minmax {
  display: flex;
  justify-content: space-between;
  margin-top: 4rpx;
}

.min, .max {
  color: #999;
  font-size: 20rpx;
}

.right {
  width: 110rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.value-label {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
}

@media (max-width: 420px) {
  .right {
    width: 100rpx;
  }
  .value-label {
    font-size: 22rpx;
  }
}
</style>