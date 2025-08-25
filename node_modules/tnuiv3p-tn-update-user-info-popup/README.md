# 图鸟 UI vue3 uniapp Plugins - 更新用户信息弹框

![TuniaoUI vue3 uniapp](https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg 'TuniaoUI vue3 uniapp')

[Tuniao UI vue3官方仓库](https://github.com/tuniaoTech/tuniaoui-rc-vue3-uniapp)

该组件一般用于更新用户的头像和昵称信息

## 组件安装

```bash
npm install tnuiv3p-tn-update-user-info-popup
```

## 组件位置

```typescript
import TnUpdateUserInfoPopup from 'tnuiv3p-tn-update-user-info-popup/index.vue'
```

## 平台差异说明

| App(vue) | H5  | 微信小程序 | 支付宝小程序 |  ...   |
| :------: | :-: | :--------: | :----------: | :----: |
|    √     |  √  |     √      |      √       | 适配中 |

## 基础使用

- 通过`v-model:show`来控制弹框的显示和隐藏
- 通过`v-model:avatar`绑定用户头像
- 通过`v-model:nickname`绑定用户昵称

通过`choose-avatar`事件将用户选择的头像上传到服务器，然后将返回的头像地址赋值给`v-model:avatar`

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showPopup = ref<boolean>(false)
const nickname = ref<string>('')
const avatar = ref<string>('')

// 头像选择事件
const avatarChooseHandle = (url: string) => {
  // 换成自己的上传接口
  uni.uploadFile({
    url: '服务器地址',
    fileType: 'image',
    filePath: url,
    name: 'file',
    success: (res) => {
      const data = JSON.parse(res.data)
      avatar.value = data.data.url
    },
  })
}
</script>

<template>
  <TnButton @click="() => (showPopup = true)"> 修改用户信息 </TnButton>

  <TnUpdateUserInfoPopup
    v-model:show="showPopup"
    v-model:nickname="nickname"
    v-model:avatar="avatar"
    @choose-avatar="avatarChooseHandle"
  />
</template>
```

## API

### Props

| 属性名             | 说明                                                         | 类型    | 默认值                                                       | 可选值  |
| ------------------ | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ | ------- |
| show               | 控制弹框显示、隐藏                                           | Boolean | `true`                                                       | `false` |
| avatar             | 用户头像地址                                                 | String  | -                                                            | -       |
| nickname           | 用户昵称                                                     | String  | -                                                            | -       |
| title              | 弹框标题                                                     | String  | `获取您的昵称、头像`                                         | -       |
| tips               | 弹框提示                                                     | String  | `获取用户头像、昵称，主要用于向用户提供具有辨识度的用户体验` | -       |
| confirm-text       | 弹框确认按钮文案                                             | String  | `保 存`                                                      | -       |
| confirm-bg-color   | 弹框按钮背景颜色，可以使用图鸟内置的[背景色](https://vue3.tuniaokj.com/zh-CN/guide/style/background.html)、hex、rgb、rgba | String  | `tn-type-primary`                                            | -       |
| confirm-text-color | 弹框按钮文字颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String  | `tn-white`                                                   | -       |



### Events

| 事件名        | 说明             | 类型                                         |
| ------------- | ---------------- | -------------------------------------------- |
| choose-avatar | 头像选择事件     | `(url: string) => void`                      |
| confirm       | 点击确认按钮事件 | `(avatar: string, nickname: string) => void` |
