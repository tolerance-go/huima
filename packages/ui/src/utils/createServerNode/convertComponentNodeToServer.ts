import {
   BaseUploadSettings,
   ServerComponentNode,
   StaticComponentNode,
   StaticContainerNode,
} from '@huima/common/dist/types'
import { StaticNode } from '@huima/render-static-node'
import { createServerNode } from './createServerNode'
import { ServerNodeConvertHooks } from './types'

export const convertComponentNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticComponentNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerComponentNode => {
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
         imageFillSrc: src,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
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
