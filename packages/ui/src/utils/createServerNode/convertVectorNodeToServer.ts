import {
   BaseUploadSettings,
   ServerVectorNode,
   StaticContainerNode,
   StaticVectorNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertVectorNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticVectorNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerVectorNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
   }
}
