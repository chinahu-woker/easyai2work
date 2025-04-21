import { type CSSProperties, computed, ref } from 'vue'
import { useComponentColor, useNamespace } from '../../../../hooks'
import type { StepsProps } from '../steps'

type StepsLineClass = (
  index: number,
  color: string,
  activeColor: string
) => string
type StepsLineStyle = (
  index: number,
  color: string,
  activeColor: string
) => CSSProperties

export const useStepsCustomStyle = (props: StepsProps) => {
  const ns = useNamespace('steps')

  const stepsLineClass = computed<StepsLineClass>(() => {
    return (index: number, color: string, activeColor: string) => {
      const cls: string[] = [ns.e('line')]

      const refColor = ref(color || props.color)
      const refActiveColor = ref(activeColor || props.activeColor)
      const [colorClass] = useComponentColor(refColor, 'bg')
      const [activeColorClass] = useComponentColor(refActiveColor, 'bg')

      if (props.modelValue && props.modelValue >= index + 1) {
        if (activeColorClass.value) cls.push(activeColorClass.value)
      } else {
        if (colorClass.value) cls.push(colorClass.value)
      }

      return cls.join(' ')
    }
  })

  const stepsLineStyle = computed<StepsLineStyle>(() => {
    return (index: number, color: string, activeColor: string) => {
      const style: CSSProperties = {}
      const refColor = ref(color || props.color)
      const refActiveColor = ref(activeColor || props.activeColor)
      const [colorClass, colorStyle] = useComponentColor(refColor, 'bg')
      const [activeColorClass, activeColorStyle] = useComponentColor(
        refActiveColor,
        'bg'
      )

      if (props.modelValue && props.modelValue >= index + 1) {
        if (!activeColorClass.value) {
          style.backgroundColor =
            activeColorStyle.value || 'var(--tn-color-primary)'
        }
      } else {
        if (!colorClass.value) {
          style.backgroundColor = colorStyle.value || 'var(--tn-color-gray)'
        }
      }

      return style
    }
  })

  return {
    ns,
    stepsLineClass,
    stepsLineStyle,
  }
}
