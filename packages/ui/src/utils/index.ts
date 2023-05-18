import { NodeTree } from '@huima/types'

export function flattenNodes(
   node: NodeTree,
   map: Record<string, NodeTree> = {},
): Record<string, NodeTree> {
   if (map[node.nodeInfo.id]) {
      throw new Error(`Duplicate id found: ${node.nodeInfo.id}`)
   }

   map[node.nodeInfo.id] = node

   if (node.children) {
      node.children.forEach((child) => flattenNodes(child, map))
   }

   return map
}
