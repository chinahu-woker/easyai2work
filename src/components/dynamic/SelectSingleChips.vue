<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import ParamCard from '@/components/common/ParamCard.vue'
import MyTitle from '@/components/common/MyTitle.vue'
import type { IDynamicOptions } from '@/types'

interface Props {
    title?: string
    workflow_id?: string
    options?: IDynamicOptions | any
}

const props = withDefaults(defineProps<Props>(), {
    title: '请选择',
    workflow_id: '',
    options: () => ({ attributes: [] })
})

// 支持两种 options 形态：直接数组或 { attributes: [...] }
const mergedOptions = computed(() => {
    if (Array.isArray(props.options)) return { attributes: props.options }
    if (props.options && Array.isArray(props.options.attributes)) return props.options
    return { attributes: [] }
})

const attributes = computed(() => mergedOptions.value.attributes || [])

// v-model 返回字符串（优先 item.value，否则 item.title）
const selected = defineModel<string | null>({ default: null })

// 初始化：若无初始值，选第一个（返回字符串）
onMounted(() => {
    if ((!selected || !selected.value) && attributes.value.length > 0) {
        const first = attributes.value[0]
        selected.value = first?.value ?? first?.title ?? null
    } else if (selected && selected.value && attributes.value.length > 0) {
        // 若父级传入了初始字符串，确保它仍存在于 options 中，否则重置为第一个
        const exists = attributes.value.some((a: any) => (a?.value ?? a?.title) === selected.value)
        if (!exists) selected.value = attributes.value[0]?.value ?? attributes.value[0]?.title ?? null
    }
})

// 当 options 变化时，确保 selected 合法；若为空则默认第一个
watch(attributes, (newAttrs) => {
    if (!newAttrs || newAttrs.length === 0) return
    const exists = newAttrs.some((a: any) => (a?.value ?? a?.title) === (selected.value ?? null))
    if (!exists) {
        selected.value = newAttrs[0]?.value ?? newAttrs[0]?.title ?? null
    }
}, { immediate: true })

const onSelect = (item: any) => {
    selected.value = item?.value ?? null
}

const isSelected = (item: any) => {
    if (!selected || !selected.value) return false
    const itemVal = item?.value ?? item?.title
    return selected.value === itemVal
}

// 尝试从全局 CSS 变量取主题色，若不可用使用默认色
const themeColor = (() => {
    try {
        if (typeof window !== 'undefined' && window.getComputedStyle) {
            const v = window.getComputedStyle(document.documentElement).getPropertyValue('--u-primary')
            if (v && v.trim()) return v.trim()
        }
    } catch (e) { }
    return '#6a48ff' // fallback 主色（可按项目主题调整）
})()
</script>

<template>
    <ParamCard>
        <template #title>
            <MyTitle :title="props.title" />
        </template>
        <template #body>
            <view class="chips-wrap">
                <view v-for="(item, idx) in attributes" :key="idx" class="chip">
                    <fui-tag :radius="15" :text="item.title || item.value" :type="isSelected(item) ? 'primary' : ''"
                        :theme="isSelected(item) ? 'light' : 'plain'" :size="30" :isBorder="!isSelected(item)"
                        @click="onSelect(item)" />
                </view>
            </view>
        </template>
    </ParamCard>
</template>



<style scoped lang="scss">
.chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
}

.chip {
    margin: 0;
}
</style>