import { generateBackgroundImageCSS } from '../css-converts/generateBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/generateBorderCSS'
import { generateFlexLayoutCSS } from '../css-converts/generateFlexLayoutCSS'
import { generateOverflowCSS } from '../css-converts/generateOverflowCSS'
import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createFrameNode = async (
   node: FrameNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   console.log('createFrameNode', node)
   const { style: bgStyle, styleMeta } = await generateBackgroundImageCSS(
      node.fills,
   )

   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
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
