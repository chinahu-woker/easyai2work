<script setup lang="ts">
import { ref, watch, computed, withDefaults, defineProps, toRefs } from 'vue'

type Props = {
  percent?: number
  src?: string
  // 新增：外部告知内容类型（image | text | video | other），非 image 时不渲染缩略图
  contentType?: 'image' | 'text' | 'video' | 'other'
  size?: number | string
  radius?: number | string
  showPercent?: boolean
  showOnLoaded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: '160',
  radius: '12',
  showPercent: true
  , showOnLoaded: true
})
const emit = defineEmits(['loaded'])

// keep reactive references for template usage without losing reactivity
const { size, radius, showPercent, showOnLoaded, src, percent, contentType } = toRefs(props)

// 进度（外部传百分比即可，不再做 XHR 计算）
const internalPercent = ref<number>(typeof percent?.value === 'number' ? Math.max(0, Math.min(100, percent.value)) : -1)
// 是否展示图片
const showImage = ref(false)
// 图片真正加载完成（用于淡入）
const imgLoaded = ref(false)

function handleImgLoad() {
  imgLoaded.value = true
  emit('loaded')
}
function handleImgError() {
  // 出错保持进度显示，不做循环重试
  showImage.value = false
}

// Watch percent prop and update internalPercent immediately when prop changes
watch(percent, (v) => {
  internalPercent.value = typeof v === 'number' ? Math.max(0, Math.min(100, v)) : -1
}, { immediate: true })

// debug: log percent changes (helps diagnose parent not updating prop)
try { watch(percent, (v) => { console.debug && console.debug('[TaskProgressDynamic] percent(simple) ->', v) }) } catch (e) { }

watch(src, (s) => {
  // 一旦有首张图片地址且类型为 image，立即尝试显示
  if (s && contentType?.value === 'image') {
    showImage.value = true
  }
})

// 无需 mounted/unmounted 额外逻辑（已移除预加载复杂度）

const fillHeight = computed(() => {
  if (internalPercent.value < 0) return '40%'
  return `${Math.max(0, Math.min(100, internalPercent.value))}%`
})

// 实际用于渲染的图片 src，优先 blob/base64，本地 temp，其次原地址
const displaySrc = computed(() => src?.value || '')

// 当 percent 已 100 但 isLoaded 尚未标记（极端情况下 load 事件丢失）时也触发兜底
// 不再需要 percent -> 强制完成逻辑

</script>

<template>
  <view class="liquid-thumb" :style="{width: size + 'rpx', height: size + 'rpx', borderRadius: radius + 'rpx'}">
    <view class="glass-bg" :style="{borderRadius: radius + 'rpx'}">
      <view class="liquid-stage">
        <!-- liquid SVG mask -->
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="liquid-svg">
          <defs>
            <clipPath id="wave-clip">
              <!-- rect will be moved by percent via CSS transform -->
              <rect x="0" y="0" width="100" height="100" />
            </clipPath>
          </defs>
          <!-- decorative subtle background behind wave -->
          <rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.06)" />
          <!-- wave group (animated via CSS) -->
          <g clip-path="url(#wave-clip)">
            <path class="wave wave-1" d="M0 30 C 20 10 40 50 60 30 C 80 10 100 50 120 30 L120 120 L0 120 Z" fill="rgba(255,255,255,0.18)"/>
            <path class="wave wave-2" d="M0 35 C 20 15 40 55 60 35 C 80 15 100 55 120 35 L120 120 L0 120 Z" fill="rgba(255,255,255,0.12)"/>
          </g>
        </svg>

        <!-- liquid filler controlled by percent -->
        <view class="liquid-fill" :style="{height: fillHeight}"></view>

        <!-- center content: percent or loading text or thumbnail -->
        <view class="center-content">
          <template v-if="displaySrc && showImage && ((imgLoaded) || internalPercent>=99) && showOnLoaded">
        <image :src="displaySrc" mode="aspectFill" class="thumb-image" @load="handleImgLoad" @error="handleImgError" />
          </template>
          <template v-else>
            <text v-if="internalPercent >= 0 && showPercent" class="percent-text">{{ internalPercent }}%</text>
            <text v-else class="loading-text">加载中</text>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.liquid-thumb {
  position: relative;
}
.glass-bg {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1rpx solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}
.liquid-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.liquid-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.liquid-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.24));
  transition: height 0.6s ease;
  /* slight blur to look glassy */
  mix-blend-mode: screen;
}
.wave {
  transform: translateX(-10%);
  animation: waveMove 6s linear infinite;
  opacity: 0.9;
}
.wave-2 { animation-duration: 8s; opacity: 0.6; transform: translateX(-5%); }
@keyframes waveMove { 0% { transform: translateX(-20%); } 100% { transform: translateX(20%); } }

.center-content {
  position: relative;
  z-index: 3;
  display:flex;
  align-items:center;
  justify-content:center;
}
.percent-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.4);
}
.loading-text {
  font-size: 22rpx;
  color: rgba(255,255,255,0.9);
}
.thumb-image {
  width: 84%;
  height: 84%;
  border-radius: 8rpx;
  object-fit: cover;
}

</style>
