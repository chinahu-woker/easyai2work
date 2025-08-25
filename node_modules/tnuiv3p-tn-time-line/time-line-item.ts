import { buildProps } from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

export const timeLineItemProps = buildProps({
  /**
   * @description 标题
   */
  title: String,
  /**
   * @description 标题icon
   */
  titleIcon: String,
  /**
   * @description 节点背景
   */
  dotBgColor: String,
  /**
   * @description 节点字体颜色
   */
  dotTextColor: String,
})

export const timeLineItemEmits = {
  /**
   * @description 点击事件
   */
  click: () => true,
}

export type TimeLineItemProps = ExtractPropTypes<typeof timeLineItemProps>

export type TimeLineItemEmits = typeof timeLineItemEmits
