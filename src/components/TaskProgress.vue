<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, getCurrentInstance, nextTick, inject } from 'vue';
import { onLoad, onReady, onHide } from "@dcloudio/uni-app";
import MyPopup from "@/components/common/MyPopup.vue";
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore.ts";
import { onShow } from "@dcloudio/uni-app";
import LoadingState from "@/components/common/LoadingState.vue";
import { request } from "@/utils/request.ts";
import type { SocketState } from '@/types'

// 当前选中的任务索引
const currentTaskIndex = ref(0)
// 当前选中任务内的输出索引（用于多图片/视频切换）
const currentOutputIndex = ref(0)

const loadingBackground = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/onloading_bg.jpg'
const appStore = useAppStore()
const { localTasks } = storeToRefs(appStore)
// socketState injected in App.vue via provide
const socketState = inject<SocketState>('socketState')
// safeLocalTasks 避免在 store ref 未初始化时直接访问 .value 导致错误
const safeLocalTasks = computed(() => {
	try {
		return (localTasks && localTasks.value) ? localTasks.value : []
	} catch (e) {
		return []
	}
})

// 社区图片（仅用于背景瀑布流）
const communityImages = ref<string[]>([]);
// 平台信息（用于兼容性处理）
let _platform = 'unknown'
try { _platform = (uni && typeof uni.getSystemInfoSync === 'function') ? (uni.getSystemInfoSync().platform || 'unknown') : 'unknown' } catch (e) { _platform = 'unknown' }

// 仅缓存背景：单一 key + 内存缓存，避免重复网络请求；不缓存任务/进度内容
const BG_CACHE_KEY = 'taskProgressBgCache';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 小时
const PREFETCH_COUNT = 6; // 预下载前 N 张以提升首次展示稳定性
const memoryBgCache = ref<{ images: string[]; localMap?: Record<string,string>; ts: number } | null>(null);
// 控制短时间内（如图片预览弹出/关闭）不要重复触发网络刷新
const REFRESH_COOLDOWN_MS = 30 * 1000; // 30 秒内跳过背景刷新
let lastBgFetchTs = 0;
// 任务列表刷新节流（避免短时间 preview 导致的重复刷新）
const TASK_REFRESH_COOLDOWN_MS = 3000; // 3 秒
let lastTasksRefreshTs = 0;

// load cache (may include localMap)
function loadBgCache(): { images: string[]; localMap?: Record<string,string>; ts: number } | null {
	// 优先内存
	try {
		if (memoryBgCache.value) {
			const age = Date.now() - memoryBgCache.value.ts;
			if (age < CACHE_TTL_MS) return memoryBgCache.value;
		}
	} catch (e) { /* ignore */ }
	// 其次尝试从持久存储读取，以便组件重建时能同步获取缓存
	try {
		if (uni && typeof uni.getStorageSync === 'function') {
			const raw = uni.getStorageSync && uni.getStorageSync(BG_CACHE_KEY)
			console.log('loadBgCache - raw storage value for', BG_CACHE_KEY, raw)
			if (raw) {
				let parsed: any = raw
				try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw } catch (e) { parsed = raw }
				if (parsed && Array.isArray(parsed.images)) {
					console.log('loadBgCache - parsed cache ts:', parsed.ts, 'images count:', parsed.images.length)
					const obj = { images: parsed.images, localMap: parsed.localMap || {}, ts: parsed.ts || Date.now() }
					memoryBgCache.value = obj
					if ((Date.now() - obj.ts) < CACHE_TTL_MS) return obj
				}
			}
		}
	} catch (e) { /* ignore */ }
	return null;
}

// 异步校验 localMap 中的 savedFilePath 是否仍然存在（某些运行时/平台上 savedFilePath 可能失效）
async function verifyLocalMap(localMap?: Record<string,string>) {
	if (!localMap || typeof uni === 'undefined') return;
	const keys = Object.keys(localMap || {});
	if (!keys.length) return;
	let changed = false;
	for (const k of keys) {
		const path = localMap[k];
		if (!path) { delete localMap[k]; changed = true; continue; }
		try {
			// 尝试使用 getSavedFileInfo（小程序）或 getFileInfo 回退
				const info = await new Promise((resolve) => {
					try {
						// 优先使用 wx.getFileSystemManager().getFileInfo（替代将废弃的 getSavedFileInfo）
						const wxAny = (globalThis as any).wx;
						if (typeof wxAny !== 'undefined' && wxAny.getFileSystemManager && typeof wxAny.getFileSystemManager().getFileInfo === 'function') {
							try {
								wxAny.getFileSystemManager().getFileInfo({ filePath: path, success: (res: any) => resolve(res), fail: () => resolve(null) })
							} catch (e) { resolve(null) }
						} else if ((uni as any).getFileInfo) {
							(uni as any).getFileInfo({ filePath: path, success: (res: any) => resolve(res), fail: () => resolve(null) })
						} else {
							resolve(null)
						}
					} catch (e) { resolve(null) }
				})
			if (!info) {
				console.log('verifyLocalMap - saved file missing, removing mapping for', k, path)
				delete localMap[k];
				changed = true;
			}
		} catch (e) {
			// ignore
		}
	}
	if (changed) {
		try { saveBgCache(memoryBgCache.value!.images || [], memoryBgCache.value!.localMap) } catch (e) { /* ignore */ }
	}
}

function saveBgCache(images: string[], localMap?: Record<string,string>) {
	// 同步保存到内存并持久化到 storage，保证组件重建时能同步读取
	try {
		const oldMap = (memoryBgCache.value && memoryBgCache.value.localMap) || {};
		const newMap = localMap || oldMap || {};
		memoryBgCache.value = { images, localMap: newMap, ts: Date.now() };
		// 限制本地映射大小，避免在移动设备上占用过多 storage
		try {
			const keys = Object.keys(memoryBgCache.value.localMap || {})
			if (keys.length > PREFETCH_COUNT * 2) {
				// 保留最新 PREFETCH_COUNT*2 项（简单策略），其余丢弃
				const keep = keys.slice(-PREFETCH_COUNT * 2)
				const newLocalMap: Record<string,string> = {}
				keep.forEach(k => { newLocalMap[k] = memoryBgCache.value!.localMap![k] })
				memoryBgCache.value.localMap = newLocalMap
			}
		} catch (e) { /* ignore */ }
		try {
			if (uni && typeof uni.setStorageSync === 'function') {
				try {
					uni.setStorageSync && uni.setStorageSync(BG_CACHE_KEY, JSON.stringify(memoryBgCache.value))
					console.log('saveBgCache - wrote BG_CACHE_KEY, images:', memoryBgCache.value.images.length)
				} catch (e) { console.warn('saveBgCache - setStorageSync failed', e) }
			}
		} catch (e) { /* ignore storage errors */ }
	} catch (e) { /* ignore */ }
}

// 预下载若干图片（不再持久化本地 tempFilePath 映射，简单即可）
// 预下载并持久化前 N 张（downloadFile -> saveFile），保存 url->savedFilePath 到 localMap
async function prefetchImages(urls: string[]) {
	if (typeof uni === 'undefined' || typeof (uni as any).downloadFile !== 'function') return;
	if (!memoryBgCache.value) memoryBgCache.value = { images: [], localMap: {}, ts: 0 };
	if (!memoryBgCache.value.localMap) memoryBgCache.value.localMap = {};
	for (const url of urls) {
		if (!url) continue;
		if (memoryBgCache.value.localMap && memoryBgCache.value.localMap[url]) continue;
		try {
			const res: any = await new Promise((resolve, reject) => {
				try {
					;(uni as any).downloadFile({
						url,
						success: resolve,
						fail: reject,
					})
				} catch (e) { reject(e) }
			})
			if (res && res.tempFilePath) {
				// 如果平台支持 saveFile，则将 tempFilePath 保存为 savedFilePath，持久化到本地
				try {
					if ((uni as any).saveFile) {
						const saveRes: any = await new Promise((resolve, reject) => {
							try {
								;(uni as any).saveFile({ tempFilePath: res.tempFilePath, success: resolve, fail: reject })
							} catch (e) { reject(e) }
						})
						if (saveRes && saveRes.savedFilePath) {
									memoryBgCache.value.localMap![url] = saveRes.savedFilePath
									console.log('prefetchImages - saved', url, '->', saveRes.savedFilePath)
						} else {
									memoryBgCache.value.localMap![url] = res.tempFilePath
									console.log('prefetchImages - tempFilePath fallback', url, '->', res.tempFilePath)
						}
					} else {
						// 平台不支持 saveFile，则使用 tempFilePath（会话内有效）
						memoryBgCache.value.localMap![url] = res.tempFilePath
					}
				} catch (e) {
					try { memoryBgCache.value.localMap![url] = res.tempFilePath } catch (e2) { /* ignore */ }
				}
				// 每次新保存后更新持久化缓存
				try { saveBgCache(memoryBgCache.value.images || [], memoryBgCache.value.localMap) } catch (e) { /* ignore */ }
			}
		} catch (e) {
			/* ignore download errors */
		}
	}
}

