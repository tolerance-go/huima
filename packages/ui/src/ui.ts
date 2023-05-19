import { createApp } from 'vue'
import {
   handleBackFromSettingsBtnClick,
   handleExportBtnClick,
   handleGenCode,
   handleSettingsBtnClick,
   handleShowCodeBtnClick,
   handleShowPlaygroundBtnClick,
   handleViewportSizeChange,
} from './methods'
import {
   baseRendererNodeHtml,
   copiedNodeHtml,
   currentMode,
   nodeMaps,
} from './states'

import './styles.css'

import { UIAction } from '@huima/types'
import ClipboardJS from 'clipboard'
import { createHTML } from './createHTML'
import {
   baseCopiedNodeHtml,
   copyBtnText,
   defaultSettings,
   hoverCodeArea,
   selectedNodeId,
   selectedNodeName,
   settings,
   showMode,
   shownNodeHtml,
} from './states'
import { flattenNodes } from './utils'

const clipboard = new ClipboardJS('#copyBtn', {
   text: () => {
      return copiedNodeHtml.value
   },
})

clipboard.on('success', function (e) {
   console.log('Text copied to clipboard')
   e.clearSelection()
   copyBtnText.value = '复制成功!'

   setTimeout(() => {
      copyBtnText.value = '复制'
   }, 1500)
})

clipboard.on('error', function (e) {
   console.error('Failed to copy text')
})

createApp({
   setup() {
      return {
         selectedNodeName,
         selectedNodeId,
         baseRendererNodeHtml,
         copyBtnText,
         showMode,
         shownNodeHtml,
         hoverCodeArea,
         settings,
         defaultSettings,
         currentMode,
         handleViewportSizeChange,
         handleBackFromSettingsBtnClick,
         handleSettingsBtnClick,
         handleGenCode,
         handleShowCodeBtnClick,
         handleShowPlaygroundBtnClick,
         handleExportBtnClick,
      }
   },
}).mount('#app')

window.onmessage = (event) => {
   if (process.env.WEBPACK_SERVE) {
      return
   }

   // TODO: 弄清楚为什么会有这个判断
   if (!event.data.pluginMessage) return

   if (event.data.pluginMessage.type === 'startGen') {
      const {
         payload: { name, id, nodeTree },
      } = event.data.pluginMessage as UIAction<'startGen'>
      baseCopiedNodeHtml.value = createHTML(nodeTree, {
         getBgImgUrl(backgroundImageMeta, node) {
            return `assets/${node.nodeInfo.name}_${
               // 文件名称不能有冒号
               node.nodeInfo.id.replace(':', '-')
            }.${backgroundImageMeta.backgroundImageExtension}`
         },
         convertPxValue: settings.enablePxConvert
            ? (value: number) => {
                 if (settings.pxConvertConfigs.pxConvertFormat === 'rem') {
                    // 这里的算法是把像素转换为 rem
                    // 在大多数浏览器中，1 rem 的默认值是 16 px
                    // 所以我们用 px 值除以 baseSize
                    let remValue =
                       value / settings.pxConvertConfigs.pxConvertBaseFontSize
                    return `${remValue}rem`
                 } else if (
                    settings.pxConvertConfigs.pxConvertFormat === 'vw'
                 ) {
                    // 这里的算法是把像素转换为 vw
                    // 在假设的视口宽度为1000px中，1vw等于10px
                    // 所以我们用 px 值除以 (viewportWidth / 100)
                    let vwValue =
                       value / (settings.pxConvertConfigs.viewportWidth / 100)
                    return `${vwValue}vw`
                 }
                 return `${value}px`
              }
            : undefined,
      })
      selectedNodeName.value = name
      selectedNodeId.value = id
      baseRendererNodeHtml.value = createHTML(nodeTree)
      showMode.value = 'playground'

      nodeMaps.value = flattenNodes(nodeTree)
      return
   }

   if (event.data.pluginMessage.type === 'selectionchange') {
      const {
         payload: { name, id },
      } = event.data.pluginMessage as UIAction<'selectionchange'>
      selectedNodeName.value = name
      selectedNodeId.value = id
      baseRendererNodeHtml.value = ''
      showMode.value = 'empty'
      return
   }
}
