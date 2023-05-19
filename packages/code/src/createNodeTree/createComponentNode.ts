import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { generateBackgroundImageCSS } from '../css-converts/getBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/getBorderCSS'
import { generateFlexLayoutCSS } from '../css-converts/getFlexLayoutCSS'
import { generateOverflowCSS } from '../css-converts/getOverflowCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createComponentNode = async (
   node: ComponentNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   console.log('createComponentNode', node)

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
      tag,
      style,
      children,
      styleMeta,
   }
}
