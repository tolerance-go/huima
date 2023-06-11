import {
   BaseUploadSettings,
   ServerLineNode,
   StaticContainerNode,
   StaticLineNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertLineNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticLineNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerLineNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
   }
}
