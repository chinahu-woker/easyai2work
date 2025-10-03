<script setup lang="ts">
	import { computed, inject, onMounted, ref, nextTick } from "vue";

	import { isLogin } from "@/composables/useCommon.ts";
	import BaseLayout from "@/layouts/BaseLayout.vue";
	import useWorkFlow from "@/composables/useWorkFlow.ts";
	import ImageUpload from "@/components/dynamic/ImageUpload.vue";
	import CustomSlider from "@/components/dynamic/CustomSlider.vue";
	import Height from "@/components/dynamic/Height.vue";
	import MyCard from "@/components/common/MyCard.vue";
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import Positive from "@/components/dynamic/Positive.vue";
	import TnNavbar from '@tuniao/tnui-vue3-uniapp/components/navbar/src/navbar.vue'
	import MyTitle from "@/components/common/MyTitle.vue";
	import MyNavbar from "@/components/common/MyNavbar.vue";
	import Picker from "@/components/dynamic/Picker.vue";
	import CustomNumberBox from "@/components/dynamic/CustomNumberBox.vue";
	import Width from "@/components/dynamic/Width.vue";
	import Seed from "@/components/dynamic/Seed.vue";
	import ImageSelectPreview from "@/components/dynamic/ImageSelectPreview.vue";
	import type { IComfyUIProperties, IImageSelectItem } from "@/types";
	import ModeSelect from "@/components/dynamic/ModeSelect.vue";
	// import MyPopup from "@/components/common/MyPopup.vue";
	// import TaskProgress from "@/components/TaskProgress.vue";
	// import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	// import TnSuspendButton from 'tnuiv3p-tn-suspend-button/index.vue'
	import { storeToRefs } from "pinia";
	import { useAppStore } from "@/stores/appStore.ts";
	import { randomId } from "@/utils/common.ts";
	import DragButton2 from "@/components/common/DragButton2.vue";


	/** 所有的组件 */
	const components = {
		ImageUpload,
		CustomSlider,
		Height,
		Positive,
		Picker,
		CustomNumberBox,
		Width,
		Seed,
		ImageSelectPreview,
		ModeSelect
	}

	/** 参数名称与组件名称的映射 */
	export interface ParamToComponentMapping {
		param : keyof IComfyUIProperties
		component : keyof typeof components
		title ?: string
	}

	// 获取页面的query的应用ID

	const {
		workflow,
		handleGetWorkFlwById,
		workFlowParamLists,
		bindParam,
		params_component_list,
		socketInit,
		handleFindComponentName,

		handleSubmitTaskTask
	} = useWorkFlow()

	console.log('-------------useWorkFlow()----------------', useWorkFlow())
	// console.log('-------------workFlowParamLists----------------',workFlowParamLists)
	// console.log('-------------useWorkFlow()----------------',useWorkFlow())

	const workflowId = ref('')

	onLoad(async () => {
		const currentPage = getCurrentPages().pop(); // 获取当前页面栈中的最后一个页面
		const query = currentPage?.options; // 获取 query 参数
		workflowId.value = query.id
		handleGetWorkFlwById(query.id).then(() => console.log('///////////////////', workflow.value))
		socketInit()
	})
	function to_apps(item_id) {
		if (!isLogin.value) {
			console.log("-------------isLogin-----------", isLogin)
			uni.showToast({
				icon: 'error',
				title: '您还没有登录',
				duration: 2000,
				complete() {
					setTimeout(() => {
						uni.navigateBack()
					}, 2000)
				}

			}
			)

		}
		else {
			console.log("我点击啦~~~~~~~~", item_id)
			uni.navigateTo({ url: '/pages/draw/apps/apps?id=' + item_id });
		}

	}

	const showPopup = ref(false)


	const { localTasks } = storeToRefs(useAppStore())
	const currentProgress = computed(() => {
		const excuTask = localTasks.value.find(item => item.status === 4)
		if (!excuTask) {
			return '空闲'
		}
		return excuTask.progress + '%'
	})



	// 定义动画相关的响应式数据
	const endPos = ref({ x: 0, y: 0 });


	const getBoundingClientRectAsync = async (selectQuery : string) => {
		await nextTick(); // 确保 DOM 完全渲染后再执行
		const query = uni.createSelectorQuery();
		return new Promise((resolve, reject) => {
			query.select(selectQuery).boundingClientRect(res => {
				console.log('res', res)
				resolve(res);
			}).exec();
		});
	};


	const anims = ref<any[]>([]);

	const startAnimation = async () => {
		if (seedRef.value && seedRef.value.length > 0) {
			for (const item of seedRef.value) {
				item.getSeed()
			}
		}
		handleSubmitTaskTask()
		const key = randomId(5);
		anims.value.push({
			key,
			id: "addBtn",
			left: 0,
			top: 0,
			y: 0,
			x: 0,
		});
		// 获取点击元素的节点信息

		await nextTick(); // 确保 DOM 完全渲染后再执行
		const submitBtn = uni.createSelectorQuery().select('#submit-btn');
		const cartBtn = uni.createSelectorQuery().select('#cartBtn');

		submitBtn.boundingClientRect().exec((rect) => {
			// console.log('rect',rect)
			// submitBtnCenter.value={x:rect[0].left+rect[0].width/2,y:rect[0].top}
			// //运动物体初始化位置
			// ballTop.value=submitBtnCenter.value.y
			// ballLeft.value=submitBtnCenter.value.x

			//初始化位置
			// 初始化起始位置
			anims.value.some((citem) => {
				if (citem.key === key) {
					citem.top = rect[0].top;
					citem.left = rect[0].left + rect[0].width / 2;
					return true;
				}
				return false;
			});
			nextTick(() => {
				// 设置目标位置，目前位置在右侧时需要做处理
				let end = { x: 0, y: 0 }
				if (endPos.value.x > 300) {
					end = { x: endPos.value.x - 50, y: endPos.value.y }
				} else {
					end = { x: endPos.value.x, y: endPos.value.y }
				}
				anims.value.some((citem) => {
					if (citem.key === key) {
						citem.y = end.y - rect[0].top;
						citem.x = end.x - rect[0].left - rect[0].width / 2;
						setTimeout(() => { // 等待动画执行完毕移除元素
							anims.value.splice(anims.value.findIndex((v : any) => v.key === key), 1);
						}, 500);
						return true;
					}
					return false;
				});
			});

		})
	};

	const handToggelePregress = () => {
		showPopup.value = !showPopup.value
	}


	// 随机种子操作
	const seedRef = ref<any[]>([])

	// const leftClick = (item: IWorkFlow) => {
	//   appStore.tabbarIndex=null
	//   uni.redirectTo({url: '/pages/draw/apps/apps?id=' + item._id});
	// }

	function leftClick() {
		// 优先使用 navigateBack 返回上一页，保持页面缓存
		const pages = getCurrentPages()
		if (pages.length > 1) {
			// 如果有上一页，直接返回
			uni.navigateBack({
				delta: 1,
				animationType: 'pop-out',
				animationDuration: 200
			})
		} else {
			// 如果没有上一页，则跳转到首页
			uni.switchTab({ url: '/pages/index/index' })
		}
	}

	function linkType(url) {
		// 如果输入不是字符串，返回 2（未知类型）
		if (typeof url !== 'string') return 2;

		// 图片扩展名正则表达式
		const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
		// 视频扩展名正则表达式
		const videoExtensions = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;

		// 判断是否为图片
		if (imageExtensions.test(url)) return 0; // 返回 0 表示图片
		// 判断是否为视频
		if (videoExtensions.test(url)) return 1; // 返回 1 表示视频

		// 都不是，返回 2（未知类型）
		return 2;
	}
	const backGroundImage = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg'

