import { withNoopInstall } from '@tuniao/tnui-vue3-uniapp/utils'
import graphicCard from './index.vue'

export const TnGraphicCard = withNoopInstall(graphicCard)
export default TnGraphicCard

export * from './types'
export type { TnGraphicCardInstance } from './instance'
