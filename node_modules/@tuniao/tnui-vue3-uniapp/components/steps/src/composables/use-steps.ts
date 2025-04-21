import { getCurrentInstance, provide, reactive, ref, toRefs, watch } from 'vue'
import { stepsContextKey } from '../../../../tokens'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../../constants'
import { useOrderedChildren } from '../../../../hooks'
import { debugWarn } from '../../../../utils'

import type { StepsProps } from '../steps'
import type { StepContext } from '../../../../tokens'

interface StepsLineRectInfo {
  left: number
  top: number
  width: number
  color: string
  activeColor: string
}

export const useSteps = (props: StepsProps) => {
  const instance = getCurrentInstance()

  if (!instance) {
    debugWarn('TnSteps', '请在 setup 中使用 useSteps')
  }

  const { emit } = instance!

  const {
    children: items,
    addChild,
    removeChild: removeItem,
  } = useOrderedChildren<StepContext>()

  // 当前已激活的Uid列表
  const activeUidList = ref<number[]>([])
  // 步进器横线位置信息
  const stepsLineRectInfoList = ref<StepsLineRectInfo[]>([])

  let innerUpdate = false
  // 更新当前激活的Uid列表
  const setActiveUidList = (uid?: number, changeEmit = false) => {
    if (uid === undefined) {
      activeUidList.value = []
      return
    }
    // 查找出当前激活的uid的index
    const index = items.value.findIndex((item) => item.uid === uid)
    if (index === -1) return

    // 根据index查找出当前激活的uid列表
    activeUidList.value = items.value
      .slice(0, index + 1)
      .map((item) => item.uid)

    // 触发更新事件
    emit(UPDATE_MODEL_EVENT, index)
    if (changeEmit) {
      emit(CHANGE_EVENT, index)
    }
  }

  // 设置当前激活的Step
  const setActiveItem = (uid: number) => {
    if (props.disabled) return
    innerUpdate = true
    setActiveUidList(uid, true)
  }

  watch(
    () => props.modelValue,
    (val) => {
      if (innerUpdate) {
        innerUpdate = false
        return
      }
      if (val !== undefined) {
        const uid = items.value?.[val]?.uid
        setActiveUidList(uid)
      }
    }
  )

  // 添加item到items
  const addItem = (item: StepContext) => {
    addChild(item)

    // 计算横线信息
    const lineRectInfoLength = stepsLineRectInfoList.value.length
    const stepsItemLeft = item?.left || 0
    const stepsItemRight = item?.right || 0
    const stepsItemWidth = item?.width || 0
    const stepsItemHeight = item?.height || 0
    stepsLineRectInfoList.value.push({
      left: stepsItemRight - stepsItemWidth / 2 + 3,
      top: stepsItemHeight / 2,
      width: 0,
      color: '',
      activeColor: '',
    })
    if (lineRectInfoLength > 0) {
      const prevStepsLineInfo =
        stepsLineRectInfoList.value[lineRectInfoLength - 1]
      stepsLineRectInfoList.value[lineRectInfoLength - 1].width =
        stepsItemLeft - prevStepsLineInfo.left - stepsItemWidth * (3 / 4)
      stepsLineRectInfoList.value[lineRectInfoLength - 1].color =
        item?.normalColor || ''
      stepsLineRectInfoList.value[lineRectInfoLength - 1].activeColor =
        item?.activeColor || ''
    }

    if (
      !activeUidList.value.length &&
      props.modelValue !== undefined &&
      props.modelValue >= 0
    ) {
      setActiveUidList(items.value?.[props.modelValue]?.uid)
    }
  }

  provide(
    stepsContextKey,
    reactive({
      ...toRefs(props),

      items,
      activeUidList,
      addItem,
      removeItem,
      setActiveItem,
    })
  )

  return {
    stepsLineRectInfoList,
  }
}
