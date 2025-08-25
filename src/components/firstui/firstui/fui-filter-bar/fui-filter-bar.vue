<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 1 1 27，营业执照号：914 40 6     0  5M A5 5   6H1K   XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-filter__bar-wrap" :style="{height:height+'rpx',background:background}">
		<view class="fui-filter__bar-item" :style="{height:height+'rpx'}" @tap.stop="handleClick(index)"
			v-for="(item,index) in itemList" :key="index">
			<text class="fui-filter__bar-text" :class="{'fui-fb__text-hidden':item.text.length>4}"
				:style="{fontSize:size+'rpx',lineHeight:size+'rpx',color:item.value?activeColor:color}"
				v-if="item.type!=='switch'">{{item.text}}</text>
			<view v-if="item.type==='dropdown'" class="fui-filter__bar-icon"
				:class="{'fui-fb__icon-rotate':item.active}">
				<fui-icon name="arrowdown" :color="item.value?activeColor:color" :size="item.size || 32"></fui-icon>
			</view>
			<fui-icon name="screen" :size="item.size || 28" :color="item.value?activeColor:color"
				v-if="item.type==='filter'"></fui-icon>
			<!-- #ifndef APP-NVUE -->
			<fui-icon v-if="item.type==='switch'" :name="item.switch===1?'classify':'list'"
				:size="item.size || (item.switch===1?46:60)" :color="item.active?activeColor:color"></fui-icon>
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<fui-icon v-if="item.type==='switch'" :name="item.switch===1?'classify':'list'" :size="item.size || 48"
				:color="item.active?activeColor:color"></fui-icon>
			<!-- #endif -->
			<fui-icon v-if="item.type==='sort'" :name="item.sort===1?'turningup':'turningdown'"
				:color="item.value?activeColor:color" :size="item.size || 28"></fui-icon>
		</view>
		<view class="fui-filter__bar-line" v-if="isLine" :style="{background:lineColor}"></view>
	</view>
</template>

<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-filter-bar",
		emits: ['change'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			items: {
				type: Array,
				default () {
					return []
				}
			},
			coexist: {
				type: Boolean,
				default: false
			},
			height: {
				type: [Number, String],
				default: 88
			},
			background: {
				type: String,
				default: '#fff'
			},
			isLine: {
				type: Boolean,
				default: true
			},
			lineColor: {
				type: String,
				default: '#eee'
			},
			color: {
				type: String,
				default: '#7F7F7F'
			},
			activeColor: {
				type: String,
				default: '#181818'
			},
			size: {
				type: [Number, String],
				default: 28
			}
		},
		watch: {
			items(val) {
				this.itemList = val
			}
		},
		data() {
			return {
				itemList: []
			};
		},
		created() {
			this.itemList = this.items
		},
		methods: {
			handleData(index) {
				this.itemList.forEach((item, idx) => {
					if (index !== idx && item.type !== 'filter' && item.type !== 'switch') {
						if (item.type === 'sort') {
							item.sort = 1;
						}
						item.active = false;
						item.value = ''
					}
				})
			},
			handleClick(index) {
				//dropdown、filter需要设置value来确定是否选中
				let item = this.itemList[index]
				//dropdown、text、switch、sort、filter
				let type = item.type;
				if (type === 'dropdown') {
					this.$set(item, 'active', !item.active);
					item.value && !this.coexist && this.handleData(index);
				} else if (type === 'text') {
					if (!this.coexist) {
						if (item.active) return;
						this.$set(item, 'active', true);
						this.$set(item, 'value', item.text);
						this.handleData(index);
					} else {
						if (item.active) {
							this.$set(item, 'active', false);
							this.$set(item, 'value', '');
						} else {
							this.$set(item, 'active', true);
							this.$set(item, 'value', item.text);
						}
					}
				} else if (type === 'switch') {
					this.$set(item, 'switch', item.switch === 2 ? 1 : 2);
					this.$set(item, 'active', false);
				} else if (type === 'sort') {
					//初次选中时为升序
					if (item.value && item.sort) {
						this.$set(item, 'sort', item.sort === 2 ? 1 : 2);
					} else {
						this.$set(item, 'sort', 1);
					}
					this.$set(item, 'value', item.sort === 1 ? 'asc' : 'desc');
					!this.coexist && this.handleData(index);
				}
				setTimeout(() => {
					this.$emit('change', {
						index: index,
						items: this.itemList
					})
				}, 0)
			}
		}
	}
</script>

<style scoped>
	.fui-filter__bar-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.fui-filter__bar-line {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		/* #endif */

		/* #ifndef APP-NVUE */
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		z-index: 1;
		pointer-events: none;
		/* #endif */
	}

	.fui-filter__bar-item {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-weight: normal;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		overflow: hidden;
		padding: 0 24rpx;
	}

	.fui-filter__bar-text {
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		display: block;
		max-width: 90%;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	/* #ifdef APP-NVUE */
	.fui-fb__text-hidden {
		flex: 1;
	}

	/* #endif */

	.fui-filter__bar-icon {
		transition: transform 0.25s;
		transform: rotate(0deg);
	}

	.fui-fb__icon-rotate {
		transform: rotate(180deg);
	}
</style>