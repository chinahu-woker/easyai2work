// 海报生成工具类

export interface PosterData {
  title: string
  content: string
  image: string
  avatar: string
  username: string
  qrCode: string
  tags: string[]
}

export class PosterGenerator {
  private static canvasId = 'posterCanvas'
  private static canvasWidth = 750
  private static canvasHeight = 1334

  /**
   * 生成海报
   */
  static async generatePoster(data: PosterData): Promise<string> {
    return new Promise((resolve, reject) => {
      const ctx = uni.createCanvasContext(this.canvasId)
      
      // 设置画布背景
      this.drawBackground(ctx)
      
      // 绘制主要内容
      this.drawContent(ctx, data)
        .then(() => {
          // 输出图片
          ctx.draw(false, () => {
            setTimeout(() => {
              uni.canvasToTempFilePath({
                canvasId: this.canvasId,
                success: (res) => {
                  resolve(res.tempFilePath)
                },
                fail: reject
              })
            }, 1000)
          })
        })
        .catch(reject)
    })
  }

  /**
   * 绘制背景
   */
  private static drawBackground(ctx: any) {
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
    gradient.addColorStop(0, '#f8f9fa')
    gradient.addColorStop(1, '#e9ecef')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    
    // 绘制装饰元素
    ctx.fillStyle = 'rgba(0, 122, 255, 0.1)'
    ctx.fillRect(0, 0, this.canvasWidth, 120)
  }

  /**
   * 绘制内容
   */
  private static async drawContent(ctx: any, data: PosterData): Promise<void> {
    let currentY = 150

    // 绘制头部信息
    currentY = await this.drawHeader(ctx, data, currentY)
    
    // 绘制主图片
    if (data.image) {
      currentY = await this.drawMainImage(ctx, data.image, currentY)
    }
    
    // 绘制标题和内容
    currentY = this.drawTextContent(ctx, data, currentY)
    
    // 绘制标签
    currentY = this.drawTags(ctx, data.tags, currentY)
    
    // 绘制底部信息
    await this.drawFooter(ctx, data)
  }

  /**
   * 绘制头部信息
   */
  private static async drawHeader(ctx: any, data: PosterData, startY: number): Promise<number> {
    // 绘制头像
    if (data.avatar) {
      try {
        const avatarInfo = await this.getImageInfo(data.avatar)
        const avatarSize = 80
        const avatarX = 30
        
        ctx.save()
        ctx.beginPath()
        ctx.arc(avatarX + avatarSize/2, startY + avatarSize/2, avatarSize/2, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(avatarInfo.path, avatarX, startY, avatarSize, avatarSize)
        ctx.restore()
      } catch (error) {
        console.log('绘制头像失败:', error)
      }
    }
    
    // 绘制用户名
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(data.username || '匿名用户', 130, startY + 30)
    
    // 绘制时间
    ctx.fillStyle = '#999999'
    ctx.font = '28px sans-serif'
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    ctx.fillText(timeStr, 130, startY + 65)
    
    return startY + 120
  }

  /**
   * 绘制主图片
   */
  private static async drawMainImage(ctx: any, imageUrl: string, startY: number): Promise<number> {
    try {
      const imageInfo = await this.getImageInfo(imageUrl)
      const maxWidth = this.canvasWidth - 60
      const imageRatio = imageInfo.height / imageInfo.width
      const imageHeight = Math.min(maxWidth * imageRatio, 600) // 限制最大高度
      const imageWidth = imageHeight / imageRatio
      
      const imageX = (this.canvasWidth - imageWidth) / 2
      
      // 绘制阴影
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(imageX + 5, startY + 5, imageWidth, imageHeight)
      
      // 绘制图片
      ctx.drawImage(imageInfo.path, imageX, startY, imageWidth, imageHeight)
      
      // 绘制边框
      ctx.strokeStyle = '#e9ecef'
      ctx.lineWidth = 2
      ctx.strokeRect(imageX, startY, imageWidth, imageHeight)
      
      return startY + imageHeight + 40
    } catch (error) {
      console.log('绘制主图片失败:', error)
      return startY + 20
    }
  }

  /**
   * 绘制文字内容
   */
  private static drawTextContent(ctx: any, data: PosterData, startY: number): number {
    let currentY = startY
    
    // 绘制标题
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'left'
    
    const titleLines = this.wrapText(ctx, data.title || '分享内容', this.canvasWidth - 60)
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 30, currentY + (index * 50))
    })
    
    currentY += titleLines.length * 50 + 30
    
    // 绘制内容
    if (data.content) {
      ctx.fillStyle = '#666666'
      ctx.font = '32px sans-serif'
      
      const contentLines = this.wrapText(ctx, data.content, this.canvasWidth - 60)
      contentLines.slice(0, 6).forEach((line, index) => { // 最多显示6行
        ctx.fillText(line, 30, currentY + (index * 40))
      })
      
      currentY += Math.min(contentLines.length, 6) * 40 + 40
    }
    
    return currentY
  }

  /**
   * 绘制标签
   */
  private static drawTags(ctx: any, tags: string[], startY: number): number {
    if (!tags || tags.length === 0) return startY
    
    let currentY = startY
    let currentX = 30
    
    ctx.font = '28px sans-serif'
    
    tags.slice(0, 4).forEach((tag) => {
      const tagText = `#${tag}`
      const textWidth = ctx.measureText(tagText).width
      const tagWidth = textWidth + 24
      const tagHeight = 36
      
      // 检查是否需要换行
      if (currentX + tagWidth > this.canvasWidth - 30) {
        currentY += 50
        currentX = 30
      }
      
      // 绘制标签背景
      ctx.fillStyle = '#007aff'
      this.roundRect(ctx, currentX, currentY - 28, tagWidth, tagHeight, 18)
      ctx.fill()
      
      // 绘制标签文字
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(tagText, currentX + tagWidth/2, currentY - 5)
      
      currentX += tagWidth + 15
    })
    
    return currentY + 40
  }

  /**
   * 绘制底部信息
   */
  private static async drawFooter(ctx: any, data: PosterData): Promise<void> {
    const footerY = this.canvasHeight - 200
    
    // 绘制二维码
    if (data.qrCode) {
      try {
        const qrInfo = await this.getImageInfo(data.qrCode)
        const qrSize = 120
        const qrX = this.canvasWidth - qrSize - 30
        
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(qrX - 10, footerY - 10, qrSize + 20, qrSize + 20)
        
        ctx.drawImage(qrInfo.path, qrX, footerY, qrSize, qrSize)
        
        // 二维码说明
        ctx.fillStyle = '#666666'
        ctx.font = '24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('扫码查看', qrX + qrSize/2, footerY + qrSize + 25)
      } catch (error) {
        console.log('绘制二维码失败:', error)
      }
    }
    
    // 绘制品牌信息
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Julei', 30, footerY + 30)
    
    ctx.fillStyle = '#999999'
    ctx.font = '28px sans-serif'
    ctx.fillText('专业美甲设计助手', 30, footerY + 65)
  }

  /**
   * 获取图片信息
   */
  private static getImageInfo(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: resolve,
        fail: reject
      })
    })
  }

  /**
   * 文字换行处理
   */
  private static wrapText(ctx: any, text: string, maxWidth: number): string[] {
    const words = text.split('')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + word
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }

  /**
   * 绘制圆角矩形
   */
  private static roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
  }
}