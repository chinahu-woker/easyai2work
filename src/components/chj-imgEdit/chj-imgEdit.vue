<template>

	<view v-show="show">

		<view class="chj_imgEdit">
			<view class="history_box">
				<view class="bg_box">
				</view>
				<view class="bg_box">
				</view>
				<view class="bg_box">
				</view>
			</view>
			<view class="history_box">
				<view class="bg_box">
				</view>
				<view class="bg_box">
				</view>
				<view class="bg_box">
				</view>
			</view>
			<view class="history_box">
				<view class="bg_box">
					<image :src="iconPath.positionReset" @click="initScaleAndTranslate" />
				</view>
				<view class="bg_box">
					<!-- <view class="chj_icon_left" :class="history_index<0?'':'active'" @click="historyEvent('回退')">
					<view></view>
					<view></view>
					<view></view>
					<view></view>
				</view> -->
					<image v-show="history_index < 0" :src="iconPath.retreat_inactive" />
					<image v-show="!(history_index < 0)" :src="iconPath.retreat_active" @click="historyEvent('回退')" />
					<!-- <view class="chj_icon_right" :class="history_index>=history_list.length-1?'':'active'" @click="historyEvent('前进')">
					<view></view>
					<view></view>
					<view></view>
					<view></view>
				</view> -->
					<image v-show="history_index >= history_list.length - 1" style="margin-left: 64rpx;"
						:src="iconPath.goForward_inactive" />
					<image v-show="!(history_index >= history_list.length - 1)" style="margin-left: 64rpx;"
						:src="iconPath.goForward_active" @click="historyEvent('前进')" />
				</view>
				<view class="bg_box">
					<!-- <view class="chj_icon_reset" @click="historyEvent('原图')">
					<view></view>
					<view></view>
				</view> -->
					<image :src="iconPath.reset" @click="historyEvent('原图')" />
				</view>
			</view>
			<view class="canvas_box">
				<!-- <movable-area class="canvas">
				<movable-view :x="x" :y="y" :scale-value="scale" class="canvas"> -->
				<canvas :style="`transform:translate(${x}px, ${y}px) scale(${scale})`" class="canvas"
					canvas-id="chj_imgEdit_canvas_save" id="chj_imgEdit_canvas_save" />
				<canvas :style="`transform:translate(${x}px, ${y}px) scale(${scale})`" class="canvas"
					canvas-id="chj_imgEdit_canvas_bg" id="chj_imgEdit_canvas_bg" />
				<canvas :style="`transform:translate(${x}px, ${y}px) scale(${scale})`" style="z-index: 1;"
					class="canvas" canvas-id="chj_imgEdit_canvas" id="chj_imgEdit_canvas" :disable-scroll="true"
					@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @touchcancel="touchend" />
				<canvas :style="`transform:translate(${x}px, ${y}px) scale(${scale})`"
					style="pointer-events: none;z-index: 2;" class="canvas" canvas-id="chj_imgEdit_canvas_text"
					id="chj_imgEdit_canvas_text" />
				<canvas :style="`transform:translate(${x}px, ${y}px) scale(${scale})`"
					style="pointer-events: none;z-index: 3;" class="canvas" canvas-id="chj_imgEdit_canvas_hx"
					id="chj_imgEdit_canvas_hx" />
				<canvas style="pointer-events: none;z-index: 4;" class="canvas" canvas-id="chj_imgEdit_canvas_cj"
					id="chj_imgEdit_canvas_cj" />
					<!-- 用于处理遮罩的临时canvas -->
				<canvas style="visibility: hidden; position: absolute; z-index: -1;" class="canvas" 
					canvas-id="mask_process_canvas" id="mask_process_canvas" />
				<!-- </movable-view>
			</movable-area> -->
			</view>
			<!-- 涂鸦选择 -->
			<view class="tuya_box flex-row">
				<!-- 颜色选择 -->
				<view class="color_select">
					<view class="item white_border" v-for="(i, index) in color_list" :key="index"
						:class="{ colour: i.type == '选择' && !i.color }"
						:style="{ backgroundColor: i.color, borderColor: i.id == active_color_id ? activeColor : 'transparent' }"
						@click="changeColor(i)">
					</view>
				</view>
				<view class="tuxing_box">
					<view class="title_box">
						<image :src="iconPath.close" mode="aspectFit" @click="cancel" />
						<text class="title">{{ active_label }}</text>
						<image :src="iconPath.confirm" mode="aspectFit" @click="confirm" />
					</view>
					<view class="select_box">
						<view class="num_box">
							<view class="icon" :style="tx_type_activate === '笔' ? `background-color:${activeColor}` : ''"
								@click="changeType('笔')">
								<image :src="iconPath.pen" mode="aspectFit" />
							</view>
							<view class="icon" :style="tx_type_activate === '橡皮' ? `background-color:${activeColor}` : ''"
								@click="changeType('橡皮')">
								<image :src="iconPath.rubber" mode="aspectFit" />
							</view>
							<view class="slider">
								<slider :value="pen_size" :activeColor="activeColor" :block-color="activeColor"
									block-size="20" :min="1" :max="40" :step="0.2" @change="sliderChange"
									@changing="sliderChange" />
							</view>
						</view>
						<scroll-view :show-scrollbar="false" class="tuxing_list_scroll" :scroll-y="true">
							<view class="tuxing_list">
								<view class="item" v-for="(i, index) in tx_list" :key="index"
									:style="i.name == tx_list_activate ? `background-color:${activeColor}` : ''"
									@click="listClick(i)">
									<image :src="i.icon" mode="aspectFit" />
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<chj-color-picker ref="chj-color-picker" :defaultColor='color' :isCover="isCover" @change="subColor"
				@cancel="cancelColorPicker"></chj-color-picker>
			<input ref="chj_imgEdit_input" class="chj_imgEdit_text" type="text" v-model="text" :focus="textFocus"
				:cursor="text.length" :adjust-position="false" :auto-blur="true" @input="input"
				@blur="textFocus = false" />
		</view>
	</view>

</template>

<script>


// 判断鼠标是否点击到矩形的边
function isNearEdge({ x, y }, rect) {
	const margin = 20; // 判断边缘的容忍范围
	if (Math.abs(x - rect.x) < margin) {
		rect.edge = 'left';
		return true;
	} else if (Math.abs(x - (rect.x + rect.width)) < margin) {
		rect.edge = 'right';
		return true;
	} else if (Math.abs(y - rect.y) < margin) {
		rect.edge = 'top';
		return true;
	} else if (Math.abs(y - (rect.y + rect.height)) < margin) {
		rect.edge = 'bottom';
		return true;
	}
	return false;
}
let initialTouches = []; // 初始触摸点
let initialDistance = 0;  // 初始距离
let initialCenter = { x: 0, y: 0 }; // 初始中心点
// 是否两指操作
let isTowTouch = false;
// 计算两点之间的距离
function getDistance(touch1, touch2) {
	const dx = touch2.x - touch1.x;
	const dy = touch2.y - touch1.y;
	return Math.sqrt(dx * dx + dy * dy); // 使用勾股定理计算距离
}

