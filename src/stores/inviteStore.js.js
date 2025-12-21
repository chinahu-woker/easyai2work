// src/stores/inviteStore.js
import { defineStore } from 'pinia';

export const useInviteStore = defineStore('invite', {
  state: () => ({
    inviteCode: ''
  }),
  actions: {
    setInviteCode(inviteCode) {
      this.inviteCode = inviteCode;
    }
  }
});

