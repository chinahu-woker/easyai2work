// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1 1  27，营业执照号：914 4  06   0 5MA55  6   H   1 K XH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import {getTransferedObjectUUID} from './classUtils';

const name = 'WebGLUniformLocation';

function uuid(id) {
    return getTransferedObjectUUID(name, id);
}

export default class WebGLUniformLocation {
    className = name;

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    static uuid = uuid;

    uuid() {
        return uuid(this.id);
    }
}