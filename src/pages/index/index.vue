<template>

	<view class="fuiNavBar">
		<fui-nav-bar custom background='transparent'>
			<view class="fui-search__box ">
				<fui-tabs class="tabs_class" direction='column' color='#ACB0D0' :isSlider='false'
					selectedColor='#17135F' :tabs="tabbarData" scale='1.5' @change="changeHomePage" :center="false"
					:short="true" :scroll='false' itemPadding="25" :current="pageindex" size='28' fontWeight='900'
					background='transparent'></fui-tabs>
			</view>
		</fui-nav-bar>

	</view>
<fui-background-image :src="backGroundImage">
		</fui-background-image>
	<view v-show="pageindex==0">

		
		<AppSwiper />

		<up-gap height="10"></up-gap>
		<!--  搜索-->
		<!-- <Search /> -->
		<!-- // 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
		
		// 背景图片和用到的素材我都给大家放在/src/static里了 -->
		<!-- 	<image @click="img2pay"
			style="width: 320rpx; height: 106rpx; background-color: transparent; display:inline-block; box-sizing:border-box; position:relative; left:40rpx;"
			mode="scaleToFill" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/画板 2 (1).png"></image>
		<image @click="handleGotoHistory"
			style="width: 320rpx; height: 106rpx; background-color: transparent; display:inline-block; box-sizing:border-box; position:relative; left:70rpx;"
			mode="scaleToFill" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/画板 3.png"></image> -->

		<up-gap height="10"></up-gap>
		<AppTags />

		<AppWaterFall />

	</view>
	<view v-show="pageindex==1">
		<!-- <fui-background-image :src="backGroundImage">
		</fui-background-image> -->



		<BaseLayout>
			<view>
				<up-status-bar />

				<template v-for="(graphicData,KeyIndex) in graphicDatas" :key="KeyIndex">

					<view>
					 <!--  -->
						<MyGraphicCard @click="goToEntire(graphicData.id)" :avatar="graphicData.avatar" :title="graphicData.title"
							:username="graphicData.username" :description="graphicData.description"
							:tags="graphicData.tags" :content="graphicData.content" :images="graphicData.images"
							:view-count="graphicData.viewCount" :comment-count="graphicData.commentCount"
							:like-count="graphicData.likeCount" :view-user-avatars="graphicData.viewUserAvatars" >
						</MyGraphicCard>
					</view>
				</template>
			</view>



		</BaseLayout>
		<view style="height: 200rpx;"> <fui-footer text="Copyright © 2021 Fuzi-AI"></fui-footer></view>


	</view>
	<view v-show="pageindex==2">
		<!-- <fui-background-image :src="backGroundImage">
		</fui-background-image> -->


		<view class="fui-wrap">

			<scroll-view scroll-y="true" class="scroll-Y" scroll-with-animation :scroll-into-view="items">
				<view class="fui-chat__box" ref="chatBox">
					<view v-for="(item,index) in msgList" :key="index">
						<view :id="`items-${index}`" class="fui-chat__item"
							:class="[item.role=='user'?'fui-chat__right':'fui-chat__left']">
							<!-- @tap="getCopyMsg(1,item?.msg,$event)" @longpress="getCopyMsg(2,item.content,$event)" -->
							<fui-avatar background="#f9f9f9"
								:src="item.role=='system'?'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/gpt4.png':user.avatar_url">
							</fui-avatar>
							<view class="fui-chat__content">
								<text v-if="item.content.length >1 " @click="copyText(item.content)"
									decode>{{item.content}}</text>
								<view v-if=" item.content.length <1 ">
									<fui-load-ani type='3' color=" #7f7d79"></fui-load-ani>
								</view>
							</view>
						</view>



					</view>
				</view>
			</scroll-view>
			<view class="fui-chatbar__fixed">
				<view style="margin-left: 5%;"> 当前模型：{{ chooseModel || modelList[0] }}</view>
				<view class="fui-chatbar__wrap">
					<view class="AITool">
						<view>
							<!-- 切换模型 -->
							<fui-icon name="message" color="#3b3ee9" @click="popupMth"></fui-icon>
						</view>
					</view>

					<view class="fui-chatbar__input-box">
						<!-- 输入框 -->
						<textarea :enableNative="false" auto-height :show-count="false" fixed disable-default-padding
							confirm-type="send" class="fui-chatbar__input" :maxlength="-1" v-model="content"
							@confirm="msgSend">
							</textarea>
					</view>
					<view class="fui-chatbar__icon-box fui-chatbar__send-box">

						<view v-if="content.length == 0">
							<!-- 选择图片 -->
							<fui-icon name="clear" color="#3b3ee9"></fui-icon>
						</view>
						<!-- <view v-if="msgStatu == true ">
							
							<fui-icon name="play" color="#e9344f" ></fui-icon>
						</view> -->
						<view v-else>
							<!-- 发送按钮 -->
							<image src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/send.png" @tap="msgSend">
							</image>
						</view>
					</view>
				</view>
				<fui-picker :options="modelList" :show="popup" @change="change" @cancel="cancel"></fui-picker>
				<!-- <fui-bottom-popup :show="popup" @close="closePopup">
					<view class="fui-custom__wrap">
						上传图片
					</view>
				</fui-bottom-popup> -->
				<fui-safe-area background="#f8f8f8"></fui-safe-area>
			</view>
		</view>




	</view>
	<view v-show="pageindex==3">
		<fui-background-image :src="backGroundImage">
		</fui-background-image><template>
			<BaseLayout>
				<view style="margin-top: -20%;">
					<!-- <MyNavbar /> -->
					<up-status-bar />
					<view class="u-flex u-row-right" style="width: 100%;">
						<view class="camera u-flex u-row-center">
						</view>
					</view>
					<view class=" trans_back u-flex u-flex-y-center u-flex-around user-box u-p-l-30 u-p-r-20 u-p-b-30"
						@click="handleLogin">
						<view class="u-m-r-10">
							<up-avatar :src="user.avatar_url" size="80">
							</up-avatar>
							<view v-if="!isLogin" class="tn-text-center tn-text-sm tn-gray-dark_text"
								style="position: relative;bottom: 0;">点击登录</view>
						</view>
						<view class="u-flex-1">
							<view v-if="isLogin" class="u-font-18 u-p-b-10 tn-text">昵称：{{ user.nickname }}</view>
							<view v-else class="u-font-18 u-p-b-10 tn-gray-dark_text">未登录</view>
							<!--        会员信息-->
							<view>
								<UserMemberInfo></UserMemberInfo>
							</view>
							<!--        完善用户信息-->
							<view v-if="isLogin" class="tn-text-xs tn-gray-dark_text">余额：{{user.balance}}</view>
							<GetUserInfoPopup />

						</view>

						<view class="u-m-l-10 u-p-10" @click='toEmpty'>
							<up-icon name="scan" color="#969799" size="28"></up-icon>
						</view>
						<view class="u-m-l-10 u-p-10" @click='toEmpty'>
							<up-icon name="arrow-right" color="#969799" size="28"></up-icon>
						</view>
					</view>

					<!-- <view class="u-m-t-20">
						<up-cell-group class="trans_back">
							<up-cell icon="rmb-circle" title="算力充值" @click="showPay=true" :border='false'> </up-cell>
						</up-cell-group>
					</view> -->
					<image @click="img2pay"
						style="width: 675rpx; margin-bottom: -1%; height: 130rpx; background-color: transparent; display:inline-block; box-sizing:border-box; position:relative; margin-left:5%;"
						mode="scaleToFill" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/会员模块.png">
					</image>
					<view class="u-m-t-20" style="border-color: transparent; margin-left: 5%; margin-right: 5%;">
						<up-cell-group color='#fff' :border="false" class="trans_back">
							<!--        <up-cell icon="star" title="收藏(暂未开放)"></up-cell>-->



							<view v-if="isLogin"
								style=" margin-top:5% ; color: #000000; height: 100%; background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1)); border-radius: 10px 10px 10px 10px; height: 120rpx; ">
								<up-cell :border='false' @click="handleGotoHistory">
									<template #icon>
										<up-icon size="30"
											name="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Gallery.png"></up-icon>
									</template>
									<template #title>
										<text class="u-cell-text" style='color: #000000;'>绘图历史</text>
									</template>
								</up-cell>
							</view>

							<view
								style=" margin-top:5% ;color: #000000; height: 100%;  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1));  border-radius: 10px 10px 10px 10px;">
								<button
									style="background-color: transparent; margin: 0; padding: 0; text-align: left; border-color: transparent;"
									open-type="contact">
									<up-cell :border="false">
										<template #icon>
											<up-icon size="30"
												name="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Chat.png"></up-icon>
										</template>
										<template #title>
											<text class="u-cell-text" style='color: #000000;'>联系客服</text>
										</template>
									</up-cell>
								</button>
							</view>
							<view v-if="isLogin"
								style=" margin-top:5% ; color: #000000; height: 100%;  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1)); border-radius: 10px 10px 10px 10px; height: 120rpx; ">
								<up-cell :border='false' @click="handleLoginOut">
									<template #icon>
										<up-icon size="30"
											name="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Home.png"></up-icon>
									</template>
									<template #title>
										<text class="u-cell-text" style='color: #000000;'>退出登录</text>
									</template>
								</up-cell>

							</view>
							<view v-if='role'
								style=" margin-top:5% ; color: #000000; height: 100%;  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1)); border-radius: 10px 10px 10px 10px; height: 120rpx; ">
								<up-cell :border='false' @click="ToConsole">
									<template #icon>
										<up-icon size="30"
											name="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Setting.png"></up-icon>
									</template>
									<template #title>
										<text class="u-cell-text" style='color: #000000;'>管理台</text>
									</template>
								</up-cell>

							</view>
							<!--        <up-cell icon="coupon" title="卡券(暂未开放)"></up-cell>-->
							<!--        <up-cell icon="heart" title="关注(暂未开放)"></up-cell>-->
						</up-cell-group>
						<!-- 	<button open-type="share">分享到微信</button> -->
					</view>


				</view>
			</BaseLayout>
		</template>
	</view>
