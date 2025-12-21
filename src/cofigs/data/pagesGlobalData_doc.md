# pagesGlobalData.json 配置文档

## 概述

`pagesGlobalData.json` 是 uniapp 项目的全局页面配置数据文件，用于动态配置应用的页面布局、组件属性、样式等。通过修改此文件，可以实现页面内容的动态调整，无需修改代码。

## 文件结构

```json
{
  "iconTagName": [...],           // 图标标签配置
  "globalAppData": {...},         // 全局应用数据
  "organizations_store": [...],   // 组织机构配置
  "tabbarData": [...],            // 底部导航栏配置
  "backGroundImage": "...",       // 全局背景图片
  "HeadProps": {...},             // 头部组件属性
  "iconData": {...},              // 图标网格数据
  "storeProps": {...},            // 应用商店属性
  "aiTeamProps": {...},           // AI团队属性
  "payWorkProps": {...},          // 付费作品属性
  "loginInfoIcons": {...},        // 登录信息图标
  "pageComponents": {...},        // 页面组件配置
  "dynamicComponentRules": {...}  // 动态组件规则
}
```

## 详细参数说明

### 1. iconTagName (图标标签配置)

**类型**: `Array<Object>`  
**作用**: 定义图标标签的名称和索引，用于标识不同的图标样式或分类。

**字段说明**:
- `name` (string): 图标标签的唯一标识符，通常对应后端API的样式名称
- `index` (number): 标签的索引位置，从0开始

**示例**:
```json
[
  {
    "name": "Style-depth-510nail_8style",
    "index": 0
  },
  {
    "name": "fakenail2manicure1",
    "index": 1
  }
]
```

**修改注意**: 确保 `name` 与后端API返回的样式名称一致，`index` 唯一且连续。

---

### 2. globalAppData (全局应用数据)

**类型**: `Object`  
**作用**: 存储应用级别的全局配置信息，如分享信息等。

**字段说明**:
- `name` (string): 配置名称标识
- `share` (Object): 分享相关配置
  - `appInfo` (string): 应用分享描述
  - `backGroundImage` (string): 分享背景图片URL

**示例**:
```json
{
  "name": "globalAppData",
  "share": {
    "appInfo": "这款全民使用的AI程序，简直好用到爆炸",
    "backGroundImage": "https://aikna.cn/api/upload/files/..."
  }
}
```

---

### 3. organizations_store (组织机构配置)

**类型**: `Array<string>`  
**作用**: 定义可用的组织机构标识，用于权限控制和内容过滤。

**示例**:
```json
["None", "68d23a545ae1fbd83108633a", "68c4d63fd9d81c765dd8c3cd"]
```

**允许值**: 字符串数组，每个元素为组织ID或"None"

---

### 4. tabbarData (底部导航栏配置)

**类型**: `Array<Object>`  
**作用**: 配置底部导航栏的各个tab项，包括文本、图标、权限等。

**字段说明**:
- `text` (string): tab显示的文字
- `tabText` (string): tab的唯一标识符，用于页面路由
- `iconPath` (string): 未选中状态的图标URL
- `selectedIconPath` (string): 选中状态的图标URL
- `organizations` (Array<string>): 允许访问此tab的组织ID列表
- `navigateToMiniProgram`(object): 跳转到小程序的配置项 （需要在微信公众平台后台关联目标小程序）
	`appId`: " ",
	`path`: "pages/index/index", 跳转页面
	`extraData`: {},
	`envVersion`: "release", 环境版本：release：正式版、trial：体验版、develop：开发版
	`shortLink`: "#小程序://酒旅邦/NgruQmzjAqGk7nm" 小程序分享链接
	  

**示例**:
```json
[
  {
    "text": "首页",
    "tabText": "home",
    "iconPath": "https://static.nailoffice.cn/...",
    "selectedIconPath": "https://static.nailoffice.cn/...",
    "organizations": ["None"]
  }
]
```

**修改注意**:
- 图标URL必须是可访问的图片链接
- `organizations` 中的ID必须在 `organizations_store` 中定义
- 最多支持5个tab

