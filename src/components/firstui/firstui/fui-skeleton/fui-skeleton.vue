<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11 2 7，营业执照号： 914 40  605MA  55 6    H   1K  X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-skeleton__wrap" :style="{background:background,height:height+'px'}" ref="fui_skeleton">
		<view class="fui-skeleton__item"
			:class="{'fui-skeleton__dark':theme==='dark','fui-skeleton__dark-ani':active && theme==='dark','fui-skeleton__light-ani':active && theme!=='dark'}"
			:style="{width: item.width+'px', height:item.height+'px', left: item.left+'px', top: (item.top-top)+'px',borderRadius:item.type==='round'?(isNvue?item.width/2+'px':'50%'):'6rpx'}"
			v-for="(item,index) in elList" :key="index">
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: "fui-skeleton",
		emits: ['change'],
		props: {
			//外层元素class值
			outerClass: {
				type: String,
				default: "fui-skeleton"
			},
			//需要在骨架元素添加以下class值，也可传入自定义class值
			//需要做骨架的元素class值，包含round表示处理成圆形，其他为矩形
			selector: {
				type: Array,
				default () {
					return ['fui-round', 'fui-rect']
				}
			},
			//骨架屏背景色
			background: {
				type: String,
				default: "transparent"
			},
			//骨架屏预载数据，如果传入数据则不动态获取节点信息
			preloadList: {
				type: Array,
				default () {
					return []
				}
			},
			//是否展示动画效果
			active: {
				type: Boolean,
				default: true
			},
			//light、dark
			theme: {
				type: String,
				default: 'light'
			},
			//v2.1.0+ 组件初始化完成后是否立即显示骨架【仅在页面使用及component为false时有效】
			immediate: {
				type: Boolean,
				default: true
			},
			//v2.1.0+ 是否在自定义组件内使用，需要调用方法显示骨架
			component: {
				type: Boolean,
				default: false
			}
		},
		data() {
			let isNvue = false
			// #ifdef APP-NVUE
			isNvue = true
			// #endif
			return {
				isNvue: isNvue,
				stop: false,
				//round、rect
				elList: [],
				height: 0,
				top: 0
			};
		},
		created() {
			const res = uni.getSystemInfoSync();
			this.height = res.windowHeight;
			if (this.preloadList && this.preloadList.length > 0) {
				this.elList = this.preloadList
			}
		},
		mounted() {
			this.$nextTick(() => {
				if (this.immediate && !this.component) {
					//页面使用无需传
					this.shown()
				}
			})
		},
		// #ifdef APP-NVUE
		// #ifndef VUE3
		beforeDestroy() {
			this.stop = true;
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.stop = true;
		},
		// #endif
		// #endif
		methods: {
			shown(instance) {
				// #ifndef APP-NVUE
				this.nodesRef(this.outerClass, instance).then((res) => {
					if (res && res[0]) {
						this.height = res[0].height
						this.top = this.component ? res[0].top : 0
					}
				});
				if (!this.preloadList || this.preloadList.length === 0) {
					this.selectorQuery(instance)
				}
				// #endif
				// #ifdef APP-NVUE
				setTimeout(() => {
					this._animation(false)
				}, 50)
				// #endif
			},
			// #ifdef APP-NVUE
			_animation(type) {
				if (!this.$refs['fui_skeleton'] || this.stop || !this.active) return;
				animation.transition(
					this.$refs['fui_skeleton'].ref, {
						styles: {
							opacity: type ? 1 : 0.1
						},
						duration: 1000, //ms
						timingFunction: 'linear',
						iterationCount: 'infinite',
						needLayout: false,
						delay: 0 //ms
					}, () => {
						this._animation(!type)
					}
				);
			},
			// #endif
			// #ifndef APP-NVUE
			//nvue端暂不支持动态获取节点信息
			async selectorQuery(instance) {
				let selector = this.selector || []
				let nodes = []
				for (let item of selector) {
					await this.nodesRef(item, instance).then((res) => {
						res.map(d => {
							d.type = item.indexOf('round') === -1 ? 'rect' : 'round';
						})
						nodes = nodes.concat(res)
					})
				}
				this.elList = nodes
				this.$emit('change', {
					nodes: nodes
				})
			},
			async nodesRef(name, instance) {
				return await new Promise((resolve, reject) => {
					if (this.component) {
						uni.createSelectorQuery()
							// #ifndef MP-ALIPAY
							.in(instance)
							// #endif
							.selectAll(`.${name}`)
							.boundingClientRect((res) => {
								if (res) {
									resolve(res);
								} else {
									reject(res)
								}
							}).exec();
					} else {
						uni.createSelectorQuery()
							.selectAll(`.${name}`)
							.boundingClientRect((res) => {
								if (res) {
									resolve(res);
								} else {
									reject(res)
								}
							}).exec();
					}
				})
			}
			// #endif
		}
	}
</script>

<style scoped>
	.fui-skeleton__wrap {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		width: 100%;
		z-index: 900;
		/* #endif */
	}

	.fui-skeleton__item {
		position: absolute;
		background: #eee;
	}

	.fui-skeleton__dark {
		background: #333;
	}

	/* #ifndef APP-NVUE */
	.fui-skeleton__light-ani {
		background: linear-gradient(90deg, #eee 25%, #e6e6e6 37%, #eee 63%);
		animation: ani 1.4s ease infinite;
		background-size: 400% 100%;
	}

	.fui-skeleton__dark-ani {
		background: linear-gradient(90deg, #333 25%, #555 37%, #333 63%);
		animation: ani 1.4s ease infinite;
		background-size: 400% 100%;
	}

	@keyframes ani {
		0% {
			background-position: 100% 50%
		}

		100% {
			background-position: 0 50%
		}
	}

	/* #endif */
</style>