<PaymentPopup/>
</template>

<script setup lang="ts">
	import MyNavbar from "@/components/common/MyNavbar.vue";

	import GetUserInfoPopup from "@/components/GetUserInfoPopup.vue";
	import {
		creatOrder,
		getLoginInfo,
		getOrderInfoById,
		getPrePay,
		getProductList,
		isLogin,
		loginByUsername,
		loginByWechatCode,
		loginOut,
		refreshUserInfo,
		saveLoginInfo
	} from "@/composables/useCommon.ts";
	import BaseLayout from '@/layouts/BaseLayout.vue'

	import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
	import { globalAppData } from '@/cofigs'


	import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	import { onLoad, onReady, includes, onShow } from "@dcloudio/uni-app";

	// import useWorkFlow from "@/composables/useWorkFlow.ts";
	import useWorkFlow from "@/composables/useWorkFlow";

	import UserMemberInfo from "@/components/home/UserMemberInfo.vue";
	import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
	import TnWaterFall from '@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.vue'
	import { request } from "@/utils/request.ts";
	import type { IDrawHistoryItem } from "@/types";
	import TnGraphicCard from 'tnuiv3p-tn-graphic-card/index.vue'
	import MyGraphicCard from "@/components/custom/MyGraphicCard/MyGraphicCard.vue";
	import { formatDateTime } from "@/utils/common.ts";
	import AppSwiper from "@/components/home/AppSwiper.vue";
	import Search from "@/components/home/Search.vue";
	import AppTags from "@/components/home/AppTags.vue";
	import AppWaterFall from "@/components/home/AppWaterFall.vue";
	import Home from "@/pages/home/home.vue";
	import Creative from "@/pages/creative/creative.vue";
	import TaskExcuting from "@/components/common/TaskExcuting.vue";
	import BottomNavigation from "@/components/BottomNavigation.vue";
	import History from "@/pages/history/history.vue";
	import { storeToRefs } from "pinia";
	import { useAppStore } from "@/stores/appStore.ts";
	import { EventType } from "@/types/event.types.ts";
	import { on } from "@/utils/emitter.ts";
	import PaymentPopup from "@/components/home/PaymentPopup.vue";
	import fuiBackgroundImage from "@/components/firstui/fui-background-image/fui-background-image.vue";
	import { getModelList, getUserKey, getUserToken, getUserInfo, ChatAPiUrl } from "@/composables/aiChat.ts";

	import { TextEncoder, TextDecoder } from 'text-decoding'
	global.TextEncoder = TextEncoder
	global.TextDecoder = TextDecoder
	onLoad((options) => {
	if (options.pageindex) {
		pageindex.value = parseInt(options.pageindex)
	}
	})
	// 分享
	onShareAppMessage(() => {
		const inviteCode = useAppStore().user.my_invite_code
		// 在页面中定义分享方法
		return {
			title: globalAppData.share.appInfo,
			path: `/pages/index/index?inviteCode=${inviteCode}`,
		}
	})
	// 朋友圈
	onShareTimeline(() => {
		const inviteCode = useAppStore().user.my_invite_code
		return {
			title: globalAppData.share.appInfo,
			path: `/pages/index/index?inviteCode=${inviteCode}`,
		}
	})
	function ToConsole() {
		uni.navigateTo({
			url: '/pages/console/console'
		})

	}


	const role = ref(false)
	const roltList = ['manager', 'admin']
	function Kongzhitai() {
		if (!isLogin.value) {
			role.value = false
			return 0
		}
		else {
			const UserInfor = uni.getStorageSync('userInfo')
			
			console.log("361---userInfo---------------", roltList.includes(UserInfor.role[0]))
			role.value = roltList.includes(UserInfor.role[0]);
		}


	}
	// ---------------------------AIChat  Page------------------------------

	let items = ref('')



	function copyText(text) {

		uni.setClipboardData({
			data: text,
			success: () => {
				console.log('复制成功');
				// 可以在这里给用户提示
				uni.showToast({
					title: '复制成功',
					icon: 'none'
				});
			},
			fail: (err) => {
				console.error('复制失败', err);
				// 处理错误情况
				uni.showToast({
					title: '复制失败，请稍后再试',
					icon: 'none'
				});
			}
		});
	}
