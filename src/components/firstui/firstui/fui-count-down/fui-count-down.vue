<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  1 127，营业执照号： 91  44 0605M   A55   6     H1KX  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-count__down-wrap">
		<text class="fui-count__down-item"
			:style="{ background: background, borderColor: borderColor, width: getWidth(d, width) + 'rpx', height: height + 'rpx',fontSize: size + 'rpx', color: color }"
			v-if="isDays">{{ d }}</text>
		<text class="fui-count__down-colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isDays">{{ isColon ? ':' : unitEn?'d':'天' }}</text>
		<text class="fui-count__down-item"
			:style="{ background: background, borderColor: borderColor, width: getWidth(h, width) + 'rpx', height: height + 'rpx',fontSize: size + 'rpx', color: color }"
			v-if="isHours">{{ h }}</text>
		<text class="fui-count__down-colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isHours">{{ isColon ? ':' :  unitEn?'h':'时' }}</text>
		<text class="fui-count__down-item"
			:style="{ background: background, borderColor: borderColor, width: getWidth(i, width) + 'rpx', height: height + 'rpx',fontSize: size + 'rpx', color: color }"
			v-if="isMinutes">{{ i }}</text>
		<text class="fui-count__down-colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isMinutes">{{ isColon ? ':' : unitEn?'m':'分' }}</text>
		<text class="fui-count__down-item"
			:style="{ background: background, borderColor: borderColor, width: getWidth(s, width) + 'rpx', height: height + 'rpx',fontSize: size + 'rpx', color: color }"
			v-if="isSeconds">{{ s }}</text>
		<text class="fui-count__down-colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isSeconds && !isColon">{{ unitEn ? 's' : '秒' }}</text>
		<text class="fui-count__down-colon"
			:style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }"
			v-if="isSeconds && isMs && isColon">.</text>
		<view class="fui-count__down-ms" :style="{
				background: background,
				borderColor: borderColor,
				height: height + 'rpx',
				width: msWidth > 0 ? msWidth + 'rpx' : 'auto'
			}" v-if="isSeconds && isMs">
			<view :class="{ 'fui-count__down-ms_list': ani }" ref="fui_countdown_ms">
				<text class="fui-count__down-ms_item"
					:style="{ height: height + 'rpx',lineHeight:height + 'rpx',fontSize: msSize + 'rpx',color: msColor || color }"
					v-for="(item, index) in ms" :key="index">{{item}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: 'fui-count-down',
		emits: ['end', 'time'],
		props: {
			width: {
				type: [Number, String],
				default: 40
			},
			height: {
				type: [Number, String],
				default: 40
			},
			borderColor: {
				type: String,
				default: '#333'
			},
			background: {
				type: String,
				default: '#fff'
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: '#333'
			},
			colonSize: {
				type: [Number, String],
				default: 28
			},
			colonColor: {
				type: String,
				default: '#333'
			},
			value: {
				type: [Number, String],
				default: 0
			},
			//是否包含天
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
			unitEn: {
				type: Boolean,
				default: false
			},
			isMs: {
				type: Boolean,
				default: false
			},
			msWidth: {
				type: [Number, String],
				default: 36
			},
			msSize: {
				type: [Number, String],
				default: 24
			},
			msColor: {
				type: String,
				default: ''
			},
			isColon: {
				type: Boolean,
				default: true
			},
			returnTime: {
				type: Boolean,
				default: false
			},
			autoStart: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			value(val) {
				this.clearTimer();
				this.time = Number(val) || 0;
				this.countDown(this.time);
				if (this.returnTime) {
					this.$emit('time', {
						seconds: this.time
					});
				}
				setTimeout(() => {
					if (this.autoStart) {
						this.startCountdown();
					}
				}, 0);
			}
		},
		data() {
			return {
				countdown: null,
				d: '0',
				h: '00',
				i: '00',
				s: '00',
				ms: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				ani: false,
				percent: 0,
				time: 0
			};
		},
		mounted() {
			this.clearTimer();
			this.time = Number(this.value) || 0;
			this.countDown(this.time);
			//注意：如果初始化值确实为0，可在页面自行判断结束或手动调用结束方法
			if (this.time > 0 && this.autoStart) {
				if (this.returnTime) {
					this.$emit('time', {
						seconds: this.time
					});
				}
				this.startCountdown();
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
		methods: {
			// #ifdef APP-NVUE
			_animation() {
				if (!this.$refs['fui_countdown_ms'] || !this.isMs || !this.ani) return;
				animation.transition(
					this.$refs['fui_countdown_ms'].ref, {
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
				if (!this.$refs['fui_countdown_ms'] || !this.isMs) return;
				animation.transition(
					this.$refs['fui_countdown_ms'].ref, {
						styles: {
							transform: 'translateY(0)'
						},
						duration: 0,
						needLayout: false,
						delay: 0
					});
			},
			// #endif
			getWidth: function(num, width) {
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
				clearInterval(this.countdown);
				this.countdown = null;
			},
			endCountdown(isSuspend = false) {
				this.clearTimer();
				if (!isSuspend) {
					this.$emit('end', {});
				}
			},
			startCountdown: function() {
				this.clearTimer();
				//初始化值为0时不会执行此方法，请看mounted中判断与提示
				if (this.time <= 0) {
					this.endCountdown();
					return;
				}
				this.ani = true;
				// #ifdef APP-NVUE
				this._animation()
				// #endif
				this.countdown = setInterval(() => {
					this.time--;
					this.countDown(this.time);
					if (this.returnTime) {
						this.$emit('time', {
							seconds: this.time
						});
					}
					if (this.time <= 0) {
						this.endCountdown();
						return;
					}
				}, 1000);
			},
			resetCountdown(seconds = 0) {
				this.time = seconds || Number(this.value);
				this.clearTimer();
				this.countDown(this.time);
				if (this.returnTime) {
					this.$emit('time', {
						seconds: this.time
					});
				}
				if (this.autoStart) {
					this.startCountdown();
				}
			},
			countDown(seconds) {
				let [day, hour, minute, second] = [0, 0, 0, 0];
				if (seconds > 0) {
					day = this.isDays ? Math.floor(seconds / (60 * 60 * 24)) : 0;
					hour = this.isHours ? Math.floor(seconds / (60 * 60)) - day * 24 : 0;
					minute = this.isMinutes ? Math.floor(seconds / 60) - hour * 60 - day * 24 * 60 : 0;
					second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
				}
				hour = hour < 10 ? '0' + hour : hour;
				minute = minute < 10 ? '0' + minute : minute;
				second = second < 10 ? '0' + second : second;
				this.d = day;
				this.h = hour;
				this.i = minute;
				this.s = second;
			}
		}
	};
</script>

<style scoped>
	.fui-count__down-wrap {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.fui-count__down-item {
		/* #ifndef APP-NVUE */
		display: flex;
		white-space: nowrap;
		/* #endif */
		align-items: center;
		justify-content: center;
		border-radius: 6rpx;
		border-width: 1rpx;
		border-style: solid;
		text-align: center;
	}

	.fui-count__down-colon {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.fui-count__down-ms {
		overflow: hidden;
		border-radius: 6rpx;
		border-width: 1rpx;
		border-style: solid;
	}

	/* #ifndef APP-NVUE */
	.fui-count__down-ms_list {
		animation: loop 1s steps(10) infinite;
	}

	@keyframes loop {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-100%);
		}
	}

	/* #endif */

	.fui-count__down-ms_item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>