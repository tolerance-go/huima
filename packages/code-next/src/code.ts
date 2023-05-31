import { CodeAction, Settings, UIEvents } from '@huima/types-next'
import {
   DEFAULT_UI_HEADER_HEIGHT,
   VIEWPORT_HEIGHT,
   VIEWPORT_WIDTH,
} from '@huima/utils'
import { createStaticNode } from './createStaticNode'
import { pluginApi } from './pluginApi'

declare global {
   const jsDesign: typeof figma
}

//====================== 工具函数 * 开始 ======================
const postActionToUI = <T extends keyof UIEvents>(
   type: T,
   payload: UIEvents[T],
) => {
   pluginApi.ui.postMessage({
      type,
      payload,
   })
}
//====================== 工具函数 * 结束 ======================

const settingsKey = '_settings'

//====================== UI 事件处理 * 开始 ======================
pluginApi.ui.onmessage = async (message) => {
   console.log('get action from ui', message)
   if (message.type === 'resize') {
      const { payload } = message as CodeAction<'resize'>
      pluginApi.ui.resize(payload.width, payload.height)
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

pluginApi.on('run', async () => {
   const settings = (await pluginApi.clientStorage.getAsync(
      settingsKey,
   )) as Settings
   console.log('run settings', settings)
   if (settings) {
      postActionToUI('initSettings', {
         settings,
      })
   }
})

//====================== UI 事件处理 * 结束 ======================

pluginApi.showUI(__html__, {
   height: VIEWPORT_HEIGHT + DEFAULT_UI_HEADER_HEIGHT,
   width: VIEWPORT_WIDTH,
})
