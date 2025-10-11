<template>
  <fui-background-image :src="backGroundImage" />
  <view class="dynamic-page-renderer" :style="pageLayoutStyle">
    <view 
      v-for="(componentConfig, index) in filteredComponents" 
      :key="componentConfig.id"
      class="dynamic-component"
      :style="getComponentStyle(componentConfig)"
    >
      <block v-if="componentConfig.component === 'Newhead'">
        <Newhead v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewSwiper'">
        <NewSwiper v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewIcon'">
        <NewIcon v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewWaterFall'">
        <NewWaterFall v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewStore'">
        <NewStore v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewClassWaterFall'">
        <NewClassWaterFall v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewPayWork'">
        <NewPayWork v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'UserMemberInfo'">
        <UserMemberInfo v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewCommunity'">
        <NewCommunity v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'NewLoginInfo'">
        <NewLoginInfo v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else-if="componentConfig.component === 'HorizontalAnnouncement'">
        <HorizontalAnnouncement v-bind="getComponentProps(componentConfig)" :page-type="pageType" />
      </block>
      <block v-else>
        <view class="component-placeholder">
          组件 {{ componentConfig.component }} 未找到
        </view>
      </block>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
import { 
  pageComponents, 
  dynamicComponentRules, 
  HeadProps, 
  iconData, 
  backGroundImage, 
  storeProps, 
  payWorkProps, 
  loginInfoIcons 
} from '@/cofigs/data/globalAppData'

// 导入所有可能使用的组件
import Newhead from '@/components/home/Newhead.vue'
import NewSwiper from '@/components/home/NewSwiper.vue'
import NewIcon from '@/components/home/NewIcon.vue'
import NewWaterFall from '@/components/home/NewWaterFall.vue'
import NewStore from '@/components/home/NewStore.vue'
import NewClassWaterFall from '@/components/home/NewClassWaterFall.vue'
import NewPayWork from '@/components/home/NewPayWork.vue'
import UserMemberInfo from '@/components/home/UserMemberInfo.vue'
import NewCommunity from '@/components/home/NewCommunity.vue'
import NewLoginInfo from '@/components/home/NewLoginInfo.vue'
import HorizontalAnnouncement from '@/components/home/HorizontalAnnouncement.vue'

// 定义类型
interface ComponentConfig {
  id: string
  component: string
  props: Record<string, any>
  style: Record<string, string>
}

interface PageConfig {
  title: string
  components: ComponentConfig[]
  layout: {
    padding: string
    backgroundColor: string
  }
}

interface DynamicRule {
  componentId: string
  conditions: {
    userStatus: 'all' | 'loggedIn' | 'notLoggedIn'
    organizations?: string[]
  }
}

// Props 定义
const props = defineProps<{
  pageType: string
}>()

// 状态管理
const appStore = useAppStore()
const { user } = storeToRefs(appStore)
const isLogin = computed(() => !!user.value && !!user.value._id)

// 页面布局样式
const pageLayoutStyle = computed(() => {
  const pageConfig = pageComponents[props.pageType as keyof typeof pageComponents] as PageConfig
  if (!pageConfig || !pageConfig.layout) return {}
  
  return {
    padding: pageConfig.layout.padding,
    backgroundColor: pageConfig.layout.backgroundColor,
    width: '100%',
    boxSizing: 'border-box' as const
  }
})

// 获取页面配置
const pageConfig = computed(() => {
  return pageComponents[props.pageType as keyof typeof pageComponents] as PageConfig || {
    title: '',
    components: [],
    layout: {
      padding: '20rpx',
      backgroundColor: '#f5f5f5'
    }
  }
})

// 动态规则
const pageRules = computed(() => {
  try {
    return dynamicComponentRules[props.pageType as keyof typeof dynamicComponentRules] as DynamicRule[] || []
  } catch (error) {
    console.warn('Error accessing dynamicComponentRules:', error)
    return []
  }
})

