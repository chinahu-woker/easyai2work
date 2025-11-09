// 分享状态管理
import { ref, toRaw } from 'vue'

// 分享数据接口
export interface ShareData {
  title?: string
  path?: string
  imageUrl?: string
  itemId?: string
}

// 当前分享数据
const currentShareData = ref<ShareData>({})
console.log('初始化全局分享数据:', currentShareData.value)
// 设置分享数据
export function setShareData(data: ShareData) {
  try {
    // 如果 data 是响应式 Proxy，使用 toRaw 将其转为普通对象
    const raw = typeof toRaw === 'function' ? toRaw(data as any) : data
    // 深拷贝一份以防止引用问题
    currentShareData.value = JSON.parse(JSON.stringify(raw || {}))
  } catch (e) {
    // 回退：直接浅拷贝
    currentShareData.value = { ...(data as any) }
  }
  console.log('设置全局分享数据:', currentShareData.value)
}

// 获取分享数据
export function getShareData(): ShareData {
  return currentShareData.value
}

// 清除分享数据
export function clearShareData() {
  currentShareData.value = {}
}

// 生成详情页分享数据
export function generateDetailShareData(itemId: string, title: string, imageUrl?: string): ShareData {
  return {
    title: `${title} - 这款全民使用的AI程序，简直好用到爆炸`,
    path: `/pagesDrawLike/alike?id=${itemId}`,
    imageUrl: imageUrl || '',
    itemId
  }
}

// 生成社区页分享数据
export function generateCommunityShareData(): ShareData {
  return {
    title: '这款全民使用的AI程序，简直好用到爆炸',
    path: '/pages/index/index?pageindex=2',
    imageUrl: ''
  }
}