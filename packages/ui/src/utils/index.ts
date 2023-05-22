import { DomNodeTree } from '@huima/types'

export function flattenNodes(
   node: DomNodeTree,
   map: Record<string, DomNodeTree> = {},
): Record<string, DomNodeTree> {
   if (map[node.nodeInfo.id]) {
      throw new Error(`Duplicate id found: ${node.nodeInfo.id}`)
   }

   map[node.nodeInfo.id] = node

   if (node.children) {
      node.children.forEach((child) => flattenNodes(child, map))
   }

   return map
}
