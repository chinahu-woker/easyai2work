import pagesGlobalDataJson from './pagesGlobalData.json'

// 从 JSON 文件导入配置数据
export const globalAppData = pagesGlobalDataJson.globalAppData

export const tabbarData = pagesGlobalDataJson.tabbarData

export const backGroundImage = pagesGlobalDataJson.backGroundImage

// Newhead 组件的 props 默认值
//使用说明：前端的逻辑是通过标签名来实现区分，这里是顶部两个区域的标签名称、图片、logo、副标题数据
//logo 建议200*180 左侧图片100*140 右侧 140*140 建议图片都使用SVG格式这样显示不会模糊
export const HeadProps = pagesGlobalDataJson.HeadProps

// NewIcon 组件的图标数据配置
// 使用说明：前端的逻辑是通过 action 来实现区分，这里是图标的名称、图标对应的功能action、匹配关键词、是否显示按钮
// action 对应的功能需要在 pages/index/index.vue 的 handleIconClick 方法中实现
// matchKeywords 用于搜索匹配关键词，多个关键词用数组表示
// actionButton 是否显示是跳转客服，true 启用，false 不启用
export const iconData = pagesGlobalDataJson.iconData

// AI团队组件的配置数据
export const storeProps = pagesGlobalDataJson.storeProps

// 付费应用组件的筛选配置数据
export const payWorkProps = pagesGlobalDataJson.payWorkProps

