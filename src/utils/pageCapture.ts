import { useAppStore } from '@/stores/appStore'
import pagesGlobalData from '@/cofigs/data/pagesGlobalData.json'

/**
 * 页面截图工具类
 * 注意：由于微信小程序安全限制，无法直接截取页面内容
 * 这里生成一个包含当前页面信息的分享海报
 */
export class PageCapture {
  /**
   * 生成分享海报
   * @param pageInfo 页面信息，包括标题、副标题、背景图等
   */
  static async capturePage(pageInfo?: {
    title?: string
    subtitle?: string
    backgroundImage?: string
    inviteCode?: string
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        uni.getSystemInfo({
          success: (sysInfo) => {
            const canvasId = 'pageCaptureCanvas'
            const ctx = uni.createCanvasContext(canvasId)
            
            const width = sysInfo.windowWidth
            const height = sysInfo.windowHeight
            const pixelRatio = sysInfo.pixelRatio || 2
            
            const canvasWidth = width * pixelRatio
            const canvasHeight = height * pixelRatio
            
            const backgroundImage = pageInfo?.backgroundImage || pagesGlobalData?.globalAppData?.share?.backGroundImage
            
            if (backgroundImage) {
              uni.getImageInfo({
                src: backgroundImage,
                success: (imgInfo) => {
                  const imgRatio = imgInfo.height / imgInfo.width
                  const canvasRatio = canvasHeight / canvasWidth
                  
                  let drawWidth = canvasWidth
                  let drawHeight = canvasWidth * imgRatio
                  let drawX = 0
                  let drawY = 0
                  
                  if (imgRatio < canvasRatio) {
                    drawHeight = canvasHeight
                    drawWidth = canvasHeight / imgRatio
                    drawX = (canvasWidth - drawWidth) / 2
                  } else {
                    drawY = (canvasHeight - drawHeight) / 2
                  }
                  
                  ctx.drawImage(imgInfo.path, drawX, drawY, drawWidth, drawHeight)
                  ctx.setFillStyle('rgba(255, 255, 255, 0.75)')
                  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
                  
                  this.drawContent(ctx, canvasWidth, canvasHeight, pageInfo, resolve, reject, canvasId)
                },
                fail: (error) => {
                  console.warn('背景图片加载失败，使用渐变背景:', error)
                  this.drawGradientBackground(ctx, canvasWidth, canvasHeight)
                  this.drawContent(ctx, canvasWidth, canvasHeight, pageInfo, resolve, reject, canvasId)
                }
              })
            } else {
              this.drawGradientBackground(ctx, canvasWidth, canvasHeight)
              this.drawContent(ctx, canvasWidth, canvasHeight, pageInfo, resolve, reject, canvasId)
            }
          },
          fail: (error) => {
            console.error('获取系统信息失败:', error)
            reject(error)
          }
        })
      } catch (error) {
        console.error('生成分享海报失败:', error)
        reject(error)
      }
    })
  }
  
  private static drawGradientBackground(ctx: any, width: number, height: number): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#7041ed')
    gradient.addColorStop(0.5, '#9b6ff7')
    gradient.addColorStop(1, '#c79dff')
    
    ctx.setFillStyle(gradient)
    ctx.fillRect(0, 0, width, height)
    
    ctx.setFillStyle('rgba(255, 255, 255, 0.1)')
    ctx.beginPath()
    ctx.arc(width * 0.2, height * 0.2, width * 0.3, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(width * 0.8, height * 0.8, width * 0.25, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  private static drawContent(
    ctx: any,
    width: number,
    height: number,
    pageInfo: any,
    resolve: (value: string) => void,
    reject: (reason?: any) => void,
    canvasId: string
  ): void {
    try {
      const appStore = useAppStore()
      const inviteCode = pageInfo?.inviteCode || appStore.user?.my_invite_code
      
      ctx.setFillStyle('#333333')
      ctx.setFontSize(60)
      ctx.setTextAlign('center')
      const title = pageInfo?.title || 'Julei'
      ctx.fillText(title, width / 2, height * 0.35)
      
      ctx.setFillStyle('#666666')
      ctx.setFontSize(40)
      const subtitle = pageInfo?.subtitle || '专业美甲设计助手'
      ctx.fillText(subtitle, width / 2, height * 0.45)
      
      if (inviteCode) {
        const cardWidth = width * 0.7
        const cardHeight = height * 0.12
        const cardX = (width - cardWidth) / 2
        const cardY = height * 0.55
        
        ctx.setFillStyle('rgba(112, 65, 237, 0.1)')
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight)
        
        ctx.setFillStyle('#999999')
        ctx.setFontSize(28)
        ctx.fillText('我的邀请码', width / 2, cardY + cardHeight * 0.35)
        
        ctx.setFillStyle('#7041ed')
        ctx.setFontSize(48)
        ctx.fillText(inviteCode, width / 2, cardY + cardHeight * 0.75)
      }
      
      ctx.setFillStyle('#999999')
      ctx.setFontSize(28)
      ctx.fillText('长按识别小程序码', width / 2, height * 0.85)
      ctx.setFontSize(24)
      ctx.fillText('与我一起体验AI的魅力', width / 2, height * 0.9)
      
      ctx.draw(false, () => {
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId: canvasId,
            success: (res) => {
              console.log('分享海报生成成功:', res.tempFilePath)
              resolve(res.tempFilePath)
            },
            fail: (err) => {
              console.error('生成海报失败:', err)
              reject(err)
            }
          })
        }, 500)
      })
    } catch (error) {
      console.error('绘制内容时发生错误:', error)
      reject(error)
    }
  }
}
