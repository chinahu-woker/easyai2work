<!-- 
  性能优化示例组件
  展示如何在组件中应用性能优化最佳实践
-->
<template>
  <view class="performance-demo">
    <!-- 使用 v-show 代替 v-if（频繁切换的元素） -->
    <view v-show="visible" class="content">
      <!-- 图片懒加载 -->
      <image 
        v-for="(img, index) in visibleImages" 
        :key="index"
        :src="img"
        mode="aspectFill"
        lazy-load
        class="lazy-image"
      />
      
      <!-- 长列表优化：使用分页 -->
      <view 
        v-for="(item, index) in displayList" 
        :key="item.id || index"
        class="list-item"
      >
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { debounce, throttle, batchRender } from '@/utils/performance'

const visible = ref(true)
const fullList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 20

// 使用计算属性而不是方法
const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return fullList.value.slice(start, start + pageSize)
})

// 图片懒加载列表
const visibleImages = ref<string[]>([])

// 防抖搜索
const handleSearch = debounce((keyword: string) => {
  console.log('搜索关键词:', keyword)
  // 执行搜索逻辑
}, 300)

// 节流滚动事件
const handleScroll = throttle((e: any) => {
  const { scrollTop, scrollHeight, height } = e.detail
  
  // 触底加载更多
  if (scrollTop + height >= scrollHeight - 100) {
    loadMore()
  }
}, 200)

// 加载更多数据
function loadMore() {
  if (currentPage.value * pageSize >= fullList.value.length) {
    return
  }
  currentPage.value++
}

// 分批渲染大量数据
function loadBigData(data: any[]) {
  fullList.value = [] // 清空
  
  batchRender(data, 20, (batch, done) => {
    fullList.value.push(...batch)
    
    if (done) {
      console.log('数据渲染完成')
    }
  })
}

// 组件卸载时清理
onUnmounted(() => {
  fullList.value = []
  visibleImages.value = []
})

defineExpose({
  handleSearch,
  handleScroll,
  loadBigData
})
</script>

<style scoped>
.performance-demo {
  padding: 20rpx;
}

.lazy-image {
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
}

.list-item {
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}
</style>
