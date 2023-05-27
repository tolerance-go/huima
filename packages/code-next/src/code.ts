import { UIEvents } from '@huima/types-next'
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

//====================== UI 事件处理 * 开始 ======================
pluginApi.ui.onmessage = async (message) => {
   if (message.type === 'resize') {
      pluginApi.ui.resize(message.payload.width, message.payload.height)
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
//====================== UI 事件处理 * 结束 ======================

pluginApi.showUI(__html__, {
   height: VIEWPORT_HEIGHT + DEFAULT_UI_HEADER_HEIGHT,
   width: VIEWPORT_WIDTH,
})
