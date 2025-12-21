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

import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
import TnTag from '@tuniao/tnui-vue3-uniapp/components/tag/src/tag.vue'
import { isLogin } from "@/composables/useCommon.ts";




interface TimeLineData {
	day: string
	icon?: string
	data: IDrawHistoryItem[]
}

interface IHistoryResponse {
	total: number,
	items: IDrawHistoryItem[]
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


// 完整数据与分页显示数据
const fullHistory = ref<IDrawHistoryItem[]>([])
const historyData = ref<IDrawHistoryItem[]>([])

// 分页控制（本地分页：每页 10 条）
const pageSize = 10
const currentPage = ref(1)
const total = ref(0)
const isLoading = ref(false)

// 折叠/展开提示词控制（按记录 _id）
const expandedIds = ref<Record<string, boolean>>({})
const isExpanded = (id?: string) => {
	if (!id) return false
	return !!expandedIds.value[id]
}
const toggleExpand = (id?: string) => {
	if (!id) return
	expandedIds.value[id] = !expandedIds.value[id]
}

// 获取全部历史记录（后端当 path 为 undefined 时返回全部）
const getHistoryData = async () => {
	try {
		isLoading.value = true
		// 当 pageNumber 未定义时，后端会返回全部数据（/draw/history/undefined）
		const res = await request<IHistoryResponse>(`/draw/history/undefined`)
		fullHistory.value = res.items || []
		total.value = (typeof res.total === 'number' && res.total > 0) ? res.total : fullHistory.value.length

		// 初始化只渲染第一页的数据
		currentPage.value = 1
		historyData.value = fullHistory.value.slice(0, pageSize)
		console.log('loaded full history count', fullHistory.value.length)
	} catch (err) {
		console.error('getHistoryData error', err)
	} finally {
		isLoading.value = false
	}
}

// 是否还有更多可加载项
const hasMore = computed(() => historyData.value.length < total.value)

// 手动或触底加载更多（每次追加 pageSize 条）
const loadMore = () => {
	if (isLoading.value) return
	if (!hasMore.value) {
		uni.showToast({ title: '没有更多了', icon: 'none' })
		return
	}
	isLoading.value = true
	// 计算下一页范围并追加
	currentPage.value += 1
	const start = (currentPage.value - 1) * pageSize
	const end = start + pageSize
	const nextItems = fullHistory.value.slice(start, end)
	historyData.value = [...historyData.value, ...nextItems]
	isLoading.value = false
}

// 触底自动加载
onReachBottom(() => {
	if (hasMore.value) {
		loadMore()
	}
})
// 删除历史记录（兼容 string | number | undefined 参数）
const removeHistoryRecord = async (id: string | number | undefined) => {
	if (!id) {
		console.warn('removeHistoryRecord called with empty id:', id);
		return;
	}
	const idStr = String(id);
	try {
		console.log('Attempting to remove history record with id:', idStr);
		await request(`/draw/history/${idStr}`, {
			method: 'DELETE',
		});

		// 从完整数据中移除
		fullHistory.value = fullHistory.value.filter(item => item._id !== idStr)
		total.value = fullHistory.value.length

		// 从当前显示列表中移除并补充下一条以保证当前页数量一致（如果有）
		historyData.value = historyData.value.filter(item => item._id !== idStr)
		const needCount = currentPage.value * pageSize - historyData.value.length
		if (needCount > 0) {
			const start = historyData.value.length
			const next = fullHistory.value.slice(start, start + needCount)
			historyData.value = [...historyData.value, ...next]
		}

		console.log('Updated historyData length:', historyData.value.length);
		uni.showToast({
			title: '删除成功',
			icon: 'success',
			duration: 2000
		})
	} catch (err) {
		console.error('Failed to remove history record:', err);
		uni.showToast({ title: '删除失败', icon: 'none' });
	}
}

//将获取的数据转换为时间轴数据computed
const timeLineDataComptRef = computed(() => {
	const tempTimeLineData: TimeLineData[] = []
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
function QieHuan(e: any) {
	console.log('-----------------------------------', e)
	currentTabIndex.value = e.index

}
const show = ref(false);
const picArry = ref()
const GalleryPic = ref()

function showGallery(data: any) {
	show.value = true;
	GalleryPic.value = data;
	console.log(GalleryPic.value)
}


function hideGallery() {
	show.value = false;

}




function linkType(url: any): number {
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
function handleClick(StringTxt: string) {
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
async function downloadVideo(url: string) {
  if (!url || !url.startsWith('https://')) {
    uni.showToast({ title: '视频地址无效', icon: 'none' });
    return;
  }

		try {
			const downloadResult = await uni.downloadFile({ url });

    if (downloadResult.statusCode !== 200) {
      console.error('下载失败，状态码:', downloadResult.statusCode);
      uni.showToast({ title: '下载失败', icon: 'none' });
      return;
    }

    // 尝试保存到相册
    try {
      await uni.saveVideoToPhotosAlbum({
        filePath: downloadResult.tempFilePath
      });
      uni.showToast({ title: '保存到相册成功', icon: 'success' });
		} catch (saveErr: any) {
      // 处理保存失败（可能是权限被拒）
      console.error('保存到相册失败:', saveErr);
      if (saveErr.errMsg.includes('auth deny')) {
        // 提示用户开启权限
        uni.showModal({
          title: '权限不足',
          content: '请允许保存视频到相册',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (settingRes) => {
                  console.log('相册权限设置:', settingRes.authSetting);
                }
              });
            }
          }
        });
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    }
  } catch (downloadErr) {
    console.error('下载过程出错:', downloadErr);
    uni.showToast({ title: '下载失败', icon: 'none' });
  }
}

const isDeleting = ref(false)
const handleDeleteTouchStart = () => {
	isDeleting.value = true
}
const handleDeleteTouchEnd = () => {
	setTimeout(() => {
		isDeleting.value = false
	}, 500)
}

const toHome = () => {
  // uni.redirectTo({ url: `/pages/index/index?pageindex=2` });
  uni.navigateBack({
	  delta: 1,
  })
};
</script>

<template>
	<fui-nav-bar
	  title=" " 
	  @leftClick="toHome" 
	  background="transparent"
	  
	>
	  <fui-icon name="arrowleft" size="80" color="#333"></fui-icon>
	</fui-nav-bar>
	

	<fui-sticky>
		<fui-tabs style="margin-top: 0%; background-color: transparent;" :tabs="tabs" @change="QieHuan"></fui-tabs>
	</fui-sticky>
	<!-- <view style="margin-bottom: -20%; margin-left: 5%; margin-top: 10%; ">
		<fui-section title="历史生图记录" margin-top="25" style="margin-bottom: 55%; " descrSize='32' descrColor='#000000'
			descr="时间轴模式下长按图片可以将图片保存或分享给朋友">
			<template v-slot:right>
				<image class="fui-vip__icon" src="/static/images/index/light/icon_member_3x.png"></image>
			</template>
		</fui-section>

	</view> -->
	<view v-if="currentTabIndex == 0">
		<fui-gallery :urls="GalleryPic" :show="show" @hide="hideGallery"></fui-gallery>
		<fui-timeaxis :padding="['32rpx', '16rpx']">
			<fui-timeaxis-node v-for="(item, index) in historyData" :key="index">

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
					<view class="fui-custom__wrap" v-if="item.output && item.output.length > 0 && linkType(item.output[0]) == 0">
						<!-- 可折叠的提示词显示 -->
						<view class="prompt-section">
							<view class="prompt-header">
								<view class="prompt-title">提示词</view>
								<view v-if="item.params?.positive && item.params?.positive.length > 120" class="prompt-toggle" @click.stop="toggleExpand(item._id)">
									<tn-icon :name="isExpanded(item._id) ? 'chevron-up' : 'chevron-down'" size="28" color="#465CFF"></tn-icon>
									<text class="prompt-toggle-text">{{ isExpanded(item._id) ? '收起' : '展开' }}</text>
								</view>
							</view>
							<view class="prompt-content">
								<text :class="['prompt-text', isExpanded(item._id) ? 'expanded' : 'collapsed']">{{ item.params?.positive || '无提示词' }}</text>
							</view>
							<view v-if="item.params?.negative" class="prompt-negative">
								<view class="prompt-negative-title">负面提示词</view>
								<text class="prompt-negative-text">{{ item.params.negative }}</text>
							</view>
						</view>
						<view class="image-carousel-container" style="margin-top: 6%;">
							<swiper 
								v-if="item.output && item.output.length > 1"
								class="image-swiper" 
								:circular="true" 
								:indicator-dots="true" 
								:autoplay="false" 
								:interval="3000"
								:duration="300"
								indicator-color="rgba(255, 255, 255, 0.5)"
								indicator-active-color="#465CFF"
							>
								<swiper-item v-for="(pic, picIndex) in item.output" :key="picIndex">
									<view class="swiper-image-wrapper">
										<image 
											@click="showGallery(item.output)"
											class="carousel-image" 
											mode="aspectFit" 
											:src="pic"
											:show-menu-by-longpress='true'
											:lazy-load="true"
											:webp="true"
											:fade-show="true"
										/>
										<view class="image-index">{{ picIndex + 1 }}/{{ item.output.length }}</view>
									</view>
								</swiper-item>
							</swiper>
							<view v-else class="single-image-wrapper">
								<image 
									@click="showGallery(item.output)"
									class="single-image" 
									mode="widthFix" 
									:src="item.output[0]"
									:show-menu-by-longpress='true'
									:lazy-load="true"
									:webp="true"
									:fade-show="true"
								/>
							</view>
						</view>

						<!-- 现代化操作栏 -->
						<view class="action-bar">
							<view class="action-left">
								<view class="timestamp">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
							</view>
							<view class="action-right">
								<view class="action-button" @click="item.output && item.output.length > 0 && handleClick(item.output[0])">
									<tn-icon name="copy-fill" size="32" color="#666"></tn-icon>
								</view>
								<view class="action-button action-delete" @click="removeHistoryRecord(item._id)">
									<tn-icon name="delete" size="32" color="#ff4949"></tn-icon>
								</view>
							</view>
						</view>

					</view>
					<!-- 如果是视频的话 -->
					<view class="fui-custom__wrap" v-else-if="item.output && item.output.length > 0 && linkType(item.output[0]) == 1">
						<!-- 可折叠的提示词显示（视频分支） -->
						<view class="prompt-section">
							<view class="prompt-header">
								<view class="prompt-title">提示词</view>
								<view v-if="item.params?.positive && item.params?.positive.length > 120" class="prompt-toggle" @click.stop="toggleExpand(item._id)">
									<tn-icon :name="isExpanded(item._id) ? 'chevron-up' : 'chevron-down'" size="28" color="#465CFF"></tn-icon>
									<text class="prompt-toggle-text">{{ isExpanded(item._id) ? '收起' : '展开' }}</text>
								</view>
							</view>
							<view class="prompt-content">
								<text :class="['prompt-text', isExpanded(item._id) ? 'expanded' : 'collapsed']">{{ item.params?.positive || '无提示词' }}</text>
							</view>
							<view v-if="item.params?.negative" class="prompt-negative">
								<view class="prompt-negative-title">负面提示词</view>
								<text class="prompt-negative-text">{{ item.params.negative }}</text>
							</view>
						</view>
						<view style="margin-top: 6%;">
							<video style="width: 100%; height: 390px; background-color:transparent; z-index: 5;" id="myVideo"
								:src="(item.output && item.output.length>0) ? item.output[0] : ''" controls></video>
						</view>

						<!-- 现代化操作栏 -->
						<view class="action-bar">
							<view class="action-left">
								<view class="timestamp">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
							</view>
							<view class="action-right">
								<view class="action-button" @click="item.output && item.output.length > 0 && handleClick(item.output[0])">
									<tn-icon name="copy-fill" size="32" color="#666"></tn-icon>
								</view>
								<view class="action-button" @click="item.output && item.output.length > 0 && downloadVideo(item.output[0])">
									<tn-icon name="download-simple" size="32" color="#666"></tn-icon>
								</view>
								<view class="action-button action-delete" @click="removeHistoryRecord(item._id)">
									<tn-icon name="delete" size="32" color="#ff4949"></tn-icon>
								</view>
							</view>
						</view>

					</view>
					<!-- 如果都不是的话 -->
					<view class="fui-custom__wrap" v-else>
						<scroll-view scroll-y="true" class="scroll-Y">

						<!-- 可折叠的提示词显示（其他分支） -->
						<view class="prompt-section">
							<view class="prompt-header">
								<view class="prompt-title">提示词</view>
								<view v-if="item.params?.positive && item.params?.positive.length > 120" class="prompt-toggle" @click.stop="toggleExpand(item._id)">
									<tn-icon :name="isExpanded(item._id) ? 'chevron-up' : 'chevron-down'" size="28" color="#465CFF"></tn-icon>
									<text class="prompt-toggle-text">{{ isExpanded(item._id) ? '收起' : '展开' }}</text>
								</view>
							</view>
							<view class="prompt-content">
								<text :class="['prompt-text', isExpanded(item._id) ? 'expanded' : 'collapsed']">{{ item.params?.positive || '无提示词' }}</text>
							</view>
							<view v-if="item.params?.negative" class="prompt-negative">
								<view class="prompt-negative-title">负面提示词</view>
								<text class="prompt-negative-text">{{ item.params.negative }}</text>
							</view>
						</view>

						<!-- 内容区域 -->
						<view class="content-area">
							<!-- 仅在有输入图片时显示 - 兼容多种路径格式 -->
							<view v-if="item.params?.image_path_mask || item.params?.image_path_origin || (item.params as any)?.image_path" class="input-image-wrapper">
								<image 
									class="input-image"
									mode="widthFix"
									:src="item.params?.image_path_mask || item.params?.image_path_origin || (item.params as any)?.image_path"
									:show-menu-by-longpress="true"
								/>
							</view>

							<!-- 文本输出内容 -->
							<view v-if="item.output && item.output.length > 0" class="text-output">
								<view class="text-content">
									<text class="output-text">{{ item.output[0] }}</text>
								</view>
							</view>
						</view>

						<!-- 现代化操作栏 -->
						<view class="action-bar">
							<view class="action-left">
								<view class="timestamp">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
							</view>
							<view class="action-right">
								<view v-if="item.output && item.output.length > 0" class="action-button" @click="handleClick(item.output[0])">
									<tn-icon name="copy-fill" size="32" color="#666"></tn-icon>
								</view>
								<view class="action-button action-delete" @click="removeHistoryRecord(item._id)">
									<tn-icon name="delete" size="32" color="#ff4949"></tn-icon>
								</view>
							</view>
						</view>
						</scroll-view>
					</view>
				</template>
			</fui-timeaxis-node>
		</fui-timeaxis>

		<!-- 加载更多按钮（时间轴模式） -->
		<view class="load-more-wrap" v-show="hasMore">
			<button class="load-more-btn" :disabled="isLoading" @click="loadMore">{{ isLoading ? '加载中...' : '加载更多' }}</button>
		</view>

	</view>
	<view v-if="currentTabIndex == 1" class="album-mode">
		<!-- 相册模式 -->
		<view class="album-content">
			<view class="album-grid">
				<view v-for="(item, index) in historyData" :key="index" class="album-item">
					
					<!-- 图片类型的记录 -->
					<view v-if="item.output && item.output.length > 0 && linkType(item.output[0]) == 0" class="album-card">
						<view class="album-card-header">
							<view class="album-card-date">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
							<view class="album-card-count" v-if="item.output.length > 1">{{ item.output.length }}张</view>
						</view>
						
						<!-- 轮播图显示多张图片 -->
						<swiper 
							v-if="item.output.length > 1"
							class="album-swiper"
							:circular="false"
							:indicator-dots="true"
							:autoplay="false"
							indicator-color="rgba(255, 255, 255, 0.5)"
							indicator-active-color="#465CFF"
						>
							<swiper-item v-for="(pic, picIndex) in item.output" :key="picIndex">
								<image 
									class="album-image" 
									mode="aspectFill"
									:src="pic"
									:show-menu-by-longpress="true"
									@click="showGallery(item.output)"
								/>
							</swiper-item>
						</swiper>
						
						<!-- 单张图片 -->
						<image 
							v-else
							class="album-single-image" 
							mode="aspectFill"
							:src="item.output[0]"
							:show-menu-by-longpress="true"
							@click="showGallery(item.output)"
						/>
						
						<!-- 提示词预览 -->
						<view class="album-prompt-preview" v-if="item.params?.positive">
							<text class="album-prompt-text">{{ item.params.positive.length > 50 ? item.params.positive.substring(0, 50) + '...' : item.params.positive }}</text>
						</view>
					</view>
					
					<!-- 视频类型的记录 -->
					<view v-else-if="item.output && item.output.length > 0 && linkType(item.output[0]) == 1" class="album-card">
					<view class="album-card-header">
						<view class="album-card-date">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
						<view class="album-card-badge video-badge">视频</view>
					</view>						<video 
							class="album-video" 
							:src="item.output[0]"
							controls
							poster=""
						></video>
						
						<view class="album-prompt-preview" v-if="item.params?.positive">
							<text class="album-prompt-text">{{ item.params.positive.length > 50 ? item.params.positive.substring(0, 50) + '...' : item.params.positive }}</text>
						</view>
					</view>
					
					<!-- 其他类型的记录 -->
					<view v-else class="album-card">
					<view class="album-card-header">
						<view class="album-card-date">{{ item.created_at ? formatDateTime(new Date(item.created_at), 'MM-DD HH:mm') : '--' }}</view>
						<view class="album-card-badge other-badge">其他</view>
					</view>
						
						<!-- 仅在有输入图片时显示占位图 -->
						<image 
							v-if="item.params?.image_path_mask || item.params?.image_path_origin || (item.params as any)?.image_path"
							class="album-placeholder-image"
							mode="aspectFill"
							:src="item.params?.image_path_mask || item.params?.image_path_origin || (item.params as any)?.image_path"
						/>
						
						<!-- <view class="album-other-content" v-if="item.output && item.output.length > 0">
							<text class="album-other-text">{{ item.output[0].length > 60 ? item.output[0].substring(0, 60) + '...' : item.output[0] }}</text>
						</view> -->
					</view>
					
				</view>
			</view>
			
			<!-- 加载更多按钮（相册模式） -->
			<view class="album-load-more" v-show="hasMore">
				<button class="album-load-btn" :disabled="isLoading" @click="loadMore">
					{{ isLoading ? '加载中...' : '加载更多' }}
				</button>
			</view>
		</view>
	</view>

</template>


<style lang="scss" scoped>
.video-container {
	position: relative;
	width: 100%;
}

.video-controls {
	position: absolute;
	right: 20rpx;
	bottom:14rpx;
	display: flex;
	gap: 20rpx;
	z-index: 99;
}

.control-button {
	
	width: 60rpx;
	height: 60rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
	transition: all 0.3s ease;

	&:active {
		transform: scale(0.9);
		background: rgba(255, 255, 255, 0.8);
	}
}

.delete-btn {
	background: rgba(255, 255, 255, 0.95);
	color: #ff4949;
}

.download-btn {
	background: rgba(255, 255, 255, 0.95);
	color: #000000;
}

// ============================================
.delete-button2 {
	position: absolute;
	right: 100rpx;
	bottom: -10rpx;
	width: 60rpx;
	height: 60rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
	transition: all 0.3s ease;
	z-index: 999;

	&:active {
		transform: scale(0.9);
		background: rgba(255, 255, 255, 0.8);
	}
}

.delete-button {
	position: absolute;
	right: 80rpx;
	bottom: 60rpx;
	width: 60rpx;
	height: 60rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
	transition: all 0.3s ease;
	z-index: 999;

	&:active {
		transform: scale(0.9);
		background: rgba(255, 255, 255, 0.8);
	}
}

.delete-icon {
	color: #ff4949;
	transition: all 0.3s ease;
}

.icon-shake {
	animation: shake 0.5s;
}

@keyframes shake {
	0% {
		transform: rotate(0deg);
	}

	25% {
		transform: rotate(-15deg);
	}

	50% {
		transform: rotate(15deg);
	}

	75% {
		transform: rotate(-15deg);
	}

	100% {
		transform: rotate(0deg);
	}
}

// =======================================
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
	margin-bottom: 10%;
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

.load-more-wrap {
	display: flex;
	justify-content: center;
	padding: 20rpx 0;
}

.load-more-btn {
	background: #465CFF;
	color: #fff;
	border: none;
	padding: 12rpx 28rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.load-more-btn:disabled {
	opacity: 0.6;
}

/* 提示词折叠样式 */
.prompt-section {
	padding: 24rpx;
	margin: 16rpx 0;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
	box-sizing: border-box;
}

.prompt-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.prompt-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.prompt-toggle {
	display: flex;
	align-items: center;
	padding: 8rpx 16rpx;
	background: rgba(70, 92, 255, 0.1);
	border-radius: 20rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.prompt-toggle:active {
	background: rgba(70, 92, 255, 0.2);
	transform: scale(0.95);
}

.prompt-toggle-text {
	margin-left: 8rpx;
	font-size: 24rpx;
	color: #465CFF;
	font-weight: 500;
}

.prompt-content {
	position: relative;
}

.prompt-text {
	font-size: 28rpx;
	color: #666;
	line-height: 40rpx;
	word-break: break-all;
	display: block;
	transition: all 0.3s ease;
}

.prompt-text.collapsed {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	position: relative;
}

.prompt-text.collapsed::after {
	content: '';
	position: absolute;
	bottom: 0;
	right: 0;
	width: 60rpx;
	height: 40rpx;
	background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9));
}

.prompt-text.expanded {
	display: block;
}

.prompt-negative {
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.prompt-negative-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #ff6b6b;
	margin-bottom: 8rpx;
}

.prompt-negative-text {
	font-size: 26rpx;
	color: #999;
	line-height: 36rpx;
	word-break: break-all;
}

/* 底部加载指示 */
.bottom-loader {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx 0;
	color: #888;
}
.spinner {
	width: 28rpx;
	height: 28rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(0,0,0,0.1);
	border-top-color: #465CFF;
	animation: spin 1s linear infinite;
	margin-right: 12rpx;
}
@keyframes spin {
	to { transform: rotate(360deg); }
}

/* 时间轴模式轮播图样式 */
.image-carousel-container {
	width: 100%;
	margin-top: 16rpx;
}

.image-swiper {
	width: 100%;
	height: 400rpx;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.swiper-image-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.carousel-image {
	width: 100%;
	height: 100%;
	border-radius: 12rpx;
	background: #f8f8f8;
}

.image-index {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	background: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	backdrop-filter: blur(4rpx);
}

.single-image-wrapper {
	width: 100%;
	display: flex;
	justify-content: center;
}

.single-image {
	width: 100%;
	max-width: 600rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 相册模式样式 */
.album-mode {
	padding: 20rpx;
}

.album-content {
	width: 100%;
}

.album-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.album-item {
	width: 100%;
}

.album-card {
	background: white;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.album-card:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.album-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 16rpx;
	background: rgba(0, 0, 0, 0.02);
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.album-card-date {
	font-size: 22rpx;
	color: #999;
	font-weight: 500;
}

.album-card-count {
	font-size: 20rpx;
	color: #465CFF;
	background: rgba(70, 92, 255, 0.1);
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	font-weight: 600;
}

.album-card-badge {
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	font-weight: 600;
}

.video-badge {
	color: #ff6b6b;
	background: rgba(255, 107, 107, 0.1);
}

.other-badge {
	color: #ffa726;
	background: rgba(255, 167, 38, 0.1);
}

.album-swiper {
	width: 100%;
	height: 300rpx;
}

.album-image {
	width: 100%;
	height: 100%;
}

.album-single-image {
	width: 100%;
	height: 300rpx;
}

.album-video {
	width: 100%;
	height: 300rpx;
	background: #000;
}

.album-placeholder-image {
	width: 100%;
	height: 300rpx;
	background: #f5f5f5;
}

.album-prompt-preview {
	padding: 12rpx 16rpx;
	background: rgba(0, 0, 0, 0.02);
}

.album-prompt-text {
	font-size: 22rpx;
	color: #666;
	line-height: 32rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.album-other-content {
	padding: 12rpx 16rpx;
	background: #f8f9fa;
}

.album-other-text {
	font-size: 24rpx;
	color: #666;
	line-height: 36rpx;
}

.album-load-more {
	display: flex;
	justify-content: center;
	margin-top: 40rpx;
	padding: 20rpx 0;
}

.album-load-btn {
	background: #465CFF;
	color: white;
	border: none;
}

/* 现代化操作栏样式 */
.action-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 20rpx;
	background: rgba(0, 0, 0, 0.02);
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
	margin-top: 16rpx;
}

.action-left {
	display: flex;
	align-items: center;
}

.timestamp {
	font-size: 22rpx;
	color: #999;
	font-weight: 500;
}

.action-right {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.action-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64rpx;
	height: 64rpx;
	border-radius: 32rpx;
	background: rgba(0, 0, 0, 0.04);
	transition: all 0.3s ease;
}

.action-button:active {
	transform: scale(0.95);
	background: rgba(0, 0, 0, 0.08);
}

.action-delete {
	background: rgba(255, 73, 73, 0.1);
}

.action-delete:active {
	background: rgba(255, 73, 73, 0.2);
}

/* 内容区域样式 */
.content-area {
	margin: 16rpx 0;
}

.input-image-wrapper {
	margin-bottom: 16rpx;
}

.input-image {
	width: 100%;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.text-output {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-top: 12rpx;
}

.text-content {
	width: 100%;
}

.output-text {
	font-size: 28rpx;
	line-height: 40rpx;
	color: #333;
	word-wrap: break-word;
	word-break: break-all;
}

.album-load-btn {
	padding: 16rpx 32rpx;
	border-radius: 24rpx;
	font-size: 28rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 12rpx rgba(70, 92, 255, 0.3);
	transition: all 0.3s ease;
}

.album-load-btn:disabled {
	opacity: 0.6;
	transform: none !important;
}

.album-load-btn:active {
	transform: scale(0.95);
	box-shadow: 0 2rpx 8rpx rgba(70, 92, 255, 0.4);
}

/* 响应式调整 */
@media (max-width: 750rpx) {
	.album-grid {
		grid-template-columns: 1fr;
		gap: 16rpx;
	}
	
	.album-swiper,
	.album-single-image,
	.album-video,
	.album-placeholder-image {
		height: 400rpx;
	}
}
</style>