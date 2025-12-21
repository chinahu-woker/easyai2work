<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 9   1 44  060 5MA 5 5 6   H  1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-data__tag-wrap" :class="[nowrap?'fui-data__tag-nowrap':'fui-data__tag-flexwrap']"
		:style="{marginBottom:'-'+gap+'rpx'}">
		<!-- #ifndef APP-NVUE -->
		<view class="fui-data__tag-item" :class="{'fui-data__tag-disable':item[disableKey]}"
			:style="{width:width?width+'rpx':'auto',height:height?height+'rpx':'auto',paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0,borderRadius:radius+'rpx',marginRight:gap+'rpx',marginBottom:gap+'rpx',background:item.selected?activeBgColor:background,borderColor:item.selected?(borderColor || primaryColor):(defaultBorderColor || background)}"
			v-for="(item,index) in dataList" :key="index">
			<view class="fui-data__tag-inner" @tap.stop="handleClick(index)">
				<text class="fui-dt__icon"
					:style="{color:markColor || primaryColor,fontSize:markSize+'rpx',lineHeight:markSize+'rpx'}"
					v-if="mark && item.selected">{{icon}}</text>
			</view>
			<text class="fui-data__tag-text"
				:style="{fontSize:size+'rpx',color:item.selected?(activeColor || primaryColor):color}">{{item[textKey]}}</text>
		</view>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE -->
		<view class="fui-data__tag-item" :class="{'fui-data__tag-disable':item[disableKey]}"
			:style="{width:width?width+'rpx':'auto',height:height?height+'rpx':'auto',paddingTop:padding[0] || 0,paddingRight:padding[1] || 0,paddingBottom:padding[2] || padding[0] || 0,paddingLeft:padding[3] || padding[1] || 0,borderRadius:radius+'rpx',marginRight:gap+'rpx',marginBottom:gap+'rpx',background:item.selected?activeBgColor:background,borderColor:item.selected?(borderColor || primaryColor):defaultBorderColor || background}"
			v-for="(item,index) in dataList" :key="index" @tap.stop="handleClick(index)">
			<text class="fui-dt__icon"
				:style="{color:markColor || primaryColor,fontSize:markSize+'rpx',lineHeight:markSize+'rpx'}"
				v-if="mark && item.selected">{{icon}}</text>
			<text class="fui-data__tag-text"
				:style="{fontSize:size+'rpx',lineHeight:size+'rpx',color:item.selected?(activeColor || primaryColor):color}">{{item[textKey]}}</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	var domModule = weex.requireModule('dom');
	domModule.addRule('fontFace', {
		'fontFamily': 'fuitag',
		'src': "url('data:font/truetype;charset=utf-8;base64,AAEAAAANAIAAAwBQRkZUTZNQsWUAAAZMAAAAHEdERUYAKQAKAAAGLAAAAB5PUy8yPDVIzwAAAVgAAABgY21hcAAP6asAAAHIAAABQmdhc3D//wADAAAGJAAAAAhnbHlmyMefBQAAAxgAAABoaGVhZCEhzgEAAADcAAAANmhoZWEH2wOFAAABFAAAACRobXR4DAAAWQAAAbgAAAAQbG9jYQA0AAAAAAMMAAAACm1heHABEQAoAAABOAAAACBuYW1lbtNsLwAAA4AAAAJqcG9zdC9C/kYAAAXsAAAANgABAAAAAQAA1u3xcl8PPPUACwQAAAAAAN7WRS4AAAAA3tZFLgBZ/4ID/QMmAAAACAACAAAAAAAAAAEAAAOA/4AAXAQAAAAAAAP9AAEAAAAAAAAAAAAAAAAAAAAEAAEAAAAEABwAAwAAAAAAAgAAAAoACgAAAP8AAAAAAAAABAQAAZAABQAAAokCzAAAAI8CiQLMAAAB6wAyAQgAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZADA5gDmAAOA/4AAAAPcAIAAAAABAAAAAAAAAAAAAAAgAAEEAAAAAAAAAAQAAAAEAABZAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAA5gD//wAA5gD//xoDAAEAAAAAAAABBgAAAQAAAAAAAAABAgAAAAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAMAWf+CA/0DJgAOABoAGwAAFzY3NjcAATY3MRYVESEiJTY3JyYnBwYHJicHN1kCAwsDAlYBKAcIBPxvBgJzdzsICwYGYDE5GRxsegECBwUCVQErBA0NBvxv0nc5Cg0JBmQxORwcvgAAAAASAN4AAQAAAAAAAAATACgAAQAAAAAAAQAGAEoAAQAAAAAAAgAHAGEAAQAAAAAAAwAGAHcAAQAAAAAABAAGAIwAAQAAAAAABQALAKsAAQAAAAAABgAGAMUAAQAAAAAACgArASQAAQAAAAAACwATAXgAAwABBAkAAAAmAAAAAwABBAkAAQAMADwAAwABBAkAAgAOAFEAAwABBAkAAwAMAGkAAwABBAkABAAMAH4AAwABBAkABQAWAJMAAwABBAkABgAMALcAAwABBAkACgBWAMwAAwABBAkACwAmAVAAQwByAGUAYQB0AGUAZAAgAGIAeQAgAGkAYwBvAG4AZgBvAG4AdAAAQ3JlYXRlZCBieSBpY29uZm9udAAAZgB1AGkAdABhAGcAAGZ1aXRhZwAAUgBlAGcAdQBsAGEAcgAAUmVndWxhcgAAZgB1AGkAdABhAGcAAGZ1aXRhZwAAZgB1AGkAdABhAGcAAGZ1aXRhZwAAVgBlAHIAcwBpAG8AbgAgADEALgAwAABWZXJzaW9uIDEuMAAAZgB1AGkAdABhAGcAAGZ1aXRhZwAARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgAAR2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0LgAAaAB0AHQAcAA6AC8ALwBmAG8AbgB0AGUAbABsAG8ALgBjAG8AbQAAaHR0cDovL2ZvbnRlbGxvLmNvbQAAAAACAAAAAAAAAAoAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAQAAAABAAIBAgtpbV94dWFuemVfYgAAAAAAAf//AAIAAQAAAAwAAAAWAAAAAgABAAMAAwABAAQAAAACAAAAAAAAAAEAAAAA1aQnCAAAAADe1kUuAAAAAN7WRS4=')"
	});
	// #endif
	export default {
		name: "fui-data-tag",
		emits: ['change', 'input', 'update:modelValue'],
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			textKey: {
				type: String,
				default: 'text'
			},
			valueKey: {
				type: String,
				default: 'value'
			},
			isAllKey: {
				type: String,
				default: 'isAll'
			},
			disableKey: {
				type: String,
				default: 'disable'
			},
			// #ifdef VUE3
			modelValue: {
				type: [Array, String, Number],
				default () {
					return []
				}
			},
			// #endif
			value: {
				type: [Array, String, Number],
				default () {
					return []
				}
			},
			multiple: {
				type: Boolean,
				default: false
			},
			//最小选择数，仅单选有效，可选值仅0、1
			min: {
				type: [Number, String],
				default: 1
			},
			//最小选择数，仅多选有效
			multipleMin: {
				type: [Number, String],
				default: 0
			},
			//最大选择数
			max: {
				type: [Number, String],
				default: -1
			},
			width: {
				type: [Number, String],
				default: 0
			},
			height: {
				type: [Number, String],
				default: 0
			},
			padding: {
				type: Array,
				default () {
					return ['16rpx', '32rpx']
				}
			},
			gap: {
				type: [Number, String],
				default: 20
			},
			radius: {
				type: [Number, String],
				default: 6
			},
			size: {
				type: [Number, String],
				default: 24
			},
			color: {
				type: String,
				default: '#333'
			},
			activeColor: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: '#fff'
			},
			activeBgColor: {
				type: String,
				default: '#fff'
			},
			//默认边框颜色
			defaultBorderColor: {
				type: String,
				default: ''
			},
			borderColor: {
				type: String,
				default: ''
			},
			//设为true时，圆角值不建议设过大
			mark: {
				type: Boolean,
				default: false
			},
			markSize: {
				type: [Number, String],
				default: 52
			},
			markColor: {
				type: String,
				default: ''
			},
			//V2.1.0+ 标签选择 是否强制一行显示，外层需要自行设置横向滚动容器
			nowrap: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			options(vals) {
				this.initData(vals)
			},
			// #ifdef VUE3
			modelValue(vals) {
				this.modelChange(vals)
			},
			// #endif
			value(vals) {
				this.modelChange(vals)
			}
		},
		created() {
			this.initData(this.options)
		},
		computed: {
			primaryColor() {
				const app = uni && uni.$fui && uni.$fui.color;
				return (app && app.primary) || '#465CFF';
			}
		},
		data() {
			return {
				icon: '\ue600',
				dataList: [],
				val: '',
				vals: []
			};
		},
		methods: {
			initData(vals) {
				vals = JSON.parse(JSON.stringify(vals))
				if (vals && vals.length > 0) {
					if (typeof vals[0] !== 'object') {
						vals = vals.map((item, index) => {
							return {
								[this.textKey]: item,
								[this.valueKey]: item,
								selected: false
							}
						})
					} else {
						vals.map((item, index) => {
							item.selected = item.selected || false;
							if (item[this.valueKey] === undefined) {
								item[this.valueKey] = item[this.textKey]
							}
						})
					}
					this.dataList = vals;
					// #ifdef VUE3
					this.modelChange(this.modelValue)
					// #endif

					// #ifndef VUE3
					this.modelChange(this.value)
					// #endif
				}
			},
			emitsChange(e) {
				this.$emit('change', e)
				this.$emit('input', e.detail.value)
				// #ifdef VUE3
				this.$emit("update:modelValue", e.detail.value);
				// #endif
			},
			radioChange(index, model) {
				const min = Number(this.min)
				if (this.val === model[this.valueKey] && min > 0) return;
				let val = '';
				let i = index;
				let entity = {}
				this.dataList.forEach((item, idx) => {
					if (idx === index) {
						const bool = this.val === item[this.valueKey] && min <= 0
						val = bool ? '' : item[this.valueKey]
						i = bool ? -1 : index
						entity = bool ? {} : item
						item.selected = bool ? false : true
					} else {
						item.selected = false
					}
				})
				this.val = val
				let e = {
					detail: {
						index: i,
						value: val,
						item: entity
					}
				}
				this.emitsChange(e)
			},
			toast(title) {
				uni.showToast({
					title: title,
					icon: 'none'
				})
			},
			checkboxChange(index, model) {
				const min = Number(this.multipleMin)
				const max = Number(this.max)
				let vals = this.vals
				let i = vals.indexOf(model[this.valueKey])
				if (vals.length <= min && i !== -1) {
					this.toast(`至少选择${min}个选项`)
					return
				}
				const isAllIndex = this.dataList.findIndex(item => item[this.isAllKey])
				let item = this.dataList[index]
				if (isAllIndex !== -1) {
					if (model[this.isAllKey]) {
						item.selected = i !== -1 ? false : true
						if (item.selected) {
							vals = [model[this.valueKey]]
						} else {
							vals.splice(i, 1)
						}
						this.dataList.forEach((item, idx) => {
							if (index !== idx) {
								item.selected = false
							}
						})
					} else {
						if (vals.length >= max && max !== -1 && i === -1) {
							this.toast(`最多只能选择${max}个选项`)
							return
						}
						let entity = this.dataList[isAllIndex]
						const allI = vals.indexOf(entity[this.valueKey])
						if (allI !== -1) {
							entity.selected = false;
							vals.splice(allI, 1)
						}
						this.dataList.forEach((item, idx) => {
							if (index === idx) {
								item.selected = i !== -1 ? false : true
								if (item.selected) {
									vals.push(item[this.valueKey])
								} else {
									vals.splice(i, 1)
								}
							}
						})
					}
				} else {
					if (vals.length >= max && max !== -1 && i === -1) {
						this.toast(`最多只能选择${max}个选项`)
						return
					}
					item.selected = i !== -1 ? false : true
					if (item.selected) {
						vals.push(item[this.valueKey])
					} else {
						vals.splice(i, 1)
					}
				}
				this.vals = vals
				const entity = this.dataList.filter(item => vals.indexOf(item[this.valueKey]) != -1)
				let e = {
					detail: {
						value: vals,
						item: entity
					}
				}
				this.emitsChange(e)
			},
			modelChange(vals) {
				if (this.multiple) {
					this.dataList.forEach(item => {
						if (vals.includes(item[this.valueKey])) {
							item.selected = true;
						} else {
							item.selected = false
						}
					})
					this.vals = vals

				} else {
					this.dataList.forEach(item => {
						if (vals == item[this.valueKey]) {
							item.selected = true;
						} else {
							item.selected = false
						}
					})
					this.val = vals
				}
			},
			handleClick(index) {
				let item = this.dataList[index]
				if (item[this.disableKey]) return;
				if (this.multiple) {
					this.checkboxChange(index, item)
				} else {
					this.radioChange(index, item)
				}
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	/* 头条小程序组件内如果不能引入字体，则需要在父级页面引入字体文件*/
	@font-face {
		font-family: fuitag;
		src: url(data:font/ttf;base64,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) format("truetype");
	}

	/* #endif */

	.fui-dt__icon {
		font-family: fuitag;
		text-decoration: none;
		text-align: center;
		position: absolute;
		right: -4rpx;
		bottom: -6rpx;
	}

	.fui-data__tag-wrap {
		/* #ifndef APP-NVUE */
		max-width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.fui-data__tag-flexwrap {
		flex-wrap: wrap;
	}

	.fui-data__tag-nowrap {
		flex-wrap: nowrap;
	}

	.fui-data__tag-item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		white-space: nowrap;
		box-sizing: border-box;
		transform: translateZ(0);
		/* #endif */
		border-width: 1px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-overflow: ellipsis;
		/* #ifdef APP-NVUE */
		overflow: hidden;
		/* #endif */
		border-style: solid;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-data__tag-inner {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		z-index: 1;
		/* #endif */
	}

	.fui-data__tag-text {
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		flex: 1;
		text-align: center;
		text-overflow: ellipsis;
		font-weight: normal;
	}

	.fui-data__tag-disable {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
		opacity: .5;
	}
</style>