---

### 5. backGroundImage (全局背景图片)

**类型**: `string`  
**作用**: 设置应用的全局背景图片。

**示例**:
```json
"https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg"
```

---

### 6. HeadProps (头部组件属性)

**类型**: `Object`  
**作用**: 配置首页头部组件的显示内容和样式。

**字段说明**:
- `logo` (string): 应用logo图片URL
- `appName` (string): 应用名称
- `title` (string): 主标题
- `subtitle` (string): 副标题，支持\n换行
- `image` (string): 主展示图片URL
- `image2` (string): 辅助图片URL
- `primaryText` (string): 主要按钮文本
- `rightButtonText` (string): 右侧按钮文本
- `rightTitle` (string): 右侧区域标题
- `rightDesc` (string): 右侧区域描述
- `badgeText` (string): 徽章文本

**示例**:
```json
{
  "logo": "https://static.nailoffice.cn/...",
  "appName": "聚类AI",
  "title": "AIGC",
  "subtitle": "上传图片\n生成专属内容",
  "primaryText": "免费体验",
  "badgeText": "VIP"
}
```

---

### 7. iconData (图标网格数据)

**类型**: `Object`  
**作用**: 配置首页图标网格的布局和功能图标。

**字段说明**:
- `icons` (Array<Object>): 图标列表
  - `id` (string): 图标唯一标识
  - `symbol` (string): 图标样式类名
  - `label` (string): 图标显示文字
  - `iconUrl` (string) 可以使用网络链接图标，支持自定义！
  - `action` (string): 点击后执行的动作标识
  - `matchKeywords` (Array<string>): 搜索匹配关键词
  - `actionButton` (string): 是否为操作按钮 ("true"/"false")
- `columns` (number): 每行显示的图标数量
- `iconSize` (number): 图标大小（单位：rpx）
- `gap` (number): 图标间距（单位：rpx）

**示例**:
```json
{
  "icons": [
    {
      "id": "icon-remen",
      "symbol": "iconfontIndex",
      "label": "热门应用",
      "action": "ai_expand",
      "matchKeywords": ["热门", "热门应用"],
      "actionButton": "false"
    }
  ],
  "columns": 4,
  "iconSize": 100,
  "gap": 42
}
```

---

### 8. storeProps (应用商店属性)

**类型**: `Object`  
**作用**: 配置应用商店页面的筛选和显示属性。

**字段说明**:
- `showTag` (string): 默认显示的标签
- `showTags` (Array<string>): 可用的标签列表
- `filterMode` (string): 筛选模式 ("any"/"single")

**示例**:
```json
{
  "showTag": "AI工具",
  "showTags": ["图生视频", "AI产品生成", "AI重绘"],
  "filterMode": "any"
}
```

---

### 9. aiTeamProps (AI团队属性)

**类型**: `Object`  
**作用**: 配置AI团队页面的显示属性。

**字段说明**:
- `title` (string): 页面标题
- `filterMode` (string): 筛选模式

---

### 10. payWorkProps (付费作品属性)

**类型**: `Object`  
**作用**: 配置付费作品页面的显示属性。

**字段说明**:
- `title` (string): 页面标题
- `showTag` (string): 显示标签

---

### 11. loginInfoIcons (登录信息图标)

**类型**: `Object`  
**作用**: 配置登录页面的图标资源。

**字段说明**:
- `scanIcon` (string): 扫码图标
- `arrowIcon` (string): 箭头图标
- `historyIcon` (string): 历史记录图标URL
- `chatIcon` (string): 聊天图标URL
- `logoutIcon` (string): 退出登录图标URL
- `consoleIcon` (string): 控制台图标URL
- `bannerImage` (string): 横幅图片URL

---

### 12. pageComponents (页面组件配置)

**类型**: `Object`  
**作用**: 定义各个页面的组件布局和属性配置。

