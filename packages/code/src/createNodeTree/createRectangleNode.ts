import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { generateBackgroundImageCSS } from '../css-converts/getBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/getBorderCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createRectangleNode = async (
   node: RectangleNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   console.log('createRectangleNode', node)

   const { style: bgStyle, styleMeta } = await generateBackgroundImageCSS(
      node.fills,
   )
   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...generateBorderCSS(node),
      ...getBackgroundColorCSS(node.fills),
      ...bgStyle,
   }

   return {
      styleMeta,
      nodeInfo,
      tag,
      style,
      children,
   }
}
