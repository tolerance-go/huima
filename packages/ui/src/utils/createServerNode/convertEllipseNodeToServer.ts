import {
   BaseUploadSettings,
   ServerEllipseNode,
   StaticContainerNode,
   StaticEllipseNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertEllipseNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticEllipseNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerEllipseNode => {
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
         svgStr: node.svgBytes && Buffer.from(node.svgBytes).toString(),
         svgBytes: new Uint8Array(0),
         serverNode: true,
      }
   }

   return {
      ...node,
      svgStr: node.svgBytes && Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
      serverNode: true,
   }
}
