import { computed, toRef } from 'vue'
import { useComponentColor, useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'

import type { CSSProperties } from 'vue'
import type { TimeLineItemProps } from '../time-line-item'

export const useTimeLineCustomStyle = (props: TimeLineItemProps) => {
  const ns = useNamespace('time-line-item')

  // 解析颜色
  const [dotBgColorClass, dotBgColorStyle] = useComponentColor(
    toRef(props, 'dotBgColor'),
    'bg'
  )
  const [dotTextColorClass, dotTextColorStyle] = useComponentColor(
    toRef(props, 'dotTextColor'),
    'text'
  )

  // dot对应的类
  const dotClass = computed<string>(() => {
    const cls: string[] = []

    if (dotBgColorClass.value) cls.push(dotBgColorClass.value)
    if (dotTextColorClass.value) cls.push(dotTextColorClass.value)

    return cls.join(' ')
  })

  // dot样式
  const dotStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {}

    if (!dotBgColorClass.value) {
      style.backgroundColor = dotBgColorStyle.value || 'var(--tn-color-blue)'
    }

    if (dotTextColorStyle.value) {
      style.color = dotTextColorStyle.value
    } else if (!dotBgColorClass.value && !dotTextColorClass.value) {
      style.color = '#fff'
    }

    return style
  })

  return {
    ns,
    dotClass,
    dotStyle,
  }
}
