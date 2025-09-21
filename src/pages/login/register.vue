<template>
	<view class="page-container">
		<!-- Logo区域 -->
		 <view class="logo-wrapper" style="margin-bottom: 30%;">
			<!-- <image class="logoSty" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg"></image> -->
		</view> 

		<view class="register-container">
			<view class="register-form">
				<view class="form-title">注册新账号</view>

				<view class="form-group">
					<fui-input v-model="form.username" placeholder="请输入用户名" border-color="#6C5CE7"></fui-input>

					<fui-input v-model="form.email" placeholder="请输入邮箱" type="email" border-color="#6C5CE7"></fui-input>
					<!-- 显示邮箱验证错误 -->
					<text v-if="formErrors.email" class="error-text">{{ formErrors.email }}</text>

					<fui-input v-model="form.password" placeholder="请输入密码" type="password" border-color="#6C5CE7"></fui-input>

					<view class="agreement-group">
						<fui-checkbox-group v-model="form.agreement" :size="28">
							<fui-checkbox value="agreed" :color="'#6C5CE7'"></fui-checkbox>
							<text class="agreement-text">
								我已阅读并同意
								<text class="agreement-link" @click="showAgreement">用户协议</text>
								和
								<text class="agreement-link" @click="showPrivacy">隐私条款</text>
							</text>
						</fui-checkbox-group>
					</view>
					<text v-if="formErrors.agreement" class="error-text">{{ formErrors.agreement }}</text>

					<view class="form-actions">
						<fui-button @click="handleRegister" :disabled="!isAgreed || hasInvalidEmail" class="register-button">注册</fui-button>
						<text class="switch-mode" @click="backToLogin">已有账号？立即登录</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
// 脚本部分保持不变，此处省略（与原代码一致）
import { ref, reactive, computed, watch } from 'vue'
import { XieYiprivacy, XieYiServer, registerByUsername } from "@/composables/aiChat.ts"
import { onLoad } from '@dcloudio/uni-app'
import {
  isLogin,
  loginByUsername,
  loginByWechatCode,
  saveLoginInfo
} from "@/composables/useCommon.ts";

onLoad(() => {
    // GeXieyi()
})

const XieYiServerCon = ref('')
const XieYiprivacyCon = ref('')

const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

const form = reactive({
    username: '',
    email: '',
    password: '',
    agreement: []
})

const formErrors = reactive({
    email: '',
    agreement: ''
})

const isAgreed = computed(() => {
    return form.agreement.includes('agreed')
})

const hasInvalidEmail = computed(() => {
  return !form.email || !validateEmail(form.email);
});

watch(() => form.email, (newVal) => {
  if (newVal && !validateEmail(newVal)) {
    formErrors.email = '请输入有效的邮箱地址';
  } else {
    formErrors.email = '';
  }
});

const showAgreement = () => {
    // uni.showModal({
    //     title: '用户协议',
    //     content: XieYiServerCon.value,
    //     showCancel: false
    // })
}

const showPrivacy = () => {
    // uni.showModal({
    //     title: '隐私条款',
    //     content: XieYiprivacyCon.value,
    //     showCancel: false
    // })
}

async function toregist(data) {
    try {
        const response = await registerByUsername(data)
		
		if (response.status == "success"){
			uni.showToast({ title: '注册成功' });
		
			return response
		}else{
			uni.showToast({ title: response.message || "注册失败！" });
		}
        
    } catch (error) {
        console.error('注册失败:', error)
        throw error
    }
}

const handleRegister = async () => {
    if (!validateEmail(form.email)) {
        formErrors.email = '请输入有效的邮箱地址';
        return;
    }

    if (!isAgreed.value) {
        formErrors.agreement = '请同意用户协议和隐私条款';
        return;
    }

    try {
        const userData = {
            "username": form.username,
            "email": form.email,
            "password": form.password,
            "inviteCode": ''
        }

        const response = await toregist(userData);
		console.log("regiest",response)
		// handleLogin(response.username,response.password)
        setTimeout(() => {
			
            uni.redirectTo({ url: `/pages/login/login?userData=${JSON.stringify(response.data)}` });
        }, 1500);
    } catch (error) {
        uni.showToast({ title: '注册失败', icon: 'none' });
        console.error('注册错误:', error);
    }
}

