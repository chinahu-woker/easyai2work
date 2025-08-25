import { buildProps } from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

export const timeLineDataProps = buildProps({
  /**
   * @description 节点图标
   */
  dotIcon: {
    type: String,
    default: 'circle-fill'
  },
  /**
   * @description 节点颜色
   */
  dotColor: String,
})

export const timeLineDataEmits = {
  /**
   * @description 点击事件
   */
  click: () => true,
}

export type TimeLineDataProps = ExtractPropTypes<typeof timeLineDataProps>

export type TimeLineDataEmits = typeof timeLineDataEmits
