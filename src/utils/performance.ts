/**
 * 性能优化工具函数
 */

/**
 * 防抖函数 - 用于优化频繁触发的事件
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  }
}

/**
 * 节流函数 - 用于限制函数执行频率
 * @param fn 要执行的函数
 * @param delay 时间间隔（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 图片懒加载 - 优化图片加载性能
 * @param imagePath 图片路径
 * @param placeholder 占位图
 */
export function lazyLoadImage(imagePath: string, placeholder: string = '/static/images/placeholder.png') {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(imagePath)
    img.onerror = () => resolve(placeholder)
    img.src = imagePath
  })
}

/**
 * 长列表虚拟滚动配置
 */
export const virtualListConfig = {
  // 每屏显示的最大项目数
  pageSize: 20,
  // 缓冲区大小（上下各缓冲的项目数）
  bufferSize: 5,
  // 预加载阈值
  threshold: 100
}

/**
 * 图片压缩
 * @param filePath 图片路径
 * @param quality 压缩质量 0-100
 */
export function compressImage(filePath: string, quality: number = 80): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src: filePath,
      quality: quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 优化大数据渲染 - 分批渲染
 * @param data 数据数组
 * @param batchSize 每批渲染数量
 * @param callback 回调函数
 */
export function batchRender<T>(
  data: T[],
  batchSize: number = 10,
  callback: (batch: T[], done: boolean) => void
) {
  let index = 0
  
  function renderBatch() {
    const batch = data.slice(index, index + batchSize)
    const done = index + batchSize >= data.length
    
    callback(batch, done)
    
    if (!done) {
      index += batchSize
      setTimeout(renderBatch, 50) // 使用 setTimeout 避免阻塞主线程
    }
  }
  
  renderBatch()
}

/**
 * 请求缓存管理
 */
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private maxAge: number = 5 * 60 * 1000 // 默认5分钟过期

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  setMaxAge(age: number) {
    this.maxAge = age
  }
}

export const requestCache = new RequestCache()

/**
 * 内存优化 - 清理无用数据
 */
export function clearMemory() {
  // 清理请求缓存
  requestCache.clear()
  
  // 清理图片缓存
  if (uni.clearStorageSync) {
    try {
      const storage = uni.getStorageInfoSync()
      console.log('清理前存储使用:', storage.currentSize, 'KB')
      
      // 只清理临时数据，保留用户数据
      const keysToRemove = storage.keys.filter(key => 
        key.startsWith('temp_') || 
        key.startsWith('cache_')
      )
      
      keysToRemove.forEach(key => {
        uni.removeStorageSync(key)
      })
      
      console.log('清理后存储使用:', uni.getStorageInfoSync().currentSize, 'KB')
    } catch (e) {
      console.error('清理内存失败:', e)
    }
  }
}

/**
 * 页面性能监控
 */
export function monitorPagePerformance(pageName: string) {
  const startTime = Date.now()
  
  return {
    end: () => {
      const duration = Date.now() - startTime
      console.log(`[性能监控] ${pageName} 加载耗时: ${duration}ms`)
      
      // 如果加载时间超过3秒，记录警告
      if (duration > 3000) {
        console.warn(`[性能警告] ${pageName} 加载过慢: ${duration}ms`)
      }
    }
  }
}