// 检查组件是否应该显示
const shouldShowComponent = (componentId: string) => {
  try {
    const rulesValue = pageRules.value || []
    const rule = rulesValue.find(r => r.componentId === componentId)
    if (!rule || !rule.conditions) return true // 如果没有规则或规则条件无效，默认显示
    
    const { userStatus, organizations } = rule.conditions
    
    // 检查用户状态前确保isLogin存在
    if (isLogin) {
      if (userStatus === 'loggedIn' && !isLogin.value) return false
      if (userStatus === 'notLoggedIn' && isLogin.value) return false
    }
    
    // 检查组织权限，增加多层防御性检查
    if (organizations && organizations.length > 0 && isLogin && isLogin.value && user && user.value?.organizations) {
      const userOrgs = user.value.organizations
      return organizations.some(org => userOrgs.includes(org))
    }
    
    return true
  } catch (error) {
    console.error('Error in shouldShowComponent:', error)
    return false
  }
}

// 过滤后的组件列表
const filteredComponents = computed(() => {
  try {
    const configValue = pageConfig.value || { components: [] }
    const components = Array.isArray(configValue.components) ? configValue.components : []
    return components.filter(comp => shouldShowComponent(comp.id))
  } catch (error) {
    console.error('Error in filteredComponents:', error)
    return []
  }
})

// 解析属性值，处理模板变量
const parsePropValue = (value: any): any => {
  if (typeof value !== 'string') return value
  
  // 处理模板变量 {{variable}}
  const templateRegex = /^{{(.+)}}$/
  const match = value.match(templateRegex)
  
  if (match) {
    const variablePath = match[1].trim()
    
    // 根据变量路径获取值
    switch (variablePath) {
      case 'HeadProps.logo':
        return HeadProps.logo
      case 'HeadProps.appName':
        return HeadProps.appName
      case 'HeadProps.title':
        return HeadProps.title
      case 'HeadProps.subtitle':
        return HeadProps.subtitle
      case 'HeadProps.image':
        return HeadProps.image
      case 'HeadProps.image2':
        return HeadProps.image2
      case 'HeadProps.primaryText':
        return HeadProps.primaryText
      case 'HeadProps.rightButtonText':
        return HeadProps.rightButtonText
      case 'HeadProps.rightTitle':
        return HeadProps.rightTitle
      case 'HeadProps.rightDesc':
        return HeadProps.rightDesc
      case 'HeadProps.badgeText':
        return HeadProps.badgeText
      case 'iconData':
        return iconData
     
      case 'storeProps.showTag':
        return storeProps.showTag
      case 'storeProps.showTags':
        return storeProps.showTags
      case 'storeProps.filterMode':
        return storeProps.filterMode
      case 'payWorkProps.title':
        return payWorkProps.title
      case 'payWorkProps.showTag':
        return payWorkProps.showTag
      case 'loginInfoIcons.scanIcon':
        return loginInfoIcons.scanIcon
      case 'loginInfoIcons.arrowIcon':
        return loginInfoIcons.arrowIcon
      case 'loginInfoIcons.historyIcon':
        return loginInfoIcons.historyIcon
      case 'loginInfoIcons.chatIcon':
        return loginInfoIcons.chatIcon
      case 'loginInfoIcons.logoutIcon':
        return loginInfoIcons.logoutIcon
      case 'loginInfoIcons.consoleIcon':
        return loginInfoIcons.consoleIcon
      case 'loginInfoIcons.bannerImage':
        return loginInfoIcons.bannerImage
      default:
        return value
    }
  }
  
  return value
}

// 获取组件属性
const getComponentProps = (componentConfig: ComponentConfig) => {
  const props: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(componentConfig.props)) {
    props[key] = parsePropValue(value)
  }
  
  return props
}

// 获取组件样式
const getComponentStyle = (componentConfig: ComponentConfig) => {
  return {
    ...componentConfig.style,
    width: '100%',
    boxSizing: 'border-box' as const
  }
}

// 监听页面类型变化
watch(() => props.pageType, () => {
  // 可以在这里添加页面切换时的逻辑
}, { immediate: true })
</script>

<style scoped>
.dynamic-page-renderer {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.dynamic-component {
  width: 100%;
  box-sizing: border-box;
}

.component-placeholder {
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  color: #999;
  font-size: 28rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
</style>