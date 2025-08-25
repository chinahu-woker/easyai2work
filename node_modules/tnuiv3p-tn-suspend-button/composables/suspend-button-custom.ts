import { computed, toRef } from 'vue'
import {
  useComponentColor,
  useComponentSize,
  useNamespace,
} from '@tuniao/tnui-vue3-uniapp/hooks'
import { formatDomSizeValue } from '@tuniao/tnui-vue3-uniapp/utils'
import type { CSSProperties } from 'vue'
import type { SuspendButtonProps } from '../types'

export const useSuspendButtonCustomStyle = (props: SuspendButtonProps) => {
  const ns = useNamespace('suspend-button')
  // 解析颜色
  const [bgColorClass, bgColorStyle] = useComponentColor(
    toRef(props, 'bgColor'),
    'bg'
  )
  const [textColorClass, textColorStyle] = useComponentColor(
    toRef(props, 'textColor'),
    'text'
  )
  // 解析尺寸
  const { sizeType } = useComponentSize(props.size)

  // 按钮对应的类和样式
  const buttonClass = computed<string>(() => {
    const cls: string[] = [ns.b()]
    if (bgColorClass.value) {
      cls.push(bgColorClass.value)
    }
    if (textColorClass.value) {
      cls.push(textColorClass.value)
    }

    if (props.shape) {
      cls.push(ns.m(props.shape))
    }

    if (props.size && sizeType.value === 'inner') {
      cls.push(ns.m(props.size))
    }

    if (props.float) {
      cls.push(ns.m('float'))
    }

    if (props.fixed) {
      cls.push(ns.m('fixed'))
    }

    if (props.shadow) {
      cls.push('tn-shadow')
    }

    return cls.join(' ')
  })
  const buttonStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {}

    if (!bgColorClass.value) {
      style.backgroundColor = bgColorStyle.value || 'var(--tn-color-primary)'
    }
    if (textColorStyle.value) {
      style.color = textColorStyle.value
    } else if (!bgColorClass.value && !textColorClass.value) {
      style.color = 'var(--tn-color-white)'
    }

    if (props.size && sizeType.value === 'custom') {
      style.width = style.height = formatDomSizeValue(props.size)
    }

    if (props?.opacity !== undefined) {
      style.opacity = props.opacity
    }

    if (props?.top !== undefined) {
      style.top = formatDomSizeValue(props.top)
    }
    if (props?.right !== undefined) {
      style.right = formatDomSizeValue(props.right)
    }

    return style
  })

  // 图标对应的类和样式
  const iconClass = computed<string>(() => {
    const cls: string[] = [ns.e('icon')]

    return cls.join(' ')
  })
  const iconStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {}

    if (props.size && sizeType.value === 'custom') {
      style.fontSize = `calc(${formatDomSizeValue(props.size)} * 0.7)`
    }

    return style
  })

  return {
    buttonClass,
    buttonStyle,
    iconClass,
    iconStyle,
  }
}
