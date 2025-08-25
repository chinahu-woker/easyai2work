import { buildProps, isBoolean, isString } from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

export const updateUserInfoPopupProps = buildProps({
  /**
   * @description 控制弹框显示、隐藏
   */
  show: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 用户头像地址
   */
  avatar: {
    type: String,
    default: '',
  },
  /**
   * @description 用户昵称
   */
  nickname: {
    type: String,
    default: '',
  },
  /**
   * @description 弹框标题
   */
  title: {
    type: String,
    default: '获取您的昵称、头像',
  },
  /**
   * @description 弹框提示
   */
  tips: {
    type: String,
    default: '获取用户头像、昵称，主要用于向用户提供具有辨识度的用户体验',
  },
  /**
   * @description 弹框确认按钮文案
   */
  confirmText: {
    type: String,
    default: '保 存',
  },
  /**
   * @description 弹框按钮背景颜色，以tn开头使用图鸟内置的颜色
   */
  confirmBgColor: {
    type: String,
    default: 'tn-type-primary',
  },
  /**
   * @description 弹框按钮文字颜色，以tn开头使用图鸟内置的颜色
   */
  confirmTextColor: {
    type: String,
    default: 'tn-white',
  },
})

export const updateUserInfoPopupEmits = {
  'update:show': (val: boolean) => isBoolean(val),
  'update:avatar': (val: string) => isString(val),
  'update:nickname': (val: string) => isString(val),
  /**
   * @description 点击弹框确认按钮时触发
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirm: (avatar: string, nickname: string) => true,
  /**
   * @description 选择头像后触发
   */
  'choose-avatar': (val: string) => isString(val),
}

export type UpdateUserInfoPopupProps = ExtractPropTypes<
  typeof updateUserInfoPopupProps
>
export type UpdateUserInfoPopupEmits = typeof updateUserInfoPopupEmits