const fetchCommunityImages = async (force = false) => {
  try {
		const cached = loadBgCache();
		if (!force && cached && cached.images && cached.images.length) {
			// 使用已保存的 savedFilePath 优先展示；如果是本地 savedFilePath（localMap），不应被扩展名正则过滤（iOS savedFilePath 可能无扩展名）
			const mapped = (cached.images || []).map((u: string) => {
				if (cached.localMap && cached.localMap[u]) return { src: cached.localMap[u], isLocal: true }
				return { src: u, isLocal: false }
			}).filter((item: any) => item.isLocal || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.src)).map((item: any) => item.src)
			communityImages.value = mapped;
			console.log('fetchCommunityImages - used cached mapped communityImages count=', mapped.length, 'first=', mapped[0])
			// 若刚刚短时间内已做过刷新，则跳过后台刷新以避免预览/短暂 hide 导致重复网络请求
			if (!force && (Date.now() - lastBgFetchTs) < REFRESH_COOLDOWN_MS) {
				console.log('fetchCommunityImages - skip background refresh due to cooldown', Date.now() - lastBgFetchTs)
				return; // 使用缓存并跳过后台刷新
			}
			// 背景刷新并预取原始 url 列表，保存新文件到 localMap
			lastBgFetchTs = Date.now();
			prefetchImages((cached.images || []).slice(0, PREFETCH_COUNT));
			return; // 有效缓存直接返回（并在必要时后台刷新）
		}

    console.log('背景缓存失效或强制刷新，开始请求社区图片...');
    const response = await request<any>('draw/history/findMany', {
      method: 'POST',
      data: {
        history: { is_deleted: false, is_public: true },
        page: 1,
        limit: 20
      }
    });

    // Handle new API format: {total, items: [...]} or legacy array format
    let items: any[] = [];
    if (response) {
      if (Array.isArray(response)) {
        items = response;
      } else if (response.items && Array.isArray(response.items)) {
        items = response.items;
      } else if (response.data && Array.isArray(response.data.items)) {
        items = response.data.items;
      }
    }

    if (items.length > 0) {
      const images: string[] = [];
      items.forEach(item => {
        if (Array.isArray(item.output)) {
          images.push(...item.output.filter((u: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(u)));
        }
        if (item.output_content && Array.isArray(item.output_content)) {
          item.output_content.forEach((c: any) => {
            if (c && typeof c.url === 'string' && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(c.url)) {
              images.push(c.url);
            }
          });
        }
      });

	const uniqueImages = Array.from(new Set(images)).slice(0, 20);
	communityImages.value = uniqueImages.slice();
	// When saving cache, keep localMap if exists, otherwise create empty
	saveBgCache(uniqueImages, (memoryBgCache.value && memoryBgCache.value.localMap) || {});
	// persist and prefetch+save first N files
	prefetchImages(uniqueImages.slice(0, PREFETCH_COUNT));
    }
  } catch (err) {
    console.error('获取社区图片失败:', err);
  }
};

// 组件挂载：优先读取缓存再异步刷新（若缓存为空）
onMounted(() => {
	const cached = loadBgCache();
	if (cached && cached.images && cached.images.length) {
		// 若存在 localMap 则优先映射到已保存的本地路径；本地路径可能无扩展名（iOS），因此保留 localMap 项
		const mapped = (cached.images || []).map((u: string) => {
			if (cached.localMap && cached.localMap[u]) return { src: cached.localMap[u], isLocal: true }
			return { src: u, isLocal: false }
		}).filter((item: any) => item.isLocal || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.src)).map((item: any) => item.src)
		communityImages.value = mapped;
		console.log('onMounted - applied cached mapped communityImages count=', mapped.length, 'first=', mapped[0])
	}

	// 异步校验本地映射的文件有效性，若失效则修剪并持久化（不影响首屏展示）
	if (memoryBgCache.value && memoryBgCache.value.localMap) {
		verifyLocalMap(memoryBgCache.value.localMap).catch(() => {})
	}
	if (!communityImages.value.length) {
		fetchCommunityImages();
	} else {
		// 异步轻刷新（不闪烁）
		fetchCommunityImages(false);
	}

	// 仍保留事件监听：其他页面若广播最新社区图片则更新并写入缓存
	uni.$on && uni.$on('community-images', (imgs: string[]) => {
		if (Array.isArray(imgs) && imgs.length > 0) {
			const filtered = imgs.filter(u => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(u));
			if (filtered.length) {
				communityImages.value = filtered;
				saveBgCache(filtered, (memoryBgCache.value && memoryBgCache.value.localMap) || {});
			}
		}
	});
});

onUnmounted(() => {
	uni.$off && uni.$off('community-images');
});

// 优先用社区图片作为背景，否则用本地历史图片
const historyImages = computed(() => {
	// 如果有社区图片，优先使用社区图片
	if (communityImages.value.length > 0) {
		// console.log('使用社区图片作为背景:', communityImages.value);
		return communityImages.value;
	}

	// 否则使用本地历史任务的图片
	const tasks = safeLocalTasks.value || [];
	const imgs: string[] = [];
	for (const task of tasks) {
		if (Array.isArray(task.output)) {
			imgs.push(...task.output.filter((url: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url)));
		}
	}

	// 如果本地历史图片也为空，则使用默认加载背景
	if (imgs.length === 0) {
		console.log('使用默认加载背景图片');
		return [loadingBackground];
	}

	console.log('使用本地历史图片作为背景:', imgs);
	return imgs;
});

// 更大且比例自适应的纵向无缝滚动瀑布流
const waterfallColumns = computed(() => {
	const source = historyImages.value;
	if (!source || source.length === 0) {
		return [] as string[][];
	}
	const colCount = 2; // 列数减少，图片更大
	const cols: string[][] = Array.from({ length: colCount }, () => []);
	// 随机分配，允许不整齐
	source.forEach((img, idx) => {
		cols[Math.floor(Math.random() * colCount)].push(img);
	});
	// 每列至少6张，复制拼接
	for (let i = 0; i < colCount; i++) {
		if (cols[i].length > 0 && cols[i].length < 6) {
			const repeat = Math.ceil(6 / cols[i].length);
			cols[i] = Array(repeat).fill(cols[i]).flat();
		}
	}
	return cols;
});

// 粉紫渐变背景（当没有可用图片或仅占位图时）
const backgroundStyle = computed(() => {
  if (
    waterfallColumns.value.length === 0 ||
    waterfallColumns.value.flat().every(img => img === loadingBackground)
  ) {
    return { background: 'linear-gradient(135deg, #f7c1ff 0%, #c1d3ff 100%)' };
  }
  return {};
});

/* ================= 懒加载 (D) =================
 * 思路：渲染所有卡片容器，但图片初始使用 base64 占位；
 * 利用 createIntersectionObserver 监听卡片进入视口后，将真实 url 标记为可见，触发替换。
 * 对于动画（translateY）中的元素，IntersectionObserver 仍会触发，因为变换发生在父层。
 */
// 在某些运行时（如小程序/开发者工具）中全局 btoa 可能不存在，提供兼容实现
function toBase64(str: string): string {
	try {
		if (typeof btoa !== 'undefined') return btoa(str);
	} catch (e) { /* ignore */ }
	try {
		// Node-like env
		// @ts-ignore
		if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64');
	} catch (e) { /* ignore */ }
	// Fallback: utf8 -> binary -> base64
	const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_: string, p: string) {
		return String.fromCharCode(parseInt(p, 16));
	});
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let output = '';
	for (let i = 0; i < utf8.length; i += 3) {
		const a = utf8.charCodeAt(i);
		const b = utf8.charCodeAt(i + 1);
		const c = utf8.charCodeAt(i + 2);
		const triple = (a << 16) | ((b || 0) << 8) | (c || 0);
		output += chars.charAt((triple >> 18) & 0x3f) + chars.charAt((triple >> 12) & 0x3f) + (typeof b !== 'undefined' ? chars.charAt((triple >> 6) & 0x3f) : '=') + (typeof c !== 'undefined' ? chars.charAt(triple & 0x3f) : '=');
	}
	return output;
}

const placeholderBase64 = 'data:image/svg+xml;base64,' + toBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#eee"/><stop offset="1" stop-color="#ddd"/></linearGradient></defs><rect width="40" height="60" fill="url(#g)"/></svg>`);
const visibleImages = ref<Set<string>>(new Set());

function markVisible(src: string) {
	if (!visibleImages.value.has(src)) {
		visibleImages.value.add(src);
	}
}

