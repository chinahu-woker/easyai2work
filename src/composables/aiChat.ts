export const getBaseURL = () => import.meta.env.VITE_API_URL

export const getOneAPiURL = () => import.meta.env.VITE_CHAT_URL

export const managerBaseUrl = import.meta.env.VITE_MANAGER_API_URL
export const ChatAPiUrl = () => `${getOneAPiURL()}/v1/chat/completions`

// 扫码登录相关 API
export const getWeSession = (code: string) => {
	
	console.log("managerBaseUrl", managerBaseUrl)
	if (!managerBaseUrl) {
		throw new Error('MANAGER_API_URL 未配置，扫码登录不可用')
	}

	console.debug('[aiChat] getWeSession -> url:', `${managerBaseUrl}/api/auth/wx_session`, 'code:', code)

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${managerBaseUrl}/api/auth/wx_session`,
			method: 'POST',
			data: { code },
			header: { 'Content-Type': 'application/json' },
			success: (res) => {
				console.debug('[aiChat] getWeSession response:', res)
				if (res.statusCode === 200 && res.data) {
					resolve(res.data)
				} else {
					reject(new Error('获取登录凭证失败'))
				}
			},
			fail: (err) => {
				console.debug('[aiChat] getWeSession fail:', err)
				reject(err)
			}
		})
	})
}

export const confirmScan = (qrToken: string, weSessionToken: string) => {

	if (!managerBaseUrl) {
		throw new Error('MANAGER_API_URL 未配置，扫码登录不可用')
	}

	console.debug('[aiChat] confirmScan -> url:', `${managerBaseUrl}/api/auth/qr_scan`, 'qrToken:', qrToken)

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${managerBaseUrl}/api/auth/qr_scan`,
			method: 'POST',
			data: { qr_token: qrToken, we_session_token: weSessionToken },
			header: { 'Content-Type': 'application/json' },
			success: (res) => {
				console.debug('[aiChat] confirmScan response:', res)
				if (res.statusCode === 200 && res.data) {
					resolve(res.data)
				} else {
					reject(new Error('扫码确认失败'))
				}
			},
			fail: (err) => {
				console.debug('[aiChat] confirmScan fail:', err)
				reject(err)
			}
		})
	})
}

// export const PostMask = (token, mask) => {
// 	return requestTask = uni.request({
// 		url: `${getBaseURL()}/file/merge/mask`, // 请求地址
// 		method: "POST",
// 		data: {
// 			"refreshToken": refreshToken,
// 		},
// 		header: {
// 			'Authorization': 'Bearer ' + token,
			
// 		},
// 	})
// }
export const getUserToken = () => {
	// 获取用户信息
	const refreshToken = uni.getStorageSync('refreshToken')

	// console.log("refreshToken获取成功", refreshToken)
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/auth/refreshTokens`, // 请求地址
			method: "POST",
			data: {
				"refreshToken": refreshToken,
			},
			enableChunked: false, // 开启流传输
			success: (res) => {

				resolve(res);
				// console.log('getUserToken请求成功', res.data);

				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});

		// console.log('requestTask', requestTask)
	});
}





export const getModelList = (data) => {
	// 模型列表

	const token = data
	// console.log("aichat获取token成功", token)
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/oneapi/channel`, // 请求地址
			method: "GET",
			header: {
				'Authorization': 'Bearer ' + token,
				// 'Host': 'scschool.cc',
			},
			enableChunked: false, // 开启流传输
			success: (res) => {

				resolve(res);
				// console.log('getModelList请求成功', res.data);

				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});

		// console.log('requestTask', requestTask)
	});
}


export const getUserKey = (data, Rtoken_value) => {
	// 获取用户Key值
	const usedata = {
		"user_id": data.id,
		"status": data.status,
		"remain_quota": data.quota,
		"unlimited_quota": false
	}
	const token = Rtoken_value
	// console.log("获取用户Key值", usedata,token)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/oneapi/token`, // 请求地址
			method: "POST",
			header: {
				'Authorization': 'Bearer ' + token,
			},
			data: usedata,
			enableChunked: false, // 开启流传输
			success: (res) => {

				resolve(res);
				// console.log('getModelList请求成功', res.data);

				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});

		// console.log('requestTask', requestTask)
	});
}


