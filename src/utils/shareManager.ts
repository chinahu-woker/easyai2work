// 分享状态管理
import { ref } from 'vue'

// 分享数据接口
export interface ShareData {
  title?: string
  path?: string
  imageUrl?: string
  itemId?: string
}

// 当前分享数据
const currentShareData = ref<ShareData>({})

// 设置分享数据
export function setShareData(data: ShareData) {
  currentShareData.value = { ...data }
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
    title: `${title} - 精美美甲设计 | NAILOFFICE-AI`,
    path: `/pages/drawLike/alike?id=${itemId}`,
    imageUrl: imageUrl || '',
    itemId
  }
}

// 生成社区页分享数据
export function generateCommunityShareData(): ShareData {
  return {
    title: '发现精美美甲设计，快来看看吧~ | NAILOFFICE-AI',
    path: '/pages/index/index?pageindex=2',
    imageUrl: ''
  }
}