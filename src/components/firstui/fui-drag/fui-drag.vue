<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号：   9  14 4 060 5  M  A  556 H1 K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<!-- #ifndef APP-VUE || MP-WEIXIN || H5  -->
	<view class="fui-drag__wrap" ref="fui_drag" :id="elId"
		:style="{width:wrapWidth+'px',height:(rows * cellHeight)+'px'}"
		:class="[dragging?'fui-drag-item__show':'fui-drag-item__hidden']">
	<!-- #endif -->
		<!-- #ifdef APP-VUE || MP-WEIXIN || H5 -->
		<!-- vue3下编译到小程序data数据与wxs混用中无法获取 $data数据无法直接应用到页面，uni-app官方编译bug-->
		<view class="fui-drag__wrap" :catch:touchmove="wxDrag?true:''"
			:class="[dragging?'fui-drag-item__show':'fui-drag-item__hidden']" ref="fui_drag" :id="elId"
			:style="{width:wrapWidth+'px',height:(rows * cellHeight)+'px'}" :list="list"
			:change:list="handler.listChange" :param="param" :change:param="handler.paramChange">
			<view class="fui-drag-item__wrap" :style="{width:cellWidth+'px',height:cellHeight+'px'}"
				v-for="(item, index) in list" :key="item.id" :data-index="index" @longpress="handler.longPress"
				:data-param="param" :data-isdrag="isDrag && dragging?1:0" :data-app="isApp" @touchstart="handler.touchStart"
				@touchmove="handler.touchMove" @touchend="handler.touchEnd" @mousedown="handler.mousedown"
				@tap="itemClick(index)">
				<template v-if="custom">
					<slot :model="item.entity" :width="cellWidth" :height="cellHeight" :index="index"></slot>
				</template>
				<template v-else>
					<f-drag-item @delete="deleteItem" :src="(item.entity && item.entity[srcKey]) || 'true'"
						:text="item.entity && item.entity[textKey]" :width="cellWidth" :height="cellHeight" :isMenu="isMenu"
						:styles="styles" :index="index">
					</f-drag-item>
				</template>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view fireEventSync="true" class="fui-drag-item__wrap" v-for="(item, index) in list" :key="item.id"
				:style="{width:cellWidth+'px',height:cellHeight+'px'}" @touchstart="touchstart" @touchmove="touchmove"
				@touchend="touchend" @longpress="longPress" :data-index="index" :ref="'f_drag_'+index">
				<template v-if="custom">
					<slot :model="item.entity" :width="cellWidth" :height="cellHeight" :index="index"></slot>
				</template>
				<template v-else>
					<f-drag-item @delete="deleteItem" :src="item.entity && item.entity[srcKey]"
						:text="item.entity && item.entity[textKey]" :width="cellWidth" :height="cellHeight" :isMenu="isMenu"
						:styles="styles" :index="index">
					</f-drag-item>
				</template>
			</view>
			<!-- #endif -->

			<!-- #ifndef APP-PLUS || MP-WEIXIN || H5-->
			<view class="fui-drag-item__wrap"
				:class="{'fui-drag__cur':current===index,'fui-drag__trans':current!==index}"
				v-for="(item, index) in list" :key="item.id"
				:style="{width:cellWidth+'px',height:cellHeight+'px',transform: `translate3d(${index === current ? transX : item.transX}, ${index === current ? transY: item.transY}, 0px)`}"
				@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend" @longpress="longPress"
				:data-index="index">
				<template v-if="custom">
					<slot :model="item.entity" :width="cellWidth" :height="cellHeight" :index="index"></slot>
				</template>
				<template v-else>
					<f-drag-item @delete="deleteItem" :src="(item.entity && item.entity[srcKey]) || ''"
						:text="item.entity && item.entity[textKey]" :width="cellWidth" :height="cellHeight" :styles="styles"
						:isMenu="isMenu" :index="index">
					</f-drag-item>
				</template>
			</view>
			<!-- #endif -->
		</view>
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || H5-->
<script src="./index.wxs" module="handler" lang="wxs"></script>
<!-- #endif -->

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	import fDragItem from './f-drag-item.vue'
	import bindingx from './bindingx.js'
	import mpjs from './mpjs.js'
	export default {
		name: "fui-drag",
		mixins: [mpjs, bindingx],
		emits: ['change', 'end', 'click', 'delete'],
		components: {
			fDragItem
		},
		props: {
			itemList: {
				type: Array,
				default () {
					return [];
				}
			},
			textKey: {
				type: String,
				default: 'text'
			},
			srcKey: {
				type: String,
				default: 'src'
			},
			width: {
				type: [Number, String],
				default: 0
			},
			// 每行显示个数
			columns: {
				type: [Number, String],
				default: 1
			},
			//必传（square为true时失效）
			itemHeight: {
				type: [Number, String],
				default: 0
			},
			// 是否正方形显示，为true时itemHeight失效
			square: {
				type: Boolean,
				default: false
			},
			styles: {
				type: Object,
				default () {
					return {}
				}
			},
			isMenu: {
				type: Boolean,
				default: true
			},
			// 页面滚动高度
			scrollTop: {
				type: Number,
				default: 0
			},
			//是否可拖拽
			isDrag: {
				type: Boolean,
				default: true
			},
			custom: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			itemList(val) {
				this.list = []
				setTimeout(() => {
					this.reset()
				}, 0);
			},
			width(val) {
				this.list = []
				setTimeout(() => {
					this.reset()
				}, 0);
			},
			columns(val) {
				this.list = []
				setTimeout(() => {
					this.reset()
				}, 0);
			}
		},
		data() {
			const elId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			let isApp = 0;
			// #ifdef APP
			isApp = 1;
			// #endif
			return {
				isApp,
				elId,
				// #ifdef APP-VUE || MP-WEIXIN || H5
				param: {},
				// #endif
				windowHeight: 0,
				wrapWidth: 0,
				wrapHeight: 0,
				cellWidth: 0,
				cellHeight: 0,
				changeList: [],
				rows: 3,
				options: [],
				dragging: true,
				wrapTop: 0,
				wrapLeft: 0,
				list: [],
				wxDrag: true
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.reset();
			})
		},
		methods: {
			getId() {
				return `${Math.ceil(Math.random() * 10e5).toString(36)}_${new Date().getTime()}`
			},
			getWidth(fn) {
				let width = Number(this.width)
				let sys = uni.getSystemInfoSync()
				this.windowHeight = sys.windowHeight;
				if (width === 0) {
					width = sys.windowWidth
				} else {
					width = uni.upx2px(width)
				}
				this.wrapWidth = width
				//此处小数会导致出现误差
				this.cellWidth = width / Number(this.columns)
				let cellHeight = uni.upx2px(this.itemHeight)
				if (this.square) {
					cellHeight = this.cellWidth
				}
				this.cellHeight = cellHeight
				fn && fn()
			},
			reset() {
				this.options = []
				// #ifndef APP-NVUE
				this.wxDrag = true;
				this.dragging = false
				// #endif
				this.getWidth(() => {
					setTimeout(() => {
						this.init()
					}, 0);
				})
			},
			getDom(callback, index = 0) {
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select(`#${this.elId}`)
					.boundingClientRect()
					.exec(ret => {
						if (index >= 10) return
						if (!ret && !ret[0]) {
							index++
							this.getDom(callback, index)
							return
						}
						let wrapTop = ret[0].top + this.scrollTop;
						let wrapLeft = ret[0].left
						callback && callback(wrapTop, wrapLeft)
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['fui_drag'], (ret) => {
					if (ret && ret.size) {
						let wrapTop = ret.size.top + this.scrollTop;
						let wrapLeft = ret.size.left
						callback && callback(wrapTop, wrapLeft)
					}
				})
				// #endif
			},
			init(index = 0) {
				let options = JSON.parse(JSON.stringify(this.itemList));
				let columns = Number(this.columns)
				this.rows = Math.ceil(options.length / this.columns);
				if (options.length === 0) return;
				setTimeout(() => {
					this.getDom((wrapTop, wrapLeft) => {
						let list = options.map((item, index) => {
							return {
								id: this.getId(),
								realKey: index,
								sortKey: index,
								//若有误差，cellWidth、cellHeight取整
								transX: `${index%columns * this.cellWidth}px`,
								transY: `${Math.floor(index/columns) * this.cellHeight}px`,
								entity: item
							}
						});
						this.changeList = list;
						this.list = list
						this.wrapTop = wrapTop;
						this.wrapLeft = wrapLeft;
						// #ifdef APP-VUE || MP-WEIXIN || H5
						this.param = {
							windowHeight: this.windowHeight,
							columns: Number(this.columns),
							rows: this.rows,
							cellWidth: this.cellWidth,
							cellHeight: this.cellHeight,
							wrapLeft: this.wrapLeft,
							wrapTop: this.wrapTop
						};
						// #endif
						this.dragging = true
					})
				}, 500)
			},
			drag(e) {
				this.wxDrag = e.wxdrag;
			},
			sortend(e) {
				this.$emit('end', {
					itemList: e.itemList
				});
			},
			change(e) {
				this.$emit('change', {
					itemList: e.itemList
				});
			},
			itemClick(index) {
				if (!this.changeList || this.changeList.length === 0) return;
				let item = this.changeList[index];
				this.$emit('click', {
					index: item.realKey,
					item: item.entity
				});
			},
			deleteItem(e) {
				this.$emit('delete', {
					index: e.index
				});
			},
			listChange(e) {
				this.changeList = e.itemList;
			},
			pageScroll(e) {
				// #ifndef APP-NVUE
				uni.pageScrollTo({
					scrollTop: e.scrollTop,
					duration: 0
				});
				// #endif
			}
		}
	}
</script>

<style scoped>
	.fui-drag__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		transform: translate3d(0, 0, 0);
		/* #endif */
		position: relative;
	}

	.fui-drag-item__wrap {
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		/* #ifdef H5 */
		cursor: grab;
		/* #endif */
	}

	.fui-drag-item__hidden {
		opacity: 0;
		transition-property: opacity;
		transition-duration: .35s;
	}

	.fui-drag-item__show {
		opacity: 1 !important;
	}

	.fui-drag__trans {
		transition-property: transform;
		transition-duration: .35s;
	}

	.fui-drag__trans-end {
		transition-property: transform;
		transition-duration: .35s;
	}

	.fui-drag__cur {
		z-index: 5 !important;
	}
</style>