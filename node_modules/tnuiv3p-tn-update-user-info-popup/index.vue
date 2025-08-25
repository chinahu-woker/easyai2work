<script lang="ts" setup>
import TnPopup from '@tuniao/tnui-vue3-uniapp/components/popup/src/popup.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { updateUserInfoPopupEmits, updateUserInfoPopupProps } from './types'
import {
  useUpdateUserInfoPopup,
  useUpdateUserInfoPopupCustomStyle,
} from './composables'

const props = defineProps(updateUserInfoPopupProps)
const emit = defineEmits(updateUserInfoPopupEmits)

const {
  showUpdatePopup,
  inputNickname,
  popupCloseHandle,
  nickNameInputHandle,
  submitBtnClickHandle,
  // #ifdef MP-WEIXIN
  avatarChooseHandle,
  // #endif
  // #ifndef MP-WEIXIN
  avatarClickHandle,
  // #endif
} = useUpdateUserInfoPopup(props, emit)
const { ns, submitBtnClass, submitBtnStyle } =
  useUpdateUserInfoPopupCustomStyle(props)
</script>

<template>
  <TnPopup
    v-model="showUpdatePopup"
    open-direction="bottom"
    close-btn
    :safe-area-inset-bottom="false"
    @close="popupCloseHandle"
  >
    <view :class="[ns.b()]">
      <view :class="[ns.e('title')]">
        {{ title }}
      </view>
      <view :class="[ns.e('tips')]">
        {{ tips }}
      </view>
      <view :class="[ns.e('avatar')]">
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="btn-reset"
          open-type="chooseAvatar"
          @chooseavatar="avatarChooseHandle"
        >
          <view :class="[ns.em('avatar', 'container')]">
            <image
              v-if="avatar"
              :class="[ns.em('avatar', 'image')]"
              :src="avatar"
              mode="aspectFill"
            />
            <view v-else :class="[ns.em('avatar', 'empty')]">
              <TnIcon name="clover-fill" />
            </view>
            <view :class="[ns.em('avatar', 'assist')]">
              <TnIcon name="camera-fill" />
            </view>
          </view>
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view
          :class="[ns.em('avatar', 'container')]"
          @tap.stop="avatarClickHandle"
        >
          <image
            v-if="avatar"
            :class="[ns.em('avatar', 'image')]"
            :src="avatar"
            mode="aspectFill"
          />
          <view v-else :class="[ns.em('avatar', 'empty')]">
            <TnIcon name="clover-fill" />
          </view>
          <view :class="[ns.em('avatar', 'assist')]">
            <TnIcon name="camera-fill" />
          </view>
        </view>
        <!-- #endif -->
      </view>

      <input
        :class="[ns.e('nickname-input')]"
        :value="inputNickname"
        type="nickname"
        placeholder="请输入昵称"
        placeholder-style="color:var(--tn-color-gray);"
        @input="nickNameInputHandle"
      />

      <view
        :class="[submitBtnClass]"
        :style="submitBtnStyle"
        @tap.stop="submitBtnClickHandle"
      >
        {{ confirmText }}
      </view>
    </view>
  </TnPopup>
</template>

<style lang="scss" scoped>
@import './theme-chalk/index.scss';
</style>
