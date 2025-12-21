<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号： 91   4  4  0 60 5MA5 56   H  1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-timer__wrap">
		<text class="fui-timer__item" :style="{
				background: background,
				borderWidth: `${borderWidth}rpx`,
				borderStyle:borderWidth > 0?'solid':'none',
				borderColor:borderWidth > 0?borderColor:'transparent',
				width: background == 'transparent' && borderColor == 'transparent' ? 'auto' : getWidth(d, width) + 'rpx',
				height: height + 'rpx',
				fontSize: size + 'rpx',
				color: color
			}" v-if="isDays">{{ d }}</text>
		<text class="fui-timer__colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isDays">天</text>
		<text class="fui-timer__item" :style="{
				background: background,
				borderWidth: `${borderWidth}rpx`,
				borderStyle:borderWidth > 0?'solid':'',
				borderColor:borderWidth > 0?borderColor:'transparent',
				width: getWidth(h, width) + 'rpx',
				height: height + 'rpx',
				fontSize: size + 'rpx',
				color: color
			}" v-if="isHours">{{ h }}</text>
		<text class="fui-timer__colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isHours">{{ isColon ? ':' : '时' }}</text>
		<text class="fui-timer__item" :style="{
				background: background,
				borderWidth: `${borderWidth}rpx`,
				borderStyle:borderWidth > 0?'solid':'',
				borderColor:borderWidth > 0?borderColor:'transparent',
				width: getWidth(m, width) + 'rpx',
				height: height + 'rpx',
				fontSize: size + 'rpx',
				color: color
			}" v-if="isMinutes">{{ m }}</text>
		<text class="fui-timer__colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isMinutes">{{ isColon ? ':' : '分' }}</text>
		<text class="fui-timer__item" :style="{
				background: background,
				borderWidth: `${borderWidth}rpx`,
				borderStyle:borderWidth > 0?'solid':'',
				borderColor:borderWidth > 0?borderColor:'transparent',
				width: getWidth(s, width) + 'rpx',
				height: height + 'rpx',
				fontSize: size + 'rpx',
				color: color
			}" v-if="isSeconds">{{ s }}</text>
		<text class="fui-timer__colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isSeconds">{{ isColon ? '' : '秒' }}</text>
		<text class="fui-timer__colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isSeconds && isMs">.</text>
		<view class="fui-timer__ms" :style="{
				background: background,
				borderWidth: `${borderWidth}rpx`,
				borderStyle:borderWidth > 0?'solid':'',
				borderColor:borderWidth > 0?borderColor:'transparent',
				height: height + 'rpx',
				width: msWidth > 0 ? msWidth + 'rpx' : 'auto'
			}" v-if="isSeconds && isMs">
			<view :class="{ 'fui-timer__ms-list': ani }" ref="fui_timer_ms">
				<text class="fui-timer__ms-item"
					:style="{ height: height + 'rpx',lineHeight:height + 'rpx',fontSize: msSize + 'rpx', color: msColor || color}"
					v-for="(item, index) in ms" :key="index">{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: 'fui-timer',
		emits: ['end'],
		props: {
			width: {
				type: [Number, String],
				default: 40
			},
			height: {
				type: [Number, String],
				default: 40
			},
			borderWidth: {
				type: [Number, String],
				default: 0
			},
			borderColor: {
				type: String,
				default: 'transparent'
			},
			background: {
				type: String,
				default: 'transparent'
			},
			size: {
				type: [Number, String],
				default: 32
			},
			color: {
				type: String,
				default: '#333'
			},
			colonSize: {
				type: [Number, String],
				default: 32
			},
			colonColor: {
				type: String,
				default: '#333'
			},
			value: {
				type: [Number, String],
				default: 0
			},
			maxTime: {
				type: [Number, String],
				default: 0
			},
			isDays: {
				type: Boolean,
				default: false
			},
			isHours: {
				type: Boolean,
				default: true
			},
			isMinutes: {
				type: Boolean,
				default: true
			},
			isSeconds: {
				type: Boolean,
				default: true
			},
			isMs: {
				type: Boolean,
				default: false
			},
			msWidth: {
				type: [Number, String],
				default: 0
			},
			msSize: {
				type: [Number, String],
				default: 28
			},
			msColor: {
				type: String,
				default: ''
			},
			isColon: {
				type: Boolean,
				default: true
			},
			autoStart: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				d: '0',
				h: '00',
				m: '00',
				s: '00',
				ms: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				seconds: 0,
				loop: null,
				ani: false,
				percent: 0
			};
		},
		mounted() {
			this.seconds = Number(this.value);
			this.timer(this.seconds);
			if (this.autoStart) {
				this.startTiming();
			}
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.clearTimer();
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.clearTimer();
		},
		// #endif
		watch: {
			value(val) {
				this.clearTimer();
				this.seconds = Number(val);
				this.timer(this.seconds);
				setTimeout(() => {
					if (this.autoStart) {
						this.startTiming();
					}
				}, 0);
			}
		},
		methods: {
			// #ifdef APP-NVUE
			_animation() {
				if (!this.$refs['fui_timer_ms'] || !this.isMs || !this.ani) return;
				animation.transition(
					this.$refs['fui_timer_ms'].ref, {
						styles: {
							transform: `translateY(-${this.percent}%)`
						},
						duration: 0, //ms
						timingFunction: 'linear',
						iterationCount: 'infinite',
						needLayout: false,
						delay: 0 //ms
					}, () => {
						if (this.percent >= 90) {
							this.percent = 0
						} else {
							this.percent += 10
						}
						setTimeout(() => {
							this._animation()
						}, 100)
					}
				);
			},
			_aniEnd() {
				if (!this.$refs['fui_timer_ms'] || !this.isMs) return;
				animation.transition(
					this.$refs['fui_timer_ms'].ref, {
						styles: {
							transform: 'translateY(0)'
						},
						duration: 0,
						needLayout: false,
						delay: 0
					});
			},
			// #endif
			getWidth(num, width) {
				num = Number(num)
				let w = Math.ceil(num > 99 ? (width / 2) * num.toString().length : width);
				w = w % 2 === 0 ? w : w + 1
				return w;
			},
			clearTimer() {
				this.ani = false;
				// #ifdef APP-NVUE
				this._aniEnd()
				// #endif
				clearInterval(this.loop);
				this.loop = null;
			},
			//开始
			startTiming() {
				let max = Number(this.maxTime)
				if (this.seconds >= max && max != 0) {
					this.endTimer();
					return
				}
				this.clearTimer();
				this.ani = true;
				// #ifdef APP-NVUE
				this._animation()
				// #endif
				this.loop = setInterval(() => {
					this.seconds++;
					this.timer(this.seconds);
					if (this.seconds >= max && max != 0) {
						this.endTimer();
					}
				}, 1000);
			},
			//重置
			resetTimer() {
				this.d = '0';
				this.h = '00';
				this.m = '00';
				this.s = '00';
				this.seconds = 0;
				this.clearTimer();
			},
			//结束 | 暂停
			endTimer() {
				this.clearTimer();
				this.$emit('end', {
					day: this.d,
					hour: this.h,
					minute: this.m,
					second: this.s,
					totalSeconds: this.seconds
				});
			},
			timer(seconds) {
				let [day, hour, minute, second] = [0, 0, 0, 0];
				if (seconds > 0) {
					day = this.isDays ? Math.floor(seconds / (60 * 60 * 24)) : 0;
					hour = this.isHours ? Math.floor(seconds / (60 * 60)) - day * 24 : 0;
					minute = this.isMinutes ? Math.floor(seconds / 60) - hour * 60 - day * 24 * 60 : 0;
					second = this.isSeconds ? Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60 : 0;
				}
				hour = hour < 10 ? `0${hour}` : hour;
				minute = minute < 10 ? `0${minute}` : minute;
				second = second < 10 ? `0${second}` : second;
				this.d = day;
				this.h = hour;
				this.m = minute;
				this.s = second;
			}
		}
	};
</script>

<style scoped>
	.fui-timer__wrap {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.fui-timer__item,
	.fui-timer__colon {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		border-radius: 6rpx;
		text-align: center;
	}

	.fui-timer__ms {
		border-radius: 6rpx;
		overflow: hidden;
	}

	/* #ifndef APP-NVUE */
	.fui-timer__ms-list {
		animation: ani 1s steps(10) infinite;
	}

	@keyframes ani {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-100%);
		}
	}

	/* #endif */
	.fui-timer__ms-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>