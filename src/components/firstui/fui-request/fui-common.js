// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  1 127，营业执照号： 9 144 0 6 05M A 556H  1      K X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
const base = {
	//所有配置项，未设置则使用默认值
	config() {
		return {
			//接口域名，如：https://firstui.cn（如果host为空，则直接使用传入的目标地址url）
			host: '',
			// 接口地址：/order/getList（如果host为空，直接传入：https://firstui.cn/order/getList）
			url: '',
			//参数
			data: {},
			//请求头
			header: {
				/*
				 * content-type:
				 * application/x-www-form-urlencoded
				 * application/json
				 */
				'content-type': 'application/json'
			},
			//必须大写
			method: 'POST',
			//大于2000时才生效，否则使用全局配置或者默认值
			timeout: 0,
			dataType: 'json',
			//是否阻止拦截重复的请求（重复：请求地址url + method + 参数data 一致）
			prevent: false,
			//Array<String> 参数data中的key，prevent为true时有效，进行重复请求判断时移除keys中相关参数，如时间戳、随机数等.
			keys: [],
			//是否仅返回简要数据：true-仅返回接口数据data，false-返回包含header、statusCode、errMsg、data等数据
			brief: false,
			//String 请求标记，用于中断该请求，不同请求不可重复，只可包含数字、字母、下划线，如：firstui_001
			cancelToken: '',
			showLoading: true,
			//加载中提示文本，showLoading为true时有效
			loadingText: '',
			errorMsg: '网络不给力，请检查网络设置！',
			//跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
			withCredentials: false,
			//DNS解析时优先使用ipv4,仅 App-Android 支持 (HBuilderX 2.8.0+)
			firstIpv4: false,
			//get请求时参数值为数组时处理方式，可选值：comma-值逗号拼接，repeat-重复参数名，brackets-带中括号参数名，indices-数组下标参数名
			arrayFormat: 'comma'
		}
	},
	getOptions(config) {
		let options = {
			...config
		};
		const keys = ['host', 'timeout', 'prevent', 'keys', 'brief', 'cancelToken', 'showLoading', 'loadingText',
			'errorMsg', 'arrayFormat'
		];
		keys.forEach(item => {
			delete options[item];
		})
		return options;
	},
	getParamsHandle(config, arrayFormat) {
		const options = {
			...config
		}
		const idx = ['indices', 'repeat', 'brackets'].indexOf(arrayFormat)
		if (options.data && Object.keys(options.data).length > 0 && idx !== -1) {
			let params = []
			Object.entries(options.data).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					let _key = key;
					if (arrayFormat === 'brackets') {
						_key = `${key}[]`
					}
					value.forEach((item, index) => {
						if (arrayFormat === 'indices') {
							_key = `${key}[${index}]`
						}
						const val = Object.prototype.toString.call(item) === '[object Object]' ?
							JSON.stringify(item) : item;
						params.push(`${_key}=${val}`)
					})
				} else {
					params.push(`${key}=${value}`)
				}
			})

			options.url = `${options.url}?${params.join('&')}`
			options.data = {}
		}
		return options;
	},
	merge(a, b) {
		return Object.assign({}, a, b);
	},
	mergeConfig(defaultConfig, config, init) {
		let header = base.merge(defaultConfig.header, config.header || {});
		let params = base.merge(defaultConfig, config)
		params.header = header;
		if (!init) {
			let url = base.combineURLs(params.host, params.url)
			params.url = url;
		}
		return params;
	},
	//如果host为空，则直接使用传入的目标地址
	combineURLs(host, target) {
		return host ? host.replace(/\s+/g, '') + '/' + target.replace(/\s+/g, '').replace(/^\/+/, '') : target;
	},
	toast(text, duration, success) {
		text && uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	showLoading(title, mask = true) {
		uni.showLoading({
			mask: mask,
			title: title || '请稍候...'
		})
	}
}
export default base