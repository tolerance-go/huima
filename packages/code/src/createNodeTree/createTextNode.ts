import { CSSStyle, NodeInfo, NodeTree } from '../type'
import { getFillSolidColor } from '../utils/getFillSolidColor'

export const createTextNode = async (
   node: TextNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   console.log('createTextNode', node)

   let lineHeightStyle
   const lineHeight = node.lineHeight as LineHeight
   if (lineHeight.unit === 'PIXELS') {
      lineHeightStyle = String(lineHeight.value) + 'px'
   } else if (lineHeight.unit === 'PERCENT') {
      lineHeightStyle = String(lineHeight.value / 100)
   } else if (lineHeight.unit === 'AUTO') {
      lineHeightStyle = 'normal'
   }

   let tag = 'span'
   let textContent = node.characters
   let style = {
      ...baseStyle,
      'font-size': String(node.fontSize) + 'px',
      'font-weight': String(node.fontWeight),
      'line-height':
         node.textAlignVertical === 'CENTER'
            ? node.height + 'px'
            : lineHeightStyle,
      'text-align': node.textAlignHorizontal.toLowerCase(),
      'vertical-align':
         node.textAlignVertical === 'CENTER'
            ? 'middle'
            : node.textAlignVertical.toLowerCase(),
      color: getFillSolidColor(node.fills),
      display: 'inline-block',
      'text-overflow': node.textAutoResize === 'TRUNCATE' ? 'ellipsis' : 'clip',
      'white-space': node.textAutoResize === 'TRUNCATE' ? 'nowrap' : 'normal',
      overflow: node.textAutoResize === 'TRUNCATE' ? 'hidden' : 'visible',
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      textContent,
   }
}
