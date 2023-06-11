import {
   BaseUploadSettings,
   ServerGroupNode,
   StaticContainerNode,
   StaticGroupNode,
} from '@huima/common/dist/types'
import { StaticNode } from '@huima/render-static-node'
import { createServerNode } from './createServerNode'
import { ServerNodeConvertHooks } from './types'

export const convertGroupNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticGroupNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerGroupNode => ({
   ...node,
   serverNode: true,
   svgStr: node.svgBytes && Buffer.from(node.svgBytes).toString(),
   children: node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   ),
})
