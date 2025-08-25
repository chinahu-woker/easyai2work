// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：11  2 7，营业执照号：9 1 44 06 0 5M    A 5 5  6 H 1  KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import {getTransferedObjectUUID} from './classUtils';

const name = 'WebGLBuffer';

function uuid(id) {
    return getTransferedObjectUUID(name, id);
}

export default class WebGLBuffer {
    className = name;

    constructor(id) {
        this.id = id;
    }

    static uuid = uuid;

    uuid() {
        return uuid(this.id);
    }
}