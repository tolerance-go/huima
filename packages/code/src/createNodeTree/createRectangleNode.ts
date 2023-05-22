import { getBackgroundColorStyle } from '../css-converts/getBackgroundColorStyle'
import { getBackgroundImageStyle } from '../css-converts/getBackgroundImageStyle'
import { getBorderStyle } from '../css-converts/getBorderStyle'
import { getBoxShadowStyle } from '../css-converts/getBoxShadowStyle'
import { getRotationStyle } from '../css-converts/getRotationStyle'
import { CSSStyle, DomNodeTree, NodeInfo } from '../type'

export const createRectangleNode = async (
   node: RectangleNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<DomNodeTree[]>,
): Promise<DomNodeTree> => {
   const children = await getChildren()
   const { style: bgStyle, styleMeta } = await getBackgroundImageStyle(
      node.fills,
   )
   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...getBoxShadowStyle(node.effects),
      ...getRotationStyle(node),
      ...getBorderStyle(node),
      ...getBackgroundColorStyle(node.fills),
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
