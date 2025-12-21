/**
 * 坐标转换工具 - 用于处理画布坐标与原图坐标之间的转换
 */

/**
 * 坐标转换类
 */
export class CoordinateTransform {
  constructor(options = {}) {
    this.scale = options.scale || 1;
    this.translateX = options.translateX || 0;
    this.translateY = options.translateY || 0;
    this.rotation = options.rotation || 0; // 旋转角度（度）
    this.canvasWidth = options.canvasWidth || 0;
    this.canvasHeight = options.canvasHeight || 0;
    this.imageWidth = options.imageWidth || 0;
    this.imageHeight = options.imageHeight || 0;
    this.bgPosition = options.bgPosition || { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * 更新变换参数
   */
  updateTransform(params) {
    Object.assign(this, params);
  }

  /**
   * 将画布坐标转换为原图坐标
   * @param {number} x - 画布X坐标
   * @param {number} y - 画布Y坐标
   * @returns {Object} 转换后的原图坐标 {x, y}
   */
  canvasToImage(x, y) {
    console.log('坐标转换 - 输入画布坐标:', { x, y });
    console.log('坐标转换 - 当前变换参数:', {
      scale: this.scale,
      translateX: this.translateX,
      translateY: this.translateY,
      rotation: this.rotation,
      bgPosition: this.bgPosition
    });

    // 1. 首先应用缩放的逆变换
    let transformedX = (x - this.translateX) / this.scale;
    let transformedY = (y - this.translateY) / this.scale;

    console.log('坐标转换 - 缩放逆变换后:', { transformedX, transformedY });

    // 2. 如果有旋转，应用旋转的逆变换
    if (this.rotation !== 0) {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      
      // 平移到原点
      transformedX -= centerX;
      transformedY -= centerY;
      
      // 逆旋转（负角度）
      const radians = -this.rotation * Math.PI / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      
      const rotatedX = transformedX * cos - transformedY * sin;
      const rotatedY = transformedX * sin + transformedY * cos;
      
      // 平移回去
      transformedX = rotatedX + centerX;
      transformedY = rotatedY + centerY;
      
      console.log('坐标转换 - 旋转逆变换后:', { transformedX, transformedY });
    }

    // 3. 映射到原图坐标系
    const imageX = transformedX * (this.imageWidth / this.canvasWidth);
    const imageY = transformedY * (this.imageHeight / this.canvasHeight);

    console.log('坐标转换 - 最终原图坐标:', { imageX, imageY });

    return { x: imageX, y: imageY };
  }

  /**
   * 将原图坐标转换为画布坐标
   * @param {number} x - 原图X坐标
   * @param {number} y - 原图Y坐标
   * @returns {Object} 转换后的画布坐标 {x, y}
   */
  imageToCanvas(x, y) {
    // 1. 从原图坐标系映射到画布坐标系
    let canvasX = x * (this.canvasWidth / this.imageWidth);
    let canvasY = y * (this.canvasHeight / this.imageHeight);

    // 2. 如果有旋转，应用旋转变换
    if (this.rotation !== 0) {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      
      // 平移到原点
      canvasX -= centerX;
      canvasY -= centerY;
      
      // 旋转
      const radians = this.rotation * Math.PI / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      
      const rotatedX = canvasX * cos - canvasY * sin;
      const rotatedY = canvasX * sin + canvasY * cos;
      
      // 平移回去
      canvasX = rotatedX + centerX;
      canvasY = rotatedY + centerY;
    }

    // 3. 应用缩放和平移变换
    const finalX = canvasX * this.scale + this.translateX;
    const finalY = canvasY * this.scale + this.translateY;

    return { x: finalX, y: finalY };
  }

  /**
   * 获取变换矩阵
   * @returns {Object} 变换矩阵参数
   */
  getTransformMatrix() {
    return {
      scale: this.scale,
      translateX: this.translateX,
      translateY: this.translateY,
      rotation: this.rotation
    };
  }

  /**
   * 计算变换后的矩形区域
   * @param {Object} rect - 原始矩形 {x, y, width, height}
   * @returns {Object} 变换后的矩形
   */
  transformRect(rect) {
    const topLeft = this.imageToCanvas(rect.x, rect.y);
    const topRight = this.imageToCanvas(rect.x + rect.width, rect.y);
    const bottomLeft = this.imageToCanvas(rect.x, rect.y + rect.height);
    const bottomRight = this.imageToCanvas(rect.x + rect.width, rect.y + rect.height);

    // 计算变换后的边界框
    const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * 创建用于canvas drawImage的参数
   * @param {string} imageSrc - 图片源
   * @param {Object} sourceRect - 源矩形（可选）
   * @returns {Object} drawImage参数
   */
  createDrawImageParams(imageSrc, sourceRect = null) {
    if (sourceRect) {
      // 如果指定了源矩形，需要考虑变换
      const transformedRect = this.transformRect(sourceRect);
      return {
        imageSrc,
        sx: sourceRect.x,
        sy: sourceRect.y,
        sWidth: sourceRect.width,
        sHeight: sourceRect.height,
        dx: transformedRect.x,
        dy: transformedRect.y,
        dWidth: transformedRect.width,
        dHeight: transformedRect.height
      };
    } else {
      // 使用整个图片
      return {
        imageSrc,
        dx: this.bgPosition.x,
        dy: this.bgPosition.y,
        dWidth: this.bgPosition.width,
        dHeight: this.bgPosition.height
      };
    }
  }
}

/**
 * 创建坐标转换实例的工厂函数
 * @param {Object} options - 配置选项
 * @returns {CoordinateTransform} 坐标转换实例
 */
export function createCoordinateTransform(options) {
  return new CoordinateTransform(options);
}

/**
 * 快速坐标转换函数 - 将画布坐标转换为原图坐标
 * @param {number} x - 画布X坐标
 * @param {number} y - 画布Y坐标
 * @param {Object} transform - 变换参数
 * @returns {Object} 转换后的原图坐标
 */
export function canvasToImageQuick(x, y, transform) {
  const ct = new CoordinateTransform(transform);
  return ct.canvasToImage(x, y);
}

/**
 * 快速坐标转换函数 - 将原图坐标转换为画布坐标
 * @param {number} x - 原图X坐标
 * @param {number} y - 原图Y坐标
 * @param {Object} transform - 变换参数
 * @returns {Object} 转换后的画布坐标
 */
export function imageToCanvasQuick(x, y, transform) {
  const ct = new CoordinateTransform(transform);
  return ct.imageToCanvas(x, y);
}