// 计算两触摸点的中心点
function getCenter(touch1, touch2) {
	return {
		x: (touch1.x + touch2.x) / 2,
		y: (touch1.y + touch2.y) / 2
	};
}
// 判断触摸事件是平移还是放大/缩小
function checkTouchOperation(startTouches, currentTouches) {
	const startDistance = getDistance(startTouches[0], startTouches[1]);
	const currentDistance = getDistance(currentTouches[0], currentTouches[1]);

	const startCenter = getCenter(startTouches[0], startTouches[1]);
	const currentCenter = getCenter(currentTouches[0], currentTouches[1]);

	// 判断是否为放大/缩小操作
	if (Math.abs(currentDistance - startDistance) > 50) {  // 距离变化超过10像素，认为是放大或缩小
		// 倍率
		const scale = 0.001;
		if (currentDistance > startDistance) {
			return { type: '放大', scale: (currentDistance - startDistance) * scale };
		} else {
			return { type: '缩小', scale: (currentDistance - startDistance) * scale };
		}
	} else {
		// 判断是否为平移操作
		const moveDistance = {
			x: currentCenter.x - startCenter.x,
			y: currentCenter.y - startCenter.y
		};
		return { type: '移动', x: moveDistance.x, y: moveDistance.y };
	}

}
function preventScroll(e) {
	e.preventDefault(); // 阻止触摸滚动
};
export default {
	props: {
		// 激活的颜色
		activeColor: {
			type: String,
			default: '#FFCC33'
		},
		// 完成编辑时是否是整个画布
		isAllCanvas: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			// 缩放倍率
			scale: 1,
			// 偏移量
			x: 0,
			y: 0,
			// 是否在取消时提示
			isCancelToast: true,
			// 取消提示内容
			cancelText: '内容未保存，确定退出吗？',
			// 是否在确定时提示
			isConfirmToast: true,
			// 确定提示内容
			confirmText: '确定完成编辑吗？',
			show: false,
			path: '',
			// 是否被覆盖
			isCover: false,
			// 操作list
			tx_list: [
				{
					name: "画笔",
					label: "画笔",
					icon: `data:image/png;base64,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`
				},
				{
					name: "矩形",
					label: "矩形",
					icon: `data:image/png;base64,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`
				},
				{
					name: "圆形",
					label: "圆形",
					icon: `data:image/png;base64,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`
				},
				// {
				// 	name:"横线",
				// 	label:"直线",
				// 	icon:`data:image/png;base64,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`
				// },
				// {
				// 	name:"箭头",
				// 	label:"箭头",
				// 	icon:`data:image/png;base64,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`
				// },
				// {
				// 	name:"文本",
				// 	label:"文本",
				// 	icon:`data:image/png;base64,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`
				// },
				// {
				// 	name:"裁剪",
				// 	label:"裁剪",
				// 	icon:`data:image/png;base64,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`
				// },
				// {
				// 	name:"翻转",
				// 	label:"翻转",
				// 	icon:`data:image/png;base64,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`
				// }
			],
			// 当前激活的操作
			tx_list_activate: '画笔',
			// 当前激活的是笔还是橡皮
			tx_type_activate: '笔',
			// 主要绘画canvas上下文对象
			ctx: null,
			// 背景canvas上下文对象
			ctx_bg: null,
			// 回显canvas
			ctx_hx: null,
			// 文本canvas
			ctx_text: null,
			// 保存canvas
			ctx_save: null,
			// 裁剪canvas
			ctx_cj: null,
			// 裁剪数据
			cj_data: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				dragging: false, // 是否在拖动
				edge: null, // 当前拖动的边
			},
			// 笔或橡皮的大小
			pen_size: 10,
			// 选择的颜色
			color: '#ff0000',
			// 当前笔的颜色
			pan_color: '#000',
			// 绘画历史记录
			history_list: [],
			// 历史记录指针，记录当前是第几步
			history_index: -1,
			// 颜色list
			color_list: [
				{ id: '1', type: '默认', color: '#000' },
				// { id: '2', type: '默认', color: '#fff' },
				// { id: '3', type: '默认', color: '#ff0000' },
				// { id: '4', type: '默认', color: '#ffaa00' },
				// { id: '5', type: '默认', color: '#00aa00' },
				// { id: '6', type: '默认', color: '#0055ff' },
				// { id: '7', type: '默认', color: '#aa00ff' },
				// { id: '8', type: '选择', color: '' },
			],
			// 选中的颜色
			active_color_id: '1',
			// 落笔的位置
			moveTo: { x: 0, y: 0 },
			// 插入文本
			text: '点击输入文字',
			// 画箭头的长度
			headlen: 20,
			// 文本list
			textList: [],
			// 是否唤起键盘
			textFocus: false,
			// 图标
			iconPath: {
				// 复位
				positionReset: `data:image/png;base64,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`,
				// 前进可点击状态
				goForward_active: `data:image/png;base64,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`,
				// 前进不可点击状态
				goForward_inactive: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAC81JREFUeF7tnVFy1DgQhq3AQcJJSE6y5BBxKk8LTxTmEIST7HAS5iDxzKKUZ3dqimBZ6pZa0pcXHsaSpb/7o7slW3YDfyiAAq8q4NAGBVDgdQUABO9AgT8oACC4BwoACD6AAnEKEEHidKNVJwoASCeGZppxCgBInG606kQBAOnE0EwzTgEAidONVp0oACCdGJppxikAIHG60aoTBQCkE0MzzTgFACRON1p1ogCAdGJophmnAIDE6UarThQAkE4MLTXNr1+/3hyPx2vn3P75+Xn/+Pi4l+rbYj8AYtEqxsa0QPHXMAwffjO03TAM3+d53rUIC4AYc0Zrw/ny5ctH59zfAePazfN81xokABJg+V4v2QDHSaL9PM+3LUECIL16/8q8l7Tqnwh5moIEQCI8oIcm0zT9HIbhOnKuzUACIJEe0HKzz58/X79588YDkvLXBCQAkuICjbaNqD1eU6J6SACkUSdPmZYgIH4YVUMCICme1GjbaZq+vbLnETvjaiEBkFiTN9xumia/IeghkfyrEhIAkXSBRvpKWOJdU6A6SABkzaSd/p64zPsn1aqCBEA6BWBt2ksU8WlW7F5IE5AAyJqndPy78GrWpZJVRBIA6RiAkKn3DgmAhHhJ59f0DAmAdO78odPvFRIACfUQrht6hARAcPxNCvQGCYBscg8u9gr0BAmA4PNRCvQCCYBEuQeNeokkAIKvJynQeiQBkCT3oHHrkQRA8HERBVqNJAAi4h500mokARB8W1SB1iIJgIi6B521FkkABJ9WUaCVSAIgKu5Bp61EEgDBl1UVqD2SAIiqe9B57ZEEQPDhLArUGkkAZBiG01eThmF4v3jL6aCC8wMLNA4vyOKcndxE5R337gBZDkXzINxcwNCJHzU9TXFImgfkAgiiQNN8vExOFJImAVmg8N/UO0WJ9t2CGf6nwPF4/PTw8PBRQpJmADmLFL/70KSEVvRRkQLOudv7+3v/gdGkv+oBWcDwH5kkfUpyheYa78ZxvE2dVbWAKC8bpupKewMKzPP8LvWDotUBovDtCgOmZAgaCnQFCBFDw4Xa7lOiDjEfQZZNPF9jsCLVtj+Lz24cx2T/Tu5AfFZLh8uXVv3x+4ChJXLb/e7HcXyXOkWTgCh9AixVK9rXpcDTOI53qUM2B8g0Tf8QNVLNSnuJAt2raAYQag2cWkqB5nbSSamkXIN+fmUfIhuEJyWLRxBSKpxaUAFROIqnWMbh2C+Gu/xX0J5ddeUfBdJckRSHoxggxpZwnxY3/eH/ned5l/p4QlduHzDZDPZWgaMIIBnEWjOZjwj+Kc8fwLAmVfrvGeytBkd2QBaxfqbLHtXD0zzPn4gOUdpFNaodjqyALGL5PY6cj6U/Oee+S7wXEOUhHTdqAY6sgGQuyIkWBeFsBY5sgGSEAzAKguFv3RIcWQDJBMdunuc76ouydLQGhzogGd7h2Dvn7qgxyoLRYuQ4Kaq2k748W+WLcq0/1eU9rUG32G+LkUMVEO3lXIk3xVp01BJzahkOtRRLse4gpSpBwSv3bB0OFUAU6w5SKuDIroBoDaJYdwBHdtd4/YY9RA6VGmSaJv8YifROucirk4b8q+qh9ASHaIqlkVpJvhlWtVcaGXxvcIgBorRqReQwAkbL+xxrEovUIAqrVtQca5bL+HuPkUOsBlEozIEjo/Ov3apnOERSLOHCXOSwrzWj83uYAr3DkQyIdGHODnmY4+a6SiF1Ph96FZlCUg0iGT1Yscrl9mH3kf7P7+KuVcCRFEGEa49qBAtzr/qvmqbpqDSLqmwdHUEko4fUMZFKBu2uW+H//KpLq84HHAWIpICkVvb4U0qvqoocScu8gl95YtXKHh+DAiBVwhFVg0jumrNqZZCOYZAGpFo4ogAR/N+F6GGTj0HwMPGq4YgCRKo4J3oYpWMZloCdq4djMyCC6RXRwzYfqWlWE3BsBkQwvbobx/F0aLRxV+lzeAknYTYDx2ZABMKuvyfRoxLmIiBp7hWF4H0QqfSKfY9K6DgbZsCyfrOHaQQDIrWyIfHt6vpcrP4R+83hw+Fw45x7f/Za9ctnJFpOl4MBEao/SK/qZ6WrGQQDIlF/kF515VtNTDYIEKn6g/SqCZ/pahJBgAjVH6RXXblWG5MNAkSi/iC9asNheptFECABy3yruvFoyapEXGBQgVBA/GcMkr5xTf1h0PoMaVWBUEBSX7+k/lg1BRdYVGAVEKEVrKaez7FoSMako8AqIBKv11Kg6xiPXvUVWAVEYokXQPQNyR10FMgCCCtYOsajV30FVgGR2AMBEH1DcgcdBbIAwrlXOsajV30FAERfY+5QsQKrgEjsorNJWLGHdD50AOncAZj+nxXIAgg1CG5YqwIAUqvlGHcWBVYBkVjmJYJksSU3UVAAQBREpct2FFgFROJREzYK23GY3maSBZBhGDhJsTfPamS+uQBp7sS9RuzPNFYUWAVE4nH3XweNAQiuWKUCq4D4WQl80JEXpqp0DwYdCsjPs+Mmo1RjqTdKNhoVViAUkORDGwCksKW5fZQCoYB8+/XZgg9Rd/i/EStZiQLSPL8CoYB4ODwkKX/UISnq0baIAkGACK1kDaRZRWzMTRMUCAJkWclKLtTZUU+wFE2LKLAFEIk6hP2QImbmprEKbAFEog4hzYq1FO2KKBAMiFQdwnNZRezMTSMVCAZEqg7hsZNIS9GsiAJbAZGoQ0izipiam8YosAkQqTSLo0hjTEWbEgpsAkQwzSKKlLA299yswGZAJN5R96Mkimy2FQ0KKLAZEKk0y8+VnfUCFueWmxTYDIhkmkUU2WQrLi6gQBQgUmkWUaSAxbnlJgWiAJGMIr8eo9/P83z7+Pi43zRyLkaBDApEAyIZRUi1MliaW0QpEA2IcBShYI8yH420FUgCRDKKkGppm5r+YxRIAmT5RLR/X/065uaXbUi1JFSkD0kFkgDxAxGOImwgSlqXvpIVSAZEuhbx/RFJku1KB0IKiAAiHUWWuXEKipCR6SZeARFANKKI75NHUeINS0sZBcQAkS7YT9MDEhlD00ucAmKAaBTsZ1Mi3YqzL60SFRAFRCvVonBPtDLNoxUQB0Qr1TpBcjgcnnhuK9reNNyogDggyqmW7343z/MdkGy0NJdHKaACSAZI9s65u/v7+13UrGmEAoEKqAGiWY+cze1pnudPRJNAa3PZZgVUAdGsRy5myirXZtPTIEQBVUD8ADJCsnPOfSLtCjE714QqoA6IH8hy0IM/dE7kqd+VyQFKqPW5blWBLICcFe1/ZYLkZbXLR5Tn5+c9NcqqH3DBKwpkAyTDytZrRt4fj8fv7J/AQIwCWQEpFEnOddkdj8cfV1dXOyJLjLv01yY7IAVqkj9ZFWD68/lNMy4CiDFILgV72Xz0keb0g3Mu6Ugi356ItckvzVxcDJDMS8BWBH+JWNRDVsyxPo6igJxB4peAb9aH28wVPE9WiSmLA3LSaXltN+cycHET8TJYcROsDsAMIMbrklUhIy/g2NVI4XI1MwVIjykXJ7jkcvW4+5gD5DSNaZr8Z6f/zrjzHqegQKtxHM3aQWB6VXdh3jDTNIl8ONSylahF7FrHPCCd1CY8rm+UkSoAaT3tcs7d8pi+TUKqAqRVUKhBbMLhR1UlICc5M79nomXF/TiO77Q6p980BaoG5AIUv8nod+NzvJSVpvpZa5Z5xaRU6agJQM6VWaLKaXnYOixEDxW3luu0OUBO0vh34a+urj44594vUcUcLBTnco6s1VOzgFwK5iPL4XC4MQIM53ppebRwv90AcqmbjzBv37699tC8rFbkiTQvr/8+PDx8FLYj3Skp0C0ga3p6gPw1HqLTtcfjMSpNm+d5x8ERa4rb/B1AbNqFURlRAECMGIJh2FQAQGzahVEZUQBAjBiCYdhUAEBs2oVRGVEAQIwYgmHYVABAbNqFURlRAECMGIJh2FQAQGzahVEZUQBAjBiCYdhUAEBs2oVRGVEAQIwYgmHYVABAbNqFURlRAECMGIJh2FQAQGzahVEZUQBAjBiCYdhU4F8OgtoU2Q96AAAAAABJRU5ErkJggg==`,
				// 后退可点击状态
				retreat_active: `data:image/png;base64,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`,
				// 后退不可点击状态
				retreat_inactive: `data:image/png;base64,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`,
				// 重置
				reset: `data:image/png;base64,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`,
				// 取消
				close: `data:image/png;base64,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`,
				// 确定
				confirm: `data:image/png;base64,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`,
				// 笔
				pen: `data:image/png;base64,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`,
				// 橡皮
				rubber: `data:image/png;base64,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`,
			},
			// 旋转角度
			degrees: 0,
			// 背景图片位置
			bgPosition: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			bgPositionFlip_false: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
		}
	},
	mounted() {
		// #ifdef H5
		const element = document.getElementsByClassName('chj_imgEdit')[0];
		element.style.height = window.innerHeight + 'px';
		// #endif
		// #ifdef MP-WEIXIN
		this.isCover = true;
		// #endif
	},
	methods: {
		methods: {
			// 获取用户绘画的遮罩（返回临时图片路径）
			async getPaintingMask() {
				return new Promise((resolve, reject) => {
					// 目标画布的 canvas-id
					const canvasId = 'chj_imgEdit_canvas';

					// 获取画布实际尺寸（需根据实际布局调整，此处假设画布大小与容器一致）
					const query = uni.createSelectorQuery().in(this);
					query.select(`#${canvasId}`).boundingClientRect(data => {
						if (!data) {
							reject('未找到画布元素');
							return;
						}
						const { width, height } = data;

						// 导出画布内容（忽略缩放和偏移，直接取原始绘制内容）
						uni.canvasToTempFilePath({
							canvasId,
							width,  // 画布实际宽度
							height, // 画布实际高度
							destWidth: width,  // 导出图片宽度（与画布一致）
							destHeight: height, // 导出图片高度（与画布一致）
							success: res => {
								// res.tempFilePath 即为遮罩图片路径（透明背景+用户绘制内容）
								resolve(res.tempFilePath);
							},
							fail: err => {
								reject('导出遮罩失败：' + err.errMsg);
							}
						}, this);
					}).exec();
				});
			}
		},
		open(options) {
			// 底图路径
			this.path = options.path || '';
			// 是否在取消时提示
			this.isCancelToast = options.isCancelToast === undefined ? true : options.isCancelToast;
			// 是否在确定时提示
			this.isConfirmToast = options.isConfirmToast === undefined ? true : options.isConfirmToast;;
			// 退出提示内容
			this.cancelText = options.cancelText || '内容未保存，确定退出吗？';
			// 确定提示内容
			this.confirmText = options.confirmText || '确定完成编辑吗？';
			this.initScaleAndTranslate();
			// 设置图标
			if (Object.prototype.toString.call(options.iconPath) === '[object Object]') {
				for (let key in options.iconPath) {
					this.iconPath[key] = options.iconPath[key];
				}
			}
			// 设置涂鸦图标
			if (Object.prototype.toString.call(options.iconPathGraffiti) === '[object Object]') {
				for (let key in options.iconPathGraffiti) {
					this.tx_list[Number(key)].icon = options.iconPathGraffiti[key];
				}
			}
			this.show = true;
			this.$nextTick(() => {
				// 重置所有状态后再初始化画布
				this.resetAllState();
				this.initCanvas();
				 
			});
		},
		
		// 重置所有状态
		resetAllState() {
			// 重置操作状态
			this.tx_list_activate = '画笔';
			this.tx_type_activate = '笔';
			// 重置颜色
			this.pan_color = '#000000';
			this.active_color_id = '1';
			// 重置笔刷大小
			this.pen_size = 50;
			// 清空历史记录
			this.history_list = [];
			this.history_index = -1;
			// 清空文本
			this.textList = [];
			// 重置旋转角度
			this.degrees = 0;
			// 重置裁剪数据
			this.cj_data = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				dragging: false,
				edge: null
			};
			// 重置背景位置
			this.bgPosition = {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
			this.bgPositionFlip_false = {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
		},
		// 确定
		async confirm() {
			if (this.tx_list_activate == '裁剪') {
				const isCj = await this.showModal(true, '确定裁剪吗？');
				if (isCj) {
					await this.cjExecute();
				}
				this.ctx_cj.clearRect(0, 0, 10000, 10000);
				this.ctx_cj.draw();
				this.tx_list_activate = '画笔';
				return;
			}
			const is = await this.showModal(this.isConfirmToast, this.confirmText);
			if (is) {
				this.initScaleAndTranslate();
				this.ctx_save.clearRect(0, 0, 10000, 10000);
				this.ctx_save.draw();
				this.$nextTick(async () => {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					// 拿到文本canvas的图片路径
					this.textList = this.textList.map(i => ({ ...i, isActive: false }));
					this.drawText();
					// 画canvas
					const path = await this.canvasGetImagePath('chj_imgEdit_canvas_bg');
					await this.drawImageToCenter(this.ctx_save,'#chj_imgEdit_canvas_bg',path);
					const tuyaPath = await this.canvasGetImagePath('chj_imgEdit_canvas');
					await this.drawImageToCenter(this.ctx_save, '#chj_imgEdit_canvas_bg', tuyaPath);
					const textPath = await this.canvasGetImagePath('chj_imgEdit_canvas_text');
					await this.drawImageToCenter(this.ctx_save, '#chj_imgEdit_canvas_bg', textPath);
					let tempFilePath;
					if (this.isAllCanvas) {
						// 拿到最终的绘画路径
						tempFilePath = await this.canvasGetImagePath('chj_imgEdit_canvas_save');
					} else {
						// 拿到最终的绘画路径
						tempFilePath = await this.canvasGetImagePath('chj_imgEdit_canvas_save', this.bgPosition);
					}
					
					// 获取遮罩图路径（绘制路径透明，其余部分纯色）
					const maskFilePath = await this.createTransparentMask();
					
					console.log('confirm方法 - 原图路径:', this.path);
					console.log('confirm方法 - 遮罩路径:', maskFilePath);
					
					// 返回原图和遮罩图路径
					const emitData = {
						originPath: this.path,  // 原图路径
						maskPath: maskFilePath  // 遮罩图路径（绘制路径透明，其余部分纯色）
					}
					
					console.log('confirm方法 - 发送数据:', emitData);
					this.$emit('confirm', emitData);
					this.show = false;
					uni.hideLoading();
					// #ifdef H5
					// 取消阻止触摸屏幕时页面滚动
					window.removeEventListener('touchmove', preventScroll, { passive: false });
					// #endif
				});
			}
		},
		// 创建透明遮罩（绘制路径为透明，其余部分为纯色）
		async createTransparentMask() {
			try {
				const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
				const [{ width: imageWidth, height: imageHeight }, canvasRect] = await Promise.all([
					this.imgInfo(this.path),
					this.getNodeInfo('#chj_imgEdit_canvas')
				]);
				const rawCanvasWidth = canvasRect && typeof canvasRect.width === 'number' ? canvasRect.width : imageWidth;
				const rawCanvasHeight = canvasRect && typeof canvasRect.height === 'number' ? canvasRect.height : imageHeight;
				const canvasWidth = Math.max(Math.round(rawCanvasWidth), 1);
				const canvasHeight = Math.max(Math.round(rawCanvasHeight), 1);
				const drawingFullPath = await new Promise((resolve, reject) => {
					uni.canvasToTempFilePath({
						canvasId: 'chj_imgEdit_canvas',
						x: 0,
						y: 0,
						width: canvasWidth,
						height: canvasHeight,
						destWidth: canvasWidth,
						destHeight: canvasHeight,
						fileType: 'png',
						success: (res) => resolve(res.tempFilePath),
						fail: (err) => reject(err)
					}, this);
				});
				let sourceX = 0;
				let sourceY = 0;
				let sourceWidth = canvasWidth;
				let sourceHeight = canvasHeight;
				let destWidth = canvasWidth;
				let destHeight = canvasHeight;
				const hasBgPosition = !this.isAllCanvas && this.bgPosition && typeof this.bgPosition.x === 'number' && typeof this.bgPosition.y === 'number' && typeof this.bgPosition.width === 'number' && typeof this.bgPosition.height === 'number';
				if (hasBgPosition) {
					const safeX = clamp(this.bgPosition.x, 0, canvasWidth);
					const safeY = clamp(this.bgPosition.y, 0, canvasHeight);
					const maxWidth = Math.max(canvasWidth - safeX, 0.5);
					const maxHeight = Math.max(canvasHeight - safeY, 0.5);
					const safeWidth = clamp(this.bgPosition.width, 0.5, maxWidth);
					const safeHeight = clamp(this.bgPosition.height, 0.5, maxHeight);
					sourceX = safeX;
					sourceY = safeY;
					sourceWidth = safeWidth;
					sourceHeight = safeHeight;
					const displayWidth = this.bgPosition.width || safeWidth;
					const displayHeight = this.bgPosition.height || safeHeight;
					const scaleX = imageWidth > 0 && displayWidth > 0 ? imageWidth / displayWidth : 1;
					const scaleY = imageHeight > 0 && displayHeight > 0 ? imageHeight / displayHeight : 1;
					destWidth = Math.max(Math.round(safeWidth * (scaleX || 1)), 1);
					destHeight = Math.max(Math.round(safeHeight * (scaleY || 1)), 1);
				}
				const captureWidth = Math.max(Math.round(sourceWidth), 1);
				const captureHeight = Math.max(Math.round(sourceHeight), 1);
				return await new Promise((resolve) => {
					const maskCtx = uni.createCanvasContext('mask_process_canvas', this);
					maskCtx.clearRect(0, 0, captureWidth, captureHeight);
					maskCtx.setFillStyle('#FFFFFF');
					maskCtx.fillRect(0, 0, captureWidth, captureHeight);
					maskCtx.globalCompositeOperation = 'destination-out';
					maskCtx.drawImage(
						drawingFullPath,
						sourceX,
						sourceY,
						sourceWidth,
						sourceHeight,
						0,
						0,
						captureWidth,
						captureHeight
					);
					maskCtx.globalCompositeOperation = 'source-over';
					maskCtx.draw(false, () => {
						uni.canvasToTempFilePath({
							canvasId: 'mask_process_canvas',
							x: 0,
							y: 0,
							width: captureWidth,
							height: captureHeight,
							destWidth,
							destHeight,
							fileType: 'png',
							success: (maskRes) => resolve(maskRes.tempFilePath),
							fail: (err) => {
								console.error('遮罩导出失败:', err);
								resolve(drawingFullPath);
							}
						}, this);
					});
				});
			} catch (error) {
				console.error('创建遮罩失败:', error);
				return await this.canvasGetImagePath('chj_imgEdit_canvas');
			}
		},
		// 创建遮罩的备选方案
		createMaskFallback(tempFilePath, width, height, resolve) {
			// 创建遮罩canvas上下文
			const maskCtx = uni.createCanvasContext('mask_process_canvas', this);
			
			// 填充透明背景
			maskCtx.clearRect(0, 0, width, height);
			maskCtx.draw();
			
			// 等待清空完成
			setTimeout(() => {
				// 绘制原始图像
				maskCtx.drawImage(tempFilePath, 0, 0, width, height);
				maskCtx.draw(false, () => {
					// 导出处理后的遮罩
					uni.canvasToTempFilePath({
						canvasId: 'mask_process_canvas',
						success: (maskRes) => {
							resolve(maskRes.tempFilePath);
						},
						fail: () => {
							// 失败时返回原始路径
							resolve(tempFilePath);
						}
					}, this);
				});
			}, 100);
		},
		// 取消
		async cancel() {
			const is = await this.showModal(this.isCancelToast, this.cancelText);
			if (is) {
				this.$emit('cancel');
				this.show = false;
				// #ifdef H5
				// 取消阻止触摸屏幕时页面滚动
				window.removeEventListener('touchmove', preventScroll, { passive: false });
				// #endif
			}
		},
		// 初始化偏移量和缩放倍率
		initScaleAndTranslate() {
			// 清空缩放效率及偏移量
			this.scale = 1;
			this.x = 0;
			this.y = 0;
		},
		// 初始化canvas
		// 初始化canvas
		initCanvas() {
			// #ifdef H5
			// 阻止触摸屏幕时页面滚动
			window.addEventListener('touchmove', preventScroll, { passive: false });
			// #endif
			this.ctx = uni.createCanvasContext('chj_imgEdit_canvas', this); // 获取画图canvas上下文对象。
			this.ctx_bg = uni.createCanvasContext('chj_imgEdit_canvas_bg', this); // 获取背景图canvas上下文对象。
			// 初始化回显canvas
			this.ctx_hx = uni.createCanvasContext('chj_imgEdit_canvas_hx', this);
			// 初始化文本canvas
			this.ctx_text = uni.createCanvasContext('chj_imgEdit_canvas_text', this);
			// 初始化保存canvas
			this.ctx_save = uni.createCanvasContext('chj_imgEdit_canvas_save', this);
			// 裁剪canvas
			this.ctx_cj = uni.createCanvasContext('chj_imgEdit_canvas_cj', this);
			// 清空所有canvas
			this.ctx.clearRect(0, 0, 10000, 10000);
			this.ctx_bg.clearRect(0, 0, 10000, 10000);
			this.ctx_hx.clearRect(0, 0, 10000, 10000);
			this.ctx_text.clearRect(0, 0, 10000, 10000);
			this.ctx_save.clearRect(0, 0, 10000, 10000);
			this.ctx_cj.clearRect(0, 0, 10000, 10000);
			
			// 设置背景画布为纯白色
			this.ctx_bg.setFillStyle('#FFFFFF');
			this.ctx_bg.fillRect(0, 0, 10000, 10000);
			this.ctx_bg.draw();
			
			this.ctx.draw();
			this.ctx_hx.draw();
			this.ctx_text.draw();
			this.ctx_save.draw();
			this.ctx_cj.draw();
			
			// 当前激活的操作
			this.tx_list_activate = '画笔';
			// 当前激活的是笔还是橡皮
			this.tx_type_activate = '笔';
			// 当前笔的颜色（黑色，用户可见）
			this.pan_color = '#000000';
			// 笔或橡皮的大小
			this.pen_size = 50;
			// 选中的颜色
			this.active_color_id = '1';
			// 绘画历史记录
			this.history_list = [];
			// 历史记录指针，记录当前是第几步
			this.history_index = -1;
			// 文本list
			this.textList = [];
			// 旋转角度
			this.degrees = 0;
			// 设置全部样式
			this.setCanvasStyle();
			// 把背景图片画到背景canvas
			this.drawImageToCenter(this.ctx_bg, '#chj_imgEdit_canvas_bg', this.path, true, true);
		},
		// 点击操作按钮
		async listClick(item) {
			if (item.name == '翻转') {
				this.drawRotatedImage();
				return;
			}
			if (this.tx_list_activate == '裁剪' && item.name != '裁剪') {
				const isCj = await this.showModal(true, '确定裁剪吗？');
				if (isCj) {
					await this.cjExecute();
				}
			}
			if (item.name == '文本') {
				this.addText();
			} else {
				this.textList = this.textList.map(i => ({ ...i, isActive: false }));
				this.drawText();
			}
			this.tx_list_activate = item.name;
			if (item.name == '裁剪') {
				// 获取canvas的宽高
				const { width, height } = await this.getNodeInfo('#chj_imgEdit_canvas_cj');
				// 裁剪初始范围
				const pyl = 20;
				this.cj_data = {
					x: pyl,
					y: pyl,
					width: width - (pyl * 2),
					height: height - (pyl * 2)
				}
				this.initScaleAndTranslate();
				this.drawCj({ x: undefined, y: undefined });
			} else {
				this.ctx_cj.clearRect(0, 0, 10000, 10000);
				this.ctx_cj.draw();
			}
		},
		// 绘制翻转背景
		drawRotatedImage() {
			this.initScaleAndTranslate();
			this.$nextTick(async () => {
				// 1. 获取图片信息（宽高）
				const { width: imgWidth, height: imgHeight } = await this.imgInfo(this.path);
				const { width: canvasWidth, height: canvasHeight } = await this.getNodeInfo('#chj_imgEdit_canvas_bg');
				this.degrees += 90;
				if (this.degrees > 270) {
					this.degrees = 0;
				}
				this.ctx_bg.save();
				// 移动到画布中心
				this.ctx_bg.translate(canvasWidth / 2, canvasHeight / 2);
				// 转换为弧度并旋转
				const radians = this.degrees * Math.PI / 180;
				this.ctx_bg.rotate(radians);
				// 计算旋转后的虚拟尺寸
				let rotatedWidth, rotatedHeight;
				if (this.degrees % 180 === 0) {
					rotatedWidth = imgWidth;
					rotatedHeight = imgHeight;
				} else {
					rotatedWidth = imgHeight;
					rotatedHeight = imgWidth;
				}
				// 计算适应画布的最大缩放比例
				const scaleX = canvasWidth / rotatedWidth;
				const scaleY = canvasHeight / rotatedHeight;
				const scale = Math.min(scaleX, scaleY); // 取较小值保证完整显示
				// 应用缩放
				this.ctx_bg.scale(scale, scale);
				// 计算绘制位置（始终居中）
				const dx = -imgWidth / 2;
				const dy = -imgHeight / 2;
				if (this.degrees == 90 || this.degrees == 270) {
					// 获取图片的宽高
					const { width, height } = await this.imgInfo(this.path);
					// 获取canvas的宽高
					const { width: canvasWidth, height: canvasHeight } = await this.getNodeInfo('#chj_imgEdit_canvas_bg');
					let dx, dy, dWidth, dHeight;
					if (width >= height) {
						dy = 0;
						dHeight = canvasHeight;
						// 按照比例计算宽度
						dWidth = canvasHeight / width * height;
						dx = (canvasWidth - dWidth) / 2;
					} else {
						dx = 0;
						dWidth = canvasWidth;
						// 按照比例计算高度
						dHeight = canvasWidth / height * width;
						dy = (canvasHeight - dHeight) / 2;
					}
					this.bgPosition = {
						x: dx,
						y: dy,
						width: dWidth,
						height: dHeight
					}
				} else {
					this.bgPosition = this.bgPositionFlip_false;
				}
				// 绘制图片
				this.ctx_bg.drawImage(this.path, dx, dy, imgWidth, imgHeight);
				this.ctx_bg.restore();
				this.ctx_bg.draw(); // 强制重绘
			})
		},
		// 执行裁剪
		async cjExecute() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.textList = this.textList.map(i => ({ ...i, isActive: false }));
			this.drawText();
			// 画canvas
			const path = await this.canvasGetImagePath('chj_imgEdit_canvas_bg');
			await this.drawImageToCenter(this.ctx_save, '#chj_imgEdit_canvas_bg', path);
			const tuyaPath = await this.canvasGetImagePath('chj_imgEdit_canvas');
			await this.drawImageToCenter(this.ctx_save, '#chj_imgEdit_canvas_bg', tuyaPath);
			const textPath = await this.canvasGetImagePath('chj_imgEdit_canvas_text');
			await this.drawImageToCenter(this.ctx_save, '#chj_imgEdit_canvas_bg', textPath);
			// 拿到最终的绘画路径
			const tempFilePath = await this.canvasGetImagePath('chj_imgEdit_canvas_save', this.cj_data);
			await this.clearCanvas(this.ctx_bg);
			await this.clearCanvas(this.ctx);
			await this.clearCanvas(this.ctx_save);
			await this.drawImageToCenter(this.ctx_bg, '#chj_imgEdit_canvas_bg', tempFilePath, false, true);
			this.path = tempFilePath;
			this.textList = [];
			this.drawText();
			this.history_list = [];
			this.history_index = -1;
			uni.hideLoading();
		},
		// 手指触摸动作开始
		touchstart(e) {
			if (Object.prototype.toString.call(e.touches) === '[object Object]') {
				if (e.touches[1]) {
					e.touches = [e.touches[0], e.touches[1]];
				} else {
					e.touches = [e.touches[0]];
				}
			}
			if (e.touches.length === 2 && this.tx_list_activate != '裁剪') {
				initialTouches = [
					{ x: e.touches[0].x, y: e.touches[0].y },
					{ x: e.touches[1].x, y: e.touches[1].y }
				];
				initialDistance = getDistance(initialTouches[0], initialTouches[1]);
				initialCenter = getCenter(initialTouches[0], initialTouches[1]);
				// 是否是两指操作
				isTowTouch = true;
				return;
			}
			e.touches[0].x /= this.scale;
			e.touches[0].y /= this.scale;
			// 判断点击的是哪条边
			if (isNearEdge(e.touches[0], this.cj_data)) {
				this.cj_data.dragging = true;
			}
			// 画图
			this.moveTo = { x: e.touches[0].x, y: e.touches[0].y };
			if (this.tx_list_activate == '画笔') this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
			// 画线
			// this.drawLine(e.touches[0]);
			// 画矩形回显
			this.drawRectHX(e.touches[0]);
			// 画橡皮回显
			this.drawEraserHX(e.touches[0]);
			// 画圆回显
			this.drawCircleHX(e.touches[0]);
			// 画横线回显
			this.drawHorizontalLineHX(e.touches[0]);
			// 画箭头回显
			this.drawAarrowHX(e.touches[0]);
			// 文本点击事件
			this.isInAreaClick(e.touches[0]);
		},
		// 手指触摸后移动
		touchmove(e) {
			if (e.touches[0].x == undefined && e.touches[0].y == undefined) {
				e.touches[0].x = e.touches[0].clientX;
				e.touches[0].y = e.touches[0].clientY;
			}
			if (isTowTouch && this.tx_list_activate != '裁剪') {
				if (Object.prototype.toString.call(e.touches) === '[object Object]') {
					if (e.touches[1]) {
						e.touches = [e.touches[0], e.touches[1]];
					} else {
						e.touches = [e.touches[0]];
					}
				}
				if (e.touches.length === 2) {
					if (e.touches[1].x == undefined && e.touches[1].y == undefined) {
						e.touches[1].x = e.touches[1].clientX;
						e.touches[1].y = e.touches[1].clientY;
					}
					const currentTouches = [
						{ x: e.touches[0].x, y: e.touches[0].y },
						{ x: e.touches[1].x, y: e.touches[1].y }
					];
					const obj = checkTouchOperation(initialTouches, currentTouches);
					if (obj.type == '放大') {
						if (this.scale > 10) return;
						// #ifndef MP-WEIXIN
						this.scale += obj.scale;
						// #endif
					} else if (obj.type == '缩小') {
						if (this.scale < 0.5) return;
						// #ifndef MP-WEIXIN
						this.scale += obj.scale;
						// #endif
					} else if (obj.type == '移动') {
						// #ifndef MP-WEIXIN
						this.x += obj.x;
						this.y += obj.y;
						// #endif
					}
					return;
				}
			}
			e.touches[0].x /= this.scale;
			e.touches[0].y /= this.scale;
			// 画线回显
			this.drawLine(e.touches[0]);
			// 画矩形回显
			this.drawRectHX(e.touches[0]);
			// 画橡皮回显
			this.drawEraserHX(e.touches[0]);
			// 画圆回显
			this.drawCircleHX(e.touches[0]);
			// 画横线回显
			this.drawHorizontalLineHX(e.touches[0]);
			// 画箭头回显
			this.drawAarrowHX(e.touches[0]);
			// 文本移动事件
			this.isInAreaMove(e.touches[0]);
			// 裁剪
			this.drawCj(e.touches[0]);
		},
		// 手指触摸动作结束
		touchend(e) {
			if (this.tx_list_activate == '裁剪') {
				this.cj_data.dragging = false;
				return;
			}
			if (isTowTouch && this.tx_list_activate != '裁剪') {
				initialTouches = []; // 初始触摸点
				initialDistance = 0;  // 初始距离
				initialCenter = { x: 0, y: 0 }; // 初始中心点
				const time = setTimeout(() => {
					isTowTouch = false;
					clearTimeout(time);
				}, 50);
				return;
			}
			if (e.changedTouches[0].x == undefined && e.changedTouches[0].y == undefined) {
				e.changedTouches[0].x = e.changedTouches[0].clientX;
				e.changedTouches[0].y = e.changedTouches[0].clientY;
			}
			e.changedTouches[0].x /= this.scale;
			e.changedTouches[0].y /= this.scale;
			this.ctx.draw(true);
			// 清空回显canvas
			this.ctx_hx.clearRect(0, 0, 10000, 10000);
			this.ctx_hx.draw();
			// 圆形
			this.drawCircle(e.changedTouches[0]);
			// 矩形
			this.drawRect(e.changedTouches[0]);
			// 横线
			this.drawHorizontalLine(e.changedTouches[0]);
			// 箭头
			this.drawAarrow(e.changedTouches[0]);
			// 保存绘画记录
			this.save();
		},
		// 获取触摸的颜色
		getColorRGBA({ x, y }) {
			return new Promise((resolve, reject) => {
				const imgData = uni.canvasGetImageData({
					canvasId: 'chj_imgEdit_canvas_bg',
					x,
					y,
					width: x + 1,
					height: y + 1,
					success: (res) => {
						resolve({
							R: res.data[0],
							G: res.data[1],
							B: res.data[2],
							A: res.data[3],
						});
					}
				}, this);
			})
		},
		// 画线方法
		drawLine({ x, y }) {
			if (this.tx_list_activate != '画笔' && this.tx_type_activate != '橡皮') return;
			// #ifdef MP-WEIXIN
			if (this.tx_type_activate != '橡皮') {
				this.setCanvasStyle();
				// 绘制圆形让用户看到路径
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.pen_size/2, 0, 2 * Math.PI);
				this.ctx.fill();
				this.ctx.draw(true);
			}
			// #endif
			// #ifndef MP-WEIXIN
			this.setCanvasStyle();
			// 绘制圆形让用户看到路径
			this.ctx.beginPath();
			this.ctx.arc(x, y, this.pen_size/2, 0, 2 * Math.PI);
			this.ctx.fill();
			this.ctx.draw(true);
			// #endif
		},
		drawLineHX({ x, y }) {
			if (this.tx_list_activate != '画笔' || this.tx_type_activate == '橡皮') return;
			this.setCanvasStyle();
			// 在回显canvas上绘制圆形
			this.ctx_hx.beginPath();
			this.ctx_hx.arc(x, y, this.pen_size/2, 0, 2 * Math.PI);
			this.ctx_hx.fill();
			this.ctx_hx.draw(true);
		},
		// 画矩形
		drawRect({ x, y }) {
			if (this.tx_list_activate != '矩形' || this.tx_type_activate == '橡皮') return;
			let width, heigth;
			let dx, dy;
			if (this.moveTo.x > x) {
				dx = x;
				width = this.moveTo.x - x;
			} else {
				dx = this.moveTo.x;
				width = x - this.moveTo.x;
			}
			if (this.moveTo.y > y) {
				dy = y;
				heigth = this.moveTo.y - y;
			} else {
				dy = this.moveTo.y;
				heigth = y - this.moveTo.y;
			}
			this.setCanvasStyle();
			this.ctx.rect(dx, dy, width, heigth);
			this.ctx.stroke();
			this.ctx.draw(true);
			this.$emit('getRectPosition', { x1: dx, y1: dy, x2: width + dx, y2: heigth + dy });
		},
		// 回显画矩形
		drawRectHX({ x, y }) {
			if (this.tx_list_activate != '矩形' || this.tx_type_activate == '橡皮') return;
			let width, heigth;
			let dx, dy;
			if (this.moveTo.x > x) {
				dx = x;
				width = this.moveTo.x - x;
			} else {
				dx = this.moveTo.x;
				width = x - this.moveTo.x;
			}
			if (this.moveTo.y > y) {
				dy = y;
				heigth = this.moveTo.y - y;
			} else {
				dy = this.moveTo.y;
				heigth = y - this.moveTo.y;
			}
			this.setCanvasStyle();
			this.ctx_hx.rect(dx, dy, width, heigth);
			this.ctx_hx.stroke();
			this.ctx_hx.draw();
		},
		// 画圆
		drawCircle({ x, y }) {
			if (this.tx_list_activate != '圆形' || this.tx_type_activate == '橡皮') return;
			let width, heigth;
			let dx, dy;
			if (this.moveTo.x > x) {
				width = this.moveTo.x - x;
				dx = x + (width / 2);
			} else {
				width = x - this.moveTo.x;
				dx = this.moveTo.x + (width / 2);
			}
			if (this.moveTo.y > y) {
				heigth = this.moveTo.y - y;
				dy = y + (heigth / 2);
			} else {
				heigth = y - this.moveTo.y;
				dy = this.moveTo.y + (heigth / 2);
			}
			// 半径
			const r = width > heigth ? width / 2 : heigth / 2;
			this.setCanvasStyle();
			this.ctx.arc(dx, dy, r, 0, 2 * Math.PI);
			this.ctx.stroke();
			this.ctx.draw(true);
		},
		// 回显画圆
		drawCircleHX({ x, y }) {
			if (this.tx_list_activate != '圆形' || this.tx_type_activate == '橡皮') return;
			let width, heigth;
			let dx, dy;
			if (this.moveTo.x > x) {
				width = this.moveTo.x - x;
				dx = x + (width / 2);
			} else {
				width = x - this.moveTo.x;
				dx = this.moveTo.x + (width / 2);
			}
			if (this.moveTo.y > y) {
				heigth = this.moveTo.y - y;
				dy = y + (heigth / 2);
			} else {
				heigth = y - this.moveTo.y;
				dy = this.moveTo.y + (heigth / 2);
			}
			// 半径
			const r = width > heigth ? width / 2 : heigth / 2;
			this.setCanvasStyle();
			this.ctx_hx.arc(dx, dy, r, 0, 2 * Math.PI);
			this.ctx_hx.stroke();
			this.ctx_hx.draw();
		},
		// 画横线
		drawHorizontalLine({ x, y }) {
			if (this.tx_list_activate != '横线' || this.tx_type_activate == '橡皮') return;
			this.setCanvasStyle();
			this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
			this.ctx.lineTo(x, y);
			this.ctx.stroke();
			this.ctx.draw(true);
			// 横线的长度 单位px
			const len = getDistance({ x: this.moveTo.x, y: this.moveTo.y }, { x, y }) * this.scale;
			this.$emit('getLineLength', len);
		},
		// 回显画横线
		drawHorizontalLineHX({ x, y }) {
			if (this.tx_list_activate != '横线' || this.tx_type_activate == '橡皮') return;
			this.setCanvasStyle();
			this.ctx_hx.moveTo(this.moveTo.x, this.moveTo.y);
			this.ctx_hx.lineTo(x, y);
			this.ctx_hx.stroke();
			this.ctx_hx.draw();
		},
		// 画箭头
		drawAarrow({ x, y }) {
			if (this.tx_list_activate != '箭头' || this.tx_type_activate == '橡皮') return;
			this.setCanvasStyle();
			this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
			this.ctx.lineTo(x, y);
			// 绘制箭头
			const angle = Math.atan2(y - this.moveTo.y, x - this.moveTo.x); // 计算角度
			this.ctx.lineTo(x - this.headlen * Math.cos(angle - Math.PI / 6), y - this.headlen * Math.sin(angle - Math.PI / 6));
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(x - this.headlen * Math.cos(angle + Math.PI / 6), y - this.headlen * Math.sin(angle + Math.PI / 6));
			this.ctx.stroke();
			this.ctx.draw(true);
		},
		// 回显画箭头
		drawAarrowHX({ x, y }) {
			if (this.tx_list_activate != '箭头' || this.tx_type_activate == '橡皮') return;
			this.setCanvasStyle();
			this.ctx_hx.moveTo(this.moveTo.x, this.moveTo.y);
			this.ctx_hx.lineTo(x, y);
			// 绘制箭头
			const angle = Math.atan2(y - this.moveTo.y, x - this.moveTo.x); // 计算角度
			this.ctx_hx.lineTo(x - this.headlen * Math.cos(angle - Math.PI / 6), y - this.headlen * Math.sin(angle - Math.PI / 6));
			this.ctx_hx.moveTo(x, y);
			this.ctx_hx.lineTo(x - this.headlen * Math.cos(angle + Math.PI / 6), y - this.headlen * Math.sin(angle + Math.PI / 6));
			this.ctx_hx.stroke();
			this.ctx_hx.draw();
		},
		// 添加文本
		async addText() {
			this.text = "点击输入文字";
			// 获取canvas的宽高
			const { width, height } = await this.getNodeInfo('#chj_imgEdit_canvas_text');
			// 计算文本的宽度
			this.ctx_text.setFontSize(this.pen_size);
			const { width: textWidth } = this.ctx_text.measureText(this.text);
			this.textList = this.textList.map(i => ({ ...i, isActive: false }));
			this.textList.unshift({
				text: this.text,
				isActive: true,
				x: width / 2,	// 中心点的定位x
				y: height / 2,	// 中心点的定位y
				zIndex: 1,	//层级，1为优先级高的
				textWidth,
				fontSize: this.pen_size,
				width: textWidth + 20,
				height: this.pen_size + 20,
				fontColor: this.pan_color,
				// 删除按钮的半径
				arcSize: 10,
			});
			this.drawText();
		},
		// 画出文本的位置
		drawText() {
			// 先清空画布
			this.ctx_text.clearRect(0, 0, 10000, 10000);
			// 删除没有内容的文本
			this.textList = this.textList.filter((i) => i.text || i.isActive);
			for (let i of this.textList) {
				if (i.isActive) {
					this.ctx_text.setStrokeStyle('#fff');
					this.ctx_text.strokeRect(i.x - i.width / 2, i.y - i.height / 2, i.width, i.height);
					// 画×
					const arcX = i.x - i.width / 2;
					const arcY = i.y - i.height / 2;
					this.ctx_text.arc(arcX, arcY, i.arcSize, 0, 2 * Math.PI);
					this.ctx_text.setFillStyle('#EEEEEE');
					this.ctx_text.fill();
					this.ctx_text.beginPath();
					this.ctx_text.moveTo(arcX - i.arcSize / 2, arcY - i.arcSize / 2);
					this.ctx_text.lineTo(arcX + i.arcSize / 2, arcY + i.arcSize / 2);
					this.ctx_text.moveTo(arcX + i.arcSize / 2, arcY - i.arcSize / 2);
					this.ctx_text.lineTo(arcX - i.arcSize / 2, arcY + i.arcSize / 2);
					this.ctx_text.setStrokeStyle('#000');
					this.ctx_text.stroke();
				}
				this.ctx_text.setFontSize(i.fontSize);
				this.ctx_text.setTextBaseline('middle');
				this.ctx_text.setFillStyle(i.fontColor);
				this.ctx_text.fillText(i.text, i.x - i.textWidth / 2, i.y, i.textWidth);
			}
			this.ctx_text.draw();
		},
		// 画出裁剪框
		drawCj({ x, y }) {
			if (this.tx_list_activate == '裁剪') {
				if (this.cj_data.dragging) {
					const dx = x - this.moveTo.x;
					const dy = y - this.moveTo.y;
					this.moveTo = { x, y };
					// 根据拖动的边，调整矩形
					if (this.cj_data.edge === 'left') {
						this.cj_data.x += dx;
						this.cj_data.width -= dx;
					} else if (this.cj_data.edge === 'right') {
						this.cj_data.width += dx;
					} else if (this.cj_data.edge === 'top') {
						this.cj_data.y += dy;
						this.cj_data.height -= dy;
					} else if (this.cj_data.edge === 'bottom') {
						this.cj_data.height += dy;
					}
				}
				this.ctx_cj.setLineWidth(5);
				this.ctx_cj.rect(this.cj_data.x, this.cj_data.y, this.cj_data.width, this.cj_data.height);
				this.ctx_cj.setStrokeStyle(this.activeColor);
				// 画出可缩放提示框
				const length = 20;
				const distance = 7;
				this.ctx_cj.moveTo(this.cj_data.x + length, this.cj_data.y - distance);
				this.ctx_cj.lineTo(this.cj_data.x - distance, this.cj_data.y - distance);
				this.ctx_cj.lineTo(this.cj_data.x - distance, this.cj_data.y + length);
				this.ctx_cj.moveTo((this.cj_data.width / 2) + this.cj_data.x - length, this.cj_data.y - distance);
				this.ctx_cj.lineTo((this.cj_data.width / 2) + this.cj_data.x + length, this.cj_data.y - distance);

				this.ctx_cj.moveTo(this.cj_data.width + this.cj_data.x - length, this.cj_data.y - distance);
				this.ctx_cj.lineTo(this.cj_data.width + this.cj_data.x + distance, this.cj_data.y - distance);
				this.ctx_cj.lineTo(this.cj_data.width + this.cj_data.x + distance, this.cj_data.y + length);
				this.ctx_cj.moveTo(this.cj_data.width + this.cj_data.x + distance, (this.cj_data.height / 2) + this.cj_data.y - length);
				this.ctx_cj.lineTo(this.cj_data.width + this.cj_data.x + distance, (this.cj_data.height / 2) + this.cj_data.y + length);

				this.ctx_cj.moveTo(this.cj_data.width + this.cj_data.x + distance, this.cj_data.height + this.cj_data.y - length);
				this.ctx_cj.lineTo(this.cj_data.width + this.cj_data.x + distance, this.cj_data.height + this.cj_data.y + distance);
				this.ctx_cj.lineTo(this.cj_data.width + this.cj_data.x - length, this.cj_data.height + this.cj_data.y + distance);
				this.ctx_cj.moveTo((this.cj_data.width / 2) + this.cj_data.x - length, this.cj_data.height + this.cj_data.y + distance);
				this.ctx_cj.lineTo((this.cj_data.width / 2) + this.cj_data.x + length, this.cj_data.height + this.cj_data.y + distance);

				this.ctx_cj.moveTo(this.cj_data.x - distance, this.cj_data.height + this.cj_data.y - length);
				this.ctx_cj.lineTo(this.cj_data.x - distance, this.cj_data.height + this.cj_data.y + distance);
				this.ctx_cj.lineTo(this.cj_data.x + length, this.cj_data.height + this.cj_data.y + distance);
				this.ctx_cj.moveTo(this.cj_data.x - distance, (this.cj_data.height / 2) + this.cj_data.y - length);
				this.ctx_cj.lineTo(this.cj_data.x - distance, (this.cj_data.height / 2) + this.cj_data.y + length);
				this.ctx_cj.stroke();
				this.ctx_cj.draw();
			}
		},
		// 画出中心的标记线
		drawCenterLine(ctx, x, y) {
			ctx.setStrokeStyle('red');
			ctx.moveTo(0, y)
			ctx.lineTo(10000, y)
			ctx.moveTo(x, 0)
			ctx.lineTo(x, 10000)
			ctx.stroke()
			ctx.draw()
		},
		// 点击范围内的文字操作
		isInAreaClick({ x, y }) {
			if (this.tx_list_activate != '文本' || this.tx_type_activate == '橡皮') return;
			// 检查是否点击在范围内
			for (let index in this.textList) {
				const item = this.textList[index];
				const arcX = item.x - item.width / 2;
				const arcY = item.y - item.height / 2;
				if (item.isActive && x >= arcX - item.arcSize && x <= arcX - item.arcSize + item.arcSize * 2 &&
					y >= arcY - item.arcSize && y <= arcY - item.arcSize + item.arcSize * 2) {
					// 点击的是删除按钮
					this.textList.splice(index, 1);
					this.drawText();
					return;
				}
				if (
					x >= item.x - item.width / 2 && x <= item.x - item.width / 2 + item.width &&
					y >= item.y - item.height / 2 && y <= item.y - item.height / 2 + item.height
				) {
					// 点击的是文本
					if (item.isActive) {
						// 唤醒输入框
						this.text = item.text;
						const time = setTimeout(() => {
							this.textFocus = true;
							clearTimeout(time);
						}, 100);
						return;
					} else {
						// 选中文本
						this.textList = this.textList.map(i => ({ ...i, isActive: false }));
						this.textList[index].isActive = true;
						this.drawText();
						return;
					}
				}
			}
			this.textList = this.textList.map(i => ({ ...i, isActive: false }));
			this.drawText();
		},
		// 移动文字操作
		isInAreaMove({ x, y }) {
			if (this.tx_list_activate != '文本' || this.tx_type_activate == '橡皮') return;
			// 检查是否点击在范围内
			for (let index in this.textList) {
				const item = this.textList[index];
				if (
					item.isActive && x >= item.x - item.width / 2 && x <= item.x - item.width / 2 + item.width &&
					y >= item.y - item.height / 2 && y <= item.y - item.height / 2 + item.height
				) {
					this.textList[index].x += x - this.moveTo.x;
					this.textList[index].y += y - this.moveTo.y;
					this.drawText();
					this.moveTo = { x, y };
					return;
				}
			}
		},
		// 输入文本
		input(e) {
			if (this.tx_list_activate != '文本') return;
			const text = e.detail.value;
			for (let index in this.textList) {
				const item = this.textList[index];
				if (item.isActive) {
					// 计算文本的宽度
					this.ctx_text.setFontSize(item.fontSize);
					const { width: textWidth } = this.ctx_text.measureText(text);
					this.textList[index] = {
						...item,
						text,
						width: textWidth + 20,
						height: item.fontSize + 20,
						textWidth
					};
					this.drawText();
					return;
				}
			}
		},
		// 改变文本颜色
		setTextColor(color) {
			if (this.tx_list_activate == '文本') {
				this.textList = this.textList.map(i => i.isActive ? { ...i, fontColor: color } : i);
				this.drawText();
			}
		},
		// 改变文本大小
		setTextSize(size) {
			if (this.tx_list_activate == '文本') {
				for (let index in this.textList) {
					const item = this.textList[index];
					if (item.isActive) {
						// 计算文本的宽度
						this.ctx_text.setFontSize(size);
						const { width: textWidth } = this.ctx_text.measureText(item.text);
						this.textList[index] = {
							...item,
							fontSize: size,
							width: textWidth + 20,
							height: size + 20,
							textWidth
						};
						break;
					}
				}
				this.drawText();
			}
		},
		// 切换笔和橡皮
		changeType(type) {
			if (type) {
				this.tx_type_activate = type;
			}
			// #ifndef MP-WEIXIN
			// 切换橡皮或者笔
			if (this.tx_type_activate == '橡皮') {
				this.ctx.globalCompositeOperation = 'destination-out';
			} else {
				this.ctx.globalCompositeOperation = 'source-over';
			}
			// #endif
		},
		// 回显橡皮
		drawEraserHX({ x, y }) {
			if (this.tx_type_activate != '橡皮') return;
			// #ifdef MP-WEIXIN
			this.ctx.clearRect(x - this.pen_size / 2, y - this.pen_size / 2, this.pen_size, this.pen_size);
			this.ctx.draw(true);
			this.ctx_hx.setFillStyle('#fff');
			this.ctx_hx.fillRect(x - this.pen_size / 2, y - this.pen_size / 2, this.pen_size, this.pen_size);
			this.ctx_hx.draw();
			// #endif
			// #ifndef MP-WEIXIN
			this.ctx_hx.setFillStyle('#fff');
			this.ctx_hx.arc(x, y, this.pen_size / 2, 0, Math.PI * 2);
			this.ctx_hx.fill();
			this.ctx_hx.draw();
			// #endif
		},
		// 切换笔的颜色
		changeColor(item) {
			if (item.type != '选择') {
				this.color_list[7].color = '';
			}
			this.active_color_id = item.id;
			if (item.type == '选择') return this.$refs['chj-color-picker'].open();
			this.pan_color = item.color;
			this.setStrokeStyle();
		},
		// 确定选中颜色
		subColor({ rgba: { R, G, B, A }, hex }) {
			this.pan_color = `rgba(${R},${G},${B},${A})`;
			this.color = hex;
			this.color_list[7].color = this.pan_color;
			this.setStrokeStyle();
		},
		// 取消颜色选择
		cancelColorPicker() {
			const obj = this.color_list.find(i => i.color == this.pan_color);
			this.active_color_id = obj.id;
		},
		// 设置canvas笔的颜色
		setStrokeStyle() {
			this.ctx.setStrokeStyle(this.pan_color);
			// 把回显canvas也设置了
			this.ctx_hx.setStrokeStyle(this.pan_color);
			this.setTextColor(this.pan_color);
		},
		// 滑动选择笔的粗细
		sliderChange(e) {
			if (e) {
				this.pen_size = e.detail.value;
			}
			this.ctx.setLineWidth(this.pen_size);
			this.ctx.setLineJoin('round');
			this.ctx.setLineCap('round');
			// 把回显canvas也设置了
			this.ctx_hx.setLineWidth(this.pen_size);
			this.ctx_hx.setLineJoin('round');
			this.ctx_hx.setLineCap('round');
			// 设置文本大小
			this.setTextSize(this.pen_size);
		},
		// 设置canvas画图所有的样式
		// 设置canvas画图所有的样式
		setCanvasStyle() {
			// 使用当前选中的颜色绘制，让用户可以看到绘制路径
			this.ctx.setFillStyle(this.pan_color);
			this.ctx.setStrokeStyle(this.pan_color);
			this.ctx.setLineWidth(this.pen_size);
			this.ctx.setLineJoin('round');
			this.ctx.setLineCap('round');
			// 把回显canvas也设置了
			this.ctx_hx.setFillStyle(this.pan_color);
			this.ctx_hx.setStrokeStyle(this.pan_color);
			this.ctx_hx.setLineWidth(this.pen_size);
			this.ctx_hx.setLineJoin('round');
			this.ctx_hx.setLineCap('round');
			// 设置文本大小
			this.setTextSize(this.pen_size);
		},
		// 获取图片的参数
		imgInfo(src) {
			return new Promise((res, rej) => {
				uni.getImageInfo({
					src,
					success(data) {
						res(data);
					},
					fail(err) {
						rej(err);
					}
				})
			})
		},
		// 已知图片的宽高和canvas的宽高，将图片缩放绘制到中心
		drawImageToCenter(ctx, selector, path, reserve = true, isBg = false) {
			return new Promise(async (resolve, reject) => {
				// 获取图片的宽高
				const { width, height } = await this.imgInfo(path);
				// 获取canvas的宽高
				const { width: canvasWidth, height: canvasHeight } = await this.getNodeInfo(selector);
				let dx, dy, dWidth, dHeight;
				if (width >= height) {
					dx = 0;
					dWidth = canvasWidth;
					// 按照比例计算高度
					dHeight = canvasWidth / width * height;
					dy = (canvasHeight - dHeight) / 2;
				} else {
					dy = 0;
					dHeight = canvasHeight;
					// 按照比例计算宽度
					dWidth = canvasHeight / height * width;
					dx = (canvasWidth - dWidth) / 2;
				}
				if (isBg) {
					this.bgPosition = {
						x: dx,
						y: dy,
						width: dWidth,
						height: dHeight
					}
					this.bgPositionFlip_false = {
						x: dx,
						y: dy,
						width: dWidth,
						height: dHeight
					}
				}
				ctx.drawImage(path, dx, dy, dWidth, dHeight);
				ctx.draw(reserve, () => {
					resolve();
				});
			})

		},
		// 获取节点的信息（宽高）
		getNodeInfo(selector) {
			return new Promise((res, rej) => {
				uni.createSelectorQuery().in(this).select(selector).fields({
					size: true
				}, (data) => {
					res(data);
				}).exec();
			})
		},
		// 保存当前绘制内容
		async save() {
			if (this.tx_list_activate == '文本') return;
			// 先拿到绘画canvas的绘画图片路径
			const path = await this.canvasGetImagePath('chj_imgEdit_canvas');
			// 根据历史记录指针位置往绘画历史记录插入一条数据
			this.history_list.splice(this.history_index + 1, this.history_list.length - 1 - this.history_index, path);
			this.history_index++;
		},
		// 获取当前绘画图片路径
		canvasGetImagePath(canvasId, range) {
			return new Promise((res, rej) => {
				if (range) {
					const { x, y, width, height } = range;
					uni.canvasToTempFilePath({
						canvasId,
						x, y, width, height,
						success: function (data) {
							// 在H5平台下，tempFilePath 为 base64
							res(data.tempFilePath);
						}
					}, this);
				} else {
					uni.canvasToTempFilePath({
						canvasId,
						success: function (data) {
							// 在H5平台下，tempFilePath 为 base64
							res(data.tempFilePath);
						}
					}, this);
				}
			})
		},
		// 根据绘画历史记录和历史记录指针在背景canvas中画出来
		async drawBgCanvas() {
			this.initScaleAndTranslate();
			// 清空回显canvas
			this.ctx.clearRect(0, 0, 10000, 10000);
			this.ctx.draw();
			if (this.history_index < 0) return;
			// #ifndef MP-WEIXIN
			this.ctx.globalCompositeOperation = 'source-over';
			// #endif
			// 再根据绘画历史记录画出图像
			await this.drawImageToCenter(this.ctx, '#chj_imgEdit_canvas_bg', this.history_list[this.history_index]);
			this.changeType();
		},
		// rbga转成Hex格式
		rgbaToHex(r, g, b, a) {
			// 确保 RGB 值在 0 到 255 的范围内
			r = Math.min(255, Math.max(0, Math.round(r)));
			g = Math.min(255, Math.max(0, Math.round(g)));
			b = Math.min(255, Math.max(0, Math.round(b)));

			// 将 RGB 值转换为十六进制并格式化
			const rHex = ('0' + r.toString(16)).slice(-2).toUpperCase();
			const gHex = ('0' + g.toString(16)).slice(-2).toUpperCase();
			const bHex = ('0' + b.toString(16)).slice(-2).toUpperCase();

			// 拼接十六进制颜色代码
			return `#${rHex}${gHex}${bHex}`;
		},
		// 前进/回退/原图 查看
		historyEvent(type) {
			if (type == '回退') {
				if (this.history_index < 0) return;
				this.history_index -= 1;
				this.drawBgCanvas();
			} else if (type == '前进') {
				if (this.history_index >= this.history_list.length - 1) return;
				this.history_index += 1;
				this.drawBgCanvas();
			} else if (type == '原图') {
				if (this.history_index >= 0) {
					this.history_index = -1;
					this.drawBgCanvas();
				} else {
					this.history_index = this.history_list.length - 1;
					this.drawBgCanvas();
				}
			}
		},
		// 显示模态弹窗 确定/取消
		showModal(show, title) {
			return new Promise((res, rej) => {
				if (show) {
					uni.showModal({
						title: '提示',
						content: title,
						success: function (data) {
							if (data.confirm) {
								res(true);
							} else if (data.cancel) {
								res(false);
							}
						}
					});
				} else {
					res(true);
				}
			});
		},
		// 清空画布
		async clearCanvas(ctx) {
			new Promise((res, rej) => {
				ctx.clearRect(0, 0, 10000, 10000);
				ctx.draw(false, () => {
					res();
				});
			})
		},
	},
	computed: {
		active_label() {
			const obj = this.tx_list.find(i => i.name == this.tx_list_activate);
			return obj.label;
		},
	},
	beforeDestroy() {
		// #ifdef H5
		// 取消阻止触摸屏幕时页面滚动
		window.removeEventListener('touchmove', preventScroll, { passive: false });
		// #endif
	},
}

