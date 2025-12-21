<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：   91 44060   5  MA5  56      H1KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-table__wrap" :style="{height:height>0 || height!=0?height+'rpx':'auto',width:width+'px'}">
		<!-- #ifdef MP-BAIDU -->
		<scroll-view enhanced :bounces="bounces" :show-scrollbar="showScrollbar" :scroll-x="true"
			:style="{width:width+'px',height:height>0 || height!=0?height+'rpx':'auto'}" class="fui-table__scroll-view"
			:class="{'fui-table__flex-row':!height || height==0}" @scrolltolower="scrolltolower">
		<!-- #endif -->
			<!-- #ifndef MP-BAIDU -->
			<scroll-view enhanced :bounces="bounces" :show-scrollbar="showScrollbar" :scroll-x="true"
				:scroll-y="height>0 && height!=0"
				:style="{width:width+'px',height:height>0 || height!=0?height+'rpx':'auto'}"
				class="fui-table__scroll-view" :class="{'fui-table__flex-row':!height || height==0}"
				@scrolltolower="scrolltolower">
			<!-- #endif -->
				<view class="fui-table--inner" :style="{width:totalW+'px'}">
					<view class="fui-table--tr"
						:class="{'fui-table__border-bottom':horBorder,'fui-table__border-top':horBorder && show,'fui-table--header-fixed':fixed}"
						:style="{borderBottomColor:horBorder?borderColor:'transparent',borderTopColor:horBorder && show?borderColor:'transparent'}"
						v-if="show">
						<view class="fui-table--td"
							:class="{'fui-table__border-right':border,'fui-table__border-left':border && index===0,'fui-table__center': (item.align || align)==='center','fui-table__right':(item.align || align)==='right','fui-table--col-fixed':item.fixed && !isNvue}"
							:style="{borderRightColor:border?borderColor:'transparent',borderLeftColor:border && index===0?borderColor:'transparent',background:item.background || headerBgColor,width:(item.width+divideW)+'px',paddingTop:padding+'rpx',paddingBottom:padding+'rpx',left:item.fixed && item.fixed!=='right' && !isNvue?item.left+'px':'auto',right:item.fixed==='right' && !isNvue?item.right+'px':'auto'}"
							v-for="(item,index) in hData" :key="index" @tap.stop="tableSort(index,false)">
							<view class="fui-table__checkbox"
								:class="{'fui-table__checkbox-color':(!checkboxColor || checkboxColor===true) && chkAll}"
								:style="{background:chkAll?getCheckboxColor:'transparent',borderColor:chkAll ?getCheckboxColor:checkboxBorderColor}"
								v-if="item.type==='selection'" @tap.stop="selectionAll">
								<view class="fui-table__checkmark"
									:style="{borderBottomColor:checkmarkColor,borderRightColor:checkmarkColor}"></view>
							</view>
							<text v-else class="fui-table--td-text"
								:class="{'fui-text__center':(item.align || align)==='center','fui-text__right':(item.align || align)==='right','fui-td__ellipsis':ellipsis}"
								:style="{width:(item.width+divideW)+'px',color:item.color || color,fontSize:(item.size || size)+'rpx',fontWeight:fontWeight}">{{item.label || item.prop}}</text>
							<view class="fui-table__sort-icon" :style="{right:(item.sortRight || 40)+'rpx'}"
								v-if="item.sortable">
								<fui-icon :name="item.sort==='descending'?'turningdown':'turningup'"
									:size="item.sortSize || 28"
									:color="item.sort?(item.sortColor || '#333'):(item.color || color)"></fui-icon>
							</view>
							<view class="fui-table__td-sk" :style="{backgroundColor:borderColor}"
								v-if="border && item.fixed==='right'"></view>
						</view>
					</view>
					<view class="fui-table--tr"
						:class="{'fui-table__border-bottom':horBorder,'fui-table__border-top':horBorder && !show && index===0}"
						:style="{borderBottomColor:horBorder?borderColor:'transparent',borderTopColor:horBorder && !show && index===0?borderColor:'transparent'}"
						v-for="(item,index) in tableData" :key="index">
						<view class="fui-table--td"
							:class="{'fui-table__border-right':border,'fui-table__border-left':border && idx===0,'fui-table__center':(model.align || align)==='center','fui-table__right':(model.align || align)==='right','fui-table__td-wrap':model.type===3,'fui-table--col-fixed':model.fixed && !isNvue}"
							v-for="(model,idx) in hData" :key="model.tdId"
							:style="{borderRightColor:border?borderColor:'transparent',borderLeftColor:border && idx===0?borderColor:'transparent',background:item.background || ((index+1)%2===0 && stripe?stripeColor:background),width:(model.width+divideW)+'px',paddingTop:padding+'rpx',paddingBottom:padding+'rpx',left:model.fixed && model.fixed!=='right' && !isNvue?model.left+'px':'auto',right:model.fixed==='right' && !isNvue?model.right+'px':'auto'}"
							@tap.stop="tdClick(index,idx,model.prop)">
							<template v-if="model.type!==3">
								<view class="fui-table__checkbox"
									:class="{'fui-table__checkbox-color':(!checkboxColor || checkboxColor===true) && item.is_selected,'fui-table__disabled':item.is_disabled}"
									:style="{background:item.is_selected ?getCheckboxColor:'transparent',borderColor:item.is_selected ?getCheckboxColor:checkboxBorderColor}"
									v-if="model.type==='selection'" @tap.stop="selectionChange(index)">
									<view class="fui-table__checkmark"
										:style="{borderBottomColor:checkmarkColor,borderRightColor:checkmarkColor}">
									</view>
								</view>
								<image class="fui-table--td-img" :src="item[model.prop] || ''" mode="widthFix"
									v-else-if="model.type===2"
									:style="{width:(model.imgWidth || 120)+'rpx',height:model.imgHeight?model.imgHeight+'rpx':'auto'}">
								</image>
								<text class="fui-table--td-text"
									:class="{'fui-text__center':(model.align || align)==='center','fui-text__right':(model.align || align)==='right','fui-td__ellipsis':ellipsis,'fui-td__wrap':!ellipsis}"
									v-else
									:style="{color:getColColor(model,item[model.prop],index,idx),fontSize:(model.textSize || textSize) +'rpx',width:(model.width+divideW)+'px'}">{{item[model.prop]==0?item[model.prop]:(item[model.prop] || '')}}</text>
							</template>
							<template v-else>
								<text class="fui-table--btn" :class="{'fui-td__btn-ml':j>0}"
									:style="{fontSize:(btn.size || textSize) +'rpx',color:btn.color,fontWeight:btn.fontWeight || 'normal'}"
									v-for="(btn,j) in model.buttons" :key="btn.bId"
									@tap.stop="handleTap(index,j)">{{btn.text}}</text>
							</template>
							<view class="fui-table__td-sk" :style="{backgroundColor:borderColor}"
								v-if="border && model.fixed==='right'"></view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="fui-table--empty" :style="{width:width+'px'}"
				:class="{'fui-table__empty-ab':totalW>width && (height>0 && height!=0)}"
				v-if="itemList.length===0 && emptyText!==true && emptyText!==''">
				<text class="fui-table__empty-text"
					:style="{fontSize:emptySize+'rpx',color:emptyColor}">{{emptyText}}</text>
			</view>
	</view>
