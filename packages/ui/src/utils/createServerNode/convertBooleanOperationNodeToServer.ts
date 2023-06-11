import {
   BaseUploadSettings,
   ServerBooleanOperationNode,
   StaticBooleanOperationNode,
   StaticContainerNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertBooleanOperationNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticBooleanOperationNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerBooleanOperationNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
   }
}
