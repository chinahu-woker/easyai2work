import { ref, watch } from 'vue'
import type { SetupContext } from 'vue'
import type {
  UpdateUserInfoPopupEmits,
  UpdateUserInfoPopupProps,
} from '../types'

export const useUpdateUserInfoPopup = (
  props: UpdateUserInfoPopupProps,
  emits: SetupContext<UpdateUserInfoPopupEmits>['emit']
) => {
  // 显示更新用户信息弹框
  const showUpdatePopup = ref<boolean>(false)
  // 输入的用户名
  const inputNickname = ref<string>(props.nickname)

  watch(
    () => props.show,
    (val) => {
      showUpdatePopup.value = val
    },
    {
      immediate: true,
    }
  )

  // 监听输入的用户名
  const nickNameInputHandle = (e: any) => {
    const value = e.detail.value
    inputNickname.value = value
    emits('update:nickname', value)
  }

  // 选择头像事件
  // #ifdef MP-WEIXIN
  const avatarChooseHandle = (e: any) => {
    emits('choose-avatar', e.detail.avatarUrl)
  }
  // #endif
  // #ifndef MP-WEIXIN
  const avatarClickHandle = () => {
    uni.chooseImage({
      count: 1,
      success: (res) => {
        emits('choose-avatar', res.tempFilePaths[0])
      },
    })
  }
  // #endif

  // 点击保存按钮
  const submitBtnClickHandle = () => {
    if (!inputNickname.value || !props.avatar) {
      return
    }
    emits('confirm', props.avatar, inputNickname.value)
    emits('update:show', false)
  }

  // 弹框关闭事件
  const popupCloseHandle = () => {
    emits('update:show', false)
  }

  return {
    showUpdatePopup,
    inputNickname,
    nickNameInputHandle,
    popupCloseHandle,
    submitBtnClickHandle,
    // #ifdef MP-WEIXIN
    avatarChooseHandle,
    // #endif
    // #ifndef MP-WEIXIN
    avatarClickHandle,
    // #endif
  }
}
