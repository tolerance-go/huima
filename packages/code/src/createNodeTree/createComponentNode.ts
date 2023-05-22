import { getBackgroundColorStyle } from '../css-converts/getBackgroundColorStyle'
import { getBackgroundImageStyle } from '../css-converts/getBackgroundImageStyle'
import { getBorderStyle } from '../css-converts/getBorderStyle'
import { getFlexLayoutStyle } from '../css-converts/getFlexLayoutStyle'
import { getOverflowStyle } from '../css-converts/getOverflowStyle'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createComponentNode = async (
   node: ComponentNode,
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
      ...getBackgroundColorStyle(node.fills),
      ...getOverflowStyle(node),
      ...getFlexLayoutStyle(node),
      ...getBorderStyle(node),
      ...bgStyle,
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      styleMeta,
   }
}
