<template>
    <!-- <text style="font-size: 45rpx; margin-bottom: 5%; margin-left: 15rpx;">{{ appName }}</text> -->
<div >
     <image 
         class="logo-image" 
         :src="logo" 
         mode="aspectFit" 
       
         style="cursor: pointer;"
     />
       <!-- @click="navigateToFirstApp" -->
     
</div>
                            
    <view class="banner-wrap">
        <div class="inner-row">
            <div class="left-card" @click="onPrimaryClick">
                <div class="left-card-inner">
                    <div class="left-texts">
                        <div class="main-title">{{ title }}</div>
                        <div class="main-sub">{{ subtitle }}</div>
                        <div class="btns">
                            <button class="pill primary text-2xl text-center align-middle" @click.stop="onPrimaryClick">
                              {{ primaryText }}
                            </button>
                        </div>
                    </div>
                    <div class="left-thumb">
                        <image 
                            class="thumb-image" 
                            :src="image" 
                            mode="aspectFill" 
                            style="cursor: pointer;"
                        />
                    </div>
                </div>
            </div>

            <div class="right-card" @click="onSecondaryClick">
                <div class="right-inner">
                    <div class="texts">
                        <div class="right-title">{{ rightTitle }}</div>
                        <div class="right-desc">{{ rightDesc }}</div>
                         <div class="btns">
                            <button class="pill secondary" @click.stop="onSecondaryClick">{{ rightButtonText }}</button>
                        </div>
                    </div>
                    <div class="right-icon-slot">
                        <slot name="right-icon">
                             <div class="icon-default">
                                <image 
                                    class="right-image" 
                                    :src="image2" 
                                    mode="aspectFill" 
                                    style="cursor: pointer;"
                                />
                             </div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </view>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, shallowRef } from 'vue'
import { useAppStore } from '@/stores/appStore.ts'
import { storeToRefs } from 'pinia'
import type { IWorkFlow } from '@/types'
import { HeadProps } from '@/cofigs/data/globalAppData.ts'
const { workflows_all } = storeToRefs(useAppStore())

// 使用 shallowRef 优化大数组的响应式性能
const filteredResultCache = shallowRef(new Map<string, IWorkFlow[]>())

// 组件挂载时初始化工作流数据
onMounted(async () => {
  await useAppStore().initWorkFlows_All()
})

const props = defineProps({
    logo: { type: String, default: HeadProps.logo },
    appName: { type: String, default: HeadProps.appName },
    title: { type: String, default: HeadProps.title },
    subtitle: { type: String, default: HeadProps.subtitle },
    image: { type: String, default: HeadProps.image },
    image2: { type: String, default: HeadProps.image2 },
    primaryText: { type: String, default: HeadProps.primaryText },
    rightButtonText: { type: String, default: HeadProps.rightButtonText },
    rightTitle: { type: String, default: HeadProps.rightTitle },
    rightDesc: { type: String, default: HeadProps.rightDesc },
    badgeText: { type: String, default: HeadProps.badgeText }
})

const emit = defineEmits(['primary', 'secondary'])

// 筛选与 title 匹配的应用
const matchingApps = computed<IWorkFlow[]>(() => {
  if (!workflows_all.value?.length) return []
  
  const targetTitle = props.title
  
  // 使用缓存避免重复计算
  const cacheKey = `title-${targetTitle}-${workflows_all.value.length}`
  if (filteredResultCache.value.has(cacheKey)) {
    return filteredResultCache.value.get(cacheKey)!
  }
  
  // 筛选包含 title 标签的应用
  const result = workflows_all.value.filter(item => 
    item.tags?.includes(targetTitle)
  )
  
  filteredResultCache.value.set(cacheKey, result)
  console.log(`Filtering apps by title="${targetTitle}": found`, result.length)
  return result
})

// 筛选与 rightTitle 匹配的应用
const rightMatchingApps = computed<IWorkFlow[]>(() => {
    if (!workflows_all.value?.length) return []
    const target = props.rightTitle
    const cacheKey = `right-${target}-${workflows_all.value.length}`
    if (filteredResultCache.value.has(cacheKey)) {
        return filteredResultCache.value.get(cacheKey)!
    }
    const result = workflows_all.value.filter(item => item.tags?.includes(target))
    filteredResultCache.value.set(cacheKey, result)
    console.log(`Filtering apps by rightTitle="${target}": found`, result.length)
    return result
})

// 跳转到匹配 title 标签的应用
const navigateToTitleApp = () => {
    if (matchingApps.value && matchingApps.value.length > 0) {
        const firstMatchingApp = matchingApps.value[0]
        console.log(`跳转到 title="${props.title}" 匹配的应用:`, firstMatchingApp.title)
        uni.navigateTo({ url: `/pages/draw/apps/apps?id=${firstMatchingApp._id}` })
        return true
    }
    return false
}

