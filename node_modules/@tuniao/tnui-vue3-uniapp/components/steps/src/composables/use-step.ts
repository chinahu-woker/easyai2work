import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue'
import { stepsContextKey } from '../../../../tokens'
import { useSelectorQuery } from '../../../../hooks'
import { debugWarn, generateId } from '../../../../utils'

import type { StepProps } from '../steps-item'
import type { StepsMode } from '../steps'

export const useStep = (props: StepProps) => {
  const instance = getCurrentInstance()
  if (!instance) {
    debugWarn('TnStep', '请在 setup 中使用 useStep')
  }

  const { emit, uid } = instance!

  const stepsContext = inject(stepsContextKey)

  const { getSelectorNodeInfo } = useSelectorQuery(instance)
  const itemComponentId = `tsii-${generateId()}`

  // 判断当前是否被激活
  const isActive = computed<boolean>(
    () => stepsContext?.activeUidList.includes(uid) || false
  )

  // 步骤条模式
  const stepMode = computed<StepsMode>(() => stepsContext?.mode || 'dot')

  // item点击事件
  const itemClickEvent = () => {
    if (props.disabled || stepsContext?.disabled) return

    stepsContext?.setActiveItem(uid)

    emit('click')
  }

  // 获取标签的位置信息
  let initGetRectInfoCount = 0
  const getStepItemComponentRectInfo = async () => {
    try {
      const rectInfo = await getSelectorNodeInfo(`#${itemComponentId}`)

      initGetRectInfoCount = 0
      stepsContext?.addItem({
        uid,
        normalColor: props.color,
        activeColor: props.activeColor,
        left: rectInfo.left,
        right: rectInfo.right,
        top: rectInfo.top,
        bottom: rectInfo.bottom,
        width: rectInfo.width,
        height: rectInfo.height,
      })
    } catch (err) {
      if (initGetRectInfoCount > 10) {
        initGetRectInfoCount = 0
        debugWarn('TnStepsItem', `获取step标签位置失败: ${err}`)
        return
      }
      initGetRectInfoCount++
      setTimeout(() => {
        getStepItemComponentRectInfo()
      }, 150)
    }
  }

  onMounted(() => {
    nextTick(() => {
      getStepItemComponentRectInfo()
    })
  })

  onUnmounted(() => {
    stepsContext?.removeItem(uid)
  })

  return {
    isActive,
    stepMode,
    itemComponentId,
    itemClickEvent,
  }
}