// --------------------------------------------------------------------------------------

let isNavigating = false
function goToEntire(id) {
  if (isNavigating) return
  isNavigating = true

  uni.navigateTo({
    url: `/pages/drawLike/alike?id=${id}`,
    complete: () => {
      isNavigating = false
    }
  })
}
// --------------------------------------------------------------------------------------
	async function chatAiGetToken() {
		const requestTask = ref()
		const userInfo = ref()
		// 获取 用户信息

		await getUserToken().then(res => {
			// console.log('获取到的getUserToken信息:', res.data);
			requestTask.value = res.data
		}).catch(err => {
			console.error('获取getUserToken失败:', err);
		});
		console.log('getUserToken执行完毕');
		// console.log('获取到的requestTask信息:', requestTask.value);
		await getUserInfo(requestTask.value).then(res => {
			// console.log('获取到的getUserInfo信息:', res.data);
			userInfo.value = res.data
		}).catch(err => {
			console.error('获取getUserInfo失败:', err);
		});
		console.log('getUserInfo执行完毕');
		await getModelList(requestTask.value.token).then(res => {
			// console.log('获取到的getUserInfo信息:', res.data);
			modelList.value = res.data
			chooseModel.value = res.data[0]
		}).catch(err => {
			console.error('获取getModelList失败:', err);
		});
		console.log('getModelList执行完毕');
		await getUserKey(userInfo.value, requestTask.value.refresh_token).then(res => {
			console.log('获取到的getUserKey信息:', res.data);
			userkey.value = res.data.key
		}).catch(err => {
			console.error('获取getUserKey失败:', err);
		});
		console.log('getUserKey执行完毕');
	}


	function chooseImage() {
		uni.showToast({
			icon: "error",
			title: '您没有输入',
			duration: 2000
		});
	}

	// 初始化 modelList 为一个空数组
	const popup = ref(false)
	const modelList = ref([]);
	const chooseModel = ref('')

	function change(e) {
		// 选择模型
		popup.value = false
		chooseModel.value = e.value
	}
	function cancel() { popup.value = false }
	function popupMth() {
		if (!isLogin.value) {
			uni.showToast({
				icon: "error",
				title: '您还没有登录',
				duration: 2000
			});
			return 0
		}


		popup.value = true
	}
	// 定义 fetchData 函数


	const content = ref('')
	const msgList = ref([{
		"content": "你好我是Ai聊天助手，有什么问题问我吧！(温馨提示：点击消息可以复制哦)",
		"role": "system"
	},

	])

	// ------------------------------------------------------------------------------------------------




	// 将下面的改成将你的oneapi的代理域名，注意因为这个域名是单独的，所以记得在小程序业务域名中添加
	//'https://{你的oneapi的域名}/v1/chat/completions', // 请求地址





	// ------------------------------------------------------------------------------------------------

	const userkey = ref('')
	const StreamRequest = (content) => {

		return new Promise((resolve, reject) => {
			const requestTask = uni.request({

				url: ChatAPiUrl(), // 请求地址
				method: "POST",

				data: {
					"messages": content,
					"model": chooseModel.value,
					"stream": true,
					"features": {
						"thinking_enabled": false
					}
				},
				dataType: "json",
				header: {
					'Authorization': 'Bearer sk-' + userkey.value
				},
				responseType: 'text',
				enableChunked: true, // 开启流传输
				success: (res) => {
					resolve(res);
					// console.log('请求成功', res);
					// uni.parseStreamData(res.data)
				}, // 请求成功回调
				fail: (err) => {
					reject(err);
					uni.showToast({
						icon: "error",
						title: '请求失败',
						duration: 2000
					});
					console.log('请求失败', err);
				} // 请求失败回调
			});

			// 监听进度更新事件
			requestTask.onChunkReceived((chunk) => {
				try {
					// 将 ArrayBuffer 转换为 Base64 字符串
					const base64 = wx.arrayBufferToBase64(chunk.data);
					// 将 Base64 字符串转换为 ArrayBuffer
					const arrayBuffer = wx.base64ToArrayBuffer(base64);
					// 使用 TextDecoder 解码 ArrayBuffer
					const text = new TextDecoder().decode(arrayBuffer, { stream: true });


					// console.log('text', text);
					handleStreamData(text);
				} catch (error) {
					console.error('处理数据块失败', error);
				}
			});
			requestTask.onHeadersReceived(() => {
				console.log('请求完成');

			});
		});
	}
	const msg = ref('')
	function handleStreamData(responseText) {
		const messages = responseText.split('\n').filter(line => line.startsWith('data:'));
		for (const message of messages) {
			// console.log('-----message---------',message)
			if (message.trim() === 'data: [DONE]') {
				msgStatu.value = true
				return;
			}
			try {
				const data = JSON.parse(message.substring(5).trim()); // 去掉 'data:' 前缀并解析 JSON
				if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
					msg.value += data.choices[0].delta.content;
				}
			} catch (error) {
				console.log('解析错误:', error);
			}
		}
		const index = msgList.value.length - 1
		msgList.value[index].content = msg.value
		items.value = "items-" + (msgList.value.length - 1)
		msgStatu.value = false

	}
	const msgStatu = ref(true)
	function msgSend() {
		if (!isLogin.value) {
			uni.showToast({
				icon: "error",
				title: '您还没有登录',
				duration: 2000
			});
			return 0
		}

		// console.log(chooseModel.value)
		if (chooseModel.value == undefined) {
			uni.showToast({
				icon: "error",
				title: '您没有选择模型',
				duration: 2000
			});
			return 0
		}
		if (msgStatu.value != true) {
			uni.showToast({
				icon: "error",
				title: '请等待消息结束',
				duration: 2000
			});
			return 0
		}

		msgList.value.push(
			{
				"content": content.value,
				"role": "user"
			}
		)
		content.value = ''
		StreamRequest(msgList.value)
		msgList.value.push({
			"content": '',
			"role": "system"
		})
		msg.value = ''
		console.log(msgList.value)
	}



	// -----------------------------------------
	onReady(() => {

		socketInit()
		on(EventType.PAY_SUCCESS, ({ order_id }) => handlePayMessage(order_id))
		wode_loging()
		chatAiGetToken()
		Kongzhitai()





	})
	onMounted(() => {
		getTestImageData()


	})

	onUnmounted(() => {
		//   销毁当前组件
		imageData.value = []
	})
	function img2pay() {
		// pageindex.value = 3
		console.log('点击支付')
		showPay.value = true
	}

	const fuiNavBar_class = ref('fuiNavBar')

	function changeStyle(e) {
		// console.log("changeStyle-----------------", e)
		if (e.isFixed == false) {
			fuiNavBar_class.value = "fuiNavBar"
		}
		else {
			fuiNavBar_class.value = "fuiNavBar_isTrue"
		}

	}
	// ------------------------------------------------------
	const { tabbarIndex } = storeToRefs(useAppStore())
	const pageindex = ref(0)
	const changeHomePage = (index : number) => {
		pageindex.value = index.index;
		if (index.index == 2) {
			chatAiGetToken()
		}
		// console.log('index', pageindex.value);


	};


	const name_value = ref('我的')
	function wode_loging() {
		if (!isLogin.value) {
			name_value.value = '登录'
		}
		else {
			name_value.value = '我的'

		}
	}
	const tabbarData = [
		{
			name: '首页',
			// to: '/pages/index/index',
			onClick: tabbarIndex
		},
		{
			name: '创意',
			// to: '/pages/creative/creative',
			onClick: tabbarIndex
		},
		{
			name: 'AI助手',
			// to: '/pages/creative/creative',
			onClick: tabbarIndex
		},
		{
			name: name_value,
			onClick: tabbarIndex,
		},

	]
	// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！

	// 背景图片和用到的素材我都给大家放在/src/static里了
	// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
	// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
	// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
	// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
	const backGroundImage = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg'


	const getTestImageData = async () => {
		imageData.value = await request<IDrawHistoryItem[]>('draw/history/findMany', {
			method: 'POST',
			data: {
				history: {
					is_deleted: false,
					is_public: true,
				}
			}
		})
	}
	const imageData = ref<IDrawHistoryItem[]>([])
	/**图文卡片展示的数据 */
	const graphicDatas = computed(() => {
		return imageData.value.map(item => {
			return {
				id: item._id,
				avatar: item.user_id?.avatar_url || '',
				username: item.user_id?.nickname || item.user_id?.username,
				title: item.options?.workflow_title,
				description: formatDateTime(new Date(item.created_at)),
				tags: item.tags,
				content: item.params?.positive?.slice(0, 120) + "...",
				images: (() => {
					// 生成参数
					const inputImages = []
					for (const key in item.params) {
						if (key.startsWith('image_path_') && item.params[key]) {
							inputImages.push(item.params[key])
						}
					}
					if (!item.output) {
						return inputImages
					}
					return [...inputImages, ...item.output]
				})(),
				commentCount: item.comment?.length
			}
		})
	})


	// ---------------------------------------------------------



	// -------------------------------------------------------

	function toEmpty() {
		uni.navigateTo({
			url: '/pages/Empty/Empty'
		})
	}
	const { user } = storeToRefs(useAppStore())
	const show = ref(true)
	const pic = ref('')
	function handleGotoHistory() {
		uni.navigateTo({
			url: '/pages/history/history_fui/history_fui'
		})
	}
	const handleLogin = async () => {
		if (isLogin.value) {
			return
		}
		uni.showLoading({
			title: '正在登录...',
			mask: true
		})
		//获取平台信息
		const { uniPlatform } = uni.getSystemInfoSync()

		if (uniPlatform !== 'web') {
			// 非开发者工具环境，执行登录操作
			handleLoginByWechat()

		} else {
			// console.log('dev')
			// 开发者工具环境，模拟登录 todo
			const user = await loginByUsername({
				username: 'test456',
				password: '123456'
			})
			saveLoginInfo(user)
			uni.hideLoading()
		}
		chatAiGetToken()
		name_value.value = '我的'
		Kongzhitai()
		 uni.reLaunch({ url: '/pages/index/index' });
		 uni.showLoading({
		 title: '加载中'
		 });
		// uni.reLaunch({
		//   url: '/' + getCurrentPages()[getCurrentPages().length - 1].route
		// });

	}
	/** 通过微信登录 */
	const handleLoginByWechat = () => {
		uni.login({
			success: async function ({ code }) {
				const result = await loginByWechatCode(code)
				saveLoginInfo(result)
				uni.hideLoading()
				console.log("------------result--------", result)
				uni.setStorageSync('refreshToken', result.refresh_token)


			},
			fail: function (err) {
				uni.showToast({
					title: '登录错误',
					icon: 'none'
				})
			}
		})
		chatAiGetToken()

	}
	const { socketInit } = useWorkFlow()

	const handlePayMessage = async (order_id : string) => {
		// 监听到支付成功事件
		console.log('收到支付成功消息', order_id)
		//查询订单支付状态进行复核
		const order = await getOrderInfoById(order_id)
		if (order[0] && order[0].order_status === 1) {
			uni.showToast({
				title: '支付成功',
				icon: 'none'
			})
			refreshUserInfo()
		}
	}
	const handleLoginOut = () => {
		uni.showLoading({
			title: '正在退出登录...',
			mask: true
		})

		loginOut()

		uni.hideLoading()
		role.value = false
		uni.showToast({
			title: '退出成功',
			icon: 'none'
		})
		name_value.value = '登录'
	}


	/** 支付 **/
	const { showPay } = storeToRefs(useAppStore())