// 跳转到匹配 rightTitle 标签的应用
const navigateToRightTitleApp = () => {
    if (rightMatchingApps.value && rightMatchingApps.value.length > 0) {
        const firstMatchingApp = rightMatchingApps.value[0]
        console.log(`跳转到 rightTitle="${props.rightTitle}" 匹配的应用:`, firstMatchingApp.title)
        uni.navigateTo({ url: `/pages/draw/apps/apps?id=${firstMatchingApp._id}` })
        return true
    }
    return false
}

// 左侧卡片点击（基于 title 匹配）
function onPrimaryClick(event?: Event) {
    // 阻止事件冒泡
    if (event) {
        event.stopPropagation?.()
    }
    
    if (!navigateToTitleApp()) {
        uni.showToast({ 
            title: `暂无"${props.title}"相关应用`, 
            icon: 'none',
            duration: 2000 
        })
    }
    emit('primary')
}

// 右侧卡片点击（基于 rightTitle 匹配）
function onSecondaryClick(event?: Event) {
    // 阻止事件冒泡
    if (event) {
        event.stopPropagation?.()
    }
    
    if (!navigateToRightTitleApp()) {
        uni.showToast({ 
            title: `暂无"${props.rightTitle}"相关应用`, 
            icon: 'none',
            duration: 2000 
        })
    }
    emit('secondary')
}
</script>

<style scoped lang="scss">
.banner-wrap {
    background: #ffffff00;
    padding: 0;
    border-radius: 20rpx;
    margin-left: 25rpx;
    margin-right: 20rpx;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:active {
        transform: scale(0.98);
        opacity: 0.9;
    }
    margin-bottom: 20rpx;
    
}

.inner-row {
    display: flex;
    gap: 24rpx; /* 统一为 24rpx，与卡片内 padding 对齐 */
    align-items: stretch;
}

/* left small card */
.left-card {
    flex: 1;
    height: auto;
    background: #E9E7FF;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-left: 0rpx; /* 去掉额外左边距，保证与右卡对称 */
}

.left-card-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-grow: 1;
}

.left-texts {
    flex: 1;
    padding-right: 12rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start; /* 内容靠左对齐（文本和按钮） */
}

.main-title {
    font-weight: bold;
    color: #333;
    font-size: 38rpx;
    /* 保持单行并在超出时显示省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: 100%; /* 在 texts 容器中截断 */
}
.right-title {
    font-weight: bold;
    color: #333;
    font-size: 38rpx;
    /* 保持单行并在超出时显示省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: 100%; /* 在 texts 容器中截断 */
}


.main-sub {
    margin-top: 8rpx;
    color: #000000;
    font-size: 20rpx;
    /* 在字符串中的换行符处换行，同时允许普通折行 */
    white-space: pre-line;
    word-break: break-word;

}
.right-desc {
    margin-top: 8rpx;
    color: #000000;
    font-size: 20rpx;
    /* 在字符串中的换行符处换行，同时允许普通折行 */
    white-space: pre-line;
    word-break: break-word;
}


.btns {
    margin-top: 20rpx;
    padding-left: 0;
    display: flex;
    justify-content: flex-start; /* 按钮靠左 */
    align-items: center;
}

.pill {
    display: flex;
    justify-content: center;
    align-items: center; /* 垂直居中 */
    border: none;
    cursor: pointer;
    font-weight: normal;
    width: 150rpx;
    height: 40rpx;
    border-radius: 999rpx;
    font-size: 24rpx;
    padding: 10rpx 24rpx;
    margin: -15rpx; /* 去掉可能的默认外边距 */
    align-self: flex-start; /* 确保按钮在其列中左对齐 */
}

.pill.primary {
    background: #ffffff;
    color: #0b1733;
    box-shadow: 0 4rpx 10px rgba(11, 23, 51, 0.06);
    text-align: center;
    align-items: left;
}

.left-thumb {
    width: 100rpx;
    height: 140rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* 防止图片溢出 */
}

/* 专用于左侧缩略图，避免与右侧图片样式冲突 */
.thumb-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 填充并裁剪，保持居中 */
    border-radius: 16rpx;
    display: block;
}

.right-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 16rpx;
}
.logo-image { 
    margin-top: -9%;
    margin-bottom: -4%;
    margin-left: 25rpx;
    width: 200rpx;
    height: 180rpx;
    border-radius: 16rpx;
}

/* right wide card */
.right-card {
    flex: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:active {
        transform: scale(0.98);
        opacity: 0.9;
    }
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #E4F8E9, #D8F3FF);
    border-radius: 20rpx;
    padding: 24rpx;
    box-sizing: border-box;
    margin-right: 0rpx; /* 去掉额外右边距 */
}

.right-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-grow: 1;
}

.right-card .texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* 允许子元素在 flex 中正确截断 */
    min-width: 0;
    align-items: flex-start; /* 文字和按钮靠左 */
}



.right-icon-slot {
    width: 120rpx;
    height: 120rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pill.secondary {
    background: #ffffff;
    color: #0b1733;
    box-shadow: 0 4rpx 10px rgba(11, 23, 51, 0.06);
}


@media (max-width: 900rpx) {
    .inner-row {
        flex-direction: column;
    }

    .left-card, .right-card {
        width: 100%;
        height: auto;
    }
}
</style>
