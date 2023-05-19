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
import { handleFormChange } from './methods/index'
import {
   baseRendererNodeHtml,
   copiedNodeHtml,
   currentMode,
   formSettings,
   nodeMaps,
   rendererNodeHtml,
   selectedNodeTree,
} from './states'

import './styles.css'

import { UIAction } from '@huima/types'
import ClipboardJS from 'clipboard'
import { whenSelectedNodeChangedAndChangeBaseCopiedNodeHtml } from './effects'
import {
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
      whenSelectedNodeChangedAndChangeBaseCopiedNodeHtml()

      return {
         selectedNodeTree,
         selectedNodeName,
         selectedNodeId,
         baseRendererNodeHtml,
         copyBtnText,
         rendererNodeHtml,
         showMode,
         shownNodeHtml,
         hoverCodeArea,
         settings,
         defaultSettings,
         currentMode,
         formSettings,
         handleFormChange,
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

      selectedNodeTree.value = nodeTree
      selectedNodeName.value = name
      selectedNodeId.value = id
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
      showMode.value = 'empty'
      return
   }
}
