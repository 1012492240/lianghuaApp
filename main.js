import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import './index.scss'

import uviewPlus, { setConfig } from 'uview-plus'
import StatusBar from '@/components/status-bar/status-bar.vue'
import PageHeader from '@/components/page-header/page-header.vue'

export function createApp() {
  const app = createSSRApp(App)

  const pinia = createPinia()
  app.use(pinia)
  setConfig({
    // 修改$u.config对象的属性
    config: {
      // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
      // 组件的很多单位仍然为px并非配置不生效，而是rpx配置目前无法做到修改Vue单文件组件中的Css/Sass中写死的px单位。
      // 这个配置主要用于prop传参时的单位修改，比如<up-image width="80"></up-image>中的80会是rpx单位。
      // 如果需要全局组件样式变为rpx，可以尝试使用postcss等第三方插件转换。
      unit: 'px'
    },
    // 修改$u.props对象的属性
    props: {
      // 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
      radio: {
        // size: 20 
      }
      // 其他组件属性配置
      // ......
    }
  })

  app.use(uviewPlus)
  app.component('status-bar', StatusBar)
  app.component('page-header', PageHeader)
  return {
    app
  }
}