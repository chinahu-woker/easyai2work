// src/stores/taskStore.ts
import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', {
  state: () => ({
    sharedData: null as any,
  }),
  actions: {
    setSharedData(data: any) {
      this.sharedData = data;
    },
  },
});