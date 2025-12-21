/**
 * 图片路径处理工具 - 基于博客最佳实践
 */

/**
 * 验证图片路径是否可访问
 * @param {string} path 图片路径
 * @returns {Promise<boolean>} 是否可访问
 */
export function validateImagePath(path) {
  return new Promise((resolve, reject) => {
    if (!path || typeof path !== 'string') {
      reject(new Error('图片路径无效'));
      return;
    }

    console.log('验证图片路径:', path);

    uni.getImageInfo({
      src: path,
      success: (res) => {
        console.log('✅ 图片路径验证成功:', res);
        resolve(true);
      },
      fail: (err) => {
        console.error('❌ 图片路径验证失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 修复图片路径
 * @param {string} originalPath 原始路径
 * @returns {Promise<string>} 修复后的路径
 */
export function fixImagePath(originalPath) {
  return new Promise((resolve, reject) => {
    console.log('尝试修复图片路径:', originalPath);

    // 如果是临时文件路径，尝试转换为本地路径
    if (originalPath.startsWith('http://tmp/') || originalPath.startsWith('https://tmp/')) {
      // 根据平台获取推荐的路径格式
      const localPaths = getPlatformPaths(originalPath);
      console.log('根据平台推荐的路径:', localPaths);

      // 依次尝试不同的路径格式
      const tryPath = (index) => {
        if (index >= localPaths.length) {
          reject(new Error('所有路径格式都无法访问'));
          return;
        }

        const currentPath = localPaths[index];
        console.log(`尝试路径 ${index + 1}:`, currentPath);

        validateImagePath(currentPath)
          .then(() => {
            console.log('✅ 路径修复成功:', currentPath);
            resolve(currentPath);
          })
          .catch((err) => {
            console.log(`❌ 路径 ${currentPath} 失败:`, err);
            tryPath(index + 1);
          });
      };

      tryPath(0);
    } else {
      reject(new Error('不支持的路径格式'));
    }
  });
}

/**
 * 获取可用的图片路径
 * @param {string} path 原始路径
 * @returns {Promise<string>} 可用的路径
 */
export function getValidImagePath(path) {
  return new Promise((resolve, reject) => {
    console.log('开始获取有效图片路径:', path);
    
    // 首先验证原始路径
    validateImagePath(path)
      .then(() => {
        console.log('✅ 原始路径有效:', path);
        resolve(path);
      })
      .catch(() => {
        console.log('❌ 原始路径无效，尝试修复...');
        // 如果原始路径失败，尝试修复
        fixImagePath(path)
          .then((fixedPath) => {
            console.log('✅ 路径修复成功:', fixedPath);
            resolve(fixedPath);
          })
          .catch((err) => {
            console.error('❌ 路径修复失败:', err);
            reject(err);
          });
      });
  });
}

/**
 * 检查是否为临时文件路径
 * @param {string} path 路径
 * @returns {boolean} 是否为临时文件路径
 */
export function isTempFilePath(path) {
  return path && (
    path.startsWith('http://tmp/') ||
    path.startsWith('https://tmp/') ||
    path.startsWith('wxfile://tmp/') ||
    path.startsWith('file://tmp/') ||
    path.startsWith('tmp/')
  );
}

/**
 * 获取当前平台
 * @returns {string} 平台标识
 */
export function getCurrentPlatform() {
  // #ifdef MP-WEIXIN
  return 'mp-weixin';
  // #endif
  
  // #ifdef APP-PLUS
  return 'app';
  // #endif
  
  // #ifdef H5
  return 'h5';
  // #endif
  
  return 'unknown';
}

/**
 * 根据平台获取推荐的路径格式
 * @param {string} originalPath 原始路径
 * @returns {string[]} 推荐的路径格式数组
 */
export function getPlatformPaths(originalPath) {
  const platform = getCurrentPlatform();
  const fileName = originalPath.split('/').pop();
  
  console.log('当前平台:', platform);
  console.log('文件名:', fileName);
  
  switch (platform) {
    case 'mp-weixin':
      return [
        `wxfile://tmp/${fileName}`,
        `file://tmp/${fileName}`,
        `tmp/${fileName}`,
        originalPath // 保留原始路径作为备选
      ];
    case 'app':
      return [
        `file://tmp/${fileName}`,
        `tmp/${fileName}`,
        originalPath
      ];
    case 'h5':
      return [
        originalPath,
        `tmp/${fileName}`
      ];
    default:
      return [
        originalPath,
        `wxfile://tmp/${fileName}`,
        `file://tmp/${fileName}`,
        `tmp/${fileName}`
      ];
  }
}

/**
 * 获取文件扩展名
 * @param {string} path 文件路径
 * @returns {string} 文件扩展名
 */
export function getFileExtension(path) {
  if (!path) return '';
  const parts = path.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

/**
 * 检查是否为支持的图片格式
 * @param {string} path 文件路径
 * @returns {boolean} 是否为支持的图片格式
 */
export function isSupportedImageFormat(path) {
  const ext = getFileExtension(path);
  const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return supportedFormats.includes(ext);
}

/**
 * 根据博客最佳实践选择图片
 * @param {Object} options 选择选项
 * @returns {Promise<string>} 图片路径
 */
export function chooseImageWithBestPractice(options = {}) {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    console.log('开始选择图片，选项:', finalOptions);
    
    // #ifdef MP-WEIXIN
    // 微信小程序推荐使用 chooseMedia
    uni.chooseMedia({
      count: finalOptions.count,
      mediaType: ['image'],
      sourceType: finalOptions.sourceType,
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        console.log('选择媒体成功:', res);
        if (res.tempFiles && res.tempFiles.length > 0) {
          const path = res.tempFiles[0].tempFilePath;
          console.log('选择的图片路径:', path);
          resolve(path);
        } else {
          reject(new Error('未获取到文件路径'));
        }
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        reject(err);
      }
    });
    // #endif
    
    // #ifndef MP-WEIXIN
    // 其他平台使用 chooseImage
    uni.chooseImage({
      count: finalOptions.count,
      sizeType: finalOptions.sizeType,
      sourceType: finalOptions.sourceType,
      success: (res) => {
        console.log('选择图片成功:', res);
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          const path = res.tempFilePaths[0];
          console.log('选择的图片路径:', path);
          resolve(path);
        } else {
          reject(new Error('未获取到文件路径'));
        }
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        reject(err);
      }
    });
    // #endif
  });
}

/**
 * 完整的图片选择和处理流程
 * @param {Object} options 选择选项
 * @returns {Promise<string>} 可用的图片路径
 */
export async function selectAndValidateImage(options = {}) {
  try {
    console.log('=== 开始图片选择流程 ===');
    
    // 1. 选择图片
    const originalPath = await chooseImageWithBestPractice(options);
    console.log('原始路径:', originalPath);
    
    // 2. 验证并获取可用路径
    const validPath = await getValidImagePath(originalPath);
    console.log('有效路径:', validPath);
    
    console.log('=== 图片选择流程完成 ===');
    return validPath;
    
  } catch (error) {
    console.error('图片选择流程失败:', error);
    throw error;
  }
} 