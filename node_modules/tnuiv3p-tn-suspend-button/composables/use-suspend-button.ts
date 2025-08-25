import type { SetupContext } from 'vue'
import type { SuspendButtonEmits } from '../types'

export const useSuspendButton = (
  emits: SetupContext<SuspendButtonEmits>['emit']
) => {
  const clickHandle = () => {
    emits('click')
  }

  return {
    clickHandle,
  }
}
