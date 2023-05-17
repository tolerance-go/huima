import { generateBackgroundImageCSS } from '../css-converts/generateBackgroundImageCSS'
import { generateBorderCSS } from '../css-converts/generateBorderCSS'
import { generateFlexLayoutCSS } from '../css-converts/generateFlexLayoutCSS'
import { generateOverflowCSS } from '../css-converts/generateOverflowCSS'
import { getBackgroundColorCSS } from '../css-converts/getBackgroundColorCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

export const createInstanceNode = async (
   node: InstanceNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   console.log('createInstanceNode', node)

   let tag = 'div'
   let style = {
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
      ...getBackgroundColorCSS(node.fills),
      ...generateOverflowCSS(node),
      ...generateFlexLayoutCSS(node),
      ...generateBorderCSS(node),
      ...(await generateBackgroundImageCSS(node.fills)),
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
   }
}
