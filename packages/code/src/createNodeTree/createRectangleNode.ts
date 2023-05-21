import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { getBackgroundImageCSS } from '../css-converts/getBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/getBorderCSS'
import { getRotationCSS } from '../css-converts/getRotationCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createRectangleNode = async (
   node: RectangleNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   const { style: bgStyle, styleMeta } = await getBackgroundImageCSS(node.fills)
   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...getRotationCSS(node),

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
