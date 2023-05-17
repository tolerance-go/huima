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
      //NOTE - 如果 figma 中设置了文本垂直居中，那么转换成 css 的时候，需要将 line-height 设置成和 height 一样，这样才能达到一样效果
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
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      textContent,
   }
}
