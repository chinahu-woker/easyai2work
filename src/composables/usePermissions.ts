// 可复用的权限判断函数
// 用法：hasAppPermission(app.organizations, user.organizations, organizationsStoreConfig)

export const intersectionExists = (a?: string[], b?: string[]) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) return false
  const setB = new Set(b)
  return a.some(x => setB.has(x))
}

/**
 * 判断应用是否对当前用户可见（基于组织 ID 匹配）
 * @param appOrgs 应用配置的 organizations 数组
 * @param userOrgs 当前用户的 organizations 数组（优先）
 * @param fallbackOrgs 回退的组织配置（例如 pagesGlobalData.json 中的 organizations_store）
 * @returns 是否有访问权限（布尔）
 */
export const hasAppPermission = (appOrgs?: string[] | null, userOrgs?: string[] | null, fallbackOrgs?: string[] | null): boolean => {
  try {
    // 如果应用的 organizations 是空数组，视为公开（所有人可见）
    if (!Array.isArray(appOrgs)) return false
    if (Array.isArray(appOrgs) && appOrgs.length === 0) return true

    // 特殊值 'None' 表示未登录用户也可见
    if (appOrgs.includes('None')) {
      return true
    }

    // 优先使用用户所属组织进行判断
    if (Array.isArray(userOrgs) && userOrgs.length > 0) {
      return intersectionExists(appOrgs, userOrgs)
    }

    // 回退使用配置中的 organizations（如果有）
    if (Array.isArray(fallbackOrgs) && fallbackOrgs.length > 0) {
      return intersectionExists(appOrgs, fallbackOrgs)
    }

    return false
  } catch (e) {
    // 出错则默认不展示
    console.error('hasAppPermission error', e)
    return false
  }
}

export default hasAppPermission
