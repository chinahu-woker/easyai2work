// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 112  7，营业执照号： 9 144 0 6  05  MA 5   5 6  H 1KX H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import {getTransferedObjectUUID} from './classUtils';

const name = 'WebGLFrameBuffer';

function uuid(id) {
    return getTransferedObjectUUID(name, id);
}

export default class WebGLFramebuffer {
    className = name;

    constructor(id) {
        this.id = id;
    }

    static uuid = uuid;

    uuid() {
        return uuid(this.id);
    }
}