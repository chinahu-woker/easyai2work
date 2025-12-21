// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号：9  1 4406 0 5MA 55   6   H    1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
/**
 * 网络请求
 * 文档地址：https://doc.firstui.cn/
 **/

import base from './fui-common.js'
import createTaskStore from './fui-taskStore.js'

const store = createTaskStore()

class FIRSTUI_INNER {
	constructor(initConfig = {}) {
		this.initConfig = initConfig
		this.request = []
		this.response = []
		this.cancelToken = {}
		this.dispatchRequest = this.dispatchRequest.bind(this)
		this.loading = false
	}
	dispatchRequest(config = {}) {
		let params = base.mergeConfig(this.initConfig, config)
		const task = {
			url: params.url,
			method: params.method,
			keys: params.keys,
			data: params.data
		}
		if (params.prevent && store.requestTaskStore(task)) {
			return new Promise((resolve, reject) => {
				reject({
					statusCode: -9998,
					errMsg: 'request:prevented'
				})
			});
		}
		const arrayFormat = params.arrayFormat;
		let options = base.getOptions(params)
		if (options.method.toLocaleLowerCase() === 'get' && arrayFormat !== 'comma') {
			options = base.getParamsHandle(options, arrayFormat)
		}
		let promise = Promise.resolve(options);
		promise = promise.then(config => {
			if (params.showLoading && !this.loading) {
				base.showLoading(params.loadingText)
				this.loading = true
			}
			return new Promise((resolve, reject) => {
				let requestTask = uni.request({
					...options,
					success: (res) => {
						if (params.showLoading && this.loading) {
							uni.hideLoading()
							this.loading = false
						}
						resolve(params.brief ? res.data : res)
					},
					fail: (err) => {
						if (params.showLoading && this.loading) {
							uni.hideLoading()
							this.loading = false
						}

						if (params.errorMsg) {
							base.toast(params.errorMsg)
						}
						reject(err)
					},
					complete: () => {
						store.removeRequestTask(task)
						if (params.cancelToken && this.cancelToken[params
								.cancelToken]) {
							delete this.cancelToken[params.cancelToken]
						}
					}
				})
				if (params.cancelToken) {
					this.cancelToken[params.cancelToken] = requestTask;
				}
				if (params.timeout && typeof params.timeout === 'number' && params.timeout > 2000) {
					setTimeout(() => {
						try {
							store.removeRequestTask(task)
							if (params.cancelToken) {
								delete this.cancelToken[params.cancelToken]
							}
							requestTask.abort();
						} catch (e) {}
						resolve({
							statusCode: -9999,
							errMsg: 'request:cancelled'
						});
					}, params.timeout)
				}
			});
		})

		return promise
	}
}


const inner = new FIRSTUI_INNER(base.config())

const http = {
	interceptors: {
		request: {
			use: (fulfilled, rejected) => {
				inner.request.push({
					fulfilled,
					rejected
				})
			},
			eject: (name) => {
				if (inner.request[name]) {
					inner.request[name] = null;
				}
			}
		},
		response: {
			use: (fulfilled, rejected) => {
				inner.response.push({
					fulfilled,
					rejected
				})
			},
			eject: (name) => {
				if (inner.response[name]) {
					inner.response[name] = null;
				}
			}
		}
	},
	create(config) {
		inner.initConfig = base.mergeConfig(base.config(), config, true);
	},
	get(url, config = {}) {
		config.method = 'GET'
		config.url = url || config.url || ''
		return http.request(config)
	},
	post(url, config = {}) {
		config.method = 'POST'
		config.url = url || config.url || ''
		return http.request(config)
	},
	all(requests) {
		return Promise.all(requests)
	},
	request(config = {}) {
		let chain = [inner.dispatchRequest, undefined];
		let promise = Promise.resolve(config);

		inner.request.forEach(interceptor => {
			chain.unshift(interceptor.fulfilled, interceptor.rejected);
		});

		inner.response.forEach(interceptor => {
			chain.push(interceptor.fulfilled, interceptor.rejected);
		});

		while (chain.length) {
			promise = promise.then(chain.shift(), chain.shift());
		}

		return promise;
	},
	abort(cancelToken) {
		if (!cancelToken) return;
		try {
			if (inner.cancelToken[cancelToken]) {
				inner.cancelToken[cancelToken].abort()
				delete inner.cancelToken[cancelToken]
				// console.log('request:cancelled')
			}
		} catch (e) {}
	}
}
export default http