function observeWaterfall() {
	const instance = getCurrentInstance();
	if (!instance) return;
	nextTick(() => {
		// 针对每列每张，建立一次性 observer
		waterfallColumns.value.forEach((col, cIdx) => {
			col.forEach((img, idx) => {
				const id = `wf-item-${cIdx}-${idx}`;
				// 已经可见则跳过
				if (visibleImages.value.has(img)) return;
				try {
					const observer = uni.createIntersectionObserver(instance, { thresholds: [0] });
					observer.relativeToViewport({ top: 0, bottom: 0 });
					observer.observe(`#${id}`, (res) => {
						if (res && res.intersectionRatio > 0) {
							markVisible(img);
							observer.disconnect();
						}
					});
				} catch (e) {
					// 兼容异常：直接全部加载
					markVisible(img);
				}
			});
		});
	});
}

watch(waterfallColumns, () => {
	observeWaterfall();
}, { immediate: true });

// 监听任务切换
watch(currentTaskIndex, () => {
	currentOutputIndex.value = 0 // 切换任务时重置输出索引
	// 避免在频繁渲染时打印日志，保留最少量的状态更新
	const currentTask = safeLocalTasks.value[currentTaskIndex.value]
	if (currentTask && currentTask.output && currentOutputIndex.value >= currentTask.output.length) {
		currentOutputIndex.value = 0
	}
})

// 监听任务输出变化：当后端返回图片（outputs 从空变为非空）时，确保主图显示
watch(
	() => safeLocalTasks.value.map(t => (t && Array.isArray(t.output) ? t.output.length : 0)),
	(newLens, oldLens) => {
		// 如果当前任务之前没有输出而现在有输出，则重置输出索引以显示主图，并提示用户
		const prev = oldLens[currentTaskIndex.value] || 0
		const now = newLens[currentTaskIndex.value] || 0
		if (prev === 0 && now > 0) {
			currentOutputIndex.value = 0
			// 在多平台下显示轻量提示，告诉用户图片已生成
			try {
				uni.showToast({ title: '图片已生成并刷新', icon: 'none' })
			} catch (e) {
				// 保底：若 uni 不可用则不阻塞
				console.log('toast:', '图片已生成并刷新')
			}
			// 强制触发视图更新（在部分小程序环境中有时需要 nextTick）
			nextTick(() => {
				// no-op, ensures reactivity settles
			})
		}
	}, { deep: false }
)

const AllList = computed(() => {
	return safeLocalTasks.value || []
})

// 当前任务
const currentTask = computed(() => {
	if (!safeLocalTasks.value || safeLocalTasks.value.length === 0) {
		return null;
	}
	return safeLocalTasks.value[currentTaskIndex.value] || null;
})

// 当前任务的输出列表
const currentTaskOutputs = computed(() => {
	if (!currentTask.value || !Array.isArray(currentTask.value.output)) {
		return [];
	}
	return currentTask.value.output;
})

// 新增：后端已完成但图片未返回的等待状态
const isWaitingForImage = computed(() => {
	// 任务状态为已完成（1），但 output 为空，说明图片还没返回
	return currentTask.value && currentTask.value.status === 1 && Array.isArray(currentTask.value.output) && currentTask.value.output.length === 0;
})

// 当前选中的输出内容
const currentOutput = computed(() => {
	if (currentTaskOutputs.value.length === 0) {
		return '';
	}
	return currentTaskOutputs.value[currentOutputIndex.value] || currentTaskOutputs.value[0] || '';
})

// 获取任务的缩略图
const getTaskThumbnail = (task: any) => {
	if (task && task.status === 1 && Array.isArray(task.output) && task.output.length > 0) {
		return task.output[0];
	}
	return loadingBackground;
}

// 预计算缩略图映射，避免模板中每次渲染都调用函数
const thumbnailsMap = computed(() => {
	const map: Record<string, string> = {}
	const list = safeLocalTasks.value || []
	for (let i = 0; i < list.length; i++) {
		const task = list[i]
		const key = task?._id || String(i)
		if (task?.status === 1 && Array.isArray(task.output) && task.output.length > 0) {
			map[key] = task.output[0]
		} else {
			map[key] = loadingBackground
		}
	}
	return map
})

// 当前任务的进度
const currentProgress = computed(() => {
	if (!currentTask.value) {
		return '暂无任务';
	}
	if (currentTask.value.status === 4 && typeof currentTask.value.progress !== 'undefined') {
		return (currentTask.value.progress ?? 0) + '%';
	} else if (currentTask.value.status === 0 && typeof currentTask.value.queue !== 'undefined') {
		return `队列:${currentTask.value.queue},预计:${currentTask.value.time_remained ?? '-'}s`;
	}
	return '';
})

// 当前任务是否正在进行中
const showProgress = computed(() => {
	return currentTask.value && currentTask.value.status !== 1;
})

const progressAnimation = ref({}); // 存储动画数据
// 创建动画实例并设置动画效果
const createAnimation = () => {
	const animation = uni.createAnimation({
		duration: 10000, // 动画时长
		timingFunction: 'ease', // 动画缓动函数
	});

	// 设置从透明到不透明的动画效果
	animation.opacity(0).step();
	progressAnimation.value = animation.export();
	return animation;
};

// 切换任务
const handleTaskChange = (index: number) => {
	currentTaskIndex.value = index;
	currentOutputIndex.value = 0; // 重置输出索引
}

// 切换输出内容
const handleOutputChange = (index: number) => {
	currentOutputIndex.value = index;
}

// ================== 缩略图增强：懒加载 / 进度动画 / 长按提示 ==================
// 记录已进入视口的缩略图索引
const visibleThumbs = ref<Set<number>>(new Set());
function markThumbVisible(i: number) {
	if (!visibleThumbs.value.has(i)) visibleThumbs.value.add(i);
}
function observeThumbs() {
	const instance = getCurrentInstance();
	if (!instance) return;
	nextTick(() => {
		const list = AllList.value || [];
		list.forEach((_, i) => {
			const id = `thumb-${i}`;
			if (visibleThumbs.value.has(i)) return; // 已经可见
			try {
				const observer = uni.createIntersectionObserver(instance, { thresholds: [0] });
				observer.relativeToViewport({ top: 0, bottom: 0 });
				observer.observe('#' + id, (res) => {
					if (res && res.intersectionRatio > 0) {
						markThumbVisible(i);
						observer.disconnect();
					}
				});
			} catch (e) {
				// 兼容失败时直接全部标记可见
				markThumbVisible(i);
			}
		});
	});
}
onMounted(() => {
	observeThumbs();
});
watch(AllList, () => {
	// 任务列表变化时重新观察新项
	observeThumbs();
});

// 计算用于条形进度的百分比（限制 0-98，防止 100 提前显示真实完成）
function clampProgress(p: any): number {
	if (typeof p !== 'number' || isNaN(p)) return 0;
	return Math.max(0, Math.min(98, Math.floor(p)));
}

function handleThumbLongPress(task: any, index: number) {
	try {
		let msg = '';
		switch (task?.status) {
			case 1:
				msg = '已完成'; break;
			case 4:
				msg = typeof task.progress === 'number' ? `生成中: ${clampProgress(task.progress)}%` : '生成中…'; break;
			case 2:
				msg = '生成失败'; break;
			default:
				msg = '等待中';
		}
		uni.showToast({ title: msg, icon: 'none', duration: 1200 });
	} catch (e) { /* ignore */ }
}

const showPopup = defineModel({
	default: false
})

// 处理触摸开始事件
const handleTouchStart = () => {
	const animation = createAnimation();

	// 在触摸开始时隐藏 progress-container
	animation.opacity(0).step(); // 透明度设置为0
	progressAnimation.value = animation.export(); // 应用动画
};

// 处理触摸结束事件
const handleTouchEnd = () => {
	const animation = createAnimation();

	// 在触摸结束时显示 progress-container
	animation.opacity(1).step(); // 透明度设置为1

	setTimeout(() => progressAnimation.value = animation.export(), 200)
};

const handleFindExecutingTaskIndex = () => {
	return (safeLocalTasks.value || []).findIndex(item => item.status === 4)
}

// 合并两个 onShow 钩子为一个，并增强错误处理
// 当返回前台时：
// 后端可能不支持按 id 批量查询，所以我们采用前端兼容策略：
// 1) 拉取最近的任务列表（page=1, limit=50），将返回项按 _id 合并到 localTasks
// 2) 如果本地仍有正在执行的任务（status===4），短轮询若干次（每 2s 一次，最多 10 次）直到不再处于执行中或超时
// 这样可以在应用从后台恢复时尽快同步最新状态，避免显示离开时的旧进度
const isRefreshing = ref(false);
// 当在 onHide 清空了任务时，记录该标志以便 onShow 返回前台时不自动从服务器恢复任务
const clearedOnHide = ref(false);

