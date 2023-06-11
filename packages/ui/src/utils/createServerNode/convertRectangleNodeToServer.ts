import {
   BaseUploadSettings,
   ServerRectangleNode,
   StaticContainerNode,
   StaticRectangleNode,
} from '@huima/common/dist/types'
import { ServerNodeConvertHooks } from './types'

export const convertRectangleNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticRectangleNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerRectangleNode => {
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
      }
   }

   return {
      ...node,
      serverNode: true,
   }
}
