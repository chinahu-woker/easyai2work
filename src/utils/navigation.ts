/**
 * 页面导航辅助函数
 * 统一管理页面跳转逻辑，优化用户体验
 */

/**
 * 智能返回上一页
 * 优先使用 navigateBack，如果没有上一页则跳转到指定页面或首页
 */
export const smartNavigateBack = (fallbackUrl: string = '/pages/index/index') => {
  const pages = getCurrentPages()
  
  if (pages.length > 1) {
    // 如果有上一页，直接返回
    uni.navigateBack({
      delta: 1,
      animationType: 'pop-out',
      animationDuration: 200
    })
  } else {
    // 如果没有上一页，判断是否为 tabBar 页面
    const isTabBarPage = ['/pages/index/index', '/pages/home/home'].includes(fallbackUrl)
    
    if (isTabBarPage) {
      uni.switchTab({ url: fallbackUrl })
    } else {
      uni.navigateTo({ url: fallbackUrl })
    }
  }
}

/**
 * 跳转到应用页面
 * 使用 navigateTo 保持页面栈
 */
export const navigateToApp = (appId: string, params: Record<string, any> = {}) => {
  let url = `/pages/draw/apps/apps?id=${appId}`
  
  // 添加额外参数
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  
  if (queryParams) {
    url += '&' + queryParams
  }
  
  uni.navigateTo({ url })
}

/**
 * 跳转到首页指定页面索引
 */
export const navigateToHomePage = (pageIndex: number = 0) => {
  uni.switchTab({ 
    url: `/pages/index/index?pageindex=${pageIndex}` 
  })
}

/**
 * 检查是否为 tabBar 页面
 */
export const isTabBarPage = (url: string): boolean => {
  const tabBarPages = [
    '/pages/index/index',
    '/pages/home/home',
    '/pages/creative/creative'
  ]
  return tabBarPages.some(page => url.includes(page))
}