async function refreshLocalTasksFromServer(ids?: string[]) {
	try {
		// 请求最近的任务（后端若不支持按 id 查询，此接口通常仍能返回最近记录）
		const limit = Math.max(20, ids && ids.length ? ids.length : 50);
		const response = await request<any>('draw/history/findMany', {
			method: 'POST',
			data: {
				// 空过滤表示获取最近公开/非删除项；如果需要可按实际后端调整
				history: {},
				page: 1,
				limit
			}
		});

		// Handle new API format: {total, items: [...]} or legacy array format
		let items: any[] = [];
		if (response) {
			if (Array.isArray(response)) {
				items = response;
			} else if (response.items && Array.isArray(response.items)) {
				items = response.items;
			} else if (response.data && Array.isArray(response.data.items)) {
				items = response.data.items;
			}
		}

		if (items.length > 0) {
			const map = new Map(items.map((it: any) => [it._id, it]));
			// Merge server data into existing localTasks without losing local-only fields
			const merged = (safeLocalTasks.value || []).map((local: any) => {
				if (local && local._id && map.has(local._id)) {
					const server = map.get(local._id);
					return { ...local, ...server };
				}
				return local;
			});
			try {
				localTasks.value = merged as any;
			} catch (e) {
				// 某些情况下 store 可能不可直接赋值，尝试逐项更新（保底）
				try {
					const arr = localTasks.value || [];
					for (let i = 0; i < arr.length; i++) {
						const id = arr[i] && arr[i]._id;
						if (id && map.has(id)) {
							arr[i] = { ...arr[i], ...map.get(id) };
						}
					}
				} catch (e2) { /* ignore */ }
			}
		}
	} catch (e) {
		console.error('刷新本地任务失败:', e);
	}
}

// Fetch task result from server v1/ai/result/:taskId (fallback when websocket disconnected)
async function fetchTaskResultById(taskId: string) {
	try {
		if (!taskId) return null
		// use request util if possible; request expects relative path without leading base
		// The provided API path is /v1/ai/result/:taskId -> use full path without leading slash
		const res = await request<any>(`v1/ai/result/${taskId}`, { method: 'GET' }).catch(() => null)
		return res
	} catch (e) {
		console.error('fetchTaskResultById error', e)
		return null
	}
}

// Poll results for currently executing tasks via API when WS is not available
async function pollTaskResultsViaApi(maxRounds = 10, intervalMs = 2000) {
	try {
		for (let round = 0; round < maxRounds; round++) {
			const executing = (safeLocalTasks.value || []).filter((t: any) => t && t.status === 4)
			if (!executing || executing.length === 0) return
			// Fetch each executing task once per round
			await Promise.all(executing.map(async (task: any) => {
				try {
					const result = await fetchTaskResultById(task._id)
					if (result && result.status) {
						// map API response status to local status codes in this app
						// API returns 'success'|'failed' etc. We only update when success/failed
						if (result.status === 'success') {
							// update local task
							const idx = localTasks.value.findIndex((it: any) => it._id === task._id)
							if (idx !== -1) {
								try {
									localTasks.value[idx].output = result.output || []
									localTasks.value[idx].type = result.type || localTasks.value[idx].type
									localTasks.value[idx].status = 1
								} catch (e) { /* ignore update errors */ }
							}
						} else if (result.status === 'failed') {
							const idx = localTasks.value.findIndex((it: any) => it._id === task._id)
							if (idx !== -1) {
								try { localTasks.value[idx].status = 2 } catch (e) { /* ignore */ }
							}
						}
					}
				} catch (e) { /* ignore per-task errors */ }
			}))
			// stop early if no executing tasks left
			const stillExec = (safeLocalTasks.value || []).some((t: any) => t && t.status === 4)
			if (!stillExec) return
			await new Promise(r => setTimeout(r, intervalMs))
		}
	} catch (e) { console.error('pollTaskResultsViaApi error', e) }
}

async function pollRefreshOnShow() {
	if (isRefreshing.value) return;
	isRefreshing.value = true;
	try {
		// 立即刷新一次
		await refreshLocalTasksFromServer();

		// If websocket is not initialized (e.g. closed while app was backgrounded),
		// fallback to polling the task result API for executing tasks.
		let wsAvailable = true
		try { wsAvailable = !!(socketState && socketState.isInitialized) } catch (e) { wsAvailable = false }
		if (!wsAvailable) {
			console.log('WebSocket unavailable on show — falling back to API polling')
			// poll via API until tasks finish or max attempts
			await pollTaskResultsViaApi(10, 2000)
			return
		}

		// 如果本地仍有执行中任务，则短轮询以尽快同步状态变化
		let attempts = 0;
		const maxAttempts = 10; // 最多轮询 10 次 => 最长约 20 秒
		while (attempts < maxAttempts) {
			const executingExists = (safeLocalTasks.value || []).some((t: any) => t && t.status === 4);
			if (!executingExists) break;
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await refreshLocalTasksFromServer();
			attempts++;
		}
	} finally {
		isRefreshing.value = false;
		// 更新当前执行任务索引（若有）
		const excIndex = handleFindExecutingTaskIndex();
		console.log('task onshow after refresh, executing index:', excIndex);
		if (excIndex !== -1) {
			currentTaskIndex.value = excIndex;
		}
	}
}

// onShow(() => {
// 	try {
// 		// 清理本地对“执行中任务”的进度缓存，避免返回时看到离开前的旧进度数字
// 		const arr = localTasks.value || [];
// 		for (let i = 0; i < arr.length; i++) {
// 			const t = arr[i];
// 			if (t && t.status === 4) {
// 				// 将 progress 置为 0（或 undefined），使 UI 显示为正在等待/刷新状态
// 				// 删除 progress 字段或设为 undefined，避免短暂显示 "0%" 的闪烁
// 				try { delete (t as any).progress; } catch (e) { try { (t as any).progress = undefined } catch (e2) { /* ignore */ } }
// 			}
// 		}
// 	} catch (e) { /* ignore */ }

// 	// 如果前一次是在 onHide 中清空了任务，则不要在此自动从服务器刷新任务，以保证回到前台时界面保持为空
// 	if (clearedOnHide.value) {
// 		// 重置标志并跳过刷新
// 		clearedOnHide.value = false;
// 		console.log('onShow: skipped auto refresh because tasks were cleared onHide');
// 		return;
// 	}

// 	// 节流：短时间内重复 onShow（例如图片预览 open/close）不要重复刷新任务列表
// 	if ((Date.now() - lastTasksRefreshTs) < TASK_REFRESH_COOLDOWN_MS) {
// 		console.log('onShow: skip pollRefreshOnShow due to task refresh cooldown', Date.now() - lastTasksRefreshTs)
// 		return;
// 	}
// 	lastTasksRefreshTs = Date.now();
// 	pollRefreshOnShow().catch((err) => console.error('pollRefreshOnShow error:', err));
// });

// 全局应用级的 onAppHide/onAppShow 清理逻辑已迁移到 app store 并在 `main.ts` 注册。
// 组件内不再绑定 onAppHide/onAppShow；只保留本组件对 store/local cache 的读取与渲染逻辑。

// onShow(() => {
// 	// refresh tasks in background to pick up server-side progress/completions
// 	try { refreshLocalTasksFromServer(); } catch (e) { /* ignore */ }
// });

const simpleLinkRegex = /^(?:https?:\/\/|\/\/)[^\s]+$/i;

