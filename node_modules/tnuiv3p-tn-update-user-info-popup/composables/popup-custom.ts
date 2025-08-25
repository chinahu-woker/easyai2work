import { computed, toRef } from 'vue'
import { useComponentColor, useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'
import type { CSSProperties } from 'vue'
import type { UpdateUserInfoPopupProps } from '../types'

export const useUpdateUserInfoPopupCustomStyle = (
  props: UpdateUserInfoPopupProps
) => {
  const ns = useNamespace('update-user-info-popup')

  // 解析颜色
  const [confirmBtnBgColorClass, confirmBtnBgColorStyle] = useComponentColor(
    toRef(props, 'confirmBgColor'),
    'bg'
  )
  const [confirmBtnTextColorClass, confirmBtnTextColorStyle] =
    useComponentColor(toRef(props, 'confirmTextColor'), 'text')

  // 提交按钮类和样式
  const submitBtnClass = computed<string>(() => {
    const cls: string[] = [ns.e('submit-btn')]

    if (confirmBtnBgColorClass.value) {
      cls.push(confirmBtnBgColorClass.value)
    }
    if (confirmBtnTextColorClass.value) {
      cls.push(confirmBtnTextColorClass.value)
    }

    return cls.join(' ')
  })
  const submitBtnStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {}

    if (!confirmBtnBgColorClass.value) {
      style.backgroundColor =
        confirmBtnBgColorStyle.value || 'var(--tn-color-primary)'
    }
    if (confirmBtnTextColorStyle.value) {
      style.color = confirmBtnTextColorStyle.value
    } else if (!confirmBtnBgColorClass.value) {
      style.color = 'var(--tn-color-white)'
    }

    if (!props.avatar || !props.nickname) {
      style.backgroundColor = 'var(--tn-color-gray-disabled)'
      style.color = 'var(--tn-color-gray-dark)'
    }

    return style
  })

  return {
    ns,
    submitBtnClass,
    submitBtnStyle,
  }
}
