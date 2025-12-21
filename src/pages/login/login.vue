<template>
	<fui-background-image
		src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg"
		class="bg-image"></fui-background-image>

	<view class="login-container">
		<!-- 导航栏 -->
		<fui-nav-bar title=" " @leftClick="toHome" background="transparent" class="nav-bar">
			<fui-icon name="arrowleft" size="40" color="#333"></fui-icon>
		</fui-nav-bar>

		<!-- 欢迎标题 -->

		<view class="welcome-section">
			<!-- <view>
				<image class="logoSty" src="/static/logo.png"></image>
			</view> -->
			<text class="welcome-title">欢迎登录</text>
			<text class="welcome-desc">登录开启新世界</text>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<!-- 输入框组 -->
			<view class="form-group">
				<!-- 账号输入框 -->
				<view class="password-input">
					<fui-input v-model="username" placeholder="请输入账号" @input="validateEmail"></fui-input>
					<text v-if="emailError" class="error-text">{{ emailError }}</text>
				</view>
				<!-- 密码输入框 -->
				<view class="password-input">
					<fui-input v-model="password" placeholder="请输入密码" type="password"
						@input="clearPasswordError"></fui-input>
					<text v-if="passwordError" class="error-text">{{ passwordError }}</text>
				</view>
			</view>

			<!-- 登录按钮 -->
			<fui-button @click="handleLogin" class="login-btn" background="#6C5CE7" color="#FFFFFF" height="96rpx"
				borderRadius="20rpx" fontSize="32rpx" fontWeight="500">
				登录
			</fui-button>

			<!-- 注册链接 -->
			<text class="switch-mode" @click="toRegiest">
				没有账号？立即注册
			</text>

			<!-- 其他登录方式分割线 -->
			<view class="divider">
				<view class="divider-line"></view>
				<text class="divider-text">其他登录方式</text>
				<view class="divider-line"></view>
			</view>

			<!-- 微信登录按钮 -->
			<view class="wechat-login">
				<fui-button :plain="true" width="200rpx" height="80rpx" background="transparent" borderColor="#E5E7EB"
					borderRadius="16rpx" @click="commonLogin" :loading="wechatLoading">
					<view class="wechat-button">
						<image style="width: 80rpx; height: 80rpx;"
							src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/2025-07-08/67873d6c232a3c5d52240dd6/upload/20250708090156694-wxicon.png">
						</image>

					</view>
				</fui-button>
			</view>
			<view class="divider">
				<view class="divider-line"></view>
				<text class="divider-text">版本号：v2025.12.21</text>
				<view class="divider-line"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		isLogin,
		loginByUsername,
		loginByWechatCode,
		saveLoginInfo
	} from "@/composables/useCommon.ts";
	import {
		onLoad,
		onReady,
		onShow
	} from "@dcloudio/uni-app";



	// 响应式状态
	const username = ref('');
	const password = ref('');
	const emailError = ref('');
	const passwordError = ref('');
	const wechatLoading = ref(false);

	// 格式验证（修复原正则表达式错误）
	const validateEmail = (email) => {
		// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 正确的邮箱正则
		// if (!emailRegex.test(email) && email !== '') {
		//   emailError.value = '请输入有效的账号地址';
		// } else {
		//   emailError.value = '';
		// }
	};

	// 清除密码错误提示
	const clearPasswordError = () => {
		passwordError.value = '';
	};

	// 公共登录逻辑
	const commonLogin = async () => {
		if (isLogin.value) return;

		// uni.showToast({
		// 	title: '暂不支持',
		// 	icon: 'error',
		// 	duration: 2000,

		// });
		// return 0

		// 获取平台信息
		const {
			uniPlatform
		} = uni.getSystemInfoSync();
		console.log("获取到平台信息platform", uniPlatform);
		if (uniPlatform !== 'web') {
			// 非web环境执行微信登录
			handleLoginByWechat();
		} else {
			// 开发者工具模拟登录（修复原注释导致的变量未定义问题）
			try {
				const user = await loginByUsername({
					username: 'test456',
					password: '123456'
				});
				saveLoginInfo(user);
				uni.hideLoading();
				uni.reLaunch({
					url: '/pages/index/index'
				});
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: '模拟登录失败',
					icon: 'none'
				});
			}
		}
	};
	onLoad((options) => {
		if (options.userData) {
			try {
				// 解析 JSON 字符串
				const userData = JSON.parse(options.userData);
				username.value = userData.username;
				password.value = userData.password;
				console.log("loginOnload", options, userData, )
				console.log("loginOnload---2", username.value, password.value)
			} catch (error) {
				console.error('解析 userData 出错:', error);
			}
		}
	})


	// 账号密码登录
	const handleLogin = async () => {
		if (!username.value) {
			emailError.value = '请输入账号';
			return;
		}
		if (!password.value) {
			passwordError.value = '请输入密码';
			return;
		}

		try {
			uni.showLoading({
				title: '登录中...',
				mask: true
			});
			const result = await loginByUsername({
				username: username.value,
				password: password.value
			});
			console.log("---------result------------", result)
			if (result.status == 0) {
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				});
				saveLoginInfo(result);
				uni.setStorageSync('refreshToken', result.refresh_token);
				uni.hideLoading();

				uni.reLaunch({
					url: '/pages/index/index'
				});
			} else {
				uni.showToast({
					title: result.message,
					icon: 'error'
				});

			}

		} catch (error) {
			uni.hideLoading();
			uni.showToast({
				title: '请求出错检查网络',
				icon: 'none'
			});
			console.error('Login error:', error);
		}
	};

	// 微信登录具体实现
	// const handleLoginByWechat = async () => {
	// 	wechatLoading.value = true;
	// 	try {
	// 		const {
	// 			code
	// 		} = await uni.login();
	// 		console.log("---------code------------", code)
	// 		const inviteCode = uni.getStorageSync('inviteCode') || 'none';
	// 		const result = await loginByWechatCode(code,inviteCode);
	// 		saveLoginInfo(result);
	// 		uni.setStorageSync('refreshToken', result.refresh_token);
	// 		uni.hideLoading();
	// 		wechatLoading.value = false;
	// 		uni.showToast({
	// 			title: '登录成功',
	// 			icon: 'success'
	// 		});
	// 		uni.reLaunch({
	// 			url: '/pages/index/index'
	// 		});
	// 	} catch (error) {
	// 		uni.hideLoading();
	// 		wechatLoading.value = false;
	// 		uni.showToast({
	// 			title: '微信登录失败',
	// 			icon: 'none'
	// 		});
	// 		console.error('Wechat login error:', error);
	// 	}
	// };
	/** 通过微信登录 */
	const handleLoginByWechat = () => {
		uni.login({
			success: async function({
				code
			}) {
				try {
					// 添加邀请码处理
					const inviteCode = uni.getStorageSync('inviteCode') || 'none'
					const result = await loginByWechatCode(code, inviteCode)

					// 处理缺失的用户信息字段，设置默认值
					const userInfo = {
						...result,
						// 如果没有头像，设置默认头像
						avatar_url: result.avatar_url ||
							'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/2025-10-11/67873d6c232a3c5d52240dd6/upload/20251011181545902-Group923.png',
						// 如果没有昵称，使用用户名或设置默认昵称
						nickname: result.nickname || result.username || '微信用户'
					}

					saveLoginInfo(userInfo)
					uni.hideLoading()
					console.log("------------result--------", userInfo)
					uni.setStorageSync('refreshToken', userInfo.refresh_token)

					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					uni.reLaunch({
						url: '/pages/index/index'
					});
				} catch (error) {
					uni.hideLoading()
					console.error('微信登录失败:', error)
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					})
				}
			},
			fail: function(err) {
				uni.hideLoading()
				uni.showToast({
					title: '登录错误',
					icon: 'none'
				})
			}
		})
	}
	// 跳转到注册页
	const toRegiest = () => {
		uni.navigateTo({
			url: '/pages/login/register'
		});
	};

	// 跳转到首页
	const toHome = () => {
		uni.redirectTo({
			url: '/pages/index/index'
		});
	};
