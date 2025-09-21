export const getBaseURL =()=>import.meta.env.VITE_API_URL


export const GetAllManagerInfor = (data) => {

	
	console.log("data获取成功", data)
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/content/mp/content`, // 请求地址
			method: "GET",
			header:{
				'Authorization': 'Bearer ' + data,
			},
			enableChunked: false, // 开启流传输
			success: (res) => {
				resolve(res);
				console.log('配置文件请求成功', res.data);

				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});

		console.log('requestTask', requestTask)
	});
}
export const SubmitSwiper =(token,data) =>{
	
	console.log("data获取成功", data)
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url: `${getBaseURL()}/content/mp/content`, // 请求地址
			method: "POST",
			header:{
				'Authorization': 'Bearer ' + token,
			},
			data:data,
			enableChunked: false, // 开启流传输
			success: (res) => {
				resolve(res);
				console.log('提交成功', res);
	
				// uni.parseStreamData(res.data)
			}, // 请求成功回调
			fail: (err) => {
				reject(err);
				console.log('请求失败', err);
			} // 请求失败回调
		});
	
		console.log('requestTask', requestTask)
	});
	
}