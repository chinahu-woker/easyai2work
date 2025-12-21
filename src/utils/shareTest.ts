// 分享功能测试文件
import { setShareData, getShareData, clearShareData, generateDetailShareData } from './shareManager'

// 测试分享数据管理
export function testShareManager() {
    console.log('=== 分享管理器测试开始 ===')
    
    // 测试详情页分享数据生成
    const testItemId = 'test-item-123'
    const testTitle = '测试美甲设计'
    const testImageUrl = 'https://example.com/test-image.jpg'
    
    const shareData = generateDetailShareData(testItemId, testTitle, testImageUrl)
    console.log('生成的分享数据:', shareData)
    
    // 测试设置分享数据
    setShareData(shareData)
    console.log('已设置分享数据')
    
    // 测试获取分享数据
    const retrievedData = getShareData()
    console.log('获取的分享数据:', retrievedData)
    
    // 验证数据一致性
    if (retrievedData && 
        retrievedData.title === shareData.title &&
        retrievedData.path === shareData.path &&
        retrievedData.imageUrl === shareData.imageUrl) {
        console.log('✅ 数据一致性测试通过')
    } else {
        console.log('❌ 数据一致性测试失败')
    }
    
    // 测试清除分享数据
    clearShareData()
    const clearedData = getShareData()
    
    if (clearedData === null) {
        console.log('✅ 数据清除测试通过')
    } else {
        console.log('❌ 数据清除测试失败')
    }
    
    console.log('=== 分享管理器测试结束 ===')
}

// 模拟分享流程测试
export function testShareFlow() {
    console.log('=== 分享流程测试开始 ===')
    
    // 模拟用户点击分享按钮
    const mockItemData = {
        id: 'item-456',
        title: '精美渐变美甲',
        description: '这是一个很棒的渐变美甲设计',
        images: ['https://example.com/nail-design.jpg']
    }
    
    console.log('模拟用户点击分享按钮，数据:', mockItemData)
    
    // 生成分享数据
    const shareData = generateDetailShareData(
        mockItemData.id,
        mockItemData.title,
        mockItemData.images[0]
    )
    
    // 设置分享数据
    setShareData(shareData)
    console.log('已设置分享数据，等待微信分享触发')
    
    // 模拟微信分享触发时的数据获取
    const dataForWechat = getShareData()
    console.log('微信分享获取的数据:', dataForWechat)
    
    // 模拟分享完成后清除数据
    clearShareData()
    console.log('分享完成，已清除临时数据')
    
    console.log('=== 分享流程测试结束 ===')
}