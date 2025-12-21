// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1 2 7，营业执照号： 91 440 6     0 5   MA5 56  H 1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
export default class WebGLShaderPrecisionFormat {
    className = 'WebGLShaderPrecisionFormat';

    constructor({
        rangeMin, rangeMax, precision
    }) {
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.precision = precision;
    }
}