# 图鸟 UI vue3 uniapp Plugins - 时间轴

![TuniaoUI vue3 uniapp](https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg 'TuniaoUI vue3 uniapp')

[Tuniao UI vue3官方仓库](https://github.com/tuniaoTech/tuniaoui-rc-vue3-uniapp)

该组件用于展示与时间相关的信息，如日志、签到记录等。

## 安装

```bash
npm install tnuiv3p-tn-time-line
```

## 组件位置

```bash
tnuiv3p-tn-timeline/time-line.vue
tnuiv3p-tn-timeline/time-line-item.vue
tnuiv3p-tn-timeline/time-line-data.vue
```

## 平台差异说明

| App(vue) | H5  | 微信小程序 | 支付宝小程序 |  ...   |
| :------: | :-: | :--------: | :----------: | :----: |
|    √     |  √  |     √      |      √       | 适配中 |

## 基础使用

在`TnTimeLineData`组件中自定义当前事件节点的内容，节点的内容放在默认的插槽中

使用`TnTimeLineItem`包裹`TnTimeLineData`组件，该组件可以设置大节点的标题信息，也可以通过`slot="title"`插槽自定义标题内容

使用`TnTimeLine`包裹着全部`TnTimeLineItem`节点

```vue
<script setup lang="ts">
import TnTimeLine from 'tnuiv3p-tn-time-line/time-line.vue'
import TnTimeLineItem from 'tnuiv3p-tn-time-line/time-line-item.vue'
import TnTimeLineData from 'tnuiv3p-tn-time-line/time-line-data.vue'

interface TimeLineDataItem {
  date?: string
  version?: string
  content: string
}

interface TimeLineData {
  month: string
  icon?: string
  data: TimeLineDataItem[]
}

// 时间轴数据
const timeLineData: TimeLineData[] = [
  {
    month: '2023-07',
    icon: 'moments',
    data: [
      {
        date: '1',
        version: '1.0.0',
        content:
          '图鸟科技，图鸟UI vue3 uniapp版本全新发布，欢迎各位开发者进行使用',
      },
      {
        content:
          '图鸟科技，图鸟UI vue3 uniapp版本全新发布，欢迎各位开发者进行使用',
      },
    ],
  },
  {
    month: '2023-08',
    icon: 'creative',
    data: [
      {
        content:
          '图鸟科技，图鸟UI vue3 uniapp版本全新发布，欢迎各位开发者进行使用',
      },
      {
        date: '2',
        version: '1.0.0',
        content:
          '图鸟科技，图鸟UI vue3 uniapp版本全新发布，欢迎各位开发者进行使用',
      },
    ],
  },
]
</script>

<template>
  <view class="content">
    <TnTimeLine>
      <TnTimeLineItem
        v-for="(item, index) in timeLineData"
        :key="index"
        :title="item.month"
        :title-icon="item.icon !== undefined ? item.icon : ''"
      >
        <TnTimeLineData
          v-for="(dataItem, dataIndex) in item.data"
          :key="dataIndex"
        >
          <view
            v-if="dataItem?.date"
            class="time-line__title tn-flex justify-between items-center tn-gray-dark_text"
          >
            <view class="date">{{ dataItem?.date || '' }}</view>
            <view class="version">{{ dataItem?.version || '' }}</view>
          </view>
          <view class="time-line__data">
            {{ dataItem.content }}
          </view>
        </TnTimeLineData>
      </TnTimeLineItem>
    </TnTimeLine>
  </view>
</template>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  padding: 30rpx;

  .time-line {
    &__title {
      font-size: 32rpx;
      margin-bottom: 20rpx;
    }
  }
}
</style>
```

## API

### TnTimeLine Props

| 属性名    | 说明     | 类型    | 默认值 | 可选值  |
| --------- | -------- | ------- | ------ | ------- |
| show-line | 显示竖线 | Boolean | `true` | `false` |

### TnTimeLine Slots

| 插槽名  | 说明     | 子标签         |
| ------- | -------- | -------------- |
| default | 时间节点 | TnTimeLineItem |

### TnTimeLineItem Props

| 属性名         | 说明                                                                                                                  | 类型   | 默认值 | 可选值                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ----------------------------------------------------------------- |
| title          | 标题                                                                                                                  | String | -      | -                                                                 |
| title-icon     | 标题icon                                                                                                              | String | -      | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| dot-bg-color   | 左边小点背景，可以使用图鸟内置的[背景色](https://vue3.tuniaokj.com/zh-CN/guide/style/background.html)、hex、rgb、rgba | String | -      | -                                                                 |
| dot-text-color | 左边小点字体颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba       | String | -      | -                                                                 |

### TnTimeLineItem Emits

| 事件名 | 说明         | 类型         |
| ------ | ------------ | ------------ |
| click  | item点击事件 | `() => void` |

### TnTimeLineItem Slots

| 插槽名  | 说明           | 子标签         |
| ------- | -------------- | -------------- |
| default | 时间节点数据   | TnTimeLineData |
| title   | 自定义标题数据 | -              |

### TnTimeLineData Props

| 属性名    | 说明                                                                                                          | 类型   | 默认值      | 可选值                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------- | ------ | ----------- | ----------------------------------------------------------------- |
| dot-icon  | 节点图标                                                                                                      | String | circle-fill | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| dot-color | 左边节点点颜色，支持图鸟内置的[颜色值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html)、hex、rgb、rgba | String | -           | -                                                                 |

### TnTimeLineItem Emits

| 事件名 | 说明             | 类型         |
| ------ | ---------------- | ------------ |
| click  | itemData点击事件 | `() => void` |

### TnTimeLineItem Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| default | 时间节点数据内容 |
