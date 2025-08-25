import { withNoopInstall } from '@tuniao/tnui-vue3-uniapp/utils'
import suspendButton from './index.vue'

export const TnSuspendButton = withNoopInstall(suspendButton)
export default TnSuspendButton

export * from './types'
export type { TnSuspendButtonInstance } from './instance'
