<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  11 27，营业执照号：91  44 06 05M A5    5 6H 1 K  X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-progress__wrap">
		<view class="fui-progress__bar-bg"
			:style="{ height: height + 'rpx', borderRadius: radius+'rpx', background: background }">
			<!-- #ifndef APP-NVUE -->
			<view class="fui-progress__bar" :class="{'fui-progress__active-color':!activeColor}"
				:style="{background: getActiveColor ,transform:`translate3d(-${translateX},0,0)`,transitionDuration:`${time}s`}">
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view ref="fui_pg_ani" class="fui-progress__bar" :style="{background: getActiveColor}"></view>
			<!-- #endif -->
		</view>
		<text class="fui-progress__percent"
			:style="{ width: percentWidth + 'rpx', fontSize: size + 'rpx', color: color }" v-if="showInfo">
			{{ percentage }}%
		</text>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: 'fui-progress',
		emits: ['activeend'],
		props: {
			percent: {
				type: [Number, String],
				default: 0
			},
			height: {
				type: [Number, String],
				default: 8
			},
			// #ifndef APP-NVUE
			radius: {
				type: [Number, String],
				default: 8
			},
			// #endif
			// #ifdef APP-NVUE
			radius: {
				type: [Number, String],
				default: 0
			},
			// #endif
			showInfo: {
				type: Boolean,
				default: false
			},
			//右侧百分比字体大小 rpx
			size: {
				type: [Number, String],
				default: 28
			},
			//右侧百分比颜色
			color: {
				type: String,
				default: '#333'
			},
			//右侧百分比宽度
			percentWidth: {
				type: [Number, String],
				default: 96
			},
			//未选择的进度条的颜色
			background: {
				type: String,
				default: '#CCCCCC'
			},
			//已选进度条颜色,可渐变
			activeColor: {
				type: String,
				default: ''
			},
			//进度增加1%所需毫秒数
			duration: {
				type: [Number, String],
				default: 15
			}
		},
		watch: {
			percent(val) {
				this.darwProgress();
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.darwProgress();
			})
		},
		computed: {
			getActiveColor() {
				let color = this.activeColor;
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color;
			}
		},
		data() {
			return {
				percentage: 0,
				translateX: '-100%',
				time: 0
			};
		},
		methods: {
			// #ifdef APP-NVUE
			_animation(translateX, duration) {
				if (!this.$refs['fui_pg_ani']) return;
				animation.transition(
					this.$refs['fui_pg_ani'].ref, {
						styles: {
							transform: `translateX(-${translateX})`
						},
						duration: duration * 1000,
						timingFunction: 'linear',
						needLayout: false,
						delay: 0 //ms
					},
					() => {
						this.$emit('activeend', {});
					}
				);
			},
			// #endif
			darwProgress() {
				let percent = Number(this.percent);
				percent = percent > 100 ? 100 : percent;
				this.time = Number(this.duration) * Math.abs(percent - this.percentage) / 1000
				if (percent < this.percentage && (this.percentage - percent) > 30) {
					//后百分比数大于30时 时间缩短
					this.time = this.time / 2
				}
				this.percentage = percent;
				this.translateX = (100 - percent) + '%';

				// #ifndef APP-NVUE
				setTimeout(() => {
					this.$emit('activeend', {});
				}, this.time)
				// #endif

				// #ifdef APP-NVUE
				this._animation(this.translateX, this.time)
				// #endif
			}
		}
	};
</script>

<style scoped>
	.fui-progress__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	/* nvue android 端 overflow: hidden 无效，目前uni-app官方尚未修复此问题*/
	.fui-progress__bar-bg {
		/* #ifndef APP-NVUE */
		width: 100%;
		transform: translateZ(0);
		/* #endif */
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.fui-progress__bar {
		/* #ifndef APP-NVUE */
		width: 100%;
		z-index: 2;
		/* #endif */
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transform: translate3d(-100%, 0, 0);
		transition-delay: 0s;
		transition-property: transform;
		transition-timing-function: linear;
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: translateX(-100%);
		/* #endif */
		transition-duration: 0s;
	}

	.fui-progress__percent {
		text-align: center;
		/* #ifndef APP-NVUE */
		display: block;
		flex-shrink: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-progress__active-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */
</style>