</script>

<style lang="scss" scoped>
// 主要颜色变量
$color: #e5e5e5;

.chj_imgEdit {
	// 居中混合
	position: fixed;

	top: 0;
	left: 0;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	overflow: hidden;

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// 纵向flex布局
	.flex-row {
		display: flex;
		flex-direction: column;
	}

	// canvas
	.canvas_box {
		flex: 1;
		width: 100%;
		background-color: $color;
		position: relative;
		overflow: hidden;

		.canvas {
			width: 100%;
			height: 100%;
			position: absolute !important;
			top: 0;
			left: 0;
		}
	}

	// 功能盒子
	.item_box {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		position: relative;

		.center_box {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: fit-content;
			min-width: 100%;

			.item {
				padding: 0 40rpx;
				width: 50rpx;

				image {
					width: 50rpx;
					height: 50rpx;
				}

				.text {
					font-size: 20rpx;
					text-align: center;
					color: #333;
					font-weight: 600;
				}
			}
		}
	}

	// 涂鸦盒子
	.tuya_box {
		width: 100%;
		// height: 30%;
		position: relative;

		// 颜色选择
		.color_select {
			box-sizing: border-box;
			width: 100%;
			display: flex;
			justify-content: space-evenly;
			background-color: #e5e5e5;
			padding: 12rpx;

			.item {
				background-clip: content-box;
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				border: transparent 2px solid;
				position: relative;
				@extend .flex-center;
			}
		}

		.tuxing_box {
			box-sizing: border-box;
			flex: 1;
			width: 100%;
			overflow: hidden;
			background-color: #fff;
			padding: 24rpx;
			@extend .flex-row;

			.title_box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.select_box {
				@extend .flex-row;
				flex: 1;
				padding-top: 24rpx;
				overflow: hidden;

				.num_box {
					display: flex;
					flex-direction: row;

					.icon {
						@extend .flex-center;
						background-color: $color;
						width: 82rpx;
						height: 64rpx;

						image {
							width: 38rpx;
							height: 38rpx;
						}

						&:nth-child(1) {
							border-radius: 24rpx 0 0 24rpx;
						}

						&:nth-child(2) {
							border-radius: 0 24rpx 24rpx 0;
							margin-left: 8rpx;
						}
					}

					.slider {
						flex: 1;
					}
				}

				.tuxing_list_scroll {
					flex: 1;
					overflow: hidden;
					padding-top: 12rpx;

					.tuxing_list {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;

						.item {
							margin-top: 12rpx;
							box-sizing: border-box;
							@extend .flex-center;
							width: calc(25% - 19rpx);
							height: 84rpx;
							margin-right: 24rpx;
							border-radius: 24rpx;
							background-color: $color;

							image {
								height: calc(100% - 24rpx);
							}

							&:nth-child(4n) {
								margin-right: 0;
							}
						}
					}
				}
			}
		}

	}

	// 彩球
	.colour {
		background-image: linear-gradient(45deg, red, transparent), linear-gradient(90deg, orange, transparent), linear-gradient(135deg, yellow, transparent), linear-gradient(-135deg, green, transparent), linear-gradient(-90deg, aquamarine, transparent), linear-gradient(-45deg, blue, transparent);
	}

	.white_border::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border: 2rpx solid #fff;
		border-radius: 50%;
	}
}

