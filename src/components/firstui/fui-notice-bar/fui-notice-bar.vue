<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：   1127，营业执照号：9  1  44 0  60 5 M A  556H1 K   X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-notice__bar"
		:style="{background:background,paddingTop:padding[0] || 0,paddingRight:padding[1]||0,paddingBottom:padding[2] || padding[0]||0,paddingLeft:padding[3] || padding[1]||0,height:scrollable || single?height+'rpx':'auto'}"
		@click="onClick">
		<view class="fui-notice__shrink" @tap.stop="leftClick">
			<slot></slot>
		</view>
		<view class="fui-notice__wrap" :class="{'fui-notice__wrap-scroll':scrollable}"
			:style="{height:scrollable&& !isNvue?getHeight:'auto'}" ref="fui_notice_box">
			<view :id="elId_box"
				:class="{'fui-notice__content':scrollable,'fui-notice__content-single':!scrollable && single}">
				<text ref="animationEle" class="fui-notice__text" :id="elId"
					:style="{color:getColor,fontSize:size+'rpx',lineHeight:scrollable && !isNvue?getHeight:'normal',fontWeight:bold?'bold':'normal',width:wrapWidth+'px', 'animationDuration': animationDuration,'-webkit-animationDuration': animationDuration,animationPlayState: webviewHide?'paused':animationPlayState,'-webkit-animationPlayState':webviewHide?'paused':animationPlayState, animationDelay: animationDelay, '-webkit-animationDelay':animationDelay}"
					:class="{'fui-notice__single':!scrollable && single,'fui-notice__scrollable':scrollable,'fui-notice__text-color':!color && !isNvue}">{{content}}</text>
			</view>
		</view>
		<view class="fui-notice__shrink" @tap.stop="rightClick">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	const animation = weex.requireModule('animation');
	// #endif
	export default {
		name: "fui-notice-bar",
		emits: ['click', 'leftClick', 'rightClick'],
		props: {
			height: {
				type: [Number, String],
				default: 72
			},
			content: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: ''
			},
			bold: {
				type: Boolean,
				default: false
			},
			background: {
				type: String,
				default: 'rgba(255, 43, 43, .05)'
			},
			padding: {
				type: Array,
				default () {
					return []
				}
			},
			single: {
				type: Boolean,
				default: false
			},
			scrollable: {
				type: Boolean,
				default: false
			},
			speed: {
				type: [Number, String],
				default: 100
			},
			activeMode: {
				type: String,
				default: 'backwards'
			},
			param: {
				type: [Number, String],
				default: 0
			}
		},
		computed: {
			getColor() {
				let color = this.color;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.danger) || '#FF2B2B';
				}
				// #endif
				return color;
			},
			getHeight() {
				return `${Math.min(Number(this.height),Number(this.size)*2)}rpx`
			}
		},
		data() {
			const elId = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			const elId_box = `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				elId: elId,
				elId_box: elId_box,
				noticeWidth: 0,
				boxWidth: 0,
				wrapWidth: '',
				webviewHide: false,
				// #ifdef APP-NVUE
				stopAnimation: false,
				// #endif
				isNvue: isNvue,
				animationDuration: 'none',
				animationPlayState: 'paused',
				animationDelay: '0s'
			};
		},
		mounted() {
			// #ifdef APP-PLUS
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			let currentWebview = page.$getAppWebview();
			currentWebview.addEventListener('hide', () => {
				this.webviewHide = true
			})
			currentWebview.addEventListener('show', () => {
				this.webviewHide = false
			})
			// #endif
			this.$nextTick(() => {
				setTimeout(() => {
					this.initAnimation()
				}, 10)
			})
		},
		watch: {
			scrollable(val) {
				if (val) {
					this.$nextTick(() => {
						this.initAnimation()
					})
				}
			},
			content(val) {
				this.$nextTick(() => {
					this.initAnimation()
				})
			}
		},
		//APP-NVUE
		// #ifdef APP-NVUE
		// #ifndef VUE3
		beforeDestroy() {
			this.stopAnimation = true
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.stopAnimation = true
		},
		// #endif
		// #endif
		methods: {
			initAnimation() {
				if (!this.content || this.content == '') return;
				if (this.scrollable) {
					// #ifndef APP-NVUE
					let query = [],
						boxWidth = 0,
						noticeWidth = 0;
					let noticeQuery = new Promise((resolve, reject) => {
						uni.createSelectorQuery()
							// #ifndef MP-ALIPAY
							.in(this)
							// #endif
							.select(`#${this.elId}`)
							.boundingClientRect()
							.exec(ret => {
								this.noticeWidth = ret[0].width
								resolve()
							})
					})
					if (this.activeMode === 'forwards') {
						let boxQuery = new Promise((resolve, reject) => {
							uni.createSelectorQuery()
								// #ifndef MP-ALIPAY
								.in(this)
								// #endif
								.select(`#${this.elId_box}`)
								.boundingClientRect()
								.exec(ret => {
									this.boxWidth = ret[0].width
									resolve()
								})
						})
						query.push(boxQuery)
					}
					query.push(noticeQuery)
					Promise.all(query).then(() => {
						this.animationDuration = `${this.noticeWidth / Number(this.speed)}s`
						if (this.activeMode === 'forwards') {
							this.animationDelay = `-${this.boxWidth / Number(this.speed)}s`
						}
						setTimeout(() => {
							this.animationPlayState = 'running'
						}, 1000)
					})
					// #endif
					// #ifdef APP-NVUE
					dom.getComponentRect(this.$refs['animationEle'], (res) => {
						let winWidth = uni.getSystemInfoSync().windowWidth
						this.noticeWidth = res.size.width
						animation.transition(this.$refs['animationEle'], {
							styles: {
								transform: this.activeMode === 'backwards' ? `translateX(0)` :
									`translateX(-${winWidth}px)`
							},
							duration: 0,
							timingFunction: 'linear',
							delay: 0
						}, () => {
							if (!this.stopAnimation) {
								animation.transition(this.$refs['animationEle'], {
									styles: {
										transform: `translateX(-${this.noticeWidth}px)`
									},
									timingFunction: 'linear',
									duration: (this.noticeWidth - winWidth) / Number(this.speed) *
										1000,
									delay: 1000
								}, () => {
									if (!this.stopAnimation) {
										this.loopAnimation()
									}
								});
							}
						});
					})
					// #endif
				}
				// #ifdef APP-NVUE
				if (!this.scrollable && this.single) {
					dom.getComponentRect(this.$refs['fui_notice_box'], (res) => {
						this.wrapWidth = res.size.width
					})
				}
				// #endif
			},
			loopAnimation() {
				// #ifdef APP-NVUE
				animation.transition(this.$refs['animationEle'], {
					styles: {
						transform: `translateX(0)`
					},
					duration: 0
				}, () => {
					if (!this.stopAnimation) {
						animation.transition(this.$refs['animationEle'], {
							styles: {
								transform: `translateX(-${this.noticeWidth}px)`
							},
							duration: this.noticeWidth / Number(this.speed) * 1000,
							timingFunction: 'linear',
							delay: 0
						}, () => {
							if (!this.stopAnimation) {
								this.loopAnimation()
							}
						});
					}
				});
				// #endif
			},
			onClick() {
				this.$emit('click', {
					param: this.param
				})
			},
			leftClick() {
				this.$emit('leftClick', {
					param: this.param
				})
			},
			rightClick() {
				this.$emit('rightClick', {
					param: this.param
				})
			}
		}
	}