export const getUserInfo = (data) => {
	// 获取用户Key值
	const restoken = data.refresh_token
	// console.log("获取用户restoken值", restoken)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/oneapi/user`, // 请求地址
			method: "POST",
			header: {
				'Authorization': 'Bearer ' + restoken,

			},
			data: data,
			enableChunked: false, // 开启流传输
			success: (res) => {
				resolve(res);
				// console.log('getUserInfo请求成功', res.data);

				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});

		// console.log('requestTask', requestTask)
	});
}


export const getdetail = (data, id) => {
	// 获取用户Key值
	const restoken = data.refresh_token
	// console.log("获取用户restoken值", restoken)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/draw/history/detail/${id}`, // 请求地址
			method: "GET",
			header: {
				'Authorization': 'Bearer ' + restoken,

			},
			success: (res) => {
				resolve(res);
				// console.log('getUserInfo请求成功', res.data);
				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});
		// console.log('requestTask', requestTask)
	});
}

export const delComment = (data, id) => {
	// 获取用户Key值
	const restoken = data.refresh_token;
	// console.log("获取用户restoken值", restoken)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/comment/${id}`, // 请求地址
			method: "DELETE",
			header: {
				Authorization: "Bearer " + restoken,
			},
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
				console.log("请求失败", err);
			},
		});
		// console.log('requestTask', requestTask)
	});
};
export const Comment = (data, content) => {
	// 获取用户Key值
	const restoken = data.refresh_token
	// console.log("获取用户restoken值", restoken)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/comment`,
			method: "POST",
			header: {
				'Authorization': 'Bearer ' + restoken,

			},
			data: content,
			success: (res) => {
				resolve(res);
				// console.log('getUserInfo请求成功', res.data);
				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});
		// console.log('requestTask', requestTask)
	});
}
export const allUserName = (data) => {
	const restoken = data.refresh_token;

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${getBaseURL()}/users/allUserName`,
			method: "GET",
			header: {
				'Authorization': 'Bearer ' + restoken,
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data) {
					// ✅ 正确保存数组
					uni.setStorageSync('allUserNames', res.data);
					resolve(res.data);
				} else {
					uni.showToast({ title: '获取用户列表失败', icon: 'none' });
					reject(res);
				}
			},
			fail: (err) => {
				console.error('请求失败:', err);
				reject(err);
			}
		});
	});
}
export const XieYiServer = () => {

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${getBaseURL()}/policy/service`,
			method: "GET",

			success: (res) => {
				if (res.statusCode === 200 && res.data) {
					// ✅ 正确保存数组
					uni.setStorageSync('XieYiServer', res.data);
					resolve(res.data);
				} else {
					uni.showToast({ title: 'XieYiServer', icon: 'none' });
					reject(res);
				}
			},
			fail: (err) => {
				console.error('请求失败:', err);
				reject(err);
			}
		});
	});
}
export const XieYiprivacy = () => {

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${getBaseURL()}/policy/privacy`,
			method: "GET",

			success: (res) => {
				if (res.statusCode === 200 && res.data) {

					uni.setStorageSync('XieYiprivacy', res.data);
					resolve(res.data);
				} else {
					uni.showToast({ title: 'XieYiprivacy', icon: 'none' });
					reject(res);
				}
			},
			fail: (err) => {
				console.error('请求失败:', err);
				reject(err);
			}
		});
	});
}


export const registerByUsername = (data) => {
	// 获取用户Key值

	console.log("注册用户的值：", data)

	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/users/registerByUsername`,
			method: "POST",

			data: data,
			success: (res) => {
				console.log('注册请求已经完成：', res.data);
				resolve(res.data)
				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});
		console.log('注册：requestTask：', requestTask)
	});
}