import {
	type IComfyUIProperties,
	type IComfyUIRequestParams,
	type IDrawHistoryItem,
	type IDrawHistoryItemCreat,
	type IDrawResponse,
	type IDrawTaskStatus,
	type IWebSocketParams,
	IWebsocketSceneType,
	type IWorkFlow,
	type IWorkflowParam,
	type SocketState,
} from '@/types'
import { computed, ref, inject } from 'vue'
import type { ParamToComponentMapping } from '@/pages/draw/apps/apps.vue'
import { storeToRefs } from 'pinia'
import { getBaseWsURL, parseJSONToObject, request } from '@/utils'
import { useAppStore } from '@/stores'
import { getLoginInfo, isLogin, refreshUserInfo } from '@/composables'

export interface SocketInitOptions {
	params: IWebSocketParams
	// params?: IWebSocketParams
	forceReConnect?: boolean
	onConnect?: () => void
	onReconnect?: (attemptNumber: number) => void
	onReconnectFailed?: () => void
	onDisconnect?: (reason?: string) => void
	onConnectError?: (error: any) => void
	onConnectTimeout?: () => void
	onMessage?: (msg: any) => void
	onPayMessage?: (msg: any) => void
}

/** 提交自定义工作流 */
export const submitCustomWorkflow = (data: IComfyUIRequestParams) =>
	request<IDrawResponse>('/draw/customWorkflow', {
		method: 'POST',
		data,
	})

/** 根据工作流的ID获取大模型清单 **/
export const getModelListByWorkflowId = (workflow_id: string) =>
	request<string[]>(`/draw/getModelListById/${workflow_id}`)
/** 创建任务 **/

export const creatDrawHistoryTask = (data: IDrawHistoryItemCreat) =>
	request<IDrawHistoryItem>('/draw/history', {
		method: 'POST',
		data,
	})

