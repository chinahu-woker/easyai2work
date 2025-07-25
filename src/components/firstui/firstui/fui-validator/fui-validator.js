// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 9  1  4   406  05 M A5  56H1 K X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
/**
 * 表单验证
 * https://doc.firstui.cn/
 **/

const form = {
	/*
	  非必填情况下，如果值为空则不进行校验
	*/
	validator: function(formData, rules, checkAll = false) {
		let result = {
			isPassed: true,
			errorMsg: checkAll ? [] : ''
		};
		for (let item of rules) {
			const key = item.name;
			const rule = item.rule || [];
			const validator = item.validator || [];
			const msgArr = item.msg || [];
			const ruleLen = rule.length;
			const validatorLen = validator.length;
			let itemVal = formData[key];
			itemVal = (itemVal === null || itemVal === undefined ? '' : itemVal).toString();
			if (!key || (ruleLen === 0 && validatorLen === 0) || (!~rule.indexOf("required") &&
					itemVal.length === 0)) {
				continue;
			}
			if (ruleLen) {
				for (let i = 0; i < ruleLen; i++) {
					let ruleItem = rule[i];
					let msg = msgArr[i] || `${key} error !`;
					if (!ruleItem) continue;
					//数据处理
					let value = null;
					if (~ruleItem.indexOf(":")) {
						let temp = ruleItem.split(":");
						ruleItem = temp[0];
						value = temp[1];
					}
					let isError = false;
					switch (ruleItem) {
						case "required":
							isError = form._isNullOrEmpty(formData[key]);
							break;
						case "isMobile":
							isError = !form._isMobile(formData[key]);
							break;
						case "isEmail":
							isError = !form._isEmail(formData[key]);
							break;
						case "isCarNo":
							isError = !form._isCarNo(formData[key]);
							break;
						case "isIdCard":
							isError = !form._isIdCard(formData[key]);
							break;
						case "isAmount":
							isError = !form._isAmount(formData[key]);
							break;
						case "isNumber":
							isError = !form._isNumber(formData[key]);
							break;
						case "isChinese":
							isError = !form._isChinese(formData[key]);
							break;
						case "isNotChinese":
							isError = !form._isNotChinese(formData[key]);
							break;
						case "isEnglish":
							isError = !form._isEnglish(formData[key]);
							break;
						case "isEnAndNo":
							isError = !form._isEnAndNo(formData[key]);
							break;
						case "isEnOrNo":
							isError = !form._isEnOrNo(formData[key]);
							break;
						case "isSpecial":
							isError = form._isSpecial(formData[key]);
							break;
						case "isEmoji":
							isError = form._isEmoji(formData[key]);
							break;
						case "isDate":
							isError = !form._isDate(formData[key]);
							break;
						case "isUrl":
							isError = !form._isUrl(formData[key]);
							break;
						case "isSame":
							isError = !form._isSame(formData[key], formData[value]);
							break;
						case "range":
							let range = null;
							try {
								range = JSON.parse(value);
								if (range.length <= 1) {
									throw new Error("range值传入有误！")
								}
							} catch (e) {
								return "range值传入有误！"
							}
							isError = !form._isRange(formData[key], range[0], range[1])
							break;
						case "minLength":
							isError = !form._minLength(formData[key], value)
							break;
						case "maxLength":
							isError = !form._maxLength(formData[key], value)
							break;
						case "isKeyword":
							isError = !form._isKeyword(formData[key], value)
							break;
						default:
							break;
					}

					if (isError) {
						result.isPassed = false;
						if (checkAll) {
							result.errorMsg.push({
								name: key,
								msg: msg
							})
							break;
						} else {
							result.errorMsg = msg;
							return result;
						}
					}
				}
			}

			if (validatorLen) {
				for (let model of validator) {
					let func = model.method;
					if (func && !func(formData[key])) {
						result.isPassed = false;
						if (checkAll) {
							const index = result.errorMsg.findIndex(item => item.name === key)
							if (index === -1) {
								result.errorMsg.push({
									name: key,
									msg: model.msg || `${key} error !`
								})
							}
							break;
						} else {
							result.errorMsg = model.msg || `${key} error !`;
							return result;
						}
					}
				}
			}
		}
		return result;
	},
	//允许填写字符串null或者undefined
	_isNullOrEmpty: function(value) {
		return (value === null || value === '' || value === undefined) ? true : false;
	},
	_isMobile: function(value) {
		return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(String(value));
	},
	_isEmail: function(value) {
		return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value);
	},
	_isCarNo: function(value) {
		// 新能源车牌
		const xreg =
			/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
		// 旧车牌
		const creg =
			/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
		if (value.length === 7) {
			return creg.test(value);
		} else if (value.length === 8) {
			return xreg.test(value);
		} else {
			return false;
		}
	},
	_isIdCard: function(value) {
		let idCard = value;
		if (idCard.length == 15) {
			return this.__isValidityBrithBy15IdCard(idCard);
		} else if (idCard.length == 18) {
			let arrIdCard = idCard.split("");
			if (this.__isValidityBrithBy18IdCard(idCard) && this.__isTrueValidateCodeBy18IdCard(arrIdCard)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	__isTrueValidateCodeBy18IdCard: function(arrIdCard) {
		let sum = 0;
		let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
		let ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
		if (arrIdCard[17].toLowerCase() == 'x') {
			arrIdCard[17] = 10;
		}
		for (let i = 0; i < 17; i++) {
			sum += Wi[i] * arrIdCard[i];
		}
		let valCodePosition = sum % 11;
		if (arrIdCard[17] == ValideCode[valCodePosition]) {
			return true;
		} else {
			return false;
		}
	},
	__isValidityBrithBy18IdCard: function(idCard18) {
		let year = idCard18.substring(6, 10);
		let month = idCard18.substring(10, 12);
		let day = idCard18.substring(12, 14);
		let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 ||
			temp_date.getDate() !=
			parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	},
	__isValidityBrithBy15IdCard: function(idCard15) {
		let year = idCard15.substring(6, 8);
		let month = idCard15.substring(8, 10);
		let day = idCard15.substring(10, 12);
		let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 ||
			temp_date.getDate() !=
			parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	},
	_isAmount: function(value) {
		//是否为金额，只允许保留两位小数
		return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(String(value));
	},
	_isNumber: function(value) {
		//是否全为数字
		return /^[0-9]+$/.test(String(value));
	},
	//是否全部为中文
	_isChinese: function(value) {
		let reg = /^[\u4e00-\u9fa5]+$/;
		return value !== "" && reg.test(value) && !form._isSpecial(value) && !form._isEmoji(value)
	},
	//是否不包含中文，可以有特殊字符
	_isNotChinese: function(value) {
		let reg = /.*[\u4e00-\u9fa5]+.*$/;
		let result = true;
		if (reg.test(value)) {
			result = false
		}
		return result
	},
	_isEnglish: function(value) {
		return /^[a-zA-Z]*$/.test(value)
	},
	_isEnAndNo: function(value) {
		//4~30位数字和字母组合
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,30}$/.test(value);
	},
	_isEnOrNo: function(value) {
		let reg = /^[A-Za-z0-9]+$/;
		return reg.test(value)
	},
	_isSpecial: function(value) {
		//是否包含特殊字符
		let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
			regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
		if (regEn.test(value) || regCn.test(value)) {
			return true;
		}
		return false;
	},
	_isEmoji: function(value) {
		//是否包含表情
		return /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(value);
	},
	_isDate: function(value) {
		//2019-10-12
		const reg =
			/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
		return reg.test(value);
	},
	_isUrl: function(value) {
		return /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(:[0-9]{1,5})?((\/?)|(\/[\\\w_!~*\\'()\\\.;?:@&=+$,%#-]+)+\/?)$/
			.test(value);
	},
	_isSame: function(value1, value2) {
		return value1 === value2
	},
	_isRange: function(value, range1, range2) {
		if ((!range1 && range1 != 0) && (!range2 && range2 != 0)) {
			return true;
		} else if (!range1 && range1 != 0) {
			return value <= range2
		} else if (!range2 && range2 != 0) {
			return value >= range1
		} else {
			return value >= range1 && value <= range2
		}
	},
	_minLength: function(value, min) {
		return value.length >= Number(min)
	},
	_maxLength: function(value, max) {
		return value.length <= Number(max)
	},
	_isKeyword: function(value, keywords) {
		//是否包含关键词，敏感词，多个以英文逗号分隔，包含则为false,弹出提示语！
		let result = true;
		if (!keywords) return result;
		let key = keywords.split(',');
		for (let i = 0, len = key.length; i < len; i++) {
			if (~value.indexOf(key[i])) {
				result = false;
				break;
			}
		}
		return result;
	}
};

export default {
	validator: form.validator
}