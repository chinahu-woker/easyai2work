import type { InjectionKey, Ref } from 'vue'

export type TimeLineContext = {
  showLine: Ref<boolean>
}

export const timeLineKey: InjectionKey<TimeLineContext> = Symbol('timeLineKey')
