// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  1 27，营业执照号：9 1  440  60 5 MA5   56H   1K X   H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
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