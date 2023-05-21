import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { getBackgroundImageCSS } from '../css-converts/getBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/getBorderCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createEllipseNode = async (
   node: EllipseNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<NodeTree[]>,
): Promise<NodeTree> => {
   const children = await getChildren()
   const { style: bgImgStyle, styleMeta } = await getBackgroundImageCSS(
      node.fills,
   )

   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...getBackgroundColorCSS(node.fills),
      ...generateBorderCSS(node),
      ...bgImgStyle,
      'border-radius': '100%',
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      styleMeta,
   }
}
