import { defineConfig } from "vite";
import process from 'node:process'

const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'
const WeappTailwindcssDisabled = isH5 || isApp
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite')
  return {
    plugins: [
      // 改成 mts，则爆 uni is not a function
      uni(),
      // 以默认的 cjs 方式加载，报错
      // Failed to resolve "@tailwindcss/vite". This package is ESM only but it was tried to load by `require`
      tailwindcss(),
      UnifiedViteWeappTailwindcssPlugin(
        {
          rem2rpx: true,
          disabled: WeappTailwindcssDisabled
        }
      )
    ],
    css:{
      preprocessorOptions: {
        scss: {
          // additionalData: `$u-primary: #8d1520;`
          // additionalData: '@import "@/styles/theme.scss";'
        }
      },
	  define: {
	  	      'global': {} // 模拟 global 变量
	  	    }
    }
  }
});
