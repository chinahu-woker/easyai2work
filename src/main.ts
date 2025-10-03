import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import { createPinia } from 'pinia'
import { useAppStore } from '@/stores/appStore'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(uviewPlus)
  // 注册全局应用级隐藏/显示处理：使用 store 的延迟清理逻辑
  try {
    const appStore = useAppStore()
    // 注意：某些平台可能没有 onAppHide/onAppShow API 在这个时机可用，使用 try/catch 以防异常
    ;(uni as any).onAppHide && (uni as any).onAppHide(() => {
      try { appStore.scheduleAppHideCleanup && appStore.scheduleAppHideCleanup() } catch (e) { /* ignore */ }
    })
    ;(uni as any).onAppShow && (uni as any).onAppShow(() => {
      try { appStore.cancelAppHideCleanup && appStore.cancelAppHideCleanup() } catch (e) { /* ignore */ }
    })
  } catch (e) { /* ignore */ }
  return {
    app,
  }
}