function checkContent(str: any) {
	if (typeof str !== 'string') {
		return 2;
	}

	const trimmed = str.trim();
	if (!trimmed) {
		return 2;
	}

	// 直接检测 dataURL 或 blob
	if (trimmed.startsWith('data:image') || trimmed.startsWith('blob:')) {
		return 1;
	}

	const canUseURL = typeof URL === 'function';

	if (canUseURL) {
		try {
			new URL(trimmed);
			return 1;
		} catch (_err) {
			// ignore and try decoded string
		}
		try {
			const decoded = decodeURIComponent(trimmed);
			new URL(decoded);
			return 1;
		} catch (_err) {
			// fall through to regex check
		}
	}

	return simpleLinkRegex.test(trimmed) ? 1 : 2;
}
function judgeContent(input: any) {
	// 定义图片链接的正则表达式
	const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
	// 定义视频链接的正则表达式
	const videoRegex = /\.(mp4|avi|mov|mkv|flv|wmv|webm)$/i;

	const normalized = (() => {
		if (typeof input !== 'string') {
			return '';
		}
		try {
			return decodeURIComponent(input);
		} catch (err) {
			return input;
		}
	})();

	const pathForMatch = normalized.split(/[?#]/)[0];
	const linkType = checkContent(normalized);

	// 检查内容是否为空
	if (!input) {
		console.log('judgeContent - 是空值:', input)
		return 0; // 内容为空
	}
	// 检查内容是否为图片链接
	if (linkType === 1) {
		if (imageRegex.test(pathForMatch)) {
			console.log('judgeContent - 是图片:', input)
			return 1; // 是图片链接
		}
		// 检查内容是否为视频链接
		else if (videoRegex.test(pathForMatch)) {
			console.log('judgeContent - 是视频:', input)
			return 2; // 是视频链接
		}
	}
	// 如果不是图片或视频链接，则认为是文本
	if (linkType !== 1) {
		console.log('judgeContent - 是文本:', input)
		return 3; // 是文本
	}
	console.log('judgeContent - 未知类型，按文本处理:', input)
	return 3;
}

// 获取当前输出的内容类型
const currentContentType = computed(() => {
	if (!currentOutput.value) {
		return 0; // 空内容
	}
	return judgeContent(currentOutput.value);
})

// 当前任务的参数信息
const currentTaskParams = computed(() => {
	if (!currentTask.value || !currentTask.value.params) {
		return {};
	}
	return currentTask.value.params;
})

/*保存到相册*/
const handleSave = () => {
	if (currentTask.value && currentTask.value.status === 1 && currentOutput.value) {
		saveImage(currentOutput.value);
	}
}

const handleGotoHistory = () => {
	uni.navigateTo({ url: '/pagesHistorySub/history_fui/history_fui' })
}

// 下载网络图片并保存到相册
const saveImage = (url: string) => {
	// 第一步：下载图片
	uni.downloadFile({
		url: url, // 图片的网络地址
		success: (res) => {
			if (res.statusCode === 200) {
				// 第二步：下载成功后，获取本地路径
				const localPath = res.tempFilePath;
				console.log('localPath', localPath);
				// 第三步：保存图片到相册
				uni.saveImageToPhotosAlbum({
					filePath: localPath,
					success: () => {
						uni.showToast({
							title: '图片已保存',
							icon: 'success'
						});
					},
					fail: (error) => {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
						console.error('保存图片失败:', error);
					}
				});
			} else {
				uni.showToast({
					title: '下载失败',
					icon: 'none'
				});
			}
		},
		fail: (error) => {
			uni.showToast({
				title: '下载失败',
				icon: 'none'
			});
			console.error('下载图片失败:', error);
		}
	});
}

/**预览图片 */
const handlePreview = () => {
	if (currentTask.value && currentTask.value.status === 1) {
		if (currentContentType.value === 1 && currentTaskOutputs.value.length > 0) {
			// 图片类型：预览图片
			console.log("preview images")
			// 使用系统原生预览（uni.previewImage），传入 urls 和 current url
			try {
				// currentTaskOutputs and currentOutput are computed refs; pass their .value primitives
				uni.previewImage && uni.previewImage({ urls: currentTaskOutputs.value, current: currentOutput.value })
			} catch (e) {
				console.warn('uni.previewImage failed, falling back to in-app preview', e)
				openPreview(currentOutputIndex.value || 0)
			}
		} else if (currentContentType.value === 3 && currentOutput.value) {
			// 文本类型：复制到剪切板
			copyToClipboard()
		} else {
			// 其他类型或无内容
			uni.showToast({
				title: '无可预览内容',
				icon: 'none'
			})
		}
	}
}

// ========== 应用内图片预览 (替代 uni.previewImage) ==========
const previewVisible = ref(false);
const previewIndex = ref(0);
const previewList = computed(() => currentTaskOutputs.value || []);

// 缩放/平移状态（每次打开或切换 slide 时会重置）
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
let lastDistance: number | null = null;
let baseScale = 1;
let lastPan = { x: 0, y: 0 };
let isPanning = false;

function resetTransform() {
	scale.value = 1; translateX.value = 0; translateY.value = 0; baseScale = 1; lastDistance = null; lastPan = { x: 0, y: 0 }; isPanning = false;
}

function openPreview(idx = 0) {
		if (!previewList.value || previewList.value.length === 0) return;
		previewIndex.value = Math.max(0, Math.min(idx, previewList.value.length - 1));
		resetTransform();
		previewVisible.value = true;
}
function closePreview() { previewVisible.value = false; resetTransform(); }

function onSwiperChange(e: any) {
	const newIndex = e && e.detail && typeof e.detail.current === 'number' ? e.detail.current : previewIndex.value;
	previewIndex.value = newIndex;
	resetTransform();
}

// 导航函数：模板中使用的左右导航按钮需要这些方法
function prevPreview() {
	if (!previewList.value || previewList.value.length === 0) return;
	previewIndex.value = Math.max(0, previewIndex.value - 1);
	resetTransform();
}

function nextPreview() {
	if (!previewList.value || previewList.value.length === 0) return;
	previewIndex.value = Math.min(previewList.value.length - 1, previewIndex.value + 1);
	resetTransform();
}

function onPreviewTouchStart(e: any) {
	const touches = (e && e.touches) || [];
	if (touches.length === 2) {
		lastDistance = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
		baseScale = scale.value;
	} else if (touches.length === 1) {
		isPanning = true;
		lastPan = { x: touches[0].clientX, y: touches[0].clientY };
	}
}

function onPreviewTouchMove(e: any) {
	const touches = (e && e.touches) || [];
	if (touches.length === 2) {
		const dist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
		if (lastDistance && lastDistance > 0) {
			let nextScale = baseScale * (dist / lastDistance);
			nextScale = Math.max(1, Math.min(nextScale, 4));
			scale.value = nextScale;
		}
	} else if (touches.length === 1 && isPanning && scale.value > 1) {
		const dx = touches[0].clientX - lastPan.x;
		const dy = touches[0].clientY - lastPan.y;
		translateX.value += dx;
		translateY.value += dy;
		lastPan = { x: touches[0].clientX, y: touches[0].clientY };
	}
}

function onPreviewTouchEnd(e: any) {
	const touches = (e && e.touches) || [];
	if (touches.length < 2) lastDistance = null;
	if (touches.length === 0) isPanning = false;
	// 限制平移范围（简单裁剪，避免图片被拖出太远）
	const maxTranslate = 2000; // 大值防止过度限制，按需调整
	translateX.value = Math.max(-maxTranslate, Math.min(maxTranslate, translateX.value));
	translateY.value = Math.max(-maxTranslate, Math.min(maxTranslate, translateY.value));
}

const fabs = [{
	name: 'edit',
	text: '复制文本'
},
	// {
	// 	name: 'share',
	// 	text: '分享海报'
	// },
]

const show = ref(false)
function handleClick(e: any, StringTxt: any) {
	if (e.index == 0) {
		console.log('---------------(e)------------', e)
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
	else if (e.index == 1) {
		uni.showToast({
			title: "还在开发中...",
			icon: 'none'
		});

	}

}
const isLeft = true

console.log("--------****************------------", AllList.value)

// 复制文本到剪切板
const copyToClipboard = () => {
	if (currentOutput.value && currentContentType.value === 3) {
		uni.setClipboardData({
			data: currentOutput.value,
			showToast: true,
			success: () => {
				uni.showToast({
					title: '已复制到剪切板',
					icon: 'success',
					duration: 2000
				});
			},
			fail: (err) => {
				console.error('复制失败:', err);
				uni.showToast({
					title: '复制失败',
					icon: 'none'
				});
			}
		});
	}
}

// 格式化时间函数
const formatTime = (timestamp: string | number) => {
	if (!timestamp) return '未知时间';
	const date = new Date(timestamp);
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
}

// ===================================新增分享功能========================================

</script>

<template>
	<MyPopup v-model="showPopup">
		<view class="task-progress-container" :style="backgroundStyle">
			<!-- 调试信息 -->
			<!-- <view v-if="false" style="position: absolute; top: 50rpx; left: 30rpx; z-index: 10; background: white; padding: 20rpx; border-radius: 10rpx;">
        <text>社区图片数量: {{ communityImages.length }}</text>
        <text>历史图片数量: {{ historyImages.length }}</text>
        <text>瀑布流列数: {{ waterfallColumns.length }}</text>
      </view> -->

			<!-- 16:9 交叉排列无限滚动竖屏瀑布流背景 -->
			<view class="wf-bg" v-if="waterfallColumns.length > 0">
				<view class="wf-columns">
					<view v-for="(col, cIdx) in waterfallColumns" :key="'col-' + cIdx" class="wf-col"
						:class="['wf-col-' + (cIdx + 1)]">
						<view class="wf-track"
							:style="{ '--dur': (100 - cIdx * 10) + 's', '--delay': (-cIdx * 8) + 's' }">
							<view v-for="(img, idx) in col.concat(col)" :key="img + '-' + idx" class="wf-item"
								:id="'wf-item-' + cIdx + '-' + idx">
								<image :src="visibleImages.has(img) ? img : placeholderBase64" mode="aspectFill"
									:class="['wf-img', { 'is-loading': !visibleImages.has(img) }]"
									@load="() => markVisible(img)" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 安全区域顶部间距 -->
			<view class="safe-area-top"></view>

			<!-- 主内容区域 -->
			<view class="main-content">
				<!-- 主内容区域 -->
				<view class="content-area">
					<!-- 输出内容区域 -->
					<view class="output-section">
						<!-- 加载状态 -->
						<LoadingState v-if="currentTask && currentTask.status === 4"
							:progress="Number(currentTask.progress) || 0" />
						<!-- 新增：后端已完成但图片未返回，显示等待动画 -->
						<view v-else-if="isWaitingForImage" class="waiting-image-state">
							<TnIcon name="starry" size="80" color="#007AFF" class="waiting-progress-icon" />
							<text class="waiting-progress-text">图片生成中，请稍候...</text>
						</view>
						<!-- 图片类型 -->
						<view v-else-if="currentTask && currentTask.status === 1 && currentContentType === 1"
							class="image-output">
							<!-- 多图片切换 -->
							<view v-if="currentTaskOutputs.length > 1" class="output-tabs">
								<view v-for="(output, index) in currentTaskOutputs" :key="index"
									:class="['output-tab', { 'active': index === currentOutputIndex }]"
									@click="handleOutputChange(index)">
									<image class="tab-thumb" mode="aspectFill" :src="output" lazy-load />
								</view>
							</view>
							<!-- 主图片显示 -->
							<view class="main-image" @click="handlePreview">
								<image class="output-image" mode="aspectFit" :src="currentOutput" lazy-load
									show-menu-by-longpress />
							</view>
						</view>

						<!-- 视频类型 -->
						<view v-else-if="currentTask && currentTask.status === 1 && currentContentType === 2"
							class="video-output">
							<video class="output-video" :src="currentOutput" controls></video>
						</view>

						<!-- 文本类型 -->
						<view v-else-if="currentTask && currentTask.status === 1 && currentContentType === 3"
							class="text-output">
							<!-- 参考图片（如果存在） -->
							<view v-if="(currentTaskParams as any).image_path_origin" class="reference-image">
								<image class="ref-img" mode="aspectFill"
									:src="(currentTaskParams as any).image_path_origin" lazy-load />
								<view class="ref-label">参考图</view>
							</view>
							<!-- 文本内容区域 -->
							<view class="text-content">
								<scroll-view scroll-y="true" class="text-scroll" :show-scrollbar="false">
									<view class="text-wrapper">
										<fui-parse-group class="custom-view" :thBgcolor="false">
											<fui-parse :nodes="currentOutput" language="html"></fui-parse>
										</fui-parse-group>
									</view>
								</scroll-view>
							</view>
						</view>

						<!-- 失败状态 -->
						<view v-else-if="currentTask && currentTask.status === 2" class="error-state">
							<view class="error-icon">
								<TnIcon name="close" size="80" color="#ff4757" />
							</view>
							<text class="error-text">生成失败，请稍后重试</text>
						</view>

						<!-- 空状态 -->
						<view v-else class="empty-content">
							<TnIcon name="image" size="80" color="#ccc" />
							<text class="empty-text">更多绘画记录请点击下方按钮到“绘画历史中查看”</text>
						</view>
					</view>
				</view>

				<!-- 缩略图列表 -->
				<view class="bottom-thumbnails">
					<scroll-view scroll-x="true" class="thumbnail-scroll-horizontal">
						<view v-for="(task, index) in AllList" :key="task._id || index"
							:id="'thumb-' + index"
							:class="['thumbnail-item-horizontal', { 'active': index === currentTaskIndex }]"
							@click="handleTaskChange(index)"
							@longpress="handleThumbLongPress(task, index)">
							<view class="thumbnail-img-horizontal inline-thumb">
								<!-- 已完成且可见后才真正加载图片 -->
								<template v-if="task.status === 1 && task.output && task.output.length > 0 && visibleThumbs.has(index)">
									<image :src="task.output[0]" mode="aspectFill" class="thumb-image fade-in" lazy-load />
								</template>
								<template v-else>
									<!-- 骨架 + 进度/状态层 -->
									<view class="thumb-skeleton" :class="{'is-active': task.status !== 1}"></view>
									<view class="thumb-progress">
										<!-- 圆形进度环（进行中） -->
										<view v-if="task.status === 4" class="circle-wrapper">
											<view class="circle-bg"></view>
											<view class="circle-mask" :style="{ '--p': clampProgress(Number(task.progress) || 0) }"></view>
										</view>
										<!-- 条形进度条 -->
										<!-- <view v-if="task.status === 4" class="linear-bar">
											<view class="linear-fill" :style="{ width: clampProgress(task.progress || 0) + '%' }"></view>
										</view> -->
										<text v-if="task.status === 4 && typeof task.progress === 'number'" class="progress-text-small">{{ clampProgress(Number(task.progress)) }}%</text>
										<text v-else-if="task.status === 4" class="progress-text-small">生成中</text>
										<text v-else-if="task.status === 2" class="progress-text-small error">失败</text>
										<text v-else class="progress-text-small ">加载中</text>
									</view>
								</template>
							</view>
							<view v-if="task.output && task.output.length > 1" class="output-count-horizontal">
								<text class="count-text-horizontal">{{ task.output.length }}</text>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 底部按钮 -->
				<view class="bottom-actions">
					<view class="action-buttons">
						<!-- 复制按钮（仅文本类型显示） -->
						<view v-if="currentTask && currentTask.status === 1 && currentContentType === 3"
							class="action-btn" @click="copyToClipboard">
							<view class="icon-bg">
								<tn-icon name="copy" size="26rpx" color="#fff"></tn-icon>
							</view>
							<text class="btn-text">复制</text>
						</view>
						<!-- 保存按钮（仅图片/视频类型显示） -->
						<view
							v-if="currentTask && currentTask.status === 1 && (currentContentType === 1 || currentContentType === 2)"
							class="action-btn" @click="handleSave">
							<view class="icon-bg">
								<tn-icon name="download-simple" size="26rpx" color="#fff"></tn-icon>
							</view>
							<text class="btn-text">保存</text>
						</view>
						<!-- 预览按钮 -->
						<view class="action-btn" @click="handlePreview">
							<view class="icon-bg">
								<tn-icon name="eye" size="35rpx" color="#fff"></tn-icon>
							</view>
							<text class="btn-text">预览</text>
						</view>
						<!-- 历史按钮 -->
						<view class="action-btn" @click="handleGotoHistory">
							<view class="icon-bg">
								<tn-icon name="right-arrow" size="35rpx" color="#fff"></tn-icon>
							</view>
							<text class="btn-text">历史</text>
						</view>
					</view>
				</view>

			</view>
		</view>
	</MyPopup>

	<!-- 应用内全屏预览 Modal -->
	<view v-if="previewVisible" class="inapp-preview-mask">
		<view class="inapp-preview-top">
			<view class="inapp-preview-close" @click="closePreview">关闭</view>
		</view>
		<view class="inapp-preview-body">
			<swiper class="inapp-preview-swiper" :current="previewIndex" @change="onSwiperChange">
				<swiper-item v-for="(src, idx) in previewList" :key="idx">
					<view class="inapp-preview-item">
						<image class="inapp-preview-image" :style="{ transform: 'scale(' + scale + ') translate(' + translateX + 'px,' + translateY + 'px)' }" :src="src" mode="aspectFit"
							@touchstart="onPreviewTouchStart" @touchmove="onPreviewTouchMove" @touchend="onPreviewTouchEnd" />
					</view>
				</swiper-item>
			</swiper>
			<!-- 左右导航（保留点击切换） -->
			<view class="inapp-preview-nav left" @click.stop="prevPreview">‹</view>
			<view class="inapp-preview-nav right" @click.stop="nextPreview">›</view>
		</view>
		<view class="inapp-preview-footer">
			<text>{{ previewIndex + 1 }} / {{ previewList.length }}</text>
		</view>
	</view>


</template>

<style scoped>
.inapp-preview-mask { position: fixed; left:0; right:0; top:0; bottom:0; background: rgba(0,0,0,0.9); z-index: 2000; display:flex; flex-direction:column; align-items:center; }
.inapp-preview-top { width:100%; display:flex; justify-content:flex-end; padding: 20rpx; }
.inapp-preview-close { color: #fff; font-size: 28rpx; }
.inapp-preview-body { flex:1; width:100%; display:flex; align-items:center; justify-content:center; position:relative }
.inapp-preview-swiper { width:100%; height:100%; }
.inapp-preview-item { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
.inapp-preview-image { max-width: 100%; max-height: 100%; transition: transform 0.12s ease-out; touch-action: none; }
.inapp-preview-nav { position:absolute; top:50%; transform:translateY(-50%); color:#fff; font-size:60rpx; width:120rpx; text-align:center; }
.inapp-preview-nav.left { left: 10rpx }
.inapp-preview-nav.right { right: 10rpx }
.inapp-preview-footer { width:100%; text-align:center; padding: 20rpx; color:#fff }
</style>

<style scoped lang="scss">
/* 主容器 */
.task-progress-container {
	height: 100vh;
	background: transparent;
	position: relative;
	display: flex;
	flex-direction: column;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		backdrop-filter: blur(0);
		/* 移除模糊效果使背景更清晰 */
		z-index: 0;
	}
}

/* ================= 瀑布流背景（16:9 交叉排列无限滚动） ================ */

// 新版 300x600rpx 纵向无缝滚动瀑布流
.wf-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	overflow: hidden;
	opacity: 0.92;

	/* 渐隐遮罩 */
	&::before,
	&::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 160rpx;
		z-index: 5;
		pointer-events: none;
	}

	&::before {
		top: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0));
	}

	&::after {
		bottom: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0));
	}
}

