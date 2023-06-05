import { UIAction } from '@huima/common'
import ClipboardJS from 'clipboard'
import {
   copiedCode,
   formSettings,
   highCopyBtnText,
   notSupport,
   selectedNode,
   usedI18n,
} from './states/app'

const clipboard = new ClipboardJS('#copyBtn', {
   text: () => {
      return copiedCode.value
   },
})

clipboard.on('success', function (e) {
   console.log('Text copied to clipboard')
   e.clearSelection()
   highCopyBtnText.value = usedI18n.value.copySuccessBtnText

   setTimeout(() => {
      highCopyBtnText.value = null
   }, 1500)
})

clipboard.on('error', function (e) {
   console.error('Failed to copy text')
})

window.onmessage = (event) => {
   console.log('ui: get message from code.js', event)
   if (process.env.WEBPACK_SERVE) {
      return
   }

   if (!event.data.pluginMessage) return

   if (event.data.pluginMessage.type === 'initSettings') {
      const {
         payload: { settings: _settings },
      } = event.data.pluginMessage as UIAction<'initSettings'>

      Object.assign(formSettings, _settings)

      return
   }

   if (event.data.pluginMessage.type === 'selectedNode') {
      const {
         payload: { staticNode },
      } = event.data.pluginMessage as UIAction<'selectedNode'>

      if (staticNode === null) {
         notSupport.value = true
         return
      }

      notSupport.value = false
      selectedNode.value = staticNode

      return
   }
}
