import { computed, reactive } from 'vue'
import { isJsDesign } from '../env'

export const i18n = reactive({
   'zh-CN': {
      generate: '生成',
      pleaseSelect: '“请选择场景元素后，点击生成按钮”',
      exportBtnText: '导出',
      enableCssToTailwindCss: '启用 CSS 转 Tailwindcss',
      basicFontSize: '基础字号大小',
      designDraftViewportWidth: '设计稿视口宽度',
      targetFormat: '目标格式',
      enablePxUnitConversion: '启用 px 单位转换',
      exportLabel: '导出',
      viewportHeightLabel: '视口高度（不包括头部）',
      viewportWidthLabel: '视口宽度',
      basicsLabel: '基础',
      configureLabel: '设置',
      copyBtnText: '复制',
      notSelectedNodeLabel: '未选择',
      unknownIdLabel: '未知',
   },
   'en-US': {
      generate: 'Generate',
      pleaseSelect:
         '"Please select the scene elements first, then click the Generate button"',
      exportBtnText: 'Export',
      enableCssToTailwindCss: 'Enable CSS to Tailwindcss conversion',
      basicFontSize: 'Basic font size',
      designDraftViewportWidth: 'Design draft viewport width',
      targetFormat: 'Target format',
      enablePxUnitConversion: 'Enable px unit conversion',
      exportLabel: 'Export',
      viewportHeightLabel: 'Viewport height (excluding header)',
      viewportWidthLabel: 'Viewport width',
      basicsLabel: 'Basics',
      configureLabel: 'Settings',
      copyBtnText: 'Copy',
      notSelectedNodeLabel: 'Not selected',
      unknownIdLabel: 'Unknown',
   },
})

export const usedI18n = computed(() => {
   if (isJsDesign) {
      return i18n['zh-CN']
   }
   return i18n['en-US']
})