.wf-columns {
	display: flex;
	height: 100%;
	width: 100%;
	gap: 40rpx;
	padding: 30rpx;
	box-sizing: border-box;
}

.wf-col {
	flex: 1;
	position: relative;
	overflow: visible;
}

.wf-col:nth-child(even) {
	padding-top: 180rpx;
}

.wf-track {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	/* 拆分 animation 避免 iOS 对自定义属性在 animation 简写中的兼容问题 */
	animation-name: wf-scroll;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	animation-duration: var(--dur, 60s);
	animation-delay: var(--delay, 0s);
	will-change: transform;
}

.wf-col:nth-child(even) .wf-track {
	animation-direction: reverse;
}

.wf-item {
	width: 100%;
	height: 520rpx;
	/* 统一固定高度，避免不同端 aspect-ratio 兼容问题 */
	position: relative;
	border-radius: 28rpx;
	overflow: hidden;
	margin-bottom: 40rpx;
	background: #f7e6ff;
	box-shadow: 0 10rpx 30rpx rgba(200, 120, 255, 0.10);
}

.wf-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	/* 填满卡片区域 */
	filter: brightness(.98);
	transition: transform .6s ease;
}

.wf-img.is-loading {
	filter: blur(12rpx) brightness(1.05);
	animation: pulseOpacity 1.6s ease-in-out infinite;
}

