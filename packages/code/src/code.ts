import { UIEvents } from '@huima/types'
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
   height: 785,
   width: 840,
})