</script>

<style scoped>
	.logoSty {
		width: 520rpx;
		height: 260rpx;
		object-fit: contain;
		/* 保持图片比例 */
		margin-bottom: -5%;
	}

	/* 背景图全屏覆盖 */
	.bg-image {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		background-size: cover;
		/* 覆盖全屏 */
		background-position: center;
		filter: brightness(0.95);
		/* 轻微调暗背景，突出前景内容 */
	}

	.login-container {
		padding: 30rpx 40rpx;
		/* 增大边距，避免内容贴边 */
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* 整体内容居中 */
	}

	/* 导航栏 */
	.nav-bar {
		width: 100%;
		margin-top: 20rpx;
		padding-left: 10rpx;
	}

	/* 欢迎标题区域 */
	.welcome-section {
		margin: 120rpx 0 80rpx;
		/* 调整顶部距离，更靠下 */
		text-align: center;
		width: 100%;
	}

	.welcome-title {
		font-size: 52rpx;
		/* 增大标题字号 */
		font-weight: bold;
		color: #333;
		/* 深色标题更醒目 */
		margin-bottom: 20rpx;
		display: block;
	}

	.welcome-desc {
		font-size: 28rpx;
		color: #666;
		/* 灰色描述文字 */
		letter-spacing: 0.5rpx;
	}

	/* 登录表单容器 */
	.login-form {
		width: 100%;
		max-width: 550rpx;
		/* 限制最大宽度，避免大屏拉伸 */
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	/* 输入框容器 - 添加底部边框和聚焦效果 */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		/* 维持输入框间距 */
	}

	/* 输入框基础样式 */
	:deep(.fui-input) {
		height: 210rpx;
		border-radius: 5rpx;
		/* 增加圆角半径 */
		background-color: rgba(255, 255, 255, 0.98);
		/* 更通透的白色 */
		padding: 0 30rpx;
		/* 底部边框替代全边框，更简洁 */
		border-bottom: 2rpx solid #E0E0E0;
		/* 更新底边颜色 */
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
		box-shadow: none !important;
		/* 去掉厚重阴影 */
		font-size: 32rpx;
		/* 适中字体大小 */
		display: flex;
		align-items: center;
		/* 文字垂直居中 */
	}

	/* 输入框聚焦效果 */
	:deep(.fui-input:focus) {
		border-bottom-color: #4A90E2 !important;
		/* 使用更鲜明的颜色 */
		/* 底部轻微发光效果，增强聚焦感 */
		box-shadow: 0 2rpx 10rpx rgba(74, 144, 226, 0.3) !important;
	}

	/* 输入框占位符样式 */
	:deep(.fui-input input::placeholder) {
		color: #B0B0B0;
		font-size: 32rpx;
		letter-spacing: 0.5rpx;
		/* 轻微 letter-spacing 更精致 */
	}

	/* 输入框文字样式 */
	:deep(.fui-input input) {
		color: #333;
		font-size: 32rpx;
		line-height: 1.5;
		/* 调整行高 */
		width: 100%;
	}

	/* 错误提示位置调整 - 与输入框对齐 */
	.error-text {
		color: #FF5252;
		font-size: 26rpx;
		margin-top: 8rpx;
		margin-left: 0;
		/* 与输入框左对齐 */
		padding-left: 30rpx;
		/* 与输入框内边距一致 */
	}

	/* 登录按钮 */
	.login-btn {
		height: 108rpx;
		/* 更高按钮 */
		border-radius: 22rpx;
		background-color: #6C5CE7;
		color: #FFFFFF;
		font-size: 34rpx;
		/* 更大字体 */
		font-weight: 600;
		width: 100%;
		margin-top: 20rpx;
		box-shadow: 0 6rpx 16rpx rgba(108, 92, 231, 0.3);
		/* 主色阴影 */
	}

	:deep(.fui-button.login-btn:hover) {
		background-color: #5A47D1;
		/* 按钮hover深色 */
	}

	/* 注册链接 */
	.switch-mode {
		font-size: 30rpx;
		color: #6C5CE7;
		/* 主色链接 */
		text-align: right;
		margin-top: 10rpx;
		cursor: pointer;
		padding-right: 10rpx;
	}

	/* 分割线 */
	.divider {
		display: flex;
		align-items: center;
		width: 100%;
		margin: 40rpx 0 20rpx;
	}

	.divider-line {
		flex: 1;
		height: 1rpx;
		background-color: #EEEEEE;
	}

	.divider-text {
		padding: 0 25rpx;
		font-size: 28rpx;
		color: #9E9E9E;
	}

	/* 微信登录按钮 */
	.wechat-login {
		display: flex;
		justify-content: center;
		margin-top: 10rpx;
	}

	:deep(.fui-button.wechat-btn) {
		width: 100%;
		max-width: 300rpx;
		height: 96rpx;
		border-radius: 20rpx;
		border: 2rpx solid #E0E0E0;
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.wechat-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 15rpx;
		/* 图标与文字间距 */
	}

	.wechat-button image {
		width: 50rpx;
		height: 50rpx;
	}

	.wechat-text {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}
</style>