.chj_imgEdit_text {
	position: absolute;
	left: -1000px;
}

.history_box {

	padding: 24rpx 0;
	width: 100%;
	z-index: 5;
	background-color: $color;
	@extend .flex-center;

	.bg_box {
		background-color: #56565624;
		border-radius: 24rpx;

		&:nth-child(1) {
			position: absolute;
			left: 48rpx;
			padding: 12rpx;
		}

		&:nth-child(2) {
			padding: 12rpx 24rpx;
		}

		&:nth-child(3) {
			position: absolute;
			right: 48rpx;
			padding: 12rpx;
		}

		@extend .flex-center;
	}

	image {
		width: 48rpx;
		height: 48rpx;
	}

	.chj_icon_left {
		position: relative;
		width: 48rpx;
		height: 48rpx;
		@extend .flex-center;

		cover-view,
		view {
			position: absolute;
			border-radius: 4rpx;
			background-color: #8a8a8a;

			&:nth-child(1) {
				top: 30%;
				left: 2%;
				width: 25%;
				height: 4rpx;
				transform: rotate(50deg);
			}

			&:nth-child(2) {
				top: 19%;
				left: 2%;
				width: 25%;
				height: 4rpx;
				transform: rotate(-50deg);
			}

			&:nth-child(3) {
				width: 50%;
				height: 4rpx;
				top: 25%;
				left: 10%;
			}

			&:nth-child(4) {
				width: 50%;
				height: 50%;
				border: #8a8a8a 4rpx solid;
				border-left: transparent 4rpx solid;
				background-color: transparent;
				border-radius: 0 50% 50% 50%;
				top: 25%;
				left: 25%;
			}
		}

		&.active {

			cover-view,
			view {
				background-color: #515151;

				&:nth-child(4) {
					border: #515151 4rpx solid;
					border-left: transparent 4rpx solid;
					background-color: transparent;
				}
			}
		}
	}

	.chj_icon_right {
		margin-left: 64rpx;
		position: relative;
		width: 48rpx;
		height: 48rpx;
		@extend .flex-center;

		cover-view,
		view {
			position: absolute;
			border-radius: 4rpx;
			background-color: #8a8a8a;

			&:nth-child(1) {
				top: 30%;
				right: 2%;
				width: 25%;
				height: 4rpx;
				transform: rotate(-50deg);
			}

			&:nth-child(2) {
				top: 19%;
				right: 2%;
				width: 25%;
				height: 4rpx;
				transform: rotate(50deg);
			}

			&:nth-child(3) {
				width: 50%;
				height: 4rpx;
				top: 25%;
				right: 10%;
			}

			&:nth-child(4) {
				width: 50%;
				height: 50%;
				border: #8a8a8a 4rpx solid;
				border-right: transparent 4rpx solid;
				background-color: transparent;
				border-radius: 50% 0 50% 50%;
				top: 25%;
				right: 25%;
			}
		}

		&.active {

			cover-view,
			view {
				background-color: #515151;

				&:nth-child(4) {
					border: #515151 4rpx solid;
					border-right: transparent 4rpx solid;
					background-color: transparent;
				}
			}
		}
	}

	.chj_icon_reset {
		width: 48rpx;
		height: 48rpx;
		position: relative;
		@extend .flex-center;

		cover-view,
		view {
			width: 50%;
			height: 50%;
			position: absolute;
			border-radius: 50%;
			overflow: visible;

			&:nth-child(1) {
				border: #515151 4rpx solid;
				border-bottom: transparent 4rpx solid;
				border-right: transparent 4rpx solid;
				transform: rotate(34deg) translate(-5%, -5%);

				&::before {
					content: '';
					background-color: #515151;
					border-radius: 4rpx;
					position: absolute;
					top: 12%;
					right: 1%;
					width: 50%;
					height: 4rpx;
					transform: rotate(-34deg);
					overflow: visible !important;
				}

				&::after {
					content: '';
					background-color: #515151;
					border-radius: 4rpx;
					position: absolute;
					top: -19%;
					right: -1%;
					width: 50%;
					height: 4rpx;
					transform: rotate(54deg);
					overflow: visible !important;
				}
			}

			&:nth-child(2) {
				border: #515151 4rpx solid;
				border-top: transparent 4rpx solid;
				border-left: transparent 4rpx solid;
				transform: rotate(34deg) translate(5%, 5%);

				&::before {
					content: '';
					background-color: #515151;
					border-radius: 4rpx;
					position: absolute;
					bottom: 12%;
					left: 1%;
					width: 50%;
					height: 4rpx;
					transform: rotate(-34deg);
					overflow: visible !important;
				}

				&::after {
					content: '';
					background-color: #515151;
					border-radius: 4rpx;
					position: absolute;
					bottom: -19%;
					left: -1%;
					width: 50%;
					height: 4rpx;
					transform: rotate(54deg);
					overflow: visible !important;
				}
			}
		}
	}
}
</style>