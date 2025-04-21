import type { InjectionKey } from 'vue'
import type { StepsProps } from '../components/steps'

export type StepContext = {
  uid: number
  normalColor?: string
  activeColor?: string
  left?: number
  right?: number
  top?: number
  bottom?: number
  width?: number
  height?: number
}

export type StepsContext = StepsProps & {
  items: StepContext[]
  activeUidList: number[]
  addItem: (item: StepContext) => void
  removeItem: (uid: number) => void
  setActiveItem: (uid: number) => void
}

export const stepsContextKey: InjectionKey<StepsContext> =
  Symbol('stepsContextKey')