</script>

<template>
	<view>
		<fui-nav-bar background="transparent" :title="workflow?.title " @leftClick="leftClick">
			<fui-icon name="arrowleft"></fui-icon>

		</fui-nav-bar>
		<fui-background-image
			:src="backGroundImage">
		</fui-background-image>

		<view style="text-align: center; margin-top: 15%;">
			<view v-if="linkType(workflow?.cover) == 0">
				<view style="margin-top: 6%;">
					<image @click="showGallery" style="width: 50%; height: 300px; background-color:transparent;"
						:mode="scaleToFill" :src="workflow.cover" :show-menu-by-longpress='true'></image>
				</view>

			</view>
			<view v-if="linkType(workflow.cover) == 1">
				<view style="margin-top: 6%;">
					<video object-fit='fill' :controls='false'
						style="width: 50%; height: 300px; background-color:transparent;" id="myVideo"
						:src="workflow.cover" controls></video>
				</view>

			</view>
		</view>
		<view style="margin-left: 10%; margin-top: 5%; margin-right: 10%;">
			<fui-section :title="workflow.title" :descr="workflow.description" descrColor='#000000'></fui-section>
		</view>


		<view style="margin-top: 30%; width: 100%;  ">
			<view style="width: 500rpx; margin-left: 16%;">

				<fui-button @click="to_apps(workflow._id)" width="300"
					radius="96rpx">消耗{{workflow.power || 0}}算力点</fui-button>
			</view>
		</view>


	</view>

</template>

<style scoped lang="scss">
	.fui-vip__icon {
		width: 48rpx;
		height: 48rpx;
		margin-left: 16rpx;

	}

	/* 页面样式 */
	.page {
		background-color: transparent;
		position: relative;
		min-height: 100vh;
		/* 确保页面内容撑满屏幕 */
	}

	.container {
		position: relative;
		padding-top: 80rpx;
		/* 顶部导航栏的高度 + 小间距 */
		padding-bottom: 120px;
		/* 底部导航栏的高度 + 小间距 */
	}

	/* 居中按钮样式 */
	.floating-button {
		width: 80%;
		position: fixed;
		bottom: 70px;
		/* 底部导航栏的高度 + 小间距 */
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		/* 确保按钮在底部导航栏上方 */
	}

	.submit-button {
		background: linear-gradient(to right, $u-primary-lighten, $u-primary);
		border-radius: 50px;
		box-shadow: 0 3px 5px var(--primary-color-light);
	}


	.cart {
		position: absolute;
		top: 50px;
		right: 30px;
		background-color: #f0f0f0;
		padding: 10px;
	}

	.add-icon {
		position: absolute;
		background-color: $u-primary;
		color: white;
		width: 40px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		border-radius: 50%;
		animation: moveAnimation 1s ease-in-out forwards;
	}

	.content-default {
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(360deg, $u-primary-lighten 0%, $u-primary 100%);
		box-shadow: 0 4rpx 12rpx 0 #ADC3F8;
		border-radius: 50rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: verticalMove 2s ease-in-out infinite;
	}

	/* 上下移动动画 */
	@keyframes verticalMove {
		0% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-20px);
			/* 上移 */
		}

		100% {
			transform: translateY(0);
			/* 恢复到原位 */
		}
	}
</style>