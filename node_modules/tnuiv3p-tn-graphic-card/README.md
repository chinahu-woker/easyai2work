# 图鸟 UI vue3 uniapp Plugins - 图文卡片

![TuniaoUI vue3 uniapp](https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg 'TuniaoUI vue3 uniapp')

[Tuniao UI vue3官方仓库](https://github.com/tuniaoTech/tuniaoui-rc-vue3-uniapp)

该组件一般用于展示图文简要的信息，让用户可以快速查看筛选数据。

## 组件安装

```bash
npm install tnuiv3p-tn-graphic-card
```

## 组件位置

```typescript
import TnGraphicCard from 'tnuiv3p-tn-graphic-card/index.vue'
```

## 平台差异说明

| App(vue) | H5  | 微信小程序 | 支付宝小程序 |  ...   |
| :------: | :-: | :--------: | :----------: | :----: |
|    √     |  √  |     √      |      √       | 适配中 |

## 基础使用

- 通过`avatar`设置作者的头像
- 通过`title`设置标题
- 通过`description`设置描述
- 通过`tags`设置内容的标签，传递一个字符串数组
- 通过`content`设置文章的简要内容
- 通过`images`设置文章的图片
- 通过`viewCount`设置文章的浏览量
- 通过`commentCount`设置文章的评论量
- 通过`likeCount`设置文章的点赞量
- 通过`viewUserAvatars`设置浏览用户的头像，传递一个头像url地址的字符串数组

只有`avatar`、`title`、`description`为必填项，其他都为选填项

```vue
<script lang="ts" setup>
const graphicData = {
  id: 1,
  avatar: 'https://tnuiimage.tnkjapp.com/uniapp_market/circle/3-image.jpg',
  title: '文章标题',
  description: '2023年6月30日',
  tags: ['标签1', '标签2'],
  content:
    '看看打开打开年份记得当年开始放假哦额外欺骗人u饿哦漂亮放佛怕打雷舒服呢我脾气破费了发多少呢；否，可能打飞机哦喷泉哦怕可能地方打开螺丝粉年份的肌肤看能否。',
  images: [
    'https://tnuiimage.tnkjapp.com/swiper/ad1.jpg',
    'https://tnuiimage.tnkjapp.com/swiper/ad2.jpg',
    'https://tnuiimage.tnkjapp.com/swiper/ad3.jpg',
    'https://tnuiimage.tnkjapp.com/swiper/ad4.jpg',
  ],
  viewCount: 100,
  commentCount: 101,
  likeCount: 102,
  viewUserAvatars: [
    'https://tnuiimage.tnkjapp.com/avatar/normal/1.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/2.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/3.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/4.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/5.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/6.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/7.png',
    'https://tnuiimage.tnkjapp.com/avatar/normal/8.png',
  ],
}
</script>

<template>
  <TnGraphicCard
    :avatar="graphicData.avatar"
    :title="graphicData.title"
    :description="graphicData.description"
    :tags="graphicData.tags"
    :content="graphicData.content"
    :images="graphicData.images"
    :view-count="graphicData.viewCount"
    :comment-count="graphicData.commentCount"
    :like-count="graphicData.likeCount"
    :view-user-avatars="graphicData.viewUserAvatars"
  />
</template>
```

## 设置查看、评论、点赞的状态

设置`show-view`、`show-comment`、`show-like`属性为`true`，则显示对应的状态，否则不显示

设置`active-show`、`active-comment`、`active-like`属性为`true`，则显示对应的状态为激活状态，否则为未激活状态

#### 隐藏查看数据并且设置为已点赞

```vue
<template>
  <TnGraphicCard
    :avatar="graphicData.avatar"
    :title="graphicData.title"
    :description="graphicData.description"
    :tags="graphicData.tags"
    :content="graphicData.content"
    :images="graphicData.images"
    :view-count="graphicData.viewCount"
    :comment-count="graphicData.commentCount"
    :like-count="graphicData.likeCount"
    :view-user-avatars="graphicData.viewUserAvatars"
    :show-view="false"
    active-like
  />
</template>
```

## 设置显示最大显示浏览用户头像数量

设置`max-view-user-avatar-count`的值则当前显示的浏览用户头像数量不会超过该值

如果浏览用户数据为空或者设置了`show-view-user`为`false`则不显示浏览用户的头像信息

#### 设置最大显示浏览用户头像数量为3

```vue
<template>
  <TnGraphicCard
    :avatar="graphicData.avatar"
    :title="graphicData.title"
    :description="graphicData.description"
    :tags="graphicData.tags"
    :content="graphicData.content"
    :images="graphicData.images"
    :view-count="graphicData.viewCount"
    :comment-count="graphicData.commentCount"
    :like-count="graphicData.likeCount"
    :view-user-avatars="graphicData.viewUserAvatars"
    :max-view-user-avatar-count="3"
  />
</template>
```

## API

### Props

| 属性名                     | 说明                                                         | 类型     | 默认值       | 可选值                                                       |
| -------------------------- | ------------------------------------------------------------ | -------- | ------------ | ------------------------------------------------------------ |
| avatar                     | 发布者头像地址                                               | String   | -            | -                                                            |
| title                      | 标题                                                         | String   | -            | -                                                            |
| description                | 描述                                                         | String   | -            | -                                                            |
| content                    | 内容                                                         | String   | -            | -                                                            |
| tags                       | 标签                                                         | String[] | []           | -                                                            |
| images                     | 图片列表                                                     | String[] | []           | -                                                            |
| tag-bg-color               | 标签背景颜色，可以使用图鸟内置的[背景色](https://vue3.tuniaokj.com/zh-CN/guide/style/background.html)、hex、rgb、rgba | String   | -            | -                                                            |
| tag-text-color             | 标签文字颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| show-more                  | 显示右边更多操作区域                                         | Boolean  | `true`       | `false`                                                      |
| show-hot                   | 显示热度数量                                                 | Boolean  | `true`       | `false`                                                      |
| active-hot                 | 是否激活热度                                                 | Boolean  | `false`      | `true`                                                       |
| hot-count                  | 热度数量数据                                                 | Number   | 0            | -                                                            |
| hot-icon                   | 热度数量图标                                                 | String   | rocket       | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| active-hot-icon            | 激活时热度数量图标                                           | String   | rocket-fill  | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| hot-color                  | 热度数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| active-hot-color           | 激活时热度数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| show-comment               | 显示评论数量                                                 | Boolean  | `true`       | `false`                                                      |
| active-comment             | 是否激活评论                                                 | Boolean  | `false`      | `true`                                                       |
| comment-count              | 评论数量数据                                                 | Number   | 0            | -                                                            |
| comment-icon               | 评论数量图标                                                 | String   | comment      | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| active-comment-icon        | 激活时评论数量图标                                           | String   | comment-fill | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| comment-color              | 评论数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| active-comment-color       | 激活时评论数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| show-like                  | 显示点赞数量                                                 | Boolean  | `true`       | `false`                                                      |
| active-like                | 是否激活点赞                                                 | Boolean  | `false`      | `true`                                                       |
| like-count                 | 点赞数量数据                                                 | Number   | 0            | -                                                            |
| like-icon                  | 点赞数量图标                                                 | String   | like         | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| active-like-icon           | 激活时点赞数量图标                                           | String   | like-fill    | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| like-color                 | 点赞数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| active-like-color          | 激活时点赞数量图标颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String   | -            | -                                                            |
| show-view-user             | 显示查看用户头像信息                                         | Boolean  | `true`       | `false`                                                      |
| view-count                 | 实际查看数量数据                                             | Number   | 0            | -                                                            |
| view-user-avatars          | 查看用户头像列表                                             | String[] | []           | -                                                            |
| max-view-user-avatar-count | 最大显示用户头像数量                                         | Number   | 4            | -                                                            |

### Slots

| 插槽名         | 说明             |
| -------------- | ---------------- |
| briefOperation | 顶部右边操作区域 |
| bottomRight    | 底部右边操作区域 |

### Events

| 事件名            | 说明                         | 类型         |
| ----------------- | ---------------------------- | ------------ |
| click             | 图文卡片点击事件             | `() => void` |
| avatar-view-click | 发布者头像和查看数量点击事件 | `() => void` |
| more-click        | 更多按钮点击事件             | `() => void` |
| hot-click         | 热度数量点击事件             | `() => void` |
| comment-click     | 评论数量点击事件             | `() => void` |
| like-click        | 点赞数量点击事件             | `() => void` |