</script>
<style scoped lang="scss">
	.scroll-Y {
		margin-top: -11%;
		height: 1200rpx;
	}

	.fui-custom__wrap {
		width: 100%;
		height: 520rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #EDEDED;
	}

	.AITool {
		margin-right: 24rpx;
		height: 72rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */


	}

	.image-data {
		width: calc(100% - 20rpx);
		margin: 10rpx;

		.image {
			width: 100%;
			height: auto;
		}
	}

	// ---------------------------------
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.u-cell-group {
		background-color: #fff;
	}

	.fui-search__box {

		background: transparent;
		width: 450rpx;
		height: 48px;
		margin-left: -0%;
		margin-top: -5%;
		box-sizing: border-box;

		border-radius: 0px;
		display: flex;
		align-items: center;
		justify-content: left;

	}

	.fuiNavBar_isTrue {
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		display: flex;

		background: #F8F8F8;
		color: #465CFF;
		font-weight: bold;

	}

	.fuiNavBar {



		// text-align: center;
		margin-top: 10%;
		margin-bottom: 10%;
	}

	.trans_back {
		background-color: transparent;
		border: transparent;

	}

	.tabs_class {
		width: 537rpx;
		display: flex;
		display: border-box;
	}

	.fui-wrap {
		background-color: transparent;
		padding-bottom: 108rpx;
	}

	.fui-chat__box {
		margin-top: 2%;
		width: 100%;
		padding: 48rpx 24rpx 0;
		box-sizing: border-box;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.fui-chat__item {
		width: 100%;
		display: flex;
		padding-right: 96rpx;
		margin-bottom: 148rpx;
		box-sizing: border-box;
		overflow: hidden;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.fui-chat__content {
		margin-left: 24rpx;
		background-color: #fff;
		padding: 20rpx 24rpx;
		box-sizing: border-box;
		border-radius: 0 32rpx 32rpx 32rpx;
		font-size: 32rpx;
		text-align: justify;
		display: flex;
		align-items: center;
		white-space: pre-wrap;
		word-break: break-word;
		/* overflow: hidden; */
		position: relative;
	}

	.fui-chat__left .fui-chat__content::after {
		content: '';
		position: absolute;
		left: -43rpx;
		top: 0;
		width: 44rpx;
		height: 44rpx;
		background-color: #fff;
		clip-path: polygon(45% 0, 100% 0, 100% 45%);
	}

	.fui-chat__left .fui-chat__content::before {
		content: '';
		position: absolute;
		left: -42rpx;
		top: 3rpx;
		width: 42rpx;
		height: 42rpx;
		background-color: #EDEDED;
		z-index: 2;
		border-radius: 50%;
	}

	.fui-chat__content text {
		max-width: 100%;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.fui-chat__right {
		padding-left: 96rpx;
		padding-right: 0;
		flex-direction: row-reverse;
	}


	.fui-chat__right .fui-chat__content {
		margin-left: 0;
		margin-right: 24rpx;
		border-radius: 32rpx 0 32rpx 32rpx;
		background-color: #465CFF;
		color: #fff;

	}

	.fui-chat__right .fui-chat__content::after {
		content: '';
		position: absolute;
		right: -43rpx;
		top: 0;
		width: 44rpx;
		height: 44rpx;
		background-color: #465CFF;
		clip-path: polygon(0 0, 45% 0, 0 45%);
	}

	.fui-chat__right .fui-chat__content::before {
		content: '';
		position: absolute;
		right: -42rpx;
		top: 3rpx;
		width: 42rpx;
		height: 42rpx;
		background-color: #EDEDED;
		z-index: 2;
		border-radius: 50%;
	}

	.fui-chatbar__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		padding: 6px 24rpx;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		background: #f8f8f8;
		box-sizing: border-box;
	}

	.fui-chatbar__input-box {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		position: relative;
		border-radius: 40rpx;
		box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 8rpx;
	}

	.fui-chatbar__input {
		/* #ifndef APP-NVUE || MP-ALIPAY || MP-QQ */
		width: 100%;
		min-height: 32rpx;
		box-sizing: content-box;
		padding: 20rpx 40rpx;
		/* #endif */
		/* #ifdef MP-ALIPAY || MP-QQ */
		line-height: 1;
		min-height: 72rpx;
		/* #endif */
		flex: 1;
		/* #ifdef APP-NVUE */
		height: 72rpx;
		padding: 16rpx 20rpx;
		/* #endif */
		border-radius: 40rpx;
		font-size: 32rpx;
		background: #fff;
	}

	.fui-chatbar__icon-box {
		height: 72rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */

	}

	.fui-chatbar__icon-box_left {
		height: 72rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */

	}

	.fui-chatbar__icon-box image {
		width: 68rpx;
		height: 68rpx;
		flex-shrink: 0;
	}

	.fui-chatbar__icon-box:active {
		opacity: .5;
	}

	.fui-chatbar__send-box {
		padding-left: 24rpx;
	}



	.fui-chatbar__fixed {
		/* margin-top: 20%; */
		margin-bottom: 0%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}
</style>