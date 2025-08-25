import { computed, toRef } from 'vue'
import { useComponentColor, useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'

import type { CSSProperties } from 'vue'
import type { TimeLineDataProps } from '../time-line-data'

export const useTimeLineDataCustomStyle = (props: TimeLineDataProps) => {
  const ns = useNamespace('time-line-data')

  // 解析颜色
  const [dotColorClass, dotColorStyle] = useComponentColor(
    toRef(props, 'dotColor'),
    'text'
  )

  // dot对应的类
  const dotClass = computed<string>(() => {
    const cls: string[] = []

    if (dotColorClass.value) cls.push(dotColorClass.value)

    return cls.join(' ')
  })

  // dot样式
  const dotStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {}

    if (!dotColorClass.value) {
      style.color = dotColorStyle.value || 'var(--tn-color-red)'
    }

    return style
  })

  return {
    ns,
    dotClass,
    dotStyle,
  }
}