.wf-img:not(.is-loading) {
	transition: opacity .6s ease, transform .6s ease;
	opacity: 1;
}

@keyframes pulseOpacity {

	0%,
	100% {
		opacity: .75;
	}

	50% {
		opacity: .45;
	}
}

.wf-item:nth-child(odd) .wf-img {
	animation: subtle-zoom 16s ease-in-out infinite;
}

.wf-item:nth-child(even) .wf-img {
	animation: subtle-zoom 20s ease-in-out infinite reverse;
}

@keyframes wf-scroll {
	0% {
		transform: translateY(0);
	}

	100% {
		transform: translateY(-50%);
	}
}

@keyframes subtle-zoom {

	0%,
	100% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.06);
	}
}

/* 安全区域 */
.safe-area-top {
	height: env(safe-area-inset-top, 44px);
	min-height: 44px;
	position: relative;
	z-index: 1;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20rpx;
	gap: 20rpx;
	overflow: hidden;
	position: relative;
	z-index: 2;
}

/* 底部缩略图列表 */
.bottom-thumbnails {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(25px);
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	-webkit-backdrop-filter: blur(25px);
	padding: 20rpx;
	margin-top: 20rpx;
	position: relative;
	z-index: 2;
}

.thumbnail-scroll-horizontal {
	white-space: nowrap;
	/* 支持 iOS 动量滚动 */
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
}

.thumbnail-item-horizontal {
	position: relative;
	display: inline-block;
	margin-right: 24rpx;
	border-radius: 16rpx;
	overflow: hidden;
	border: 3rpx solid transparent;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	vertical-align: top;

	&.active {
		/* remove blue border when active */
		border-color: transparent;
		transform: scale(1.08) translateY(-4rpx);
		box-shadow: 0 12rpx 28rpx rgba(0, 122, 255, 0.3);
		background: rgba(255, 255, 255, 0.4);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	&:last-child {
		margin-right: 0;
	}

	&:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}
}

.thumbnail-img-horizontal {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
}

/* 内联缩略图容器/进度样式 */
.inline-thumb {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255,255,255,0.1);
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	border: 1rpx solid rgba(255,255,255,0.25);
	overflow: hidden;
}
.inline-thumb .thumb-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: opacity .4s ease;
}
.inline-thumb .thumb-image.fade-in { opacity: 0; animation: fadeImg .45s ease forwards; }
@keyframes fadeImg { to { opacity: 1; } }
.thumb-progress {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	font-size: 26rpx;
	color: #fff;
	background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05));
	text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.35);
}
.progress-text-small {
	font-weight: 600;
	/* 渐变紫色文字 */
	background: linear-gradient(135deg, #c77cff 0%, #7b2cff 50%, #5a4bff 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}
.progress-text-small.error { color: #7d1a1b; -webkit-text-fill-color: initial; }
.progress-text-small.pending { color: #237527ac; -webkit-text-fill-color: initial; }

/* 骨架闪烁 */
.thumb-skeleton {
	position: absolute;
	inset: 0;
	background: linear-gradient(110deg, rgba(255,255,255,0.18) 15%, rgba(255,255,255,0.32) 30%, rgba(255,255,255,0.18) 45%);
	background-size: 200% 100%;
	animation: shimmer 2s ease-in-out infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* 圆形进度环（纯 CSS，基于锥形渐变 + 遮罩）*/
.circle-wrapper { position: relative; width: 54rpx; height: 54rpx; margin-bottom: 8rpx; }
.circle-bg { position: absolute; inset: 0; border-radius: 50%; background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); }
.circle-mask {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	--p: 0;
	/* 彩色渐变环：使用 conic-gradient 渐变，再用内圈遮罩挖空中间 */
	background: conic-gradient(#9b5cff calc(var(--p) * 1%), #6e42ff calc(var(--p) * 1%), #42c6ff 100%);
	/* 中间挖空，保留环形 */
	mask: radial-gradient(circle at 50% 50%, transparent 60%, #000 61%);
	-webkit-mask: radial-gradient(circle at 50% 50%, transparent 60%, #000 61%);
	transition: background .4s linear, opacity .3s ease;
}

/* 条形进度 */
.linear-bar { position: relative; width: 80%; height: 10rpx; background: rgba(255,255,255,0.2); border-radius: 6rpx; overflow: hidden; margin-bottom: 8rpx; }
.linear-fill { position: absolute; left:0; top:0; bottom:0; /* 紫色渐变填充 */ background: linear-gradient(90deg,#a64dff,#6e42ff); width:0; transition: width .45s ease; }

/* 缩略图内的进度徽章 */
.thumbnail-progress-badge {
	position: absolute;
	left: 8rpx;
	bottom: 8rpx;
	background: linear-gradient(90deg, rgba(0, 122, 255, 0.95), rgba(0, 100, 200, 0.95));
	color: #fff;
	padding: 6rpx 10rpx;
	border-radius: 12rpx;
	font-size: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.2);
	z-index: 5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.badge-text {
	color: #fff;
	font-weight: 600;
}

.task-status-horizontal {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(10px);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.status-success {
	background: linear-gradient(135deg, #4CAF50, #45a049);
	box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.status-processing {
	background: linear-gradient(135deg, rgba(0, 122, 255, 0.9), rgba(0, 100, 200, 0.9));
	box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.status-failed {
	background: linear-gradient(135deg, #F44336, #d32f2f);
	box-shadow: 0 4rpx 12rpx rgba(244, 67, 54, 0.3);
}

.status-pending {
	background: linear-gradient(135deg, rgba(153, 153, 153, 0.9), rgba(119, 119, 119, 0.9));
	box-shadow: 0 4rpx 12rpx rgba(153, 153, 153, 0.3);
}

.output-count-horizontal {
	position: absolute;
	bottom: 8rpx;
	right: 8rpx;
	background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
	backdrop-filter: blur(10px);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.count-text-horizontal {
	color: #fff;
	font-size: 20rpx;
	font-weight: 600;
}

/* 主内容区域 */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	overflow: hidden;
}

/* 输出内容区域 */
.output-section {
	flex: 1;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	overflow: hidden;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0.05) 50%,
				rgba(255, 255, 255, 1));
		pointer-events: none;
		z-index: 0;
	}

	>* {
		position: relative;
		z-index: 1;
	}
}

/* 等待图片生成的居中样式 */
.waiting-image-state {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
}

.waiting-progress-text {
	font-size: 32rpx;
	color: #666666;
	text-align: center;
}

.waiting-progress-icon {
	margin-bottom: 8rpx;
}

/* 图片输出样式 */
.image-output {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.output-tabs {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
	padding-bottom: 24rpx;
	border-bottom: 2rpx solid rgba(240, 240, 240, 0.5);
}

.output-tab {
	width: 88rpx;
	height: 88rpx;
	border-radius: 12rpx;
	overflow: hidden;
	border: 3rpx solid transparent;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);

	&.active {
		border-color: #007AFF;
		transform: scale(1.1);
		box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.3);
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0) 100%);
		pointer-events: none;
	}
}

.tab-thumb {
	width: 100%;
	height: 100%;
}

.main-image {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	overflow: hidden;
	background: linear-gradient(135deg, #f8f9fa, #e9ecef);
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(255, 255, 255, 0.2) 0%,
				rgba(255, 255, 255, 0) 50%,
				rgba(255, 255, 255, 0.1));
		pointer-events: none;
	}
}

.output-image {
	max-width: 100%;
	max-height: 100%;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	transition: transform 0.3s ease;

	&:hover {
		transform: scale(1.02);
	}
}

/* 视频输出样式 */
.video-output {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.output-video {
	width: 100%;
	max-height: 100%;
	border-radius: 12rpx;
}

/* 文本输出样式 */
.text-output {
	height: 100%;
	display: flex;
	gap: 24rpx;
	align-items: flex-start;
	/* 让参考图与文本顶部对齐 */
}

.reference-image {
	width: 220rpx;
	/* 略微增大以便在高分屏上清晰显示 */
	flex-shrink: 0;
	margin-right: 20rpx;
}

.ref-img {
	width: 100%;
	height: 320rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
	object-fit: cover;
}

.ref-label {
	text-align: center;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #666;
	font-weight: 500;
}

.text-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.text-scroll {
	flex: 1;
	background: linear-gradient(135deg,
			rgba(248, 249, 250, 0.1),
			rgba(255, 255, 255, 0.08));
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 30rpx;
	line-height: 44rpx;
	color: #222;
	overflow-wrap: break-word;
	word-break: break-word;
	/* iOS momentum scroll */
	-webkit-overflow-scrolling: touch;
	overflow-y: auto;
}

/* 空状态样式 */
.empty-output {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.empty-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 40rpx;
	border-radius: 16rpx;
	background: linear-gradient(135deg,
			rgba(255, 255, 255, 0.2),
			rgba(248, 249, 250, 0.15));
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid rgba(255, 255, 255, 0.4);
	/* 限制最大宽度，保证大屏居中显示合理 */
	max-width: 780rpx;
	margin: 0 auto;
}

.empty-text {
	display: block;
	margin-top: 28rpx;
	font-size: 30rpx;
	font-weight: 500;
	color: #666;
	background: linear-gradient(135deg, #666, #999);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

/* 参数信息区域 */
.params-section {
	flex: 1;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(25px);
	-webkit-backdrop-filter: blur(25px);
	border-radius: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0.05) 50%,
				rgba(255, 255, 255, 0.1) 100%);
		pointer-events: none;
		z-index: 0;
	}

	>* {
		position: relative;
		z-index: 1;
	}
}

.params-header {
	display: flex;
	align-items: center;
	padding: 28rpx 32rpx;
	border-bottom: 2rpx solid rgba(240, 240, 240, 0.5);
	background: linear-gradient(90deg,
			rgba(255, 255, 255, 0.1),
			rgba(255, 255, 255, 0.05));
}

.params-title {
	margin-left: 16rpx;
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
	background: linear-gradient(135deg, #333, #666);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.params-scroll {
	flex: 1;
	padding: 24rpx 32rpx;
}

.param-item {
	margin-bottom: 24rpx;
	padding: 20rpx;
	background: linear-gradient(135deg,
			rgba(255, 255, 255, 0.2),
			rgba(248, 249, 250, 0.15));
	border-radius: 16rpx;
	border: 1rpx solid rgba(255, 255, 255, 0.4);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	transition: all 0.3s ease;

	&:last-child {
		margin-bottom: 0;
	}

	&:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
	}
}

.param-label {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5rpx;
}

.param-value {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
	font-weight: 500;
}

.param-text-long {
	color: #555;
}

.param-text {
	word-break: break-all;
}

/* 任务信息 */
.task-info {
	margin-top: 32rpx;
	padding: 24rpx;
	background: linear-gradient(135deg,
			rgba(0, 122, 255, 0.1),
			rgba(0, 122, 255, 0.05));
	border-radius: 16rpx;
	border: 1rpx solid rgba(0, 122, 255, 0.2);
	backdrop-filter: blur(10px);
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid rgba(0, 122, 255, 0.1);

	&:last-child {
		margin-bottom: 0;
		border-bottom: none;
	}
}

.info-label {
	font-size: 28rpx;
	color: #007AFF;
	font-weight: 600;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	max-width: 60%;
	text-align: right;
	font-weight: 500;
}

/* 进度覆盖层 */
.progress-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: linear-gradient(135deg,
			rgba(255, 255, 255, 0.2),
			rgba(255, 255, 255, 0.15));
	border-radius: 28rpx;
	padding: 80rpx 60rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.25);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 2rpx solid rgba(255, 255, 255, 0.4);
	z-index: 1000;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(0, 122, 255, 0.1) 0%,
				rgba(0, 122, 255, 0.05) 50%,
				rgba(0, 122, 255, 0.1));
		border-radius: 28rpx;
		pointer-events: none;
	}
}

.progress-content {
	text-align: center;
	position: relative;
	z-index: 1;
}

.progress-icon {
	margin-bottom: 32rpx;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(1.1);
		opacity: 0.8;
	}

	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.progress-text {
	font-size: 36rpx;
	font-weight: 700;
	background: linear-gradient(135deg, #007AFF, #0056CC);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 20rpx;
}

.progress-tip {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
	font-weight: 500;
	line-height: 1.4;
}

/* 底部操作按钮 */
.bottom-actions {
	padding: 24rpx 40rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom, 0px));
	/* 固定最小高度 300rpx（包含安全区高度） */
	min-height: calc(150rpx + env(safe-area-inset-bottom, 0px));
	/* 圆角 */
	border-radius: 50rpx;
	background: linear-gradient(135deg,
			rgba(255, 255, 255, 0.15),
			rgba(255, 255, 255, 0.1));
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);

	border-top: 2rpx solid rgba(255, 255, 255, 0.4);
	position: relative;
	z-index: 2;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg,
				rgba(0, 122, 255, 0.05) 0%,
				rgba(0, 122, 255, 0.02) 50%,
				rgba(0, 122, 255, 0.05) 100%);
		pointer-events: none;
		border-radius: 50rpx;
	}
}

