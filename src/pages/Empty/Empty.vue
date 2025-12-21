<template>
	<view style="margin-top: 40%;">
		
		<fui-empty src="/static/images/component/empty/img_data_3x.png" title="暂无数据" descr="功能开发中，敬请期待！">
			<fui-button text="返回首页" :size="28" width="336rpx" height="42rpx" radius="100rpx" background="#fff"
				:margin="['64rpx','0']" borderColor="#465CFF" color="#465CFF" @click="goToPage"></fui-button>
		</fui-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goToPage() {
		
				  uni.navigateBack('/pages/index/index');
			    }
			
		}
	}
</script>

<style>

</style>
