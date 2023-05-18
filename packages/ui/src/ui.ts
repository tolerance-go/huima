import { createApp, ref } from 'vue'
import './styles.css'

import { UIAction } from '@huima/types'
import ClipboardJS from 'clipboard'
import { createHTML } from './createHTML'

const selectedNodeName = ref('未选择')
const selectedNodeId = ref('未知')
const nodeHtml = ref('')
const copyBtnText = ref('复制')
const showMode = ref<'code' | 'playground' | 'empty'>('empty')

const clipboard = new ClipboardJS('#copyBtn', {
   text: function () {
      return nodeHtml.value
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

const handleGenCode = () => {
   console.log('handleGenCode')

   parent.postMessage(
      {
         pluginMessage: {
            type: 'genCode',
         },
      },
      '*',
   )
}

const handleShowCodeBtnClick = () => {
   showMode.value = 'code'
}

const handleShowPlaygroundBtnClick = () => {
   showMode.value = 'playground'
}

createApp({
   setup() {
      return {
         selectedNodeName,
         selectedNodeId,
         nodeHtml,
         handleGenCode,
         handleShowCodeBtnClick,
         handleShowPlaygroundBtnClick,
         copyBtnText,
         showMode,
      }
   },
}).mount('#app')

onmessage = (event) => {
   if (process.env.WEBPACK_SERVE) {
      return
   }

   if (event.data.pluginMessage.type === 'startGen') {
      const {
         payload: { name, id, nodeTree },
      } = event.data.pluginMessage as UIAction<'startGen'>
      const html = createHTML(nodeTree)
      selectedNodeName.value = name
      selectedNodeId.value = id
      nodeHtml.value = html
      showMode.value = 'playground'
      return
   }

   if (event.data.pluginMessage.type === 'selectionchange') {
      const {
         payload: { name, id },
      } = event.data.pluginMessage as UIAction<'selectionchange'>
      selectedNodeName.value = name
      selectedNodeId.value = id
      nodeHtml.value = ''
      showMode.value = 'empty'
      return
   }
}
