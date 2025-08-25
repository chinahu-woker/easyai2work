// src/components/common/share.js
import { useInviteStore } from '@/stores/inviteStore.js'; // 加上 .js 后缀

export default {
    data() {
        return {
            shareParams: {
                path: '',
                title: '邀请您成为新用户'
            }
        };
    },
    created() {
        const inviteStore = useInviteStore();
        if (inviteStore.inviteCode) {
            this.shareParams.path = `/pages/index/index?my_invite_code=${inviteStore.inviteCode}`;
        }
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            console.log(res.target);
        }
        return {
            title: this.shareParams.title,
            path: this.shareParams.path,
            imageUrl: 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/67873d6c232a3c5d52240dd6/upload/白银.png',
            desc: '邀请你使用'
        };
    },
    onShareTimeline() {
        return {
            title: this.shareParams.title,
            path: this.shareParams.path,
            imageUrl: 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/67873d6c232a3c5d52240dd6/upload/白银.png'
        };
    }
};



