import { getRotationCSS } from '../css-converts/getRotationCSS'
import { CSSStyle, NodeInfo, NodeTree } from '../type'
import { findSolidPaint } from '../utils/findSolidPaint'
import { getFillSolidColor } from '../utils/getFillSolidColor'

export const createTextNode = async (
   node: TextNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
): Promise<NodeTree> => {
   let lineHeightStyle
   const lineHeight = node.lineHeight as LineHeight
   if (lineHeight.unit === 'PIXELS') {
      lineHeightStyle = String(lineHeight.value) + 'px'
   } else if (lineHeight.unit === 'PERCENT') {
      lineHeightStyle = String(lineHeight.value / 100)
   } else if (lineHeight.unit === 'AUTO') {
      lineHeightStyle = 'normal'
   }

   let letterSpacingStyle = {}
   const letterSpacing = node.letterSpacing as LetterSpacing
   if (letterSpacing.unit === 'PIXELS') {
      letterSpacingStyle = {
         'letter-spacing': String(letterSpacing.value) + 'px',
      }
   } else if (letterSpacing.unit === 'PERCENT') {
      // 在 CSS 中，字母间距的百分比是相对于字体大小的，所以我们需要将其转换为像素
      letterSpacingStyle = {
         'letter-spacing':
            String((letterSpacing.value / 100) * Number(node.fontSize)) + 'px',
      }
   }

   let tag = 'span'
   let textContent = node.characters

   const solidFill = findSolidPaint(node.fills)

   let style = {
      ...baseStyle,
      ...letterSpacingStyle,
      ...getRotationCSS(node),

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
      color: solidFill ? getFillSolidColor(solidFill) : undefined,
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
