<template>
	<view>
		<button @click="onClick">开启图片编辑</button>
		<chj-imgEdit ref="chjImgEdit" :isAllCanvas="false" @confirm="confirm" @cancel="cancel" @getLineLength="getLineLength" @getRectPosition="getRectPosition" />
	</view>
</template>
<script>
export default {
	data() {
		return {};
	},
	methods: {
		onClick() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.$refs.chjImgEdit.open({
						// 底图路径
						path: res.tempFilePaths[0],
						// 取消是否有弹窗提示
						isCancelToast: true,
						// 取消弹窗提示内容
						cancelText: '确定真的退出吗?',
						// 确定是否有弹窗提示
						isConfirmToast: true,
						// 确定弹窗提示内容
						confirmText: '决定好了吗?',
						// 设置图标
						iconPath: {
							goForward_active: '/static/goForward.png',
							// 前进不可点击状态
							goForward_inactive: '/static/goForward_inactive.png',
							// 后退可点击状态
							retreat_active: '/static/retreat.png',
							// 后退不可点击状态
							retreat_inactive: '/static/retreat_inactive.png',
							// 重置
							reset: '/static/reset.png',
							// 取消
							close: '/static/close.png',
							// 确定
							confirm: '/static/determine.png',
							// 笔
							pen: '/static/graffiti.png',
							// 橡皮
							rubber: '/static/rubber.png'
						},
						// 设置涂鸦图标（根据下标匹配）
						iconPathGraffiti: {
							0: '/static/iconPathGraffiti-1.png',
							1: '/static/iconPathGraffiti-2.png',
							2: '/static/iconPathGraffiti-3.png',
							3: '/static/iconPathGraffiti-4.png',
							4: '/static/iconPathGraffiti-5.png',
							5: '/static/iconPathGraffiti-6.png'
						}
					});
				}
			});
		},
		confirm(path) {
			console.log('确定');
			uni.previewImage({
				urls: [path]
			});
		},
		cancel() {
			console.log('取消');
		},
		getLineLength(length) {
			console.log('获取线条长度' + length + 'px');
		},
		getRectPosition(obj) {
			console.log(obj);
		}
	}
};
</script>
