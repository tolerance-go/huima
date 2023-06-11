import {
   BaseUploadSettings,
   ServerPolygonNode,
   StaticContainerNode,
   StaticPolygonNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { ServerNodeConvertHooks } from './types'

export const convertPolygonNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticPolygonNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerPolygonNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
      svgBytes: new Uint8Array(0),
   }
}
