import {
   BaseUploadSettings,
   ServerStarNode,
   StaticContainerNode,
   StaticStarNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertStarNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticStarNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerStarNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
   }
}
