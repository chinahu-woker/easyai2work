export const getBaseURL =()=>import.meta.env.VITE_API_URL

export const getOneAPiURL =()=>import.meta.env.VITE_CHAT_URL

export const ChatAPiUrl =()=> `${getOneAPiURL()}/v1/chat/completions`


export const getUserToken = () => {
	// 获取用户信息
	const refreshToken = uni.getStorageSync('refreshToken')
	
	// console.log("refreshToken获取成功", refreshToken)
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/auth/refreshTokens`, // 请求地址
			method: "POST",
			data: {
				"refreshToken":refreshToken,
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


export const getUserKey = (data,Rtoken_value) => {
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