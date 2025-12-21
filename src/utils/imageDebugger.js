/**
 * 图片调试工具
 */

/**
 * 调试图片路径
 * @param {string} path 图片路径
 * @returns {Promise<Object>} 调试信息
 */
export function debugImagePath(path) {
  return new Promise((resolve) => {
    console.log('=== 图片路径调试开始 ===');
    console.log('原始路径:', path);
    
    const debugInfo = {
      originalPath: path,
      pathType: getPathType(path),
      platform: getCurrentPlatform(),
      timestamp: Date.now()
    };
    
    // 尝试获取图片信息
    uni.getImageInfo({
      src: path,
      success: (res) => {
        console.log('✅ 图片信息获取成功:', res);
        debugInfo.success = true;
        debugInfo.imageInfo = res;
        resolve(debugInfo);
      },
      fail: (err) => {
        console.log('❌ 图片信息获取失败:', err);
        debugInfo.success = false;
        debugInfo.error = err;
        
        // 尝试其他路径格式
        debugInfo.alternativePaths = getAlternativePaths(path);
        resolve(debugInfo);
      }
    });
  });
}

/**
 * 获取路径类型
 * @param {string} path 路径
 * @returns {string} 路径类型
 */
function getPathType(path) {
  if (!path) return 'empty';
  
  if (path.startsWith('http://tmp/') || path.startsWith('https://tmp/')) {
    return 'temp-http';
  }
  if (path.startsWith('wxfile://tmp/')) {
    return 'temp-wxfile';
  }
  if (path.startsWith('file://tmp/')) {
    return 'temp-file';
  }
  if (path.startsWith('tmp/')) {
    return 'temp-relative';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return 'remote';
  }
  if (path.startsWith('file://')) {
    return 'local-file';
  }
  
  return 'unknown';
}

/**
 * 获取当前平台
 * @returns {string} 平台标识
 */
function getCurrentPlatform() {
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
 * 获取替代路径
 * @param {string} originalPath 原始路径
 * @returns {string[]} 替代路径数组
 */
function getAlternativePaths(originalPath) {
  if (!originalPath) return [];
  
  const fileName = originalPath.split('/').pop();
  const alternatives = [];
  
  // 如果是临时文件路径，尝试不同的格式
  if (originalPath.includes('/tmp/')) {
    alternatives.push(`wxfile://tmp/${fileName}`);
    alternatives.push(`file://tmp/${fileName}`);
    alternatives.push(`tmp/${fileName}`);
  }
  
  return alternatives;
}

/**
 * 测试所有可能的路径
 * @param {string} originalPath 原始路径
 * @returns {Promise<Object>} 测试结果
 */
export function testAllPaths(originalPath) {
  return new Promise((resolve) => {
    const allPaths = [originalPath, ...getAlternativePaths(originalPath)];
    const results = [];
    
    console.log('=== 测试所有可能的路径 ===');
    console.log('路径列表:', allPaths);
    
    let completed = 0;
    
    allPaths.forEach((path, index) => {
      uni.getImageInfo({
        src: path,
        success: (res) => {
          console.log(`✅ 路径 ${index + 1} 成功:`, path, res);
          results.push({
            path,
            success: true,
            info: res,
            index
          });
          completed++;
          checkComplete();
        },
        fail: (err) => {
          console.log(`❌ 路径 ${index + 1} 失败:`, path, err);
          results.push({
            path,
            success: false,
            error: err,
            index
          });
          completed++;
          checkComplete();
        }
      });
    });
    
    function checkComplete() {
      if (completed === allPaths.length) {
        const workingPaths = results.filter(r => r.success);
        console.log('=== 测试完成 ===');
        console.log('可用的路径:', workingPaths.map(r => r.path));
        resolve({
          allResults: results,
          workingPaths: workingPaths,
          bestPath: workingPaths.length > 0 ? workingPaths[0].path : null
        });
      }
    }
  });
}

/**
 * 创建详细的调试报告
 * @param {string} path 图片路径
 * @returns {Promise<Object>} 调试报告
 */
export async function createDebugReport(path) {
  const debugInfo = await debugImagePath(path);
  const pathTest = await testAllPaths(path);
  
  const report = {
    timestamp: new Date().toISOString(),
    originalPath: path,
    debugInfo,
    pathTest,
    summary: {
      hasWorkingPath: pathTest.workingPaths.length > 0,
      bestPath: pathTest.bestPath,
      totalPathsTested: pathTest.allResults.length,
      workingPathsCount: pathTest.workingPaths.length
    }
  };
  
  console.log('=== 调试报告 ===');
  console.log(JSON.stringify(report, null, 2));
  
  return report;
} 