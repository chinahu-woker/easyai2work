// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：914 4    06  05M   A5    56  H1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
function QRBitBuffer() {
	this.buffer = new Array();
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},

	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},

	getLengthInBits : function() {
		return this.length;
	},

	putBit : function(bit) {

		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}

		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}

		this.length++;
	}
};

export default QRBitBuffer;