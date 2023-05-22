import { CSSStyle, DomNodeTree, NodeInfo } from '../type'

export const createGroupNode = async (
   node: GroupNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<DomNodeTree[]>,
): Promise<DomNodeTree> => {
   const children = await getChildren()
   console.log('createGroupNode', node)

   let tag = 'div'
   let style = {
      width: node.width + 'px',
      height: node.height + 'px',
      ...baseStyle,
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
   }
}
