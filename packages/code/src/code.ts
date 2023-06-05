import { CodeAction, Settings, UIEvents } from '@huima/types'
import {
   DEFAULT_UI_FOOTER_HEIGHT,
   DEFAULT_UI_HEADER_HEIGHT,
   DEFAULT_VIEWPORT_HEIGHT,
   DEFAULT_VIEWPORT_WIDTH,
} from '@huima/utils'
import { createStaticNode } from './createStaticNode'
import { pluginApi } from './pluginApi'

declare global {
   const jsDesign: typeof figma
}

;(async () => {
   const postActionToUI = <T extends keyof UIEvents>(
      type: T,
      payload: UIEvents[T],
   ) => {
      pluginApi.ui.postMessage({
         type,
         payload,
      })
   }

   const settingsKey = '_settings'

   pluginApi.ui.onmessage = async (message) => {
      console.log('get action from ui', message)
      if (message.type === 'resize') {
         const { payload } = message as CodeAction<'resize'>
         pluginApi.ui.resize(
            payload.width,
            payload.height +
               DEFAULT_UI_HEADER_HEIGHT +
               DEFAULT_UI_FOOTER_HEIGHT,
         )
         return
      }

      if (message.type === 'updateSettings') {
         const { payload } = message as CodeAction<'updateSettings'>
         pluginApi.clientStorage.setAsync(settingsKey, payload)
         return
      }
   }

   pluginApi.on('selectionchange', async () => {
      if (pluginApi.currentPage.selection.length) {
         const [node] = pluginApi.currentPage.selection

         console.log('selectionchange', node)

         postActionToUI('selectedNode', {
            staticNode: await createStaticNode(node),
         })
      }
   })

   const settings = (await pluginApi.clientStorage.getAsync(settingsKey)) as
      | Settings
      | undefined

   /**
    * settings 是 ui 中处理后的，所以类似 viewportSize.height 一定会存在值
    * 所以这里就不做 max 的判断
    * width: Math.max(
         settings?.viewportSize.width || DEFAULT_VIEWPORT_WIDTH,
         MIN_VIEWPORT_LENGTH,
      ),
    */
   pluginApi.showUI(__html__, {
      themeColors: false,
      height:
         (settings?.viewportSize.height || DEFAULT_VIEWPORT_HEIGHT) +
         DEFAULT_UI_HEADER_HEIGHT +
         DEFAULT_UI_FOOTER_HEIGHT,
      width: settings?.viewportSize.width || DEFAULT_VIEWPORT_WIDTH,
   })

   if (settings) {
      postActionToUI('initSettings', {
         settings,
      })
   }

   if (pluginApi.currentPage.selection.length) {
      postActionToUI('selectedNode', {
         staticNode: await createStaticNode(pluginApi.currentPage.selection[0]),
      })
   }
})()
