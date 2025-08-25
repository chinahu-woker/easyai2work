import { withNoopInstall } from '@tuniao/tnui-vue3-uniapp/utils'
import UpdateUserInfoPopup from './index.vue'

export const TnUpdateUserInfoPopup = withNoopInstall(UpdateUserInfoPopup)
export default TnUpdateUserInfoPopup

export * from './types'
export type { TnUpdateUserInfoPopupInstance } from './instance'
