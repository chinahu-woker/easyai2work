// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 12  7，营业执照号：    9  14  4 0 6  05  MA55 6H 1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import QRCode from './lib/QRCode.js'
import ErrorCorrectLevel from './lib/ErrorCorrectLevel.js'

var qrcode = function(data, opt) {
	opt = opt || {};
	var qr = new QRCode(opt.typeNumber || -1,
						opt.errorCorrectLevel || ErrorCorrectLevel.H);
	qr.addData(data);
	qr.make();

	return qr;
};

qrcode.ErrorCorrectLevel = ErrorCorrectLevel;

export default qrcode;
