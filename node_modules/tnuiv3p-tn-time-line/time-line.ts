import { buildProps } from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

export const timeLineProps = buildProps({
  /**
   * @description 显示竖线
   */
  showLine: {
    type: Boolean,
    default: true,
  },
})

export type TimeLineProps = ExtractPropTypes<typeof timeLineProps>