export default function useWorkFlow() {
	// const workflow = ref<IWorkFlow>({} as IWorkFlow)
	const workflow = ref<IWorkFlow | null>(null);


	/** 工作流的参数列表 */
	const params_component_list = [
		{ param: 'seed', component: 'Seed', title: '随机种子' },
		{ param: 'ckpt_name', component: 'ModeSelect', title: '大模型选择' },
		{ param: 'positive', component: 'Positive', title: '正向提示词' },
		{ param: 'width', component: 'Width', title: '图片宽度' },
		{ param: 'height', component: 'Height', title: '图片高度' },
		{ param: 'batch_size', component: 'CustomNumberBox', title: '生成批次' },
		{ param: 'image_path_origin', component: 'ImageUpload', title: '原图上传' },
		{ param: 'image_path_mask', component: 'ImageUpload', title: '遮罩上传' },
		{ param: 'image_path_face', component: 'ImageUpload', title: '参考上传' },
		{ param: 'image_path_style', component: 'ImageUpload', title: '参考上传' },
		{ param: 'image_path', component: 'ImageUpload', title: '参考上传' },
		{ param: 'image_path_video', component: 'VideoUpload', title: '视频上传' },
		{ param: 'advance_select_image_preview', component: 'ImageSelectPreview', title: '高级-图像预览选择' },
		{ param: 'multi_image_path', component: 'ImageUploadMore', title: '多图上传' },
		{ param: 'multi_source_image_path', component: 'SourceImage', title: '可选素材库' },
		// { param: 'advance_onlineEdit_mask', component: 'MoreImageUpload', title: '遮罩上传' },
		{ param: 'custom_dropselect', component: 'CustomSelect', title: '自定义选择' },
		{ param: 'advance_onlineEdit_origin', component: 'MoreImageUpload', title: '遮罩上传' },
		{ param: 'advance_select_single_chips', component: 'SelectSingleChips', title: '标签选择' },
		{ param: 'custom_number_slider', component: 'CustomSlider', title: '滑块选择' },

		// { param: 'advance_onlineEdit', component: 'MoreImageUpload', title: '遮罩上传' }
	] as ParamToComponentMapping[]
	/** 绘图参数 */
	const bindParam = ref<Partial<IComfyUIProperties>>({})
	const handleGetWorkFlwById = async (id: string) => {
		workflow.value = await request<IWorkFlow>(`/workflow/${id}`)
		handleWorkFlowParamsToBindParam()
	}
	/** 本地绘画任务列表*/
	const { localTasks } = storeToRefs(useAppStore())

	// safeLocalTasks 避免在 store ref 未初始化时直接访问 .value 导致运行时错误
	const safeLocalTasks = computed(() => {
		try {
			return (localTasks && localTasks.value) ? localTasks.value : []
		} catch (e) {
			return []
		}
	})

	/** 工作流的参数列表,过滤点产出节点 */
	const workFlowParamLists = computed<IWorkflowParam[]>(() => {
		if (!workflow.value || !workflow.value?.params) {
			return []
		}
		return workflow.value.params.filter(item => item.name !== 'output') as IWorkflowParam[]
	})

	/** 产互类型参数 */
	const outputType = computed(() => {
		if (!workflow.value || !workflow.value.params) {
			return 'image'
		}
		return workflow.value.params.find(item => item.name === 'output')?.outputType || 'image'
	})

	/** 根据参数名称找组件名称  */
	const handleFindComponentName = (param: keyof IComfyUIProperties) => {
		// 先尝试精确匹配
		const exact = params_component_list.find(item => param === item.param)
		if (exact) return exact.component

		// 如果没有精确匹配，尝试按前缀匹配。为了优先匹配最具体的项，按 param 长度降序排序后查找第一个前缀匹配项
		const sorted = [...params_component_list].sort((a, b) => b.param.length - a.param.length)
		// 使用边界匹配：mapping.param 后面要么是下划线、短横、点，或字符串结束
		for (const item of sorted) {
			const key = item.param
			const regex = new RegExp(`^${key}(?:_|-|\.|$)`)
			if (regex.test(param as string)) {
			

				return item.component
			}
		}
		return undefined
	}

	/** 将工作流的默认参数赋值给bindParams */
	const handleWorkFlowParamsToBindParam = () => {
		if (!workflow.value || !workflow.value.params) {
			return
		}
		
		// 完全清空现有参数，避免残留
		bindParam.value = {}
		
		// 重新设置当前工作流的默认参数
		workflow.value.params.forEach(item => {
			(bindParam.value as any)[item.name] = item.param
		})
		
		console.log('🔄 参数已重置为工作流默认值:', bindParam.value)
	}

	const socketState = inject<SocketState>('socketState')
	if (!socketState) {
		throw new Error('socketState is not provided')
	}

	const closeSocketAsync = () => {
		return new Promise(resolve => {
			uni.closeSocket({
				code: 1000,
				reason: 'Initializing new WebSocket',
				success(result) {
					resolve(true)
				},
				fail(result) {
					resolve(false)
				},
			})
		})
	}

	const socketInit = async (
		options: SocketInitOptions = {
			params: {
				type: IWebsocketSceneType.drawProcessPush,
				data: { scene_str: '' },
			},
		}
	) => {
		//如果未登录状态，不初始化WebSocket
		if (!isLogin.value) {
			throw new Error('未登录状态，不允许初始化Websocket')
		}
		console.log('socket init execution')
		if (socketState?.isInitialized && socketState?.options?.params?.type === options?.params?.type) {
			console.log('WebSocket is already initialized')
			return
		}
		if (socketState?.isInitialized && socketState?.options?.params?.type !== options?.params?.type) {
			//说明场景不一样，需要重新初始化
			console.log('WebSocket is already initialized,but scene is different,reinitialize')
			await closeSocketAsync()
			if (socketState) socketState.isInitialized = false
		}

		const { params } = options
		const { type, data } = params as IWebSocketParams

		const { uniPlatform } = uni.getSystemInfoSync()
		const dataStr = typeof data === 'string' ? data : JSON.stringify(data || {});
		const url = `${getBaseWsURL()}?user_id=${getLoginInfo()._id}&type=${type}&platform=${uniPlatform}&data=${encodeURIComponent(dataStr)}`;
		console.log('WebSocket URL:', url);
		socketState.socket = uni.connectSocket({
			url: url,
			complete: () => {
				console.log('WebSocket connect complete')
			},
		})
		console.log('WebSocket连接已发起:', url);
		socketState.isInitialized = true
		uni.onSocketOpen(result => {
			console.log('WebSocket opened', result)
			// 保存options
			socketState.options = options
			if (options.onConnect) {
				options.onConnect()
			}
		})
		uni.onSocketMessage(msg => {
			if (options.onMessage) {
				options.onMessage(msg.data)
			}
			handleSocketMessage(msg.data)
		})
		uni.onSocketError(err => {
			console.error('WebSocket onError', err)
			socketState.isInitialized = false
			if (options.onConnectError) {
				options.onConnectError(err)
			}
		})
		uni.onSocketClose(() => {
			socketState.isInitialized = false
			console.log('WebSocket onClose')
			if (options.onDisconnect) {
				options.onDisconnect()
			}
		})
	}

	/** 握手消息 */
	const handleSocketHandShake = (timeout = 200) => {
		return new Promise(resolve => {
			const timeoutID = setTimeout(() => {
				resolve(false)
			}, timeout)
			if (!socketState || !socketState.socket || !socketState.isInitialized) {
				resolve(false)
				return
			}
			socketState.socket?.send({
				data: 'ping',
				success(result) {
					console.log(result)
					clearTimeout(timeoutID)
					resolve(true)
				},
			})
		})
	}
	/** 处理Websocket消息 */
	// const handleSocketMessage = (msg: never, callback?: (messageObj: never) => void) => {
	//   console.log('原始消息', msg)
	//   const msgObj = parseJSONToObject<{ type: never; data: never; queue_status: IDrawTaskStatus }>(
	//     msg
	//   )
	//   if(!msgObj) return;
	//   //自定义回调
	//   if (callback) {
	//     callback(msgObj)
	//   }
	//   const { queue_status } = msgObj

	//   if (!queue_status) {
	//     return
	//   }
	//   // 从websocket消息中获取output
	//   const index = localTasks.value.findIndex(item => item._id === queue_status.task_id)
	//   if (index !== -1) {
	//     if (queue_status.progress) localTasks.value[index].progress = queue_status.progress
	//     if (queue_status.queue) localTasks.value[index].queue = queue_status.queue
	//     if (queue_status.time_remained !== undefined)
	//       localTasks.value[index].time_remained = queue_status.time_remained
	//     if (queue_status.message) localTasks.value[index].message = queue_status.message
	//   }
	//   if (queue_status.status === 'started' && index !== -1) {
	//     localTasks.value[index].status = 4
	//     localTasks.value[index].message = '任务开始'
	//   }
	//   if (queue_status.status !== 'failed' && index !== -1 && localTasks.value[index].status === 3) {
	//     localTasks.value[index].status = 0
	//     localTasks.value[index].message = queue_status.message
	//   }
	//   if (queue_status.status === 'success' && index !== -1 && localTasks.value[index].status !== 1) {
	//     localTasks.value[index].output = queue_status?.data?.output || []
	//     localTasks.value[index].type = queue_status?.data?.type || 'image'
	//     localTasks.value[index].status = 1
	//     refreshUserInfo().then()
	//   }
	//   if (queue_status.status === 'failed') {
	//     if (index !== -1 && localTasks.value[index].status !== 2) {
	//       localTasks.value[index].status = 2
	//       localTasks.value[index].message = queue_status.message
	//     }
	//   }
	// }
	/** 处理Websocket消息 */
	 const handleSocketMessage = (msg: any, callback?: (messageObj: any) => void) => {
	   console.log('原始消息', msg)
	   const msgObj = parseJSONToObject<{ type: any; data: any; queue_status: IDrawTaskStatus }>(
	     msg
	   )
	   if(!msgObj) return;
	   //自定义回调
	   if (callback) {
	     callback(msgObj)
	   }
    const { queue_status } = msgObj

    if (!queue_status) {
      return
    }
    // 从websocket消息中获取output
    const index = localTasks.value.findIndex(item => item._id === queue_status.task_id)
    if (index !== -1) {
      // 确保进度值能够正确触发响应式更新
      if (queue_status.progress !== undefined) {
        localTasks.value[index].progress = Number(queue_status.progress)
      }
      if (queue_status.queue !== undefined) localTasks.value[index].queue = queue_status.queue
      if (queue_status.time_remained !== undefined)
        localTasks.value[index].time_remained = queue_status.time_remained
      if (queue_status.message) localTasks.value[index].message = queue_status.message
      
      // 强制触发响应式更新
      localTasks.value = [...localTasks.value]
    }
    if (queue_status.status === 'started' && index !== -1) {
      localTasks.value[index].status = 4
      localTasks.value[index].message = '任务开始'
    }
    if (queue_status.status !== 'failed' && index !== -1 && localTasks.value[index].status === 3) {
      localTasks.value[index].status = 0
      localTasks.value[index].message = queue_status.message
    }
    if (queue_status.status === 'success' && index !== -1 && localTasks.value[index].status !== 1) {
      localTasks.value[index].output = queue_status?.data?.output || []
      localTasks.value[index].type = queue_status?.data?.type || 'image'
      localTasks.value[index].status = 1
      refreshUserInfo().then()
    }
    if (queue_status.status === 'failed') {
      if (index !== -1 && localTasks.value[index].status !== 2) {
        localTasks.value[index].status = 2
        localTasks.value[index].message = queue_status.message
      }
    }
  }
	/** 创建任务 */
	const handleCreateTask = async () => {
		if (!workflow.value) {
			throw new Error('工作流未初始化')
		}
		const item: IDrawHistoryItemCreat = {
			params: { ...bindParam.value } as IComfyUIProperties,
			workflow_id: workflow.value._id,
			user_id: getLoginInfo()._id,
			options: {
				workflow_id: workflow.value._id,
				workflow_title: workflow.value.title,
				workflow_name: workflow.value.name,
			},
			type: outputType.value,
		}
		return await creatDrawHistoryTask(item)
	}

	/** 更新本地任务的状态 */
	const handleUpdateTaskStatus = async (taskItem: IDrawHistoryItem, output: IDrawResponse) => {
		const index = localTasks.value.findIndex(item => item._id === taskItem._id)
		if (index !== -1) {
			localTasks.value[index].output = output.output
			localTasks.value[index].status = 1
			localTasks.value = [...localTasks.value]
		}
	}

	/** 提交绘画任务到服务器 */
	const handleSubmitTaskTask = async () => {
		if (!isLogin.value) {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
				duration: 2000,
			})
			return
		}
		if (!workflow.value) {
			uni.showToast({
				title: '工作流未初始化',
				icon: 'none',
				duration: 2000,
			})
			return
		}

		if (!(await handleSocketHandShake())) {
			await socketInit()
		}

		const newTask = await handleCreateTask()
		console.log('newTask', newTask)
		if (!newTask) {
			return
		}

		// 添加任务到本地队列
		localTasks.value.unshift(newTask as any)
		
		// 直接提交所有用户输入的参数
		console.log('🎯 直接提交用户参数:', bindParam.value)

		const requestParams: IComfyUIRequestParams = {
			params: bindParam.value as IComfyUIProperties,
			options: {
				workflow_id: workflow.value._id,
				task_id: newTask._id,
			},
		}


		const result = await submitCustomWorkflow(requestParams)
		if (result.status === 'success' && result.output && result.output.length > 0) {
			await handleUpdateTaskStatus(newTask, result)
			refreshUserInfo().then()
		}
		if (result.status === 'failed' || result.status === 'rejected') {
			uni.showToast({
				title: result.message,
				icon: 'none',
				duration: 2000,
			})
		}
	}

	return {
		workflow,
		workFlowParamLists,
		bindParam,
		params_component_list,

		socketInit,
		// socketState,
		// closeSocketAsync,

		handleFindComponentName,
		handleGetWorkFlwById,
		handleSubmitTaskTask,
	}
}