</template>

<script>
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import fuiIcon from "@/components/firstui/fui-icon/fui-icon.vue"
	export default {
		name: "fui-table",
		emits: ['click', 'rowClick', 'tdClick', 'selectionChange', 'select', 'selectAll', 'sortChange', 'scrolltolower'],
		// components:{
		// 	fuiIcon
		// },
		props: {
			header: {
				type: Array,
				default () {
					return []
				}
			},
			show: {
				type: Boolean,
				default: true
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: '#7F7F7F'
			},
			fontWeight: {
				type: [Number, String],
				default: 600
			},
			headerBgColor: {
				type: String,
				default: '#fff'
			},
			fixed: {
				type: Boolean,
				default: false
			},
			//数据集合
			itemList: {
				type: Array,
				default () {
					return []
				}
			},
			//总宽度 < 屏幕宽度- gap*2时，是否铺满
			full: {
				type: Boolean,
				default: false
			},
			//Table 的高度，默认为自动高度，单位rpx。
			height: {
				type: [Number, String],
				default: 0
			},
			//组件外层设置的左右padding值（距离屏幕左右侧距离），rpx
			gap: {
				type: [Number, String],
				default: 0
			},
			//是否带有纵向边框
			border: {
				type: Boolean,
				default: true
			},
			//是否带有横向边框
			horBorder: {
				type: Boolean,
				default: true
			},
			//边框颜色
			borderColor: {
				type: String,
				default: '#eee'
			},
			//如果有固定项，不可设置透明
			background: {
				type: String,
				default: '#fff'
			},
			// 是否为斑马纹table
			stripe: {
				type: Boolean,
				default: false
			},
			//斑马纹颜色
			stripeColor: {
				type: String,
				default: '#F8F8F8'
			},
			textSize: {
				type: [Number, String],
				default: 28
			},
			textColor: {
				type: String,
				default: '#333'
			},
			//单元格对齐方式:left/center/right
			align: {
				type: String,
				default: 'center'
			},
			//文字超出是否省略，默认换行
			ellipsis: {
				type: Boolean,
				default: false
			},
			//单元格上下padding值，单位rpx
			padding: {
				type: [Number, String],
				default: 20
			},
			//是否添加多选框
			selection: {
				type: Boolean,
				default: false
			},
			initEmitChange: {
				type: Boolean,
				default: false
			},
			//选择框选中后颜色
			checkboxColor: {
				type: String,
				default: ''
			},
			checkboxBorderColor: {
				type: String,
				default: '#eee'
			},
			checkmarkColor: {
				type: String,
				default: '#fff'
			},
			//V2.1.0+
			emptyText: {
				type: String,
				default: '暂无数据'
			},
			emptySize: {
				type: [String, Number],
				default: 24
			},
			emptyColor: {
				type: String,
				default: '#B2B2B2'
			},
			bounces: {
				type: Boolean,
				default: false
			},
			showScrollbar: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			header(vals) {
				this.handleHeader(vals)
			},
			itemList(vals) {
				this.handleData(vals)
			},
			selection(vals) {
				this.handleData(this.itemList)
			}
		},
		computed: {
			getCheckboxColor() {
				let color = this.checkboxColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			}
		},
		data() {
			let isNvue = false
			// #ifdef APP-NVUE
			isNvue = true
			// #endif
			return {
				width: 0,
				//列宽度需要加上此值
				divideW: 0,
				hData: [],
				tableData: [],
				initTableData: [],
				totalW: 0,
				isNvue: isNvue,
				scrollH: 0,
				chkAll: false
			};
		},
		created() {
			this.handleHeader(this.header)
			this.handleData(this.itemList)
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			getId(index) {
				return `${index}_tr_${Math.ceil(Math.random() * 10e5).toString(36)}`
			},
			handleHeader(header) {
				if (!header || header.length === 0) return;
				let vals = JSON.parse(JSON.stringify(header))
				if (this.selection) {
					vals.unshift({
						fixed: true,
						width: 100,
						type: 'selection'
					})
				}
				let winWidth = uni.getSystemInfoSync().windowWidth
				let width = 0,
					left = 0,
					right = 0;
				let len = vals.length
				vals.map((item, index) => {
					item.tdId = this.getId(index)
					item.width = this.getPx(item.width || 200)
					width += item.width
					if (item.fixed) {
						item.left = item.fixed !== 'right' ? left : 0;
						left += item.width
					}
					if (item.type === 3 && item.buttons) {
						item.buttons.map((btn, idx) => {
							btn.bId = this.getId(index)
						})
					}
					//空 默认排序，ascending-升序 descending-降序
					if (!item.sort) {
						item.sort = ''
					}
				})
				for (let i = 0; i < len; i++) {
					let item = vals[len - i - 1]
					if (item && item.fixed) {
						item.right = item.fixed === 'right' ? right : 0;
						right += item.width
					}
				}
				let gap = this.gap == 0 ? 0 : this.getPx(Number(this.gap) * 2)
				this.totalW = width
				let totalWidth = winWidth - gap
				this.width = width > totalWidth ? totalWidth : width
				if (this.full && totalWidth > this.width) {
					this.divideW = Math.floor((totalWidth - this.width) / len)
					let lastW = (totalWidth - this.width) % len
					let item = vals[len - 1]
					item.width += lastW
					let dw = this.divideW * len + lastW
					this.width += dw
					this.totalW += dw
				}
				this.hData = vals;
			},
			handleData(vals) {
				if (!vals) {
					vals = []
				}
				let table = JSON.parse(JSON.stringify(vals))
				table.map(item => {
					item.is_disabled = item.is_disabled || false;
					item.is_selected = item.is_selected || false;
				})
				this.tableData = table;
				this.initTableData = JSON.parse(JSON.stringify(table))
				if (this.initEmitChange) {
					this.emitSelectionChange()
				}
			},
			handleTap(index, j) {
				let item = this.tableData[index]
				this.$emit('click', {
					item: item,
					index: index,
					buttonIndex: j
				})
			},
			tdClick(index, idx, prop) {
				let item = this.tableData[index]
				this.$emit('rowClick', {
					item: item,
					index: index
				})

				this.$emit('tdClick', {
					rowIndex: index,
					tdIndex: idx,
					prop: prop
				})
			},
			getColColor(model, value, index, idx) {
				let color = '';
				if (model.fn && typeof model.fn === 'function') {
					color = model.fn(value, index, idx)
				}
				return color || model.textColor || this.textColor
			},
			columnColorMethod(fn, prop) {
				if (!fn || !prop) return;
				const data = this.hData;
				const index = data.findIndex(item => item.prop === prop)
				if (index !== -1) {
					let item = data[index]
					item.fn = fn
					this.hData = data;
				}
			},
			selectionAll() {
				if (this.chkAll) {
					this.chkAll = false
					this.tableData.map(item => {
						if (!item.is_disabled) {
							item.is_selected = false
						}
					})
				} else {
					this.chkAll = true;
					this.tableData.map(item => {
						if (!item.is_disabled) {
							item.is_selected = true
						}
					})
				}
				this.$emit('selectAll', {
					is_selected: this.chkAll
				})
				setTimeout(() => {
					this.emitSelectionChange()
				}, 0)
			},
			emitSelectionChange() {
				const itemList = this.tableData.filter(item => item.is_selected === true && item.is_disabled !== true)
				let data = JSON.parse(JSON.stringify(itemList))
				data.forEach(item => {
					delete item.is_selected
					delete item.is_disabled
				})
				this.$emit('selectionChange', data)
			},
			checkSelectionAll() {
				if (!this.tableData || this.tableData.length === 0) return;
				const index = this.tableData.findIndex(item => item.is_selected === false && item.is_disabled !== true)
				if (~index) {
					this.chkAll = false
				} else {
					this.chkAll = true
				}
				setTimeout(() => {
					this.emitSelectionChange()
				}, 0)
			},
			selectionChange(index, selected) {
				const item = this.tableData[index]
				if (item.is_disabled) return;
				if (selected === undefined || selected === null) {
					item.is_selected = !item.is_selected;
				} else {
					item.is_selected = selected;
				}
				this.$emit('select', {
					is_selected: item.is_selected,
					item: item,
					index: index
				})
				this.checkSelectionAll()
			},
			//用于多选表格，清空用户的选择
			clearSelection() {
				this.chkAll = false
				this.tableData.map(item => {
					if (!item.is_disabled) {
						item.is_selected = false
					}
				})
			},
			getRowIndex(row) {
				if (!row) return -1;
				const len = this.itemList.length;
				let index = -1;
				for (let i = 0; i < len; i++) {
					const item = this.itemList[i]
					if (JSON.stringify(item) === JSON.stringify(row)) {
						index = i;
						break;
					}
				}
				return index;
			},
			toggleRowSelection(row, selected) {
				const index = this.getRowIndex(row);
				if (index !== -1) {
					this.selectionChange(index, selected)
				}
			},
			toggleRowDisabled(row, disabled) {
				const index = this.getRowIndex(row);
				if (index !== -1) {
					const item = this.tableData[index]
					if (disabled === undefined || disabled === null) {
						item.is_disabled = !item.is_disabled;
					} else {
						item.is_disabled = disabled;
					}
				}
			},
			//用于多选表格，切换所有行的选中状态（全选/取消）
			toggleAllSelection() {
				this.selectionAll()
			},
			tableSort(index, sortOrder) {
				if (!this.tableData || this.tableData.length === 0) return;
				const item = this.hData[index]
				if (item.sortable) {
					// item.sortType='number/date/string'
					//ascending-升序 descending-降序
					let asc = false;
					if (sortOrder) {
						asc = sortOrder === 'ascending'
					} else {
						asc = !item.sort || item.sort === 'descending';
					}
					if (asc) {
						item.sort = 'ascending'
						if (item.sortType === 'number') {
							this.tableData.sort((a, b) => {
								return a[item.prop] - b[item.prop]
							});
						} else if (item.sortType === 'date') {
							this.tableData.sort((a, b) => {
								//日期格式字符串必须可以被转化为日期格式
								return new Date(a[item.prop].replace(/\-/g, '/')).getTime() - new Date(b[item.prop]
									.replace(/\-/g, '/')).getTime()
							});
						} else {
							this.tableData.sort((a, b) => {
								return a[item.prop].localeCompare(b[item.prop], 'zh-Hans-CN');
							});
						}
					} else {
						item.sort = 'descending'
						if (item.sortType === 'number') {
							this.tableData.sort((a, b) => {
								return b[item.prop] - a[item.prop]
							});
						} else if (item.sortType === 'date') {
							this.tableData.sort((a, b) => {
								//日期格式字符串必须可以被转化为日期格式
								return new Date(b[item.prop].replace(/\-/g, '/')).getTime() - new Date(a[item.prop]
									.replace(/\-/g, '/')).getTime()
							});
						} else {
							this.tableData.sort((a, b) => {
								return b[item.prop].localeCompare(a[item.prop], 'zh-Hans-CN');
							});
						}
					}
					this.hData.forEach((d, idx) => {
						if (index !== idx) {
							d.sort = ''
						}
					})
					this.$emit('sortChange', {
						itemList: this.tableData,
						sort: item.sort,
						prop: item.prop
					})
				}
			},
			//重置所有排序
			resetSort() {
				this.hData.forEach(item => {
					item.sort = ''
				})
				this.tableData = JSON.parse(JSON.stringify(this.initTableData))
			},
			//ascending-升序 descending-降序
			setSort(prop, sortOrder = 'ascending') {
				const index = this.hData.findIndex(item => item.prop === prop)
				if (index !== -1) {
					this.tableSort(index, sortOrder)
				}
			},
			scrolltolower(e) {
				const direction = e.detail.direction;
				if (direction == 'bottom') {
					this.$emit('scrolltolower', e.detail)
				}
			}
		}
	}
