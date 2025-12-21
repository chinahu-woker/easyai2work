<template>
	<fui-nav-bar background="transparent" :title="控制中心 " @leftClick="leftClick">
		<fui-icon name="arrowleft"></fui-icon>

	</fui-nav-bar>
	<view>
		<fui-vtabs :vtabs="vtabs" :activeTab="activeTab" ref="vtabs" @click="onTabClick" @change="onChange">
			<!--注意：联动时，tabIndex属性为必传参数-->
			<fui-vtabs-content v-for="(item,index) in vtabs" :key="index" :tabIndex="index">
				<view class="fui-vtabs-content__item" :style="{paddingBottom:vtabs.length-1===index?'800px':'0'}">

					<view v-if="item.id == 0" class="fui-content--box">
						<TnImageUpload v-model="managerData" :custom-upload-handler="uploadFilePromise" />
						<fui-button @click="subMth" width="300" radius="96rpx">提交</fui-button>
					</view>
				</view>
			</fui-vtabs-content>
		</fui-vtabs>
	</view>
</template>

<script setup lang="ts">
	import TnImageUpload from "@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.vue";

	import type {
		ImageUploadCustomFunction,
		ImageUploadFile,
		TnImageUploadInstance
	} from "@tuniao/tnui-vue3-uniapp";

	import {
		uploadFile
	} from "@/utils/request.ts";

	import {
		getModelList,
		getUserKey,
		getUserToken,
		getUserInfo,
		ChatAPiUrl
	} from "@/composables/aiChat.ts";
	import {
		ref,
		onMounted,
		onUnmounted,
		computed,
		watch,
		nextTick
	} from 'vue'
	import {
		GetAllManagerInfor,
		SubmitSwiper
	} from "@/composables/console.ts";
	import {
		onLoad,
		onReady,
		
	} from "@dcloudio/uni-app";

	// const vtabs = []
	onLoad(() => {
		managerInfo()
	})

	function onTabClick(e) {
		const index = e.index
		console.log('tabClick', e.index)
		if (e.index == 1) {
			managerInfo()
		}
	}
	// ----------------------
	const uploadFilePromise : ImageUploadCustomFunction = async (file : ImageUploadFile) => {
		const url = (file as UniApp.ChooseImageSuccessCallbackResultFile).path
		return new Promise(async (resolve, reject) => {
			const uploadResult = await uploadFile<string>(url)
			console.log("uploadResult", uploadResult)
			subPicUrl.value = uploadResult
			if (uploadResult) {
				resolve(uploadResult)
			}
		})
	};
	const imageUploadRef = ref<TnImageUploadInstance>()
	const chooseFile = () => {
		imageUploadRef.value?.chooseFile()
	}
	// ---------------------------
	const subPicUrl = ref()
	const managerData = ref([])
	const allData = ref()
	async function subMth() {
		const Newdata = []
		managerData.value.forEach(item => {
			Newdata.push({
				"src": item,
				"href": "",
				"label": "",

			});
		});
		console.log("Newdata的值是", Newdata)
		const token = ref()
		await getUserToken().then(res => {
			console.log('getUserToken获取到的getUserToken信息:', res.data);
			token.value = res.data.token
		}).catch(err => {
			console.error('getUserToken获取getUserToken失败:', err);
			uni.showToast({
				title: 'Token失效',
				duration: 2000
			});
			return 0
		});

		await SubmitSwiper(token.value, { "home_banner": Newdata }).then(res => {
			console.log("Newdata的回调值是", { "home_banner": Newdata })
			allData.value = res.data
			managerData.value = res.data.home_banner.map(a => a.src);
			uni.showToast({
				title: '提交成功',
				duration: 2000
			});
		}).catch(err => {
			console.error('获取getUserToken失败:', err);
		})

	}
	async function managerInfo() {
		const token = ref()
		await getUserToken().then(res => {
			console.log('managerInfo获取到的getUserToken信息:', res.data);

			token.value = res.data.token
		}).catch(err => {
			console.error('获取getUserToken失败:', err);
		});
		await GetAllManagerInfor(token.value).then(res => {
			console.log('managerInfo获取到的managerInfo信息:', res.data);
			allData.value = res.data
			managerData.value = res.data.home_banner.map(a => a.src);
		}).catch(err => {
			console.error('获取getUserToken失败:', err);
		})
	}




	const activeTab = 0
	const vtabs = [{
		name: '小程序轮播图管理',
		id: 0
	},
	{
		name: '开发中',
		id: 1
	},

	]

	function leftClick() {
		uni.redirectTo({
			url: '/pages/index/index'
		})
	}
</script>

<style>
	page {
		background: #fff;
		font-weight: normal;
	}

	.fui-vtabs-content__item {
		width: 100%;
		/* padding: 0 20rpx; */
		box-sizing: border-box;
		overflow: hidden;
	}

	.fui-img {
		width: 100%;
		height: 268rpx;
		display: block;
		margin-top: 24rpx;
	}

	.fui-content--box {
		width: 100%;
		padding: 30rpx 24rpx 40rpx;
		box-sizing: border-box;
	}

	.fui-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
	}

	.fui-descr {
		display: block;
		font-size: 24rpx;
		padding-top: 24rpx;
	}
</style>