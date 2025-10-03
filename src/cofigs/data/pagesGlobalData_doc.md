
# pagesGlobalData 使用说明文档

本文档基于 `pagesGlobalData.json`（位于 `src/cofigs/data/pagesGlobalData.json`）生成，目的是为前端开发者和产品人员说明全局页面配置的字段含义、常用示例以及在模板中如何引用这些配置。

> 说明：项目中很多页面或动态组件会通过占位符语法 `{{...}}` 在运行时注入配置项（例如 `"logo": "{{HeadProps.logo}}"`）。请确保占位符路径在 `pagesGlobalData.json` 中存在对应字段。

## 顶层字段概览

- `iconTagName`: 图标标签/缩略名数组，常用于 icon 列表或检索。
- `globalAppData`: 全局应用信息（如分享文案等）。
- `organizations_store`: 默认的组织 ID 列表（用于权限/展示过滤）。
- `tabbarData`: APP 底部 tab 配置数组（每项包含文本、图标路径等）。
- `backGroundImage`: 全局背景图 URL。
- `HeadProps`: 顶部/首页头部相关属性集合（logo、appName、title、subtitle、按钮文案等）。
- `iconData`: 首页图标数据和布局（包括每个 icon 的 action、label、匹配关键词等）。
- `storeProps`: 应用商店页面的一些展示配置。
- `payWorkProps`: 付费应用页面的展示配置。
- `loginInfoIcons`: 登录相关页面/组件的图标配置。
- `pageComponents`: 每个页面的组件布局与组件配置（用于动态页面构建）。
- `dynamicComponentRules`: 动态组件显示规则（按页面和条件控制组件是否显示）。

## 主要字段详解与示例

### iconTagName
用途：提供图标分类或检索标签。
示例：
```
"iconTagName": [ { "name": "Style-depth-...", "index": 0 }, ... ]
```

### globalAppData
用途：全局可复用的信息（例如分享文本）。
示例：
```
"globalAppData": { "name": "globalAppData", "share": { "appInfo": "这款全民使用的AI程序..." } }
```

### tabbarData
用途：APP 底部 TabBar 的文本和图标路径配置。
示例：
```
{ "text": "首页", "tabText": "home", "iconPath": "...", "selectedIconPath": "..." }
```
在页面中使用：通常由 TabBar 组件读取并渲染。

### HeadProps
用途：首页/头部组件的数据映射，包含 logo、标题、描述、按钮文本等。
常见占位用法：`"logo": "{{HeadProps.logo}}"` 在组件 props 中会被替换为实际 URL。
示例字段：
- `logo`: 顶部 logo URL
- `appName`: 应用名
- `title`: 页面主标题
- `subtitle`: 副标题（可含换行）
- `image`, `image2`: 装饰图片
- `primaryText`, `rightButtonText`, `rightTitle`, `rightDesc`, `badgeText`

### iconData
用途：配置首页主图标集合、每个按钮的 action（用于触发不同功能）。
示例：
```
"iconData": { "icons": [ { "id": "icon-remen", "label": "热门应用", "action": "ai_expand" } ], "columns": 4 }
```
action 字段通常在点击处理函数中做路由或逻辑分发（例如 action = "ai_expand" 对应某个功能入口）。

### pageComponents
用途：按页面（如 `home`、`store`、`profile`）定义要渲染的组件序列与每个组件的 props 与样式。
示例结构：
```
"pageComponents": {
	"home": {
		"title": "首页",
		"components": [ { "id": "home-header", "component": "Newhead", "props": { "logo": "{{HeadProps.logo}}" } } ]
	}
}
```
使用方式：项目会读取该结构并按顺序渲染 `component`，并对 `props` 中的占位符进行替换。

### dynamicComponentRules
用途：控制哪些动态组件在特定页面显示或隐藏（按条件过滤，例如用户登录状态或组织）。
示例：
```
"dynamicComponentRules": { "home": [ { "componentId": "home-header", "conditions": { "userStatus": "all" } } ] }
```

## 占位符语法与替换规则
- 占位符使用 `{{path.to.field}}` 的格式。渲染引擎在构建组件 props 时会用 `pagesGlobalData.json` 中对应的值替换占位符。
- 支持嵌套：例如 `{{HeadProps.logo}}` 会解析为 `pagesGlobalData.HeadProps.logo`。
- 若占位符路径不存在，渲染时应该有兜底逻辑（避免报错），建议在渲染层使用短路或默认值。

## 示例：如何在页面中引用
- 在 `pageComponents.home.components` 中看到：
```
{ "component": "Newhead", "props": { "logo": "{{HeadProps.logo}}", "appName": "{{HeadProps.appName}}" } }
```
渲染引擎会把 `logo` 与 `appName` 注入到 `Newhead` 组件的 props 中。

## 推荐实践
1. 规范字段命名：尽量使用驼峰或下划线的统一风格，便于占位符查找与替换。
2. 为关键字段提供默认值：在渲染时对缺失字段做容错（例如 `logo || '/static/default-logo.png'`）。
3. 对动态组件的 props 做类型约束：尤其是 `props.options` 之类的动态数据，建议在组件内有默认值与校验。
4. 如果某些页面需要按组织显示内容，优先在 `dynamicComponentRules` 中配置，而不是在组件内写复杂的逻辑判断。

## 常见问题与排查
- 问：占位符替换后仍显示 `{{HeadProps.logo}}`？
	- 检查渲染引擎是否在渲染前执行了占位符替换（确保数据加载顺序正确）。
	- 检查路径是否拼写正确。

- 问：图片 URL 加载失败导致样式错乱？
	- 为图片资源设置 fallback（例如在组件中设置 `onError` 替换为默认图）。

## 附录：pagesGlobalData.json 中的示例片段
（以下为摘录示例，详见 `pagesGlobalData.json`）

```
"HeadProps": {
	"logo": "https://.../logo.svg",
	"appName": "聚类AI",
	"title": "AIGC",
	"subtitle": "上传图片\n生成专属内容"
}

"tabbarData": [
	{ "text": "首页", "tabText": "home", "iconPath": "...", "selectedIconPath": "..." },
	{ "text": "应用", "tabText": "store", ... }
]

"pageComponents": {
	"home": {
		"title": "首页",
		"components": [ { "id": "home-header", "component": "Newhead", "props": { "logo": "{{HeadProps.logo}}" } } ]
	}
}
```

---

如需我将此文档进一步转换为团队内部可编辑模板（例如包含每个字段的类型注释、示例值与可选/必选标记），我可以继续扩展。现在我将该任务标记为已完成。

