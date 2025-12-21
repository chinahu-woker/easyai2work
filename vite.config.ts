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
      uni(),
      tailwindcss(),
      UnifiedViteWeappTailwindcssPlugin(
        {
          rem2rpx: true,
          disabled: WeappTailwindcssDisabled
        }
      )
    ],
    build: {
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', '@dcloudio/uni-app'],
            'ui': ['uview-plus'],
            'utils': ['pinia']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: ['vue', 'pinia', '@dcloudio/uni-app'],
      exclude: ['@dcloudio/uni-app-plus']
    },
    css:{
      preprocessorOptions: {
        scss: {
        }
      },
	  define: {
	  	'global': {}
	  }
    }
  }
});
