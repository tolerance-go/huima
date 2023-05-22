import { getBackgroundColorStyle } from '../css-converts/getBackgroundColorStyle'
import { getBackgroundImageStyle } from '../css-converts/getBackgroundImageStyle'
import { getBorderStyle } from '../css-converts/getBorderStyle'
import { getBoxShadowStyle } from '../css-converts/getBoxShadowStyle'
import { getRotationStyle } from '../css-converts/getRotationStyle'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createRectangleNode = async (
   node: RectangleNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<NodeTree[]>,
): Promise<NodeTree> => {
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