</script>

<style scoped>
	.fui-table__wrap {
		position: relative;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		margin: 0 auto;
		/* #endif */
		/* #ifndef MP-BAIDU */
		overflow: hidden;
		/* #endif */
		font-size: 0;
	}

	.fui-table__border-top {
		border-top-width: 1px;
		border-top-style: solid;
	}

	.fui-table__border-left {
		border-left-width: 1px;
		border-left-style: solid;
	}

	.fui-table__border-right {
		border-right-width: 1px;
		border-right-style: solid;
	}

	.fui-table__border-bottom {
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}

	.fui-table--tr {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
	}

	.fui-table--empty {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: center;
	}

	.fui-table__empty-ab {
		position: absolute;
		left: 0;
		top: 96rpx;
		/* #ifndef APP-NVUE */
		z-index: 2;
		/* #endif */
	}

	.fui-table__empty-text {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		font-weight: 400;
		text-align: center;
		padding: 48rpx 0;
	}

	.fui-table--td {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding-left: 16rpx;
		padding-right: 16rpx;
		position: relative;
	}

	.fui-table__sort-icon {
		position: absolute;
		right: 40rpx;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.fui-table__td-sk {
		position: absolute;
		left: -1px;
		width: 1px;
		top: 0;
		bottom: 0;
	}

	.fui-table__td-wrap {
		flex-wrap: wrap;
	}

	.fui-table--td-text {
		font-weight: 400;
	}

	.fui-table--td-img {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.fui-table--btn {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		text-align: center;
		padding: 2px 0;
	}

	.fui-table--btn:active {
		opacity: .5;
	}

	.fui-td__btn-ml {
		margin-left: 24rpx;
	}

	.fui-table--header-fixed {
		position: sticky;
		top: 0;
		/* #ifndef APP-NVUE */
		z-index: 12;
		/* #endif */
		left: 0;
		right: 0;
	}

	.fui-table--col-fixed {
		position: sticky;
		/* #ifndef APP-NVUE */
		z-index: 2;
		/* #endif */
	}

	.fui-table__center {
		justify-content: center;
		text-align: center;
	}

	.fui-table__right {
		justify-content: flex-end;
		text-align: right;
	}

	.fui-text__center {
		text-align: center;
	}

	.fui-text__right {
		text-align: right;
	}

	.fui-td__ellipsis {
		/* #ifndef APP-NVUE */
		overflow: hidden;
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		text-overflow: ellipsis;
	}

	/* #ifndef APP-NVUE */
	.fui-td__wrap {
		word-break: break-all;
	}

	/* #endif */

	.fui-table__scroll-view {
		position: relative;
	}

	/* #ifdef APP-NVUE */
	.fui-table__flex-row {
		flex-direction: row;
	}

	/* #endif */

	/* #ifdef MP-BAIDU  || MP-WEIXIN */
	.fui-table--inner {
		display: inline-block;
		padding-bottom: 40rpx;
	}

	/* #endif */

	.fui-table__checkbox {
		font-size: 0;
		color: rgba(0, 0, 0, 0);
		width: 36rpx;
		height: 36rpx;
		border-width: 1px;
		border-style: solid;
		/* #ifndef APP-NVUE */
		display: inline-flex;
		box-sizing: border-box;
		vertical-align: top;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
		border-radius: 8rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-table__checkbox-color {
		background: var(--fui-color-primary, #465CFF) !important;
		border-color: var(--fui-color-primary, #465CFF) !important;
	}

	/* #endif */

	.fui-table__disabled {
		opacity: .5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.fui-table__checkmark {
		width: 18rpx;
		height: 36rpx;
		border-bottom-style: solid;
		border-bottom-width: 3px;
		border-bottom-color: #FFFFFF;
		border-right-style: solid;
		border-right-width: 3px;
		border-right-color: #FFFFFF;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		transform: rotate(45deg) scale(0.5) translateZ(0);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(45deg) scale(0.5);
		/* #endif */
		transform-origin: 54% 48%;
	}
</style>