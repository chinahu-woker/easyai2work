// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：1   127，营业执照号：   91 440  60   5 M   A55 6H  1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import {getTransferedObjectUUID} from './classUtils';

const name = 'WebGLTexture';

function uuid(id) {
    return getTransferedObjectUUID(name, id);
}

export default class WebGLTexture {
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