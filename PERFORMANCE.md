# 安卓性能优化指南

## 已实施的优化措施

### 1. 📦 分包优化
- ✅ 已配置 subPackages，减小主包体积
- ✅ 设置预加载规则，优化首屏加载
- ✅ 启用 App 端分包优化

### 2. ⚙️ 构建配置优化

#### manifest.json
```json
"app-plus": {
  "optimization": {
    "subPackages": true  // 启用分包优化
  },
  "runmode": "liberate",  // 提升性能模式
  "compatible": {
    "ignoreVersion": true  // 忽略版本兼容检查
  }
}
```

#### vite.config.ts
- ✅ 代码压缩：使用 terser 移除 console
- ✅ 代码分割：vendor、ui、utils 分离
- ✅ 依赖预构建优化

### 3. 🎨 页面配置优化

#### pages.json
```json
"app-plus": {
  "bounce": "none",           // 关闭回弹，提升滚动性能
  "scrollIndicator": "none",  // 隐藏滚动条
  "softinputMode": "adjustResize",
  "popGesture": "close"       // 侧滑返回
}
```

### 4. 🛠️ 工具函数

已创建 `utils/performance.ts`，包含：
- ✅ 防抖函数（debounce）
- ✅ 节流函数（throttle）
- ✅ 图片懒加载
- ✅ 图片压缩
- ✅ 分批渲染
- ✅ 请求缓存
- ✅ 内存清理
- ✅ 性能监控

## 🚀 使用建议

### 1. 图片优化
```vue
<template>
  <!-- 使用 lazy-load 属性 -->
  <image 
    :src="imageUrl" 
    mode="aspectFill" 
    lazy-load 
  />
</template>

<script setup>
import { compressImage } from '@/utils/performance'

// 上传前压缩图片
async function uploadImage(filePath) {
  const compressed = await compressImage(filePath, 80)
  // 上传 compressed
}
</script>
```

### 2. 列表优化
```vue
<template>
  <scroll-view 
    @scroll="handleScroll"
    scroll-y
  >
    <!-- 只渲染可见区域的数据 -->
    <view v-for="item in displayList" :key="item.id">
      {{ item.name }}
    </view>
  </scroll-view>
</template>

<script setup>
import { throttle } from '@/utils/performance'

const handleScroll = throttle((e) => {
  // 滚动逻辑
}, 200)
</script>
```

### 3. 搜索优化
```vue
<script setup>
import { debounce } from '@/utils/performance'

const handleSearch = debounce((keyword) => {
  // 搜索逻辑
}, 300)
</script>
```

### 4. 大数据渲染
```vue
<script setup>
import { batchRender } from '@/utils/performance'

function loadData(bigData) {
  batchRender(bigData, 20, (batch, done) => {
    list.value.push(...batch)
    if (done) console.log('完成')
  })
}
</script>
```

### 5. 内存管理
```typescript
import { clearMemory } from '@/utils/performance'

// 在页面卸载或用户退出登录时清理
onUnmounted(() => {
  clearMemory()
})
```

## 📊 性能监控
```typescript
import { monitorPagePerformance } from '@/utils/performance'

onLoad(() => {
  const monitor = monitorPagePerformance('首页')
  
  // 页面加载逻辑...
  
  monitor.end() // 输出加载时间
})
```

## ⚠️ 注意事项

### 避免的性能陷阱

1. **避免频繁的 setData**
   - ❌ 在循环中多次修改数据
   - ✅ 合并数据后一次性更新

2. **避免大图片直接使用**
   - ❌ 使用原图（可能几MB）
   - ✅ 使用压缩后的图片或CDN缩略图

3. **避免过深的组件嵌套**
   - ❌ 超过5层的组件嵌套
   - ✅ 扁平化组件结构

4. **避免在模板中使用复杂计算**
   - ❌ `{{ complexFunction(data) }}`
   - ✅ 使用 computed 属性

5. **避免频繁的页面跳转动画**
   - 设置合适的 animationDuration（200ms 最佳）

## 🔍 性能检查清单

- [ ] 图片是否都添加了 lazy-load
- [ ] 长列表是否实现了分页或虚拟滚动
- [ ] 搜索、滚动等高频事件是否使用了防抖/节流
- [ ] 是否移除了开发环境的 console.log
- [ ] 大数据是否使用了分批渲染
- [ ] 组件卸载时是否清理了定时器和监听器
- [ ] 是否使用了 v-show 代替频繁切换的 v-if
- [ ] 是否合理使用了 computed 而不是 methods

## 📈 优化效果评估

### 优化前
- 首屏加载：3-5秒
- 列表滚动：卡顿
- 内存占用：持续增长

### 优化后（预期）
- 首屏加载：1-2秒 ⚡
- 列表滚动：流畅 ✨
- 内存占用：稳定 📊

## 🛠️ 调试工具

### 1. 微信开发者工具
- 性能面板：查看页面性能指标
- Network：检查请求数量和大小
- Storage：查看存储使用情况

### 2. 真机调试
- 使用低端安卓设备测试
- 监控内存使用
- 记录帧率（FPS）

### 3. 控制台输出
```typescript
// 在关键位置添加性能监控
console.time('数据加载')
// ... 加载逻辑
console.timeEnd('数据加载')
```

## 📚 参考资料

- [uni-app 性能优化](https://uniapp.dcloud.net.cn/tutorial/performance.html)
- [微信小程序性能优化](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/)
- [Vue 3 性能优化](https://vuejs.org/guide/best-practices/performance.html)
