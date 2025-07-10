// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1  12 7，营业执照号：    9 1440 605   M  A55  6H 1K X  H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
export default class WebGLActiveInfo {
    className = 'WebGLActiveInfo';

    constructor({
        type, name, size
    }) {
        this.type = type;
        this.name = name;
        this.size = size;
    }
}