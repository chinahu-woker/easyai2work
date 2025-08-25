// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：  11 27，营业执照号：9  1   440605 M A 5   5    6H 1K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
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