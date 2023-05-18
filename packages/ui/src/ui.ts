import { createApp } from 'vue'
import {
   handleExportBtnClick,
   handleGenCode,
   handleShowCodeBtnClick,
   handleShowPlaygroundBtnClick,
} from './methods'
import { baseRendererNodeHtml, copiedNodeHtml } from './states/index'

import './styles.css'

import { UIAction } from '@huima/types'
import ClipboardJS from 'clipboard'
import { createHTML } from './createHTML'
import {
   baseCopiedNodeHtml,
   copyBtnText,
   selectedNodeId,
   selectedNodeName,
   showMode,
   shownNodeHtml,
} from './states'

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
            return `./assets/${node.nodeInfo.name}_${node.nodeInfo.id}.${backgroundImageMeta.backgroundImageExtension}`
         },
      })
      selectedNodeName.value = name
      selectedNodeId.value = id
      baseRendererNodeHtml.value = createHTML(nodeTree)
      showMode.value = 'playground'
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
