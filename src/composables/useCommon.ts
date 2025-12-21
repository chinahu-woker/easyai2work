import { request } from '@/utils/request.ts'
import { useAppStore } from '@/stores/appStore.ts'
import type {
  IPayOrder,
  IPayOrderCreatWechatMiniProgramPay,
  IWechatPrePay,
  IProduct,
  User,
  IMember,
  IMiniProgramContent,
  IPageContent,
  IWorkFlow,
  IMessage,
  IMessageListResponse,
  IMessageStats,
} from '@/types'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { EventType } from '@/types/event.types.ts'
import { emit } from '@/utils/emitter.ts'

/** 微信登录 */
export const loginByWechatCode = (code: string, inviteCode?: string) =>
  request<User>(`auth/loginByWechatMiniProgram?code=${code}&inviteCode=${inviteCode}`)
/** 用户名密码登录 */
export const loginByUsername = (data: { username: string; password: string }) =>
  request('/users/loginByUsername', { method: 'POST', data })
/** 退出登录 */
export const loginOut = () => {
  useAppStore().clearUser()
  emit(EventType.AUTH_LOGOUT, null)
}
/** 保存登录信息到本地 */
export const saveLoginInfo = (user: Partial<User>) => useAppStore().setUser(user)
/** 获取登录信息 */
export const getLoginInfo = () => useAppStore().getUser()
/** 修改用户的昵称和头像 */
export const updateUserInfo = (data: Partial<User>) =>
  request<User>('/users/update', { method: 'POST', data })

/** 重新获取用户信息 */
export const refreshUserInfo = (user = getLoginInfo()) =>
  request<User>(`/users/${user._id}`).then(res => {
    useAppStore().setUser(res)
  })

/** 是否为登录状态 */
export const isLogin = computed(() => {
  const { user } = storeToRefs(useAppStore())
  return !!user.value.refresh_token
})
/** 获取用户的会员信息,获取用户最高的权限等级会员信息*/
export const getUserVipInfo = () => request<IMember>('/member/topLevel', { method: 'POST' })

/** 产品套餐相关 */
/** 获取所有的套餐 */
export const getProductList = () => request<IProduct[]>('/product')
/** 获取订单详情 */
export const getOrderInfoById = (order_id: string) =>
  request<IPayOrder[]>(`/pay/query`, { method: 'POST', data: { _id: order_id } })

/**支付相关*/
export const creatOrder = (data: IPayOrderCreatWechatMiniProgramPay) =>
  request<IPayOrder>(`/pay/order`, { method: 'POST', data })
/** 预支付 */
export const getPrePay = (order_id: string) => request<IWechatPrePay>(`pay/prePay/${order_id}`)

/** 获取所有的应用 */
export const getApps = () => request<IWorkFlow[]>('workflow/getAllWorkflowApps/mp')

/** 页面配置相关 */
/** 获取页面配置信息 */
export const getPageContent = () => request<IPageContent>(`content/mp/content`)

/** 消息通知相关 */
/** 获取消息列表 */
export const getMessageList = (page = 1, pageSize = 10, type?: string) =>
  request<IMessageListResponse>(`api/content/messages?page=${page}&pageSize=${pageSize}${type ? `&type=${type}` : ''}`)

/** 获取消息统计信息 */
export const getMessageStats = () => request<IMessageStats>('api/content/messages/stats')

/** 标记消息为已读 */
export const markMessageAsRead = (messageId: string) =>
  request<boolean>(`api/content/messages/${messageId}/read`, { method: 'POST' })

/** 批量标记消息为已读 */
export const markMultipleMessagesAsRead = (messageIds: string[]) =>
  request<boolean>('api/content/messages/mark-read', {
    method: 'POST',
    data: { messageIds }
  })

/** 删除消息 */
export const deleteMessage = (messageId: string) =>
  request<boolean>(`api/content/messages/${messageId}`, { method: 'DELETE' })

/** 清空所有已读消息 */
export const clearReadMessages = () =>
  request<boolean>('api/content/messages/clear-read', { method: 'DELETE' })

/** 获取内容配置（包含公告等消息信息） */
export const getContentConfig = () => request<any>('/content')