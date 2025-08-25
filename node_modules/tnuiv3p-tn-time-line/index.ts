import { withInstall, withNoopInstall } from '@tuniao/tnui-vue3-uniapp/utils'
import TimeLine from './time-line.vue'
import TimeLineItem from './time-line-item.vue'
import TimeLineData from './time-line-data.vue'

const TnTimeLine = withInstall(TimeLine, { TimeLineItem })
export default TnTimeLine

export const TnTimeLineItem = withInstall(TimeLineItem, { TimeLineData })
export const TnTimelineData = withNoopInstall(TimeLineData)

export * from './time-line'
export * from './time-line-item'
export * from './time-line-data'

export type {
  TnTimeLineInstance,
  TnTimeLineItemInstance,
  TnTimeLineDataInstance,
} from './instance'
