import { StaticNode, StaticTextNode } from '@huima/types-next'

export const createStaticTextNode = (
   node: TextNode,
   getChildren: () => StaticNode[],
): StaticTextNode => {
   return {
      id: node.id,
      type: 'text',
      characters: node.characters,
      children: [],
   }
}

export const createStaticNode = (node: SceneNode): StaticNode | null => {
   if (node.type === 'TEXT') {
      return createStaticTextNode(
         node,
         () => [],
         //  node.children.map(createStaticNode)
      )
   }

   return null
}
