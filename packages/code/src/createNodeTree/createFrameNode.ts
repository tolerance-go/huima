import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { getBackgroundImageCSS } from '../css-converts/getBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/getBorderCSS'
import { generateFlexLayoutCSS } from '../css-converts/getFlexLayoutCSS'
import { generateOverflowCSS } from '../css-converts/getOverflowCSS'
import { getRotationCSS } from '../css-converts/getRotationCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createFrameNode = async (
   node: FrameNode,
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
      ...getBackgroundColorCSS(node.fills),
      ...generateOverflowCSS(node),
      ...generateFlexLayoutCSS(node),
      ...generateBorderCSS(node),
      ...bgStyle,
   }

   return {
      nodeInfo,
      styleMeta,
      tag,
      style,
      children,
   }
}