const handleLogin = async (unm, pwd) => {
  try {
    uni.showLoading({ title: '登录中...', mask: true });
    const result = await loginByUsername({
      username:unm,
      password: pwd
    });
	console.log("---------result------------",result)
	if (result.status == 0){
		uni.showToast({ title: '登录成功', icon: 'success' });
		saveLoginInfo(result);
		uni.setStorageSync('refreshToken', result.refresh_token);
		uni.hideLoading();
		
		uni.reLaunch({ url: '/pages/index/index' });
	}else{
		uni.showToast({
		title: result.message,
		icon: 'error'
		});
		
	}
    
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '请求出错检查网络', icon: 'none' });
    console.error('Login error:', error);
  }
};


const backToLogin = () => {
    uni.navigateBack({ delta: 1 })
}
</script>

<style scoped>
/* 基础布局优化 */
.page-container {
    min-height: 100vh;
    background-color: #f9f9f9;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
}

/* Logo样式优化 - 居中显示并增加间距 */
.logo-wrapper {
    display: flex;
    justify-content: center;
    margin: 60rpx 0 40rpx; /* 顶部和底部间距 */
}
.logoSty {
    width: 320rpx;
    height: 160rpx;
    object-fit: contain; /* 保持图片比例 */
	margin-bottom: -10%;
	margin-top: 20%;
}

/* 注册容器样式合并优化 */
.register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
}

/* 表单卡片样式增强 */
.register-form {
    width: 90%;
    max-width: 600rpx;
    background-color: #fff;
    padding: 60rpx 40rpx;
    border-radius: 24rpx; /* 更大圆角更柔和 */
    box-shadow: 0 15rpx 40rpx rgba(0, 0, 0, 0.08); /* 增强阴影层次感 */
    animation: fadeIn 0.5s ease-out; /* 动画更自然 */
}

/* 标题样式优化 */
.form-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #6C5CE7;
    text-align: center;
    margin-bottom: 60rpx;
    letter-spacing: 2rpx; /* 增加字间距 */
}

/* 表单组间距优化 */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 30rpx; /* 统一输入项间距 */
}

/* 输入框样式微调 */
fui-input {
    margin-bottom: 10rpx; /* 输入框与错误提示的间距 */
    height: 90rpx; /* 增加输入框高度，更易点击 */
    border-radius: 12rpx; /* 输入框圆角 */
}

/* 错误提示样式优化 */
.error-text {
    color: #FF4D4D;
    font-size: 24rpx;
    margin-top: -20rpx; /* 贴近输入框 */
    margin-bottom: 10rpx;
    margin-left: 10rpx; /* 与输入框左对齐 */
    line-height: 1.4;
}

/* 协议区域样式优化 */
.agreement-group {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    padding: 10rpx 0;
}
.agreement-text {
    color: #555; /* 稍浅颜色更舒适 */
    font-size: 24rpx;
    margin-left: 15rpx;
    line-height: 1.5;
}
.agreement-link {
    color: #6C5CE7;
    text-decoration: underline;
    margin: 0 4rpx;
    transition: all 0.3s ease;
}
.agreement-link:hover {
    color: #4B3F72;
    text-decoration: none; /* 悬停效果变化 */
}

/* 按钮区域样式优化 */
.form-actions {
    margin-top: 50rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

/* 注册按钮样式增强 */
.register-button {
    width: 100%;
    height: 100rpx; /* 更高按钮更易点击 */
    background-color: #6C5CE7;
    color: #fff;
    border: none;
    border-radius: 16rpx; /* 大圆角更友好 */
    font-size: 32rpx;
    font-weight: 500;
    transition: all 0.3s ease; /* 过渡更流畅 */
    letter-spacing: 2rpx;
}
.register-button:disabled {
    background-color: #E0E0E0;
    color: #9E9E9E;
    cursor: not-allowed;
}
.register-button:not(:disabled):hover {
    background-color: #5A4BB8; /* 稍深颜色反馈 */
    transform: translateY(-2rpx); /* 轻微上浮效果 */
    box-shadow: 0 8rpx 15rpx rgba(108, 92, 231, 0.2);
}

/* 切换登录链接样式优化 */
.switch-mode {
    display: block;
    color: #6C5CE7;
    font-size: 28rpx;
    text-align: center; /* 居中显示更平衡 */
    cursor: pointer;
    padding: 10rpx 0;
    transition: color 0.3s ease;
}
.switch-mode:hover {
    color: #4B3F72;
}

/* 动画效果优化 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30rpx); /* 稍大位移更明显 */
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>