# 图鸟 UI vue3 uniapp Plugins - 悬浮按钮

![TuniaoUI vue3 uniapp](https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg 'TuniaoUI vue3 uniapp')

[Tuniao UI vue3官方仓库](https://github.com/tuniaoTech/tuniaoui-rc-vue3-uniapp)

该组件一般用于将按钮现在是页面的指定位置，方便用户进行跳转等操作

## 组件安装

```bash
npm install tnuiv3p-tn-suspend-button
```

## 组件位置

```typescript
import TnSuspendButton from 'tnuiv3p-tn-suspend-button/index.vue'
```

## 平台差异说明

| App(vue) | H5  | 微信小程序 | 支付宝小程序 |  ...   |
| :------: | :-: | :--------: | :----------: | :----: |
|    √     |  √  |     √      |      √       | 适配中 |

## 基础使用

- 通过`icon`属性可以设置按钮显示的图标，可以在默认的插槽中设置按钮的内容

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" />
</template>
```

## 修改按钮的位置

- 通过`top`和`right`属性可以设置悬浮按钮距离顶部和右边的距离, 默认单位为`rpx`, 也可以是一个具体的值

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" top="90%" right="30" />
</template>
```

## 修改按钮的样式

- 通过`bg-color`属性可以修改按钮的背景颜色
- 通过`text-color`属性可以修改按钮的文字颜色
- 通过`size`属性可以设置按钮的大小，默认单位为`rpx`, 内置`sm`、`lg`、`xl`

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" size="sm" />
</template>
```

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" size="140" />
</template>
```

## 修改按钮的形状

- 通过`shape`属性可以修改按钮的形状，默认为`circle`，内置`circle`、`square`

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" shaepe="square" />
</template>
```

## 修改按钮的定位方式

- 通过`fixed`参数可以设置按钮是相对于页面还是相对于父元素进行定位，默认为`true`，即相对于页面进行定位

```vue
<script setup lang="ts"></script>

<template>
  <TnSuspendButton icon="logo-tuniao" :fixed="false" />
</template>
```

## API

### Props

| 属性名     | 说明                                                         | 类型    | 默认值            | 可选值                                                       |
| ---------- | ------------------------------------------------------------ | ------- | ----------------- | ------------------------------------------------------------ |
| icon       | 按钮显示的图标                                               | String  | -                 | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| top        | 按钮距离顶部的距离，默认单位为`rpx`                          | String  | 80%               | -                                                            |
| right      | 按钮距离右边的距离，默认单位为`rpx`                          | String  | 5%                | -                                                            |
| bg-color   | 按钮背景颜色，可以使用图鸟内置的[背景色](https://vue3.tuniaokj.com/zh-CN/guide/style/background.html)、hex、rgb、rgba | String  | `tn-type-primary` | -                                                            |
| text-color | 按钮文字的颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String  | `tn-color-white`  | -                                                            |
| size       | 按钮的尺寸，默认单位为`rpx`，内置了`sm`、`lg`、`xl`          | String  | -                 | `sm`、`lg`、`xl`                                             |
| shape      | 按钮的形状                                                   | String  | `circle`          | `shape`                                                      |
| opacity    | 按钮的透明度                                                 | Number  | `0.9`             | -                                                            |
| shadow     | 是否显示阴影                                                 | Boolean | `true`            | `false`                                                      |
| float      | 是否显示漂浮的动画                                           | Boolean | `true`            | `false`                                                      |
| fixed      | 是否固定位置                                                 | Boolean | `true`            | `false`                                                      |



### Slots

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 按钮的内容 |



### Emits

| 事件名 | 说明         | 类型         |
| ------ | ------------ | ------------ |
| click  | 按钮点击事件 | `() => void` |

