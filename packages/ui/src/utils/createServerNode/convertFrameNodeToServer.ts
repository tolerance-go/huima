import {
   BaseUploadSettings,
   ServerFrameNode,
   StaticContainerNode,
   StaticFrameNode,
} from '@huima/common/dist/types'
import { StaticNode } from '@huima/render-static-node'
import { createServerNode } from './createServerNode'
import { ServerNodeConvertHooks } from './types'

export const convertFrameNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticFrameNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerFrameNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )

   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         imageFillSrc: src,
         serverNode: true,
         children,
      }
   }

   return {
      ...node,
      serverNode: true,
      children,
   }
}
