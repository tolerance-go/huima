import { getBackgroundColorStyle } from '../css-converts/getBackgroundColorStyle'
import { getBackgroundImageStyle } from '../css-converts/getBackgroundImageStyle'
import { getBorderStyle } from '../css-converts/getBorderStyle'
import { CSSStyle, DomNodeTree, NodeInfo } from '../type'

export const createEllipseNode = async (
   node: EllipseNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<DomNodeTree[]>,
): Promise<DomNodeTree> => {
   const children = await getChildren()
   const { style: bgImgStyle, styleMeta } = await getBackgroundImageStyle(
      node.fills,
   )

   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...getBackgroundColorStyle(node.fills),
      ...getBorderStyle(node),
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
