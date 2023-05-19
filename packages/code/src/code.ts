import { UIEvents } from '@huima/types'
import {
   DEFAULT_UI_HEADER_HEIGHT,
   VIEWPORT_HEIGHT,
   VIEWPORT_WIDTH,
} from '@huima/utils'
import { createNodeTree } from './createNodeTree'
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
   if (message.type === 'genCode') {
      if (pluginApi.currentPage.selection.length === 1) {
         const [node] = pluginApi.currentPage.selection

         const nodeTree = await createNodeTree(node)

         postActionToUI('startGen', {
            name: node.name,
            id: node.id,
            nodeTree,
         })
      }
   }

   if (message.type === 'resize') {
      pluginApi.ui.resize(message.payload.width, message.payload.height)
   }
}

pluginApi.on('selectionchange', () => {
   if (pluginApi.currentPage.selection.length === 1) {
      const [node] = pluginApi.currentPage.selection

      postActionToUI('selectionchange', {
         name: node.name,
         id: node.id,
      })
   }
})

//====================== UI 事件处理 * 结束 ======================

pluginApi.showUI(__html__, {
   height: VIEWPORT_HEIGHT + DEFAULT_UI_HEADER_HEIGHT,
   width: VIEWPORT_WIDTH,
})
