<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1  127，营业执照号：9  1 4   4 06   05M  A5 56 H 1K  XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-charts__pie-wrap">
		<view class="fui-charts__pie-box" :style="{width:diam+'rpx',height:diam+'rpx',backgroundColor:backgroundColor}">
			<view class="fui-charts__pie-inner"
				:style="{width:(radius*2)+'px',height:(radius*2)+'px',background:item.angle>180?item.color:'transparent',zIndex:item.angle>180?10:'auto',clip:item.transformAngle>180?`rect(0, ${radius}px, ${radius*2}px, 0)`:'auto'}"
				v-for="(item,index) in dataset" :key="index" @tap.stop="itemClick(index)">
				<view class="fui-charts__pie-sector"
					:style="{width:radius+'px',height:diam+'rpx',marginLeft:diam/2+'rpx','-webkit-transform': `rotate(${item.transformAngle}deg)`,'transform': `rotate(${item.transformAngle}deg)`,backgroundColor:item.color}">
				</view>
			</view>
			<view class="fui-charts__pie-circle" v-if="ring"
				:style="{width:cDiam+'px',height:cDiam+'px',background:background}">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "fui-charts-pie",
		props: {
			//半径，单位rpx
			radius: {
				type: [Number, String],
				default: 200
			},
			//是否显示为环状
			ring: {
				type: Boolean,
				default: false
			},
			//中心圆半径，仅ring为true时生效，单位rpx
			centerRadius: {
				type: [Number, String],
				default: 120
			},
			//中心圆背景色，颜色应与背景色一致，仅ring为true时生效
			background: {
				type: String,
				default: '#FFFFFF'
			}
		},
		data() {
			return {
				pRadius: 100,
				cDiam: 60,
				dataset: null
			};
		},
		computed: {
			getRadius() {
				return `${this.radius}_${this.centerRadius}`
			}
		},
		watch: {
			getRadius(val) {
				this.setRadius()
			}
		},
		created() {
			this.setRadius()
		},
		methods: {
			rpx2px(value) {
				let px = uni.upx2px(Number(value))
				px = px % 2 === 0 ? px : px + 1
				return px;
			},
			setRadius() {
				this.pRadius = this.rpx2px(this.radius)
				this.cDiam = this.rpx2px(this.centerRadius) * 2
				//重新绘制
				if (this.dataset) {


				}
			}
		},
	}
</script>

<style scoped>
	.fui-charts__pie-wrap {}
</style>