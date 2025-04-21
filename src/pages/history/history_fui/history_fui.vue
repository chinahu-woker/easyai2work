<script setup lang="ts">
	import TnTimeLine from 'tnuiv3p-tn-time-line/time-line.vue'
	import TnTimeLineItem from 'tnuiv3p-tn-time-line/time-line-item.vue'
	import TnTimeLineData from 'tnuiv3p-tn-time-line/time-line-data.vue'
	import TnPhotoAlbum from '@tuniao/tnui-vue3-uniapp/components/photo-album/src/photo-album.vue'
	import TnSwitchTab from '@tuniao/tnui-vue3-uniapp/components/switch-tab/src/switch-tab.vue'
	import TnLazyLoad from '@tuniao/tnui-vue3-uniapp/components/lazy-load/src/lazy-load.vue'
	import { computed, ref } from 'vue'
	import { request } from '@/utils/request.ts'
	import { formatDateTime } from "@/utils/common.ts";
	import type { IDrawHistoryItem } from "@/types";
	import BaseLayout from "@/layouts/BaseLayout.vue";
	import MyNavbar from "@/components/common/MyNavbar.vue";
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import TnTag from '@tuniao/tnui-vue3-uniapp/components/tag/src/tag.vue'
	import {

		isLogin

	} from "@/composables/useCommon.ts";




	interface TimeLineData {
		day : string
		icon ?: string
		data : IDrawHistoryItem[]
	}

	interface IHistoryResponse {
		total : number,
		items : IDrawHistoryItem[]
	}

	onLoad(() => {
		if (!isLogin.value) {
			uni.showToast({
				icon: 'error',
				title: '您还没有登录',
				duration: 2000,
				complete() {
					setTimeout(() => {
						uni.navigateBack()
					}, 2000)
				}

			})
		}
		getHistoryData()
	})

	
	const historyData = ref<IDrawHistoryItem[]>([])

	// 根据用户获取绘图历史数据
	const getHistoryData = async (pageNumber ?: number) => {
		const { items } = await request<IHistoryResponse>(`/draw/history/${pageNumber}`)
		historyData.value = items
		console.log('pageNumber', pageNumber)
		console.log('historyData', historyData.value)
	}
	// 删除历史记录
	const removeHistoryRecord = async (id : number) => {
		try {
			console.log('Attempting to remove history record with id:', id);
			const response = await request<IHistoryResponse>(`/draw/history/${id}`, {
				method: 'DELETE',
			});

			console.log('Response status:', response.status);
			// if (response.status === 1) {
			//   throw new Error(`Custom error! Status: ${response.status} - ${response.statusText}`);
			// }

			// if (!response.ok) {
			//   throw new Error(`HTTP error! Status: ${response.status}`);
			// }

			// 从本地数据中移除已删除的记录
			console.log('History record removed:', id);
			historyData.value = historyData.value.filter(item => item._id !== id);
			console.log('Updated historyData:', historyData.value);
			uni.showToast({
				title: '删除成功',
				icon: 'success',
				duration: 2000
			})
		} catch (err) {
			console.error('Failed to remove history record:', err);
			// 可以在这里显示错误信息给用户
		}
	}

	//将获取的数据转换为时间轴数据computed
	const timeLineDataComptRef = computed(() => {
		const tempTimeLineData : TimeLineData[] = []
		historyData.value.forEach(item => {
			//   从历史数据中去除日期并格式化为2023-07-22
			const date = formatDateTime(new Date(item.created_at as number), 'YYYY-MM-DD')
			// 获取日期对应的数据
			const data = tempTimeLineData.find(i => i.day === date)
			if (data) {
				data.data = [...data.data, item]
			} else {
				tempTimeLineData.push({
					day: date,
					icon: "creative",
					data: [item]
				})
			}
		})
		console.log('tempTimeLineData:', tempTimeLineData)
		return tempTimeLineData.sort((a, b) => {
			return new Date(b.day).getTime() - new Date(a.day).getTime()
		})
	})

	const PhotoAlbumImages = computed<string[]>(() => {
		let _imageList = [] as string[]
		historyData.value.forEach(item => {
			if (item.output) {
				_imageList = [..._imageList, ...item.output]
			}
		})
		return _imageList
	})

	const testData = ["https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/6787db82dd3d12610cbb21bd/ComfyUI_0001.png"]

	const currentTabIndex = ref(0)
	const tabs = ref(['时间轴模式', '相册模式'])
	const option = {
		path: 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/empty.json'
	}
	function QieHuan(e) {
		console.log('-----------------------------------', e)
		currentTabIndex.value = e.index

	}
	const show = ref(false);
	const picArry = ref()
	const GalleryPic = ref()
	
	function showGallery(data) {
		show.value = true;
		GalleryPic.value = data;
		console.log(GalleryPic.value)
	}


	function hideGallery() {
		show.value = false;

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
	function handleClick(StringTxt) {
		uni.setClipboardData({
			data: StringTxt, // 需要设置到剪切板的内容
			showToast: true, // 是否显示提示，默认为true
			success: function () {
				console.log('复制成功');
			},
			fail: function (err) {
				console.error('复制失败', err);
			}
		});

	}
	// 定义 dowonVideo 函数，并指定 url 参数的类型为 string
	async function dowonVideo(url : string) {
		// 替换为你的视频地址
		const videoUrl = url;

		try {
			// 下载视频到临时路径，使用 await 等待 Promise 解析
			const downloadResult = await uni.downloadFile({
				url: videoUrl,
			});

			// 检查下载是否成功
			if (downloadResult.statusCode === 200) {
				const { tempFilePath } = downloadResult;

				// 保存到相册
				await uni.saveVideoToPhotosAlbum({
					filePath: tempFilePath,
				});

				uni.showToast({
					title: '下载成功',
					icon: 'success',
				});
			} else {
				console.error('下载失败，状态码:', downloadResult.statusCode);
				uni.showToast({
					title: '下载失败',
					icon: 'none',
				});
			}
		} catch (error) {
			console.error('下载失败:', error);
			uni.showToast({
				title: '下载失败',
				icon: 'none',
			});
		}
	}
</script>

<template>
	<fui-background-image src="@/src/static/Home2 (1).jpgHome2(1).jpg">
	</fui-background-image>
	<fui-sticky>
		<fui-tabs style="margin-top: 15%; background-color: transparent;" :tabs="tabs" @change="QieHuan"></fui-tabs>
	</fui-sticky>
	<view style="margin-bottom: 15%; margin-left: 5%; margin-top: 10%; ">
		<fui-section title="历史生图记录" margin-top="25" style="margin-bottom: 55%; " descrSize='32' descrColor='#000000'
			descr="时间轴模式下长按图片可以将图片保存或分享给朋友">
			<template v-slot:right>
				<image class="fui-vip__icon" src="/static/images/index/light/icon_member_3x.png"></image>
			</template>
		</fui-section>

	</view>
	<view v-if="currentTabIndex == 0">
		<fui-gallery :urls="GalleryPic" :show="show" @hide="hideGallery"></fui-gallery>
		<fui-timeaxis :padding="['32rpx','16rpx']">
			<fui-timeaxis-node v-for="(item,index ) in historyData" :key="index">

				<view class="fui-node__box" style="background: #FF2B2B;" v-if="item.status == 2">
					<fui-icon name="clear-fill" :size="28" color="#fff"></fui-icon>
				</view>
				<view class="fui-node__box" style="background: #09BE4F;" v-if="item.status == 1">
					<fui-icon name="face" :size="28" color="#fff"></fui-icon>
				</view>
				<view class="fui-node__box" style="background: transparent" v-if="item.status == 0">
					<fui-load-ani type="3"></fui-load-ani>
				</view>
				<template v-slot:right>
					<!-- 判断是否为图片 -->
					<view class="fui-custom__wrap" v-if="linkType(item.output[0]) == 0">
						<fui-section title="提示词" :descr="item.params?.positive" descrSize='32'
							descrColor='#000000'></fui-section>
						<view class="section__ctn" style="margin-top: 6%;" >
							<view v-for="(pic,picIndex) in item.output">
								<image @click="showGallery(historyData[index].output)"
									style="width: 300px;  background-color:transparent;" mode="widthFix" :src="pic"
									:show-menu-by-longpress='true'>
								</image>
							</view>
						</view>

						<fui-icon
							style="margin-top:-11%; background-color:rgba(255, 255, 255, 0.5);; border-radius: 100px;  position: absolute ; margin-left: 480rpx;"
							color="#ff0000" name="delete" @click="removeHistoryRecord(item._id)"></fui-icon>
						

					</view>
					<!-- 如果是视频的话 -->
					<view class="fui-custom__wrap" v-else-if="linkType(item.output[0]) == 1">
						<fui-section title="提示词" :descr="item.params?.positive"></fui-section>
						<view style="margin-top: 6%;">
							<video style="width: 100%; height: 390px; background-color:transparent;" id="myVideo"
								:src="item.output[0]" controls></video>
						</view>
						<view>
							<fui-icon
								style="margin-top:-95%; background-color:rgba(255, 255, 255, 0.5);; border-radius: 100px;  position: absolute ; margin-left: 600rpx;"
								color="#ff0000" name="delete" @click="removeHistoryRecord(item._id)"></fui-icon>
							<fui-icon
								style="margin-top:-85%; background-color:rgba(255, 255, 255, 0.5);; border-radius: 100px;  position: absolute ; margin-left: 600rpx;"
								color="#e0e0e0" name="pulldown" @click="dowonVideo(item.output[0])"></fui-icon>

						</view>

					</view>
					<!-- 如果都不是的话 -->
					<view class="fui-custom__wrap" v-else>
						<scroll-view scroll-y="true" class="scroll-Y">

							<fui-section title="提示词" descrSize='32' descrColor='#000000'
								:descr="item.params?.positive"></fui-section>

							<!-- <fui-lottie :options="option" action="play"></fui-lottie> -->
							<view class="fui-item__box">

								<image mode="widthFix"
									:src="item.params?.image_path_mask  || item.params?.image_path_origin || testData "
									class="fui-logo" :show-menu-by-longpress='true'></image>

							</view>
							<fui-icon
								style="margin-top:-12%; background-color:rgba(255, 255, 255, 0.5);; border-radius: 100px;  position: absolute ; margin-left: 280rpx;"
								color="#ff0000" name="delete" @click="removeHistoryRecord(item.id)"></fui-icon>
							<view style="margin-top: -5%;">
								<fui-collapse-item background="transparent ">

									<template v-slot:content>
										<!-- <fui-copy-text  text="长按复制文本" :value="item.output[0]"></fui-copy-text> -->
										<view style='margin-left: 5%; margin-top: 5%;'
											@click="handleClick(item.output[0])">复制</view>
										<view class="fui-descr">{{item.output[0]}}</view>
									</template>
								</fui-collapse-item>
							</view>
							<!-- <image @click="showGallery"
							style="width: 300px; height: 390px; background-color:transparent;" :mode="scaleToFill"
							:src="item.params?.image_path_mask" :show-menu-by-longpress='true'></image> -->

							<!-- 	<fui-parse-group class="custom-view" :thBgcolor="false">
							<fui-parse :nodes="StringCont" language="html"></fui-parse>
						</fui-parse-group> -->
						</scroll-view>
					</view>
				</template>
			</fui-timeaxis-node>
		</fui-timeaxis>
	</view>
	<view v-if="currentTabIndex == 1" class="tn-p">
		<!-- 瀑布流模式 -->
		<view class="content">
			<view class="photo-album">
				<fui-waterfall>
					<fui-waterfall-item v-for="(item,index) in historyData" :key="index">

						<view v-if="linkType(item.output[0]) == 0">
							<view>
								<image style="width: 200px;  background-color:transparent;" mode="widthFix"
									:src="item.output[0]" :show-menu-by-longpress='true'></image>

							</view>
						</view>
						<!-- 如果是视频的话 -->
						<view v-else-if="linkType(item.output[0]) == 1">
							<view>
								<video style="width: 100%; height: 400rpx;" id="myVideo" :src="item.output[0]"
									controls></video>
							</view>
						</view>
						<!-- 如果都不是的话 -->
						<view v-else>

							<view class="fui-item__box">
								<image
									:src="item.params?.image_path_mask  || item.params?.image_path_origin || testData "
									class="fui-logo"></image>

							</view>
							<!-- <fui-collapse-item background="transparent ">
							<view class="fui-item__box">
								<image :src="item.params?.image_path_mask || testData " class="fui-logo"></image>
							
							</view>
								<template v-slot:content>
									
									<view style='margin-left: 5%; margin-top: 5%;'
										@click="handleClick(item.output[0])">复制</view>
									<view class="fui-descr">{{item.output[0]}}</view>
								</template>
							</fui-collapse-item> -->
							<!-- <fui-card width='300' height='300' :src="item.params?.image_path_mask || testData"  >
								<scroll-view scroll-y="true" class="scroll-Y">
								<view class="fui-card__content">{{item.output[0]}}</view>
								</scroll-view>
							</fui-card> -->
							<!-- <image style=" width: 360rpx; height: 400rpx;background-color:transparent;"
								:mode="scaleToFill" src="/static/images/component/empty/img_data_3x.png"
								:show-menu-by-longpress='true'></image> -->

						</view>
					</fui-waterfall-item>
				</fui-waterfall>

			</view>
		</view>
	</view>

</template>


<style lang="scss" scoped>
	.fui-item__box {
		margin-top: 5%;
		width: 100%;
		padding: 26rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.fui-logo {
		width: 300rpx;
		// height: 400rpx;
		margin-right: 24rpx;
		display: flex;
		text-align: center;

	}

	.fui-descr {
		width: 100%;
		padding: 32rpx;
		font-size: 28rpx;
		line-height: 52rpx;
		color: #7F7F7F;
		word-break: break-all;
		box-sizing: border-box;
	}

	.fui-vip__icon {
		width: 48rpx;
		height: 48rpx;
		margin-left: 16rpx;

	}

	.fui-header {
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		background: #F8F8F8;
		color: #465CFF;
		font-weight: bold;
	}

	.fui-animation {
		width: 600rpx;
		height: 400rpx;
	}

	.main-container {
		padding: 0 10rpx;
	}

	.content {
		position: relative;
		width: 100%;

		.time-line {
			&__title {
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}
		}
	}

	.photo-album {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
		grid-gap: 15rpx;
	}







	.fui-custom__wrap {
		margin-bottom: 5%;
		padding: 0rpx;
		box-sizing: border-box;
	}

	.child {
		width: 300rpx;
		display: inline-block;
		margin: 0 10px;
		/* 添加间距 */
	}

	.fui-custom__innder {
		height: 100%;
		border-radius: 0 16rpx 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: #FFB703;
	}

	.fui-node__box {
		width: 36rpx;
		height: 36rpx;
		background: #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
</style>