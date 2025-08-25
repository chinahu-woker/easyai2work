import { buildProps } from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

export const suspendButtonShape = ['circle', 'square'] as const
export type SuspendButtonShape = (typeof suspendButtonShape)[number]

export const suspendButtonProps = buildProps({
  /**
   * @description 按钮显示的图标
   */
  icon: String,
  /**
   * @description 按钮距离顶部的位置，单位rpx
   */
  top: {
    type: [String, Number],
    default: '80%',
  },
  /**
   * @description 按钮距离右侧的位置，单位rpx
   */
  right: {
    type: [String, Number],
    default: '5%',
  },
  /**
   * @description 按钮背景颜色, 以tn开头使用图鸟内置的颜色
   */
  bgColor: {
    type: String,
    default: 'tn-type-primary',
  },
  /**
   * @description 按钮文字颜色, 以tn开头使用图鸟内置的颜色
   */
  textColor: {
    type: String,
    default: 'tn-color-white',
  },
  /**
   * @description 按钮尺寸, 内置尺寸sm、lg、xl, 也可以传入指定尺寸的数值，默认单位为rpx
   */
  size: String,
  /**
   * @description 按钮形状
   */
  shape: {
    type: String,
    values: suspendButtonShape,
    default: 'circle',
  },
  /**
   * @description 透明度
   */
  opacity: {
    type: Number,
    default: 0.9,
  },
  /**
   * @description 是否显示阴影
   */
  shadow: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 是否有漂浮动画
   */
  float: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 是否固定位置
   */
  fixed: {
    type: Boolean,
    default: true,
  },
})

export const suspendButtonEmits = {
  /**
   * @description 点击按钮时触发
   */
  click: () => true,
}

export type SuspendButtonProps = ExtractPropTypes<typeof suspendButtonProps>
export type SuspendButtonEmits = typeof suspendButtonEmits