.action-buttons {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 28rpx;
	position: relative;
	z-index: 1;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* clickable wrapper - visual provided by .icon-bg */
	width: auto;
	height: auto;
	background: transparent;
	border-radius: 12rpx;
	color: #fff;
	box-shadow: none;
	transition: transform 0.24s ease, opacity 0.24s ease;
	position: relative;
	overflow: visible;
	border: none;
	padding: 12rpx;
}

.icon-bg {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #6a5af9, #8e61ff);
	box-shadow: 0 12rpx 32rpx rgba(106, 90, 249, 0.28);
	transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.action-btn:hover .icon-bg {
	transform: translateY(-4rpx);
	box-shadow: 0 18rpx 40rpx rgba(106, 90, 249, 0.32);
}

.action-btn:active .icon-bg {
	transform: translateY(0) scale(0.96);
	box-shadow: 0 8rpx 20rpx rgba(106, 90, 249, 0.2);
}

.action-btn:active {
	transform: scale(0.92) translateY(4rpx);
	box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.5);
}

.btn-text {
	font-size: 22rpx;
	color: #fff;
	margin-top: 12rpx;
	font-weight: 600;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.action-btn::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	transform: scale(0);
	opacity: 0;
	transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
}

.action-btn:active::before {
	transform: scale(4);
	opacity: 1;
}

/* 状态样式 */
.loading-state,
.error-state {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
}

.loading-state .progress-content {
	text-align: center;
	padding: 60rpx 40rpx;
	background: linear-gradient(135deg,
			rgba(255, 255, 255, 0.2),
			rgba(255, 255, 255, 0.15));
	border-radius: 28rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 2rpx solid rgba(255, 255, 255, 0.4);
}

.progress-icon {
	margin-bottom: 32rpx;
	animation: pulse 2s infinite;
}

.progress-text {
	font-size: 36rpx;
	font-weight: 700;
	background: linear-gradient(135deg, #007AFF, #0056CC);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 20rpx;
}

.progress-tip {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
	font-weight: 500;
	line-height: 1.4;
}

.error-icon {
	animation: pulse 2s infinite;
}

.error-text {
	color: #ff4757;
	font-size: 28rpx;
	text-align: center;
}

@keyframes pulse {
	0% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.1);
	}

	100% {
		transform: scale(1);
	}
}

/* 兼容性样式 */
.custom-view {
	padding: 24rpx;
	color: #333;
	font-size: 30rpx;
	line-height: 1.7;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 12rpx;
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
}

/* 响应式适配 */
@media screen and (max-width: 400rpx) {
	.main-content {
		padding: 16rpx;
		gap: 16rpx;
	}

	.sidebar-thumbnails {
		width: 120rpx;
	}

	.thumbnail-scroll {
		padding: 16rpx;
	}

	.output-section,
	.params-section {
		padding: 20rpx;
	}

	.action-btn {
		width: 140rpx;
		height: 140rpx;
	}

	.btn-text {
		font-size: 20rpx;
	}
}

/* 动画增强 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-30rpx);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.thumbnail-item {
	animation: slideInLeft 0.6s ease forwards;
}

.param-item {
	animation: fadeIn 0.8s ease forwards;
}

.param-item:nth-child(even) {
	animation-delay: 0.1s;
}

.param-item:nth-child(odd) {
	animation-delay: 0.2s;
}

.to {
	opacity: 1;
	transform: translateX(0);
}
</style>