</script>

<style scoped>
	.fui-notice__bar {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-notice__shrink {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		/* #endif */

		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-notice__wrap {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.fui-notice__wrap-scroll {
		flex-direction: row;
	}

	/* #ifndef APP-NVUE */
	.fui-notice__wrap-scroll {
		position: relative;
	}

	/* #endif */

	.fui-notice__content {
		/* #ifdef APP-NVUE */
		flex: 0;
		/* #endif */
		/* #ifndef APP-NVUE */
		flex: 1;
		display: block;
		overflow: hidden;
		/* #endif */

	}

	.fui-notice__text {
		/* #ifndef APP-NVUE */
		word-break: break-all;
		/* #endif */
	}

	.fui-notice__content-single {
		/* #ifndef APP-NVUE */
		display: flex;
		flex: none;
		width: 100%;
		justify-content: center;
		/* #endif */
	}

	.fui-notice__single {
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: block;
		width: 100%;
		white-space: nowrap;
		/* #endif */
		flex-direction: row;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fui-notice__scrollable {
		/* #ifdef APP-NVUE */
		lines: 1;
		padding-left: 750rpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		position: absolute;
		display: block;
		white-space: nowrap;
		padding-left: 101%;
		animation: notice_ani 10s 0s linear infinite both;
		animation-play-state: paused;
		-webkit-backface-visibility: hidden;
		-webkit-perspective: 1000;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	@keyframes notice_ani {
		100% {
			transform: translate3d(-100%, 0, 0);
		}
	}

	.fui-notice__text-color {
		color: var(--fui-color-danger, #FF2B2B) !important;
	}

	/* #endif */
</style>