**结构说明**:
- 键名: 页面标识符 ("home", "store", "profile", "login")
- 值: 页面配置对象
  - `title` (string): 页面标题
  - `components` (Array<Object>): 组件列表
    - `id` (string): 组件唯一标识
    - `component` (string): 组件名称
    - `props` (Object): 组件属性，支持占位符语法 `{{变量名}}`
    - `style` (Object): 组件样式
  - `layout` (Object): 页面布局配置

**占位符语法说明**:
- 使用 `{{变量名}}` 引用其他配置项的值
- 例如: `"logo": "{{HeadProps.logo}}"` 会引用 `HeadProps.logo` 的值

**示例**:
```json
{
  "home": {
    "title": "首页",
    "components": [
      {
        "id": "home-header",
        "component": "Newhead",
        "props": {
          "logo": "{{HeadProps.logo}}",
          "appName": "{{HeadProps.appName}}"
        },
        "style": {
          "marginBottom": "20rpx"
        }
      }
    ],
    "layout": {
      "padding": "20rpx",
      "backgroundColor": "#f5f5f5"
    }
  }
}
```

---

### 13. dynamicComponentRules (动态组件规则)

**类型**: `Object`  
**作用**: 定义组件的显示条件和权限控制规则。

**结构说明**:
- 键名: 页面标识符
- 值: 规则数组
  - `componentId` (string): 组件ID，对应 `pageComponents` 中的组件
  - `conditions` (Object): 显示条件
    - `userStatus` (string): 用户状态 ("all"/"loggedIn"/"notLoggedIn")
    - `organizations` (Array<string>): 允许的组织ID列表（可选）

**示例**:
```json
{
  "home": [
    {
      "componentId": "home-header",
      "conditions": {
        "userStatus": "all"
      }
    }
  ],
  "store": [
    {
      "componentId": "store-paywork",
      "conditions": {
        "userStatus": "loggedIn",
        "organizations": ["68d23a545ae1fbd83108633a", "68c4d63fd9d81c765dd8c3cd"]
      }
    }
  ]
}
```

## 使用指南

### 1. 添加新页面

1. 在 `pageComponents` 中添加新页面配置
2. 在 `dynamicComponentRules` 中添加对应的显示规则
3. 如需要，在 `tabbarData` 中添加底部导航

### 2. 添加新组件

1. 在目标页面的 `components` 数组中添加组件配置
2. 设置 `id`、`component`、`props`、`style`
3. 在 `dynamicComponentRules` 中添加显示条件

### 3. 使用占位符引用

```json
// 在组件props中使用占位符
"props": {
  "logo": "{{HeadProps.logo}}",
  "title": "{{HeadProps.title}}"
}
```

### 4. 添加新标签页

```json
// 在tabbarData中添加
{
  "text": "新页面",
  "tabText": "newpage",
  "iconPath": "https://...",
  "selectedIconPath": "https://...",
  "organizations": ["None"]
}
```

### 5. 权限控制

```json
// 只对特定组织显示组件
{
  "componentId": "vip-feature",
  "conditions": {
    "userStatus": "loggedIn",
    "organizations": ["vip-org-id"]
  }
}
```

## 修改注意事项

1. **URL链接**: 确保所有图片URL都是可访问的HTTPS链接
2. **占位符语法**: 使用 `{{变量名}}` 引用其他配置项的值
3. **组件ID**: 确保 `componentId` 在 `pageComponents` 中存在
4. **组织权限**: `organizations` 中的ID必须在 `organizations_store` 中定义
5. **JSON格式**: 保持正确的JSON格式，避免语法错误
6. **热更新**: 修改后需要重新启动应用才能生效

## 常见问题

### Q: 修改配置后不生效？
A: 需要重新启动应用，配置是应用启动时加载的。

### Q: 图片不显示？
A: 检查URL是否正确，是否支持HTTPS，是否跨域。

### Q: 组件不显示？
A: 检查 `dynamicComponentRules` 中的条件是否满足。

### Q: 如何添加新的组件类型？
A: 在 `pageComponents` 中使用已存在的组件名，或开发新组件后添加。

---

*最后更新时间: 2025年11月9日*